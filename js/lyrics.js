// Lyrics Variables
var len_seconds = fb.TitleFormat('%length_seconds%');
var elap_seconds = fb.TitleFormat('%playback_time_seconds%');

var g_timer_abs;

// TODO: Improve this variable names
var g_tab = [];
var g_scroll = 0;
var g_lyrics_path;
var g_lyrics_filename;
var g_lyrics_status;
var focus = 0;
var focus_next = 0;
var hundredth = 0;
var g_is_scrolling = false;
var g_tab_length;

var midpoint; // this is the center of the lyrics, where the highlighted line will display
var lyrPos; // this is the absolute yPosition of the very first line in the lyrics. It will start at midpoint and then move up and off the screen
var lyricsWidth = 0; // minimum width needed to display the lyrics to speed up drawing


const LYRICS_TIMER_INTERVAL = 30; // do not modify this value
const SCROLL_TIME = 300;	// max time in ms for new line to scroll

// Lyrics Objects

class sentence {
	constructor() {
		this.timer = 0;
		this.text = '';
		this.total_lines = 0;
		this.ante_lines = 0;
		this.ToString = function ToString() {
			var str = "timer= " + this.timer + " text: " + this.text + " total_lines= " + this.total_lines + " ante_lines= " + this.ante_lines;
			return str;
		}
	}
}

/**
 * @typedef {Object} LineObj
 * @property {string} lyric the text of the line
 * @property {string} timeStamp the timestamp string
 * @property {float} time the timestamp as a float value in seconds
 * @property {number} timeMs the timestamp as an integer in milliseconds
 * @property {boolean} focus does the line have focus
 */

class Line {
	constructor(lyricJson) {
		this.time = 0;
		this.timeStamp = '';
		this.lyric = '';
		this.focus = false;
		Object.assign(this, lyricJson);
		this.timeMs = Math.round(this.time * 1000);
		this.lines = 0;
		this.width = 0;
		this.height = 0;
		this.y = 0;
	}

	/**
	 * @param {GdiGraphics} gr
	 * @param {number} w Width
	 * @param {number} h Height
	 * @param {number} minHeight minimum height of a line (used for blank lines)
	 * @param {number} yPosition yVal of the line in the list of lyrics
	 */
	calcSize(gr, w, h, minHeight, yPosition) {
		const strInfo = gr.MeasureString(this.lyric, ft.lyrics, 0, 0, w, h);
		this.lines = strInfo.Lines;
		this.width = strInfo.Width;
		this.height = Math.min(Math.max(minHeight, strInfo.Height), h / 2);	// at least minHeight (for blank lines) and no more than half artwork height
		this.y = yPosition;
	}

	/**
	 * @param {GdiGraphics} gr
	 * @param {number} yOffset
	 */
	draw(gr, x, width, yOffset, highlightActive) {
		const color = highlightActive && this.focus ? g_txt_highlightcolour : g_txt_normalcolour;
		const center = StringFormat(1, 1, 4);	// center with ellipses

		// drop shadow behind text
		gr.DrawString(this.lyric, ft.lyrics, g_txt_shadowcolor, x - 1, this.y + yOffset, width, this.height + 1, center);
		gr.DrawString(this.lyric, ft.lyrics, g_txt_shadowcolor, x, this.y + yOffset - 1, width, this.height + 1, center);
		gr.DrawString(this.lyric, ft.lyrics, g_txt_shadowcolor, x + 2, this.y + yOffset + 2, width, this.height + 1, center);
		// text
		gr.DrawString(this.lyric, ft.lyrics, color, x, this.y + yOffset, width, this.height + 1, center);
	}
}

/** @enum {number} */
const LyricsType = {
	None:       0,
	Synced:     1,
	Unsynced:   2
}

const timeStampRegex = /^(\s*\[\d{1,2}:\d\d(]|\.\d{1,3}]))+/;
const singleTimestampRegex = /^\s*(\[\d{1,2}:\d\d(]|\.\d{1,3}]))/;

/** @type {Lyrics} */
let gLyrics;

class Lyrics {
	/**
	 * @param {FbMetadbHandle} metadb
	 * @param {?*} lyrics User specified lyrics
	 */
	constructor(metadb, lyrics = undefined) {
		this.songLength = parseInt(len_seconds.Eval());
		/** @type {Line[]} */
		this.lines = [];
		this.metadb = metadb;
		this.lyricsType = LyricsType.None;
		this.fileName = '';
		this.activeLine = -1;	// index into this.lines
		this.scrolling = false;
		this.scrollOffset = 0;
		this.scrollStep = 0;	// when scrolling to a new value, how much should we scroll
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
		this.lineSpacing = scaleForDisplay(10);
		this.lineHeight = 0;
		this.getLyrics();
		/** @protected */
		this.timerId = 0;
		if (fb.IsPlaying) {
			this.seek();
			if (!fb.IsPaused) {
				this.startTimer();
			}
		}
	}

	// Callbacks
	on_size(x, y, w, h) {
		this.x = x + pref.lyrics_h_padding;
		this.y = y + pref.lyrics_h_padding;
		this.w = w - pref.lyrics_h_padding * 2;	// should width/height be split?
		this.h = h - pref.lyrics_h_padding * 2;
		this.lineSpacing = scaleForDisplay(10);
		if (this.lines.length && this.w > 10 && this.h > 100) {
			const tmpImg = gdi.CreateImage(this.w, Math.round(this.h / 5));
			const gr = tmpImg.GetGraphics();
			const minHeight = gr.MeasureString('I', ft.lyrics, 0, 0, this.w, this.h).Height;
			for (let i = 0, yPos = 0; i < this.lines.length; i++) {
				this.lines[i].calcSize(gr, this.w, this.h, minHeight, yPos);
				yPos += this.lines[i].height + this.lineSpacing;
			}
			tmpImg.ReleaseGraphics(gr);
		}
		this.repaint();
	}


	on_playback_pause(state) {
		if (state) {
			this.clearTimer();
		} else {	// unpausing
			this.startTimer();
		}
	}

	on_playback_stop(reason) {
		this.clearTimer();
		this.lines = [];
	}

	clearTimer() {
		if (this.timerId) {
			clearInterval(this.timerId);
			this.timerId = 0;
		}
	}

	startTimer() {
		this.clearTimer();
		this.timerId = setInterval(() => { this.timerTick(); }, LYRICS_TIMER_INTERVAL);
	}

	// Methods
	getLyrics() {
		const tpath = [];
		const tfilename = [];
		let foundLyrics = false;

		for (let i=0; i < tf.lyr_path.length; i++) {
			tpath.push(fb.TitleFormat(tf.lyr_path[i]).Eval());
		}
		for (let i=0; i < tf.lyr_filename.length; i++) {
			tfilename.push(fb.TitleFormat(tf.lyr_filename[i]).Eval());
		}

		let i = 0;
		while (!foundLyrics && i < tpath.length) {
			let j = 0;
			while(!foundLyrics && j < tfilename.length) {
				foundLyrics = this.checkFile(tpath[i], tfilename[j]);
				j++;
			}
			i++;
		}
		let rawLyrics = [];
		if (foundLyrics) {
			console.log('Found Lyrics:', this.fileName);
			rawLyrics = utils.ReadTextFile(this.fileName).split('\n');
		} else {
			rawLyrics = $(tf.lyrics).split('\n');
		}
		if (rawLyrics) {
			this.processLyrics(rawLyrics);
		}
	}

	/**
	 * Sets the focus line. Should be called when playback starts, or whenever seeking in the file
	 */
	seek() {
		const time = Math.round(fb.PlaybackTime * 1000);
		this.lines.forEach(l => l.focus = false);
		const index = this.lines.findIndex(l => l.timeMs >= time);
		this.activeLine = index === -1 ? this.lines.length - 1 : Math.max(0, index - 1);	// if time > all timeMs values, then we're on the last line of the song, otherwise choose previous line
		if (this.activeLine >= 0) {
			this.lines[this.activeLine].focus = true;
			this.repaint();
		}
	}

	/**
	 * @param {string} path
	 * @param {string} filename
	 */
	checkFile(path, filename) {
		var found = true;
		if (IsFile(path + filename + '.lrc')) {
			this.fileName = path + filename + '.lrc';
		} else if (IsFile(path + filename + '.txt')) {
			this.fileName = path + filename + '.txt';
		} else {
			found = false;
		}
		return found;
	}

	/**
	 * @param {String[]} rawLyrics
	 */
	processLyrics(rawLyrics) {
		let tsCount = 0;

		rawLyrics.forEach(line => {
			if (timeStampRegex.test(line)) {
				tsCount++;
			}
		})
		if (tsCount > rawLyrics.length * .3) {
			this.lyricsType = LyricsType.Synced;
		}
		let lyrics = [{ timeStamp: '00:00.00', time: 0, lyric: '' }];
		if (this.lyricsType === LyricsType.Synced) {
			rawLyrics.forEach(line => {
				const r = timeStampRegex.exec(line);
				if (r && r[0]) {
					// line has at least one timestamp
					let timestampStr = r[0];
					const lyric = line.substr(timestampStr.length).trim()
							.replace(/\u2019/g,"'").replace(/\uFF07/g,"'").replace(/\u00E2\u20AC\u2122/g, "'"); // replace apostrophes

					let ts;
					while (timestampStr.length && (ts = singleTimestampRegex.exec(timestampStr))) {
						timestampStr = timestampStr.substr(ts[0].length);
						const timeComponents = ts[0].trim().replace('[','').replace(']','').split(':');
						const time = (parseInt(timeComponents[0]) * 60) + parseFloat(timeComponents[1]);
						lyrics.push({ timeStamp: ts[0], time, lyric });
					}
				}
			});
		} else {
			this.lyricsType = LyricsType.Unsynced;
			const unsyncedScrollDelay = Math.max(Math.floor(this.songLength * .08), 10);	// num seconds to wait before scrolling at start of song.
			const availSecs = this.songLength - unsyncedScrollDelay * 2;
			const lineTiming = availSecs / rawLyrics.length;
			rawLyrics.forEach((line, i) => {
				const lyric = line.trim()
						.replace(/\u2019/g,"'").replace(/\uFF07/g,"'").replace(/\u00E2\u20AC\u2122/g, "'"); // replace apostrophes
				const time = unsyncedScrollDelay + lineTiming * i;
				lyrics.push({ timeStamp: '--', time, lyric });
			});
			let done = false;
			while (lyrics.length && !done) {
				// remove all empty trailing lines
				if (!lyrics[lyrics.length - 1].lyric.length) {
					lyrics.pop();
				} else {
					done = true;
				}
			}
		}
		this.lines = lyrics.sort((a, b) => a.time - b.time).map(lyric => new Line(lyric));
	}

	timerTick() {
		/** @type {float} */
		const time = Math.round(fb.PlaybackTime * 1000);
		if ((this.lines.length > this.activeLine + 1) && (time > this.lines[this.activeLine + 1].timeMs)) {
			// advance active Line
			this.scrolling = true;
			if (this.activeLine !== -1) {
				this.lines[this.activeLine].focus = false;
				this.scrollOffset = this.lines[this.activeLine].height + this.lineSpacing;	// scrollOffset is actually the previously activeline that we want to scroll out of the way
				this.scrollStep = Math.max(1, Math.round(this.scrollOffset / (SCROLL_TIME / LYRICS_TIMER_INTERVAL)));
				// console.log(this.scrollOffset, this.scrollStep);
			} else {
				this.scrollOffset = 0;
			}
			this.lines[++this.activeLine].focus = true;
		} else if (this.scrolling) {
			this.scrollOffset = Math.max(0, this.scrollOffset - this.scrollStep);
			if (this.scrollOffset <= 0) {
				this.scrolling = false;
			}
			this.repaint();
		} else {
			// otherwise nothing to do this tick
		}
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	drawLyrics(gr) {
		if (this.lines.length && this.activeLine >= 0) {
			let activeTop = Math.floor(this.h * .37);	// position of the active line
			let extraSpacing = Math.floor(this.h * .26) * (this.activeLine / this.lines.length);
			activeTop += this.lines.length > 9 ? extraSpacing : 0;	// adjusting position looks dumb if very few lines
			const activeY = this.lines[this.activeLine].y;

			const viewportTop = activeY - activeTop;
			const highlightActive = this.lyricsType === LyricsType.Synced;
			this.lines.forEach(l => {
				if (l.y > viewportTop && l.y + l.height < this.h + viewportTop) {
					l.draw(gr, this.x, this.w, this.y - viewportTop + this.scrollOffset, highlightActive);
				}
			});
		}
	}

	repaint() {
		window.RepaintRect(this.x - 2, this.y - 2, this.w + 4, this.h + 4);
	}
}

/**
 * Load lyrics of NowPlaying song, and sets size of the lyrics draw area
 */
function initLyrics() {
	gLyrics = new Lyrics(fb.GetNowPlaying());
	gLyrics.on_size(albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h);
}
