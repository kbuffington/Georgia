// ==PREPROCESSOR==
// @name 'Hta Grouping Presets Manager'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

g_script_list.push('Control_HtaGroupPresetsMngr.js');

/**
 * @param {?number} x
 * @param {?number} y
 * @param {Array<GroupingHandler.Settings.Group>} group_presets
 * @param {string} cur_group_name
 * @param {string} default_group_name
 * @param {function} on_finish_fn
 * @return {boolean}
 */
g_hta_window.group_presets_mngr = function(x, y, group_presets, cur_group_name, default_group_name, on_finish_fn) {
    var group_data_list_copy = _.cloneDeep(group_presets);
    _.find(group_data_list_copy, function (item) { return item.name === default_group_name; }).is_default = true;

    var style =
        '<style type="text/css">' +
        '<meta http-equiv="x-ua-compatible" content="IE=9"/>' +
        g_hta_window.styles.body +
        g_hta_window.styles.label +
        g_hta_window.styles.input +
        g_hta_window.styles.button +
        '     div { overflow: hidden; }' +
        '     span { display:block; overflow: hidden; padding-right:10px; }' +
        '     input[type="checkbox"] { display: inline; position: relative; width: 15px; border: 0; padding: 2px 1px;}' +
        '     input[type="checkbox"]:focus { border:1px solid #0078D7; padding: 1px 0;}' +
        '     input[type="checkbox"]:hover:focus { border:1px solid #0078D7; padding: 1px 0;}' +
        '     input[type="checkbox"]:hover { border:1px solid #000000; padding: 1px 0;}' +
        '     select { font:caption; border: 1px solid #646464; vertical-align: top; width: 100%; }' +
        '     .label_for_checkbox { float:left; margin-top: 1px; width: 60px }' +
        '     .cnt { margin: 10px; }' +
        '     .select_cnt { float: left; width: 230px; }' +
        '     .select_cnt_list { width: 200px; float: left; }' +
        '     .select_cnt_btn { width: 30px; margin-top: 40px; margin-left: 200px; position: relative; }' +
        '     .input_cnt {  }' +
        '     .input_cnt_block { margin-left: 20px; margin-bottom: 10px; }' +
        '     .input_cnt_block_checkbox { margin-bottom: 2px; }' +
        '     .normal_button { width: 70px; float: right; }' +
        '     .select_button { width: 98px; float: left; margin: 2px;}' +
        '     .move_button { width:25px; height:35px; float: left; }' +
        '     .button_ok { position: absolute; right:168px; bottom:8px; }' +
        '     .button_cancel { position: absolute; right:88px; bottom:8px; }' +
        '     .button_apply { position: absolute; right:8px; bottom:8px; }' +
        '</style>';

    var content =
        '<html>' +
        '<head>' +
        '   <meta http-equiv="x-ua-compatible" content="IE=9"/>' +
        style +
        '</head>' +
        '<body>' +
        '     <div class="cnt">' +
        '          <div class="select_cnt">' +
        '               <div class="select_cnt_list">' +
        '                    <select id="input_select" size="20">' + '</select>' +
        '                    <button class="select_button" id="btn_new" style="margin-top: 5px; margin-left: 0;">New</button>' +
        '                    <button class="select_button" id="btn_update" style="margin-top: 5px; margin-right: 0;" disabled>Update</button>' +
        '                    <button class="select_button" id="btn_remove" style="margin-left: 0;">Remove</button>' +
        '                    <button class="select_button" id="btn_default" style="margin-right: 0;">Set as Default</button>' +
        '               </div>' +
        '               <div class="select_cnt_btn">' +
        '                    <button class="move_button" id="btn_up">&#9650</button>' +
        '                    <button class="move_button" id="btn_down">&#9660</button>' +
        '               </div>' +
        '          </div>' +
        '          <div class="input_cnt">' +
        '               <div class="input_cnt_block">' +
        '                    <label>Preset Name:</label>' +
        '                    <span>' +
        '                    <input id="input_preset_name"/>' +
        '                    </span>' +
        '               </div>' +
        '               <div class="input_cnt_block">' +
        '                    <label>Grouping Query:</label>' +
        '                    <span>' +
        '                    <input id="input_group_query"/>' +
        '                    </span>' +
        '               </div>' +
        '               <div class="input_cnt_block">' +
        '                    <label>Title Query:</label>' +
        '                    <span>' +
        '                    <input id="input_title_query"/>' +
        '                    </span>' +
        '               </div>' +
        '               <div class="input_cnt_block">' +
        '                    <label>Sub-title Query:</label>' +
        '                    <span>' +
        '                    <input id="input_sub_title_query"/>' +
        '                    </span>' +
        '               </div>' +
        '               <div class="input_cnt_block">' +
        '                    <label>Description:</label>' +
        '                    <span>' +
        '                    <input id="input_description"/>' +
        '                    </span>' +
        '               </div>' +
        '               <div class="input_cnt_block input_cnt_block_checkbox">' +
        '                    <label class="label_for_checkbox">Show Date:</label>' +
        '                    <span>' +
        '                    <input id="input_show_date" type="checkbox"/>' +
        '                    </span>' +
        '               </div>' +
        '               <div class="input_cnt_block input_cnt_block_checkbox">' +
        '                    <label class="label_for_checkbox">Show CD#:</label>' +
        '                    <span>' +
        '                    <input id="input_show_cd" type="checkbox"/>' +
        '                    </span>' +
        '               </div>' +
        '          </div>' +
        '     </div>' +
        '     <button class="normal_button button_ok" id="btn_ok">OK</button>' +
        '     <button class="normal_button button_cancel" id="btn_cancel">Cancel</button>' +
        '     <button class="normal_button button_apply" id="btn_apply" disabled>Apply</button>' +
        '</body>' +
        '</html>';

    var wnd = g_hta_window.manager.open(x, y, 650, 425, 'Foobar2000: Manage grouping presets', content, g_hta_window.default_features);
    if (!wnd) {
        return false;
    }

    function get_default_data(arr) {
        return _.find(arr, function (item) { return item.is_default; });
    }

    function populate_select(selected_idx) {
        var select = wnd.input_select;
        select.options.length = 0;

        group_data_list_copy.forEach(function (item, i) {
            var option = wnd.document.createElement('option');
            option.setAttribute('value', item.name);

            var text = item.name;
            if (item.is_default) {
                text += ' [default]'
            }
            option.appendChild(wnd.document.createTextNode(text));

            select.appendChild(option);
        });
        if (!_.isNil(selected_idx)) {
            select.selectedIndex = selected_idx;
        }
    }

    function populate_data() {
        var select = wnd.input_select;
        var cur_data = group_data_list_copy[select.selectedIndex];
        wnd.input_preset_name.value = cur_data.name;
        wnd.input_group_query.value = cur_data.group_query;
        wnd.input_title_query.value = cur_data.title_query;
        wnd.input_sub_title_query.value = cur_data.sub_title_query;
        wnd.input_description.value = cur_data.description;
        wnd.input_show_cd.checked = cur_data.show_cd;
        wnd.input_show_date.checked = cur_data.show_date;
    }

    function update_buttons_on_populate() {
        if (group_data_list_copy[wnd.input_select.selectedIndex].is_default) {
            wnd.btn_default.setAttribute('disabled');
        }
        else {
            wnd.btn_default.removeAttribute('disabled');
        }
    }

    function move_array_element(array, from, to) {
        array.splice(to, 0, array.splice(from, 1)[0]);
    }

    function prepare_output_data(arr) {
        var output_copy = _.cloneDeep(arr);
        var default_name = get_default_data(output_copy).name;
        var selected_name = output_copy[wnd.input_select.selectedIndex].name;
        output_copy.forEach(function (item) {
            delete item.is_default;
        });

        return [output_copy, selected_name, default_name];
    }

    function on_input_change() {
        wnd.btn_apply.removeAttribute('disabled');
        wnd.btn_update.removeAttribute('disabled');
    }

    function on_input_key_down() {
        if (wnd.event.keyCode === VK_BACKSPACE || wnd.event.keyCode === VK_DELETE) {
            on_input_change();
        }
    }

    function make_unique_name(new_name) {
        var new_name_idx = 2;
        while (_.find(group_data_list_copy, function (item) {return item.name === new_name + '(' + new_name_idx + ')';})) {
            ++new_name_idx;
        }
        return new_name + '(' + new_name_idx + ')';
    }

    wnd.input_select.onchange = function () {
        populate_data();
        update_buttons_on_populate();
    };

    var input_fields = [
        wnd.input_preset_name,
        wnd.input_group_query,
        wnd.input_title_query,
        wnd.input_sub_title_query,
        wnd.input_description,
        wnd.input_show_cd,
        wnd.input_show_date
    ];

    var input_box = [
        wnd.input_show_cd,
        wnd.input_show_date
    ];

    input_fields.forEach(function (item) {
        item.onchange = on_input_change;
        item.onkeypress = on_input_change;
        item.onkeydown = on_input_key_down;
        item.onpaste = on_input_change;
        item.oncut = on_input_change;
    });

    input_box.forEach(function (item) {
        item.onchange = on_input_change;
        item.onclick = on_input_change;
    });

    wnd.btn_default.onclick = function () {
        var select = wnd.input_select;
        get_default_data(group_data_list_copy).is_default = false;
        group_data_list_copy[select.selectedIndex].is_default = true;
        populate_select(select.selectedIndex);

        wnd.btn_default.setAttribute('disabled');
        wnd.btn_apply.removeAttribute('disabled');
    };

    wnd.btn_remove.onclick = function () {
        var select = wnd.input_select;

        if (select.options.length <= 1) {
            return;
        }

        var was_default = group_data_list_copy[select.selectedIndex].is_default;
        group_data_list_copy.splice(select.selectedIndex, 1);
        if (was_default) {
            group_data_list_copy[0].is_default = true;
        }

        populate_select(Math.max(0, select.selectedIndex - 1));
        populate_data();
        update_buttons_on_populate();

        wnd.btn_apply.removeAttribute('disabled');
    };

    wnd.btn_new.onclick = function () {
        var select = wnd.input_select;

        var new_data = _.cloneDeep(group_data_list_copy[select.selectedIndex]);
        new_data.is_default = false;

        new_data.name = make_unique_name(new_data.name);

        group_data_list_copy.push(new_data);

        populate_select(group_data_list_copy.length - 1);
        populate_data();
        update_buttons_on_populate();

        wnd.btn_apply.removeAttribute('disabled');
    };

    wnd.btn_update.onclick = function () {
        if (wnd.btn_update.hasAttribute('disabled')) {
            return;
        }

        var cur_data = group_data_list_copy[wnd.input_select.selectedIndex];

        var new_name = wnd.input_preset_name.value;
        if (cur_data.name !== new_name && _.find(group_data_list_copy, function (item) {return item.name === new_name;})) {
            // Hide old name from unique name generation
            cur_data.name = new_name;

            new_name = make_unique_name(new_name);
            wnd.input_preset_name.value = new_name;
        }

        cur_data.name = new_name;
        cur_data.group_query = wnd.input_group_query.value;
        cur_data.title_query = wnd.input_title_query.value;
        cur_data.sub_title_query = wnd.input_sub_title_query.value;
        cur_data.description = wnd.input_description.value;
        cur_data.show_cd = wnd.input_show_cd.checked;
        cur_data.show_date = wnd.input_show_date.checked;

        populate_select(wnd.input_select.selectedIndex);

        wnd.btn_update.setAttribute('disabled');
    };

    wnd.btn_up.onclick = function () {
        var selected_idx = wnd.input_select.selectedIndex;
        if (!selected_idx) {
            return;
        }

        move_array_element(group_data_list_copy, selected_idx, selected_idx - 1);

        populate_select(selected_idx - 1);

        wnd.btn_apply.removeAttribute('disabled');
    };

    wnd.btn_down.onclick = function () {
        var selected_idx = wnd.input_select.selectedIndex;
        if (selected_idx === wnd.input_select.options.length) {
            return;
        }

        move_array_element(group_data_list_copy, selected_idx, selected_idx + 1);

        populate_select(selected_idx + 1);

        wnd.btn_apply.removeAttribute('disabled');
    };

    wnd.document.body.onbeforeunload = function () {
        g_hta_window.manager.close();
    };

    wnd.btn_cancel.onclick = function () {
        g_hta_window.manager.close();
    };

    wnd.btn_apply.onclick = function () {
        if (wnd.btn_apply.hasAttribute('disabled')) {
            return;
        }

        wnd.btn_update.onclick();

        on_finish_fn(prepare_output_data(group_data_list_copy));

        wnd.btn_apply.setAttribute('disabled');
    };

    wnd.btn_ok.onclick = function () {
        if (wnd.btn_apply.hasAttribute('disabled')) {
            g_hta_window.manager.close();
            return;
        }

        wnd.btn_update.onclick();

        var output_data = prepare_output_data(group_data_list_copy);

        g_hta_window.manager.close();
        on_finish_fn(output_data);
    };

    populate_select(_.findIndex(group_data_list_copy, function (item) { return item.name === cur_group_name; }));
    populate_data();
    update_buttons_on_populate();

    wnd.document.body.focus();
    wnd.btn_ok.focus();

    return true;
};
