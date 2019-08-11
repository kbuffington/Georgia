// ==PREPROCESSOR==
// @name 'Hta Popup Message With Check Box Control'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

g_script_list.push('Control_HtaPopupWithCheckBox.js');

/**
 * @param {?number} x
 * @param {?number} y
 * @param {string} title
 * @param {string} info_text
 * @param {string} checkbox_text
 * @param {boolean} is_checked
 * @param {function} on_finish_fn
 * @return {boolean}
 */
g_hta_window.popup_with_checkbox = function(x, y, title, info_text, checkbox_text, is_checked, on_finish_fn) {
    var style =
        '<style type="text/css">' +
        '<meta http-equiv="x-ua-compatible" content="IE=9"/>' +
        g_hta_window.styles.body +
        g_hta_window.styles.label +
        g_hta_window.styles.input +
        g_hta_window.styles.button +
        '     div { overflow: hidden; }' +
        '     span { display:block; overflow: hidden; padding-right:10px; }' +
        '     input[type="checkbox"] { float:left; display: inline; position: relative; width: 15px; border: 0; padding: 2px 1px; }' +
        '     input[type="checkbox"]:focus { border:1px solid #0078D7; padding: 1px 0; }' +
        '     input[type="checkbox"]:hover:focus { border:1px solid #0078D7; padding: 1px 0; }' +
        '     input[type="checkbox"]:hover { border:1px solid #000000; padding: 1px 0; }' +
        '     .label_for_checkbox { float:left; padding-top: 1px; }' +
        '     .input_checkbox { position: relative; top: -1px; margin-right: 1px; } ' +
        '     .cnt { font:caption; margin: 10px; word-wrap: break-word; white-space: pre-wrap; }' +
        '     .input_cnt_block { position: absolute; left: 14px; bottom: 15px; }' +
        '     .button_ok { width: 70px; position: absolute; right: 8px; bottom: 8px; }' +
        '</style>';

    var content =
        '<html>' +
        '<head>' +
        '   <meta http-equiv="x-ua-compatible" content="IE=9"/>' +
        style +
        '</head>' +
        '<body>' +
        '     <div id="div_text" class="cnt">' + info_text + '</div>' +
        '               <div class="input_cnt_block">' +
        '                    <label class="label_for_checkbox">' +
        '                         <input id="input_checkbox" class="input_checkbox" type="checkbox"/>' +
        checkbox_text +
        '                    </label>' +
        '               </div>' +
        '     <button class="button_ok" id="btn_ok">OK</button>' +
        '</body>' +
        '</html>';

    var wnd_w = is_4k ? 716 : 358;
    var wnd_h = is_4k ? 850 : 425;
    var wnd = g_hta_window.manager.open(x, y, wnd_w, wnd_h, 'Foobar2000: ' + title, content, g_hta_window.default_features);
    if (!wnd) {
        return false;
    }

    wnd_h = 83 + wnd.div_text.offsetHeight + wnd.btn_ok.offsetHeight;
    if (wnd_w < wnd_h + 50) {
        wnd_w += 50;

        wnd.resizeTo(wnd_w, wnd_h);
        wnd_h = 83 + wnd.div_text.offsetHeight + wnd.btn_ok.offsetHeight;
    }
    wnd.resizeTo(wnd_w, wnd_h);

    wnd.input_checkbox.checked = is_checked;

    wnd.document.body.onbeforeunload = function () {
        g_hta_window.manager.close();
    };

    wnd.btn_ok.onclick = function () {
        g_hta_window.manager.close();
        on_finish_fn(wnd.input_checkbox.checked);
    };

    wnd.document.body.focus();
    wnd.btn_ok.focus();

    return true;
};
