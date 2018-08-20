// Lyrics Objects

sentence = function () {
	this.timer = 0;
	this.text = '';
	this.total_lines = 0;
	this.ante_lines = 0;
	this.ToString = function ToString() {
		var str = "timer= " + this.timer + " text: " + this.text + " total_lines= " + this.total_lines + " ante_lines= " + this.ante_lines;
		return str;
	}
}

// Lyrics Functions

function refresh_lyrics() {
	if (fb.IsPlaying || fb.IsPaused) {
		if (showLyricsTiming) refresh_lyrics_time = fb.CreateProfiler("refresh_lyrics");
		console.log("in refresh_lyrics() - g_lyrics_status = " + g_lyrics_status);
		g_scroll = 0;
		g_is_scrolling = false;
		get_lyrics();
		change_focus();
		console.log('Could set timerTick() - g_lyrics_status = ' + g_lyrics_status);
		if (g_lyrics_status > 0) {
			var k = g_tab[focus].ante_lines * pref.lyrics_line_height;
			lyrPos = midpoint - k;
			g_playtimer && window.clearInterval(g_playtimer);
			g_playtimer = window.setInterval(function() { timerTick(); }, PLAYTIMER_VALUE);
			g_timer_abs = 4;
		} else {
			delta = (g_tab[g_tab.length-1].ante_lines + g_tab[g_tab.length-1].total_lines);
			lyrPos = Math.round((albumart_size.h / 2) - (delta * pref.lyrics_line_height / 2));
		}
		if (showLyricsTiming) refresh_lyrics_time.Print();
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
			g_playtimer && window.clearInterval(g_playtimer);
			g_playtimer = window.SetInterval(function(){ timerTick(); },PLAYTIMER_VALUE);
			g_timer_abs = 4;
		}
	}
}

function grab_timer(t_tab) {
	var tminutes, tseconds, thundredth;
	var i, k, f_sentence, b, c, delta, repeat_text;
	var tab = [];
	var str = String();
	if (showLyricsTiming) grab_timer_time = fb.CreateProfiler("grab_timer");
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
	if (showLyricsTiming) grab_timer_time.Print();
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
	var i, j, t1;
	t1 = elap_seconds.Eval()*100+hundredth;
	if(g_lyrics_status>0) {
		// search line index just after actual timer
		for(i=focus;i<g_tab.length;i++) {
			if(g_tab[i].timer>t1) break;
		}
		focus_next=i;
		focus = (i>0)?i-1:0;
		// now i check if there are more than one line with the same timer as focus one & if found, i take it as new focus 'cause it's the first (not a blank line)
		if(focus>0) {
			for(i=0;i<focus;i++) {
				if(g_tab[i].timer==g_tab[focus].timer) {
					focus = i;
					break;
				}
			}
		}
	}
}

function calc_lines(ctab) {
	console.log("in calc_lines");
	if (showLyricsTiming) calc_lines_time = fb.CreateProfiler("calc_lines");
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
			// calc sentence #lines to display / window.width
			strInfo = gp.MeasureString(ctab[i].text, ft.lyrics, 0, 0, albumart_size.w-(pref.lyrics_h_padding*2), albumart_size.h);
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
	if (showLyricsTiming) calc_lines_time.Print();
	return ctab;
}

function sort_tab(tab2sort) {
	var tab = Array();
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
	var i, j, ch,  ts_len;
	var str2 = "";
	var state=0;
	var deb = -1;
	var fin = -1;
	var sep1 = -1;
	var sep2 = -1;
	var suite=0;
	for(i=0; i<str.length; i++) {
		ch = str.substring(i, i+1);
		switch(state) {
			case 0:
				if(ch=="[" && IsNumeric(str.substring(i+1, i+2))) {
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
				j += 10;
				if(str.substring(fin+1,fin+2)=="[") {
					suite = 1;
					i = fin;
					deb = -1;
					fin = -1;
					sep1 = -1;
					sep2 = -1;
					state = 0;
				} else {
					suite = -1;
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
	for (i = 0; i < str.length; i++) {
		if (ValidChars.indexOf(str.charAt(i)) == -1) {
			return false;
		}
	}
	return true;
}

function IsTimestamped(str) {
	var ValidChars = "[0123456789:.]";
	var count = 0;
	for (i = 0; i < (str.length>10?10:str.length); i++) {
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
	if (showLyricsTiming) load_file_time = fb.CreateProfiler("check_file");
	var found = true;
	g_lyrics_path = path;
	if (utils.FileTest(path+filename+".lrc", "e")) {
		g_lyrics_filename = filename+".lrc";
	} else if (utils.FileTest(path+filename+".txt", "e")) {
		g_lyrics_filename = filename+".txt";
	} else {
		g_lyrics_path = null;
		found = false;
	}
	if (showLyricsTiming) load_file_time.Print();
 	return found;
}

function get_lyrics() {
	console.log("in get_lyrics()");
	showLyricsTiming && (get_lyrics_time = fb.CreateProfiler("get_lyrics"));
	var i, count, delta, tag;
	var tpath = Array();
	var tfilename= Array();
	var bool_tag = false;
	var bool_file = false;

	for (i=0;i<tf["lyr_path"].length;i++)
		tpath.push(fb.Titleformat(tf["lyr_path"][i]).Eval());
	for (i=0;i<tf["lyr_filename"].length;i++)
		tfilename.push(fb.Titleformat(tf["lyr_filename"][i]).Eval());

	// reset lyrics tab
	g_lyrics_status = 0;
	//if(g_tab.length>0) g_tab.splice(0, g_tab.length);
	g_tab = [];
	lyrPos = midpoint;
	focus = 0;
	// check TAGs
	tag = fb.Titleformat(tf["lyrics"]).Eval();
	if(tag.length>0) {
		bool_tag = true;
		if (tag.substring(0,1)=="[") g_lyrics_status = 1; else g_lyrics_status = 2;
	} else {
		// check files
		i = 0;
		while(!bool_file && i<tpath.length) {
			j = 0;
			while(!bool_file && j<tfilename.length) {
				bool_file = check_file(tpath[i], tfilename[j]);
				j++;
			}
			i++;
		}
	}
	// if lyrics found
	if(bool_tag || bool_file) {
		if(bool_tag) {
			g_tab = parse_tag(tag, "[");
		} else {
			g_tab = load_file(g_lyrics_path, g_lyrics_filename);
		}
	}  else {
		g_tab = load_track_info();
		delta = (g_tab[g_tab.length-1].ante_lines + g_tab[g_tab.length-1].total_lines);
		lyrPos = (albumart_size.h / 2) - (delta * pref.lyrics_line_height / 2);
	}
	if(g_lyrics_status==2) {
		for(i=0;i<g_tab.length-1;i++) {
			g_tab[i].timer = i * Math.floor(len_seconds.Eval() * 100 / g_tab.length);
		}
	}
	showLyricsTiming && get_lyrics_time.Print();
}
// EOF

