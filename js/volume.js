_.mixin({
    /** @constructor */
    volume: function (x, y, w, h) {
        this.repaint = function () {
            var expXY = 3,
                expWH = expXY * 2;
            window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);
        };
        this.volume_change = function () {
            this.repaint();
        };
 
        this.trace = function (x, y) {
            var m = this.drag ? 200 : 0;
            return x > this.x - m && x < this.x + this.w + m && y > this.y - m && y < this.y + this.h + m;
        };
 
        this.wheel = function (s) {
            if (!this.trace(this.mx, this.my)) {
                return false;
            }
 
            if (s > 0) {
                fb.VolumeUp();
            }
            else {
                fb.VolumeDown();
            }
 
            if (this.show_tt) {
                var text = fb.Volume.toFixed(2) + ' dB';
                this.tt.showImmediate(text);
            }
 
            return true;
        };
 
        this.move = function (x, y) {
            this.mx = x;
            this.my = y;
            if (this.trace(x, y) || this.drag) {
                y -= this.y;
                var pos = y < 0 ? 1 : y > this.h ? 0 : 1 - y / this.h;
                this.drag_vol = _.toDb(pos);
                if (this.drag) {
                    fb.Volume = this.drag_vol;
                    if (this.show_tt) {
                        var text = fb.Volume.toFixed(2) + ' dB';
                        this.tt.showImmediate(text);
                    }
 
                }
 
                if (!this.hover) {
                    this.hover = true;
                    if (this.show_tt) {
                        var text = fb.Volume.toFixed(2) + ' dB';
                        this.tt.showDelayed(text);
                    }
                    alpha_timer.start();
                }
 
                return true;
            }
            else {
                if (this.hover) {
                    this.tt.clear();
 
                    this.hover = false;
                    alpha_timer.start();
                }
                this.drag = false;
 
                return false;
            }
        };
 
        this.lbtn_down = function (x, y) {
            if (this.trace(x, y)) {
                this.drag = true;
                return true;
            }
            else {
                return false;
            }
        };
 
        this.lbtn_up = function (x, y) {
            if (this.trace(x, y)) {
                if (this.drag) {
                    this.drag = false;
                    fb.Volume = this.drag_vol;
                }
                return true;
            }
            else {
                return false;
            }
        };
 
        this.leave = function () {
            if (this.drag) {
                return;
            }
 
            if (this.hover) {
                this.hover = false;
                alpha_timer.start();
            }
            this.tt.clear();
            this.drag = false;
        };
 
        this.pos = function (type) {
            return _.ceil((type === "h" ? this.h : this.w) * (Math.pow(10, fb.Volume / 50) - 0.01) / 0.99);
        };
 
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.mx = 0;
        this.my = 0;
        this.hover = false;
        this.hover_alpha = 0;
        this.drag = false;
        this.drag_vol = 0;
        this.show_tt = true; //false;
        this.tt = new _.tt_handler;
 
        var that = this;
 
        var alpha_timer = new _alpha_timer([that], function (item) {
            return item.hover;
        });
    }
});

_.tt_handler.tt_timer = new function () {
    var tooltip_timer;
    var tt_caller = undefined;

    this.start = function (id, text) {
        var old_caller = tt_caller;
        tt_caller = id;

        if (!tooltip_timer && g_tooltip.Text) {
            _.tt(text, old_caller !== tt_caller );
        }
        else {
            this.force_stop(); /// < There can be only one tooltip present at all times, so we can kill the timer w/o any worries

            if (!tooltip_timer) {
                tooltip_timer = window.SetTimeout(_.bind(function () {
                    _.tt(text);
                    tooltip_timer = null;
                }, this), 500);
            }
        }
    };

    this.stop = function (id) {
        if (tt_caller === id) {// Do not stop other callers
            this.force_stop();
        }
    };

    this.force_stop = function () {
        _.tt("");
        if (tooltip_timer) {
            window.ClearTimeout(tooltip_timer);
            tooltip_timer = null;
        }
    };
};

function VolumeBtn() {
    this.on_paint = function (gr) {
 
            var sliderBackColor = RGB(37, 37, 37);
            // var sliderBarColor = RGB(190, 192, 194);
           
            // VolBar
            if (show_volume_bar) {
                var p = 3;
                var x = volume_bar.x,
                    y = volume_bar.y,
                    w = volume_bar.w,
                    h = volume_bar.h;
 
                var fillHeight = volume_bar.pos('h');

                gr.FillSolidRect(x, y + p, w, h, col.bg);
                gr.FillSolidRect(x, y + p + h - fillHeight, w, fillHeight - 1, col.progress_fill);
                gr.DrawRect(x, y + p, w, h, 1, col.progress_bar);
            }
        }
   
 
    this.on_size = function () {
        this.w = window.Width;
        this.h = window.Height;
 
        var playback_y = this.h - playback_h;
        // create_buttons(0, playback_y, this.w, playback_h);
 
        var volume_bar_y = playback_y + Math.floor(playback_h / 2 - volume_bar_w / 2 - 10);
        volume_bar = new _.volume(volume_bar_x, volume_bar_y, Math.min(this.w - volume_bar_x - 4, 180), volume_bar_w);
 
    };

    this.set_position = function (x, y, btnWidth) {
        this.w = window.Width;
        this.h = window.Height;
        var center = Math.floor(btnWidth / 2);

        volume_bar_x = x;
        volume_bar_y = y
        volume_bar = new _.volume(volume_bar_x + center - volume_bar_w / 2, volume_bar_y + center, volume_bar_w, Math.min(this.h - volume_bar_y - 4, 180));        
    }
 
    this.on_mouse_move = function (x, y, m) {
        qwr_utils.DisableSizing(m);
 
        if (volume_bar.drag) {
            volume_bar.move(x, y);
            return;
        }
 
        if (!mouse_in_panel) {
            mouse_in_panel = true;
        }
 
        if (show_volume_bar) {
            var trace_pad = 2;
            if ((volume_bar.x - 2 * trace_pad <= x) && (x <= volume_bar.x + volume_bar.w + trace_pad) && (volume_bar.y - trace_pad <= y) && (y <= volume_bar.y + volume_bar.h + trace_pad)) {
                volume_bar.move(x, y);
            }
            else {
                this.showVolumeBar(false);
                volume_bar.show_tt = false;
                volume_bar.repaint();
            }
        }
 
    };
 
    this.on_mouse_lbtn_down = function (x, y, m) {
        if (show_volume_bar) {
            return volume_bar.lbtn_down(x, y);
        }
        return false;
    };
 
    this.on_mouse_lbtn_up = function (x, y, m) {
        qwr_utils.EnableSizing(m);
 
        if (show_volume_bar) {
            return volume_bar.lbtn_up(x, y);
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
        if (volume_bar.drag) {
            return;
        }
 
        if (mouse_in_panel) {
            mouse_in_panel = false;
        }
 
        if (show_volume_bar) {
            volume_bar.showVolumeBar(false);
            buttons.buttons.volume.hide = false;
            volume_bar.repaint();
            buttons.refresh_vol_button();
        }
    };
 
    this.on_volume_change = function (val) {
        if (show_volume_bar) {
            volume_bar.volume_change();
        }
    };

    this.showVolumeBar = function (show) {
        show_volume_bar = show;
        volume_bar.repaint();
    }

    function initialize() {
        create_button_images();
 
        if (!window.IsVisible) {
            that.on_size(1, 1);
        }
    }
 
    function create_button_images() {
 
        var fontGuifx_15 = gdi.Font(g_guifx.name, 24);
        var default_ico_colors =
            [
                RGB(160, 160, 160),
                RGB(100, 100, 100),
                RGB(100, 100, 100)
            ];
        var playbackEllypseColor =
            [
                RGB(220, 220, 220),
                RGB(200, 200, 200),
                RGB(200, 200, 200)
            ];
        var btn =
            {
                ShowVolume: {
                    ico:  g_guifx.mute2,
                    font: fontGuifx_15,
                    id:   'transport',
                    w:    30,
                    h:    30
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
                lw = 1;
                g.SetSmoothingMode(SmoothingMode.HighQuality);
                g.SetTextRenderingHint(TextRenderingHint.AntiAlias);
 
                var volumeEllypseColor = playbackEllypseColor[s];
                // Needs to be fixed ---> g.DrawEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, lw, volumeEllypseColor);
                var ico_color = default_ico_colors[s];
                g.DrawString(item.ico, item.font, ico_color, (i === 'Stop') ? 0 : 1, 0, w, h);
 
 
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
 
    /**
     * @const
     * @type {number}
     */
 
    var volume_bar_w = is_4k ? 14 : 28;
    /**
     * @const
     * @type {number}
     */
    var playback_h = 30;
 
    // Const after init
    var button_images = [];
    var volume_bar_x = 0;
 
    // Runtime state
    var panel_alpha = 255;
    var mouse_in_panel = false;
    var show_volume_bar = false;
 
    // Objects
    var buttons = undefined;
    var volume_bar = undefined;
 
    initialize();
   
}