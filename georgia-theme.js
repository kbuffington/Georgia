window.DefinePanel('Georgia', {author: 'Mordred', version: '2.0.0', features: {drag_n_drop: true} });

const basePath = fb.ProfilePath + 'georgia\\';

function loadAsyncFile(filePath) {
    return new Promise(resolve => {
        setTimeout(() => {
            include(filePath);
            resolve();
        }, 1);
    })
}

const loadAsync = window.GetProperty('Load Theme Asynchronously', true);
async function includeFiles(fileList) {
    if (loadAsync) {
        for (let i = 0; i < fileList.length; i++) {
            await loadAsyncFile(basePath + fileList[i]);
        }
    } else {
        fileList.forEach(filePath => include(basePath + filePath));
    }
}

const startTime = new Date().getTime();
includeFiles([
    'js\\CaTRoX_QWR\\lodash.min.js',
    'js\\configuration.js',   // reads/write from config file. The actual configuration values are specified in globals.js
    'js\\helpers.js',
    'js\\CaTRoX_QWR\\Common.js',
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
]).then(() => {
    console.log(`Georgia loaded in ${new Date().getTime() - startTime}ms`);

    if (pref.checkForUpdates) {
        scheduleUpdateCheck(0);
    }
});
