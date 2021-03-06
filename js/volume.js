class Volume {
    constructor (x, y, w, h) {
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

        this.alpha_timer = new _alpha_timer([this], function (item) {
            return item.hover;
        });
    }

    repaint() {
        var expXY = 3,
            expWH = expXY * 2;
        window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);
    }

    volume_change() {
        this.repaint();
    }

    trace(x, y) {
        var m = this.drag ? 200 : 0;
        return x > this.x - m && x < this.x + this.w + m && y > this.y - m && y < this.y + this.h + m;
    }

    wheel(s) {
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
    }

    move(x, y) {
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
                this.alpha_timer.start();
            }

            return true;
        }
        else {
            if (this.hover) {
                this.tt.clear();

                this.hover = false;
                this.alpha_timer.start();
            }
            this.drag = false;

            return false;
        }
    }

    lbtn_down(x, y) {
        if (this.trace(x, y)) {
            this.drag = true;
            return true;
        }
        else {
            return false;
        }
    }

    lbtn_up(x, y) {
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
    }

    leave() {
        if (this.drag) {
            return;
        }

        if (this.hover) {
            this.hover = false;
            this.alpha_timer.start();
        }
        this.tt.clear();
        this.drag = false;
    }

    pos(type) {
        return _.ceil((type === "h" ? this.h : this.w) * (Math.pow(10, fb.Volume / 50) - 0.01) / 0.99);
    }
}

class VolumeBtn {

    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;

        /**
         * @const
         * @type {number}
         */

        this.volume_bar_w = scaleForDisplay(28);
        this.trace_pad = Math.min(this.volume_bar_w / 2);
        this.volume_bar_h = scaleForDisplay(180);
        /**
         * @const
         * @type {number}
         */
        this.playback_h = 30;

        // Const after init
        this.volume_bar_x = 0;

        // Runtime state
        this.mouse_in_panel = false;
        this.show_volume_bar = false;

        // Objects
        this.volume_bar = undefined;

        this.initialize();
    }

    on_paint(gr) {
        // VolBar
        if (this.show_volume_bar) {
            var p = 3;
            var x = this.volume_bar.x,
                y = this.volume_bar.y,
                w = this.volume_bar.w,
                h = this.volume_bar.h;

            var fillHeight = this.volume_bar.pos('h');
            var lineThickness = scaleForDisplay(1);

            let fillColor = col.primary;
            gr.FillSolidRect(x, y + p, w, h, col.bg);
            if (colorDistance(col.primary, col.progress_bar) < 105 && pref.darkMode) {
                fillColor = rgb(255,255,255);
            } else if (colorDistance(col.primary, col.bg) < 105) {
                fillColor = col.darkAccent;
            }
            gr.FillSolidRect(x, y + p + h - fillHeight, w, fillHeight, fillColor);
            gr.DrawRect(x, y + p, w, h - lineThickness, lineThickness, col.progress_bar);
        }
    }


    on_size() {
        this.w = window.Width;
        this.h = window.Height;

        const playback_y = this.h - this.playback_h;
        const volume_bar_y = playback_y + Math.floor(this.playback_h / 2 - this.volume_bar_w / 2 - 10);
        this.volume_bar = new Volume(this.volume_bar_x, volume_bar_y, Math.min(this.w - this.volume_bar_x - 4, this.volume_bar_h), this.volume_bar_w);

    }

    set_position(x, y, btnWidth) {
        this.w = window.Width;
        this.h = window.Height;
        var center = Math.floor(btnWidth / 2);

        this.volume_bar_x = x;
        const volume_bar_y = y;
        this.volume_bar = new Volume(this.volume_bar_x + center - this.volume_bar_w / 2, volume_bar_y + center, this.volume_bar_w, Math.min(this.h - volume_bar_y - 4, this.volume_bar_h));
    }

    on_mouse_move(x, y, m) {
        qwr_utils.DisableSizing(m);

        if (this.volume_bar.drag) {
            this.volume_bar.move(x, y);
            return;
        }

        if (this.show_volume_bar && this.volume_bar.trace(x, y)) {
            this.mouse_in_panel = true;
        } else {
            this.mouse_in_panel = false;
        }

        if (this.show_volume_bar) {
            if (x > this.volume_bar.x - this.trace_pad &&
                x < this.volume_bar.x + this.volume_bar.w + this.trace_pad &&
                y >= this.volume_bar.y - this.trace_pad - 3 &&
                y < this.volume_bar.y + this.volume_bar.h + this.trace_pad) {
                this.volume_bar.move(x, y);
            }
            else {
                this.showVolumeBar(false);
                this.volume_bar.show_tt = false;
                this.volume_bar.repaint();
            }
        }

    }

    on_mouse_lbtn_down(x, y, m) {
        if (this.show_volume_bar) {
            return this.volume_bar.lbtn_down(x, y);
        }
        return false;
    }

    on_mouse_lbtn_up(x, y, m) {
        qwr_utils.EnableSizing(m);

        if (this.show_volume_bar) {
            return this.volume_bar.lbtn_up(x, y);
        }
    }

    on_mouse_wheel(delta) {
        if (this.mouse_in_panel) {
            if (!this.show_volume_bar || !this.volume_bar.wheel(delta)) {
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
    }

    on_mouse_leave() {
        if (this.volume_bar.drag) {
            return;
        }

        if (this.mouse_in_panel) {
            this.mouse_in_panel = false;
        }

        if (this.show_volume_bar) {
            this.showVolumeBar(false);
            this.volume_bar.repaint();
        }
    }

    on_volume_change(val) {
        if (this.show_volume_bar) {
            this.volume_bar.volume_change();
        }
    }

    showVolumeBar(show) {
        this.show_volume_bar = show;
        this.volume_bar.repaint();
    }

    initialize() {
        if (!window.IsVisible) {
            this.on_size();
        }
    }
}