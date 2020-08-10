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
		var pauseBorderWidth = scaleForDisplay(2);
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
		window.RepaintRect(this.left - 1, this.top - 1, geo.pause_size + 2, geo.pause_size + 2);
	}

	this.trace = function(x, y) {
		// console.log(x, y, this.top, x >= this.left, y >= this.top, x < this.left + geo.pause_size + 1, y <= this.top + geo.pause_size + 1)
		return (x >= this.left && y >= this.top && x < this.left + geo.pause_size + 1 && y <= this.top + geo.pause_size + 1);
	}
}

class ProgressBar {
	/**
	 * @param {number} ww window width
	 * @param {number} wh window height
	 */
	constructor(ww, wh) {
		this.x = 0.025 * ww;
		this.y = 0;
		this.w = 0.95 * ww;
		this.h = geo.prog_bar_h;
		this.progressLength = 0; // fixing jumpiness in progressBar
		this.progressMoved = false; // playback position changed, so reset progressLength
		this.drag = false;	// progress bar is being dragged
	}

	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	setY(y) {
		this.y = y;
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		if (pref.show_progress_bar) {
			gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
			// if (pref.darkMode) {
			//     // TODO: keep this? Only do when accent is too close?
			//     gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
			//     gr.DrawRect(this.x - 0.5, this.y - 0.5, Math.round(this.w), this.h, 1, col.darkAccent);
			//     gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
			// }
			gr.FillSolidRect(this.x, this.y, Math.round(this.w), this.h, col.progress_bar);

			if (fb.PlaybackLength) {
				var progressStationary = false;
				/* in some cases the progress bar would move backwards at the end of a song while buffering/streaming was occurring.
					This created strange looking jitter so now the progress bar can only increase unless the user seeked in the track. */
				if (this.progressMoved || Math.floor(this.w * (fb.PlaybackTime / fb.PlaybackLength)) > this.progressLength) {
					this.progressLength = Math.floor(this.w * (fb.PlaybackTime / fb.PlaybackLength));
				} else {
					progressStationary = true;
				}
				this.progressMoved = false;
				gr.FillSolidRect(this.x, this.y, this.progressLength, this.h, col.progress_fill);
				if (pref.darkMode) {
					gr.DrawRect(this.x, this.y, this.progressLength, this.h - 1, 1, col.darkAccent);
				}
				if (progressStationary && fb.IsPlaying && !fb.IsPaused) {
					if (col.accent !== last_accent_col || progressAlphaCol === undefined) {
						var c = new Color(col.accent);
						progressAlphaCol = rgba(c.r, c.g, c.b, 100); // fake anti-aliased edge so things look a little smoother
						last_accent_col = col.accent;
					}
					gr.DrawLine(this.progressLength + this.x + 1, this.y, this.progressLength + this.x + 1, this.y + this.h - 1, 1, progressAlphaCol);
				}
			}
		}
	}

	on_size(windowWidth, windowHeight) {
		this.x = windowWidth ? 0.025 * windowWidth : 0;
		this.y = 0;
		this.w = 0.95 * windowWidth;
		this.h = geo.prog_bar_h;
	}

	on_mouse_lbtn_down(x, y) {
		this.drag = true;
	}

	on_mouse_lbtn_up(x, y) {
		this.drag = false;
		if (this.mouse_in_this(x, y)) {
			this.setPlaybackTime(x);
		}
	}

	on_mouse_move(x, y) {
		if (this.drag) {
			this.setPlaybackTime(x);
		}
	}

	mouse_in_this(x, y) {
		return (x >= this.x && y >= this.y && x < this.x + this.w && y <= this.y + this.h);
	}

	/** @private
	 * @param {number} x
	 */
	setPlaybackTime(x) {
		let v = (x - this.x) / this.w;
		v = (v < 0) ? 0 : (v < 1) ? v : 1;
		if (fb.PlaybackTime !== v * fb.PlaybackLength) {
			fb.PlaybackTime = v * fb.PlaybackLength;
		}
	}
}