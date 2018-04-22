// ==PREPROCESSOR==
// @name 'UltraMini Main Panel'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==
var trace_call = false;
var trace_on_paint = false;
var trace_on_move = false;

g_script_list.push('Panel_UltraMini.js');

g_properties.add_properties(
    {
        art_pad:          ['user.art.pad', 0],
        title_queries:    ['user.title.queries', JSON.stringify(['[%title%]', '[%artist%]', '[%album%]'])],
        title_cycle_time: ['user.title.cycle_time', 6000]
    }
);

// Fixup properties
(function() {
    var title_queries = JSON.parse(g_properties.title_queries);
    if (!_.isArray(title_queries)) {
        g_properties.title_queries = JSON.stringify([]);
    }
})();

var mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
var key_down_suppress = new qwr_utils.KeyModifiersSuppress();
var ultra_mini = new UltraMini();

function on_paint(gr) {
    trace_on_paint && console.log(qwr_utils.function_name());
    ultra_mini.on_paint(gr);
}

function on_size() {
    trace_call && console.log(qwr_utils.function_name());
    var ww = window.Width;
    var wh = window.Height;

    if (ww <= 0 || wh <= 0) {
        // on_paint won't be called with such dimensions anyway
        return;
    }

    ultra_mini.on_size(this.w, this.h);
}

function on_get_album_art_done(metadb, art_id, image, image_path) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_get_album_art_done(metadb, art_id, image, image_path);
}

function on_playlist_switch() {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_playlist_switch();
}

function on_item_focus_change() {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_item_focus_change();
}

function on_playback_starting(cmd, is_paused) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_playback_starting(cmd, is_paused);
}

function on_playback_new_track(metadb) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_playback_new_track(metadb);
}

function on_playback_pause(isPlaying) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_playback_pause(isPlaying);
}

function on_playback_dynamic_info_track() {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_playback_dynamic_info_track();
}

function on_playback_stop(reason) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_playback_stop(reason);
}

function on_playback_seek() {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_playback_seek();
}

function on_mouse_move(x, y, m) {
    trace_on_move && console.log(qwr_utils.function_name());

    if (mouse_move_suppress.is_supressed(x,y,m)) {
        return;
    }

    ultra_mini.on_mouse_move(x, y, m);
}

function on_mouse_lbtn_down(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_mouse_lbtn_down(x, y, m);
}

function on_mouse_lbtn_up(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_mouse_lbtn_up(x, y, m);
}

function on_mouse_rbtn_up(x, y) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_mouse_rbtn_up(x, y);
}

function on_mouse_wheel(delta) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_mouse_wheel(delta);
}

function on_mouse_leave() {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_mouse_leave();
}

function on_key_down(vkey) {
    trace_call && console.log(qwr_utils.function_name());

    if (key_down_suppress.is_supressed(vkey)) {
        return;
    }

    ultra_mini.on_key_down(vkey);
}

function on_volume_change(val) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_volume_change(val);
}

function on_notify_data(name, info) {
    trace_call && console.log(qwr_utils.function_name());
    ultra_mini.on_notify_data(name, info);
}

/**
 * @constructor
 */
function UltraMini() {
    //<editor-fold desc="Callback Implementation">
    this.on_paint = function (gr) {
        gr.FillSolidRect(0, 0, this.w, this.h, g_theme.colors.panel_back);
        gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

        // Art
        if (fb.IsPlaying || fb.IsPaused) {
            art_module.paint(gr);
        }
        else {
            gr.DrawString(g_theme.name + ' ' + g_theme.version, gdi.font('Segoe Ui Semibold', 24), _.RGB(70, 70, 70), 0, 0, this.w, this.h, g_string_format.align_center);
        }

        // Title
        gr.FillGradRect(0, -1, this.w, 40, 270, _.RGBA(0, 0, 0, 0), _.RGBA(0, 0, 0, 255));
        gr.FillGradRect(0, -1, this.w, 40, 270, _.RGBA(0, 0, 0, 0), _.RGBA(0, 0, 0, 255));

        if (fb.IsPlaying) {
            var title_text_format = g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
            gr.DrawString(title_cycler.title_text(), gdi.font('Segoe Ui Semibold', 12), _.RGB(240, 240, 240), 5, 5, this.w, this.h, title_text_format);
        }

        if (panel_alpha !== 0) {
            // Controls
            gr.FillGradRect(0, this.h - playback_h - seekbar_h, this.w, playback_h + seekbar_h + 1, 90, _.RGBA(0, 0, 0, 0), _.RGBA(0, 0, 0, panel_alpha));

            // SeekBar
            var p = 2;
            var x = seekbar_obj.x,
                y = seekbar_obj.y,
                w = seekbar_obj.w,
                h = seekbar_obj.h;

            var sliderBackColor = _.RGBA(37, 37, 37, panel_alpha);
            var sliderBarColor = _.RGBA(190, 192, 194, panel_alpha);
            var sliderBarHoverColor = _.RGBA(231, 233, 235, Math.min(panel_alpha, seekbar_obj.hover_alpha));
            gr.FillSolidRect(x, y + p, w, h - p * 2, sliderBackColor);
            if (fb.IsPlaying && fb.PlaybackLength > 0) {
                gr.FillSolidRect(x, y + p, seekbar_obj.pos(), h - p * 2, sliderBarColor);
                gr.FillSolidRect(x, y + p, seekbar_obj.pos(), h - p * 2, sliderBarHoverColor);
                gr.FillSolidRect(x + seekbar_obj.pos() - 2, y + p - 1, 4, h - p * 2 + 2, _.RGBA(255, 255, 255, panel_alpha));
            }

            // VolBar
            if (show_volume_bar) {
                var p = 3;
                var x = volume_bar.x,
                    y = volume_bar.y,
                    w = volume_bar.w,
                    h = volume_bar.h;

                var volFrameColor = _.RGBA(255, 255, 255, panel_alpha);
                gr.DrawRect(x - 2, y + p - 2, w + 3, h - p * 2 + 3, 1.0, volFrameColor);
                gr.FillSolidRect(x, y + p, w, h - p * 2, sliderBackColor);
                gr.FillSolidRect(x, y + p, volume_bar.pos(), h - p * 2, sliderBarColor);
            }

            buttons.paint(gr, panel_alpha);
        }
    };

    this.on_size = function () {
        this.w = window.Width;
        this.h = window.Height;

        var playback_y = this.h - playback_h;
        create_buttons(0, playback_y, this.w, playback_h);

        var seekbar_y = playback_y - seekbar_h + Math.floor(seekbar_h / 2);
        seekbar_obj = new _.seekbar(5, seekbar_y, this.w - 10, seekbar_h);
        seekbar_obj.show_tt = show_tooltips;

        var volume_bar_y = playback_y + Math.floor(playback_h / 2 - volume_bar_h / 2) + 2;
        volume_bar = new _.volume(volume_bar_x, volume_bar_y, Math.min(this.w - volume_bar_x - 4, 60), volume_bar_h);

        art_module.on_size(g_properties.art_pad, g_properties.art_pad, this.w - 2 * g_properties.art_pad, this.h - 2 * g_properties.art_pad);
        art_module.get_album_art();
    };

    this.on_get_album_art_done = function (metadb, art_id, image, image_path) {
        art_module.get_album_art_done(metadb, art_id, image, image_path);
    };

    this.on_playlist_switch = function () {
        art_module.playlist_switch();
    };

    this.on_item_focus_change = function () {
        art_module.item_focus_change();
    };

    this.on_playback_starting = function (cmd, is_paused) {
        seekbar_obj.playback_start();
        buttons.refresh_play_button();
    };

    this.on_playback_new_track = function (metadb) {
        title_cycler.on_playback_new_track(metadb);
        art_module.playback_new_track();
    };

    this.on_playback_pause = function (isPlaying) {
        title_cycler.on_playback_pause(isPlaying);
        seekbar_obj.playback_pause(isPlaying);
        buttons.refresh_play_button();
    };

    this.on_playback_dynamic_info_track = function () {
        this.repaint();
    };

    this.on_playback_stop = function (reason) {
        title_cycler.on_playback_stop(reason);
        art_module.playback_stop();
        seekbar_obj.playback_stop();
        buttons.refresh_play_button();
    };

    this.on_playback_seek = function () {
        seekbar_obj.playback_seek();
    };

    this.on_mouse_move = function (x, y, m) {
        qwr_utils.DisableSizing(m);

        if (volume_bar.drag) {
            volume_bar.move(x, y);
            return;
        }

        if (seekbar_obj.drag) {
            seekbar_obj.move(x, y);
            return;
        }

        if (!mouse_in_panel) {
            mouse_in_panel = true;
            animator.run_animation('fade_in');
        }

        if (show_volume_bar) {
            var trace_pad = 2;
            if ((volume_bar.x - 2 * trace_pad <= x) && (x <= volume_bar.x + volume_bar.w + trace_pad) && (volume_bar.y - trace_pad <= y) && (y <= volume_bar.y + volume_bar.h + trace_pad)) {
                volume_bar.move(x, y);
            }
            else {
                show_volume_bar = false;
                volume_bar.show_tt = false;
                buttons.buttons.mute.hide = false;
                buttons.buttons.volume.hide = false;
                buttons.refresh_vol_button();
                volume_bar.repaint();
            }
        }
        seekbar_obj.move(x, y);
        buttons.move(x, y);
    };

    this.on_mouse_lbtn_down = function (x, y, m) {
        buttons.lbtn_down(x, y);
        seekbar_obj.lbtn_down(x, y);
        if (show_volume_bar) {
            volume_bar.lbtn_down(x, y);
        }
    };

    this.on_mouse_lbtn_up = function (x, y, m) {
        qwr_utils.EnableSizing(m);

        buttons.lbtn_up(x, y);
        seekbar_obj.lbtn_up(x, y);
        if (show_volume_bar) {
            volume_bar.lbtn_up(x, y);
        }
    };

    this.on_mouse_wheel = function (delta) {
        if (mouse_in_panel) {
            if (!show_volume_bar || !volume_bar.wheel(delta)) {
                if (delta > 0) {
                    fb.VolumeUp();
                }
                else {
                    fb.VolumeDown();
                }
            }
        }
    };

    this.on_mouse_leave = function () {
        if (volume_bar.drag || seekbar_obj.drag) {
            return;
        }

        if (mouse_in_panel) {
            mouse_in_panel = false;
            animator.run_animation('fade_out');
        }

        if (show_volume_bar) {
            show_volume_bar = false;
            buttons.buttons.mute.hide = false;
            buttons.buttons.volume.hide = false;
            volume_bar.repaint();
        }

        buttons.leave();
    };

    this.on_volume_change = function (val) {
        if (!show_volume_bar) {
            buttons.refresh_vol_button();
        }
        else {
            volume_bar.volume_change();
        }
    };

    this.on_key_down = function (vkey) {
        if (vkey === VK_F5) {
            art_module.reload_art();
        }
    };

    this.on_mouse_rbtn_up = function (x, y) {
        var cmm = new Context.MainMenu();

        cmm.append_item(
            'Reload \tF5',
            function(){
                art_module.reload_art()
            }
        );

        if (utils.IsKeyPressed(VK_SHIFT)) {
            qwr_utils.append_default_context_menu_to(cmm);
        }

        cmm.execute(x,y);
        cmm.dispose();

        return true;
    };

    this.on_notify_data = function (name, info) {
        switch (name) {
            case 'show_tooltips': {
                show_tooltips = info;
                seekbar_obj.show_tt = info;
                volume_bar.show_tt = info;
                buttons.show_tt = info;
                break;
            }
        }
    };
    //</editor-fold>

    var throttled_repaint = _.throttle(_.bind(function () {
        window.RepaintRect(this.x, this.y, this.w, this.h);
    }, this), 1000 / 60);
    this.repaint = function () {
        throttled_repaint();
    };

    function initialize() {
        create_button_images();
        // Set tracking mode in ArtModule to NowPlaying
        art_module.set_track_mode(1);
        if (!window.IsVisible) {
            that.on_size(1, 1);
        }
    }

    function create_buttons(wx, wy, ww, wh) {
        if (buttons) {
            buttons.reset();
        }

        buttons = new _.buttons;
        buttons.show_tt = show_tooltips;

        //---> Playback buttons
        var w = button_images.Next.normal.Width;
        var h = w;
        var p = 4;

        var x = wx + Math.floor(ww / 2 - (w * 5 + p * 4) / 2);
        var y = wy + Math.floor(wh / 2 - w / 2) + 1;

        buttons.buttons.stop = new _.button(x, y, w, h, button_images.Stop, function () {
            fb.Stop();
            // Needs repaint to avoid partial art redraw
            that.repaint();
        }, 'Stop');

        x += w + p;
        buttons.buttons.previous = new _.button(x, y, w, h, button_images.Previous, function () { fb.Prev(); }, 'Previous');

        x += w + p;
        buttons.buttons.play = new _.button(x, y, w, h, (!fb.IsPlaying || fb.IsPaused) ? button_images.Play : button_images.Pause, function () {
            var wasNotPlaying = !fb.IsPlaying;
            fb.PlayOrPause();
            // Needs repaint to avoid partial art redraw
            if (wasNotPlaying) {
                that.repaint();
            }
        }, (!fb.IsPlaying || fb.IsPaused) ? 'Play' : 'Pause');

        x += w + p;
        buttons.buttons.next = new _.button(x, y, w, h, button_images.Next, function () { fb.Next(); }, 'Next');

        x += w + p;
        volume_bar_x = x + 3;

        var volValue = _.toVolume(fb.Volume);
        var volImage = ((volValue > 50) ? button_images.VolLoud : ((volValue > 0) ? button_images.VolQuiet : button_images.VolMute));
        buttons.buttons.mute = new _.button(x, y, w, h, volImage, function () { fb.VolumeMute(); }, volValue === 0 ? 'Unmute' : 'Mute');

        x += w - 5;
        buttons.buttons.volume = new _.button(x, y + 2, button_images.ShowVolume.normal.Width, h, button_images.ShowVolume, function () {
            show_volume_bar = true;
            buttons.leave(); // for state reset
            buttons.buttons.mute.hide = true;
            buttons.buttons.volume.hide = true;
            volume_bar.show_tt = show_tooltips;
            volume_bar.repaint();
        }, 'Volume');

        buttons.refresh_play_button = function () {
            buttons.buttons.play.set_image((!fb.IsPlaying || fb.IsPaused) ? button_images.Play : button_images.Pause);
            buttons.buttons.play.tiptext = (!fb.IsPlaying || fb.IsPaused) ? 'Play' : 'Pause';
            buttons.buttons.play.repaint();
        };

        buttons.refresh_vol_button = function () {
            var volValue = _.toVolume(fb.Volume);
            var volImage = (volValue > 50) ? button_images.VolLoud : ((volValue > 0) ? button_images.VolQuiet : button_images.VolMute);
            buttons.buttons.mute.set_image(volImage);
            buttons.buttons.mute.tiptext = volValue === 0 ? 'Unmute' : 'Mute';
            buttons.buttons.mute.repaint();
        };
    }

    function create_button_images() {
        var fontGuifx = gdi.font(g_guifx.name, 16);
        var fontGuifx_15 = gdi.font(g_guifx.name, 15);
        var fontAwesome = gdi.font('FontAwesome', 14);

        var default_ico_colors =
            [
                _.RGB(190, 192, 194),
                _.RGB(251, 253, 255),
                _.RGB(90, 90, 90)
            ];

        var btn =
            {
                Stop:       {
                    ico:  g_guifx.stop,
                    font: fontGuifx,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                Previous:   {
                    ico:  g_guifx.previous,
                    font: fontGuifx,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                Play:       {
                    ico:  g_guifx.play,
                    font: fontGuifx,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                Pause:      {
                    ico:  g_guifx.pause,
                    font: fontGuifx,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                Next:       {
                    ico:  g_guifx.next,
                    font: fontGuifx,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                VolLoud:    {
                    ico:  g_guifx.volume_up,
                    font: fontGuifx_15,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                VolQuiet:   {
                    ico:  g_guifx.volume_down,
                    font: fontGuifx_15,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                VolMute:    {
                    ico:  g_guifx.mute,
                    font: fontGuifx_15,
                    id:   'playback',
                    w:    26,
                    h:    26
                },
                ShowVolume: {
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

            var stateImages = []; //0=normal, 1=hover, 2=down;

            for (var s = 0; s <= 2; s++) {
                var img = gdi.CreateImage(w, h);
                var g = img.GetGraphics();
                g.SetSmoothingMode(SmoothingMode.HighQuality);
                if (i === 'VolMute') {
                    // TextRenderingHint.AntiAlias crops image :\
                    g.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
                }
                else {
                    g.SetTextRenderingHint(TextRenderingHint.AntiAlias);
                }

                var ico_color = default_ico_colors[s];
                g.DrawString(item.ico, item.font, ico_color, (i === 'Stop') ? 0 : 1, 0, w, h, g_string_format.align_center);

                img.ReleaseGraphics(g);
                stateImages[s] = img;
            }

            button_images[i] =
                {
                    normal:  stateImages[0],
                    hover:   stateImages[1],
                    pressed: stateImages[2]
                };
        });
    }

    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    var that = this;

    // Consts
    var seekbar_h = 8;
    var volume_bar_h = 14;
    var playback_h = 30;

    // Const after init
    var show_tooltips = false;
    var button_images = [];
    var volume_bar_x = 0;

    // Runtime state
    var panel_alpha = 0;
    var mouse_in_panel = false;
    var show_volume_bar = false;

    // Objects
    var art_module = new ArtModule();
    var title_cycler = new TitleCycler(_.bind(function(){
        this.repaint();
    },this));
    var animator = new Animator(_.bind(function (alpha) {
        panel_alpha = alpha;
        this.repaint();
    }, this));
    var buttons = undefined;
    var volume_bar = undefined;
    /** @type {?seekbar} */
    var seekbar_obj = undefined;

    initialize();
}

/**
 * @param {Function} on_alpha_change_fn_arg
 * @constructor
 */
function Animator(on_alpha_change_fn_arg) {
    this.run_animation = function (animation_name) {
        if (animation_name === 'fade_out') {
            // Not stopping fade_in, because it looks borked, when stopped in the middle.
            stop_fade_out_delay();

            delayFadeOutTimer = _.delay(function(){
                stop_fade_out_delay();
                fade_out();
            }, 1000);
        }
        else if (animation_name === 'fade_in') {
            stop_fade_out();
            stop_fade_out_delay();

            fade_in();
        }
        else {
            throw Error('Argument error:\nUnknown animation: ' + animation_name);
        }
    };

// private:
    function stop_fade_out_delay(){
        if ( delayFadeOutTimer ) {
            clearTimeout(delayFadeOutTimer);
            delayFadeOutTimer = null;
        }
    }

    function stop_fade_out(){
        if ( fadeOutTimer ) {
            clearInterval(fadeOutTimer);
            fadeOutTimer = null;
        }
    }

    function stop_fade_in(){
        if ( fadeInTimer ) {
            clearInterval(fadeInTimer);
            fadeInTimer = null;
        }
    }

    function fade_out() {
        var hoverOutStep = 15;
        
        if (!fadeOutTimer && alpha !== 0) {
            fadeOutTimer = setInterval(function () {
                if ( delayFadeOutTimer ) {
                    return;
                }

                alpha = Math.max(0, alpha - hoverOutStep);
                on_alpha_change_fn(alpha);

                if (!alpha) {
                    stop_fade_out();
                }
            }, timerRate);
        }
    }

    function fade_in() {
        var hoverInStep = 60;
        
        if (!fadeInTimer && alpha !== 255) {
            fadeInTimer = setInterval(function () {
                alpha = Math.min(255, alpha += hoverInStep);
                on_alpha_change_fn(alpha);

                if (alpha === 255) {
                    stop_fade_in();
                }
            }, timerRate);
        }
    }

// private:
    var on_alpha_change_fn = on_alpha_change_fn_arg;

    var delayFadeOutTimer = null;
    var fadeOutTimer = null;
    var fadeInTimer = null;

    var timerRate = 25;
    
    var alpha = 0;
}

/**
 * @param {Function} on_change_fn_arg
 * @constructor
 */
function TitleCycler(on_change_fn_arg) {

    this.on_playback_new_track = function (metadb) {
        reset_timer();
    };

    this.on_playback_pause = function (pause) {
        if (pause) {
            stop_timer();
        }
        else {
            start_timer();
        }
    };

    this.on_playback_stop = function (reason) {
        if (reason !== 2) {
            stop_timer();
        }
    };

    this.title_text = function () {
        return cur_title_text;
    };

    function initialize() {
        if (fb.IsPlaying) {
            cycle_title(true);
        }
    }

    function reset_timer() {
        stop_timer();
        cur_query_idx = 0;
        cycle_title();
        start_timer();
    }

    function start_timer() {
        if (!title_timer) {
            title_timer = setInterval(function(){cycle_title()}, cycle_time);
        }
    }

    function stop_timer() {
        if (title_timer) {
            clearInterval(title_timer);
            title_timer = null;
        }
    }

    function cycle_title(skip_callback) {
        if (!queries.length) {
            stop_timer();
            return;
        }

        var last_idx = cur_query_idx;

        do {
            var titleQuery = queries[cur_query_idx];

            ++cur_query_idx;
            if (cur_query_idx >= queries.length) {
                cur_query_idx = 0;
            }

            var titleText = _.tfe(titleQuery);
            if (titleText !== '') {
                cur_title_text = titleText;
                break;
            }
        } while (cur_query_idx !== last_idx);

        if (cur_query_idx === last_idx) {
            stop_timer();
        }

        if (!skip_callback) {
            on_change_fn();
        }
    }

    // const
    var queries = JSON.parse(g_properties.title_queries);
    var cycle_time = g_properties.title_cycle_time;

    var on_change_fn = on_change_fn_arg;

    var title_timer = null;
    var cur_title_text = '';
    var cur_query_idx = 0;

    initialize();
}
