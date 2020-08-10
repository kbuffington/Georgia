
class Timeline {
    constructor(height) {
        this.x = 0;
        this.y = 0;
        this.w = albumart_size.x;
        this.h = height;

        this.playCol = rgba(255, 255, 255, 75); // TODO: remove from theme.js

        /** @private */ this.firstPlayedPercent = 0.33;
        /** @private */ this.lastPlayedPercent = 0.66;
        /** @private */ this.playedTimesPercents = [];
        /** @private */ this.playedTimes = [];

        // recalc'd in setSize
        /** @private */ this.lineWidth = is_4k ? 3 : 2;
        /** @private */ this.extraLeftSpace = scaleForDisplay(3); // add a little space to the left so songs that were played a long time ago show more in the "added" stage
        /** @private */ this.drawWidth = Math.floor(this.w - this.extraLeftSpace - 1 - this.lineWidth / 2); // area that the timeline percents can be drawn in
        /** @private */ this.leeway = (1 / this.drawWidth) * (this.lineWidth + scaleForDisplay(2)) / 2; // percent of timeline that we use to determine if mouse is over a playline. Equals half line with + 1 or 2 pixels on either side

        this.tooltipText = '';
    }

    setColors(addedCol, playedCol, unplayedCol) {
        this.addedCol = addedCol;
        this.playedCol = playedCol;
        this.unplayedCol = unplayedCol;
    };

    setPlayTimes(firstPlayed, lastPlayed, playedTimeRatios, playedTimesValues) {
        this.firstPlayedPercent = firstPlayed;
        this.lastPlayedPercent = lastPlayed;
        this.playedTimesPercents = playedTimeRatios;
        this.playedTimes = playedTimesValues;
    };

    setSize(x, y, width) {
        if (this.x !== x || this.y !== y || this.w !== width) {
            this.x = x;
            this.y = y;
            this.w = width;

            // recalc these values
            this.lineWidth = is_4k ? 3 : 2;
            this.extraLeftSpace = scaleForDisplay(3); // add a little space to the left so songs that were played a long time ago show more in the "added" stage
            this.drawWidth = Math.floor(this.w - this.extraLeftSpace - 1 - this.lineWidth / 2);
            this.leeway = (1 / this.drawWidth) * (this.lineWidth + scaleForDisplay(2)) / 2;
        }
    };

    setHeight(height) {
        this.h = height;
    };

    draw(gr) {
        if (this.addedCol && this.playedCol && this.unplayedCol) {
            gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing

            gr.FillSolidRect(0, this.y, this.drawWidth + this.extraLeftSpace + this.lineWidth, this.h, this.addedCol);
            if (this.firstPlayedPercent >= 0 && this.lastPlayedPercent >= 0) {
                const x1 = Math.floor(this.drawWidth * this.firstPlayedPercent) + this.extraLeftSpace;
                const x2 = Math.floor(this.drawWidth * this.lastPlayedPercent) + this.extraLeftSpace;
                gr.FillSolidRect(x1, this.y, this.drawWidth - x1 + this.extraLeftSpace, this.h, this.playedCol);
                gr.FillSolidRect(x2, this.y, this.drawWidth - x2 + this.extraLeftSpace + this.lineWidth, this.h, this.unplayedCol);
            }
            for (let i = 0; i < this.playedTimesPercents.length; i++) {
                const x = Math.floor(this.drawWidth * this.playedTimesPercents[i]) + this.extraLeftSpace;
                if (!isNaN(x)) {
                    gr.DrawLine(x, this.y, x, this.y + this.h, this.lineWidth, this.playCol);
                } else {
                    // console.log('Played Times Error! ratio: ' + this.playedTimesPercents[i], 'x: ' + x);
                }
            }
            gr.SetSmoothingMode(SmoothingMode.AntiAlias);
        }
    };

    mouseInThis(x, y) {
        var inTimeline = (x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h);
        if (!inTimeline && this.tooltipText.length) {
            this.clearTooltip();
        }
        return inTimeline;
    };

    on_mouse_move(x, y, m) {
        if (pref.show_timeline_tooltips) {
            let tooltip = '';
            let percent = toFixed((x + this.x - this.extraLeftSpace) / this.drawWidth, 3);

            // TODO: is this really slow with hundreds of plays?
            for (var i = 0; i < this.playedTimesPercents.length; i++) {
                if (percent >= this.playedTimesPercents[i] - this.leeway && percent < this.playedTimesPercents[i] + this.leeway) {
                    var date = new Date(this.playedTimes[i]);
                    if (tooltip.length) {
                        tooltip += '\n';
                    }
                    tooltip += date.toLocaleString();
                }
                else if (percent < this.playedTimesPercents[i]) {
                    // the list is sorted so we can abort early
                    if (!tooltip.length) {
                        if (i === 0) {
                            tooltip = 'First played after ' + dateDiff($date('%added%'), this.playedTimes[0]);
                        } else {
                            tooltip = 'No plays for ' + dateDiff(new Date(this.playedTimes[i - 1]).toISOString(), this.playedTimes[i]);
                        }
                    }
                    break;
                }
            }
            if (tooltip.length) {
                this.tooltipText = tooltip;
                tt.showImmediate(this.tooltipText);
            } else {
                this.clearTooltip();
            }
        }
    };

    clearTooltip() {
        this.tooltipText = '';
        tt.stop();
    };
}
