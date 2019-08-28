// ==PREPROCESSOR==
// @name 'Info Panel'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

var trace_call = false;
var trace_on_paint = false;
var trace_on_move = false;


g_script_list.push('Panel_Info.js');

g_properties.add_properties(
    {
        show_metadata: ['user.list.show_metadata', true],
        show_fileinfo: ['user.list.show_fileinfo', true],

        alternate_row_color: ['user.row.alternate_color', false],

        track_mode: ['user.track_mode', 3],

        first_launch: ['system.script_first_launch', true]
    }
);

var g_has_modded_jscript = qwr_utils.has_modded_jscript();

// Fixup properties
(function() {
    g_properties.track_mode = Math.max(1, Math.min(3, g_properties.track_mode));

    if (g_properties.first_launch) {
        g_properties.scrollbar_top_pad = 0;
        g_properties.list_left_pad = 0;
        g_properties.list_top_pad = 0;
        g_properties.list_right_pad = 0;
        g_properties.list_bottom_pad = 15;

        g_properties.first_launch = false;
    }
})();

var g_tr_i_fonts = {
    info_name:  gdi.font('Segoe Ui Semibold', 12),
    info_value: gdi.font('Segoe Ui', 12)
};

var g_tr_i_colors = {
    background:       g_theme.colors.panel_back,
    row_alternate:    _.RGB(35, 35, 35),
    row_pressed:      g_theme.colors.panel_line_selected,
    row_pressed_rect: _.RGB(80, 80, 80),
    line_color:       g_theme.colors.panel_line,
    info_name:        _.RGB(160, 162, 164),
    info_value:       g_theme.colors.panel_text_normal
};

var mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
var key_down_suppress = new qwr_utils.KeyModifiersSuppress();


function on_paint(gr) {
    trace_call && trace_on_paint && console.log(qwr_utils.function_name());
    track_info.on_paint(gr);
}

function on_size() {
    trace_call && console.log(qwr_utils.function_name());

    var ww = window.Width;
    var wh = window.Height;

    if (ww <= 0 || wh <= 0) {
        // on_paint won't be called with such dimensions anyway
        return;
    }

    track_info.on_size(ww, wh);
}

function on_mouse_move(x, y, m) {
    trace_call && trace_on_move && console.log(qwr_utils.function_name());

    if (mouse_move_suppress.is_supressed(x,y,m)) {
        return;
    }

    qwr_utils.DisableSizing(m);

    track_info.on_mouse_move(x, y, m);
}

function on_mouse_lbtn_down(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_mouse_lbtn_down(x, y, m);
}

function on_mouse_lbtn_dblclk(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_mouse_lbtn_dblclk(x, y, m);
}

function on_mouse_lbtn_up(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());

    track_info.on_mouse_lbtn_up(x, y, m);

    qwr_utils.EnableSizing(m);
}

function on_mouse_rbtn_down(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_mouse_rbtn_down(x, y, m);
}

function on_mouse_rbtn_up(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    return track_info.on_mouse_rbtn_up(x, y, m);
}

function on_mouse_wheel(delta) {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_mouse_wheel(delta);
}

function on_mouse_leave() {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_mouse_leave();
}

function on_key_down(vkey) {
    trace_call && console.log(qwr_utils.function_name());

    /*
    if (key_down_suppress.is_supressed(vkey)) {
        return;
    }

    track_info.on_key_down(vkey);
    */
}

function on_key_up(vkey) {
    trace_call && console.log(qwr_utils.function_name());
    //track_info.on_key_up(vkey);
}

function on_item_focus_change(playlist_arg, from, to) {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_item_focus_change(playlist_arg, from, to);
}

function on_playlist_switch() {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_playlist_switch();
}

function on_playback_new_track(metadb) {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_playback_new_track(metadb);
}

function on_playback_stop(reason) {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_playback_stop(reason);
}

function on_playback_dynamic_info_track() {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_playback_dynamic_info_track();
}

function on_metadb_changed(handles, fromhook) {
    trace_call && console.log(qwr_utils.function_name());
    track_info.on_metadb_changed(handles, fromhook);
}

/**
 * @constructor
 * @extends {List}
 */
function TrackInfoList() {
    List.call(this, 0, 0, 0, 0, new List.RowContent());

    // public:

    /// callbacks
    this.on_paint = function (gr) {
        gr.FillSolidRect(this.x, this.y, this.w, this.h, g_tr_i_colors.background);
        gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

        if (this.items_to_draw.length) {
            _.forEachRight(this.items_to_draw, _.bind(function (item, i) {
                item.draw(gr);
                if (!g_properties.alternate_row_color && i > 0 && i < this.items_to_draw.length) {
                    gr.DrawLine(item.x, item.y, item.x + item.w - 1, item.y, 1, g_tr_i_colors.line_color);
                }
            }, this));

            // Hide rows that shouldn't be visible
            gr.FillSolidRect(this.x, this.y, this.w, this.list_y - this.y, g_tr_i_colors.background);
            gr.FillSolidRect(this.x, this.list_y + this.list_h, this.w, (this.y + this.h) - (this.list_y + this.list_h), g_tr_i_colors.background);
        }
        else {
            var text;
            if (!cur_metadb) {
                text = 'Track Info';
            }
            else {
                text = 'No info to display';
            }

            var track_info_format = g_string_format.align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
            gr.DrawString(text, gdi.font('Segoe Ui Semibold', 24), _.RGB(70, 70, 70), this.x, this.y, this.w, this.h, track_info_format);
        }

        if (this.is_scrollbar_available) {
            if (!this.scrollbar.is_scrolled_up) {
                gr.FillGradRect(this.list_x, this.list_y - 1, this.list_w, 7 + 1, 270, _.RGBtoRGBA(g_theme.colors.panel_back, 0), _.RGBtoRGBA(g_theme.colors.panel_back, 200));
            }
            if (!this.scrollbar.is_scrolled_down) {
                gr.FillGradRect(this.list_x, this.list_y + this.list_h - 8, this.list_w, 7 + 1, 90, _.RGBtoRGBA(g_theme.colors.panel_back, 0), _.RGBtoRGBA(g_theme.colors.panel_back, 200));
            }
        }

        if (this.is_scrollbar_visible) {
            this.scrollbar.paint(gr);
        }
    };

    this.on_size = function (w, h) {
        List.prototype.on_size.apply(this, [w, h]);
        was_on_size_called = true;
    };

    this.on_mouse_move = function (x, y, m) {
        if (List.prototype.on_mouse_move.apply(this, [x, y, m])) {
            return;
        }
        if (!this.trace_list(x, y)) {
            clear_last_hover_item();
            return;
        }
        if (this.mouse_down) {
            return;
        }

        var item = this.get_item_under_mouse(x, y);
        if (item) {
            if (item !== last_hover_item) {
                last_hover_item = item;
                item.tt.showDelayed(item.get_value_text());
            }
        }
        else {
            clear_last_hover_item();
        }
    };

    this.on_mouse_lbtn_down = function (x, y, m) {
        clear_last_hover_item();

        if (List.prototype.on_mouse_lbtn_down.apply(this, [x, y, m])) {
            return;
        }

        var item = this.trace_list(x, y) ? this.get_item_under_mouse(x, y) : undefined;
        last_hover_item = item;

        if (item) {
            item.is_pressed = true;
            alpha_timer.start();
        }
    };

    this.on_mouse_lbtn_dblclk = function (x, y, m) {
        if (List.prototype.on_mouse_lbtn_dblclk.apply(this, [x, y, m])) {
            return;
        }

        var item = this.get_item_under_mouse(x, y);
        if (!item) {
            return;
        }

        if (!item.is_readonly) {
            item.edit_metadata();
            item.repaint();
        }
    };

    this.on_mouse_lbtn_up = function (x, y, m) {
        if (List.prototype.on_mouse_lbtn_up.apply(this, [x, y, m])) {
            return;
        }

        clear_last_hover_item();
        mouse_on_item = false;
    };

    this.on_mouse_rbtn_down = function (x, y, m) {
        this.mouse_down = true;
        clear_last_hover_item();

        var item = this.trace_list(x, y) ? this.get_item_under_mouse(x, y) : undefined;
        last_hover_item = item;

        if (item) {
            item.is_pressed = true;
            alpha_timer.start();
        }
    };

    this.on_mouse_rbtn_up = function (x, y, m) {
        var hover_item = last_hover_item;

        if (List.prototype.on_mouse_rbtn_up.apply(this, [x, y, m])) {
            clear_last_hover_item();
            return true;
        }

        clear_last_hover_item();

        var cmm = new Context.MainMenu();

        cmm.append_item(
            'Refresh info \tF5',
            _.bind(function () {
                this.initialize_list();
            }, this)
        );


        // -------------------------------------------------------------- //
        //---> Track info management

        cmm.append_separator();

        cmm.append_item(
            'Add',
            function () {
                request_new_tag(cur_metadb);
            }
        );

        if (hover_item) {
            cmm.append_separator();

            cmm.append_item(
                'Copy',
                function () {
                    _.setClipboardData(hover_item.get_value_text())
                }
            );

            cmm.append_item(
                'Edit',
                function () {
                    hover_item.edit_metadata();
                },
                {is_grayed_out: hover_item.is_readonly}
            );

            cmm.append_item(
                'Remove',
                _.bind(function () {
                    var handle = fb.CreateHandleList();
                    handle.Add(cur_metadb);

                    var meta_obj = {};
                    meta_obj[hover_item.get_tag_name()] = '';
                    handle.UpdateFileInfoFromJSON(JSON.stringify(meta_obj));

                    this.initialize_list();
                }, this),
                {is_grayed_out: hover_item.is_readonly}
            );
        }

        // -------------------------------------------------------------- //
        //---> Track Mode

        cmm.append_separator();

        var track = new Context.Menu('Displayed track');
        cmm.append(track);

        track.append_item(
            'Automatic (current selection/playing item)',
            _.bind(function () {
                g_properties.track_mode = track_modes.auto;
                this.initialize_list();
            }, this)
        );

        track.append_item(
            'Playing item',
            _.bind(function () {
                g_properties.track_mode = track_modes.playing;
                this.initialize_list();
            }, this)
        );

        track.append_item(
            'Current selection',
            _.bind(function () {
                g_properties.track_mode = track_modes.selected;
                this.initialize_list();
            }, this)
        );

        track.radio_check(0, g_properties.track_mode - 1);

        // -------------------------------------------------------------- //
        //---> Appearance

        cmm.append_separator();

        var appear = new Context.Menu('Appearance');
        cmm.append(appear);

        this.append_scrollbar_visibility_context_menu_to(appear);

        appear.append_item(
            'Alternate row color',
            _.bind(function () {
                g_properties.alternate_row_color = !g_properties.alternate_row_color;
                // To reinit row images
                this.initialize_list();
            }, this),
            {is_checked: g_properties.alternate_row_color}
        );

        appear.append_item(
            'Show metadata',
            _.bind(function () {
                g_properties.show_metadata = !g_properties.show_metadata;
                this.initialize_list();
            }, this),
            {is_checked: g_properties.show_metadata}
        );

        appear.append_item(
            'Show file info',
            _.bind(function () {
                g_properties.show_fileinfo = !g_properties.show_fileinfo;
                this.initialize_list();
            }, this),
            {is_checked: g_properties.show_fileinfo}
        );

        // -------------------------------------------------------------- //
        //---> System

        if (utils.IsKeyPressed(VK_SHIFT)) {
            qwr_utils.append_default_context_menu_to(cmm);
        }

        cmm.execute(x, y);

        cmm.dispose();

        this.repaint();
        return true;
    };

    this.on_mouse_wheel = function (delta) {
        List.prototype.on_mouse_wheel.apply(this, [delta]);
        clear_last_hover_item();
    };

    this.on_mouse_leave = function () {
        List.prototype.on_mouse_leave.apply(this);
        clear_last_hover_item();
    };

    this.on_item_focus_change = function (playlist_idx, from_idx, to_idx) {
        if (!fb.IsPlaying || g_properties.track_mode === track_modes.selected) {
            this.initialize_list();
            this.repaint();
        }
    };

    this.on_playlist_switch = function () {
        if (!fb.IsPlaying || g_properties.track_mode === track_modes.selected) {
            this.initialize_list();
            this.repaint();
        }
    };

    this.on_playback_new_track = function (metadb) {
        if (g_properties.track_mode !== track_modes.selected) {
            this.initialize_list();
            this.repaint();
        }
    };

    this.on_playback_stop = function (reason) {
        if (reason !== 2 && g_properties.track_mode !== track_modes.selected) {
            this.initialize_list();
            this.repaint();
        }
    };

    this.on_playback_dynamic_info_track = function () {
        this.initialize_list();
        this.repaint();
    };

    this.on_metadb_changed = function (handles, fromhook) {
        if (!cur_metadb || handles.Find(cur_metadb) !== -1) {
            this.initialize_list();
            this.repaint();
        }
    };

    /// EOF callbacks

    // This method does not contain any redraw calls - it's purely back-end
    this.initialize_list = function () {
        trace_call && console.log('initialize_list');

        if (this.cnt.rows.length) {
            alpha_timer.stop();
            this.cnt.rows.forEach(function (row) {
                row.dispose();
            })
        }

        this.cnt.rows = [];
        this.scroll_pos = 0;

        cur_metadb = get_current_metadb();
        if (cur_metadb) {
            var is_radio = _.startsWith(cur_metadb.RawPath, 'http');

            var fileInfo = cur_metadb.GetFileInfo();

            var tag_name;
            var value_text;

            if (g_properties.show_metadata) {
                for (var i = 0; i < fileInfo.MetaCount; i++) {
                    var is_readonly;

                    tag_name = fileInfo.MetaName(i);
                    if (tag_name === 'title' && fb.IsPlaying && is_radio) {
                        value_text = _.tfe('%title%');
                        is_readonly = true;
                    }
                    else {
                        value_text = fileInfo.MetaValue(i, 0);
                        is_readonly = is_radio;
                    }

                    this.cnt.rows.push(new Row(this.list_x, 0, this.list_w, this.row_h, cur_metadb, tag_name, value_text));
                    _.last(this.cnt.rows).is_odd = (i + 1) % 2;
                    _.last(this.cnt.rows).is_readonly = is_readonly;
                }
            }

            if (g_properties.show_fileinfo) {
                var cur_rows_count = this.cnt.rows.length;
                for (var i = 0; i < fileInfo.InfoCount; i++) {
                    tag_name = fileInfo.InfoName(i);
                    value_text = fileInfo.InfoValue(fileInfo.InfoFind(tag_name));

                    this.cnt.rows.push(new Row(this.list_x, 0, this.list_w, this.row_h, cur_metadb, tag_name, value_text));
                    _.last(this.cnt.rows).is_odd = ((cur_rows_count + i) + 1) % 2;
                    _.last(this.cnt.rows).is_readonly = true;
                }
            }

            alpha_timer = new _.alpha_timer(this.cnt.rows, function (row) {
                return row.is_pressed;
            });
        }
        
        if (was_on_size_called) {
            this.on_list_items_change();
        }
    };

    //private:

    function scroll_to_row(from_row, to_row) {
        if (!this.is_scrollbar_available) {
            return;
        }

        var from_item = from_row;
        var to_item = to_row;

        var to_item_state = get_item_visibility_state(to_item);


        var shifted_successfully = false;

        switch (to_item_state.visibility) {
            case visibility_state['none']: {
                if (from_item) {
                    var from_item_state = get_item_visibility_state(from_item);
                    if (from_item_state.visibility !== visibility_state['none']) {
                        var is_item_prev = from_item.type === to_item.type && from_item.idx - 1 === to_item.idx;

                        var is_item_next = from_item.type === to_item.type && from_item.idx + 1 === to_item.idx;

                        var row_shift = from_item_state.invisible_part + 1;
                        if (is_item_prev) {
                            this.scrollbar.scroll_to(this.scroll_pos - row_shift);
                            shifted_successfully = true;
                        }
                        else if (is_item_next) {
                            this.scrollbar.scroll_to(this.scroll_pos + row_shift);
                            shifted_successfully = true;
                        }
                    }
                }
                break;
            }
            case visibility_state['partial_top']: {
                if (to_item_state.invisible_part % 1 > 0) {
                    this.scrollbar.shift_line(-1);
                }
                this.scrollbar.scroll_to(this.scroll_pos - Math.floor(to_item_state.invisible_part));
                shifted_successfully = true;
                break;
            }
            case visibility_state['partial_bottom']: {
                if (to_item_state.invisible_part % 1 > 0) {
                    this.scrollbar.shift_line(1);
                }
                this.scrollbar.scroll_to(this.scroll_pos + Math.floor(to_item_state.invisible_part));
                shifted_successfully = true;
                break;
            }
            case visibility_state['full']: {
                shifted_successfully = true;
                break;
            }
            default: {
                throw new ArgumentError('visibility_state', to_item_state.visibility);
            }
        }

        if (!shifted_successfully) {
            var item_draw_idx = get_item_draw_row_idx(to_item);
            var new_scroll_pos = Math.max(0, item_draw_idx - Math.floor(this.rows_to_draw_precise / 2));
            this.scrollbar.scroll_to(new_scroll_pos);
        }
    }

    var visibility_state = {
        'none':           0,
        'partial_top':    1,
        'partial_bottom': 2,
        'full':           3
    };

    function get_item_visibility_state(item_to_check) {
        var item_state = {
            visibility:     visibility_state['none'],
            invisible_part: 1
        };

        _.forEach(this.items_to_draw, function (item) {
            if (item_to_check.type !== item.type) {
                return true;
            }

            if (item.idx === item_to_check.idx) {
                if (item.y < this.list_y && item.y + item.h > this.list_y) {
                    item_state.visibility = visibility_state['partial_top'];
                    item_state.invisible_part = (this.list_y - item.y) / this.row_h;
                }
                else if (item.y < this.list_y + this.list_h && item.y + item.h > this.list_y + this.list_h) {
                    item_state.visibility = visibility_state['partial_bottom'];
                    item_state.invisible_part = ((item.y + item.h) - (this.list_y + this.list_h)) / this.row_h;
                }
                else {
                    item_state.visibility = visibility_state['full'];
                    item_state.invisible_part = 0;
                }
                return false;
            }
        });

        return item_state;
    }

    // At worst has O(playlist_size) complexity
    function get_item_draw_row_idx(item) {
        var draw_row_idx = -1;
        var cur_row = 0;

        _.forEach(this.cnt.rows, function (row) {
            if (item.idx === row.idx) {
                draw_row_idx = cur_row;
                return false;
            }
            ++cur_row;
        });

        if (draw_row_idx === -1) {
            throw new LogicError('Could not find item in drawn item list');
        }

        return draw_row_idx;
    }

    function get_current_metadb() {
        var metadb = null;
        switch (g_properties.track_mode) {
            case track_modes.auto: {
                if (fb.IsPlaying) {
                    metadb = fb.GetNowPlaying();
                }
                else {
                    metadb = fb.GetFocusItem();
                }
                break;
            }
            case track_modes.selected: {
                metadb = fb.GetFocusItem();
                break;
            }
            case track_modes.playing: {
                if (fb.IsPlaying) {
                    metadb = fb.GetNowPlaying();
                }
                break;
            }
        }

        return metadb;
    }

    function clear_last_hover_item() {
        if (!last_hover_item) {
            return
        }

        last_hover_item.tt.clear();
        if (last_hover_item.is_pressed) {
            last_hover_item.is_pressed = false;
            alpha_timer.start();
        }

        last_hover_item = null;
    }

    function request_new_tag(metadb) {
        var on_ok_fn = function (ret_val) {
            if (!ret_val[0] || !ret_val[1]) {
                return;
            }

            var handle = fb.CreateHandleList();
            handle.Add(cur_metadb);

            var meta_obj = {};
            meta_obj[ret_val[0]] = ret_val[1];
            handle.UpdateFileInfoFromJSON(JSON.stringify(meta_obj));

            if (cur_metadb === metadb) {
                that.initialize_list();
            }
        };

        g_hta_window.msg_box_multiple(-10000, -10000, ['Tag Name', 'Value'], 'Foobar2000: Add new metadata tag', ['', ''], on_ok_fn);

        var fb_handle = g_has_modded_jscript ? qwr_utils.get_fb2k_window() : undefined;
        if (fb_handle) {
            g_hta_window.manager.center(fb_handle.Left, fb_handle.Top, fb_handle.Width, fb_handle.Height);
        }
        else {
            g_hta_window.manager.center();
        }
    }

    // private:
    var that = this;

    /** @enum {number} */
    var track_modes =
        {
            auto:     1,
            playing:  2,
            selected: 3
        };

    // Window state
    var was_on_size_called = false;

    // Playback state
    var cur_metadb = undefined;

    // Mouse and key state
    var mouse_on_item = false;

    // Item events
    var last_hover_item = undefined;

    var alpha_timer = null;

    this.initialize_list();
}

TrackInfoList.prototype = Object.create(List.prototype);
TrackInfoList.prototype.constructor = TrackInfoList;

/**
 * @constructor
 * @extends {List.Item}
 */
function Row(x, y, w, h, metadb_arg, tag_name_arg, value_text_arg) {
    List.Item.call(this, x, y, w, h);

    //public:
    this.draw = function (gr) {
        if (!this.is_pressed && !this.hover_alpha) {
            if (row_normal_image) {
                row_normal_image.Dispose();
                row_normal_image = null;
            }
            if (row_pressed_image) {
                row_pressed_image.Dispose();
                row_pressed_image = null;
            }

            draw_on_image(gr, this.x,this.y, this.w, this.h, false);
        }
        else {
            if (!row_normal_image) {
                var image = gdi.CreateImage(this.w, this.h);
                var image_gr = image.GetGraphics();

                draw_on_image(image_gr, 0, 0, this.w, this.h, false);

                image.ReleaseGraphics(image_gr);
                row_normal_image = image;
            }

            if (!row_pressed_image) {
                var image = gdi.CreateImage(this.w, this.h);
                var image_gr = image.GetGraphics();

                draw_on_image(image_gr, 0, 0, this.w, this.h, true);

                image.ReleaseGraphics(image_gr);
                row_pressed_image = image;
            }

            gr.DrawImage(row_normal_image, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, 255);
            gr.DrawImage(row_pressed_image, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, this.hover_alpha);
        }
    };

    /** @override */
    this.set_w = function (w) {
        List.Item.prototype.set_w.apply(this, [w]);

        clear_image();
    };

    this.edit_metadata = function () {
        var new_value = _.input_cancellable('Enter new ' + tag_name + ' value', 'Change metadata value', value_text);
        if (!_.isNil(new_value)) {
            value_text = new_value;

            var handle = fb.CreateHandleList();
            handle.Add(metadb);

            var meta_obj = {};
            meta_obj[tag_name] = value_text;
            handle.UpdateFileInfoFromJSON(JSON.stringify(meta_obj));

            clear_image();
        }
    };

    this.get_value_text = function () {
        return value_text;
    };

    this.get_tag_name = function () {
        return tag_name;
    };

    this.dispose = function () {
        clear_image();
    };

    function draw_on_image(g, x,y,w,h, is_pressed) {
        g.FillSolidRect(x, y, w, h, g_tr_i_colors.background);
        g.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

        if (that.is_odd && g_properties.alternate_row_color) {
            g.FillSolidRect(x, y + 1, w, h - 1, g_tr_i_colors.row_alternate);
        }

        if (is_pressed) {
            if (g_properties.alternate_row_color) {
                g.DrawRect(x, y, w - 1, h - 1, 1, g_tr_i_colors.row_pressed_rect);
            }
            else {
                g.FillSolidRect(x, y, w, h, g_tr_i_colors.row_pressed);
            }
        }

        var info_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.line_limit;

        var p = 5;
        var cur_x = x + p;
        {
            var name_text = /** @type{string} */ [((tag_name === 'www') ? tag_name : _.capitalize(tag_name.toLowerCase()) + ':')];
            var name_text_w = Math.ceil(/** @type{number} */ g.MeasureString(name_text, g_tr_i_fonts.info_name, 0, 0, 0, 0).Width) + 5;
            g.DrawString(name_text, g_tr_i_fonts.info_name, g_tr_i_colors.info_name, cur_x, y, name_text_w, h, info_text_format);

            cur_x += name_text_w;
        }

        {
            var value_text_w = (w - p) - cur_x;
            g.DrawString(value_text, g_tr_i_fonts.info_value, g_tr_i_colors.info_value, cur_x, y, value_text_w, h, info_text_format);
        }
    }

    function clear_image() {
        if (row_normal_image) {
            row_normal_image.Dispose();
            row_normal_image = null;
        }
        if (row_pressed_image) {
            row_pressed_image.Dispose();
            row_pressed_image = null;
        }
    }

    //public:

    //const after creation
    this.is_odd = false;
    this.is_readonly = true;

    this.is_pressed = false;
    // this is actually press_alpha, but _.alpha_timer expects item.hover_alpha
    this.hover_alpha = 0;

    this.tt = new _.tt_handler;

    //private:
    var that = this;

    /** @const {IFbMetadbHandle} */
    var metadb = metadb_arg;

    /** @type {string} */
    var tag_name = tag_name_arg;
    /** @type {string} */
    var value_text = value_text_arg;

    /** @type {?IGdiBitmap} */
    var row_normal_image = null;
    /** @type {?IGdiBitmap} */
    var row_pressed_image = null;
}
Row.prototype = Object.create(List.Item.prototype);
Row.prototype.constructor = Row;

var track_info = new TrackInfoList();
