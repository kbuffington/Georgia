window.DefinePanel('Georgia', {author: 'Mordred', version: '2.0.0', features: {drag_n_drop: true} });

const basePath = fb.ProfilePath + '\\georgia\\';

function includeFiles(fileList) {
    fileList.forEach(filePath => include(basePath + filePath));
}

includeFiles([
    'js\\CaTRoX_QWR\\lodash.min.js',
    'js\\configuration.js',   // reads/write from config file. The actual configuration values are specified in globals.js
    'js\\helpers.js',
    'js\\CaTRoX_QWR\\Common.js',
    'js\\globals.js',   // if we stop using PanelProperties can move this above Common.js
    'js\\CaTRoX_QWR\\Utility_LinkedList.js',
    'js\\CaTRoX_QWR\\Control_ContextMenu.js',
    'js\\CaTRoX_QWR\\Control_Scrollbar.js',
    'js\\CaTRoX_QWR\\Control_List.js',
    'js\\CaTRoX_QWR\\Panel_Playlist.js',
    'js\\CaTRoX_QWR\\Panel_Library.js',
    'js\\CaTRoX_QWR\\Control_Button.js',
    'js\\hyperlinks.js',
    'js\\color.js',
    'js\\themes.js',
    'js\\volume.js',
    'js\\image-caching.js',
    'js\\ui-components.js',
    'js\\lyrics.js',
    'js\\timeline.js',
    'js\\georgia-main.js'
]);