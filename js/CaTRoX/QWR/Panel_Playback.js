// ==PREPROCESSOR==
// @name 'Playback Panel'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

var trace_call = false;
var trace_on_paint = false;
var trace_on_move = false;

g_script_list.push('Panel_Playback.js');

// Should be used only for default panel properties
var g_is_mini_panel = (window.name.toLowerCase().indexOf('mini') !== -1);

g_properties.add_properties(
    {
        enable_volume_bar: ['system.volume_bar_obj.enable', g_is_mini_panel],
        center_buttons:    ['system.buttons.center', g_is_mini_panel]
    }
);

var mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
var playback_panel = new PlaybackPanel();


//<editor-fold desc="Callbacks">
function on_paint(gr) {
    trace_call && trace_on_paint && console.log(qwr_utils.function_name());
    playback_panel.on_paint(gr);
}

function on_size() {
    trace_call && console.log(qwr_utils.function_name());
    var ww = window.Width;
    var wh = window.Height;

    if (ww <= 0 || wh <= 0) {
        // on_paint won't be called with such dimensions anyway
        return;
    }

    playback_panel.on_size(ww, wh);
}

function on_mouse_move(x, y, m) {
    trace_call && trace_on_move && console.log(qwr_utils.function_name());

    if (mouse_move_suppress.is_supressed(x, y, m)) {
        return;
    }

    qwr_utils.DisableSizing(m);

    playback_panel.on_mouse_move(x, y, m);
}

function on_mouse_lbtn_down(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    playback_panel.on_mouse_lbtn_down(x, y, m);
}

function on_mouse_lbtn_dblclk(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    playback_panel.on_mouse_lbtn_dblclk(x, y, m);
}

function on_mouse_lbtn_up(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());

    qwr_utils.EnableSizing(m);

    playback_panel.on_mouse_lbtn_up(x, y, m);
}

function on_mouse_rbtn_up(x, y) {
    trace_call && console.log(qwr_utils.function_name());
    return playback_panel.on_mouse_rbtn_up(x, y);
}

function on_mouse_leave() {
    trace_call && console.log(qwr_utils.function_name());
    playback_panel.on_mouse_leave();
}

function on_mouse_wheel (delta) {
    trace_call && console.log(qwr_utils.function_name());
    playback_panel.on_mouse_wheel(delta);
}

function on_playback_starting (cmd, is_paused) {
    trace_call && console.log(qwr_utils.function_name());
    playback_panel.on_playback_starting(cmd, is_paused);
}

function on_playback_pause (state) {
    trace_call && console.log(qwr_utils.function_name());
    playback_panel.on_playback_pause(state);
}

function on_playback_stop (reason) {
    trace_call && console.log(qwr_utils.function_name());
    playback_panel.on_playback_stop(reason);
}

function on_volume_change (val) {
    trace_call && console.log(qwr_utils.function_name());
    playback_panel.on_volume_change(val);
}

function on_notify_data (name, info) {
    trace_call && console.log(qwr_utils.function_name());
    playback_panel.on_notify_data(name, info);
}

//</editor-fold>

/**
 * @constructor
 */
function PlaybackPanel() {
    this.on_paint = function (gr) {
        gr.FillSolidRect(this.x, this.y, this.w, this.h, g_theme.colors.pss_back);
        gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

        buttons.paint(gr);

        if (show_volume_bar) {
            var p = 5;
            var x = volume_bar_obj.x;
            var y = volume_bar_obj.y;
            var w = volume_bar_obj.w;
            var h = volume_bar_obj.h;

            var slider_back_color = _.RGB(37, 37, 37);
            var slider_bar_color = _.RGB(190, 192, 194);
            var frame_color = _.RGB(200, 200, 200);

            gr.DrawRect(x - 2, y + p - 2, w + 3, h - p * 2 + 3, 1.0, frame_color);
            gr.FillSolidRect(x, y + p, w, h - p * 2, slider_back_color);
            gr.FillSolidRect(x, y + p, volume_bar_obj.pos(), h - p * 2, slider_bar_color);
        }
    };

    this.on_size = function (w,h) {
        this.w = w;
        this.h = h;

        create_buttons(this.x, this.y + 1, this.w, this.h);

        if (g_properties.enable_volume_bar) {
            var vol_x = left_pad;
            var vol_w = Math.min(this.w - (vol_x - this.x) - 4, 60);
            var vol_h = volume_bar_h;
            var vol_y = this.y + Math.floor(this.h / 2 - vol_h / 2) + 3;

            volume_bar_obj = new _.volume(vol_x, vol_y, vol_w, vol_h);
            volume_bar_obj.show_tt = show_tooltips;
        }
        else {
            volume_bar_obj = new _.volume(0, 0, 0, 0);
        }
    };

    this.on_mouse_move = function (x, y, m) {
        if (show_volume_bar) {
            if ((volume_bar_obj.x - 4 <= x) && (x <= volume_bar_obj.x + volume_bar_obj.w + 2) && (volume_bar_obj.y - 2 <= y) && (y <= volume_bar_obj.y + volume_bar_obj.h + 2) || volume_bar_obj.drag) {
                volume_bar_obj.move(x, y);
            }
            else {
                show_volume_bar = false;
                volume_bar_obj.show_tt = false;
                buttons.buttons.volume.hide = false;
                buttons.refresh_vol_button();
                volume_bar_obj.repaint();
            }
        }

        buttons.move(x, y);
    };

    this.on_mouse_lbtn_down = function (x, y, m) {
        buttons.lbtn_down(x, y);
        if (show_volume_bar) {
            volume_bar_obj.lbtn_down(x, y);
        }
    };

    this.on_mouse_lbtn_dblclk = function (x, y, m) {
        on_mouse_lbtn_down(x, y, m);
    };

    this.on_mouse_lbtn_up = function (x, y, m) {
        buttons.lbtn_up(x, y);
        if (show_volume_bar) {
            volume_bar_obj.lbtn_up(x, y);
        }
    };

    this.on_mouse_rbtn_up = function (x, y) {
        if (!utils.IsKeyPressed(VK_SHIFT)) {
            return true;
        }

        var cmm = new Context.MainMenu();

        qwr_utils.append_default_context_menu_to(cmm);

        cmm.execute(x, y);
        cmm.dispose();

        return true;
    };

    this.on_mouse_wheel = function (delta) {
        if (show_volume_bar && volume_bar_obj.wheel(delta)) {
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
        if (volume_bar_obj.drag) {
            return;
        }

        if (show_volume_bar) {
            show_volume_bar = false;
            buttons.buttons.volume.hide = false;
            volume_bar_obj.repaint();
        }

        buttons.leave();
    };

    this.on_playback_starting = function (cmd, is_paused) {
        buttons.refresh_play_button();
    };

    this.on_playback_pause = function (state) {
        buttons.refresh_play_button();
    };

    this.on_playback_stop = function (reason) {
        if (reason !== 2) {
            buttons.refresh_play_button();
        }
    };

    this.on_notify_data = function (name, info) {
        switch (name) {
            case 'show_tooltips': {
                show_tooltips = info;
                buttons.show_tt = show_tooltips;
                break;
            }
        }
    };

    this.on_volume_change = function (val) {
        if (!g_properties.enable_volume_bar) {
            return;
        }

        buttons.refresh_vol_button();

        if (show_volume_bar) {
            volume_bar_obj.volume_change();
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
        if (!window.IsVisible) {
            that.on_size(1, 1);
        }
    }

    function create_buttons(wx, wy, ww, wh) {
        if (buttons) {
            buttons.reset();
        }

        buttons = new _.buttons();
        buttons.show_tt = show_tooltips;

        var w = button_images.Next.normal.Width;
        var h = w;
        var p = 2;

        var y = wy + Math.floor((wh - w) / 2);
        var x;

        var btn_count = 4;
        if (g_properties.enable_volume_bar) {
            ++btn_count;
        }

        if (g_properties.center_buttons) {
            x = wx + Math.floor((ww - (w * btn_count + p * (btn_count - 1))) / 2);
        }
        else {
            x = wx + 5;
        }

        buttons.buttons.stop = new _.button(x, y, w, h, button_images.Stop, function () { fb.Stop(); }, 'Stop');
        x += w + p;

        buttons.buttons.previous = new _.button(x, y, w, h, button_images.Previous, function () { fb.Prev(); }, 'Previous');
        x += w + p;

        buttons.buttons.play = new _.button(x, y, w, h, !fb.IsPlaying || fb.IsPaused ? button_images.Play : button_images.Pause, function () { fb.PlayOrPause(); }, !fb.IsPlaying || fb.IsPaused ? 'Play' : 'Pause');
        x += w + p;

        buttons.buttons.next = new _.button(x, y, w, h, button_images.Next, function () { fb.Next(); }, 'Next');
        x += w + p;

        if (g_properties.enable_volume_bar) {
            w = button_images.VolLoud.normal.Width;
            h = button_images.VolLoud.normal.Height;
            y = wy + Math.floor((wh - w) / 2);
            var vol_value = _.toVolume(fb.Volume);
            var vol_image = ((vol_value > 50) ? button_images.VolLoud : ((vol_value > 0) ? button_images.VolQuiet : button_images.VolMute));
            buttons.buttons.mute = new _.button(x, y + 1, w, h, vol_image, function () { fb.VolumeMute(); }, vol_value === 0 ? 'Unmute' : 'Mute');
            x += w - 5;

            w = button_images.ShowVolume.normal.Width;
            h = button_images.ShowVolume.normal.Height;
            y = wy + Math.floor(wh / 2 - w / 2);
            buttons.buttons.volume = new _.button(x, y + 1, button_images.ShowVolume.normal.Width, h, button_images.ShowVolume, function () {
                show_volume_bar = true;
                buttons.leave(); // for state reset
                buttons.buttons.volume.hide = true;
                volume_bar_obj.show_tt = show_tooltips;
                volume_bar_obj.repaint();
            }, 'Volume');

            left_pad = x + 6;

            buttons.refresh_vol_button = function () {
                var vol_value = _.toVolume(fb.Volume);
                var vol_image = ((vol_value > 50) ? button_images.VolLoud : ((vol_value > 0) ? button_images.VolQuiet : button_images.VolMute));
                buttons.buttons.mute.set_image(vol_image);
                buttons.buttons.mute.tiptext = vol_value === 0 ? 'Unmute' : 'Mute';
                buttons.buttons.mute.repaint();
            };
        }

        buttons.refresh_play_button = function () {
            buttons.buttons.play.set_image(!fb.IsPlaying || fb.IsPaused ? button_images.Play : button_images.Pause);
            buttons.buttons.play.tiptext = !fb.IsPlaying || fb.IsPaused ? 'Play' : 'Pause';
            buttons.buttons.play.repaint();
        }
    }

    function create_button_images() {
        var fontGuifx = gdi.font(g_guifx.name, 16);
        var fontAwesome = gdi.font('FontAwesome', 14);
        var default_ico_colors =
            [
                _.RGB(110, 112, 114),
                _.RGB(190, 192, 194),
                _.RGB(90, 90, 90)
            ];

        var btn =
            {
                Stop:           {
                    ico:  g_guifx.stop,
                    font: fontGuifx,
                    id:   'playback',
                    w:    30,
                    h:    30
                },
                Previous:       {
                    ico:  g_guifx.previous,
                    font: fontGuifx,
                    id:   'playback',
                    w:    30,
                    h:    30
                },
                Play:           {
                    ico:  g_guifx.play,
                    font: fontGuifx,
                    id:   'playback',
                    w:    30,
                    h:    30
                },
                Pause:          {
                    ico:  g_guifx.pause,
                    font: fontGuifx,
                    id:   'playback',
                    w:    30,
                    h:    30
                },
                Next:           {
                    ico:  g_guifx.next,
                    font: fontGuifx,
                    id:   'playback',
                    w:    30,
                    h:    30
                },
                PlaybackRandom: {
                    ico:  g_guifx.slow_forward,
                    font: fontGuifx,
                    id:   'playback',
                    w:    30,
                    h:    30
                },
                VolLoud:        {
                    ico:  g_guifx.volume_up,
                    font: fontGuifx,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                VolQuiet:       {
                    ico:  g_guifx.volume_down,
                    font: fontGuifx,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                VolMute:        {
                    ico:  g_guifx.mute,
                    font: fontGuifx,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                ShowVolume:     {
                    ico:  '\uF0d7',
                    font: fontAwesome,
                    id:   'playback',
                    w:    15,
                    h:    20
                }
            };

        button_images = [];

        _.forEach(btn, function (item, i) {
            var w = item.w,
                h = item.h;

            var state_images = []; //0=normal, 1=hover, 2=down;

            for (var s = 0; s <= 2; s++) {
                var img = gdi.CreateImage(w, h);
                var g = img.GetGraphics();
                g.SetSmoothingMode(SmoothingMode.HighQuality);
                g.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
                g.FillSolidRect(0, 0, w, h, g_theme.colors.pss_back); // Cleartype is borked, if drawn without background

                g.DrawString(item.ico, item.font, default_ico_colors[s], (i === 'Stop') ? 0 : 1, 0, w, h, g_string_format.align_center);

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

    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    var that = this;

    /** @const {number} */
    var volume_bar_h = 14;

    var left_pad = 0;
    
    var show_tooltips = false;
    var show_volume_bar = false;

    // Objects
    var volume_bar_obj = null;
    var buttons = null;
    var button_images = [];

    initialize();
}