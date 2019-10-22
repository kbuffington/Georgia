// ==PREPROCESSOR==
// @name 'Menu Panel'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

(function check_es5_availability() {
    var test = !!Date.now && !!Array.isArray && !!Array.prototype.forEach;
    if (!test) {
        var error_msg = 'ES5 is not supported by your system! Cannot use this theme!';
        throw new ThemeError(error_msg);
    }
})();

(function check_jscript_version() {
    var required_version = 2100;
    if (utils.Version < required_version) {
        function version_to_string(version) {
            var version_string = version.toString();
            return version_string[0] + '.' + version_string[1] + '.' + version_string[2] + '.' + version_string[3];
        }

        var error_msg = 'JScript (modded or vanilla) v' + version_to_string(required_version) + ' or higher is required!\n';
        error_msg += 'Your JScript version: ' + version_to_string(utils.Version);

        throw new ThemeError(error_msg);
    }
})();

// TODO: Handle full-screen maximize properly: pseudo-caption should be available regardless of border mode

var trace_call = false;
var trace_on_paint = false;
var trace_on_move = false;

g_script_list.push('Panel_Menu.js');

g_properties.add_properties(
    {
        maximize_to_fullscreen: ['user.window.maximize_to_fullscreen', true],
        show_window_shadow:     ['user.window.shadow.show', true],
        show_fb2k_version:      ['user.title_bar.fb2k_version.show', false],
        show_theme_version:     ['user.title_bar.theme_version.show', false],
        show_cpu_usage:         ['user.title_bar.cpu_usage.show', false],
        show_tooltips:          ['user.global.tooltips.show', true],
        saved_mode:             ['system.window.saved_mode', 'Full'],
        full_mode_saved_width:  ['system.window.full.saved_width', 895],
        full_mode_saved_height: ['system.window.full.saved_height', 650],
        mini_mode_saved_width:  ['system.window.mini.saved_width', 250],
        mini_mode_saved_height: ['system.window.mini.saved_height', 600],
        is_first_launch:        ['system.first_launch', true],

        incompatibility_notified: ['system.jscript_incompatibility.notified', false],
        incompatibility_version:  ['system.jscript_incompatibility.version', utils.Version]
    }
);

(function check_jscript_compatibility() {
    if (qwr_utils.has_modded_jscript()
        || (g_properties.incompatibility_notified && utils.Version === g_properties.incompatibility_version)) {
        return;
    }

    // Needed in case of JScript update
    g_properties.incompatibility_version = utils.Version;
    g_properties.incompatibility_notified = false;

    var msg = 'Warning: Vanilla JScript component detected, so some features will be unavailable!\n\n';
    msg += 'Disabled features:\n';
    msg += '    - Persistent window size for Full Mode and Playlist Mode.\n';
    msg += '    - Top Panel: dynamic button state for \'YouTube Video Toggle\' and \'Last.FM Scrobbling Toggle\' buttons.\n';
    msg += '\nAlso some dialog windows (like this one) may spawn outside of the main fb2k window.\n';
    msg += '\nSources for modded JScript are available at <a href="https://github.com/TheQwertiest/foo-jscript-panel">https://github.com/TheQwertiest/foo-jscript-panel</a>\n';

    function on_ok_fn(do_not_remind) {
        if (do_not_remind) {
            g_properties.incompatibility_notified = true;
        }
    }

    g_hta_window.popup_with_checkbox(-10000, -10000, 'JScript incompatibility warning', msg, 'Do not show this dialog again', false, on_ok_fn);
    g_hta_window.manager.center();
})();

qwr_utils.check_fonts(['Segoe Ui', 'Segoe Ui Semibold', 'Segoe Ui Symbol', 'Consolas', 'Marlett', 'Guifx v2 Transports', 'FontAwesome']);

var g_has_modded_jscript = qwr_utils.has_modded_jscript();

// Fixup properties
(function() {
    var saved_mode = g_properties.saved_mode;
    if (saved_mode !== 'Full' || saved_mode !== 'Mini' || saved_mode !== 'UltraMini') {
        g_properties.saved_mode = 'Full';
    }
})();

var WindowState =
    {
        Normal:    0,
        Minimized: 1,
        Maximized: 2
    };

var FrameStyle =
    {
        Default:      0,
        SmallCaption: 1,
        NoCaption:    2,
        NoBorder:     3
    };

var MoveStyle =
    {
        Default: 0,
        Middle:  1,
        Left:    2,
        Both:    3
    };

var mouse_move_suppress = new qwr_utils.MouseMoveSuppress();
var menu = new Menu();


function on_paint(gr) {
    trace_call && trace_on_paint && console.log(qwr_utils.function_name());
    menu.on_paint(gr);
}

function on_size() {
    trace_call && console.log(qwr_utils.function_name());
    var ww = window.Width;
    var wh = window.Height;

    if (ww <= 0 || wh <= 0) {
        // on_paint won't be called with such dimensions anyway
        return;
    }

    menu.on_size(ww, wh);
}

function on_mouse_move(x, y, m) {
    trace_call && trace_on_move && console.log(qwr_utils.function_name());

    if (mouse_move_suppress.is_supressed(x, y, m)) {
        return;
    }

    menu.on_mouse_move(x, y, m);
}

function on_mouse_lbtn_down(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    menu.on_mouse_lbtn_down(x, y, m);
}

function on_mouse_lbtn_dblclk(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    menu.on_mouse_lbtn_dblclk(x, y, m);
}

function on_mouse_lbtn_up(x, y, m) {
    trace_call && console.log(qwr_utils.function_name());
    menu.on_mouse_lbtn_up(x, y, m);
}

function on_mouse_leave() {
    trace_call && console.log(qwr_utils.function_name());
    menu.on_mouse_leave();
}

function on_mouse_rbtn_up(x, y) {
    trace_call && console.log(qwr_utils.function_name());
    return menu.on_mouse_rbtn_up(x, y);
}

function on_always_on_top_changed(state) {
    trace_call && console.log(qwr_utils.function_name());
    menu.on_always_on_top_changed(state);
}

function on_notify_data(name, info) {
    trace_call && console.log(qwr_utils.function_name());
    menu.on_notify_data(name, info);
}

/**
 * @constructor
 */
function Menu() {
    this.on_paint = function(gr) {
        if (!has_notified) {
            // When on_paint is called all other panels are loaded and can receive notifications
            window.NotifyOthers('show_tooltips', g_properties.show_tooltips);
            window.NotifyOthers('minimode_state', pss_switch.minimode.state);

            has_notified = true;

            // Dirty, dirty hack to adjust window size
            if (mode_handler.fix_window_size()) {
                // Size has changed, waiting for on_size
                window.Repaint();
                return;
            }
        }

        gr.FillSolidRect(this.x - pad, this.y - pad, this.w + 2 * pad, this.h + pad, g_theme.colors.pss_back);
        gr.FillSolidRect(this.x, this.y, this.w, this.h, g_theme.colors.panel_front);
        gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

        if (g_properties.show_window_shadow) {
            // Dirty hack to fix the appearing border
            gr.DrawLine(this.x - pad, this.y - pad, this.w + 2 * pad, this.y - pad, 1, g_theme.colors.pss_back);
        }

        if (g_properties.show_fb2k_version || g_properties.show_theme_version || g_properties.show_cpu_usage) {
            var title_x = this.x + left_pad;
            var title_y = this.y - 1;
            var title_w = right_pad - left_pad;

            var separator_text = '  \u25AA  ';
            var title_text = '';

            if (g_properties.show_cpu_usage) {
                var cpu_usage_text;
                if (pss_switch.minimode.state !== 'Full') {
                    cpu_usage_text = cpu_usage_tracker.get_cpu_usage() + '% (' + cpu_usage_tracker.get_gui_cpu_usage() + '%)';
                }
                else {
                    cpu_usage_text = 'CPU: ' + cpu_usage_tracker.get_cpu_usage() + '% (GUI: ' + cpu_usage_tracker.get_gui_cpu_usage() + '%)';
                }
                title_text = cpu_usage_text;
            }

            if (g_properties.show_theme_version) {
                if (title_text) {
                    title_text += separator_text;
                }
                title_text += g_theme.name + ' ' + g_theme.version;
            }

            if (g_properties.show_fb2k_version) {
                if (title_text) {
                    title_text += separator_text;
                }
                title_text += fb.TitleFormat('%_foobar2000_version%').eval();
            }

            var title_text_format = g_string_format.align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
            gr.DrawString(title_text, gdi.font('Segoe Ui Semibold', 11), _.RGBA(240, 242, 244, 120), title_x, title_y, title_w, this.h, title_text_format);
        }

        buttons.paint(gr);
    };

    this.on_size = function(w, h) {
        this.h = h - pad;
        this.w = w - 2 * pad;

        create_buttons(this.x, this.y, this.w, this.h);

        if (!frame_handler.has_true_caption) {
            frame_handler.set_caption(left_pad, this.y, right_pad - left_pad, this.h);
        }
    };

    this.on_mouse_move = function(x, y, m) {
        var btn = buttons.move(x, y);
        if (btn) {
            return;
        }

        if (!frame_handler.has_true_caption) {
            if (mouse_down) {
                qwr_utils.DisableSizing(m);
            }
            else {
                qwr_utils.EnableSizing(m);
            }
        }
    };

    this.on_mouse_lbtn_down = function(x, y, m) {
        mouse_down = true;
        buttons.lbtn_down(x, y);
    };

    this.on_mouse_lbtn_dblclk = function(x, y, m) {
        this.on_mouse_lbtn_down(x, y, m);
    };

    this.on_mouse_lbtn_up = function(x, y, m) {
        qwr_utils.EnableSizing(m);

        mouse_down = false;
        buttons.lbtn_up(x, y);
    };

    this.on_mouse_rbtn_up = function(x, y, m) {
        var cmm = new Context.MainMenu();

        var frame = new Context.Menu('Frame style');
        cmm.append(frame);

        frame.append_item(
            'Default',
            _.bind(function() {
                frame_handler.change_style(FrameStyle.Default);
                frame_handler.toggle_shadow(false);
                create_buttons(this.x, this.y, this.w, this.h);
            }, this)
        );

        frame.append_item(
            'Small caption',
            _.bind(function() {
                frame_handler.change_style(FrameStyle.SmallCaption);
                frame_handler.toggle_shadow(false);
                create_buttons(this.x, this.y, this.w, this.h);
            }, this)
        );

        frame.append_item(
            'No caption',
            _.bind(function() {
                frame_handler.change_style(FrameStyle.NoCaption);
                frame_handler.toggle_shadow(false);
                create_buttons(this.x, this.y, this.w, this.h);
                frame_handler.set_caption(left_pad, this.y, right_pad - left_pad, this.h);
            }, this)
        );

        frame.append_item(
            'No border',
            _.bind(function() {
                frame_handler.change_style(FrameStyle.NoBorder);
                frame_handler.toggle_shadow(g_properties.show_window_shadow);
                create_buttons(this.x, this.y, this.w, this.h);
                frame_handler.set_caption(left_pad, this.y, right_pad - left_pad, this.h);
            }, this)
        );

        frame.radio_check(0, UIHacks.FrameStyle);

        if (UIHacks.FrameStyle === FrameStyle.NoBorder && UIHacks.Aero.Active) {
            frame.append_separator();

            frame.append_item(
                'Show window shadow',
                function() {
                    g_properties.show_window_shadow = !g_properties.show_window_shadow;
                    frame_handler.toggle_shadow(g_properties.show_window_shadow);
                },
                {is_checked: g_properties.show_window_shadow}
            );
        }

        if (UIHacks.FrameStyle !== FrameStyle.Default) {
            cmm.append_separator();

            cmm.append_item(
                'Maximize button -> to fullscreen',
                function() {
                    g_properties.maximize_to_fullscreen = !g_properties.maximize_to_fullscreen;
                },
                {is_checked: g_properties.maximize_to_fullscreen}
            );
        }

        cmm.append_separator();

        cmm.append_item(
            'Show foobar version',
            function() {
                g_properties.show_fb2k_version = !g_properties.show_fb2k_version;
            },
            {is_checked: g_properties.show_fb2k_version}
        );

        cmm.append_item(
            'Show theme version',
            function() {
                g_properties.show_theme_version = !g_properties.show_theme_version;
            },
            {is_checked: g_properties.show_theme_version}
        );

        cmm.append_item(
            'Show button tooltips',
            function() {
                g_properties.show_tooltips = !g_properties.show_tooltips;
                buttons.show_tt = g_properties.show_tooltips;
                window.NotifyOthers('show_tooltips', g_properties.show_tooltips);
            },
            {is_checked: g_properties.show_tooltips}
        );

        if (utils.IsKeyPressed(VK_SHIFT)) {
            cmm.append_separator();

            cmm.append_item(
                'Show CPU usage',
                function() {
                    g_properties.show_cpu_usage = !g_properties.show_cpu_usage;
                    if (g_properties.show_cpu_usage) {
                        cpu_usage_tracker.start();
                    }
                    else {
                        cpu_usage_tracker.stop();
                    }
                },
                {is_checked: g_properties.show_cpu_usage}
            );

            qwr_utils.append_default_context_menu_to(cmm);
        }

        cmm.execute(x, y);
        cmm.dispose();

        this.repaint();

        return true;
    };

    this.on_mouse_leave = function() {
        buttons.leave();
    };

    this.on_always_on_top_changed = function(state) {
        buttons.refresh_pin_button();
    };

    this.on_notify_data = function(name, info) {
        if (name === 'minimode_state') {
            this.repaint();
        }
    };

    ///// EOF callbacks

    var throttled_repaint = _.throttle(_.bind(function() {
        window.RepaintRect(this.x, this.y, this.w, this.h);
    }, this), 1000 / 60);
    this.repaint = function() {
        throttled_repaint();
    };

    // private:
    function initialize() {
        // Workaround for fb2k bug, when always on top is not working on startup, even if set
        if (fb.AlwaysOnTop) {
            fb.RunMainMenuCommand('View/Always on Top');
            fb.RunMainMenuCommand('View/Always on Top');
        }

        frame_handler.toggle_shadow(g_properties.show_window_shadow);

        create_button_images();

        if (g_properties.show_cpu_usage) {
            cpu_usage_tracker.start();
        }
    }

    function create_buttons(x_arg, y_arg, w_arg, h_arg) {
        if (buttons) {
            buttons.reset();
        }
        buttons = new _.buttons();
        buttons.show_tt = g_properties.show_tooltips;

        //---> Menu buttons
        if (pss_switch.minimode.state === 'Full') {
            var img = button_images.File;
            var x = x_arg + 1;
            var y = y_arg + 1;
            var h = img.normal.Height;
            var w = img.normal.Width;
            buttons.buttons.file = new _.button(x, y, w, h, button_images.File, function(xx, yy, x, y, h, w) { _.menu_item(x, y + h, 'File'); });

            img = button_images.Edit;
            x += w;
            w = img.normal.Width;
            buttons.buttons.edit = new _.button(x, y, w, h, button_images.Edit, function(xx, yy, x, y, h, w) { _.menu_item(x, y + h, 'Edit'); });

            img = button_images.View;
            x += w;
            w = img.normal.Width;
            buttons.buttons.view = new _.button(x, y, w, h, button_images.View, function(xx, yy, x, y, h, w) { _.menu_item(x, y + h, 'View'); });

            img = button_images.Playback;
            x += w;
            w = img.normal.Width;
            buttons.buttons.playback = new _.button(x, y, w, h, button_images.Playback, function(xx, yy, x, y, h, w) { _.menu_item(x, y + h, 'Playback'); });

            img = button_images.Library;
            x += w;
            w = img.normal.Width;
            buttons.buttons.library = new _.button(x, y, w, h, button_images.Library, function(xx, yy, x, y, h, w) { _.menu_item(x, y + h, 'Library'); });

            img = button_images.Help;
            x += w;
            w = img.normal.Width;
            buttons.buttons.help = new _.button(x, y, w, h, button_images.Help, function(xx, yy, x, y, h, w) { _.menu_item(x, y + h, 'Help'); });

            left_pad = x + w;
        }
        else {
            var x = x_arg + 1;
            var y = y_arg + 1;
            var h = button_images.Menu.normal.Height;
            var w = button_images.Menu.normal.Width;

            buttons.buttons.menu = new _.button(x, y, w, h, button_images.Menu, function(xx, yy, x, y, h, w) { _.menu(x, y + h); });

            left_pad = x + w;
        }

        //---> Caption buttons
        var button_count = 0;

        // Pin\Unpin switch
        ++button_count;

        // UltraMiniMode switch
        ++button_count;

        if (pss_switch.minimode.state !== 'UltraMini') {// Minimode
            ++button_count;
        }

        if (UIHacks.FrameStyle !== FrameStyle.Default) {
            // Min
            ++button_count;

            // Max
            if (pss_switch.minimode.state === 'Full') {
                ++button_count;
            }

            // Close
            if (UIHacks.FrameStyle !== FrameStyle.SmallCaption || UIHacks.FullScreen) {
                ++button_count;
            }
        }

        var y = y_arg + 1;
        var w = 22;
        var h = w;
        var p = 3;
        var x = w_arg - w * button_count - p * (button_count - 1);

        right_pad = x;

        buttons.buttons.pin = new _.button(x, y, w, h, fb.AlwaysOnTop ? button_images.Unpin : button_images.Pin, function() {
            fb.RunMainMenuCommand('View/Always on Top');
        }, fb.AlwaysOnTop ? 'Unpin window' : 'Pin window on Top');

        buttons.refresh_pin_button = function() {
            buttons.buttons.pin.set_image(fb.AlwaysOnTop ? button_images.Unpin : button_images.Pin);
            buttons.buttons.pin.tiptext = fb.AlwaysOnTop ? 'Unpin window' : 'Pin window on Top';
            buttons.buttons.pin.repaint();
        };

        var ultraMiniModeBtnArr =
            {
                MiniModeExpandToMini: {
                    ico: button_images.MiniModeExpand,
                    txt: 'Change to playlist mode'
                },
                MiniModeExpandToFull: {
                    ico: button_images.MiniModeExpand,
                    txt: 'Change to full mode'
                },
                MiniModeCompress:     {
                    ico: button_images.UltraMiniModeCompress,
                    txt: 'Change to art mode'
                }
            };

        var ultraMiniModeBtn = (pss_switch.minimode.state === 'Mini' || pss_switch.minimode.state === 'Full')
            ? ultraMiniModeBtnArr.MiniModeCompress
            : ((g_properties.saved_mode === 'Full')
                ? ultraMiniModeBtnArr.MiniModeExpandToFull
                : ultraMiniModeBtnArr.MiniModeExpandToMini);

        x += w + p;
        buttons.buttons.ultraminimode = new _.button(x, y, w, h, ultraMiniModeBtn.ico, _.bind(mode_handler.toggle_ultra_mini_mode, mode_handler), ultraMiniModeBtn.txt);

        if (pss_switch.minimode.state !== 'UltraMini') {
            var miniModeBtnArr =
                {
                    MiniModeExpand:   {
                        ico: button_images.MiniModeExpand,
                        txt: 'Change to full mode'
                    },
                    MiniModeCompress: {
                        ico: button_images.MiniModeCompress,
                        txt: 'Change to playlist mode'
                    }
                };

            var miniModeBtn = (pss_switch.minimode.state === 'Mini') ? miniModeBtnArr.MiniModeExpand : miniModeBtnArr.MiniModeCompress;

            x += w + p;
            buttons.buttons.minimode = new _.button(x, y, w, h, miniModeBtn.ico, _.bind(mode_handler.toggle_mini_mode, mode_handler), miniModeBtn.txt);
        }

        if (UIHacks.FrameStyle !== FrameStyle.Default) {
            x += w + p;
            buttons.buttons.minimize = new _.button(x, y, w, h, button_images.Minimize, function() { fb.RunMainMenuCommand('View/Hide'); }, 'Minimize');

            if (pss_switch.minimode.state === 'Full') {
                x += w + p;
                buttons.buttons.maximize = new _.button(x, y, w, h, button_images.Maximize, function() {
                    try {
                        if (g_properties.maximize_to_fullscreen ? !utils.IsKeyPressed(VK_CONTROL) : utils.IsKeyPressed(VK_CONTROL)) {
                            UIHacks.FullScreen = !UIHacks.FullScreen;
                        }
                        else if (UIHacks.MainWindowState === WindowState.Maximized) {
                            UIHacks.MainWindowState = WindowState.Normal;
                        }
                        else {
                            UIHacks.MainWindowState = WindowState.Maximized;
                        }
                    }
                    catch (e) {
                        console.log(e + ' Disable WSH safe mode');
                    }

                    buttons.buttons.maximize.tiptext = (UIHacks.FullScreen || UIHacks.MainWindowState === WindowState.Maximized)
                        ? 'Restore' : 'Maximize'

                }, (UIHacks.FullScreen || UIHacks.MainWindowState === WindowState.Maximized) ? 'Restore' : 'Maximize');
            }

            if (UIHacks.FrameStyle !== FrameStyle.SmallCaption || UIHacks.FullScreen) {
                x += w + p;
                buttons.buttons.close = new _.button(x, y, w, h, button_images.Close, function() { fb.Exit(); }, 'Close');
            }
        }
    }

    function create_button_images() {
        var fontMarlett = gdi.font('Marlett', 13);
        var fontAwesome = gdi.font('FontAwesome', 12);
        var fontSegoeUi = gdi.font('Segoe Ui Semibold', 12);

        var default_menu_text_colors =
            [
                _.RGB(140, 142, 144),
                _.RGB(180, 182, 184),
                _.RGB(120, 122, 124)
            ];

        var default_menu_rect_colors =
            [
                _.RGB(120, 122, 124),
                _.RGB(170, 172, 174),
                _.RGB(110, 112, 114)
            ];

        var default_ico_colors =
            [
                _.RGB(140, 142, 144),
                _.RGB(190, 192, 194),
                _.RGB(100, 102, 104)
            ];

        var btn =
            {
                Pin:                   {
                    ico:  '\uF08D',
                    font: fontAwesome,
                    id:   'caption',
                    w:    22,
                    h:    22
                },
                Unpin:                 {
                    ico:  '\uF08D',
                    font: fontAwesome,
                    id:   'caption',
                    w:    22,
                    h:    22
                },
                MiniModeExpand:        {
                    ico:  '\uF065',
                    font: fontAwesome,
                    id:   'caption',
                    w:    22,
                    h:    22
                },
                MiniModeCompress:      {
                    ico:  '\uF066',
                    font: fontAwesome,
                    id:   'caption',
                    w:    22,
                    h:    22
                },
                UltraMiniModeCompress: {
                    ico:  '\uF1AA',
                    font: fontAwesome,
                    id:   'caption',
                    w:    22,
                    h:    22
                },
                Minimize:              {
                    ico:  '0',
                    font: fontMarlett,
                    id:   'caption',
                    w:    22,
                    h:    22
                },
                Maximize:              {
                    ico:  '1',
                    font: fontMarlett,
                    id:   'caption',
                    w:    22,
                    h:    22
                },
                Close:                 {
                    ico:  'r',
                    font: fontMarlett,
                    id:   'caption',
                    w:    22,
                    h:    22
                },
                Menu:                  {
                    ico:  'Menu',
                    font: fontSegoeUi,
                    id:   'menu'
                },
                File:                  {
                    ico:  'File',
                    font: fontSegoeUi,
                    id:   'menu'
                },
                Edit:                  {
                    ico:  'Edit',
                    font: fontSegoeUi,
                    id:   'menu'
                },
                View:                  {
                    ico:  'View',
                    font: fontSegoeUi,
                    id:   'menu'
                },
                Playback:              {
                    ico:  'Playback',
                    font: fontSegoeUi,
                    id:   'menu'
                },
                Library:               {
                    ico:  'Library',
                    font: fontSegoeUi,
                    id:   'menu'
                },
                Help:                  {
                    ico:  'Help',
                    font: fontSegoeUi,
                    id:   'menu'
                },
                Playlists:             {
                    ico:  'Playlists',
                    font: fontSegoeUi,
                    id:   'menu'
                }
            };

        _.forEach(btn, function(item, i) {
            if (item.id === 'menu') {
                var img = gdi.CreateImage(100, 100);
                var g = img.GetGraphics();

                item.w = Math.ceil(
                    /** @type {!number} */
                    g.MeasureString(item.ico, item.font, 0, 0, 0, 0).Width
                ) + 17;
                img.ReleaseGraphics(g);
                img.Dispose();
                item.h = 21;
            }

            var w = item.w,
                h = item.h,
                lw = 2;

            var stateImages = []; //0=normal, 1=hover, 2=down;

            for (var s = 0; s <= 2; ++s) {
                var img = gdi.CreateImage(w, h);
                var g = img.GetGraphics();
                g.SetSmoothingMode(SmoothingMode.HighQuality);
                g.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
                g.FillSolidRect(0, 0, w, h, g_theme.colors.panel_front); // Cleartype is borked, if drawn without background

                if (item.id === 'menu') {
                    var menuTextColor = default_menu_text_colors[s];
                    var menuRectColor = default_menu_rect_colors[s];

                    if (s !== 0) {
                        g.DrawRect(Math.floor(lw / 2), Math.floor(lw / 2), w - lw, h - lw, 1, menuRectColor);
                    }
                    g.DrawString(item.ico, item.font, menuTextColor, 0, 0, w, h - 1, g_string_format.align_center);
                }
                else if (item.id === 'caption') {
                    var captionIcoColor = default_ico_colors[s];

                    g.DrawString(item.ico, item.font, captionIcoColor, 0, 0, w, h, g_string_format.align_center);
                }

                if (i === 'Unpin') {
                    img.ReleaseGraphics(g);
                    var savedImg = img;

                    img = gdi.CreateImage(savedImg.Height, savedImg.Width);
                    g = img.GetGraphics();
                    g.SetSmoothingMode(SmoothingMode.HighQuality);
                    g.DrawImage(savedImg, -2, 0, savedImg.Width, savedImg.Height, 0, 0, savedImg.Height, savedImg.Width, 90, 255);
                }

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

    // public:
    var pad = 4;
    this.x = pad;
    this.y = pad;
    this.w = 0;
    this.h = 0;

    // private:

    // Mouse state
    var mouse_down = false;

    // Objects
    var frame_handler = new FrameStyleHandler();
    var mode_handler = new WindowModeHandler();
    var cpu_usage_tracker = new CpuUsageTracker(_.bind(this.repaint, this));
    var buttons = undefined;
    var button_images = [];

    var left_pad = 0;
    var right_pad = 0;

    var has_notified = false;

    initialize();
}

/**
 * @constructor
 */
function WindowModeHandler() {

    this.toggle_ultra_mini_mode = function() {
        if (pss_switch.minimode.state !== 'UltraMini') {
            g_properties.saved_mode = pss_switch.minimode.state;
        }
        var new_minimode_state = (pss_switch.minimode.state !== 'UltraMini') ? 'UltraMini' : g_properties.saved_mode;

        if (new_minimode_state === 'Mini') {
            pss_switch.minimode.state = new_minimode_state;

            set_window_size(g_properties.mini_mode_saved_width, g_properties.mini_mode_saved_height);

            UIHacks.MinSize.Width = 300;
            UIHacks.MinSize.Height = 250;
            UIHacks.MinSize = true;
        }
        else if (new_minimode_state === 'Full') {
            pss_switch.minimode.state = new_minimode_state;

            set_window_size(g_properties.full_mode_saved_width, g_properties.full_mode_saved_height);

            UIHacks.MinSize.Width = 650;
            UIHacks.MinSize.Height = 600;
            UIHacks.MinSize = true;
        }
        else {
            if (!UIHacks.FullScreen) {
                if (pss_switch.minimode.state === 'Full') {
                    if (fb_handle) {
                        g_properties.full_mode_saved_width = fb_handle.Width;
                        g_properties.full_mode_saved_height = fb_handle.Height;
                    }
                }
                else {
                    if (fb_handle) {
                        g_properties.mini_mode_saved_width = fb_handle.Width;
                        g_properties.mini_mode_saved_height = fb_handle.Height;
                    }
                }
            }
            else {
                UIHacks.FullScreen = false;
            }

            pss_switch.minimode.state = new_minimode_state;

            set_window_size(250, 250 + 28);

            UIHacks.MinSize.Width = 200;
            UIHacks.MinSize.Height = 200 + 28;
            UIHacks.MinSize = true;
        }
    };

    this.toggle_mini_mode = function() {
        var new_minimode_state = ((pss_switch.minimode.state === 'Mini') ? 'Full' : 'Mini');

        if (new_minimode_state === 'Mini') {
            if (!UIHacks.FullScreen) {
                if (fb_handle) {
                    g_properties.full_mode_saved_width = fb_handle.Width;
                    g_properties.full_mode_saved_height = fb_handle.Height;
                }
            }
            else {
                UIHacks.FullScreen = false;
            }

            pss_switch.minimode.state = new_minimode_state;

            set_window_size(g_properties.mini_mode_saved_width, g_properties.mini_mode_saved_height);

            UIHacks.MinSize.Width = 300;
            UIHacks.MinSize.Height = 250;
            UIHacks.MinSize = true;
        }
        else {
            if (!UIHacks.FullScreen) {
                if (fb_handle) {
                    g_properties.mini_mode_saved_width = fb_handle.Width;
                    g_properties.mini_mode_saved_height = fb_handle.Height;
                }
            }
            else {
                UIHacks.FullScreen = false;
            }

            pss_switch.minimode.state = new_minimode_state;

            set_window_size(g_properties.full_mode_saved_width, g_properties.full_mode_saved_height);

            UIHacks.MinSize.Width = 650;
            UIHacks.MinSize.Height = 600;
            UIHacks.MinSize = true;
        }
    };

    this.set_window_size_limits_for_mode = function(miniMode) {
        var minW = 0,
            maxW = 0,
            minH = 0,
            maxH = 0;
        if (miniMode === 'UltraMini') {
            minW = 200;
            minH = 200 + 28;
        }
        else if (miniMode === 'Mini') {
            minW = 300;
            minH = 250;
        }
        else {
            minW = 650;
            minH = 600;
        }

        set_window_size_limits(minW, maxW, minH, maxH);
    };

    this.fix_window_size = function() {
        if (fb_handle) {
            var last_w = fb_handle.Width;
            var last_h = fb_handle.Height;
        }
        else {
            var was_first_launch = g_properties.is_first_launch;
        }

        if (g_properties.is_first_launch) {
            if (pss_switch.minimode.state === 'Full') {
                // Workaround for window size on first theme launch
                set_window_size(895, 650);
            }
            g_properties.is_first_launch = false;
        }

        // Workaround for messed up settings file or properties
        this.set_window_size_limits_for_mode(pss_switch.minimode.state);

        if (fb_handle) {
            return last_w !== fb_handle.Width || last_h !== fb_handle.Height;
        }
        else {
            return was_first_launch;
        }
    };

    function set_window_size(width, height) {
        //To avoid resizing bugs, when the window is bigger\smaller than the saved one.
        UIHacks.MinSize = false;
        UIHacks.MaxSize = false;
        UIHacks.MinSize.Width = width;
        UIHacks.MinSize.Height = height;
        UIHacks.MaxSize.Width = width;
        UIHacks.MaxSize.Height = height;

        UIHacks.MaxSize = true;
        UIHacks.MaxSize = false;
        UIHacks.MinSize = true;
        UIHacks.MinSize = false;

        window.NotifyOthers('minimode_state_size', pss_switch.minimode.state);
    }

    function set_window_size_limits(minW, maxW, minH, maxH) {
        UIHacks.MinSize = !!minW;
        UIHacks.MinSize.Width = minW;

        UIHacks.MaxSize = !!maxW;
        UIHacks.MaxSize.Width = maxW;

        UIHacks.MinSize = !!minH;
        UIHacks.MinSize.Height = minH;

        UIHacks.MaxSize = !!maxH;
        UIHacks.MaxSize.Height = maxH;
    }

    var fb_handle = g_has_modded_jscript ? qwr_utils.get_top_theme_window() : undefined;
}

/**
 * @constructor
 */
function FrameStyleHandler() {
    this.change_style = function(style) {
        switch (style) {
            case FrameStyle.Default:
                UIHacks.FrameStyle = FrameStyle.Default;
                UIHacks.MoveStyle = MoveStyle.Default;
                this.disable_caption();
                break;
            case FrameStyle.SmallCaption:
                UIHacks.FrameStyle = FrameStyle.SmallCaption;
                UIHacks.MoveStyle = MoveStyle.Default;
                this.disable_caption();
                break;
            case FrameStyle.NoCaption:
                UIHacks.FrameStyle = FrameStyle.NoCaption;
                UIHacks.MoveStyle = MoveStyle.Default;
                break;
            case FrameStyle.NoBorder:
                UIHacks.FrameStyle = FrameStyle.NoBorder;
                UIHacks.MoveStyle = MoveStyle.Default;
                break;
            default:
                throw new ArgumentError('frame_style', style);
        }

        update_caption_state();
    };

    this.disable_caption = function() {
        this.set_caption(0, 0, 0, 0);
    };

    this.set_caption = function(x_arg, y_arg, w_arg, h_arg) {
        if (x_arg !== x || y_arg !== y || w_arg !== w || h_arg !== h) {
            x = x_arg;
            y = y_arg;
            w = w_arg;
            h = h_arg;
            UIHacks.SetPseudoCaption(x, y, w, h);
        }
    };

    this.toggle_shadow = function(show_window_shadow) {
        if (show_window_shadow && UIHacks.FrameStyle === FrameStyle.NoBorder) {
            UIHacks.Aero.Effect = 2;
            UIHacks.Aero.Top = 1;
        }
        else {
            UIHacks.Aero.Effect = 0;
            UIHacks.Aero.Left = UIHacks.Aero.Top = UIHacks.Aero.Right = UIHacks.Aero.Bottom = 0;
        }
    };

    function update_caption_state() {
        that.has_true_caption = (UIHacks.FrameStyle === FrameStyle.Default || UIHacks.FrameStyle === FrameStyle.SmallCaption) && !UIHacks.FullScreen;
    }

    this.has_true_caption = undefined;

    var that = this;

    var x;
    var y;
    var w;
    var h;

    update_caption_state();
}

/**
 * @constructor
 */
function CpuUsageTracker(on_change_callback_arg) {
    this.start = function() {
        start_cpu_usage_timer();
    };

    this.stop = function() {
        stop_cpu_usage_timer();
    };

    this.get_cpu_usage = function() {
        return cpu_usage;
    };

    this.get_gui_cpu_usage = function() {
        return gui_cpu_usage;
    };

    function start_cpu_usage_timer() {
        if (_.isNil(cpu_usage_timer)) {
            cpu_usage_timer = setInterval(function() {

                var floatUsage = UIHacks.FoobarCPUUsage;

                var baseLine;

                if (fb.IsPlaying && !fb.IsPaused) {
                    playing_usage.update(floatUsage);
                    baseLine = playing_usage.average_usage;
                }
                else {
                    idle_usage.update(floatUsage);
                    baseLine = idle_usage.average_usage;
                }

                cpu_usage = floatUsage.toFixed(1);

                var usageDiff = Math.max((floatUsage - baseLine), 0);
                usageDiff = (usageDiff <= 0.5 ? 0 : usageDiff); // Supress low spikes
                gui_cpu_usage = usageDiff.toFixed(1);

                on_change_callback();
            }, 1000);
        }
    }

    function stop_cpu_usage_timer() {
        if (!_.isNil(cpu_usage_timer)) {
            clearInterval(cpu_usage_timer);
            cpu_usage_timer = undefined;
        }
        idle_usage.reset();
        playing_usage.reset();
    }

    var cpu_usage = 0;
    var gui_cpu_usage = 0;
    var cpu_usage_timer = undefined;
    var idle_usage = new AverageUsageFunc();
    var playing_usage = new AverageUsageFunc();

    var on_change_callback = on_change_callback_arg;
}

/**
 * @constructor
 */
function AverageUsageFunc() {
    this.update = function(current_usage) {
        if (current_sample_count) {
            if (this.average_usage - current_usage > 2) {
                if (reset_sample_count < 3) {
                    reset_sample_count++;
                }
                else {
                    this.reset();
                }
            }
            else if (Math.abs(current_usage - this.average_usage) < 2) // Suppress high spikes
            {
                recalculate_average(current_usage);
            }
        }
        else {
            recalculate_average(current_usage);
        }
    };

    this.reset = function() {
        current_sample_count = 0;
        reset_sample_count = 0;
        acum_usage = 0;
        this.average_usage = 0;
    };

    function recalculate_average(current_usage) {
        if (current_sample_count < sampleCount) {
            acum_usage += current_usage;
            ++current_sample_count;

            that.average_usage = acum_usage / current_sample_count;
        }
        else {
            that.average_usage -= that.average_usage / sampleCount;
            that.average_usage += current_usage / sampleCount;
        }
    }

    this.average_usage = 0;

    var that = this;

    var sampleCount = 30;
    var current_sample_count = 0;
    var reset_sample_count = 0;
    var acum_usage = 0;
}
