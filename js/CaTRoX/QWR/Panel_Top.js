// ==PREPROCESSOR==
// @name 'Top Panel'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

var trace_call = false;
var trace_on_paint = false;
var trace_on_move = false;

g_script_list.push('Panel_Top.js');

g_properties.add_properties(
    {
        show_logo:        ['user.fb2k_logo.show', true],
        show_btn_ellipse: ['user.buttons.ellipse.show_always', false]
    }
);

var g_has_modded_jscript = qwr_utils.has_modded_jscript();
var g_component_scrobble = _.cc('foo_scrobble');

var mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
var top_panel = new TopPanel();

//<editor-fold desc="Callbacks">
function on_paint(gr) {
    trace_call && trace_on_paint && console.log(qwr_utils.function_name());
    top_panel.on_paint(gr);
}

function on_size() {
    trace_call && console.log(qwr_utils.function_name());
    var ww = window.Width;
    var wh = window.Height;

    if (ww <= 0 || wh <= 0) {
        // on_paint won't be called with such dimensions anyway
        return;
    }

    top_panel.on_size(ww, wh);
}

function on_mouse_move(x, y, m) {
    trace_call && trace_on_move && console.log(qwr_utils.function_name());

    if (mouse_move_suppress.is_supressed(x, y, m)) {
        return;
    }

    qwr_utils.DisableSizing(m);

    top_panel.on_mouse_move(x, y, m);
}

function on_mouse_lbtn_down(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    top_panel.on_mouse_lbtn_down(x, y, m);
}

function on_mouse_lbtn_up(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());

    qwr_utils.EnableSizing(m);

    top_panel.on_mouse_lbtn_up(x, y, m);
}

function on_mouse_rbtn_up(x, y) {
    trace_call && console.log(qwr_utils.function_name());
    return top_panel.on_mouse_rbtn_up(x, y);
}

function on_mouse_leave() {
    trace_call && console.log(qwr_utils.function_name());
    top_panel.on_mouse_leave();
}

function on_item_focus_change(playlist_arg, from, to) {
    trace_call && console.log(qwr_utils.function_name());
    top_panel.on_item_focus_change(playlist_arg, from, to);
}

function on_playback_dynamic_info_track() {
    trace_call && console.log(qwr_utils.function_name());
    top_panel.on_playback_dynamic_info_track();
}

function on_playback_stop(reason) {
    trace_call && console.log(qwr_utils.function_name());
    top_panel.on_playback_stop(reason);
}

function on_playback_new_track() {
    trace_call && console.log(qwr_utils.function_name());
    top_panel.on_playback_new_track();
}

function on_metadb_changed(handles, fromhook) {
    trace_call && console.log(qwr_utils.function_name());
    top_panel.on_metadb_changed(handles, fromhook);
}

function on_notify_data(name, info) {
    trace_call && console.log(qwr_utils.function_name());
    top_panel.on_notify_data(name, info);
}
//</editor-fold>

/**
 * @constructor
 */
function TopPanel() {
    //<editor-fold desc="Callback Implementation">
    this.on_paint = function (gr) {
        var metadb = fb.GetNowPlaying();

        gr.FillSolidRect(this.x, this.y, this.w, this.h, g_theme.colors.pss_back);
        gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

        var cur_x = this.x + 10;

        // Logo
        if (g_properties.show_logo) {
            var logo_x = cur_x;
            var logo_w = 16;
            var logo_y = Math.floor((this.h - logo_w) / 2);

            var fb2k_logo = gdi.Image(fb.FoobarPath + 'themes\\' + g_theme.folder_name + '\\Images\\fooLogo.png');
            gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);
            gr.DrawImage(fb2k_logo, logo_x, logo_y, logo_w, logo_w, 0, 0, fb2k_logo.Width, fb2k_logo.Height, 0, 175);

            cur_x = logo_x + logo_w + 5;
        }

        // Info
        if (metadb) {
            var info_x = cur_x + 5;
            var info_y = this.y;
            var info_w = this.w - (cur_x - this.x) - (10 + right_pad);
            var info_h = this.h;

            var info_query = "[%tracknumber%. ][%title%] ['('%length%')'][  \u25AA  %album artist%][  \u25AA  %album%]";
            var info_text = (fb.IsPlaying ? _.tfe(info_query) : _.tf(info_query, metadb));

            var info_font = gdi.font('Segoe Ui Semibold', 14);
            var info_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;

            gr.DrawString(info_text, info_font, _.RGB(170, 172, 174), info_x, info_y, info_w, info_h, info_format);
        }

        buttons.paint(gr);
    };

    this.on_size = function (w, h) {
        this.w = w;
        this.h = h;

        create_buttons(this.w, this.h);
    };

    this.on_mouse_move = function (x, y, m) {
        buttons.move(x, y);
    };

    this.on_mouse_lbtn_down = function (x, y, m) {
        buttons.lbtn_down(x, y);
    };

    this.on_mouse_lbtn_up = function (x, y, m) {
        buttons.lbtn_up(x, y);
    };

    this.on_mouse_rbtn_up = function (x, y) {
        var cmm = new Context.MainMenu();

        cmm.append_item(
            'Show foobar2000 logo',
            function () {
                g_properties.show_logo = !g_properties.show_logo;
            },
            {is_checked: g_properties.show_logo}
        );

        cmm.append_item(
            'Show button ellipse',
            _.bind(function () {
                g_properties.show_btn_ellipse = !g_properties.show_btn_ellipse;
                create_button_images();
                create_buttons(this.w, this.h);
            }, this),
            {is_checked: g_properties.show_btn_ellipse}
        );

        if (utils.IsKeyPressed(VK_SHIFT)) {
            qwr_utils.append_default_context_menu_to(cmm);
        }


        cmm.execute(x, y);
        cmm.dispose();

        this.repaint();

        return true;
    };

    this.on_mouse_leave = function () {
        buttons.leave();
    };

    this.on_item_focus_change = function(playlist_arg, from, to) {
        this.repaint();
    };

    this.on_playback_dynamic_info_track = function () {
        this.repaint();
    };

    this.on_playback_stop = function (reason) {
        this.repaint();
    };

    this.on_metadb_changed = function () {
        this.repaint();
    };

    this.on_playback_new_track = function () {
        // To recreate and reposition buttons
        create_buttons(this.w, this.h);
        this.repaint();
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
    //</editor-fold>

    var throttled_repaint = _.throttle(_.bind(function () {
        window.RepaintRect(this.x, this.y, this.w, this.h);
    }, this), 1000 / 60);

    this.repaint = function () {
        throttled_repaint();
    };

    function create_buttons(ww, wh) {
        if (buttons) {
            buttons.reset();
        }

        buttons = new _.buttons();
        buttons.show_tt = show_tooltips;

        var metadb = fb.GetNowPlaying();
        var is_youtube = metadb && (_.startsWith(metadb.RawPath, '3dydfy:') || _.startsWith(metadb.RawPath, 'fy+'));

        // Search YT
        var button_count = 1;

        if (is_youtube) {
            ++button_count;
        }

        if (g_component_scrobble) {
            ++button_count;
        }

        var y = 5;
        var w = 32;
        var h = w;
        var p = 5;
        var x = ww - w * button_count - p * (button_count - 1) - 10;
        right_pad = ww - x - 5;

        if (g_component_scrobble) {
            buttons.buttons.scrobble = new _.button(x, y, w, h, is_scrobbling_enabled ? button_images.LastFM_Disable : button_images.LastFM_Enable, function () {
                fb.RunMainMenuCommand('Playback/Scrobble Tracks');
                is_scrobbling_enabled = g_has_modded_jscript ? fb.IsMainMenuCommandChecked('Playback/Scrobble Tracks') : false;
                buttons.buttons.scrobble.set_image(is_scrobbling_enabled ? button_images.LastFM_Disable : button_images.LastFM_Enable);
                buttons.buttons.scrobble.tiptext = is_scrobbling_enabled ? 'Disable Last.FM Scrobbling' : 'Enable Last.FM Scrobbling';
                buttons.buttons.scrobble.repaint();
            }, is_scrobbling_enabled ? 'Disable Last.FM Scrobbling' : 'Enable Last.FM Scrobbling');
            x += w + p;
        }

        buttons.buttons.search_yt = new _.button(x, y, w, h, button_images.SearchYT, function () { fb.RunMainMenuCommand('View/Youtube Source/Search on Youtube'); }, 'Search Youtube');
        x += w + p;

        if (is_youtube) {
            buttons.buttons.yt_video = new _.button(x, y, w, h, is_youtube_video_displayed ? button_images.VideoHide : button_images.VideoShow, function () {
                fb.RunMainMenuCommand('View/Visualizations/Video');
                is_youtube_video_displayed = g_has_modded_jscript ? fb.IsMainMenuCommandChecked('View/Visualizations/Video') : false;
                buttons.buttons.yt_video.set_image(is_youtube_video_displayed ? button_images.VideoHide : button_images.VideoShow);
                buttons.buttons.yt_video.tiptext = is_youtube_video_displayed ? 'Hide Youtube Video' : 'Show Youtube Video';
                buttons.buttons.yt_video.repaint();
            }, is_youtube_video_displayed ? 'Hide Youtube Video' : 'Show Youtube Video');
        }
    }

    function create_button_images() {
        var font_guifx = gdi.font(g_guifx.name, 16);
        var font_awesome = gdi.font('FontAwesome', 16);

        var default_ico_colors =
            [
                _.RGB(150, 152, 154),
                _.RGB(190, 192, 194),
                _.RGB(90, 90, 90)
            ];

        var accented_ico_colors =
            [
                _.RGB(182, 158, 44), // _.RGBA(255, 220, 55, 155) + g_theme.colors.pss_back
                _.RGB(234, 202, 53), // _.RGBA(255, 220, 55, 225) + g_theme.colors.pss_back
                _.RGB(141, 122, 38)  // _.RGBA(255, 220, 55, 105) + g_theme.colors.pss_back
            ];

        var default_ellipse_colors =
            [
                _.RGB(70, 70, 70),
                _.RGB(190, 195, 200),
                _.RGB(80, 80, 80)
            ];

        var btn = {
            SearchYT:
                {
                    ico:  g_guifx.zoom,
                    font: font_guifx,
                    w:    30,
                    h:    30
                },
            VideoShow:
                {
                    ico:  g_guifx.right3,
                    font: font_guifx,
                    w:    30,
                    h:    30
                },
            VideoHide:
                {
                    ico:         g_guifx.right3,
                    font:        font_guifx,
                    w:           30,
                    h:           30,
                    is_accented: true
                },
            LastFM_Disable:
                {
                    ico:  '\uF202',
                    font: font_awesome,
                    w:    30,
                    h:    30
                },
            LastFM_Enable:
                {
                    ico:         '\uF202',
                    font:        font_awesome,
                    w:           30,
                    h:           30,
                    is_accented: true,
                    add_cross:   true
                }
        };

        button_images = [];

        _.forEach(btn, function (item, i) {
            var w = item.w,
                h = item.h,
                lw = 2;

            var state_images = []; //0=normal, 1=hover, 2=down;

            for (var s = 0; s <= 2; s++) {
                var img = gdi.CreateImage(w, h);
                var g = img.GetGraphics();
                g.SetSmoothingMode(SmoothingMode.HighQuality);
                g.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
                g.FillSolidRect(0, 0, w, h, g_theme.colors.pss_back); // Cleartype is borked, if drawn without background

                var ico_color = item.is_accented ? accented_ico_colors[s] : default_ico_colors[s];
                var ellipse_color = default_ellipse_colors[s];
                if (s === 0 && !g_properties.show_btn_ellipse) {
                    ellipse_color = _.RGBA(0, 0, 0, 0);
                }

                g.DrawEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, lw, ellipse_color);

                g.DrawString(item.ico, item.font, ico_color, 1, 0, w, h, g_string_format.align_center);
                if (item.add_cross) {
                    var slash_font = gdi.font('Arial', 22, g_font_style.bold);
                    g.DrawString('\u2215', slash_font, ico_color, 1, 1, w, h, g_string_format.align_center);
                    g.DrawString('\u2215', slash_font, g_theme.colors.pss_back, 3, 1, w, h, g_string_format.align_center);
                }

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

    var buttons = null;
    var button_images = [];

    var show_tooltips = false;
    
    var is_youtube_video_displayed = g_has_modded_jscript ? fb.IsMainMenuCommandChecked('View/Visualizations/Video') : false;
    var is_scrobbling_enabled = (g_has_modded_jscript && g_component_scrobble) ? fb.IsMainMenuCommandChecked('Playback/Scrobble Tracks') : false;
    
    var right_pad = 0;

    create_button_images();
}
