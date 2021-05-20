class Volume {
    constructor (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.mx = 0;
        this.my = 0;
        this.clickX = 0;
        this.clickY = 0;
        this.drag = false;
        this.drag_vol = 0;
        this.tt = new TooltipHandler();
    }

    /**
     * Determines if a point is "inside" the bounds of the volume control.
     * @param {number} x
     * @param {number} y
     */
    trace(x, y) {
        // const margin = this.drag ? 200 : 0; // the area the mouse can go outside physical bounds of the volume control
        const margin = 0; // the area the mouse can go outside physical bounds of the volume control
        return x > this.x - margin &&
                x < this.x + this.w + margin &&
                y > this.y - margin &&
                y < this.y + this.h + margin;
    }

    /**
     * @param {number} scrollAmt
     */
    wheel(scrollAmt) {
        if (!this.trace(this.mx, this.my)) {
            return false;
        }

        scrollAmt > 0 ? fb.VolumeUp() : fb.VolumeDown();

        return true;
    }


    move(x, y) {
        this.mx = x;
        this.my = y;

        if (this.clickX && this.clickY && (this.clickX !== x || this.clickY !== y)) {
            this.drag = true;
        }

        if (this.trace(x, y) || this.drag) {
            if (this.drag) {
                y -= this.y;
                const maxAreaExtraHeight = 5;   // give a little bigger target area to select -0.00dB
                const pos = (y < maxAreaExtraHeight) ?
                        1 :
                        (y > this.h) ?
                            0 :
                            1 - (y - maxAreaExtraHeight) / (this.h - maxAreaExtraHeight);
                this.drag_vol = _.toDb(pos);
                fb.Volume = this.drag_vol;
            }

            return true;

        } else {
            this.drag = false;

            return false;
        }
    }

    lbtn_down(x, y) {
        if (this.trace(x, y)) {
            this.clickX = x;
            this.clickY = y;
            this.move(x, y);    // force volume to update without needing to move or release lbtn
            return true;
        } else {
            return false;
        }
    }

    lbtn_up(x, y) {
        this.clickX = 0;
        this.clickY = 0;
        if (this.drag) {
            this.drag = false;
            return true;
        }
        const inVolumeSlider = this.trace(x,y);
        if (inVolumeSlider) {
            // we had not started a drag
            this.drag = true;
            this.move(x,y); // adjust volume
            this.drag = false;
        }
        return inVolumeSlider;
    }

    leave() {
        this.drag = false;
    }

    /**
     * Returns the size in pixels of the fill portion of the volume bar, based on current volume
     * @param {string} type Either 'h' or 'w' for vertical or horizontal volume bars
     */
    fillSize(type) {
        return Math.ceil((type === "h" ? this.h : this.w) * (Math.pow(10, fb.Volume / 50) - 0.01) / 0.99);
    }
}

class VolumeBtn {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = scaleForDisplay(28);
        this.h = scaleForDisplay(180);

        this.inThisPadding = Math.min(this.w / 2);
        this.volTextW = scaleForDisplay(150);
        this.volTextH = scaleForDisplay(30);


        // Runtime state
        this.mouse_in_panel = false;
        this.show_volume_bar = false;

        // Objects
        /** @type {Volume} */
        this.volume_bar = undefined;
    }

    /**
     * @param {GdiGraphics} gr
     */
    on_paint(gr) {
        if (this.show_volume_bar) {
            const x = this.x,
                y = this.y,
                w = this.w,
                h = this.h;

            const fillHeight = this.volume_bar.fillSize('h');
            const lineThickness = scaleForDisplay(1);

            let fillColor = col.primary;
            gr.FillSolidRect(x, y, w, h, col.bg);
            if (colorDistance(col.primary, col.progress_bar) < 105 && pref.darkMode) {
                fillColor = rgb(255,255,255);
            } else if (colorDistance(col.primary, col.bg) < 105) {
                fillColor = col.darkAccent;
            }
            gr.FillSolidRect(x, y + h - fillHeight, w, fillHeight, fillColor);
            gr.DrawRect(x, y, w, h - lineThickness, lineThickness, col.progress_bar);
            const volume = fb.Volume.toFixed(2) + ' dB';
            const volFont = ft.album_sml;
            const volMeasurements = gr.MeasureString(volume, volFont, 0, 0, 0, 0);
            const volHeight = volMeasurements.Height;
            const volWidth = volMeasurements.Width + 1;
            const border = scaleForDisplay(3);
            let txtY = y;
            if (transport.displayBelowArtwork) {
                txtY = this.y - this.h - this.volTextH - scaleForDisplay(2);
            }
            gr.FillSolidRect(x - border, txtY + h, volWidth + border * 2, volHeight + border, rgba(0, 0, 0, 128));
            gr.DrawString(volume, volFont, rgb(0,0,0), x - 1, txtY - 1 + h, this.volTextW, this.volTextH);
            gr.DrawString(volume, volFont, rgb(0,0,0), x - 1, txtY + 1 + h, this.volTextW, this.volTextH);
            gr.DrawString(volume, volFont, rgb(0,0,0), x + 1, txtY - 1 + h, this.volTextW, this.volTextH);
            gr.DrawString(volume, volFont, rgb(0,0,0), x + 1, txtY + 1 + h, this.volTextW, this.volTextH);
            gr.DrawString(volume, volFont, rgb(255,255,255), x, txtY + h, this.volTextW, this.volTextH);
        }
    }

    repaint() {
        const xyPadding = scaleForDisplay(3), whPadding = xyPadding * 2;
        window.RepaintRect(this.x - xyPadding, this.volume_bar.y - xyPadding, this.volume_bar.w + whPadding, this.volume_bar.h + whPadding);

        let txtY = this.y + this.h;
        if (transport.displayBelowArtwork) {
            txtY = this.y - this.volTextH;
        }
        window.RepaintRect(this.x - xyPadding, txtY, this.volTextW + xyPadding, this.volTextH + xyPadding);
    }

    setPosition(x, y, btnWidth) {
        const wh = window.Height;
        this.w = btnWidth - 2;
        const center = Math.floor(this.w / 2);

        this.x = x;
        if (transport.displayBelowArtwork) {
            this.y = y + center - this.h;
        } else {
            this.y = y + center + scaleForDisplay(3);
        }
        this.volume_bar = new Volume(this.x, this.y, this.w, Math.min(wh - this.y - 4, this.h));
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
            if (this.mouseInThis(x, y)) {
                this.volume_bar.move(x, y);
            } else {
                this.showVolumeBar(false);
                this.repaint();
            }
        }
    }

    mouseInThis(x, y) {
        const padding = this.inThisPadding;
        if (x > this.x - padding &&
            x <= this.x + this.w + padding &&
            y > this.y - this.w &&  // allow entire button height to be considered
            y <= this.y + this.h + padding) {
            return true;
        }
        return false;
    }

    on_mouse_lbtn_down(x, y, m) {
        if (this.show_volume_bar) {
            const val = this.volume_bar.lbtn_down(x, y);
            return val;
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
        if (!this.volume_bar || this.volume_bar.drag) {
            return;
        }

        this.mouse_in_panel = false;

        if (this.show_volume_bar) {
            this.showVolumeBar(false);
            this.repaint();
        }
        this.volume_bar.leave();
    }

    on_volume_change(val) {
        if (this.show_volume_bar) {
            this.repaint();
        }
    }

    /**
     * Show the Volume Bar
     * @param {boolean} show
     */
    showVolumeBar(show) {
        this.show_volume_bar = show;
        this.repaint();
        if (show) {
            this.volume_bar.tt.stop();
        }
    }

    /**
     * Toggles volume bar on/off
     */
    toggleVolumeBar() {
        this.showVolumeBar(!this.show_volume_bar);
    }
}