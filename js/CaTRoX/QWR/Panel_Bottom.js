// ==PREPROCESSOR==
// @name 'Seekbar Panel'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

var trace_call = false;
var trace_on_paint = false;
var trace_on_move = false;

g_script_list.push('Panel_Bottom.js');

// Should be used only for default panel properties
var g_is_mini_panel = (window.name.toLowerCase().indexOf('mini') !== -1);

g_properties.add_properties(
    {
        show_remaining_time: ['user.seekbar.show_remaining_time', true],

        enable_volume_bar:     ['system.volume_bar.enable', !g_is_mini_panel],
        minify_seekbar:        ['system.seekbar.minify', g_is_mini_panel],
        is_spectrum_available: ['system.spectrum.available', !g_is_mini_panel]
    }
);

var mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
var bottom_panel = new BottomPanel();


//<editor-fold desc="Callbacks">
function on_paint(gr) {
    trace_call && trace_on_paint && console.log(qwr_utils.function_name());
    bottom_panel.on_paint(gr);
}

function on_size() {
    trace_call && console.log(qwr_utils.function_name());
    var ww = window.Width;
    var wh = window.Height;

    if (ww <= 0 || wh <= 0) {
        // on_paint won't be called with such dimensions anyway
        return;
    }

    bottom_panel.on_size(ww, wh);
}

function on_mouse_move(x, y, m) {
    trace_call && trace_on_move && console.log(qwr_utils.function_name());

    if (mouse_move_suppress.is_supressed(x, y, m)) {
        return;
    }

    qwr_utils.DisableSizing(m);

    bottom_panel.on_mouse_move(x, y, m);
}

function on_mouse_lbtn_down(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_mouse_lbtn_down(x, y, m);
}

function on_mouse_lbtn_dblclk(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_mouse_lbtn_dblclk(x, y, m);
}

function on_mouse_lbtn_up(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());

    qwr_utils.EnableSizing(m);

    bottom_panel.on_mouse_lbtn_up(x, y, m);
}

function on_mouse_rbtn_up(x, y) {
    trace_call && console.log(qwr_utils.function_name());
    return bottom_panel.on_mouse_rbtn_up(x, y);
}

function on_mouse_leave() {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_mouse_leave();
}

function on_mouse_wheel (delta) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_mouse_wheel(delta);
}

function on_item_focus_change(playlist_arg, from, to) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_item_focus_change(playlist_arg, from, to);
}

function on_playback_starting(cmd, is_paused) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_playback_starting(cmd, is_paused);
}

function on_playback_pause(isPlaying) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_playback_pause(isPlaying);
}

function on_playback_stop(reason) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_playback_stop(reason);
}

function on_playback_seek() {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_playback_seek();
}

function on_playback_time(time) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_playback_time(time);
}

function on_playback_order_changed(id) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_playback_order_changed(id);
}

function on_volume_change(val) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_volume_change(val);
}

function on_notify_data(name, info) {
    trace_call && console.log(qwr_utils.function_name());
    bottom_panel.on_notify_data(name, info);
}
//</editor-fold>

/**
 * @constructor
 */
function BottomPanel() {
    this.on_paint = function (gr) {
        gr.FillSolidRect(this.x, this.y, this.w, this.h, g_theme.colors.pss_back);
        gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

        var slider_back_color = _.RGB(37, 37, 37);
        var slider_bar_color = _.RGB(110, 112, 114);
        var slider_bar_hover_color = _.RGB(151, 153, 155);

        // SeekBar
        {
            // Bar

            var p = 5;
            var seek_x = seekbar_obj.x;
            var seek_y = seekbar_obj.y;
            var seek_w = seekbar_obj.w;
            var seek_h = seekbar_obj.h;

            gr.FillSolidRect(seek_x, seek_y + p, seek_w, seek_h - p * 2, slider_back_color);
            if (fb.IsPlaying && fb.PlaybackLength > 0) {
                gr.FillSolidRect(seek_x, seek_y + p, seekbar_obj.pos(), seek_h - p * 2, slider_bar_color);
                gr.FillSolidRect(seek_x, seek_y + p, seekbar_obj.pos(), seek_h - p * 2, _.RGBtoRGBA(slider_bar_hover_color, seekbar_obj.hover_alpha));
            }

            // Text

            if (!seekbar_obj.drag) {
                var metadb = (fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem());

                seekbar_time_1 = ((fb.IsPlaying && fb.PlaybackTime) ? _.tfe('%playback_time%') : '0:00');

                if (g_properties.show_remaining_time && fb.IsPlaying) {
                    var is_radio = fb.GetNowPlaying() && _.startsWith(fb.GetNowPlaying().RawPath, 'http://');

                    var remaining_time = _.tfe('[%playback_time_remaining%]');
                    if (!remaining_time) {
                        seekbar_time_2 = is_radio ? 'stream' : ' 0:00';
                    }
                    else {
                        seekbar_time_2 = (remaining_time === '0:00') ? ' 0:00' : ('-' + remaining_time);
                    }
                }
                else {
                    var track_length = (fb.IsPlaying ? _.tfe('[%length%]') : _.tf('[%length%]', metadb));
                    seekbar_time_2 = (track_length ? track_length : ' 0:00');
                }
            }

            var slider_text_color = (fb.IsPlaying ? _.RGB(130, 132, 134) : _.RGB(80, 80, 80));
            var seekbar_text_font = gdi.font('Consolas', 14, 1);
            gr.DrawString(seekbar_time_1, seekbar_text_font, slider_text_color, seek_x - seekbar_text_w, seek_y - 1, seekbar_text_w, seek_h, g_string_format.align_center);
            gr.DrawString(seekbar_time_2, seekbar_text_font, slider_text_color, seek_x + seek_w, seek_y - 1, seekbar_text_w, seek_h, g_string_format.align_center);
        }

        // VolBar
        if (g_properties.enable_volume_bar) {
            var x = volume_bar_obj.x,
                y = volume_bar_obj.y,
                w = volume_bar_obj.w,
                h = volume_bar_obj.h;

            gr.FillSolidRect(x, y + p, w, h - p * 2, slider_back_color);
            gr.FillSolidRect(x, y + p, volume_bar_obj.pos(), h - p * 2, slider_bar_color);
            gr.FillSolidRect(x, y + p, volume_bar_obj.pos(), h - p * 2, _.RGBtoRGBA(slider_bar_hover_color, seekbar_obj.hover_alpha));
        }

        buttons.paint(gr);
    };

    this.on_size = function (w, h) {
        this.w = w;
        this.h = h;

        create_buttons(0, 0, this.w, this.h);

        var right_pad = 0;
        if (g_properties.enable_volume_bar) {
            var volume_bar_x = (this.x + this.w) - (volume_bar_w + 35);
            var volume_bar_y = this.y + Math.floor(this.h / 2 - volume_bar_h / 2) + 2;

            volume_bar_obj = new _.volume(volume_bar_x, volume_bar_y, volume_bar_w, volume_bar_h);
            volume_bar_obj.show_tt = show_tooltips;

            right_pad = this.w - (volume_bar_x - this.x);
        }
        else {
            volume_bar_obj = new _.volume(0, 0, 0, 0);
        }

        {
            var seekbar_x = this.x + seekbar_text_w;
            var seekbar_y = this.y + Math.floor(this.h / 2 - seekbar_h / 2) + 2;
            var gap = (g_properties.minify_seekbar ? 70 : 80);
            var seekbar_w = this.w - (right_pad + seekbar_text_w * 2 + gap);

            seekbar_obj = new _.seekbar(seekbar_x, seekbar_y, seekbar_w, seekbar_h);
            seekbar_obj.show_tt = show_tooltips;
        }
    };

    this.on_mouse_move = function (x, y, m) {
        seekbar_obj.move(x, y);

        if (seekbar_obj.drag) {
            seekbar_time_1 = format_time(fb.PlaybackLength * seekbar_obj.drag_seek, true);
            seekbar_time_2 = format_time(fb.PlaybackLength - fb.PlaybackLength * seekbar_obj.drag_seek, true);
            if (seekbar_time_2 === '0:00') {
                seekbar_time_2 = ' ' + seekbar_time_2;
            }
            else {
                seekbar_time_2 = '-' + seekbar_time_2;
            }

            this.repaint();
            return;
        }

        buttons.move(x, y);

        if (g_properties.enable_volume_bar) {
            volume_bar_obj.move(x, y);
        }
    };

    this.on_mouse_lbtn_down = function (x, y, m) {
        buttons.lbtn_down(x, y);
        seekbar_obj.lbtn_down(x, y);
        if (g_properties.enable_volume_bar) {
            volume_bar_obj.lbtn_down(x, y);
        }
    };

    this.on_mouse_lbtn_dblclk = function (x, y, m) {
        on_mouse_lbtn_down(x, y, m);
    };

    this.on_mouse_lbtn_up = function (x, y, m) {
        buttons.lbtn_up(x, y);
        seekbar_obj.lbtn_up(x, y);
        if (g_properties.enable_volume_bar) {
            volume_bar_obj.lbtn_up(x, y);
        }
    };

    this.on_mouse_rbtn_up = function (x, y) {
        var cmm = new Context.MainMenu();

        cmm.append_item(
            'Show time remaining',
            _.bind(function () {
                g_properties.show_remaining_time = !g_properties.show_remaining_time;
                this.repaint();
            }, this),
            {is_checked: g_properties.show_remaining_time}
        );

        if (g_properties.is_spectrum_available) {
            cmm.append_item(
                'Show music spectrum',
                function () {
                    pss_switch.spectrum.state = pss_switch.spectrum.state === 'Show' ? 'Hide' : 'Show';
                },
                {is_checked: pss_switch.spectrum.state === 'Show'}
            );
        }

        if (utils.IsKeyPressed(VK_SHIFT)) {
            qwr_utils.append_default_context_menu_to(cmm);
        }

        cmm.execute(x, y);
        cmm.dispose();

        return true;
    };

    this.on_mouse_wheel = function (delta) {
        if (volume_bar_obj.wheel(delta)) {
            return;
        }

        if (delta > 0) {
            fb.VolumeUp();
        }
        else {
            fb.VolumeDown();
        }
    };

    this.on_mouse_leave = function () {
        if (seekbar_obj.drag || volume_bar_obj.drag) {
            return;
        }

        buttons.leave();
        seekbar_obj.leave();
        volume_bar_obj.leave();
    };

    this.on_item_focus_change = function(playlist_arg, from, to) {
        this.repaint();
    };

    this.on_playback_starting = function (cmd, is_paused) {
        seekbar_obj.playback_start();
    };

    this.on_playback_pause = function (isPlaying) {
        seekbar_obj.playback_pause(isPlaying);
    };

    this.on_playback_stop = function (reason) {
        seekbar_obj.playback_stop();
        // For seekbar_time refresh
        this.repaint();
    };

    this.on_playback_seek = function () {
        seekbar_obj.playback_seek();
        // For seekbar_time refresh
        this.repaint();
    };

    this.on_playback_time = function (time) {
        seekbar_obj.playback_seek();
        // For seekbar_time refresh
        this.repaint();
    };

    this.on_playback_order_changed = function (id) {
        buttons.refresh_shuffle_button();
        buttons.refresh_repeat_button();
    };

    this.on_volume_change = function (val) {
        if (!g_properties.enable_volume_bar) {
            return;
        }
        
        buttons.refresh_vol_button();
        volume_bar_obj.volume_change();
    };

    this.on_notify_data = function (name, info) {
        switch (name) {
            case 'show_tooltips': {
                show_tooltips = info;
                buttons.show_tt = show_tooltips;
                seekbar_obj.show_tt = show_tooltips;
                volume_bar_obj.show_tt = show_tooltips;
                break;
            }
        }
    };

    var throttled_repaint = _.throttle(_.bind(function () {
        window.RepaintRect(this.x, this.y, this.w, this.h);
    }, this), 1000 / 60);
    this.repaint = function () {
        throttled_repaint();
    };

    function initialize() {
        create_button_images();
        if (g_properties.is_spectrum_available) {
            pss_switch.spectrum.refresh();
        }
        if (!window.IsVisible) {
            that.on_size(1, 1);
        }
    }

    function create_buttons(wx, wy, ww, wh) {
        if (buttons)
            buttons.reset();

        buttons = new _.buttons();
        buttons.show_tt = show_tooltips;

        var w = button_images.Repeat.normal.Width;
        var y = Math.floor(wh / 2 - w / 2) + 1;
        var h = w;
        var p = 9;

        var btn_count = 2;

        var right_pad = (w + p) * btn_count;
        if (g_properties.enable_volume_bar) {
            right_pad += (volume_bar_w + 35);
        }
        right_pad += g_properties.minify_seekbar ? 2 : 2 * 6;

        var x = ww - right_pad;

        var repeat_img;
        switch (plman.PlaybackOrder) {
            case g_playback_order.repeat_playlist: {
                repeat_img = button_images.RepeatPlaylist;
                break;
            }
            case g_playback_order.repeat_track: {
                repeat_img = button_images.Repeat1;
                break;
            }
            default: {
                repeat_img = button_images.Repeat;
                break;
            }
        }

        var repeat_fn = function () {
            switch (plman.PlaybackOrder) {
                case g_playback_order.default: {
                    plman.PlaybackOrder = g_playback_order.repeat_playlist;
                    break;
                }
                case g_playback_order.repeat_playlist: {
                    plman.PlaybackOrder = g_playback_order.repeat_track;
                    break;
                }
                case g_playback_order.repeat_track: {
                    plman.PlaybackOrder = g_playback_order.default;
                    break;
                }
                default: {
                    plman.PlaybackOrder = g_playback_order.repeat_playlist;
                    break;
                }
            }
        };
        buttons.buttons.repeat = new _.button(x, y, w, h, repeat_img, repeat_fn, 'Repeat');

        var shuffle_fn = function () {
            if (plman.PlaybackOrder !== g_playback_order.shuffle_tracks) {
                plman.PlaybackOrder = g_playback_order.shuffle_tracks;
            }
            else {
                plman.PlaybackOrder = g_playback_order.default;
            }
        };
        buttons.buttons.shuffle = new _.button(x + (w + p), y, w, h, (plman.PlaybackOrder === g_playback_order.shuffle_tracks) ? button_images.ShuffleTracks : button_images.Shuffle, shuffle_fn, 'Shuffle');

        if (g_properties.enable_volume_bar) {
            var vol_value = _.toVolume(fb.Volume);
            var vol_image =
                ((vol_value > 50)
                    ? button_images.VolLoud
                    : ((vol_value > 0)
                        ? button_images.VolQuiet
                        : button_images.VolMute));

            buttons.buttons.mute = new _.button(ww - 30, y, w, h, vol_image, function () { fb.VolumeMute(); }, vol_value === 0 ? 'Unmute' : 'Mute');
        }

        buttons.refresh_repeat_button = function () {
            var repeat_img;
            if (plman.PlaybackOrder === g_playback_order.repeat_playlist) {
                repeat_img = button_images.RepeatPlaylist;
            }
            else if (plman.PlaybackOrder === g_playback_order.repeat_track) {
                repeat_img = button_images.Repeat1;
            }
            else {
                repeat_img = button_images.Repeat;
            }

            buttons.buttons.repeat.set_image(repeat_img);
            buttons.buttons.repeat.repaint();
        };

        buttons.refresh_shuffle_button = function () {
            buttons.buttons.shuffle.set_image((plman.PlaybackOrder === g_playback_order.shuffle_tracks) ? button_images.ShuffleTracks : button_images.Shuffle);
            buttons.buttons.shuffle.repaint();
        };

        buttons.refresh_vol_button = function () {
            var vol_value = _.toVolume(fb.Volume);
            var vol_image =
                ((vol_value > 50)
                    ? button_images.VolLoud
                    : ((vol_value > 0)
                        ? button_images.VolQuiet
                        : button_images.VolMute));

            buttons.buttons.mute.set_image(vol_image);
            buttons.buttons.mute.tiptext = fb.Volume === -100 ? 'Unmute' : 'Mute';
            buttons.buttons.mute.repaint();
        };
    }

    function create_button_images() {
        var fontGuifx = gdi.font(g_guifx.name, 18);
        var c = [250, 250, 250];

        var default_ico_colors =
            [
                _.RGBA(c[0], c[1], c[2], 35),
                _.RGBA(c[0], c[1], c[2], 155),
                _.RGBA(c[0], c[1], c[2], 105)
            ];

        var accent_ico_colors =
            [
                _.RGBA(255, 220, 55, 155),
                _.RGBA(255, 220, 55, 225),
                _.RGBA(255, 220, 55, 105)
            ];

        var btn =
            {
                Repeat:
                    {
                        ico:  g_guifx.repeat,
                        font: fontGuifx,
                        id:   'playback',
                        w:    24,
                        h:    24
                    },
                Repeat1:
                    {
                        ico:         g_guifx.repeat1,
                        font:        fontGuifx,
                        id:          'playback',
                        w:           24,
                        h:           24,
                        is_accented: true
                    },
                RepeatPlaylist:
                    {
                        ico:         g_guifx.repeat,
                        font:        fontGuifx,
                        id:          'playback',
                        w:           24,
                        h:           24,
                        is_accented: true
                    },
                Shuffle:
                    {
                        ico:  g_guifx.shuffle,
                        font: fontGuifx,
                        id:   'playback',
                        w:    24,
                        h:    24
                    },
                ShuffleTracks:
                    {
                        ico:         g_guifx.shuffle,
                        font:        fontGuifx,
                        id:          'playback',
                        w:           24,
                        h:           24,
                        is_accented: true
                    },
                VolLoud:
                    {
                        ico:  g_guifx.volume_up,
                        font: fontGuifx,
                        id:   'playback',
                        w:    24,
                        h:    24
                    },
                VolQuiet:
                    {
                        ico:  g_guifx.volume_down,
                        font: fontGuifx,
                        id:   'playback',
                        w:    24,
                        h:    24
                    },
                VolMute:
                    {
                        ico:         g_guifx.mute,
                        font:        fontGuifx,
                        id:          'playback',
                        w:           24,
                        h:           24,
                        is_accented: true
                    }
            };

        button_images = [];

        _.forEach(btn, function (item, i) {
            var w = item.w,
                h = item.h;

            var state_images = []; //0=normal, 1=hover, 2=down;

            for (var s = 0; s <= 2; s++) {
                var ico_color = item.is_accented ? accent_ico_colors[s] : default_ico_colors[s];

                var img = gdi.CreateImage(w, h);
                var g = img.GetGraphics();
                g.SetSmoothingMode(SmoothingMode.HighQuality);
                g.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
                g.FillSolidRect(0, 0, w, h, g_theme.colors.pss_back); // Cleartype is borked, if drawn without background

                g.DrawString(item.ico, item.font, ico_color, 0, 0, w, h, g_string_format.align_center);

                img.ReleaseGraphics(g);
                state_images[s] = img;
            }

            button_images[i] =
                {
                    normal:  state_images[0],
                    hover:   state_images[1],
                    pressed: state_images[2]
                };
        });
    }

    function format_time(s, truncate) {
        var weeks = Math.floor(s / 604800);
        var days = Math.floor(s % 604800 / 86400);
        var hours = Math.floor((s % 86400) / 3600);
        var minutes = Math.floor(((s % 86400) % 3600) / 60);
        var seconds = Math.round((((s % 86400) % 3600) % 60));

        weeks = weeks ? weeks + 'wk ' : '';
        days = days ? days + 'd ' : '';
        hours = hours ? hours + ':' : '';
        if (truncate && !weeks && !days && !hours ) {
            minutes = minutes + ':'
        }
        else {
            minutes = (minutes < 10 ? '0' + minutes : minutes) + ':';
        }
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return weeks + days + hours + minutes + seconds;
    }

    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    var that = this;

    /** @const {number} */
    var seekbar_h = 14;
    /** @const {number} */
    var seekbar_text_w = (g_properties.minify_seekbar ? 65 : 70);
    /** @const {number} */
    var volume_bar_h = 14;
    /** @const {number} */
    var volume_bar_w = 70;

    var seekbar_time_1 = '0:00';
    var seekbar_time_2 = '0:00';

    // objects
    var buttons = null;
    var button_images = [];
    var show_tooltips = false;
    var volume_bar_obj = null;
    var seekbar_obj = new _.seekbar(0, 0, 0, 0);

    initialize();
}


