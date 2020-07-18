function Timeline (height) {
    this.y = 0;
    this.w = albumart_size.x;
    this.h = height;

    this.addedCol;
    this.playedCol;
    this.unplayedCol;
    this.playCol = rgba(255, 255, 255, 75); // TODO: remove from theme.js

    var firstPlayedPercent = 0.33;
    var lastPlayedPercent = 0.66;
    var playedTimesPercents = [];
    var playedTimes = [];

    // recalc'd in setSize
    var lineWidth = is_4k ? 3 : 2;
    var extraLeftSpace = scaleForDisplay(3); // add a little space to the left so songs that were played a long time ago show more in the "added" stage
    var drawWidth = Math.floor(this.w - extraLeftSpace - 1 - lineWidth / 2);   // area that the timeline percents can be drawn in
    var leeway = (1 / drawWidth) * (lineWidth + scaleForDisplay(2)) / 2; // percent of timeline that we use to determine if mouse is over a playline. Equals half line with + 1 or 2 pixels on either side

    var tooltipText = ''

    this.setColors = function (addedCol, playedCol, unplayedCol) {
        this.addedCol = addedCol;
        this.playedCol = playedCol;
        this.unplayedCol = unplayedCol;
    }

    this.setPlayTimes = function (firstPlayed, lastPlayed, playedTimeRatios, playedTimesValues) {
        firstPlayedPercent = firstPlayed;
        lastPlayedPercent = lastPlayed;
        playedTimesPercents = playedTimeRatios;
        playedTimes = playedTimesValues;
    }

    this.setSize = function(x, y, width) {
        if (this.x !== x || this.y !== y || this.w !== width) {
            this.x = x;
            this.y = y;
            this.w = width;

            // recalc these values
            lineWidth = is_4k ? 3 : 2;
            extraLeftSpace = scaleForDisplay(3); // add a little space to the left so songs that were played a long time ago show more in the "added" stage
            drawWidth = Math.floor(this.w - extraLeftSpace - 1 - lineWidth / 2);
            leeway = (1 / drawWidth) * (lineWidth + scaleForDisplay(2)) / 2;
        }
    }

    this.setHeight = function (height) {
        this.h = height;
    }

    this.draw = function (gr) {
        if (this.addedCol && this.playedCol && this.unplayedCol) {
            gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing

            gr.FillSolidRect(0, this.y, drawWidth + extraLeftSpace + lineWidth, this.h, this.addedCol);
            if (firstPlayedPercent >= 0 && lastPlayedPercent >= 0) {
                const x1 = Math.floor(drawWidth * firstPlayedPercent) + extraLeftSpace;
                const x2 = Math.floor(drawWidth * lastPlayedPercent) + extraLeftSpace;
                gr.FillSolidRect(x1, this.y, drawWidth - x1 + extraLeftSpace, this.h, this.playedCol);
                gr.FillSolidRect(x2, this.y, drawWidth - x2 + extraLeftSpace + lineWidth, this.h, this.unplayedCol);
            }
            for (let i = 0; i < playedTimesPercents.length; i++) {
                const x = Math.floor(drawWidth * playedTimesPercents[i]) + extraLeftSpace;
                if (!isNaN(x)) {
                    gr.DrawLine(x, this.y, x, this.y + this.h, lineWidth, this.playCol);
                } else {
                    // console.log('Played Times Error! ratio: ' + playedTimesPercents[i], 'x: ' + x);
                }
            }
            gr.SetSmoothingMode(SmoothingMode.AntiAlias);
        }
    }

    this.mouse_in_this = function (x, y) {
        var inTimeline = (x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h);
        if (!inTimeline && tooltipText.length) {
            this.clearTooltip();
        }
        return inTimeline;
    }

    this.on_mouse_move = function (x, y, m) {
        if (pref.show_timeline_tooltips) {
            let tooltip = '';
            let percent = toFixed((x + this.x - extraLeftSpace) / drawWidth, 3);

            // TODO: is this really slow with hundreds of plays?
            for (var i = 0; i < playedTimesPercents.length; i++) {
                if (percent >= playedTimesPercents[i] - leeway && percent < playedTimesPercents[i] + leeway) {
                    var date = new Date(playedTimes[i]);
                    if (tooltip.length) {
                        tooltip += '\n';
                    }
                    tooltip += date.toLocaleString();
                } else if (percent < playedTimesPercents[i]) {
                    // the list is sorted so we can abort early
                    if (!tooltip.length) {
                        if (i === 0) {
                            tooltip = 'First played after ' + dateDiff($date('%added%'), playedTimes[0]);
                        } else {
                            tooltip = 'No plays for ' + dateDiff(new Date(playedTimes[i - 1]).toISOString(), playedTimes[i]);
                        }
                    }
                    break;
                }
            }
            if (tooltip.length) {
                tooltipText = tooltip;
                tt.showImmediate(tooltipText);
            } else {
                this.clearTooltip();
            }
        }
    }

    this.clearTooltip = function() {
        tooltipText = '';
        tt.stop();
    }
}