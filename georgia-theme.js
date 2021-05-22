const panelVersion = window.GetProperty('_theme_version (do not hand edit!)', '2.0.3');
window.DefineScript('Georgia', {author: 'Mordred', version: panelVersion, features: {drag_n_drop: true} });

const basePath = fb.ProfilePath + 'georgia\\';

function loadAsyncFile(filePath) {
    return new Promise(resolve => {
        setTimeout(() => {
            include(filePath);
            resolve();
        }, 0);
    })
}

const loadAsync = window.GetProperty('Load Theme Asynchronously', true);
async function includeFiles(fileList) {
    if (loadAsync) {
        let startTime = Date.now();
        const refreshTime = 16; // ~60Hz
        for (let i = 0; i < fileList.length; i++) {
            loadStrs.fileName = fileList[i] + ' ...';
            loadStrs.fileIndex = i;
            const currentTime = Date.now();
            if (currentTime - startTime > refreshTime) {
                startTime = currentTime;
                window.Repaint();
            }
            await loadAsyncFile(basePath + fileList[i]);
        }
    } else {
        fileList.forEach(filePath => include(filePath));
    }
}

const loadStrs = {
    loading: 'Loading:',
    fileName: '',
    fileIndex: 0,
};
const startTime = Date.now();
const fileList = [
    // 'js\\CaTRoX_QWR\\lodash.min.js',
    'js\\CaTRoX_QWR\\lodash-new.js',
    'js\\configuration.js',   // reads/write from config file. The actual configuration values are specified in globals.js
    'js\\helpers.js',
    'js\\CaTRoX_QWR\\Common.js',
    'js\\defaults.js',  // used in settings.js
    'js\\hyperlinks.js',    // used in settings.js
    'js\\settings.js',   // must be below hyperlinks.js and Common.js
    'js\\CaTRoX_QWR\\Utility_LinkedList.js',
    'js\\CaTRoX_QWR\\Control_ContextMenu.js',
    'js\\CaTRoX_QWR\\Control_Scrollbar.js',
    'js\\CaTRoX_QWR\\Control_List.js',
    'js\\CaTRoX_QWR\\Panel_Playlist.js',
    'js\\CaTRoX_QWR\\Panel_Library.js',
    'js\\CaTRoX_QWR\\Control_Button.js',
    'js\\color.js',
    'js\\themes.js',
    'js\\volume.js',
    'js\\image-caching.js',
    'js\\ui-components.js',
    'js\\lyrics.js',
    'js\\georgia-main.js'
];
includeFiles(fileList).then(() => {
    console.log(`Georgia loaded in ${Date.now() - startTime}ms`);

    if (pref.checkForUpdates) {
        scheduleUpdateCheck(0);
    }
});

// this function will be overridden once the theme loads
function on_paint(gr) {
    const RGB = (r, g, b) => { return (0xff000000 | (r << 16) | (g << 8) | (b)); }
    const scaleForDisplay = (number) => { return is_4k ? number * 2 : number };
    const darkMode = window.GetProperty('Use Dark Theme', true);
    const col = {};

    if (darkMode) {
        col.bg = RGB(50, 54, 57);
        col.menu_bg = RGB(23, 23, 23);
        col.now_playing = RGB(255, 255, 255);
        col.progressFill = RGB(255,255,255);
	} else {
		col.bg = RGB(185, 185, 185);
        col.menu_bg = RGB(54, 54, 54);
        col.now_playing = RGB(0, 0, 0);
        col.progressFill = RGB(0, 0, 40);
    }
    const use_4k = window.GetProperty('Detect 4k', 'auto');
    const ww = window.Width;
    const wh = window.Height;

    if (use_4k === 'always') {
        is_4k = true;
    } else if (use_4k === 'auto' && (ww > 3000 || wh > 1400)) {
        is_4k = true;
    } else {
        is_4k = false;
    }
    gr.SetSmoothingMode(3);
    const menuHeight = scaleForDisplay(160);
    gr.FillSolidRect(0, menuHeight, ww, wh - menuHeight, col.bg);
    gr.FillSolidRect(0, 0, ww, menuHeight, col.menu_bg);

    const font = (name, size, style) => {
		var font;
		try {
			font = gdi.Font(name, Math.round(scaleForDisplay(size)), style);
		} catch (e) {
			console.log('Failed to load font >>>', name, size, style);
		}
		return font;
	}
    const fontLight = 'HelveticaNeueLT Pro 45 Lt';
    const fontBold = 'HelveticaNeueLT Pro 65 Md';
    const ft_lower = font(fontLight, 30, 0);
    const ft_lower_bold = font(fontBold, 30, 0);
    const lowerBarTop = wh - scaleForDisplay(80);
    const loadingWidth = Math.ceil(gr.MeasureString(loadStrs.loading, ft_lower, 0, 0, 0, 0).Width);
    const titleMeasurements = gr.MeasureString(loadStrs.fileName, ft_lower, 0, 0, 0, 0);
    const progressBar = {
        x: Math.round(0.025 * ww),
        y: Math.round(lowerBarTop + titleMeasurements.Height) + scaleForDisplay(8),
        w: Math.round(0.95 * ww),
        h: scaleForDisplay(12) + (ww > 1920 ? 2 : 0)
    }
    gr.DrawString(loadStrs.loading, ft_lower_bold, col.now_playing, progressBar.x, lowerBarTop, progressBar.w, titleMeasurements.Height);
	gr.DrawString(loadStrs.fileName, ft_lower, col.now_playing, progressBar.x + loadingWidth + scaleForDisplay(20), lowerBarTop, progressBar.w, titleMeasurements.Height);
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, col.menu_bg);
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, col.progressFill);
}
