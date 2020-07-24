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
		this.height = Math.max(minHeight, strInfo.Height);
		this.y = yPosition;
		// console.log(this.height, this.y);
	}

	/**
	 * @param {GdiGraphics} gr
	 * @param {number} yOffset
	 */
	draw(gr, x, width, yOffset) {
		const color = this.focus ? g_txt_highlightcolour : g_txt_normalcolour;
		const center = StringFormat(1, 1);

		// pref.lyrics_glow && gr.DrawString(tab[i].text, ft.lyrics, g_txt_shadowcolor, albumart_size.x + (albumart_size.w - lyricsWidth) / 2 - 1, posy, lyricsWidth, lineHeight, g_txt_align);
		// pref.lyrics_glow && gr.DrawString(tab[i].text, ft.lyrics, g_txt_shadowcolor, albumart_size.x + (albumart_size.w - lyricsWidth) / 2, posy - 1, lyricsWidth, lineHeight, g_txt_align);
		// pref.lyrics_text_shadow && gr.DrawString(tab[i].text, ft.lyrics, g_txt_shadowcolor, albumart_size.x + (albumart_size.w - lyricsWidth) / 2 + 2, posy + 2, lyricsWidth, lineHeight, g_txt_align);
		// gr.DrawString(tab[i].text, ft.lyrics, text_color, albumart_size.x + (albumart_size.w - lyricsWidth) / 2, posy, lyricsWidth, lineHeight, g_txt_align);

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
	 * @param {?*} lyrics
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
			// this.lines.forEach(l => l.calcSize(gr, this.w, this.h, minHeight));
			tmpImg.ReleaseGraphics(gr);
		}
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
		while(!foundLyrics && i < tpath.length) {
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
		}
		if (rawLyrics) {
			this.processLyrics(rawLyrics);
		}
		// console.log(this.lines);
	}

	/**
	 * Sets the focus line. Should be called when playback starts, or whenever seeking in the file
	 */
	seek() {
		const time = Math.round(fb.PlaybackTime * 1000);
		if (this.lyricsType === LyricsType.Synced) {
			this.lines.forEach(l => l.focus = false);
			const index = this.lines.findIndex(l => l.timeMs >= time);
			this.activeLine = index === -1 ? this.lines.length - 1 : Math.max(0, index - 1);	// if time > all timeMs values, then we're on the last line of the song, otherwise choose previous line
			if (this.activeLine >= 0) {
				this.lines[this.activeLine].focus = true;
				this.repaint();
			}
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
					const lyric = line.substr(timestampStr.length).trim().replace(/\u2019/g,"'").replace(/\uFF07/g,"'"); // replace apostrophes

					let ts;
					while (timestampStr.length && (ts = singleTimestampRegex.exec(timestampStr))) {
						timestampStr = timestampStr.substr(ts[0].length);
						const timeComponents = ts[0].trim().replace('[','').replace(']','').split(':');
						const time = (parseInt(timeComponents[0]) * 60) + parseFloat(timeComponents[1]);
						lyrics.push({ timeStamp: ts[0], time, lyric });
					}
				}
			});
			this.lines = lyrics.sort((a, b) => a.time - b.time).map(lyric => new Line(lyric));
		} else { // LyricsType.Unsynced
		}
	}

	timerTick() {
		/** @type {float} */
		const time = Math.round(fb.PlaybackTime * 1000);
		if (this.lyricsType === LyricsType.Synced) {
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
				// console.log('scrolling', this.scrollOffset, this.scrolling);
			} else {
				// do nothing?
			}
		} else { // LyricsType.Unsynced

		}
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	drawLyrics(gr) {
		if (this.activeLine >= 0) {
			const halfHeight = Math.floor(this.h * .4);
			const activeY = this.lines[this.activeLine].y;// - this.lines[this.activeLine].height;

			const viewportTop = activeY - halfHeight;
			this.lines.forEach(l => {
				if (l.y > viewportTop && l.y + l.height < this.h + viewportTop) {
					l.draw(gr, this.x, this.w, this.y - viewportTop + this.scrollOffset);
				}
			});
			// console.log(activeY, halfHeight, viewportTop);
		}
	}

	repaint() {
		window.RepaintRect(this.x - 1, this.y - 1, this.w + 2, this.h + 2);
	}
}

// Lyrics Functions

function drawLyrics(gr, tab, posy) {
	var i, text_color;
	const divider_spacing = scaleForDisplay(40);
	let drawLyricsProfiler = null;

	if (timings.showDebugTiming)
		drawLyricsProfiler = fb.CreateProfiler("drawLyrics");
	// gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
	// var g_txt_align = StringFormat(1, 1);

	// for (i = 0; i < tab.length; i++) {
	// 	if (posy >= albumart_size.y + pref.lyrics_h_padding && posy < albumart_size.h - pref.lyrics_h_padding) {
	// 		if (i == focus && g_lyrics_status == 1) {
	// 			text_color = g_txt_highlightcolour;
	// 		} else {
	// 			if (g_lyrics_status == 0) {
	// 				text_color = g_txt_highlightcolour;
	// 			} else {
	// 				text_color = g_txt_normalcolour;
	// 			}
	// 		}
	// 		const lineHeight = tab[i].total_lines * pref.lyrics_line_height;
	// 		// maybe redo this to use albumart_size.x+(albumart_size.w-lyricsWidth)/2  and  lyricsWidth
	// 		pref.lyrics_glow && gr.DrawString(tab[i].text, ft.lyrics, g_txt_shadowcolor, albumart_size.x + (albumart_size.w - lyricsWidth) / 2 - 1, posy, lyricsWidth, lineHeight, g_txt_align);
	// 		pref.lyrics_glow && gr.DrawString(tab[i].text, ft.lyrics, g_txt_shadowcolor, albumart_size.x + (albumart_size.w - lyricsWidth) / 2, posy - 1, lyricsWidth, lineHeight, g_txt_align);
	// 		pref.lyrics_text_shadow && gr.DrawString(tab[i].text, ft.lyrics, g_txt_shadowcolor, albumart_size.x + (albumart_size.w - lyricsWidth) / 2 + 2, posy + 2, lyricsWidth, lineHeight, g_txt_align);
	// 		gr.DrawString(tab[i].text, ft.lyrics, text_color, albumart_size.x + (albumart_size.w - lyricsWidth) / 2, posy, lyricsWidth, lineHeight, g_txt_align);
	// 	}
	// 	posy = Math.floor(posy + pref.lyrics_line_height + ((tab[i].total_lines - 1) * pref.lyrics_line_height));
	// }
	// posy += divider_spacing;

	gLyrics.drawLyrics(gr);

	if (timings.showDebugTiming)
		drawLyricsProfiler.Print();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function timerTick() {
	if (displayLyrics) {
		// gLyrics.timerTick();

		var t1 = parseInt(elap_seconds.Eval()) * 100 + hundredth;
		var t2 = parseInt(len_seconds.Eval()) * 100;
		// console.log(elap_seconds.Eval(), t1, t2);
		var p1, p2;

		if (t1 > t2 - 200 && g_playtimer) {
			// stop scrolling in final 2 seconds to make sure we clear interval
			console.log('clearing g_playtimer because t1 > t2-200 - t1 = ' + t1 + ', t2 = ' + t2);
			clearInterval(g_playtimer);
			g_playtimer = null;
		}

		if (g_playtimer) {
			if (!g_is_scrolling && t1 >= g_tab[focus_next].timer) {
				p1 = g_tab[focus].ante_lines * pref.lyrics_line_height;
				p2 = g_tab[focus_next].ante_lines * pref.lyrics_line_height;
				g_scroll = (p2 - p1);
				// console.log("about to scroll " + g_scroll + " pixels");
				change_focus();
				g_is_scrolling = true;
			}
			g_timer_abs--;
			if (g_scroll > 0) {
				lyrPos -= g_scroll < SCROLL_STEP ? g_scroll : SCROLL_STEP;
				g_scroll -= g_scroll < SCROLL_STEP ? g_scroll : SCROLL_STEP;
				if (g_timer_abs <= 1) {
					g_timer_abs = 4;
					window.RepaintRect(albumart_size.x + (albumart_size.w - lyricsWidth) / 2, albumart_size.y + pref.lyrics_h_padding, lyricsWidth, albumart_size.h - pref.lyrics_h_padding * 2);
				}
			} else {
				g_timer_abs = 4;
				g_is_scrolling = false;
			}
		}
	}
	hundredth = (hundredth + 1) % 100;
}

function refresh_lyrics() {
	if (fb.IsPlaying || fb.IsPaused) {
		gLyrics = new Lyrics(fb.GetNowPlaying());
		gLyrics.on_size(albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h);

		let refreshLyricsProfiler = null;

		if (timings.showLyricsTiming) refreshLyricsProfiler = fb.CreateProfiler("refresh_lyrics");
		console.log("in refresh_lyrics() - g_lyrics_status = " + g_lyrics_status);
		g_scroll = 0;
		g_is_scrolling = false;
		get_lyrics();
		change_focus();
		console.log('Could set timerTick() - g_lyrics_status = ' + g_lyrics_status);
		if (g_lyrics_status > 0) {
			var k = g_tab[focus].ante_lines * pref.lyrics_line_height;
			lyrPos = midpoint - k;
			// g_playtimer && clearInterval(g_playtimer);
			// g_playtimer = setInterval(() => { timerTick(); }, LYRICS_TIMER_INTERVAL);
			g_timer_abs = 4;
		} else {
			const delta = (g_tab[g_tab.length-1].ante_lines + g_tab[g_tab.length-1].total_lines);
			lyrPos = Math.round((albumart_size.h / 2) - (delta * pref.lyrics_line_height / 2));
		}
		if (timings.showLyricsTiming) refreshLyricsProfiler.Print();
	}
}

function updateLyricsPositionOnScreen() {
	console.log("in updateLyricsPositionOnScreen() - albumart_size.h = " + albumart_size.h + ", g_lyrics_status= " + g_lyrics_status);

	if (albumart_size.h > 0) {
		lyrPos = 0;
		g_scroll = 0;
		g_is_scrolling = false;
		refresh_lyrics();
		console.log("updatePosition: lyrPos = " + lyrPos + ' - Could set timerTick() - g_lyrics_status = ' + g_lyrics_status);
		if (g_lyrics_status > 0) {
			// g_playtimer && clearInterval(g_playtimer);
			// g_playtimer = setInterval(() => { timerTick(); }, LYRICS_TIMER_INTERVAL);
			g_timer_abs = 4;
		}
	}
}

function grab_timer(t_tab) {
	var tminutes, tseconds, thundredth;
	var i, f_sentence, b, c, delta, repeat_text;
	var tab = [];
	// var str = String();
	let grabTimerProfiler;

	if (timings.showLyricsTiming) grabTimerProfiler = fb.CreateProfiler("grab_timer");
	console.log("in grab_timer()");
	for (i=0; i<t_tab.length; i++) {
		t_tab[i] = t_tab[i].replace(/\u2019/g,"'").replace(/\uFF07/g,"'"); // replace apostrophes
		if (g_lyrics_status==1) {
			// -----------
			// sync lyrics
			// -----------
			if(IsTimestamped(t_tab[i])) {
				b = 0;
				while(t_tab[i].substring(b*10, b*10+1)=="[") {
					b++;
				}
				c = b;
				repeat_text = remove_enhanced_tags(t_tab[i].substring(c*10, t_tab[i].length));
				if(repeat_text.length==0) repeat_text = repeat_text + " ";
				for(b=0;b<c;b++) {
					f_sentence = new sentence;
					tminutes = t_tab[i].substring(1+(b*10), 3+(b*10));
					tseconds = t_tab[i].substring(4+(b*10), 6+(b*10));
					thundredth = t_tab[i].substring(7+(b*10), 9+(b*10));
					f_sentence.timer = Math.round(tminutes)*60*100 + Math.round(tseconds)*100 + Math.round(thundredth) - DEFAULT_OFFSET;
					if(f_sentence.timer<0) f_sentence.timer=0;
					f_sentence.text = repeat_text;
					tab.push(f_sentence);
				}
			}
		} else {
			// -------------
			// unsync lyrics
			// -------------
			if(IsTimestamped(t_tab[i])) {
				// if sync line in unsync lyrics, i remove timestamps in this line
				b = 0;
				while(IsTimestamped(t_tab[i].substring(b*10, b*10+10))) {
					b++;
				}
				t_tab[i] = t_tab[i].substring(b*10, t_tab[i].length);
			}
			f_sentence = new sentence;
			f_sentence.timer = 0;
			f_sentence.text = t_tab[i];
			tab.push(f_sentence);
		}
	}
	if (tab.length==0) {
		console.log("no lyrics?");
		g_lyrics_status = 0;
		tab = load_track_info();
		delta = (tab[tab.length-1].ante_lines + tab[tab.length-1].total_lines);
		lyrPos = (albumart_size.h / 2) - (delta * pref.lyrics_line_height / 2);
	} else {
		f_sentence = new sentence;
		f_sentence.timer = 9999999;
		//f_sentence.text = "---";
		tab.push(f_sentence);
	}
	if (timings.showLyricsTiming) grabTimerProfiler.Print();
	return calc_lines(sort_tab(tab));
}

function load_file(filePath, fileName) {
	var t_tab = [];
	t_tab = utils.ReadTextFile(filePath + fileName, 65001).split("\n");
	return grab_timer(check_lyrics_type(t_tab));
}

function check_lyrics_type(t_tab) {
	var i;
	var count = 0;
	var ts_percent;
	var tab = [];
	for(i=0;i<t_tab.length;i++) {
		if(IsTimestamped(t_tab[i])) {
			// format timestamps to default syntax : [99:99.99]
			tab.push(ts_analyzer(t_tab[i]));
			// count # of sync lines
			count++;
		} else {
			if(t_tab[i].length>1) tab.push(t_tab[i]);
		}
	}
	// calc percent of sync lines, if more than 50% of the total filled lines, it's sync lyrics, else, unsync lyrics!
	ts_percent = Math.round(count/tab.length*100);
	if (ts_percent>30) {
		// sync lyrics
		g_lyrics_status = 1;
	} else {
		// unsync lyrics
		g_lyrics_status = 2;
	}
	return tab;
}

function parse_tag(tag, delimiter) {
	console.log("in parse_tag()");
	var t_tab = [];
	var i, j;
	j = 0;
	for(i=0; i<tag.length; i++) {
		if(i==tag.length-1 || tag.charCodeAt(i)==10 || (i>0 && (i<tag.length-5) && (tag.substring(i, i+1)==delimiter) && (tag.substring(i-1, i)!="]"))) {
			if(i==tag.length-1) {
				t_tab.push(tag.substring(j, i+1));
			} else {
				t_tab.push(tag.substring(j, i));
			}
			if(tag.charCodeAt(i)!=10) {
				j = i;
			} else {
				j = i+1;
			}
		}
	}
	return grab_timer(check_lyrics_type(t_tab));
}

function load_track_info() {
	var tab = Array(new sentence, new sentence, new sentence, new sentence);
	var count = 0;
	console.log("in load_track_info()");
	tab[count++].text = fb.TitleFormat(tf["artist"]).Eval();
	tab[count++].text = fb.TitleFormat(tf["title"]).Eval();
	return calc_lines(tab);
}

function change_focus() {
	var i, t1;
	t1 = parseInt(elap_seconds.Eval()) * 100 + hundredth;
	if (g_lyrics_status > 0) {
		// search line index just after actual timer
		for(i=focus; i < g_tab.length; i++) {
			if (g_tab[i].timer>t1) break;
		}
		focus_next=i;
		focus = (i>0) ? i-1 : 0;
		// now I check if there are more than one line with the same timer as focus one & if found, i take it as new focus 'cause it's the first (not a blank line)
		if(focus > 0) {
			for(i=0; i<focus; i++) {
				if(g_tab[i].timer == g_tab[focus].timer) {
					focus = i;
					break;
				}
			}
		}
	}
}

function calc_lines(ctab) {
	let calcLinesProfiler = null;
	console.log("in calc_lines");

	if (timings.showLyricsTiming) calcLinesProfiler = fb.CreateProfiler("calc_lines");
	if (displayLyrics) {
		var i, j;
		var tmp_img;
		var gp;
		var lineh;
		var linew = 0;
		g_tab_length = 0;
		if (albumart_size.w < pref.lyrics_h_padding*2 || ww==0) {
			return ctab; // test to avoid errors if panel is hidden (ww=0)
		}
		tmp_img = gdi.CreateImage(albumart_size.w-(pref.lyrics_h_padding*2), 100);
		gp = tmp_img.GetGraphics();
		for (i=0; i<ctab.length; i++) {
			// calc sentence #lines to display / window.Width
			const strInfo = gp.MeasureString(ctab[i].text, ft.lyrics, 0, 0, albumart_size.w-(pref.lyrics_h_padding*2), albumart_size.h);
			lineh = strInfo.Height;
			if (strInfo.Width > linew) {
				linew = strInfo.Width;
			}
			ctab[i].total_lines = Math.ceil(lineh/pref.lyrics_line_height); // <-- think this is the same as the following code:

			ctab[i].ante_lines = g_tab_length;	// this should always be the number of lines before the current
			g_tab_length += ctab[i].total_lines;
		}
		lyricsWidth = Math.ceil(linew + 4);		// refresh a little wider than the lyrics need to avoid errors
		var lyricsDividerWidth = Math.floor(albumart_size.w * 0.6) + 4;
		if (lyricsWidth < lyricsDividerWidth) {
			lyricsWidth = lyricsDividerWidth;
		}
		//console.log("albumart_size.w=" + albumart_size.w + " linew = " + linew);
		tmp_img.ReleaseGraphics(gp);
	}
	if (timings.showLyricsTiming) calcLinesProfiler.Print();
	return ctab;
}

function sort_tab(tab2sort) {
	var tab = [];
	var i, j;
	var tmp = new sentence;
	var smallest = 0;
	for(i=0;i<tab2sort.length;i++) {
		for(j=i;j<tab2sort.length;j++) {
			if(tab2sort[i].timer > tab2sort[j].timer) {
				tmp = tab2sort[i];
				tab2sort[i] = tab2sort[j];
				tab2sort[j] = tmp;
			}
		}
		tab.push(tab2sort[i]);
	}
	return tab;
}

function remove_enhanced_tags(str) {
	var i;
	var chr1, chr2;
	var new_str="";
	for(i=0;i<str.length;i++) {
		chr1 = str.substring(i, i+1);
		if(i+10<=str.length) chr2 = str.substring(i+9, i+10); else chr2=null;
		if(chr1=="<" && chr2==">") {
			i = i + 10 - 1;
		} else {
			new_str = new_str + chr1;
		}
	}
	return new_str;
}

function ts_analyzer(str) {
	var ch, ts_len;
	var str2 = "";
	var state=0;
	var deb = -1;
	var fin = -1;
	var sep1 = -1;
	var sep2 = -1;

	for(let i = 0; i < str.length; i++) {
		ch = str.substring(i, i+1);
		switch(state) {
			case 0:
				if (ch=="[" && IsNumeric(str.substring(i+1, i+2))) {
					state=1;
					deb=i;
					fin=-1;
				}
				break;
			case 1:
				if(deb>=0 && ch==":") {
					state=2;
					sep1=i;
				}
				if(i>deb+3) {
					deb=-1;
					fin=-1;
					sep1=-1;
					sep2=-1;
					state=0;
				}
				break;
			case 2:
				if(sep1>=0 && (ch==":" || ch==".")) {
					state=3;
					sep2=i;
				}
				if(sep1>=0 && sep2==-1 && ch=="]") {
					state=4;
					fin=i;
				}
				if(i>sep1+3) {
					deb=-1;
					fin=-1;
					sep1=-1;
					sep2=-1;
					state=0;
				}
				break;
			case 3:
				if(deb>=0 && ch=="]") {
					state=4;
					if(i==str.length-1) {
						str=str+" ";
					}
					fin=i;
				}
				if(i>deb+10) {
					deb=-1;
					fin=-1;
					sep1=-1;
					sep2=-1;
					state=0;
				}
				break;
			case 4:
				ts_len=fin-deb+1;
				switch(ts_len) {
					case 6:
						str2 = str2 + "[0" + str.substring(deb+1,deb+2) + ":" + str.substring(deb+3, deb+5) + ".00]";
						break;
					case 7:
						str2 = str2 + str.substring(deb,deb+6) + ".00]";
						break;
					case 9:
						str2 = str2 + "[0" + str.substring(deb+1,deb+2) + ":" + str.substring(deb+3, deb+5) + "." + str.substring(deb+6, deb+8) + "]";
						break;
					case 10:
						if(sep1==deb+2) {
							str2 = str2 + "[0" + str.substring(deb+1,deb+2) + ":" + str.substring(deb+3, deb+5) + "." + str.substring(deb+6, deb+8) + "]";
						} else {
							str2 = str2 + str.substring(deb,deb+10);
						}
						break;
					case 11:
						str2 = str2 + str.substring(deb,deb+9) + "]";
						break;
				}
				// j += 10;
				if(str.substring(fin+1,fin+2)=="[") {
					i = fin;
					deb = -1;
					fin = -1;
					sep1 = -1;
					sep2 = -1;
					state = 0;
				} else {
					i = str.length - 1;
					str2 = str2 + str.substring(fin+1, str.length);
				}
				break;
		}
	}
	return str2;
}

function IsNumeric(str) {
	var ValidChars = "0123456789.";
	return ValidChars.includes(str);
	// for (let i = 0; i < str.length; i++) {
	// 	if (ValidChars.indexOf(str.charAt(i)) == -1) {
	// 		return false;
	// 	}
	// }
	// return true;
}

function IsTimestamped(str) {
	var ValidChars = "[0123456789:.]";
	var count = 0;
	for (let i = 0; i < (str.length>10 ? 10 : str.length); i++) {
		if (ValidChars.indexOf(str.charAt(i)) >=0) {
			count++;
		}
	}
	if(count>=6 && count <=11) {
		return true;
	} else {
		return false;
	}
}

function check_file(path, filename) {
	var found = true;
	g_lyrics_path = path;
	if (IsFile(path + filename + '.lrc')) {
		g_lyrics_filename = filename + '.lrc';
	} else if (IsFile(path + filename + '.txt')) {
		g_lyrics_filename = filename + '.txt';
	} else {
		g_lyrics_path = null;
		found = false;
	}
 	return found;
}

function get_lyrics() {
	let getLyricsProfiler = null;

	console.log("in get_lyrics()");
	timings.showLyricsTiming && (getLyricsProfiler = fb.CreateProfiler("get_lyrics"));
	var i, delta, tag;
	var tpath = [];
	var tfilename= [];
	var bool_tag = false;
	var bool_file = false;

	for (i=0;i<tf.lyr_path.length;i++)
		tpath.push(fb.TitleFormat(tf.lyr_path[i]).Eval());
	for (i=0;i<tf.lyr_filename.length;i++)
		tfilename.push(fb.TitleFormat(tf.lyr_filename[i]).Eval());

	// reset lyrics tab
	g_lyrics_status = 0;
	//if(g_tab.length>0) g_tab.splice(0, g_tab.length);
	g_tab = [];
	lyrPos = midpoint;
	focus = 0;
	// check TAGs
	tag = fb.TitleFormat(tf["lyrics"]).Eval();
	if (tag.length > 0) {
		bool_tag = true;
		g_lyrics_status = tag[0]=="[" ? 1 : 2;
	} else {
		// check files
		i = 0;
		while(!bool_file && i<tpath.length) {
			let j = 0;
			while(!bool_file && j<tfilename.length) {
				bool_file = check_file(tpath[i], tfilename[j]);
				j++;
			}
			i++;
		}
	}
	// if lyrics found
	if (bool_tag || bool_file) {
		if(bool_tag) {
			g_tab = parse_tag(tag, "[");
		} else {
			g_tab = load_file(g_lyrics_path, g_lyrics_filename);
		}
	} else {
		g_tab = load_track_info();
		delta = (g_tab[g_tab.length-1].ante_lines + g_tab[g_tab.length-1].total_lines);
		lyrPos = (albumart_size.h / 2) - (delta * pref.lyrics_line_height / 2);
	}
	if (g_lyrics_status==2) {
		for(let i=0; i < g_tab.length-1; i++) {
			g_tab[i].timer = i * Math.floor(parseInt(len_seconds.Eval()) * 100 / g_tab.length);
		}
	}
	timings.showLyricsTiming && getLyricsProfiler.Print();
}
// EOF
