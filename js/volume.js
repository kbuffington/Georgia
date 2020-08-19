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

function VolumeBtn() {
    this.on_paint = function (gr) {

            // VolBar
            if (show_volume_bar) {
                var p = 3;
                var x = volume_bar.x,
                    y = volume_bar.y,
                    w = volume_bar.w,
                    h = volume_bar.h;

                var fillHeight = volume_bar.pos('h');
                var lineThickness = scaleForDisplay(1);

                gr.FillSolidRect(x, y + p, w, h, col.bg);
                gr.FillSolidRect(x, y + p + h - fillHeight, w, fillHeight, col.primary);
                gr.DrawRect(x, y + p, w, h - lineThickness, lineThickness, col.progress_bar);
            }
        }


    this.on_size = function () {
        this.w = window.Width;
        this.h = window.Height;

        const playback_y = this.h - playback_h;
        const volume_bar_y = playback_y + Math.floor(playback_h / 2 - volume_bar_w / 2 - 10);
        volume_bar = new _.volume(volume_bar_x, volume_bar_y, Math.min(this.w - volume_bar_x - 4, volume_bar_h), volume_bar_w);

    };

    this.set_position = function (x, y, btnWidth) {
        this.w = window.Width;
        this.h = window.Height;
        var center = Math.floor(btnWidth / 2);

        volume_bar_x = x;
        const volume_bar_y = y;
        volume_bar = new _.volume(volume_bar_x + center - volume_bar_w / 2, volume_bar_y + center, volume_bar_w, Math.min(this.h - volume_bar_y - 4, volume_bar_h));
    }

    this.on_mouse_move = function (x, y, m) {
        qwr_utils.DisableSizing(m);

        if (volume_bar.drag) {
            volume_bar.move(x, y);
            return;
        }

        if (show_volume_bar && volume_bar.trace(x, y)) {
            mouse_in_panel = true;
        } else {
            mouse_in_panel = false;
        }

        if (show_volume_bar) {
            if (x > volume_bar.x - trace_pad && x < volume_bar.x + volume_bar.w + trace_pad && y >= volume_bar.y - trace_pad - 3 && y < volume_bar.y + volume_bar.h + trace_pad) {
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
            return true;
        }
        return false;
    };

    this.on_mouse_leave = function () {
        if (volume_bar.drag) {
            return;
        }

        if (mouse_in_panel) {
            mouse_in_panel = false;
        }

        if (show_volume_bar) {
            this.showVolumeBar(false);
            volume_bar.repaint();
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
        if (!window.IsVisible) {
            that.on_size(1, 1);
        }
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

    var volume_bar_w = scaleForDisplay(28);
    var trace_pad = Math.min(volume_bar_w / 2);
    var volume_bar_h = scaleForDisplay(180);
    /**
     * @const
     * @type {number}
     */
    var playback_h = 30;

    // Const after init
    var volume_bar_x = 0;

    // Runtime state
    var mouse_in_panel = false;
    var show_volume_bar = false;

    // Objects
    var volume_bar = undefined;

    initialize();

}