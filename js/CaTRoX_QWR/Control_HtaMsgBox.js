// ==PREPROCESSOR==
// @name 'Hta Message Box Control'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

g_script_list.push('Control_HtaMsgBox.js');

var g_hta_window = {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {string} title
     * @param {string} content
     * @param {string} features
     * @return {*}
     */
    create : function(x, y, w, h, title, content, features) {
        var hta_wnd_id = 'a' + Math.floor(Math.random() * 10000000);
        var hta_code =
            '<script>moveTo(-1000,-1000);resizeTo(0,0);</script>' +
            '<hta:application id=app ' + features + ' />' +
            '<object id="' + hta_wnd_id + '" style="display:none" classid="clsid:8856F961-340A-11D0-A96B-00C04FD705A2">' +
            '    <param name=RegisterAsBrowser value=1>' +
            '</object>';

        WshShell.Run('mshta.exe "about:' + hta_code.replace(/"/g, '\'') + '"');

        var windows = app.Windows();
        var wnd;
        // Dirty hack to simulate sleep
        var now = new Date().getTime();
        while (!wnd && new Date().getTime() < now + 1000) {
            for (var i = windows.Count; --i >= 0;) {
                try {
                    if (windows.Item(i).id === hta_wnd_id) {
                        wnd = windows.Item(i).parent.parentWindow;
                    }
                }
                catch (e) {}
            }
        }
        if (!wnd) {
            fb.ShowPopupMessage('Failed to create HTA Dialog', 'Theme Error');
            return null;
        }

        wnd.document.open();
        wnd.Host = this;

        wnd.document.write([content,
            '<script language="JScript" id="a' + hta_wnd_id + '"\>' +
            '    eval; ' +
            '    document.title="' + title.replace(/"/g, '\'') + '";' +
            '    var width = ' + (w || (is_4k ? 400 : 200)) + ';' +
            '    var height = ' + (h || (is_4k ? 400 : 200)) + ';' +
            '    resizeTo(width, height);' +
            '    moveTo(' + (x || '(screen.width-width)/2') + ',' + (y || '(screen.height-height)/2') + ');' +
            '    document.getElementById("a' + hta_wnd_id + '").removeNode();' +
            '</script>'].join(''));

        return wnd;
    },

    manager : new function() {
        /**
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         * @param {string} title
         * @param {string} content
         * @param {string} features
         * @return {*}
         */
        this.open = function (x, y, w, h, title, content, features) {
            if (wnd) {
                wnd.focus();
                return null;
            }

            on_top = fb.AlwaysOnTop;
            if (fb.AlwaysOnTop) {
                fb.AlwaysOnTop = false;
            }
            wnd = g_hta_window.create(x, y, w, h, title, content, features);

            return wnd;
        };

        this.close = function () {
            if (wnd) {
                wnd.close();
                wnd = null;
                if (fb.AlwaysOnTop !== on_top) {
                    fb.AlwaysOnTop = on_top;
                }
            }
        };

        /**
         * @param {?number=} [x=undefined]
         * @param {?number=} [y=undefined]
         * @param {?number=} [w=undefined]
         * @param {?number=} [h=undefined]
         */
        this.center = function (x,y,w,h) {
            if (!wnd) {
                return;
            }

            var new_x = 0;
            var new_y = 0;

            if (_.isNil(x) || _.isNil(y) || _.isNil(w) || _.isNil(h)) {
                new_x = Math.max(0, Math.ceil((wnd.screen.availWidth - wnd.document.documentElement.clientWidth)/2));
                new_y = Math.max(0, Math.ceil((wnd.screen.availHeight - wnd.document.documentElement.clientHeight)/2));
            }
            else {
                new_x = Math.max(0, Math.ceil(x + (w - wnd.document.documentElement.clientWidth)/2));
                new_y = Math.max(0, Math.ceil(y + (h - wnd.document.documentElement.clientHeight)/2));
            }

            wnd.moveTo(new_x, new_y);
        };

        var on_top;
        var wnd = null;
    },

    default_features : '',
    styles : {}
};

g_hta_window.default_features =
    'singleinstance=yes ' +
    'border=dialog ' +
    'minimizeButton=no ' +
    'maximizeButton=no ' +
    'scroll=no ' +
    'showintaskbar=yes ' +
    'contextMenu=yes ' +
    'selection=no ' +
    'innerBorder=no';
if (_.isFile(fb.FoobarPath + '\\foobar2000.exe')) {
    g_hta_window.default_features += ' ';
    g_hta_window.default_features += 'icon="' + fb.FoobarPath + '\\foobar2000.exe"';
}

g_hta_window.styles.body = 'body { color: WindowText; background-color: Menu; }';

g_hta_window.styles.input =
    'input { font:caption; border: 1px solid #7A7A7A; width: 100%; }' +
    'input:focus { outline: none !important; border:1px solid #0078D7; }' +
    'input:hover:focus { outline: none !important; border:1px solid #0078D7; }' +
    'input:hover { outline: none !important; border:1px solid #000000; }';

g_hta_window.styles.label = 'label { font:caption; }';

g_hta_window.styles.button =
    'button { font:caption; background: #E1E1E1; color:ButtonText; border: 1px solid #ADADAD; margin: 5px; padding: 3px; width: 70px; }';

if ( qwr_utils.get_windows_version() === '6.1' ) {
    // Workaround for weird borders on focused buttons in Windows 7
    g_hta_window.styles.button +=
        'button:focus { border: 1px solid #0078D7; padding: 3px; }' +
        'button:hover { background: #e5f1fb; border: 1px solid #0078D7; padding: 3px; }' +
        'button:focus:hover { background: #e5f1fb; border:1px solid #0078D7; padding: 3px; }';
}
else {
    g_hta_window.styles.button +=
        'button:focus { outline: none !important; border:2px solid #0078D7; padding: 2px; }' +
        'button:hover { background: #e5f1fb; outline: none !important; border:1px solid #0078D7; padding: 3px; }' +
        'button:focus:hover { background: #e5f1fb; outline: none !important; border:2px solid #0078D7; padding: 2px; }';
}

g_hta_window.styles.button +=
    'button[disabled] { background: #CCCCCC; color:#EBEBE4; }' +
    // Suppress button:hover manually, since not() is not working =(
    'button[disabled]:hover { border: 1px solid #ADADAD; padding: 3px; }';

/**
 * @param {?number} x
 * @param {?number} y
 * @param {Array<string>} prompt
 * @param {string} title
 * @param {Array<string>} defval
 * @param {function} on_finish_fn
 * @return {boolean}
 */
g_hta_window.msg_box_multiple = function(x,y,prompt,title,defval,on_finish_fn) {
    if (prompt.length !== defval.length) {
        throw new ArgumentError('Prompts and default values', prompt.length + ' and ' + defval.length, 'Array sizes must be equal');
    }

    var val_count = prompt.length;
    var input_text = '';

    for (var i = 0; i < val_count; ++i) {
        input_text +=
            '<div class="input_line">' +
            '   <label id="label_' + i + '">' + prompt[i] + '</label>' +
            '   <span>' +
            '       <input id="input_val_' + i + '" type="text" value="' +  defval[i] + '"/>' +
            '   </span>' +
            '</div>';
    }

    var content =
        '<html>' +
        '   <head>' +
        '   <meta http-equiv="x-ua-compatible" content="IE=9"/>' +
        '   <style type="text/css">' +
        g_hta_window.styles.body +
        g_hta_window.styles.label +
        g_hta_window.styles.input +
        g_hta_window.styles.button +
        '       div { overflow: hidden; }' +
        '       span { display: block; overflow: hidden; padding-right:10px; }' +
        '       label { float:left; width: 50px; text-align: right; padding-right:7px; padding-top: 2px; white-space: nowrap; }' +
        '       button { float: right; }' +
        '       .input_line { padding-bottom:7px; }' +
        '   </style>' +
        '</head>' +
        '   <body>' +
        '       <div>' +
        input_text +
        '           <button id="hta_cancel">Cancel</button>' +
        '           <button id="hta_ok">OK</button>' +
        '       </div>' +
        '   </body>' +
        '</html>';

    var window_h = 29 * val_count + 83;
    if (is_4k) window_h *= 2;
    var wnd = g_hta_window.manager.open(x, y, is_4k ? 740 : 370, window_h, title, content, g_hta_window.default_features);
    if (!wnd) {
        return false;
    }

    var labels = [];
    var label_max_width = 0;
    for (var i = 0; i < val_count; ++i) {
        var cur_label = wnd['label_' + i];
        labels.push(cur_label);
        label_max_width = Math.max(label_max_width, cur_label.scrollWidth);
    }

    labels.forEach(function(item){
        item.style.width = label_max_width + 'px';
    });

    wnd.document.body.onbeforeunload = function () {
        g_hta_window.manager.close();
    };

    wnd.hta_cancel.onclick = function () {
        g_hta_window.manager.close();
    };

    wnd.hta_ok.onclick = function () {
        var vals = [];
        for (var i = 0; i < val_count; ++i) {
            vals.push(wnd['input_val_' + i].value);
        }

        g_hta_window.manager.close();
        on_finish_fn(vals);
    };

    wnd.document.body.focus();
    wnd.hta_ok.focus();

    return true;
};

g_callbacks.register('on_script_unload', function(){g_hta_window.manager.close();});
