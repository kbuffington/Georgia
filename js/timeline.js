function Timeline (height) {
    this.y = 0;
    this.w = albumart_size.x;
    this.h = height;

    this.addedCol;
    this.playedCol;
    this.unplayedCol;
    this.playCol = rgba(255, 255, 255, 75); // TODO: remove from theme.js

    this.firstPlayedPercent = 0.33;
    this.lastPlayedPercent = 0.66;
    this.playedTimesPercents = [];

    this.setColors = function (addedCol, playedCol, unplayedCol) {
        this.addedCol = addedCol;
        this.playedCol = playedCol;
        this.unplayedCol = unplayedCol;
    }

    this.setPlayTimes = function (firstPlayed, lastPlayed, playedTimes) {
        this.firstPlayedPercent = firstPlayed;
        this.lastPlayedPercent = lastPlayed;
        this.playedTimesPercents = playedTimes;
    }

    this.setSize = function(x, y, width) {
        this.x = x;
        this.y = y;
        this.w = width;
    }

    this.setHeight = function (height) {
        this.h = height;
    }
}

Timeline.prototype.draw = function (gr) {
    if (this.addedCol && this.playedCol && this.unplayedCol) {
        var extraLeftSpace = is_4k ? 6 : 3; // add a little space to the left so songs that were played a long time ago show more in the "added" stage
        var lineWidth = is_4k ? 3 : 2;
        gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
        width = Math.floor(this.w - extraLeftSpace - 1 - lineWidth + lineWidth / 2);

        gr.FillSolidRect(0, this.y, width + extraLeftSpace + lineWidth, this.h, this.addedCol);
        if (this.firstPlayedPercent >= 0 && this.lastPlayedPercent >= 0) {
            x1 = Math.floor(width * this.firstPlayedPercent) + extraLeftSpace;
            x2 = Math.floor(width * this.lastPlayedPercent) + extraLeftSpace;
            gr.FillSolidRect(x1, this.y, width - x1 + extraLeftSpace, this.h, this.playedCol);
            gr.FillSolidRect(x2, this.y, width - x2 + extraLeftSpace + lineWidth, this.h, this.unplayedCol);
        }
        for (i = 0; i < this.playedTimesPercents.length; i++) {
            x = Math.floor(width * this.playedTimesPercents[i]) + extraLeftSpace;
            if (!isNaN(x)) {
                gr.DrawLine(x, this.y, x, this.y + this.h, lineWidth, this.playCol);
            } else {
                // console.log('Played Times Error! ratio: ' + this.playedTimesPercents[i], 'x: ' + x);
            }
        }
        gr.SetSmoothingMode(SmoothingMode.AntiAlias);
    }
}

Timeline.prototype.mouse_in_this = function (x, y) {
    return (x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h);
}