function PauseButton() {
	this.xCenter = 0;
	this.yCenter = 0;
	this.top = 0;
	this.left = 0;

	this.setCoords = function(xCenter, yCenter) {
		this.xCenter = xCenter;
		this.yCenter = yCenter;
		this.top = Math.round(this.yCenter - geo.pause_size / 2);
		this.left = Math.round(this.xCenter - geo.pause_size / 2);
	}

	this.draw = function (gr) {
		var pauseBorderWidth = is_4k ? 4 : 2;
		var halfBorderWidth = Math.floor(pauseBorderWidth / 2);

		gr.FillRoundRect(this.left, this.top, geo.pause_size, geo.pause_size,
				0.1*geo.pause_size, 0.1*geo.pause_size, rgba(0,0,0,150));
		gr.DrawRoundRect(this.left + halfBorderWidth, this.top + halfBorderWidth, geo.pause_size - pauseBorderWidth, geo.pause_size - pauseBorderWidth,
				0.1*geo.pause_size, 0.1*geo.pause_size, pauseBorderWidth, rgba(128,128,128,60));
		gr.FillRoundRect(this.left + 0.26*geo.pause_size, this.top + 0.25 * geo.pause_size,
									 0.12*geo.pause_size, 0.5*geo.pause_size, 2,2, rgba(255,255,255,160));
		gr.FillRoundRect(this.left + 0.62*geo.pause_size, this.top + 0.25 * geo.pause_size,
									 0.12*geo.pause_size, 0.5*geo.pause_size, 2,2, rgba(255,255,255,160));
	}

	this.repaint = function() {
		window.repaintRect(this.left - 1, this.top - 1, geo.pause_size + 2, geo.pause_size + 2);
	}

	this.trace = function(x, y) {
		// console.log(x, y, this.top, x >= this.left, y >= this.top, x < this.left + geo.pause_size + 1, y <= this.top + geo.pause_size + 1)
		return (x >= this.left && y >= this.top && x < this.left + geo.pause_size + 1 && y <= this.top + geo.pause_size + 1);
	}
}