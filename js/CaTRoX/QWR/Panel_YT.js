// ==PREPROCESSOR==
// @name "YouTube Track Manager"
// @author "WilB"
// @version "3.9.5.2"
// ==/PREPROCESSOR==

if (!("Version" in utils) || utils.Version < 2100) {fb.ShowPopupMessage("Requires: JScript Panel 2.1.0+", "YouTube Track Manager");}
function userinterface() {
    var lightBg = false, orig_font_sz = 16, modeCol = window.GetProperty(" Button Colour Last.fm/MB Auto-0 Site-1 Theme-2", 0), style = 0, tcol = "", tcol_h = "", zoom_font_sz = 16, zoom = 100; window.SetProperty("_CUSTOM COLOURS/FONTS: EMPTY = DEFAULT", "R-G-B (any) or R-G-B-A (not Text...), e.g. 255-0-0"); modeCol = Math.min(Math.max(modeCol, 0), 2);
    this.alternate = window.GetProperty(" Row Stripes", false); this.b1 = 0x04ffffff; this.b2 = 0x04000000; this.bg = false; this.backcol = ""; this.backcol_h = ""; this.backcolsel = ""; this.backcoltrans = ""; this.dui = window.InstanceType; this.font; this.framecol = ""; this.textcol = ""; this.textcol_h = ""; this.textselcol = "";
    this.blur_blend = window.GetProperty("SYSTEM.Blur Blend Theme", false); this.blur_dark = window.GetProperty("SYSTEM.Blur Dark Theme", false); this.blur_light = window.GetProperty("SYSTEM.Blur Light Theme", false); var blur_tmp = window.GetProperty("ADV.Image Blur Background Level (0-100)", 90); this.blurLevel = this.blur_blend ? 91.05 - Math.max(Math.min(blur_tmp, 90), 1.05) : Math.max(Math.min(blur_tmp * 2, 254), 0); this.blurAlpha = window.GetProperty("ADV.Image Blur Background Opacity (0-100)", 30); this.blurAlpha = Math.min(Math.max(this.blurAlpha, 0), 100) / 30;
    this.changeBlur = function(type) {ui.blur_dark = false; ui.blur_blend = false; ui.blur_light = false; switch (type) {case 2: this.blur_dark = true; break; case 3: this.blur_blend = true; break; case 4: this.blur_light = true; break;} var blur_tmp = window.GetProperty("ADV.Image Blur Background Level (0-100)"); this.blurLevel = this.blur_blend ? 91.05 - Math.max(Math.min(blur_tmp, 90), 1.05) : Math.max(Math.min(blur_tmp * 2, 254), 0); on_colours_changed(true); window.SetProperty("SYSTEM.Blur Blend Theme", this.blur_blend); window.SetProperty("SYSTEM.Blur Dark Theme", this.blur_dark); window.SetProperty("SYSTEM.Blur Light Theme", this.blur_light);}
    var changeBrightness = function (r, g, b, percent){return RGB(Math.min(Math.max(r + (256 - r) * percent / 100, 0), 255), Math.min(Math.max(g + (256 - g) * percent / 100, 0), 255), Math.min(Math.max(b + (256 - b) * percent / 100, 0), 255));}
    var R = function(c) {return c >> 16 & 0xff;}; var G = function(c) {return c >> 8 & 0xff;}; var B = function(c) {return c & 0xff;}; var custom_col = window.GetProperty("_CUSTOM COLOURS/FONTS: USE", false), col_theme = window.GetProperty(" Colours: Fade-0 Blend-1 Normal-2 Highlight-3", 3);
    var get_blend = function(c1, c2, f) {var nf = 1 - f, r = (R(c1) * f + R(c2) * nf), g = (G(c1) * f + G(c2) * nf), b = (B(c1) * f + B(c2) * nf); return RGB(r, g, b);}
    this.get_textselcol = function(c, n) {var cc = [R(c), G(c), B(c)]; var ccc = []; for (var i = 0; i < cc.length; i++) {ccc[i] = cc[i] / 255; ccc[i] = ccc[i] <= 0.03928 ? ccc[i] / 12.92 : Math.pow(((ccc[i] + 0.055 ) / 1.055), 2.4);} var L = 0.2126 * ccc[0] + 0.7152 * ccc[1] + 0.0722 * ccc[2]; if (L > 0.31) return n ? 50 : RGB(0, 0, 0); else return n ? 200 : RGB(255, 255, 255);}
    var set_custom_col = function(c, t) {if (!custom_col) return ""; try {var cc = "", col = []; col = c.split("-"); if (col.length != 3 && col.length != 4) return ""; switch (t) {case 0: cc = RGB(col[0], col[1], col[2]); break; case 1: switch (col.length) {case 3: cc = RGB(col[0], col[1], col[2]); break; case 4: cc = RGBA(col[0], col[1], col[2], col[3]); break;} break;} return cc;} catch (e) {return ""};}
    var WshShell = new ActiveXObject("WScript.Shell"); try {var dpi = WshShell.RegRead("HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI");} catch (e) {var dpi = 120;} this.scale = dpi < 121 ? 1 : dpi / 120;
    this.draw = function(gr) {if (this.bg) try {gr.FillSolidRect(0, 0, p.w, p.h, this.backcol)} catch (e) {}}
    this.outline = function(c, but) {if (but) {if (window.IsTransparent || R(c) + G(c) + B(c) > 30) return RGBA(0, 0, 0, 36); else return RGBA(255, 255, 255, 36);} var cc = [R(c), G(c), B(c)]; var ccc = []; for (var i = 0; i < cc.length; i++) {ccc[i] = cc[i] / 255; ccc[i] = ccc[i] <= 0.03928 ? ccc[i] / 12.92 : Math.pow(((ccc[i] + 0.055 ) / 1.055), 2.4);} var L = 0.2126 * ccc[0] + 0.7152 * ccc[1] + 0.0722 * ccc[2]; if (L > 0.31) return RGB(30, 30, 10); else return RGB(225, 225, 245);}
    this.reset_colors = function () {this.backcol = ""; this.backcol_h = ""; this.backcolsel = ""; this.backcoltrans = ""; this.framecol = ""; tcol = ""; tcol_h = ""; this.textcol = ""; this.textcol_h = ""; this.textselcol = "";}
    this.zoom = function() {return utils.IsKeyPressed(0x10) || utils.IsKeyPressed(0x11);}

    this.get_font = function() {
        var cust_f = window.GetProperty("_Custom.Font AlbManager (Name,Size,Style[0-4])", "Segoe UI,16,0");
        if (custom_col && cust_f.length) {cust_f = cust_f.replace(/^[,\s]+|[,\s]+$/g, "").split(","); try {this.font = gdi.Font(cust_f[0], Math.round(parseFloat(cust_f[1])), Math.round(parseFloat(cust_f[2])));} catch (e) {}}
        else if (this.dui) this.font = window.GetFontDUI(2); else this.font = window.GetFontCUI(0);
        try {this.font.Name; this.font.Size; this.font.Style;} catch (e) {this.font = gdi.Font("Segoe UI", 16, 0); p.trace("JScript panel is unable to use your default font. Using Segoe UI at default size & style instead");}
        orig_font_sz = window.GetProperty("SYSTEM.Font Size", 16);
        if (this.font.Size != orig_font_sz) window.SetProperty(" Zoom Font Size (%)", 100);
        orig_font_sz = this.font.Size; window.SetProperty("SYSTEM.Font Size", this.font.Size);
        zoom = window.GetProperty(" Zoom Font Size (%)", 100);
        zoom_font_sz = Math.max(Math.round(orig_font_sz * zoom / 100), 1);
        this.font = gdi.Font(this.font.Name, zoom_font_sz, this.font.Style);
        window.SetProperty(" Zoom Font Size (%)", Math.round(zoom_font_sz / orig_font_sz * 100));
        var s = this.font.Style; style = s == 0 ? 2 : s == 1 ? 3 : s == 2 ? 0 : s == 3 ? 1 : s; this.head = gdi.Font(this.font.name, this.font.Size, style);
        this.pc = gdi.Font("Segoe UI", 9 * this.scale, style); // edit for custom playcount header font
        alb.calc_text(); alb.calc_rows(); alb.calc_rows_alb(); alb.calc_rows_art(); but.refresh(true);
    }

    this.wheel = function(step) {
        if (p.m_y < alb.fit()[1] || !alb.show || t.halt()) return;
        zoom_font_sz += step; zoom_font_sz = Math.max(zoom_font_sz, 1);
        this.font = gdi.Font(this.font.Name, zoom_font_sz, this.font.Style);
        this.head = gdi.Font(this.font.name, this.font.Size, style);
        alb.calc_text(); alb.calc_rows(); alb.calc_rows_alb(); alb.calc_rows_art(); but.refresh(true);
        window.Repaint(); window.SetProperty(" Zoom Font Size (%)", Math.round(zoom_font_sz / orig_font_sz * 100));
    }

    this.get_colors = function() {
        this.backcol = set_custom_col(window.GetProperty("_Custom.Colour Background", ""), 1);
        this.backcol_h = set_custom_col(window.GetProperty("_Custom.Colour Background Highlight", ""), 1);
        this.backcolsel = set_custom_col(window.GetProperty("_Custom.Colour Background Selected", ""), 1);
        this.framecol = set_custom_col(window.GetProperty("_Custom.Colour Frame Highlight", ""), 1);
        this.textcol = set_custom_col(window.GetProperty("_Custom.Colour Text", ""), 0);
        this.textcol_h = set_custom_col(window.GetProperty("_Custom.Colour Text Highlight", ""), 0);
        this.textselcol = set_custom_col(window.GetProperty("_Custom.Colour Text Selected", ""), 0);
        this.backcoltrans = set_custom_col(window.GetProperty("_Custom.Colour Transparent Fill", ""), 1);
        this.blur = this.blur_blend || this.blur_dark || this.blur_light; this.dkMode = modeCol  == 2 || (this.blur_dark || this.blur_light) && !modeCol ? true : false;
        if (this.blur_dark) {this.bg_color_light = RGBA(0, 0, 0, Math.min(160 / this.blurAlpha, 255)); this.bg_color_dark = RGBA(0, 0, 0, Math.min(80 / this.blurAlpha, 255));}
        if (this.blur_light) {this.bg_color_light = RGBA(255, 255, 255, Math.min(160 / this.blurAlpha, 255)); this.bg_color_dark = RGBA(255, 255, 255, Math.min(205 / this.blurAlpha, 255));}
        if (this.dui) { // custom colour mapping: DUI colours can be remapped by changing the numbers (0-3)
            if (this.backcol === "") this.backcol = window.GetColourDUI(1);
            tcol = window.GetColourDUI(0); tcol_h = window.GetColourDUI(2);
            if (this.backcolsel === "") this.backcolsel = this.blur_dark ? RGBA(255, 255, 255, 36) : this.blur_light ? RGBA(0, 0, 0, 36) : window.GetColourDUI(3);
        } else { // custom colour mapping: CUI colours can be remapped by changing the numbers (0-6)
            if (this.backcol === "") this.backcol = window.GetColourCUI(3);
            tcol = window.GetColourCUI(0); tcol_h = window.GetColourCUI(2);
            if (this.backcolsel === "") this.backcolsel = this.blur_dark ? RGBA(255, 255, 255, 36) : this.blur_light ? RGBA(0, 0, 0, 36) : window.GetColourCUI(4);
            if (this.textselcol === "") this.textselcol = !this.blur_dark && !this.blur_light ? window.GetColourCUI(1) : this.textcol;
        }
        lightBg = this.get_textselcol(this.backcol == 0 ? 0xff000000 : this.backcol, true) == 50;
        if (this.textcol === "") this.textcol = this.blur_blend ? changeBrightness(R(tcol), G(tcol), B(tcol), lightBg ? -10 : 10) : this.blur_dark ? RGB(255, 255, 255) : this.blur_light ? RGB(0, 0, 0) : tcol;
        if (this.textcol_h === "") this.textcol_h = this.blur_blend ? changeBrightness(R(tcol_h), G(tcol_h), B(tcol_h), lightBg ? -10 : 10) : this.blur_dark ? RGB(255, 255, 255) : this.blur_light ? RGB(71, 129, 183) : col_theme < 2 ? get_blend(!col_theme ? this.textcol : tcol_h, this.backcol == 0 ? 0xff000000 : this.backcol, !col_theme ? 0.8 : 0.875) : col_theme == 2 ? this.textcol : tcol_h;
        this.blend = get_blend(this.textcol_h, this.textcol, 0.5);
        if (this.backcol_h === "") this.backcol_h = this.blur_dark ? 0x24000000 : 0x1E30AFED;
        if (this.framecol === "") this.framecol = this.blur_dark ? 0xff808080 : 0xA330AFED;
        if (this.textselcol === "") this.textselcol = !this.blur ? this.get_textselcol(this.backcolsel, false) : this.textcol;
        if (window.IsTransparent && this.backcoltrans) {this.bg = true; this.backcol =  this.backcoltrans}
        if (!window.IsTransparent || this.dui) {this.bg = true; if ((R(this.backcol) + G(this.backcol) + B(this.backcol)) > 759) this.b2 = 0x06000000;}
        this.ct = this.bg ? this.get_textselcol(this.backcol, true) : 200;
        this.ibeamcol1 = window.IsTransparent ? 0xffe1e1f5 : this.outline(this.backcol);
        this.ibeamcol2 = window.IsTransparent || !this.backcolsel ? 0xff0099ff : this.backcolsel != this.textcol_h ? this.backcolsel : 0xff0099ff;
        this.btnBlur1 = this.blur_blend ? this.textcol & RGBA(255, 255, 255, 12) : this.blur_dark || this.blur_light ? RGBA(0, 0, 0, 36) : get_blend(this.backcol == 0 ? 0xff000000 : this.backcol, this.textcol, 0.9);
        this.btnBlur2 = this.blur_blend ? this.textcol & RGBA(255, 255, 255, 12) : this.blur_dark || this.blur_light ? RGBA(0, 0, 0, 10) : get_blend(this.backcol == 0 ? 0xff000000 : this.backcol, this.textcol, 0.82);
        this.btnBlur3 = this.blur_blend ? this.textcol & RGBA(255, 255, 255, 40) : this.blur_dark ? RGBA(255, 255, 255, 50) : this.blur_light ? RGBA(0, 0, 0, 40) : get_blend(this.backcol == 0 ? 0xff000000 : this.backcol, this.textcol, 0.75);
        this.btnBlur4 = this.blur_blend ? this.textcol & RGBA(255, 255, 255, 80) : this.blur_dark ? RGBA(255, 255, 255, 100) : this.blur_light ? RGBA(0, 0, 0, 100) : get_blend(this.backcol == 0 ? 0xff000000 : this.backcol, this.textcol, 0.82);
    }
    this.get_colors();
}
var ui = new userinterface();

if (!Date.now) {Date.now = function now() {return new Date().getTime();}}
Number.prototype.padLeft = function(base, chr) {var  len = (String(base || 10).length - String(this).length) + 1; return len > 0 ? new Array(len).join(chr || '0')+this : this;}
String.prototype.clean = function() {return this.replace(/[\/\\|:]/g, "-").replace(/\*/g, "x").replace(/"/g, "''").replace(/[<>]/g, "_").replace(/\?/g, "").replace(/^\./, "_").replace(/\.+$/, "").replace(/^\s+|[\n\s]+$/g, "");}
String.prototype.cleanse = function() {return this.replace(/(\.mv4|1080p|1080i|1080|\d(\d|)(\.|\s-)|explicit( version|)|full HD|HD full|full HQ|full song|(high |HD - |HD-|HD )quality|(| |with |& |w( |)\/( |)|\+ )lyric(s(!|) on Screen|s|)|(official |)music video( |)|official (music|version|video)( |)|(song |official (fan |)|)audio( version| only| clean|)|(| |\+ )official( solo| |)|uncensored|vevo presents|video( |))|\.wmv/gi, "").replace(/(HD|HQ)(\s-\s|)/g, "").replace(/\((|\s+)\)/g, "").replace(/\[(|\s+)\]/g, "").replace(/\(\)/g, "").replace(/\[\]/g, "").replace(/\s+/g, " ").replace(/[\s-/\\\+]+$/g, "").trim();}
String.prototype.regex_esc = function() {return this.replace(/([*+\-?^!:&"~${}()|\[\]\/\\])/g, "\\$1");}
String.prototype.strip = function() {return this.replace(/[\.,\!\?\:;'\u2019"\-_\u2010\s+]/g, "").toLowerCase();}
String.prototype.strip_remaster = function() {var n = this.toLowerCase(); if (n.indexOf("remaster") == -1 && n.indexOf("re-master") == -1 && n.indexOf("re-recorded") == -1 && n.indexOf("rerecorded") == -1) return this; var new_name = this.replace(/((19|20)\d\d(\s|\s-\s)|)(digital(ly|)\s|)(\d\d-bit\s|)(re(-|)master|re(-|)recorded).*/gi, "").replace(/\s[\W_]+$/g, "").replace(/[\s\(\[-]+$/g, ""); return new_name.length ? new_name : this;}
String.prototype.tidy = function() {return this.replace(/[\.,\!\?\:;'’"\-_]/g, "").toLowerCase();}
if (!String.prototype.trim) {String.prototype.trim = function () {return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');};}
String.prototype.uuid = function() {return (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/).test(this);}

function names() {
    var field = window.GetProperty(" Library: Search (Field Names - No Titleformatting)", "ARTIST FIELD,Artist,ALBUM FIELD,Album,GENRE FIELD,Genre,TITLE FIELD,Title").split(",");
    this.q_a = field[1] ? field[1].trim() : "Artist"; if (!this.q_a.length) this.q_a = "Artist"; this.q_l = field[3] ? field[3].trim() : "Album"; if (!this.q_l.length) this.q_l = "Album"; this.q_g = field[5] ? field[5].trim() : "Genre"; if (!this.q_g.length) this.q_g = "Genre"; this.q_t = field[7] ? field[7].trim() : "Title"; if (!this.q_t.length) this.q_t = "Title";
    var a_tf = "$trim(" + window.GetProperty(" Titleformat (Web Search) Artist", "[$if3($meta(artist,0),$meta(album artist,0),$meta(composer,0),$meta(performer,0))]") +")", g_tf = window.GetProperty(" Titleformat (Web Search) Genre", "[$meta(genre,0)]"), t_tf = window.GetProperty(" Titleformat (Web Search) Title", "[$meta(title,0)]");
    this.artist = function(focus) {return p.eval(a_tf, focus);}
    this.art = function() {return alb.artist ? alb.artist : this.artist();}
    this.title = function(focus) {return p.eval(t_tf, focus)}; this.artist_title = function() {return this.artist() && this.title() ? this.artist() + " | " + this.title() : "N/A";}
    this.genre = function() {var g = p.eval(g_tf); return g ? g : "N/A";}
}
var name = new names();

function on_colours_changed(clear) {ui.reset_colors(); ui.get_colors(); if (ui.blur) p.show_images = true; but.create_images(); but.refresh(); if (p.np_graphic) img.create_images(); if (ui.blur_blend || clear) img.on_size(); t.paint();}
function on_font_changed() {ui.get_font(); t.paint();}
function titleformat() {this.a = fb.TitleFormat("%" + name.q_a + "%"); this.a0 = fb.TitleFormat("[$meta(" + name.q_a + ",0)]"); this.d = fb.TitleFormat("[%length_seconds_fp%]"); this.i = fb.TitleFormat("$info(@REFERENCED_FILE)"); this.l0 = fb.TitleFormat("[$meta(" + name.q_l + ",0)]"); this.pl = fb.TitleFormat(window.GetProperty(" Load Menu Albums Sort", "%album artist%|%date%|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%")); this.popup = fb.TitleFormat("[%video_popup_status%]"); this.r = fb.TitleFormat("$rand()"); this.rg = fb.TitleFormat("[%replaygain_track_gain%]"); this.rp = fb.TitleFormat("[%replaygain_track_peak%]"); this.t = fb.TitleFormat("%" + name.q_t + "%"); this.t0 = fb.TitleFormat("[$meta(" + name.q_t + ",0)]");} var tf = new titleformat();
function v_keys() {this.selAll = 1; this.copy = 3; this.back = 8; this.enter = 13; this.shift = 16; this.paste = 22; this.cut = 24; this.redo = 25; this.undo = 26; this.pgUp = 33; this.pgDn = 34; this.end = 35; this.home = 36; this.left = 37; this.right = 39; this.del = 46;} var v = new v_keys();

String.prototype.strip_title = function (n, type) {
    try {if (this == n) return this;
        n = n.replace(/([\*\$])/g, "\\$1");
        if (type) {if ((RegExp(n + " - ", "i")).test(this)) return this.replace(RegExp(n + " - ", "i"), ""); else return this.replace(RegExp(" - " + n, "i"), "");}
        var t1 = n.replace(/^The /i, ""), w = "(( |)((and|&|featuring|of|with)|((feat|ft|vs)(.|)))|'s) ";
        if ((RegExp(w, "i")).test(this))
            if ((RegExp(n + w, "i")).test(this) || (RegExp(w + n, "i")).test(this) || (RegExp(t1 + w, "i")).test(this) || RegExp(w + t1, "i").test(this))
                return this;
        var a = "(( +)?([-;:, ~|/(\\[]+)( +)?|)", b = "(the |by (the |)|by: |\"|)", c = "(\"|)", d = "(( +)?([-;:, ~|/)\\]]+)( +)?|)", t2 = "";
        if (!(/^The /i).test(n)) t2 = this.replace(RegExp(a + b + n + c + d, "i"), " - ").replace(/^ - | - (.|)$/g, "");
        else t2 = this.replace(RegExp(a + b + t1 + c + d, "i"), " - ").replace(/^ - | - (.|)$/g, "");
        return (/\S/).test(t2) ? t2 : this;} catch (e) {return this;}
}

String.prototype.titlecase = function() {
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i; if (this == "N/A") return this;
    return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
        // uncomment for smallWord handling: if (index > 0 && index + match.length !== title.length && match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') && title.charAt(index - 1).search(/[^\s-]/) < 0) {return match.toLowerCase();}
        if (match.substr(1).search(/[A-Z]|\../) > -1) return match; return match.charAt(0).toUpperCase() + match.substr(1);
    });
}

function panel_operations() {
    var defArtPth = "%profile%\\yttm\\art_img\\$lower($cut($meta(artist,0),1))\\$meta(artist,0)";
    this.add_loc = []; this.plmanAddloc = window.GetProperty("ADV.Add Locations fb2k-0 JScript-1", 1) ? 1 : 0; this.alb_id = -1; this.btn_mode = window.GetProperty(" Button Mode", false); this.sbar_o = 0; this.sbar_x = 0;
    this.Thirty_Days = 2592000000; this.TwentyEight_Days = 2419200000; this.One_Day = this.TwentyEight_Days / 28; this.One_Week = this.TwentyEight_Days / 4;
    this.add_fb2k_locations = function(p_locations, radio, p_top50, p_alb_set) {if (!p_top50 && !p_alb_set && radio && plman.ActivePlaylist != pl.rad && plman.PlayingPlaylist == pl.rad) {if (p_locations.replace(/[\.\/\\]/g, "").indexOf("youtubecomwatch") != -1) return plman.AddLocations(pl.rad, [p_locations]); else {var handles = fb.CreateHandleList(), item = fb.CreateHandleList(), pn = pl.rad; try {item = fb.GetQueryItems(lib.get_lib_items(), "(%path% IS " + p_locations + ") OR (\"$replace($info(@REFERENCED_FILE),file:'//',)\" IS " + p_locations + ")")} catch (e) {} if (item.Count) {handles.Add(item.Item(0)); if (handles.Count) plman.InsertPlaylistItems(pn, plman.PlaylistItemCount(pn), handles);} if (handles) handles.Dispose(); if (item) item.Dispose(); return;}} var str = "\"" + fb.FoobarPath + "\\foobar2000.exe\"" + (radio ? " /immediate" : "") + " /add \"" + p_locations + "\""; this.run(str, 0);}
    this.add_locations = function(p_locations, p_pn, radio, p_top50, p_alb_set) {plman.AddLocations(p_pn, p_locations, !p_top50 && !p_alb_set && radio && plman.ActivePlaylist != pl.rad && plman.PlayingPlaylist == pl.rad ? false : true);}
    this.box = function(n) {return n != null ? 'Unescape("' + encodeURIComponent(n + "") + '")' : "Empty";}
    this.browser = function(c) {if (!this.run(c)) fb.ShowPopupMessage("Unable to launch your default browser.", "YouTube Track Manager");}
    this.c_sort = function(data) {data.sort(function(a, b) {return parseFloat(b.playcount) - parseFloat(a.playcount)}); return data;}
    this.fs = new ActiveXObject("Scripting.FileSystemObject");
    this.click = function(x, y) {if (x < 0 || y < 0 || x > p.w || y > p.h) return; alb.load(x, y); if (t.clickable(x, y)) if (this.show_images) img.lbtn_up(x, y); else {rad.text_toggle(); if (this.video_mode && rad.pss) {rad.force_refresh = 2; rad.refreshPSS();} t.paint();}}
    this.create = function(fo) {try {if (!this.folder(fo)) this.fs.CreateFolder(fo);} catch (e) {}}
    this.cycle_art_img = window.GetProperty(" Image [Artist] Cycle", true); this.cycle = window.GetProperty(" Image [Artist] Cycle Time (seconds)", 15); this.dbl_click = window.GetProperty(" Mouse Left Button Click: Map To Double-Click", false);
    this.dl_art_img = window.GetProperty(" Image [Artist] Auto-Fetch", false); this.imgArtPth = window.GetProperty(" Image [Artist] Folder Location", defArtPth); if (!this.imgArtPth) this.imgArtPth = defArtPth;
    this.ec_saved = window.GetProperty("ADV.Allow Playing Saved Echonest Radio Stations", false);
    this.expired = function(f, exp) {if (!this.file(f)) return true; try {return Date.now() - Date.parse(this.fs.GetFile(f).DateLastModified) > exp;} catch (e) {return true;}}
    this.ir = function () {return fb.IsPlaying && fb.PlaybackLength <= 0}
    this.eval = function(n, focus) {if (!n) return ""; var tfo = fb.TitleFormat(n); if (this.ir()) {var str = tfo.Eval(); tfo.Dispose(); return str;} var handle = fb.IsPlaying && !focus ? fb.GetNowPlaying() : fb.GetFocusItem(); if (!handle) {tfo.Dispose(); return "";} var str = tfo.EvalWithMetadb(handle); tfo.Dispose(); return str;}
    this.file = function(f) {return this.fs.fileExists(f);}; this.folder = function(fo) {return this.fs.FolderExists(fo);}; var q = function(s) {return s.split("").reverse().join("");}
    this.buildFullPth = function(pth) {var tmpFileLoc = "", pattern = /(.*?)\\/gm; while (result = pattern.exec(pth)) {tmpFileLoc = tmpFileLoc.concat(result[0]); try {this.create(tmpFileLoc);} catch (e) {}}}
    this.cleanPth = function(pth) {pth = pth.trim().replace(/\//g, "\\"); if (pth.toLowerCase().indexOf("%profile%") != -1) {var fbPth = fb.ProfilePath.replace(/'/g, "''").replace(/(\(|\)|\[|\]|%|,)/g, "'$1'"); if (fbPth.indexOf("$") != -1) {var fbPthSplit = fbPth.split("$"); fbPth = fbPthSplit.join("'$$'");} pth = pth.replace(/%profile%(\\|)/gi, fbPth);} pth = this.eval(pth); if (pth) pth += "\\"; else return ""; var c_pos = pth.indexOf(":"); pth = pth.replace(/[\/|:]/g, "-").replace(/\*/g, "x").replace(/"/g, "''").replace(/[<>]/g, "_").replace(/\?/g, "").replace(/\\\./g, "\\_").replace(/\.+\\/, "\\").replace(/\s*\\\s*/g, "\\"); if(c_pos < 3 && c_pos != -1) pth = replaceAt(pth, c_pos, ":"); return pth.trim();}
    this.img_exp = function(img_folder, exp) {var f = img_folder + "update.txt"; if (!p.file(f)) return true; try {var last_upd = Date.parse(this.fs.GetFile(f).DateLastModified); return (Date.now() - last_upd > exp);} catch (e) {return true;}}
    this.InputBox = function(prompt, title, msg) {var vb = new ActiveXObject("ScriptControl"); vb.Language = "VBScript"; var tmp = vb.eval('InputBox(' + [this.box(prompt), this.box(title), this.box(msg)].join(",") + ')'); if (typeof tmp == "undefined") return; if (tmp.length == 254) fb.ShowPopupMessage("Your entry is too long and will be truncated.\n\nEntries are limited to 254 characters.", "YouTube Track Manager"); return tmp.trim();}
    this.IsVideo = function() {if (!fb.IsPlaying || fb.PlaybackLength <= 0) return false; var yt_video = this.eval("%path%").indexOf(".tags") == -1 ? this.eval("%path%").replace(/[\.\/\\]/g, "") : this.eval("$info(@REFERENCED_FILE)").replace(/[\.\/\\]/g, ""); return yt_video.indexOf("youtubecomwatch") != -1 ? true : false;}
    this.h = 0; this.loading = []; this.loc_add = []; this.loc_ix = 0; this.m_x = 0; this.m_y = 0; this.mtags = []; for (var i = 0; i < 20; i++) {this.loading[i] = []; this.loc_add[i] = []; this.mtags[i] = [];}; this.w = 0;
    this.json_parse = function(text, prop, test) {if (test) {test = test.split("|"); for (var i in test) {if (text.indexOf(test[i]) != -1) continue; else return false;}} try {var data = JSON.parse(text);} catch (e) {return false;} if (prop) {prop = prop.split("."); for (var i in prop) {if (data === null || typeof data[prop[i]] === 'undefined') return false; data = data[prop[i]];}} return data;}
    this.json_sort = function(data, prop, reverse) {data.sort(function(a, b) {if (!a[prop]) return 1; if (!b[prop]) return -1; if (a[prop] < b[prop]) return reverse ? 1 : -1; if (a[prop] > b[prop]) return reverse ? -1 : 1; return 0;}); return data;}; var user_lfm_k = window.GetProperty("ADV." + q("mf.tsaL yeK IPA"), "").trim(), user_yt_k = window.GetProperty("ADV." + q("ebuTuoY yeK IPA"), "").trim(); this.lfm = user_lfm_k.length == 32 ? q("=yek_ipa&") + user_lfm_k : q("f50a8f9d80158a0fa0c673faec4584be=yek_ipa&"); this.yt = user_yt_k.length == 39 ? q("=yek&") + user_yt_k : q("wtiKiJ-Ro5_YHToFf-NyDz-Qaym1zcjPBySazIA=yek&"); this.v = user_yt_k.length == 39 && this.yt != q("wtiKiJ-Ro5_YHToFf-NyDz-Qaym1zcjPBySazIA=yek&") && user_lfm_k.length == 32 && this.lfm != q("f50a8f9d80158a0fa0c673faec4584be=yek_ipa&");
    this.np_graphic = !window.GetProperty(" Nowplaying Text Only", false);
    this.num_sort = function(data, prop) {data.sort(function(a, b) {return parseFloat(a[prop]) - parseFloat(b[prop])}); return data;}
    this.on_size = function() {this.sbar_x = this.w - this.sbar_sp;}
    this.rel_imgs = window.GetProperty(" Image Size 0-1", 0.735);
    var replaceAt = function(s, n, t) {return s.substring(0, n) + t + s.substring(n + 1);}
    var WshShell = new ActiveXObject("WScript.Shell"); this.run = function(c, w) {try {WshShell.Run(c, w); return true;} catch (e) {return false;}}
    this.save = function(n, l, t) {try {return utils.WriteTextFile(n, l, t);} catch (e) {return false;}}
    this.scrollbar_show = window.GetProperty(" Scrollbar Show", true);  if (this.btn_mode) {this.np_graphic = false; this.scrollbar_show = false;} try {this.scr_type = parseFloat(window.GetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "0").replace(/\s+/g, "").split("")[0]); if (isNaN(this.scr_type)) this.scr_type = 0;  if (this.scr_type > 2 || this.scr_type < 0) this.scr_type = 0; if (this.scr_type ==2)  window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "2 // Scrollbar Settings N/A For Themed"); else window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + this.scr_type + "");} catch (e) {this.scr_type = 0; window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + 0 + "");} this.scr_col = Math.min(Math.max( window.GetProperty(" Scrollbar Colour Grey-0 Blend-1", 1), 0), 1);
    if (this.scr_type == 2) {this.theme = window.CreateThemeManager("scrollbar"); var im = gdi.CreateImage(21, 21), j = im.GetGraphics(); try {this.theme.SetPartAndStateId(6, 1); this.theme.DrawThemeBackground(j, 0, 0, 21, 50); for (var i = 0; i < 3; i++) {this.theme.SetPartAndStateId(3, i + 1); this.theme.DrawThemeBackground(j, 0, 0, 21, 50);} for (i = 0; i < 3; i++) {this.theme.SetPartAndStateId(1, i + 1); this.theme.DrawThemeBackground(j, 0, 0, 21, 21);}} catch (e) {this.scr_type = 1; window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + 1 + "");} im.ReleaseGraphics(j); im.Dispose();}
    var themed_w = 21; try {themed_w = utils.GetSystemMetrics(2);} catch (e) {}
    var sbw = window.GetProperty(" Scrollbar Size"); if (sbw && sbw.indexOf("GripMinHeight") == -1) window.SetProperty(" Scrollbar Size", sbw + ",GripMinHeight,12");
    var sbar_w = window.GetProperty(" Scrollbar Size", "Bar,11,Arrow,11,Gap(+/-),0,GripMinHeight,12").replace(/\s+/g, "").split(",");
    this.scr_w = parseFloat(sbar_w[1]); if (isNaN(this.scr_w)) this.scr_w = 11; this.scr_w = Math.min(Math.max(this.scr_w, 0), 400); var scr_w_o = Math.min(Math.max(window.GetProperty("SYSTEM.Scrollbar Width Bar", 11), 0), 400);
    this.arrow_pad = parseFloat(sbar_w[5]); if (isNaN(this.arrow_pad)) this.arrow_pad = 0; this.grip_h = parseFloat(sbar_w[7]); if (isNaN(this.grip_h)) this.grip_h = 12;
    if (this.scr_w != scr_w_o) {this.scr_but_w = parseFloat(sbar_w[3]); if (isNaN(this.scr_but_w)) this.scr_but_w = 11; this.scr_but_w = Math.min(this.scr_but_w, this.scr_w, 400); window.SetProperty(" Scrollbar Size", "Bar," + this.scr_w +",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad + ",GripMinHeight," + this.grip_h);} else {this.scr_but_w = parseFloat(sbar_w[3]); if (isNaN(this.scr_but_w)) this.scr_but_w = 11; this.scr_but_w = Math.min(Math.max(this.scr_but_w, 0), 400); this.scr_w = parseFloat(sbar_w[1]); if (isNaN(this.scr_w)) this.scr_w = 11; this.scr_w = Math.min(Math.max(this.scr_w, this.scr_but_w), 400); window.SetProperty(" Scrollbar Size", "Bar," + this.scr_w +",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad + ",GripMinHeight," + this.grip_h);}
    window.SetProperty("SYSTEM.Scrollbar Width Bar", this.scr_w); if (this.scr_type == 2 ) this.scr_w = themed_w; if (!this.scrollbar_show) this.scr_w = 0;
    this.but_h = this.scr_w + (this.scr_type != 2 ? 1 : 0); if (this.scr_type != 2) this.scr_but_w += 1; this.sbar_sp = this.scr_w ? this.scr_w + (this.scr_w - this.scr_but_w < 5 || this.scr_type == 2 ? 1 : 0) : 0; this.arrow_pad = Math.min(Math.max(-this.but_h / 5, this.arrow_pad), this.but_h / 5); this.sbar_o = [2 + this.arrow_pad, Math.max(Math.floor(this.scr_but_w * 0.2), 3) + this.arrow_pad * 2, 0][this.scr_type];
    this.t50_loc = []; this.t50_ix = 0; this.setFocus = -1; this.setVisible = -1;
    this.set_video = function() {timer.reset(timer.vid, timer.vidi); if (this.video_mode && this.IsVideo()) {this.show_video = true; if (!ui.blur) this.show_images = false; if (!alb.show) timer.video();} else {this.show_video = false; this.show_images = true;} if (this.eval("%video_popup_status%") == "hidden" && this.video_mode && this.IsVideo()) fb.RunMainMenuCommand("View/Visualizations/Video"); if (this.eval("%video_popup_status%") == "visible" && (!this.video_mode || !this.IsVideo())) fb.RunMainMenuCommand("View/Visualizations/Video");}
    this.f_yt_ok = tf.popup.Eval(true) ? true : false;
    this.video_mode = this.f_yt_ok ? this.np_graphic && window.GetProperty("SYSTEM.Nowplaying Prefer Video Mode", false) : false;
    this.show_video = this.video_mode; this.show_images = this.np_graphic;
    this.text_auto = window.GetProperty(" Layout Auto Adjust", true)
    this.trace = function(message) {var trace = true; if (trace) console.log("YouTube Track Manager" + ": " + message);}
    this.use_saved = window.GetProperty(" Radio Play Saved Stations", false);
    this.use_local = window.GetProperty("SYSTEM.Use Local", false);
    this.vid_chk = function() {if (this.np_graphic && !alb.show && !t.block() && this.video_mode) return; timer.reset(timer.vid, timer.vidi); if (this.vid_full_ctrl && this.eval("%video_popup_status%") == "visible") fb.RunMainMenuCommand("View/Visualizations/Video");}
    this.vid_full_ctrl = window.GetProperty("ADV.Video Popup Control Default-0 Full-1", 0); if (this.vid_full_ctrl !== 1 && this.vid_full_ctrl !== 0) this.vid_full_ctrl = 0;
    this.yt_order = window.GetProperty("ADV.YouTube Prefer Most: Relevant-0 Views-1", 0); this.yt_order = !this.yt_order ? "relevance" : "viewCount";
    var yttm = fb.ProfilePath + "yttm\\", fn = yttm + "albums\\"; this.create(yttm); this.create(fn);
}
var p = new panel_operations();

function library() {
    var pc = window.GetProperty(" Titleformat Play Count", "%play_count%").trim(), rating = p.use_local ? "%_autorating%" : window.GetProperty(" Titleformat Rating", "%rating%").trim(), sync_mtags = window.GetProperty("ADV.m-TAGS Auto Replace Dead Items 0 or 1", "YouTube,1,Library,0").replace(/\s+/g, "").split(","), use_library = window.GetProperty("SYSTEM.Library","0,0,0").split(","); this.mtags_installed = utils.CheckComponent("foo_tags", true); this.pc_installed = utils.CheckComponent("foo_playcount", true); this.abs_path = window.GetProperty("ADV.m-TAGS Create: Write Absolute Paths", true);
    this.alb = parseFloat(use_library[0]); this.rad = parseFloat(use_library[1]); this.top = parseFloat(use_library[2]);  this.upd_yt_mtags = this.mtags_installed ? parseFloat(sync_mtags[1]) : 0; if (this.upd_yt_mtags !== 1 && this.upd_yt_mtags !== 0) this.upd_yt_mtags = 1; this.upd_lib_mtags = this.mtags_installed ? parseFloat(sync_mtags[3]) : 0; if (this.upd_lib_mtags !== 1 && this.upd_lib_mtags !== 0) this.upd_lib_mtags = 1;

    this.getRelativePath = function(source, target) {
        source = source.replace(/\\/g, "/"); target = target.replace(/\\/g, "/"); var sep = "/", targetArr = target.split(sep), sourceArr = source.split(sep), filename = targetArr.pop(), targetPath = targetArr.join(sep), relativePath = ""; sourceArr.pop();
        while (targetPath.indexOf(sourceArr.join(sep)) === -1) {sourceArr.pop(); relativePath += ".." + sep;}
        var relPathArr = targetArr.slice(sourceArr.length); relPathArr.length && (relativePath += relPathArr.join(sep) + sep); return relativePath + filename;
    }

    this.sort = function(i, set) {
        if (set) {this.sort_type = i - 1; window.SetProperty("SYSTEM.Library Sort", this.sort_type);} else this.sort_type = window.GetProperty("SYSTEM.Library Sort", this.pc_installed ? 0 : 2);
        var sort_ar = [pc, rating, "$rand()", "%bitrate%", "%bitrate%", "%length%", "%length%", "%date%", "%date%"];
        this.track_pref = ["Most Played", "Highest Rated", "Random", "Highest Bitrate", "Lowest Bitrate", "Longest", "Shortest", "Latest", "Earliest"];
        var sort_dir = [0, 0, 1, 0, 1, 0, 1, 0, 1]; this.sort_rand = this.sort_type == 2;
        this.dir = sort_dir[this.sort_type]; this.item_sort = fb.TitleFormat(sort_ar[this.sort_type]);
    }; this.sort(); create_dl_file();

    this.mtags_mng = function() {
        var album_o = "", mtags_date = 0, mtags_pth = "", mtags_yt = false;
        this.on_playback_time = function() {if (!mtags_yt) return; var handle = fb.GetNowPlaying(); if (!handle || !p.file(handle.Path)) return; try {var mod = p.fs.GetFile(handle.Path).DateLastModified; if (mtags_pth != handle.Path || !(mod - mtags_date)) return; mtags_pth = handle.Path; mtags_date = mod; if (!lib) return; lib.upd = true; lib.update = true;} catch (e) {mtags_date = 0; mtags_pth = "";}}
        this.Execute = function() {var handle = fb.GetNowPlaying(); if (!handle || album_o == handle.Path || handle.Path.slice(-7) != "!!.tags") return; try {album_o = handle.Path; mtags_yt = false; if (fb.IsMetadbInMediaLibrary(handle)) {mtags_yt = handle.Path.slice(-7) == "!!.tags"; mtags_pth = handle.Path; mtags_date = p.fs.GetFile(handle.Path).DateLastModified;}} catch (e) {album_o = ""; mtags_date = 0; mtags_pth = ""; mtags_yt = false;}}
    }; this.mtags_mng();
}
var ml = new library();

function text_format() {
    var DT_LEFT = 0x00000000, DT_RIGHT = 0x00000002, DT_CENTER = 0x00000001, DT_VCENTER = 0x00000004, DT_SINGLELINE = 0x00000020, DT_CALCRECT = 0x00000400, DT_NOPREFIX = 0x00000800, DT_WORD_ELLIPSIS = 0x00040000;
    this.halt = function() {return p.w <= but.yt_w || p.h <= but.yt_h || p.btn_mode;}
    this.clickable = function(x, y) {return !alb.show && !this.halt() && !but.btns["yt"].trace(x, y);}
    this.block = function() {return this.halt() || !window.IsVisible;}
    this.rp = true; this.paint = function() {if (this.rp) window.Repaint();}; this.visible = "N/A";
    this.repaint = function() {if (alb.show || this.halt()) return; if (!p.np_graphic) this.paint(); else if (this.rp) window.RepaintRect(10, Math.min(p.h * p.rel_imgs, p.h - img.ny), p.w - 20, Math.max(img.ny, p.h * (1 - p.rel_imgs)));}
    this.removeDiacritics = function (str) {var defaultDiacriticsRemovalMap = [{'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g}, {'base':'AA','letters':/[\uA732]/g}, {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g}, {'base':'AO','letters':/[\uA734]/g}, {'base':'AU','letters':/[\uA736]/g}, {'base':'AV','letters':/[\uA738\uA73A]/g}, {'base':'AY','letters':/[\uA73C]/g}, {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g}, {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g}, {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g}, {'base':'DZ','letters':/[\u01F1\u01C4]/g}, {'base':'Dz','letters':/[\u01F2\u01C5]/g}, {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g}, {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g}, {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g}, {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g}, {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g}, {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g}, {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g}, {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g}, {'base':'LJ','letters':/[\u01C7]/g}, {'base':'Lj','letters':/[\u01C8]/g}, {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g}, {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g}, {'base':'NJ','letters':/[\u01CA]/g}, {'base':'Nj','letters':/[\u01CB]/g}, {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g}, {'base':'OI','letters':/[\u01A2]/g}, {'base':'OO','letters':/[\uA74E]/g}, {'base':'OU','letters':/[\u0222]/g}, {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g}, {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g}, {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g}, {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g}, {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g}, {'base':'TZ','letters':/[\uA728]/g}, {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g}, {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g}, {'base':'VY','letters':/[\uA760]/g}, {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g}, {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g}, {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g}, {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g}, {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g}, {'base':'aa','letters':/[\uA733]/g}, {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g}, {'base':'ao','letters':/[\uA735]/g}, {'base':'au','letters':/[\uA737]/g}, {'base':'av','letters':/[\uA739\uA73B]/g}, {'base':'ay','letters':/[\uA73D]/g}, {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g}, {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g}, {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g}, {'base':'dz','letters':/[\u01F3\u01C6]/g}, {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g}, {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g}, {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g}, {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g}, {'base':'hv','letters':/[\u0195]/g}, {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g}, {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g}, {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g}, {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g}, {'base':'lj','letters':/[\u01C9]/g}, {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g}, {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g}, {'base':'nj','letters':/[\u01CC]/g}, {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g}, {'base':'oi','letters':/[\u01A3]/g}, {'base':'ou','letters':/[\u0223]/g}, {'base':'oo','letters':/[\uA74F]/g}, {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g}, {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g}, {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g}, {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g}, {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g}, {'base':'tz','letters':/[\uA729]/g}, {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g}, {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g}, {'base':'vy','letters':/[\uA761]/g}, {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g}, {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g}, {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g}, {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}]; for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base); return str;}
    var def_genre = "Alternative,Alternative Rock,Classic Rock,Electronic,Experimental,Female Vocalists,Folk,Hard Rock,Hip Hop,Indie,Instrumental,Jazz,Metal,Pop,Progressive Rock,Punk,Rock";
    var def_tags = "10s,00s,90s,80s,70s,60s";
    if (!window.GetProperty("ADV.Radio Genre Menu")) window.SetProperty("ADV.Radio Genre/Tag Menu", null);
    try {this.TopGenre = window.GetProperty("ADV.Radio Genre Menu", def_genre).split(",");} catch (e) {this.TopGenre = def_genre.split(",");}
    try {var tags = window.GetProperty("ADV.Radio Tag Menu", def_tags).split(",");} catch (e) {var tags = def_tags.split(",");}
    this.TopTags = this.TopGenre.concat(tags);
    this.cc = DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_WORD_ELLIPSIS; this.ls = DT_LEFT | DT_VCENTER | DT_SINGLELINE | DT_CALCRECT | DT_NOPREFIX; this.l = DT_LEFT | DT_NOPREFIX | DT_WORD_ELLIPSIS; this.r = DT_RIGHT | DT_NOPREFIX | DT_WORD_ELLIPSIS;
    this.verbose = window.GetProperty("ADV.YouTube 'Preference' Verbose Log (Console)", false);
}
var t = new text_format();

function playlists() {
    var def_pl = ["Album", "Loved", "Radio", "RadioTracks", "Top"], pl_name = window.GetProperty(" Playlists", def_pl[0] + "," + def_pl[1] + "," + def_pl[2] + "," + def_pl[3] + "," + def_pl[4]).split(","), rad_tracks = []; if (pl_name.length != 5) {window.SetProperty(" Playlists", def_pl[0] + "," + def_pl[1] + "," + def_pl[2] + "," + def_pl[3] + "," + def_pl[4]); pl_name = window.GetProperty(" Playlists").replace(/\s+/g, "").split(",");} if (!p.v) {this.top50 = Math.min(window.GetProperty(" Load Menu TopTracks Size 1-50", 50), 50); window.SetProperty(" Load Menu TopTracks Size 1+", null);} else {this.top50 = window.GetProperty(" Load Menu TopTracks Size 1+", 50); window.SetProperty(" Load Menu TopTracks Size 1-50", null);}
    this.menu = []; this.alb_yttm = " // YouTube Track Manager";
    this.alb = plman.FindOrCreatePlaylist(pl_name[0] + (ml.alb && ml.mtags_installed ? " New" : ""), false); this.loved = plman.FindOrCreatePlaylist(pl_name[1], false); this.rad = plman.FindOrCreatePlaylist(pl_name[2], false); this.tracks = plman.FindOrCreatePlaylist(pl_name[4] + "Tracks", false);
    this.alb_orig = plman.FindOrCreatePlaylist(pl_name[0], false);
    this.active = function() {return plman.GetPlaylistName(plman.ActivePlaylist);}
    this.t50_playlist = pl_name[4] + this.top50; this.t40_playlist = pl_name[4] + 40; this.soft_playlist = pl_name[4] + "Tracks";
    this.exist = function(n, sav_t50, top40) {var name = sav_t50 ? (!top40 ? this.t50_playlist : this.t40_playlist) + " [" + n + "]" : (!top40 ? this.t50_playlist : this.t40_playlist) + ": " + n; for (var i = 0; i < plman.PlaylistCount; i++) {if (plman.GetPlaylistName(i) == name) return true;} return false;}
    this.IX = function(Playlist_Name) {var n = -1; for (var i = 0; i < plman.PlaylistCount; i++) if (plman.GetPlaylistName(i).indexOf(Playlist_Name) != -1) {n = i; break;} return n;}
    this.playlists_changed = function() {this.alb = plman.FindOrCreatePlaylist(pl_name[0] + (ml.alb && ml.mtags_installed ? " New" : ""), false); this.alb_orig = plman.FindOrCreatePlaylist(pl_name[0], false); this.loved = plman.FindOrCreatePlaylist(pl_name[1], false); this.rad = plman.FindOrCreatePlaylist(pl_name[2], false); this.tracks = plman.FindOrCreatePlaylist(pl_name[4] + "Tracks", false); this.menu = []; for (var i = 0; i < plman.PlaylistCount; i++) this.menu.push({name:plman.GetPlaylistName(i).replace(/&/g, "&&"), ix:i});}
    this.t50 = function(n, sav_t50, top40) {if (!n) return; if (!sav_t50) {var name = (!top40 ? this.t50_playlist : this.t40_playlist) + ": " + n; for (var i = 0; i < plman.PlaylistCount; i++) if (plman.GetPlaylistName(i).indexOf((!top40 ? this.t50_playlist : this.t40_playlist) + ": ") == 0) {plman.RenamePlaylist(i, name); return i}; plman.CreatePlaylist(plman.PlaylistCount, name); return i;} else return plman.FindOrCreatePlaylist((!top40 ? this.t50_playlist : this.t40_playlist) + " [" + n + "]", false);}

    this.love = function() {
        var np = plman.GetPlayingItemLocation();
        if (fb.IsPlaying && np.IsValid) {var pid = np.PlaylistItemIndex; var pn = plman.PlayingPlaylist;}
        else {var pid = plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist); var pn = plman.ActivePlaylist;}
        plman.ClearPlaylistSelection(pn); plman.SetPlaylistSelectionSingle(pn, pid, true);
        if (this.loved != pn) {plman.InsertPlaylistItems(this.loved, plman.PlaylistItemCount(this.loved), plman.GetPlaylistSelectedItems(pn), false);}
        else {plman.RemovePlaylistSelection(this.loved, false);}
    }

    this.save_radio = function(playlistIndex, np) {
        if (playlistIndex != this.rad || !np || !index.rad_source) return;
        var rdio_text = index.rad_type == 2 ? " And Similar Artists" : "", save_pl_index = plman.FindOrCreatePlaylist(pl_name[3] + " [" + index.rad_source + rdio_text + "]", false);
        var items = fb.CreateHandleList(), save_pl_count = plman.PlaylistItemCount(save_pl_index), sav_list = plman.GetPlaylistItems(save_pl_index);
        for (var i = 0; i < np.Count; i++) if (!index.arr_contains(rad_tracks, np.Item(i).Path)) {var found = false; for (var j = 0; j < sav_list.Count; j++) if (np.Item(i).Path == sav_list.Item(j).Path) found = true; if (!found) items.Add(np.Item(i)); rad_tracks.push(np.Item(i).Path);}
        plman.InsertPlaylistItems(save_pl_index, save_pl_count, items); if (rad_tracks.length > rad.limit * 2) rad_tracks.splice(0, 1); if (np) np.Dispose(); if (sav_list) sav_list.Dispose(); if (items) items.Dispose();
    }
}
pl = new playlists();

function save_playlist() {
    var sav_pl = window.GetProperty(" Playlists Save 0 or 1", "Radio,0,Top50[Artist],1,Top50[SimilarSongs],1,Top40,1").replace(/\s+/g, "").split(","), set_prop = false;
    if (sav_pl[2] != "Top" + pl.top50 +"[Artist]") {sav_pl[2] = "Top" + pl.top50 +"[Artist]"; set_prop = true;}
    if (sav_pl[4] != "Top" + pl.top50 +"[SimilarSongs]") {sav_pl[4] = "Top" + pl.top50 +"[SimilarSongs]"; set_prop = true;}
    if (set_prop) window.SetProperty(" Playlists Save 0 or 1", sav_pl[0] + "," + sav_pl[1] + "," + sav_pl[2] + "," + sav_pl[3] + "," + sav_pl[4] + "," + sav_pl[5] + "," + sav_pl[6] + "," + sav_pl[7])
    this.rad = parseFloat(sav_pl[1]); if (this.rad !== 1 && this.rad !== 0) this.rad = 0; this.t50 = parseFloat(sav_pl[3]); if (this.t50 !== 1 && this.t50 !== 0) this.t50 = 1; this.songs = parseFloat(sav_pl[5]); if (this.songs !== 1 && this.songs !== 0) this.songs = 1; this.chart = parseFloat(sav_pl[7]); if (this.chart !== 1 && this.chart !== 0) this.chart = 1;
}
var save_pl = new save_playlist();

function library_manager() {
    var art_arr = [], core = window.GetProperty(" Library: Include Partial Matches 0 or 1", "Artist,0,Title,0").replace(/\s+/g, "").split(","), db_alb, db_art, db_lib, lib_upd = fb.CreateProfiler(), last_time = lib_upd.Time, o_artist = "", n = [], p1 = [], p2 = [], pmc = window.GetProperty("ADV.Partial Match Configuration", "FuzzyMatch%,80,RegEx,\\(|\\[|feat,Console,false").replace(/\s+/g, "").split(","), title_cut = ""; this.art_ed = []; this.art_ed_tags = []; this.upd = true; this.update = true;
    var filter = window.GetProperty("ADV.Library Filters All Modes (| Separator)", "").split("|"); filter.unshift("None");
    this.filter = []; for (var r = 0; r < filter.length; r++) {var fil = p.use_local ? filter[r].replace("%rating%", "%_autorating%").trim() : filter[r].trim(); if (fil.length) this.filter.push(fil);}
    this.filterID = window.GetProperty("SYSTEM.Library Filter All Modes ID", 0); if (this.filterID > this.filter.length - 1) {this.filterID = 0; window.SetProperty("SYSTEM.Library Filter All Modes ID", 0);}
    this.pm_art = core[1] == 1; this.pm_title = core[3] == 1; this.pmt = window.GetProperty("ADV.Partial Match: 0 Fuzzy-1 RegEx-2 Either-3", "Album,1,LfmRadio,3,LibRadio,3,Top50:40,1,TopTracks,3").replace(/\s+/g, "").split(","); this.sel = []; if (this.pmt[6] != "Top" + pl.top50 +":40") {this.pmt[6] = "Top" + pl.top50 +":40"; window.SetProperty("ADV.Partial Match: 0 Fuzzy-1 RegEx-2 Either-3", this.pmt[0] + "," + this.pmt[1] + "," + this.pmt[2] + "," + this.pmt[3] + "," + this.pmt[4] + "," + this.pmt[5] + "," + this.pmt[6] + "," + this.pmt[7] + "," + this.pmt[8] + "," + this.pmt[9])}
    var fu = parseFloat(pmc[1]), q_alb = " IS ", valid_regex = pmc[3] && pmc[3] != 0 && pmc[3].length, fuz_sel_title = this.pm_title && (this.pmt[5] == 1 || this.pmt[5] == 3), has_sel = false, trc_sel_art =  this.pm_art && (this.pmt[5] == 2 || this.pmt[5] == 3), trc_title = this.pm_title && valid_regex, trc_sel_title = trc_title && (this.pmt[5] == 2 || this.pmt[5] == 3), fuz_alb_title = this.pm_title && (this.pmt[1] == 1 || this.pmt[1] == 3), trc_alb_art = this.pm_art && (this.pmt[1] == 2 || this.pmt[1] == 3), trc_alb_title = this.pm_title && (this.pmt[1] == 2 || this.pmt[1] == 3)  && valid_regex, verbose = pmc[5] == "true"; fu = Math.min(Math.max(fu, 0), 100) / 100; if (this.pm_art && this.pmt[5] != 0) has_sel = true; if (this.pm_art && this.pmt[1] != 0) q_alb = " HAS ";
    String.prototype.cut = function() {try {var n = this.split(RegExp(pmc[3], "gi"))[0]; return n.length > 3 ? n : this;} catch (e) {return this}};
    var check_match = function(n, l) {try {return 1 - levenshtein(n, l)/(n.length > l.length ? n.length : l.length) > fu;} catch (e) {return false}} // fu sets match level
    var levenshtein = function(a, b) {if (a.length === 0) return b.length; if (b.length === 0) return a.length; var i, j, prev, row, tmp, val; if (a.length > b.length) {tmp = a; a = b; b = tmp;} row = Array(a.length + 1); for (i = 0; i <= a.length; i++) row[i] = i; for (i = 1; i <= b.length; i++) {prev = i; for (j = 1; j <= a.length; j++) {if (b[i - 1] === a[j - 1]) val = row[j - 1]; else val = Math.min(row[j - 1] + 1, Math.min(prev + 1, row[j] + 1)); row[j - 1] = prev; prev = val;} row[a.length] = prev;} return row[a.length];}
    var load_lib = function(path, id, v, p_ar, p_ti, p_t50) {!p_t50 ? p.add_loc.push({"path":path,"id":id}) : p.t50_loc.push({"path":path,"id":id}); if (verbose) p.trace((!v ? "STANDARD MATCH " : v == 1 ? "FUZZY TITLE MATCH " : "TRUNCATE TITLE MATCH ") + "FOUND :: SEARCH: " + p_ar + " - " + p_ti);}
    var load_lib_sel = function(orig_artist, p_title, path, id, p_lfm_pc) {if (!obj_contains(p.add_loc, id)) p.add_loc.push({"artist":orig_artist,"title":p_title,"path":path,"id":id,"playcount":p_lfm_pc});}
    var obj_contains = function(arr, p_id) {var i = arr.length; while (i--) if (arr[i].id == p_id) return true; return false;}
    this.alb_playlist = function(a_n) {if (!a_n) return; var n = false, d_l = fb.CreateHandleList(); try {d_l = fb.GetQueryItems(this.get_lib_items(), name.q_a + " IS " + a_n)} catch (e) {}; if (d_l.Count) n = true; if (!n) {var d_a = fb.CreateHandleList(); try {d_a = fb.GetQueryItems(db_alb, name.q_a + " IS " + a_n)} catch (e) {}; if (d_a.Count) n = true;} if (d_a) d_a.Dispose(); if (d_l) d_l.Dispose(); return n;}
    this.get_album_artist = function() {var pn = plIX(pl.alb_yttm); if (pn == -1 || !plman.PlaylistItemCount(pn)) return; var db_aa = plman.GetPlaylistItems(pn); this.albumartist = tf.a0.EvalWithMetadb(db_aa.Item(0)); if (db_aa) db_aa.Dispose();}
    this.get_album_metadb = function() {if (db_alb) db_alb.Dispose(); db_alb = plman.GetPlaylistItems(pl.alb_orig);}
    this.get_lib_items = function() {if (!this.update) return db_lib; this.update = false; if (db_lib) db_lib.Dispose(); db_lib = fb.GetLibraryItems(); if (this.filterID) try {db_lib = fb.GetQueryItems(db_lib, this.filter[this.filterID]);} catch (e) {}; return db_lib;}
    this.in_library_art = function(p_artist) {if (!p_artist) return false; var art_array = this.get_lib_artists(), n = false; for (var i = 0; i < art_array.length; i++) {if (art_array[i] == p_artist.toLowerCase()) {n = true; break;}} return n;}
    var plIX = function(Playlist_Name) {var n = -1; for (var i = 0; i < plman.PlaylistCount; i++) if (plman.GetPlaylistName(i).indexOf(Playlist_Name) != -1) {n = i; break;} return n;}
    var remove_playlist = function(name) {var i = plman.PlaylistCount; while (i--) if (plman.GetPlaylistName(i).indexOf(name) != -1) plman.RemovePlaylist(i);};

    this.get_lib_artists = function() {
        if (!this.upd) return art_arr; art_arr = []; var art_o = "", db_artists = this.get_lib_items().Clone(); db_artists.OrderByFormat(tf.a0, 0); var art = tf.a0.EvalWithMetadbs(db_artists).toArray();
        for (var j = 0; j < db_artists.Count; j++) {if (db_artists.Item(j).Path.slice(-7).toLowerCase() == "!!.tags" || db_artists.Item(j).Path.slice(-4).toLowerCase() == ".cue") continue; art[j] = art[j].toLowerCase(); if (art[j] && art_o != art[j]) art_arr.push(art[j]); art_o = art[j];}
        this.upd = false; if (db_artists) db_artists.Dispose(); return art_arr;
    }

    this.in_library = function(p_artist, p_title, i, p_top50, p_alb_set) {
        if (!p_artist || !p_title) return false; var q = " IS ";
        var fuzzy = this.pm_title && ((p_top50 && (this.pmt[7] == 1 || this.pmt[7] == 3)) || (p_alb_set && (this.pmt[9] == 1 || this.pmt[9] == 3)) || (!p_top50 && !p_alb_set && (this.pmt[3] == 1 || this.pmt[3] == 3)));
        var trunc_art = this.pm_art && ((p_top50 && (this.pmt[7] == 2 || this.pmt[7] == 3)) || (p_alb_set && (this.pmt[9] == 2 || this.pmt[9] == 3)) || (!p_top50 && !p_alb_set && (this.pmt[3] == 2 || this.pmt[3] == 3)));
        var trunc_title = trc_title && ((p_top50 && (this.pmt[7] == 2 || this.pmt[7] == 3)) || (p_alb_set && (this.pmt[9] == 2 || this.pmt[9] == 3)) || (!p_top50 && !p_alb_set && (this.pmt[3] == 2 || this.pmt[3] == 3)));
        if (trunc_art) p_artist = p_artist.cut().trim();
        if (this.pm_art && ((p_top50 && this.pmt[7] != 0) || (p_alb_set && this.pmt[9] != 0) || (!p_top50 && !p_alb_set && this.pmt[3] != 0))) q = " HAS ";
        if (verbose) p.trace("MATCH: ARTIST QUERY:" + q + p_artist);
        if (p_artist != o_artist || lib_upd.Time - last_time > 2000) {if (db_art) db_art.Dispose(); try {db_art = fb.GetQueryItems(this.get_lib_items(), "(" + name.q_a + q + p_artist + ") AND (NOT %path% HAS !!.tags) AND (NOT \"$ext(%path%)\" IS cue)")} catch (e) {db_art = fb.CreateHandleList()}; db_art.OrderByFormat(tf.r, 1); if (!ml.sort_rand) db_art.OrderByFormat(ml.item_sort, ml.dir);}
        p1[i] = ""; o_artist = p_artist; p_title = p_title.strip(); lib_upd.Reset(); last_time = lib_upd.Time;
        var titles = tf.t0.EvalWithMetadbs(db_art).toArray();
        for (var j = 0; j < db_art.Count; j++) {
            var item = db_art.Item(j); titles[j] = titles[j].strip()
            if (titles[j] == p_title) {if (item.Path.slice(-5) != ".tags") {p1[i] = item.Path; load_lib(p1[i], i, 0, p_artist, p_title, p_top50); return true;} else if (!p1[i]) p1[i] = item; if (p1[i]) {p1[i] = tf.i.EvalWithMetadb(p1[i]); if (p1[i].indexOf("file://") != -1 && p1[i].slice(-5) != ".tags") {p1[i] = p1[i].replace("file://", ""); load_lib(p1[i], i, 0, p_artist, p_title, p_top50); return true;} else p1[i] = "";}}
            if (fuzzy) {if (check_match(p_title, titles[j])) {if (item.Path.slice(-5) != ".tags") {p1[i] = item.Path; load_lib(p1[i], i, 1, p_artist, p_title, p_top50); return true;} else if (!p1[i]) p1[i] = item; if (p1[i]) {p1[i] = tf.i.EvalWithMetadb(p1[i]); if (p1[i].indexOf("file://") != -1 && p1[i].slice(-5) != ".tags") {p1[i] = p1[i].replace("file://", ""); load_lib(p1[i], i, 1, p_artist, p_title, p_top50); return true;} else p1[i] = "";}}}
            if (trunc_title) {title_cut = p_title.cut(); if (titles[j].cut() == title_cut) {if (item.Path.slice(-5) != ".tags") {p1[i] = item.Path; load_lib(p1[i], i, 1, p_artist, title_cut, p_top50); return true;} else if (!p1[i]) p1[i] = item; if (p1[i]) {p1[i] = tf.i.EvalWithMetadb(p1[i]); if (p1[i].indexOf("file://") != -1 && p1[i].slice(-5) != ".tags") {p1[i] = p1[i].replace("file://", ""); load_lib(p1[i], i, 1, p_artist, title_cut, p_top50); return true;} else p1[i] = "";}}}
        }
        if (verbose) p.trace("NO LIBRARY MATCH FOUND :: SEARCH: " + p_artist + " - " + p_title); return false;
    }

    this.in_library_sel = function(p_artist, p_title, i, art_i, p_lfm_pc) {
        if (!p_artist || !p_title) return false; var item = "",  items = 0, la = this.sel.length, orig_artist = p_artist, p_artist = p_artist.toUpperCase();
        if (trc_sel_art) p_artist = p_artist.cut().trim(); p_title = p_title.strip();
        for (var j = 0; j < la; j++) if (!has_sel ? this.sel[j].artist == p_artist : this.sel[j].artist.indexOf(p_artist) != -1) {
            items = this.sel[j].item.length;
            for (var k = 0; k < items; k++) {item = this.sel[j].item[k]; if (item.title == p_title) return load_lib_sel(orig_artist, p_title, item.path, item.id, p_lfm_pc);}
            if (fuz_sel_title) {for (k = 0; k < items; k++) {item = this.sel[j].item[k]; if (check_match(p_title, item.title)) return load_lib_sel(orig_artist, p_title, item.path, item.id, p_lfm_pc);}}
            if (trc_sel_title) {title_cut = p_title.cut(); for (k = 0; k < items; k++) {item = this.sel[j].item[k]; if (item.title.cut() == title_cut) return load_lib_sel(orig_artist, p_title, item.path, item.id, p_lfm_pc);}}
        } if (verbose) p.trace("NO LIBRARY MATCH FOUND :: SEARCH: " + p_artist + " - " + p_title + " MATCH: ARTIST QUERY: " + (has_sel ? "HAS" : "IS " + p_artist));
    }

    this.get_lib_sel = function(li) {
        var i = 0, nm_o = "#get_node#", pth, total = li.Count; li.OrderByFormat(tf.r, 1); li.OrderByFormat(tf.t, 1); if (!ml.sort_rand) li.OrderByFormat(ml.item_sort, ml.dir); li.OrderByFormat(tf.a, 1); var total = li.Count; this.sel = [];
        var artists = tf.a0.EvalWithMetadbs(li).toArray(), titles = tf.t0.EvalWithMetadbs(li).toArray();
        for (var l = 0; l < total; l++) {artists[l] = artists[l].toUpperCase();
            if (artists[l] != nm_o) {nm_o = artists[l]; this.sel[i] = {artist:artists[l], item:[]}; if (li.Item(l).Path.slice(-5) == ".tags") {pth = tf.i.EvalWithMetadb(li.Item(l)); if (pth.indexOf("file://") == -1 || pth.slice(-5) == ".tags") pth = ""; else pth = pth.replace("file://", "")} else pth = li.Item(l).Path; if (pth.length) this.sel[i].item.push({title:titles[l].strip(), path:pth, id:l}); i++;}
            else {if (li.Item(l).Path.slice(-5) == ".tags") {pth = tf.i.EvalWithMetadb(li.Item(l)); if (pth.indexOf("file://") == -1 || pth.slice(-5) == ".tags") pth = ""; else pth = pth.replace("file://", "")} else pth = li.Item(l).Path; if (pth.length) this.sel[i - 1].item.push({title:titles[l].strip(),path:pth, id:l});}}
    }

    this.artist_edit = function(p_album_artist) {
        if (trc_alb_art) p_album_artist = p_album_artist.cut().trim();
        if (this.pm_art && verbose) p.trace("MATCH ARTIST [ALBUM]: QUERY:" + q_alb + p_album_artist);
        this.art_ed = fb.CreateHandleList(); this.art_ed_tags = fb.CreateHandleList(); if (!p_album_artist) return; var d_lb = this.get_lib_items().Clone();
        try {this.art_ed = fb.GetQueryItems(d_lb, "(" + name.q_a + q_alb + p_album_artist + ") AND (NOT %path% HAS .tags) AND (NOT \"$ext(%path%)\" IS cue)")} catch (e) {}; this.art_ed.OrderByFormat(tf.r, 1); if (!ml.sort_rand) this.art_ed.OrderByFormat(ml.item_sort, ml.dir);
        try {this.art_ed_tags = fb.GetQueryItems(d_lb, "(" + name.q_a + q_alb + p_album_artist + ") AND (%path% HAS .tags) AND (NOT \"$ext(%path%)\" IS cue)")} catch (e) {};
        this.art_ed_tags.OrderByFormat(tf.r, 1); if (!ml.sort_rand) this.art_ed_tags.OrderByFormat(ml.item_sort, ml.dir); if (d_lb) d_lb.Dispose();
    }

    this.in_library_alb = function(p_alb_id, p_artist, p_title, p_album, p_date, i, p_upd) {
        if (!p_title) return false; n[i] = 0; p2[i] = ""; var search_title= p_title, title = p_title, type_arr = ["", "YouTube Track", "Prefer Library Track", "Library Track"]; p_title = p_title.strip();
        var titles = tf.t0.EvalWithMetadbs(this.art_ed).toArray(), titles_tags = tf.t0.EvalWithMetadbs(this.art_ed_tags).toArray();
        for (var k = 0; k < this.art_ed.Count; k++) if (titles[k].strip() == p_title) {p2[i] = this.art_ed.Item(k).Path; n[i] = 1; break;}
        if (!n[i]) for (k = 0; k < this.art_ed_tags.Count; k++) if (titles_tags[k].strip() == p_title) {p2[i] = tf.i.EvalWithMetadb(this.art_ed_tags.Item(k));
            if (p2[i].indexOf("file://") != -1 && p2[i].slice(-5) != ".tags") {p2[i] = p2[i].replace("file://", ""); n[i] = 2; break;}}
        if (verbose) p.trace("STANDARD MATCH " + (n[i] ?  "" : "NOT ") + "FOUND [ALBUM] SEARCH: " + p_artist + " - " + p_title);
        if (!n[i] && fuz_alb_title) {
            for (k = 0; k < this.art_ed.Count; k++) if (check_match(p_title, titles[k].strip())) {p2[i] = this.art_ed.Item(k).Path; n[i] = 1; break;}
            if (!n[i]) for (k = 0; k < this.art_ed_tags.Count; k++) if (check_match(p_title, titles_tags[k].strip())) {p2[i] = tf.i.EvalWithMetadb(this.art_ed_tags.Item(k)); if (p2[i].indexOf("file://") != -1 && p2[i].slice(-5) != ".tags") {p2[i] = p2[i].replace("file://", ""); n[i] = 2; break;}}
            if (verbose) p.trace("FUZZY TITLE MATCH " + (n[i] ?  "" : "NOT ") + "FOUND [ALBUM] :: SEARCH: " + p_artist + " - " + p_title);
        }
        if (!n[i] && trc_alb_title) {
            p_title = p_title.cut(); title = title.cut();
            for (k = 0; k < this.art_ed.Count; k++) if (titles[k].strip().cut() == p_title) {p2[i] = this.art_ed.Item(k).Path; n[i] = 1; break;}
            if (!n[i]) for (k = 0; k < this.art_ed_tags.Count; k++) if (titles_tags[k].strip().cut() == p_title) {p2[i] = tf.i.EvalWithMetadb(this.art_ed_tags.Item(k)); if (p2[i].indexOf("file://" && p2[i].slice(-5) != ".tags") != -1) {p2[i] = p2[i].replace("file://", ""); n[i] = 2; break;}}
            if (verbose) p.trace("TRUNCATE TITLE MATCH " + (n[i] ?  "" : "NOT ") + "FOUND [ALBUM] :: SEARCH: " +p_artist + " - " + p_title);
        }
        if (!n[i] && verbose) p.trace("NO LIBRARY MATCH FOUND [ALBUM] :: SEARCH: " + p_artist + " - " + p_title);
        if (n[i]) {var tfa = n[i] == 1 ? this.art_ed.Item(k) : this.art_ed_tags.Item(k);}
        if (n[i]) {
            var tf_d = tf.d.EvalWithMetadb(tfa), tf_rg = tf.rg.EvalWithMetadb(tfa), tf_rp = tf.rp.EvalWithMetadb(tfa); if (!tf_d) tf_d = []; if (!tf_rg) tf_rg = []; if (!tf_rp) tf_rp = [];
            if (p_upd) return [p_alb_id,"/" + p2[i].replace(/\\/g, "/"), tf_d, tf_rg, tf_rp, i];
            p.mtags[p_alb_id].push({"@":"/" + p2[i].replace(/\\/g, "/"),"ALBUM":p_album,"ARTIST":p_artist,"DATE":p_date,"DURATION":tf_d,"REPLAYGAIN_TRACK_GAIN":tf_rg,"REPLAYGAIN_TRACK_PEAK":tf_rp,"TITLE":title,"TRACKNUMBER":i.toString(),"YOUTUBE_TITLE":[],"YOUTUBE_TRACK_MANAGER_SEARCH_TITLE":search_title ? search_title : [],"YOUTUBE_TRACK_MANAGER_TRACK_TYPE":type_arr[ml.alb]});
        } return !p_upd ? n[i] : [];
    }

    this.albums_playlist = function(a_n) {
        var d_li = fb.CreateHandleList(), li_add = fb.CreateHandleList(); remove_playlist(pl.alb_yttm); this.albumartist = a_n; if (!a_n) return;
        try {d_li = fb.GetQueryItems(this.get_lib_items(), name.q_a + " IS " + this.albumartist)} catch (e) {};
        try {li_add = fb.GetQueryItems(db_alb, name.q_a + " IS " + this.albumartist)} catch (e) {}
        d_li.AddRange(li_add); d_li.OrderByFormat(tf.pl, 1);
        var pn = plman.FindOrCreatePlaylist("Albums [" + this.albumartist + "]" + pl.alb_yttm, false);
        plman.InsertPlaylistItems(pn, 0, d_li); if (d_li) d_li.Dispose(); if (li_add) li_add.Dispose();
        plman.ActivePlaylist = pn; plman.SetPlaylistFocusItem(pn, 0); plman.ClearPlaylistSelection(pn);
    }
}
var lib; window.SetTimeout(function() {pl.playlists_changed(); lib = new library_manager(); if (ml.alb) lib.artist_edit(alb.artist); lib.get_album_metadb(); lib.get_album_artist(); ml.Execute();}, 500);

function blacklist() {
    var n = fb.ProfilePath + "yttm\\" + "blacklist.json"; this.remove = true; this.undo = [];
    this.list = function(clean_artist) {var black_list = []; if (!p.file(n)) return black_list; var obj = p.json_parse(utils.ReadTextFile(n)); if (!obj.blacklist[clean_artist]) return black_list; for (var i = 0; i < obj.blacklist[clean_artist].length; i++) black_list.push(obj.blacklist[clean_artist][i].id); return black_list;}
    this.removeNulls = function(obj) {var isArray = obj instanceof Array; for (var k in obj) {if (obj[k].length == 0) isArray ? obj.splice(k, 1) : delete obj[k]; else if (typeof obj[k] == "object") this.removeNulls(obj[k]);}}
}
var blk = new blacklist();

function youtube_search(state_callback, on_search_done_callback) {
    var alb_id, alb_set, alt_id = -1, channelTitle = [], description = [], done, feedback = false, first_id = -1, fn = "", full_alb = false, get_length = false, ix, length = [], link = [], metadata, mtags = false, orig_title, pn, search_artist, search_title, title = [], top50, type, yt_filt = index.yt_filter, yt_title = "";
    var secs = function(n) {var re = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/; if (re.test(n)) {var m = re.exec(n); return (Number(m[1]) * 3600 || 0) + (Number(m[2]) || 0) * 60 + (Number(m[3]) || 0)}}
    this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback;  this.ie_timer = false;
    this.Null = function() {if (full_alb && !fn) {alb.set_row(alb_id, 0, search_artist); t.paint();} this.on_search_done_callback(alb_id, "", search_artist, "", "", done, top50, pn);}

    this.on_state_change = function() {
        if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {
            window.ClearTimeout(this.ie_timer); this.ie_timer = false;
            if (this.xmlhttp.status == 200) this.func();
            else {this.Null(); p.trace("youtube N/A: " + this.xmlhttp.responsetext || "Status error: " + this.xmlhttp.status);}
        }
    }

    this.Search = function(p_alb_id, p_artist, p_title, p_ix, p_done, p_top50, p_pn, p_extra_metadata, p_alb_set, p_full_alb, p_fn, p_type) {
        this.func = null; this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        var URL = "https://www.googleapis.com/youtube/v3/";
        if (!get_length) {
            alb_id = p_alb_id; search_artist = p_artist; orig_title = p_title; search_title = p_title; ix = p_ix; done = p_done; top50 = p_top50; pn = p_pn; metadata = p_extra_metadata; alb_set = p_alb_set; full_alb = p_full_alb; fn = p_fn; type = p_type; mtags = ml.alb && ml.mtags_installed && alb_id !== "" && !alb_set;
            if (!search_artist || !search_title) return this.Null(); if (yt_filt) yt_filt = !index.filter_yt(search_title, "");
            URL += "search?part=snippet&maxResults=25&q=" + encodeURIComponent(p_artist + " " + p_title) + "&order=" + p.yt_order + "&type=video&fields=items(id(videoId),snippet(title)" + (yt_filt || index.yt_pref ? ",snippet(description)" : "") + (index.yt_pref ? ",snippet(channelTitle)" : "") + ")" + p.yt;
        } else URL += "videos?part=contentDetails&id=" + link + "&fields=items(contentDetails(duration))" + p.yt;
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; this.xmlhttp.send();
        if (!this.ie_timer) {var a = this.xmlhttp, that = this; this.ie_timer = window.SetTimeout(function() {a.abort(); if (full_alb && !fn) {alb.set_row(alb_id, 0, search_artist); t.paint();} that.on_search_done_callback(alb_id, "", search_artist, "", "", "force"); that.ie_timer = false;}, 30000);}
    }

    this.Analyse = function() {
        var data = p.json_parse(this.xmlhttp.responsetext, "items"), i = 0, url = "";
        if (data && !get_length) {for (i = 0; i < data.length; i++) {if (data[i].id && data[i].id.videoId) {title.push(data[i].snippet.title); link.push(data[i].id.videoId); if (yt_filt || index.yt_pref) {var d = data[i].snippet.description; description.push(d ? d : "");} if (index.yt_pref) {var ct = data[i].snippet.channelTitle; channelTitle.push(ct ? ct : "");}}}; get_length = true; return this.Search();} var v_length = 0;
        if (data && get_length) {
            for (i = 0; i < data.length; i++) {length[i] = secs(data[i].contentDetails.duration); if (!length[i]) length[i] = ""; link[i] = "v=" + link[i];}
            var m = this.IsGoodMatch(title, link, yt_filt || index.yt_pref ? description : "", index.yt_pref ? channelTitle : "", length, data.length);
            if (m != -1) {
                search_title = search_title.cleanse().strip_title(search_artist, true); v_length = length[m];
                url = "3dydfy://www.youtube.com/watch?" + (!mtags ? (metadata ? metadata + "&" : "") + "fb2k_title=" + encodeURIComponent(search_title + (!full_alb ? "" : " (Full Album)")) + "&3dydfy_alt_length=" + encodeURIComponent(v_length) + "&fb2k_artist=" + encodeURIComponent(search_artist) + "&" : "") + link[m]; yt_title = title[m];
                if (t.verbose && !feedback) p.trace("MATCHED: Artist - Title: " + "Search Artist: " + search_artist + "; Search Title: " + search_title + "; Video Loaded: ix: " + m + "; Video Title: " + title[m]);
            }
        }
        if (!get_length) return;
        if (!url.length) {
            if (full_alb) return this.Null(); var id = alt_id != -1 ? alt_id : first_id;  if (id != -1) v_length = length[id]; else return this.Null();
            if (t.verbose) p.trace("IDEAL MATCH NOT FOUND. Search Artist: " + search_artist + "; Search Title: " + search_title + "; Video Loaded: ix: " + id + "; Video Title: " + title[id]); search_title = title[id].cleanse().strip_title(search_artist);
            url = "3dydfy://www.youtube.com/watch?" + (!mtags ? (metadata ? metadata + "&" : "") + "fb2k_title=" + encodeURIComponent(search_title) + "&3dydfy_alt_length=" + encodeURIComponent(v_length) + "&fb2k_artist=" + encodeURIComponent(search_artist) + "&" : "") + link[id]; yt_title = title[id];
        }
        this.on_search_done_callback(alb_id, url, search_artist, search_title, ix, done, top50, pn, alb_set, v_length, orig_title, yt_title, full_alb, fn, type);
    }

    this.IsGoodMatch = function(video_title, video_id, video_descr, video_uploader, video_len, p_done) {
        var base_OK = [], bl_artist = search_artist.tidy(), clean_artist = t.removeDiacritics(search_artist.replace(/&/g, "").replace(/\band\b/gi, "").strip()), clean_title = t.removeDiacritics(search_title.replace(/&/g, "").replace(/\band\b/gi, "").strip()), i = 0, j = 0, k = 0; var mv = [];
        for (i = 0; i < p_done; i++) {
            var clean_vid_title = t.removeDiacritics(video_title[i].replace(/&/g, "").replace(/\band\b/gi, "").strip()); base_OK[i] = video_len[i] && (!full_alb ? video_len[i] < 1800 : video_len[i] > 1800) && (!blk.list(bl_artist).length ? true : !index.arr_contains(blk.list(bl_artist), video_id[i])) && (!yt_filt ? true : !index.filter_yt(video_title[i], video_descr[i]))
            if (clean_vid_title.indexOf(clean_artist) != -1 && clean_vid_title.indexOf(clean_title) != -1 && base_OK[i]) {if (!index.yt_pref) return i; else mv.push({ix:i, uploader:video_uploader[i], title:video_title[i], descr:video_descr[i]});}
        }
        if (mv.length) {
            if (t.verbose) p.trace("Match List. Search Artist: " + search_artist + "; Search Title: " + search_title + "\n" + JSON.stringify(mv, null, 3));
            for (k = 0; k < index.yt_pref_kw.length; k++) {for (j = 0; j < mv.length; j++) if (index.pref_yt(index.yt_pref_kw[k], (index.chk_upl ? mv[j].uploader : "") + (index.chk_title ? mv[j].title : "") + (index.chk_descr ? mv[j].descr : ""))) {if (t.verbose) p.trace("MATCHED: Artist - Title AND Preference Keyword: " + index.yt_pref_kw[k] + ": Search Artist: "+ search_artist + "; Search Title: " + search_title + "; Video Loaded: ix: " + mv[j].ix + "; Video Title: " + mv[j].title + ". Keywords checked vs" + (index.chk_upl ? " Uploader" : "") + (index.chk_title ? " Title" : "") + (index.chk_descr ? " Descr" : "")); feedback = true; return mv[j].ix;} if (k == index.yt_pref_kw.length - 1) {if (t.verbose) p.trace("MATCHED: Artist - Title ONLY. NO preference keyword match." + " Search Artist: "+ search_artist + "; Search Title: " + search_title + "; Video Loaded: ix: " + mv[0].ix + "; Video Title: " + mv[0].title + ". Keywords checked vs" + (index.chk_upl ? " Uploader" : "") + (index.chk_title ? " Title" : "") + (index.chk_descr ? " Descr" : "")); feedback = true; return mv[0].ix;}}
        } else if (t.verbose && index.yt_pref) p.trace("NO Artist - Title matches. Keyword preference N/A. Search Artist: " + search_artist + "; Search Title: " + search_title);
        for (i = 0; i < p_done; i++) {if (first_id == -1) first_id = i; if (alt_id == -1 && base_OK[i]) alt_id = i;} return -1;
    }
}

function youtube_video_available(state_callback, on_search_done_callback) {
    var alb_id, artist, done, fn, i, full_alb = false, title, type;
    var na = function(n) {try {var kw = "not\\+available|no\\+longer\\+available|unavailable|not\\+exist|sign\\+in|\\+removed\\+|\\+private|\\+been\\+closed|infringement|blocked|invalid\\+"; return !(RegExp(kw, "i")).test(n);} catch (e) {}}
    this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback;

    this.on_state_change = function() {
        if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {
            if (this.xmlhttp.status == 200) this.func();
            else {p.trace("youtube N/A: " + this.xmlhttp.responsetext || "Status error: " + this.xmlhttp.status);}
        }
    }

    this.Search = function(p_alb_id, p_artist, p_title, p_i, p_done, p_id, p_full_alb, p_fn, p_type) {
        alb_id = p_alb_id; artist = p_artist; done = p_done; fn = p_fn; i = p_i; full_alb = p_full_alb; title = p_title; type = p_type;
        this.func = null; this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        var URL = "https://www.youtube.com/get_video_info?ps=default&video_id=" + p_id;
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; this.xmlhttp.send();
    }

    this.Analyse = function() {this.on_search_done_callback(alb_id, artist, title, i, done, full_alb, fn, type, na(this.xmlhttp.responsetext));}
}

function check_mtags() {
    var alb_id = -1, album_o = "", chk = [], alb_done = [], def_type = [], full_alb = [],  lib_upd = fb.CreateProfiler(), last_time = lib_upd.Time, m = [], m_a = [], m_i = [], m_l = [], m_lib = [], m_p = [], m_t = [], m_ty = [], m_v = [], mod = [], mtags_json = fb.ProfilePath + "yttm\\" + "m-TAGS.json", mtags_timer = [], o_artist = "", rec = [], type = [], type_arr = ["", "YouTube Track", "Prefer Library Track", "Library Track"], video = []; if (!p.file(mtags_json)) {p.save(mtags_json, JSON.stringify(m, null, 3), true);}
    var DriveOn = function(drv) {if (!p.fs.DriveExists(drv) || !p.fs.GetDrive(drv).IsReady) return false; return true;}
    var getAbsolutePath = function(base, relative) {relative = relative.replace(/\\/g, "/"); var stack = base.split("/"), parts = relative.split("/"); stack.pop(); for (var i = 0; i < parts.length; i++) {if (parts[i] == ".") continue; if (parts[i] == "..") stack.pop(); else stack.push(parts[i]);} return stack.join("/");}
    var mtags_sort = function(o) {var sorted = {}, key, a = []; for (key in o) if (o.hasOwnProperty(key)) a.push(key); a.sort(); for (key = 0; key < a.length; key++) sorted[a[key]] = o[a[key]]; return sorted;}
    var reset_mtags_timer = function(p_alb_id) {if (mtags_timer[p_alb_id]) window.ClearTimeout(mtags_timer[p_alb_id]); mtags_timer[p_alb_id] = false;}

    this.Execute = function() {
        var handle = fb.GetNowPlaying(); if (!handle || album_o == handle.Path) return; album_o = handle.Path; if (handle.Path.slice(-7) != "!!.tags" || !p.file(mtags_json)) return;
        m = p.json_parse(utils.ReadTextFile(mtags_json)); var k = m.length, n = Date.now(), r = n - p.One_Day;
        while (k--) if (m[k].time < r) m.splice(k, 1); for (k = 0; k < m.length;k++) if (m[k].path == handle.Path) return; m.push({"path":handle.Path, "time":n}); p.save(mtags_json, JSON.stringify(m, null, 3), true);
        if (alb_id == 19) alb_id = 0; else alb_id++; run_test(alb_id, handle.Path);
    }

    var on_check_mtags_done = function(p_alb_id, p_artist, p_title, p_i, p_done, p_full_alb, p_fn, p_type, p_available) {
        if (!p_available) {
            var yt_search = new youtube_search(function() {yt_search.on_state_change();}, on_youtube_search_done);
            yt_search.Search(p_alb_id, p_artist, p_title, p_i, p_done, "", "", "", "", p_full_alb, p_fn, p_type);
        } else on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, "", "", "", "", "", "", p_full_alb, p_fn, p_type);
    }

    var on_youtube_search_done = function (p_alb_id, p_url, p_artist, p_title, p_i, p_done, p_top50, p_pn, p_alb_set, p_length, p_orig_title, p_yt_title, p_full_alb, p_fn, p_type) {
        rec[p_alb_id]++; var i = 0;
        if (typeof p_i === 'number') {if (p_url) {mod[p_alb_id] = true; for (i = 0; i < chk[p_alb_id].length; i++) if (i == p_i) {chk[p_alb_id][i]["@"] = p_url; chk[p_alb_id][i].DURATION = p_length.toString(); chk[p_alb_id][i].REPLAYGAIN_TRACK_GAIN = []; chk[p_alb_id][i].REPLAYGAIN_TRACK_PEAK = []; !p_full_alb ? chk[p_alb_id][i].TITLE = p_title : chk[p_alb_id][i].TITLE = p_title + " (Full Album)"; chk[p_alb_id][i].YOUTUBE_TITLE = p_yt_title ? p_yt_title : []; break;}}
            if (!chk[p_alb_id][p_i].DURATION) {mod[p_alb_id] = true; chk[p_alb_id][p_i].DURATION = [];} if (!chk[p_alb_id][p_i].REPLAYGAIN_TRACK_GAIN) {mod[p_alb_id] = true; chk[p_alb_id][p_i].REPLAYGAIN_TRACK_GAIN = [];} if (!chk[p_alb_id][p_i].REPLAYGAIN_TRACK_PEAK) {mod[p_alb_id] = true; chk[p_alb_id][p_i].REPLAYGAIN_TRACK_PEAK = [];} if (!chk[p_alb_id][p_i].YOUTUBE_TITLE) {mod[p_alb_id] = true; chk[p_alb_id][p_i].YOUTUBE_TITLE = [];}}
        if (rec[p_alb_id] == alb_done[p_alb_id] && mod[p_alb_id]) {for (i = 0; i < chk[p_alb_id].length; i++) chk[p_alb_id][i] = mtags_sort(chk[p_alb_id][i]); p.save(p_fn, JSON.stringify(chk[p_alb_id], null, 3), true);}
    }

    var test = function(p_alb_id, p_artist, p_title, p_i, p_done, p_id, p_full_alb, p_fn, p_loc, p_type) {
        if (!p_artist || !p_title) return on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, "", "", "", "", "", "", p_full_alb, p_fn, p_type);
        switch (p_type) {
            case 1: // YouTube track only
                if (!p_id) return on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, "", "", "", "", "", "", p_full_alb, p_fn, p_type);
                var yt_video_available = new youtube_video_available(function() {yt_video_available.on_state_change();}, on_check_mtags_done);
                yt_video_available.Search(p_alb_id, p_artist, p_title, p_i, p_done, p_id, p_full_alb, p_fn, p_type);
                break;
            case 2: // Prefer library track
                if (ml.upd_lib_mtags) {
                    if (p_loc.charAt(0) == "/" || p_loc.charAt(0) == ".") {
                        if (!fb.IsLibraryEnabled()) return on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, "", "", "", "", "", "", p_full_alb, p_fn, p_type);
                        if (p_loc.charAt(0) == "/") p_loc = p_loc.substring(1); else if (p_loc.charAt(0) == ".") {var base = p_fn.replace(/\\/g, "/"); if (base.indexOf("/") != -1) base = base.substring(0, base.lastIndexOf("/") + 1); p_loc = getAbsolutePath(base, p_loc);}
                        var f = p_loc.indexOf("|"); if (f != -1) p_loc = p_loc.substring(0, f);
                        if (p.file(p_loc) || !DriveOn(p_loc.substr(0, 3))) return on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, "", "", "", "", "", "", p_full_alb, p_fn, p_type);
                    }
                }
                // Recheck if YouTube track now in library & for dead library references
                if (p_id || ml.upd_lib_mtags) {
                    if (p_artist != o_artist || lib_upd.Time - last_time > 2000) lib.artist_edit(p_artist); o_artist = p_artist; lib_upd.Reset(); last_time = lib_upd.Time;
                    var lib_test = lib.in_library_alb(alb_id, p_artist, p_title, "", "", p_i, true);
                    if (lib_test.length) {
                        mod[p_alb_id] = true;
                        for (var i = 0; i < chk[lib_test[0]].length; i++)
                            if (i == lib_test[5]) {
                                var chr = chk[lib_test[0]][i]["@"].charAt(0);
                                chk[lib_test[0]][i]["@"] = chr == "/" ? lib_test[1] : chr == "." ? ml.getRelativePath("/" + p_fn, lib_test[1]) : ml.abs_path ? lib_test[1] : ml.getRelativePath("/" + p_fn, lib_test[1]);
                                chk[lib_test[0]][i].DURATION = lib_test[2]; chk[lib_test[0]][i].REPLAYGAIN_TRACK_GAIN = lib_test[3]; chk[lib_test[0]][i].REPLAYGAIN_TRACK_PEAK = lib_test[4]; chk[lib_test[0]][i].TITLE = p_title; chk[lib_test[0]][i].YOUTUBE_TITLE = [];
                                return on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, "", "", "", "", "", "", p_full_alb, p_fn, p_type)
                            }
                    }
                }
                if (!p_id || !ml.upd_yt_mtags) return on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, "", "", "", "", "", "", p_full_alb, p_fn, p_type);
                var yt_video_available = new youtube_video_available(function() {yt_video_available.on_state_change();}, on_check_mtags_done);
                yt_video_available.Search(p_alb_id, p_artist, p_title, p_i, p_done, p_id, p_full_alb, p_fn, p_type);
                break;
            case 3: // Library track only
                if (!ml.upd_lib_mtags || !fb.IsLibraryEnabled()) return on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, "", "", "", "", "", "", p_full_alb, p_fn, p_type);
                if (p_loc.charAt(0) == "/" || p_loc.charAt(0) == ".") {
                    if (p_loc.charAt(0) == "/") p_loc = p_loc.substring(1); else if (p_loc.charAt(0) == ".") {var base = p_fn.replace(/\\/g, "/"); if (base.indexOf("/") != -1) base = base.substring(0, base.lastIndexOf("/") + 1); p_loc = getAbsolutePath(base, p_loc);}
                    var f = p_loc.indexOf("|"); if (f != -1) p_loc = p_loc.substring(0, f);
                    if (p.file(p_loc) || !DriveOn(p_loc.substr(0, 3))) return on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, "", "", "", "", "", "", p_full_alb, p_fn, p_type);
                    if (p_artist != o_artist || lib_upd.Time - last_time > 2000) lib.artist_edit(p_artist); o_artist = p_artist; lib_upd.Reset(); last_time = lib_upd.Time;
                    var lib_test = lib.in_library_alb(alb_id, p_artist, p_title, "", "", p_i, true);
                    if (lib_test.length) {
                        mod[p_alb_id] = true;
                        for (var i = 0; i < chk[lib_test[0]].length; i++)
                            if (i == lib_test[5]) {
                                var chr = chk[lib_test[0]][i]["@"].charAt(0);
                                chk[lib_test[0]][i]["@"] = chr == "/" ? lib_test[1] : chr == "." ? ml.getRelativePath("/" + p_fn, lib_test[1]) : ml.abs_path ? lib_test[1] : ml.getRelativePath("/" + p_fn, lib_test[1]);
                                chk[lib_test[0]][i].DURATION = lib_test[2]; chk[lib_test[0]][i].REPLAYGAIN_TRACK_GAIN = lib_test[3]; chk[lib_test[0]][i].REPLAYGAIN_TRACK_PEAK = lib_test[4]; chk[lib_test[0]][i].TITLE = p_title;
                            }}}
                on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, "", "", "", "", "", "", p_full_alb, p_fn, p_type)
                break;
        }
    }

    var run_test = function(ix, p_handle) {
        m_p[ix] = p_handle; chk[ix] = p.json_parse(utils.ReadTextFile(m_p[ix])); if (!chk[ix].length) return; reset_mtags_timer(ix); alb_done[ix] = Math.min(150, chk[ix].length); def_type[ix] = []; m_lib[ix] = false; mod[ix] = false; rec[ix] = 0; type[ix] = []; video[ix] = false;
        for (m_i[ix] = 0; m_i[ix] < alb_done[ix]; m_i[ix]++) {if (chk[ix][m_i[ix]]["@"].indexOf("3dydfy") != -1) video[ix] = true; if (chk[ix][m_i[ix]]["@"].charAt(0) == "/" || chk[ix][m_i[ix]]["@"].charAt(0) == ".") m_lib[ix] = true;} def_type[ix] = !video[ix] ? 3 : !m_lib[ix] ? 1 : 2;
        for (m_i[ix] = 0; m_i[ix] < alb_done[ix]; m_i[ix]++) {
            var ty = chk[ix][m_i[ix]].YOUTUBE_TRACK_MANAGER_TRACK_TYPE;
            if (typeof ty !== "undefined" && ty.length) {var ic = ty.toLowerCase().charAt(0); type[ix][m_i[ix]] = ic == "y" ? 1 : ic == "p" ? 2 : ic == "l" ? 3 : def_type[ix];}
            else {type[ix][m_i[ix]] = def_type[ix]; chk[ix][m_i[ix]].YOUTUBE_TRACK_MANAGER_TRACK_TYPE = type_arr[def_type[ix]];}
        } m_i[ix] = 0;
        mtags_timer[ix] = window.SetInterval(function() {
            if (m_i[ix] < alb_done[ix]) {
                m_l[ix] = chk[ix][m_i[ix]]["@"];
                m_v[ix] = chk[ix][m_i[ix]]["@"].indexOf("v="); if (m_v[ix] != -1) m_v[ix] = chk[ix][m_i[ix]]["@"].slice(m_v[ix] + 2, m_v[ix] + 13); else m_v[ix] = "";
                m_a[ix] = chk[ix][m_i[ix]].ARTIST; if (typeof m_a[ix] === "undefined") {var i = m_i[ix]; while (i-- && typeof m_a[ix] === "undefined") m_a[ix] = chk[ix][i].ARTIST;} full_alb[ix] = false;
                var sti = chk[ix][m_i[ix]].TITLE;
                if (typeof sti !== "undefined" && sti.indexOf(" (Full Album)") != -1) full_alb[ix] = true;
                var st = chk[ix][m_i[ix]].YOUTUBE_TRACK_MANAGER_SEARCH_TITLE;
                m_t[ix] = typeof st !== "undefined" && st.length ? st : typeof sti !== "undefined" && sti.length ? sti : ""; m_ty[ix] = type[ix][m_i[ix]];
                test(ix, m_a[ix], m_t[ix], m_i[ix], alb_done[ix], m_v[ix], full_alb[ix], m_p[ix], m_l[ix], m_ty[ix]);
                m_i[ix]++;
            } else {reset_mtags_timer(ix);}
        }, 20);
    }
}
if (ml.upd_yt_mtags || ml.upd_lib_mtags) var upd_mtags = new check_mtags();


function lfm_similar_artists(state_callback, on_search_done_callback) {
    var art_variety, f3, fln, cache = true, lfm_cache_file, list = [], lmt = 50, pg = 0, rad_mode, source, rad_type;
    this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback; this.ie_timer = false;

    this.on_state_change = function() {
        if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {
            window.ClearTimeout(this.ie_timer); this.ie_timer = false;
            if (this.xmlhttp.status == 200) this.func();
            else {if (art_variety && cache) {cache = false; if (p.file(fln)) lfm_cache_file = true; return this.Search();} this.on_search_done_callback(""); if (art_variety && rad_mode > 1) rad.med_lib_radio("", source, rad_mode, rad_type, art_variety); p.trace("last.fm similar artists N/A: " + this.xmlhttp.responsetext || "Status error: " + this.xmlhttp.status);}
        }
    }

    this.Search = function(p_source, p_rad_mode, p_art_variety, p_rad_type) {
        if (cache) {art_variety = p_art_variety; rad_mode = p_rad_mode; source = p_source; rad_type = p_rad_type; var rs = source.clean(); f3 = rad.f2 + rs.substr(0, 1).toLowerCase() + "\\"; fln = f3 + rs + (rad_type == 4 ? " - Top Artists.json" : " And Similar Artists.json"); lfm_cache_file = !p.expired(fln, p.Thirty_Days);}
        this.func = null; this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        var len = 0;
        if (!art_variety && p.file(fln)) var chk = p.json_parse(utils.ReadTextFile(fln)); if (chk) len = chk.length;
        if (art_variety && lfm_cache_file) {
            list = p.json_parse(utils.ReadTextFile(fln)); if (!list) list = [];
            if (list.length > 219 && (list[0].hasOwnProperty('name') || rad_type == 4)) {
                if (rad_mode > 1) {rad.med_lib_radio(list, source, rad_mode, rad_type, art_variety); return;}
                return this.on_search_done_callback(list, source, rad_mode);}
        }
        if (!art_variety && lfm_cache_file) {
            list = p.json_parse(utils.ReadTextFile(fln)); if (!list) list = [];
            if (list.length > 99) return this.on_search_done_callback(list, source, rad_mode);
        }
        lmt = art_variety || len > 101 ? 249 : 100;
        if (rad_type != 4) {var URL = "http://ws.audioscrobbler.com/2.0/?format=json" + p.lfm + (!cache ? "&s=" + Math.random() : "") + "&method=artist.getSimilar&artist=" + encodeURIComponent(source) + "&limit=" + lmt + "&autocorrect=1";}
        else {pg++; var URL = "https://www.last.fm/tag/" + encodeURIComponent(source) + "/artists?page=" + pg;}
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
        this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_script"); this.xmlhttp.send();
        if (!this.ie_timer) {var a = this.xmlhttp, that = this; this.ie_timer = window.SetTimeout(function() {a.abort(); that.ie_timer = false;}, 30000);}
    }

    this.Analyse = function() {
        var data = rad_type != 4 ? p.json_parse(this.xmlhttp.responsetext, "similarartists.artist", "name\":") : this.xmlhttp.responsetext;
        if (cache && (!data)) {cache = false; if (art_variety && p.file(fln)) lfm_cache_file = true; return this.Search();}
        if (data) {
            if (rad_type == 4) {
                var WshShell = new ActiveXObject("WScript.Shell"), doc = new ActiveXObject("htmlfile"); doc.open(); var div = doc.createElement("div"); div.innerHTML = data;
                var link = div.getElementsByTagName("a"); if (!link) return; for (var i = 0; i < link.length; i++)  if (link[i].className.indexOf("link-block-target") != -1) {var a = decodeURIComponent(link[i].href.replace("about:/music/", "").replace(/\+/g, "%20")); if (a.indexOf("about:/tag/") == -1) list.push(a);} doc.close(); cache = false; if (pg < 13) return this.Search();
                if (list.length) {p.create(f3); p.save(fln, JSON.stringify(list), true);}
                if (rad_mode > 1) return rad.med_lib_radio(list, source, rad_mode, rad_type, art_variety);
            } else {
                for (var i = 0; i < data.length; i++) list[i] = {name:data[i].name, score:Math.round(data[i].match * 100)};
                list.unshift({name:source, score:100}); p.save(fln, JSON.stringify(list), true);
                if (rad_mode > 1) return rad.med_lib_radio(list, source, rad_mode, rad_type, art_variety);
            }
        } this.on_search_done_callback(list, source, rad_mode); if (!data && art_variety && rad_mode > 1) rad.med_lib_radio("", source, rad_mode, rad_type, art_variety);
    }
}

function lfm_radio_tracks_search(state_callback, on_search_done_callback) {
    var art_variety, artistTopTracks = false, cache = true, can_get_curr = false, curr_pop, done, f3, fn, fnc, ix, i = 0, lfm_cache_c, lfm_cache_f, list = [], lmt = 200, orig, pg = 1, pn, playcount = [], rad_source, rad_mode, rad_type, save_list = [], song_hot, title = [], top50, sp = "";
    var uniq = function(a) {var flags = [], result = []; for (var k = 0; k < a.length; k++) {if (flags[a[k].title + a[k].playcount]) continue; result.push(a[k]); flags[a[k].title + a[k].playcount] = true;} return result;}
    this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback; this.ie_timer = false;

    this.on_state_change = function() {
        if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {
            window.ClearTimeout(this.ie_timer); this.ie_timer = false;
            if (this.xmlhttp.status == 200) this.func();
            else if (cache) {cache = false; if (p.file(fn)) lfm_cache_f = true; if (p.file(fnc)) lfm_cache_c = true; return this.Search();} else if (rad_type != 2 || rad_mode == 2) {this.on_search_done_callback("", "", ix, done, top50, pn, rad_mode, rad_type); p.trace("last.fm top tracks N/A: " + this.xmlhttp.responsetext || "Status error: " + this.xmlhttp.status);}
        }
    }

    this.Search = function(p_rad_source, p_rad_mode, p_rad_type, p_art_variety, p_song_hot, p_curr_pop, p_ix, p_done, p_top50, p_pn) {
        if (cache) {
            rad_source = p_rad_source; rad_mode = p_rad_mode, rad_type = p_rad_type; art_variety = p_art_variety; song_hot = p_song_hot; curr_pop = p_curr_pop; ix = p_ix; done = p_done; top50 = p_top50; pn = p_pn;
            sp = rad_source.clean(); f3 = rad.f2 + sp.substr(0, 1).toLowerCase() + "\\"; fn = f3 + sp + (top50 == 2 ? " [Similar Songs].json" : (top50 == 3 ? ".json" : (rad_type != 3 ? ".json" : " [Similar Songs].json"))); lfm_cache_f = !p.expired(fn, p.TwentyEight_Days); if (rad_mode == 2 && p.use_saved) lfm_cache_f = true;
            if (curr_pop) {fnc = f3 + sp + " [curr].json"; lfm_cache_c = !p.expired(fnc, p.One_Week);}
        }

        switch (rad_type) {
            case 1:
                if (lfm_cache_f) {
                    list = p.json_parse(utils.ReadTextFile(fn)); if (list.length > song_hot) list = list.slice(0, song_hot);
                    if (rad_mode != 2 && !top50) {index.track_count = list.length; window.SetProperty("SYSTEM.Track Count", index.track_count);}
                    if (list.length >= song_hot || rad_mode == 2 && p.use_saved) {for (i = 0; i < list.length; i++) list[i].title = list[i].title.strip_remaster(); return this.on_search_done_callback(list, "", ix, "", "", pn, rad_mode, 1);}
                }
                break;
            case 3:
                if (lfm_cache_f && top50 != 3) {
                    list = p.json_parse(utils.ReadTextFile(fn));
                    if (list && list[0].hasOwnProperty('playcount')  || rad_mode == 2 && p.use_saved) {
                        if (list.length > song_hot) list = list.slice(0, song_hot);
                        if (rad_mode != 2 && !top50) {index.track_count = list.length; window.SetProperty("SYSTEM.Track Count", index.track_count);}
                        if (list.length >= song_hot || rad_mode == 2 && p.use_saved) {for (i = 0; i < list.length; i++) list[i].title = list[i].title.strip_remaster(); return this.on_search_done_callback(list, "", ix, "", top50, pn, rad_mode, 3);}
                    }
                }
                break;
            default:
                if (curr_pop && lfm_cache_c || !curr_pop && lfm_cache_f) {
                    list = p.json_parse(utils.ReadTextFile(curr_pop ? fnc : fn));
                    if (curr_pop) {if (list.length >= song_hot) {for (i = 0; i < list.length; i++) list[i].title = list[i].title.strip_remaster(); return this.on_search_done_callback(rad_source, list, ix, done, top50, pn, rad_mode, rad_type, curr_pop);}}
                    else {var newOK = false; if (list && list[0].hasOwnProperty('artist')) {newOK = true; list.shift();} if (newOK && list.length >= song_hot || rad_mode == 2 && p.use_saved) {for (i = 0; i < list.length; i++) list[i].title = list[i].title.strip_remaster(); return this.on_search_done_callback(rad_source, list, ix, done, top50, pn, rad_mode, rad_type, curr_pop);}}
                }
                break;
        }

        if (rad_mode == 2 && p.use_saved) return this.on_search_done_callback("", "", ix, done, top50, pn, rad_mode, rad_type);

        this.func = null; this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        var force = false, URL = "http://ws.audioscrobbler.com/2.0/?format=json" + p.lfm + (!cache ? "&s=" + Math.random() : "");
        if (top50 != 2 && top50 != 3 && (rad_type == 0 || rad_type == 2 || top50 == 1)) artistTopTracks = true;
        if (artistTopTracks) {
            lmt = curr_pop ? 100 : Math.max(200, song_hot);
            if (!curr_pop) {
                if (!cache) lmt += 5 + Math.floor(Math.random() * 10); // ***workarounds: last.fm bug - occasionally list doesn't start at beginning
                URL += "&method=" + "artist.getTopTracks" + "&artist=" + encodeURIComponent(rad_source) + "&limit=" + lmt + "&autocorrect=1";
            } else {URL = "https://www.last.fm/music/" + encodeURIComponent(rad_source) + "/+tracks?date_preset=LAST_30_DAYS&page=" + pg; if (!cache) force = true;}
        } else if (rad_type == 1 && !top50) {if (!cache) song_hot = song_hot != 1000 ? song_hot + 5 : song_hot - 5/***/; URL += "&method=" + "tag.getTopTracks" + "&tag=" + encodeURIComponent(rad_source) + "&limit=" + song_hot + "&autocorrect=1";} // ***workaround: last.fm bug - list occasionally too short
        else {
            if (top50 != 3) {
                if (rad_source.indexOf("|") == -1) return this.on_search_done_callback("", "", ix, "", top50, pn, rad_mode, rad_type);
                var radio_sourc = rad_source.split("|");
                URL += "&method=" + "track.getSimilar" + "&artist=" + encodeURIComponent(radio_sourc[0].trim()) + "&track=" + encodeURIComponent(radio_sourc[1].trim()) + "&limit=250" + "&autocorrect=1";
            } else {URL = "http://www.bbc.co.uk/radio1/chart/singles/print"; if (!cache) force = true;}
        }
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
        this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_script"); if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT'); this.xmlhttp.send();
        if (rad_mode != 2 && !this.ie_timer) {var a = this.xmlhttp, that = this; this.ie_timer = window.SetTimeout(function() {a.abort(); that.ie_timer = false;}, 30000);} // iSelect radio handles own timeout
    }

    this.Analyse = function() {
        var new_t = this.xmlhttp.responsetext, data = false, items = 0; list = [];
        switch (rad_type) {
            case 3:
                if (top50 != 3) data = p.json_parse(new_t, "similartracks.track", "name\":");
                else {var doc = new ActiveXObject("htmlfile"); doc.open();var div = doc.createElement("div"); div.innerHTML = this.xmlhttp.responsetext; var data = div.getElementsByTagName("td");}
                break;
            default:
                if (curr_pop) {var doc = new ActiveXObject("htmlfile"); doc.open(); var div = doc.createElement("div"); div.innerHTML = this.xmlhttp.responsetext; var data = div.getElementsByTagName("a"), span = div.getElementsByTagName("span");}
                else if (rad_type != 1) data = p.json_parse(new_t, "toptracks.track", "name\":"); else data = p.json_parse(new_t, "tracks.track", "name\":");
                break;
        }
        items = data.length; if (cache && (!items || artistTopTracks && items < lmt || rad_type == 1 && items < song_hot)) {cache = false; if (p.file(fn)) lfm_cache_f = true; if (p.file(fnc)) lfm_cache_c = true; return this.Search();} // ***
        if (items) {p.create(f3);
            switch (rad_type) {
                case 1:
                    var le = Math.min(items, song_hot);
                    for (i = 0; i < le; i++) list[i] = {artist: data[i].artist.name, title: data[i].name.strip_remaster()}
                    for (i = 0; i < items; i++) save_list[i] = {artist: data[i].artist.name, title: data[i].name}
                    if (rad_mode != 2 && !top50) {index.track_count = le; window.SetProperty("SYSTEM.Track Count", index.track_count);}
                    this.on_search_done_callback(list, "", ix, "", "", pn, rad_mode, 1);
                    if (save_list.length) p.save(fn, JSON.stringify(save_list), true);
                    break;
                case 3:
                    if (top50 != 3) {
                        var le = Math.min(items, song_hot);
                        for (i = 0; i < le; i++) list[i] = {artist: data[i].artist.name, title: data[i].name.strip_remaster()}
                        for (i = 0; i < items; i++) save_list[i] = {artist: data[i].artist.name, title: data[i].name, playcount: data[i].playcount}
                        if (rad_mode != 2 && !top50) {index.track_count = le; window.SetProperty("SYSTEM.Track Count", index.track_count);}
                    } else {for (i = 4; i < items; i += 6) {list.push({artist: data[i].innerHTML.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&quot/g,'"'), title: data[i + 1].innerHTML.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&quot/g,'"')}); save_list = list;} doc.close();}
                    this.on_search_done_callback(list, "", ix, "", top50, pn, rad_mode, 3);
                    if (save_list.length) p.save(fn, JSON.stringify(save_list), true);
                    break;
                default:
                    if (curr_pop) {
                        for (i = 0; i < items; i ++) if(data[i].className == "link-block-target") title.push(data[i].innerText.trim());
                        for (i = 0; i < span.length; i ++) if (span[i].className == "countbar-bar-value") playcount.push(parseFloat(span[i].innerText.replace(",", "")) * 9);
                        if (pg == 1 && song_hot > 50) {pg++; return this.Search(rad_source, rad_mode, rad_type, art_variety, song_hot, curr_pop, ix, done, top50, pn);}
                        else for (i = 0; i < title.length; i++) {list[i] = {title: title[i].strip_remaster(), playcount: playcount[i]}; save_list[i] = {title: title[i], playcount: playcount[i]}}
                        list = uniq(list); save_list = uniq(save_list); if (save_list.length) p.save(fnc, JSON.stringify(save_list), true); doc.close();
                    } else {
                        for (i = 0; i < items; i++) {list[i] = {title: data[i].name.strip_remaster(), playcount: data[i].playcount}; save_list[i] = {title: data[i].name, playcount: data[i].playcount};}
                        try {save_list.unshift({artist: data[0].artist.name, ar_mbid: data[0].artist.mbid});} catch (e) {save_list.unshift({artist: rad_source, ar_mbid: "N/A"});}
                        if (save_list.length) p.save(fn, JSON.stringify(save_list), true);
                    }
                    this.on_search_done_callback(rad_source, list, ix, done, top50, pn, rad_mode, rad_type, curr_pop);
                    break;
            }
        } else this.on_search_done_callback("", "", ix, done, top50, pn, rad_mode, rad_type);
    }
}

function lfm_alb_cov(state_callback) {
    var artist, album, fna;
    this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = false;

    this.on_state_change = function() {
        if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {
            window.ClearTimeout(this.ie_timer); this.ie_timer = false;
            if (this.xmlhttp.status == 200) this.func();
            else {p.trace("last.fm album cover N/A: " + this.xmlhttp.responsetext || "Status error: " + this.xmlhttp.status);}
        }
    }

    this.Search = function(p_artist, p_album, p_fna) {
        artist = p_artist; album = p_album; fna = p_fna
        var URL = "http://ws.audioscrobbler.com/2.0/?format=json" + p.lfm;
        URL += "&method=album.getInfo&artist=" + encodeURIComponent(artist) + "&album=" + encodeURIComponent(album) + "&autocorrect=1";
        this.func = null; this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
        this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_script"); this.xmlhttp.send();
        if (!this.ie_timer) {var a = this.xmlhttp, that = this; this.ie_timer = window.SetTimeout(function() {a.abort(); that.ie_timer = false;}, 30000);}
    }

    this.Analyse = function() {
        var data = p.json_parse(this.xmlhttp.responsetext, "album.image", "name\":"); if (!data || data.length < 5) return p.trace("last.fm album cover N/A");
        var pth = data[4]["#text"]; if (pth) {var pthSplit = pth.split("/"); pthSplit.splice(pthSplit.length - 2, 1); pth = pthSplit.join("/");} else return p.trace("last.fm album cover N/A");
        p.run("cscript //nologo \"" + fb.ProfilePath + "yttm\\foo_lastfm_img.vbs\" \"" + pth + "\" \"" + fna + "cover" + pth.slice(-4) + "\"", 0);
    }
}

function musicbrainz_releases(state_callback, on_search_done_callback) {
    var alb_id, album, album_artist, attempt = 0, initial = true, extra, prime, rg_mbid, server = true;
    this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback; this.ie_timer = false;
    this.Null = function() {if (!p.btn_mode && alb.mb && alb.pref_mb_tracks) {alb.track_source = 0; alb.dld.Execute();} else {alb.set_row(alb_id, 0, album_artist); t.paint(); this.on_search_done_callback("");}}

    this.on_state_change = function() {
        if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {
            window.ClearTimeout(this.ie_timer); this.ie_timer = false;
            if (this.xmlhttp.status == 200) this.func();
            else if (server && this.xmlhttp.status == 503 && attempt < 5) {var that = this; window.SetTimeout(function() {attempt++; that.Search();}, 450);}
            else if (server) {server = false; this.Search();}
            else {p.trace("musicbrainz releases N/A: " + this.xmlhttp.responsetext || "Status error: " + this.xmlhttp.status); this.Null();}
        }
    }

    this.Search = function(p_alb_id, p_rg_mbid, p_album_artist, p_album, p_prime, p_extra) {
        if (initial) {alb_id = p_alb_id; rg_mbid = p_rg_mbid; album_artist = p_album_artist, album = p_album; prime = p_prime; extra = p_extra;}
        initial = false; this.func = null; this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        var URL = server ? "https://musicbrainz.org/ws/2/" : "http://musicbrainz-mirror.eu:5000/ws/2/";
        if (!p.btn_mode && alb.mb) URL += "release-group/" + rg_mbid + "?inc=releases&fmt=json";
        else URL += "release/?query=\"" + encodeURIComponent(album.trim().regex_esc()) + "\" AND artist:" + encodeURIComponent(album_artist.trim().regex_esc()) + "&fmt=json";
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
        this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_yttm (https://hydrogenaud.io/index.php/topic,111059.0.html)"); this.xmlhttp.send();
        if (!this.ie_timer) {var a = this.xmlhttp, that = this; this.ie_timer = window.SetTimeout(function() {a.abort(); that.ie_timer = false;}, 30000);}
    }

    this.Analyse = function() {
        var indextest = "\"releases\":|\"id\":|\"title\":" +  ((p.btn_mode || !alb.mb) ? "|\"date\":" : "");
        var data = p.json_parse(this.xmlhttp.responsetext, "", indextest);
        if (!data) return this.Null();
        var items = data.releases.length;
        var album_id = "";
        if (p.btn_mode || !alb.mb) {
            for (var i = 0; i < items; i++)
                if ((data.releases[i].title.strip() == album.strip()) && (p.btn_mode ? (data.releases[i]["release-group"]["primary-type"] == "Album") : true) && data.releases[i].date && data.releases[i].date.substring(0, 4)) {
                    album_id = data.releases[i].id; return this.on_search_done_callback(alb_id, data.releases[i].id, album_artist, data.releases[i].date.substring(0, 4));
                }
        } else {
            for (var i = 0; i < items; i++)
                if ((data.releases[i].title.strip() == album.strip()) && (data["primary-type"] == prime)) {
                    album_id = data.releases[i].id; this.on_search_done_callback(alb_id, album_id, album_artist); break;
                }
        }
        if (!album_id) this.Null();
    }
}

function album_tracks(state_callback, on_search_done_callback) {
    var alb_id, album, album_artist, attempt = 0, list = [], initial = true, re_mbid, server = true;;
    this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback; this.ie_timer = false;
    this.lfm_return = function() {if (!alb.pref_mb_tracks) {alb.track_source = 1; alb.dld.Execute();} else this.Null();}
    this.mb_return = function() {if (alb.pref_mb_tracks) {alb.track_source = 0; alb.dld.Execute();} else this.Null();}
    this.Null = function() {alb.set_row(alb_id, 0, album_artist); t.paint(); this.on_search_done_callback("");}

    this.on_state_change = function() {
        if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {
            window.ClearTimeout(this.ie_timer); this.ie_timer = false;
            if (this.xmlhttp.status == 200) this.func();
            else if (alb.track_source && server && this.xmlhttp.status == 503 && attempt < 5) {var that = this; window.SetTimeout(function() {attempt++; that.Search();}, 450);}
            else if (alb.track_source && server) {server = false; this.Search();}
            else {p.trace((alb.track_source ? "musicbrainz" : "last.fm") + " album tracks N/A: " + this.xmlhttp.responsetext || "Status error: " + this.xmlhttp.status); alb.track_source ? this.mb_return() : this.lfm_return();}
        }
    }

    this.Search = function(p_alb_id, p_re_mbid, p_album_artist, p_album) {
        if (initial) {alb_id = p_alb_id; re_mbid = p_re_mbid; album_artist = p_album_artist; album = p_album}
        initial = false; this.func = null; this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        switch (alb.track_source) {
            case 0:
                var URL = "http://ws.audioscrobbler.com/2.0/?format=json" + p.lfm + "&s=" + Math.random();
                URL += "&method=album.getInfo&artist=" + encodeURIComponent(album_artist) + "&album=" + encodeURIComponent(album) + "&autocorrect=1";
                break;
            case 1:
                var URL = (server ? "https://musicbrainz.org/" : "http://musicbrainz-mirror.eu:5000/") + "ws/2/release/" + re_mbid + "?inc=recordings&fmt=json";
                break;
        }
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
        this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_yttm (https://hydrogenaud.io/index.php/topic,111059.0.html)"); this.xmlhttp.send();
        if (!this.ie_timer) {var a = this.xmlhttp, that = this; this.ie_timer = window.SetTimeout(function() {a.abort(); that.ie_timer = false;}, 7000);}
    }

    this.Analyse = function() {
        var new_t = this.xmlhttp.responsetext;
        switch (alb.track_source) {
            case 0:
                var items = 0, data = p.json_parse(new_t, "album", "track\":");
                if (data) {
                    items = data.tracks.track.length;
                    if (items)
                        for (var i = 0; i < items; i++) list[i] = {artist: album_artist.replace(/’/g, "'"), title: data.tracks.track[i].name.replace(/’/g, "'").strip_remaster()}
                    if (!items) // deals with 1 track releases that are in different json format
                        try {items = data.tracks.track.name; list[0] = {artist: album_artist.replace(/’/g, "'"), title: items}} catch (e) {}
                    this.on_search_done_callback(alb_id, list); p.trace("album track list from last.fm");
                }
                if (!data || !items) this.lfm_return();
                break;
            case 1:
                var data = p.json_parse(new_t, "", "\"media\":|\"tracks\":"), i = 0;
                if (!data) return this.mb_return();
                var items = []; for (i = 0; i < data.media.length; i++) items = items.concat(data.media[i].tracks)
                if (!items.length) return this.mb_return();
                for (i = 0; i < items.length; i++) list[i] = {artist: album_artist.replace(/’/g, "'"), title: items[i].title.replace(/’/g, "'")}
                this.on_search_done_callback(alb_id, list); p.trace("album track list from musicbrainz");
                break;
        }
    }
}

function musicbrainz_artist_id(state_callback, on_search_done_callback) {
    var ar_mbid = "", attempt = 0, dbl_load, just_mbid, lfm_done = false, list = [], initial = true, mbid_search = false, mbid_source = 1, mb_done = false, mode, search_param, server = true, tag_mbid = "";
    if (p.file(alb.related_artists)) var related_artists = p.json_parse(utils.ReadTextFile(alb.related_artists)); else var related_artists = {}
    this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback; this.ie_timer = false;
    this.lfm_return = function() {if (mb_done) this.on_search_done_callback("", "", mode); else this.Search(search_param, just_mbid, dbl_load, mode);}
    this.mb_return = function() {list[0] = {name: "Related Artists N/A", id: "", disambiguation: ""}; alb.rel_artists = list; if (!alb.show_similar && !dbl_load) {alb.artists = alb.rel_artists; alb.calc_rows_art();} if (lfm_done) this.on_search_done_callback("", "", mode); else this.Search(search_param, just_mbid, dbl_load, mode);}

    this.on_state_change = function() {
        if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {
            window.ClearTimeout(this.ie_timer); this.ie_timer = false;
            if (this.xmlhttp.status == 200) this.func();
            else if (server && this.xmlhttp.status == 503 && attempt < 5) {var that = this; window.SetTimeout(function() {attempt++; that.Search();}, 450);}
            else if (server) {server = false; this.Search();}
            else if (mbid_search) {alb.artist = search_param; return this.on_search_done_callback("", "", mode);
            } else switch (mbid_source) {
                case 0: lfm_done = true; mbid_source = 1; p.trace("last.fm mbid N/A: " + this.xmlhttp.responsetext || "Status error: " + this.xmlhttp.status); this.lfm_return(); break;
                case 1:mb_done = true; mbid_source = 0; p.trace("musicbrainz mbid N/A: " + this.xmlhttp.responsetext || "Status error: " + this.xmlhttp.status); this.mb_return(); break;
            }
        }
    }

    this.Search = function(p_album_artist, p_just_mbid, p_dbl_load, p_mode) {
        if (initial) {dbl_load = p_dbl_load; just_mbid = p_just_mbid; mode = p_mode; search_param = p_album_artist;}
        initial = false; tag_mbid = p.eval("$trim($if3(%musicbrainz_artistid%,%musicbrainz artist id%,))"); if (!tag_mbid) tag_mbid = related_artists[search_param.toUpperCase()]; if (!tag_mbid || tag_mbid.length != 36) tag_mbid = "";
        this.func = null; this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        var URL = (server ? "https://musicbrainz.org/" : "http://musicbrainz-mirror.eu:5000/") + "ws/2/artist/";
        if (search_param.uuid()) {mbid_search = true; ar_mbid = search_param; URL += ar_mbid + "?&fmt=json";}
        else switch (mbid_source) {
            case 0: URL = "http://ws.audioscrobbler.com/2.0/?format=json" + p.lfm + "&s=" + Math.random(); URL += "&method=artist.getInfo&artist=" + encodeURIComponent(search_param) + "&autocorrect=1"; break;
            case 1: URL += "?query=" + encodeURIComponent(search_param.toLowerCase().regex_esc()) + "&fmt=json"; break;
        }
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
        this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_yttm (https://hydrogenaud.io/index.php/topic,111059.0.html)"); this.xmlhttp.send();
        if (!this.ie_timer) {var a = this.xmlhttp, that = this; this.ie_timer = window.SetTimeout(function() {a.abort(); that.ie_timer = false;}, 7000);}
    }

    this.Analyse = function() {
        var new_t = this.xmlhttp.responsetext;
        if (search_param.uuid()) {
            var data = p.json_parse(new_t, "", "\"name\":");
            if (!data) {alb.artist = search_param; return this.on_search_done_callback("", "", mode);}
            alb.artist = data.name; alb.set_txt();
            if (alb.more && alb.show_similar) alb.search_for_similar_artists(alb.artist);
            list[0] = {name: "Related Artists N/A: MBID Search", id: "", disambiguation: ""}
        }
        else switch (mbid_source) {
            case 0:
                lfm_done = true; mbid_source = 1;
                var data = p.json_parse(new_t, "artist.mbid");
                if (!data) return this.lfm_return(); else ar_mbid = data;
                if (!ar_mbid && !list.length) this.lfm_return();
                break;
            case 1:
                var i = 0; mb_done = true; mbid_source = 0;
                var data = p.json_parse(new_t, "", "\"name\":");
                if (!data || new_t.indexOf("\"artists\":") == -1) return this.mb_return();
                var artist = search_param.strip(), artists = data.artists;
                for (i = 0; i < artists.length; i++) list[i] = {name: artists[i].name, id: artists[i].id, disambiguation: artists[i].disambiguation}
                if (!list.length) return this.mb_return();
                for (i = 0; i < list.length; i++) if (artist == list[i].name.strip()) {ar_mbid = list[i].id; break;}
                if (!ar_mbid) {var tfo = fb.TitleFormat("$ascii(" + artist + ")"); artist = tfo.eval(true); tfo.Dispose(); for (i = 0; i < list.length; i++) if (artist == list[i].name.strip()) {ar_mbid = list[i].id; break;}}
                if (!ar_mbid) {list.unshift({name:alb.artist + " [Related]:", id:""});}
                else if (list.length == 1) list[0] = {name: alb.artist + " [No Related Artists]", id: "", disambiguation: ""}
                else list[0] = {name:alb.artist + " [Related]:", id:ar_mbid};
                break;
        }
        if (!dbl_load) alb.rel_artists = list; if (!alb.show_similar && !dbl_load) {alb.artists = alb.rel_artists; alb.calc_rows_art();}
        this.on_search_done_callback(tag_mbid ? tag_mbid : ar_mbid, just_mbid, mode);
    }
}

function album_names(state_callback, on_search_done_callback) {
    var ar_mbid = false, attempt = 0, cache = true, f3, fn, initial = true, json_data = [], lfm_cache_f, lmt = 0, mode, offset = 0, releases = 0, server = true, sp = "", try_artist = false;
    this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback; this.ie_timer = false;

    this.on_state_change = function() {
        if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {
            window.ClearTimeout(this.ie_timer); this.ie_timer = false;
            if (this.xmlhttp.status == 200) {if (alb.mb) offset += 100; this.func();}
            else if (alb.mb && server && this.xmlhttp.status == 503 && attempt < 5) {var that = this; window.SetTimeout(function() {attempt++; that.Search();}, 450);}
            else if (alb.mb && server) {server = false; this.Search();}
            else {p.trace((alb.mb ? "musicbrainz album names N/A: " : "last.fm " + (!mode ? "top albums N/A: " : mode == 1 ? "top tracks N/A: " : "similar songs N/A: ")) + this.xmlhttp.responsetext || "Status error: " + this.xmlhttp.status); this.on_search_done_callback("", ar_mbid, mode);}
        }
    }

    this.Search = function(p_ar_mbid, p_mode) {
        if (!ar_mbid && cache && initial && !try_artist) {ar_mbid = p_ar_mbid; mode = p_mode;}
        if (!alb.mb && !ar_mbid) try_artist = true;
        initial = false; this.func = null; this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        if (alb.mb) var URL = (server ? "https://musicbrainz.org/" : "http://musicbrainz-mirror.eu:5000/") + "ws/2/release-group?artist=" + ar_mbid + "&limit=100&offset=" + offset + "&fmt=json";
        else {
            var tag = try_artist ? "&artist=" + encodeURIComponent(alb.artist) : "&mbid=" + encodeURIComponent(ar_mbid), URL = "http://ws.audioscrobbler.com/2.0/?format=json" + p.lfm + (!cache ? "&s=" + Math.random() : "");
            switch (mode) {
                case 0: URL += "&method=" + "artist.getTopAlbums" + tag + "&limit=99&autocorrect=1"; break;
                case 1:
                    sp = alb.artist.clean(); f3 = rad.f2 + sp.substr(0, 1).toLowerCase() + "\\"; fn = f3 + sp + ".json"; lfm_cache_f = !p.expired(fn, p.TwentyEight_Days);
                    if (lfm_cache_f) {
                        data = []; data = p.json_parse(utils.ReadTextFile(fn));
                        if (data.length > 199 && data[0].ar_mbid == ar_mbid) return this.on_search_done_callback(data.slice(1, 100), ar_mbid, mode);
                    }
                    lmt = 0; if (p.file(fn)) var chk = p.json_parse(utils.ReadTextFile(fn)); if (chk) lmt = chk.length; lmt = Math.max(200, lmt); if (!cache) lmt += 5 + Math.floor(Math.random() * 10); // ***workaround: last.fm bug - occasionally list doesn't start at beginning
                    URL += "&method=" + "artist.getTopTracks" + tag + "&limit=" + lmt + "&autocorrect=1"; break;
                case 2:
                    var ar_ti = alb.artist_title.split("|"), ar = !ar_ti[0] ? "" : ar_ti[0].trim(), ti = !ar_ti[1] ? "" : ar_ti[1].trim();
                    sp = ar + " - " + ti; sp = sp.clean(); f3 = rad.f2 + sp.substr(0, 1).toLowerCase() + "\\"; fn = f3 + sp + " [Similar Songs].json"; lfm_cache_f = !p.expired(fn, p.TwentyEight_Days);
                    if (lfm_cache_f) {
                        data = []; data = p.json_parse(utils.ReadTextFile(fn));
                        if (data.length > 98) return this.on_search_done_callback(data.slice(0, 99), ar_mbid, mode);
                    }
                    var len = 0; if (p.file(fn)) var chk = p.json_parse(utils.ReadTextFile(fn)); if (chk) len = chk.length;
                    URL += "&method=" + "track.getSimilar" + "&artist=" + encodeURIComponent(ar) + "&track=" + encodeURIComponent(ti) + "&limit=" + Math.max(99, len) + "&autocorrect=1"; break;
            }
        }
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
        this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_yttm (https://hydrogenaud.io/index.php/topic,111059.0.html)"); this.xmlhttp.send();
        if (!this.ie_timer) {var a = this.xmlhttp, that = this; this.ie_timer = window.SetTimeout(function() {a.abort(); that.ie_timer = false;}, 7000);}
    }

    this.Analyse = function() {
        var data = [];
        if (alb.mb) {
            var response = p.json_parse(this.xmlhttp.responsetext, "", "\"release-groups\":");
            if (!response) return this.on_search_done_callback("", ar_mbid, mode);
            json_data = json_data.concat(response["release-groups"]);
            if (offset == 100) releases = response["release-group-count"];
            if (!releases) return this.on_search_done_callback("", ar_mbid, mode);
            if (releases < offset || offset == 600) {
                data =  p.json_sort(json_data, "first-release-date", true);
                this.on_search_done_callback(data, ar_mbid, mode);
            } else {attempt = 0; this.Search();}
        } else {
            switch (mode) {
                case 0: data = []; data = p.json_parse(this.xmlhttp.responsetext, "topalbums.album", "name\":"); break;
                case 1:
                    data = []; var list = p.json_parse(this.xmlhttp.responsetext, "toptracks.track", "name\":"); if (!list) break; var save_list = [];
                    if (list.length < lmt && cache) {cache = false; return this.Search();}
                    for (i = 0; i < list.length; i++) {data[i] = {title: list[i].name, playcount: list[i].playcount}; save_list[i] = {title: list[i].name, playcount: list[i].playcount}} data.length = Math.min(99, data.length);
                    try {save_list.unshift({artist: list[0].artist.name, ar_mbid: ar_mbid});} catch (e) {save_list.unshift({artist: alb.artist, ar_mbid: "N/A"});} if (save_list.length) {p.create(f3); p.save(fn, JSON.stringify(save_list), true);}
                    break;
                case 2:
                    data = []; var list = p.json_parse(this.xmlhttp.responsetext, "similartracks.track", "name\":"); if (!list) break; var save_list = [];
                    for (i = 0; i < list.length; i++) {data[i] = {artist: list[i].artist.name, title: list[i].name, playcount: list[i].playcount}; save_list[i] = {artist: list[i].artist.name, title: list[i].name, playcount: list[i].playcount}} data.length = Math.min(99, data.length); if (save_list.length) {p.create(f3); p.save(fn, JSON.stringify(save_list), true);}
                    break;
            }
            if (!data.length && cache) {cache = false; return this.Search();}
            try {if (mode < 2 && !try_artist && (!data.length || data.length && data[0].artist.name.strip() != alb.artist.strip())) {try_artist = true; return this.Search();}} catch (e) {};
            this.on_search_done_callback(data, ar_mbid, mode);
        }
    }
}

function dld_radio_tracks() {
    var art_variety, curr_pop, limit, list = [], on_search_done_callback, rad_mode, rad_source, rad_type, rec = [], song_hot; this.rec = 0; this.t50 = 0;

    this.Execute = function(p_search_finish_callback, p_rad_source, p_rad_mode, p_rad_type, p_art_variety, p_song_hot, p_limit, p_curr_pop, p_top50, p_pn) {
        list = []; on_search_done_callback = p_search_finish_callback; rad_source = p_rad_source; rad_mode = p_rad_mode; rad_type = p_rad_type; art_variety = p_art_variety; song_hot = p_song_hot; limit = p_limit; curr_pop = p_curr_pop; index.reset_add_loc(p_top50);
        if (!p.use_saved && !p_top50 && (rad_type == 2 || rad_type == 4)) {var lfm_similar = new lfm_similar_artists(function() {lfm_similar.on_state_change();}, lfm_similar_search_done); lfm_similar.Search(rad_source, rad_mode, art_variety, rad_type);}
        else if (!rad_mode && !p_top50) {
            var all_files = index.best_saved_match(rad_source, rad_type);
            if (!all_files.length) return on_search_done_callback(false, rad_mode, p_top50);
            var f_ind = Math.floor(all_files.length * Math.random());
            var data = p.json_parse(utils.ReadTextFile(all_files[f_ind]), "response.songs");
            if (!data) return on_search_done_callback(false, rad_mode, p_top50);
            for (var i = 0; i < data.length; i++) list[i] = {artist: data[i].artist_name, title: data[i].title.strip_remaster()}
            if (list.length) {
                on_search_done_callback(true, rad_mode, p_top50); rad.list = list;
                index.track_count = rad.list.length * all_files.length; window.SetProperty("SYSTEM.Track Count", index.track_count);
                var tracks = list.slice(0, rad.get_no(limit, plman.PlaylistItemCount(pl.rad)));
                for (var j = 0; j < tracks.length; j++) this.do_youtube_search("", tracks[j].artist, tracks[j].title, j, tracks.length, "", p_pn);
                rad.list_index = rad.list_index + tracks.length;
            }
        } else if (!p.use_saved) this.do_lfm_radio_tracks_search(rad_source, rad_mode, rad_type, art_variety, song_hot, curr_pop, "", "", p_top50, p_pn);
        else {
            switch (rad_type == 4 ? 2 : rad_type) {
                case 0:
                    var rs = rad_source.clean(), fn = rad.f2 + rs.substr(0, 1).toLowerCase() + "\\" + rs + (curr_pop ? " [curr]" : "") + ".json";
                    if (!p.file(fn)) fn = rad.f2 + rs.substr(0, 1).toLowerCase() + "\\" + rs + (!curr_pop ? " [curr]" : "") + ".json";
                    if (!p.file(fn)) return on_search_done_callback(false, rad_mode, p_top50);
                    var data = p.json_parse(utils.ReadTextFile(fn));
                    if (!data) return on_search_done_callback(false, rad_mode, p_top50); on_search_done_callback(true, rad_mode, p_top50); var curr = fn.indexOf(" [curr]") != -1;
                    if (data[0].hasOwnProperty('artist')) data.shift();
                    for (var j = 0; j < Math.min(song_hot, data.length); j++) list[j] = {title: data[j].title.strip_remaster(), playcount: data[j].playcount}
                    if (!p_top50) {p.c_sort(list); rad.list = list; rad.list_type = curr; rad.param = rad_source;}
                    if (list.length) {
                        var tracks = p_top50 ? pl.top50 - plman.PlaylistItemCount(p_pn) : rad.get_no(limit, plman.PlaylistItemCount(pl.rad));
                        if (!p_top50) for (var i = 0; i < tracks; i++) {var t_ind = index.track(list, true, "", rad_mode, curr); this.do_youtube_search("", rad_source, list[t_ind].title, i, tracks, "", p_pn);}
                        else do_yt_search(rad_source, list, tracks, p_top50, p_pn);
                    }
                    if (list.length && p_top50) plman.ActivePlaylist = p_pn;
                    break;
                case 1:
                case 3:
                    var rs = rad_source.clean(), fn = rad.f2 + rs.substr(0, 1).toLowerCase() + "\\" + rs + (rad_type == 1 || p_top50 == 3 ? ".json" : " [Similar Songs].json");
                    if (!p.file(fn)) return on_search_done_callback(false, rad_mode, p_top50);
                    var data = p.json_parse(utils.ReadTextFile(fn));
                    if (!data) return on_search_done_callback(false, rad_mode, p_top50); on_search_done_callback(true, rad_mode, p_top50);
                    var le = Math.min(data.length, song_hot);
                    for (var i = 0; i < le; i++) list[i] = {artist: data[i].artist, title: data[i].title.strip_remaster()}
                    if (!p_top50) {rad.list = list; index.track_count = le; window.SetProperty("SYSTEM.Track Count", index.track_count);}
                    if (list.length) {
                        var tracks = p_top50 ? (p_top50 != 3 ? pl.top50 : 40) - plman.PlaylistItemCount(p_pn) : rad.get_no(limit, plman.PlaylistItemCount(pl.rad));
                        if (!p_top50) for (var j = 0; j < tracks; j++) {var g_ind = index.genre(list.length, list, 0); this.do_youtube_search("", list[g_ind].artist, list[g_ind].title, j, tracks, "", p_pn);}
                        else do_yt_search("", list, tracks, p_top50, p_pn);
                    }
                    if (list.length && p_top50) plman.ActivePlaylist = p_pn;
                    break;
                case 2:
                    var ft, rs = rad_source.clean(), fn = rad.f2 + rs.substr(0, 1).toLowerCase() + "\\" + rs + (rad_type == 4 ? " - Top Artists.json" : " And Similar Artists.json");
                    if (!p.file(fn)) {if (rad_mode > 1) rad.med_lib_radio("", rad_source, rad_mode, rad_type, art_variety); return on_search_done_callback(false, rad_mode, p_top50);}
                    var data = p.json_parse(utils.ReadTextFile(fn));
                    if (!data) {if (rad_mode > 1) rad.med_lib_radio("", rad_source, rad_mode, rad_type, art_variety); return on_search_done_callback(false, rad_mode, p_top50);}
                    if (rad_mode > 1) {rad.med_lib_radio(data, rad_source, rad_mode, rad_type, art_variety); return;}
                    on_search_done_callback(true, rad_mode, p_top50); rad.list = data.slice(0, art_variety);
                    var tracks = rad.get_no(limit, plman.PlaylistItemCount(pl.rad));
                    for (var i = 0; i < tracks; i++) {
                        for (var k = 0; k < rad.list.length; k++) {
                            var s_ind = index.artist(rad.list.length), lp = rad_type != 4 && rad.list[0].hasOwnProperty('name') ? rad.list[s_ind].name.clean() : rad.list[s_ind].clean();
                            ft = rad.f2 + lp.substr(0, 1).toLowerCase() + "\\" + lp + (curr_pop ? " [curr]" : "") + ".json";
                            if (!p.file(ft)) ft = rad.f2 + lp.substr(0, 1).toLowerCase() + "\\" + lp + (!curr_pop ? " [curr]" : "") + ".json";
                            if (p.file(ft)) break;
                        }
                        data = p.json_parse(utils.ReadTextFile(ft));  if (data && data[0].hasOwnProperty('artist')) data.shift(); var curr = ft.indexOf(" [curr]") != -1;
                        for (var j = 0; j < Math.min(song_hot, data.length); j++) list[j] = {title: data[j].title.strip_remaster(), playcount: data[j].playcount}; var art_nm = p.fs.GetBaseName(ft).replace(" [curr]", "");
                        if (list.length) {p.c_sort(list); var t_ind = index.track(list, false, art_nm, rad_mode, curr); this.do_youtube_search("", art_nm, list[t_ind].title, i, tracks, "", p_pn);}
                    }
                    break;
            }
        }
    }

    var lfm_similar_search_done = function(res, source, p_rad_mode) {
        if (p_rad_mode > 1) return; if (!res.length) return on_search_done_callback(false, p_rad_mode, 0); on_search_done_callback(true, p_rad_mode, 0);
        rad.list = res.slice(0, art_variety);
        var tracks = rad.get_no(limit, plman.PlaylistItemCount(pl.rad));
        for (var i = 0; i < tracks; i++) {var s_ind = index.artist(rad.list.length);
            yt_rad.do_lfm_radio_tracks_search(rad_type != 4 && rad.list[0].hasOwnProperty('name') ? rad.list[s_ind].name : rad.list[s_ind], p_rad_mode, rad_type == 4 ? 2 : rad_type, art_variety, song_hot, curr_pop, i, tracks, "", pl.rad);}
    }

    this.do_lfm_radio_tracks_search = function(p_artist, p_rad_mode, p_rad_type, p_art_variety, p_song_hot, p_curr_pop, p_i, p_done, p_top50, p_pn) {
        var lfm_search = new lfm_radio_tracks_search(function() {lfm_search.on_state_change();}, on_lfm_radio_tracks_search_done);
        lfm_search.Search(p_artist, p_rad_mode, p_rad_type, p_art_variety, p_song_hot, p_curr_pop, p_i, p_done, p_top50, p_pn);
    }

    var on_lfm_radio_tracks_search_done = function(p_artist, p_title, p_i, p_done, p_top50, p_pn, p_rm, p_rt, p_curr) {
        switch (p_rt) {
            case 0:
                if (!p_title.length) return on_search_done_callback(false, p_rm, p_top50, p_pn); on_search_done_callback(true, p_rm, p_top50); list = p_title;
                if (!p_top50) {p.c_sort(p_title); rad.list = p_title; rad.list_type = p_curr; rad.param = p_artist;} else plman.ActivePlaylist = p_pn;
                var tracks = p_top50 ? pl.top50 - plman.PlaylistItemCount(p_pn) : rad.get_no(limit, plman.PlaylistItemCount(pl.rad));
                if (!p_top50) for (var i = 0; i < tracks; i++) {var t_ind = index.track(p_title, true, "", p_rm, p_curr); yt_rad.do_youtube_search("", p_artist, p_title[t_ind].title, i, tracks, "", p_pn);}
                else do_yt_search(p_artist, p_title, tracks, p_top50, p_pn);
                break;
            case 1:
            case 3:
                if (!p_artist.length) return on_search_done_callback(false, p_rm, p_top50, p_pn); on_search_done_callback(true, p_rm, p_top50); list = p_artist; if (!p_top50) rad.list = p_artist; else plman.ActivePlaylist = p_pn;
                var tracks = p_top50 ? (p_top50 != 3 ? pl.top50 : 40) - plman.PlaylistItemCount(p_pn) : rad.get_no(limit, plman.PlaylistItemCount(pl.rad));
                if (!p_top50) {for (var i = 0; i < tracks; i++) {var g_ind = index.genre(p_artist.length, p_artist, 0); yt_rad.do_youtube_search("", p_artist[g_ind].artist, p_artist[g_ind].title, i, tracks, p_top50, p_pn);} index.track_count = p_artist.length; window.SetProperty("SYSTEM.Track Count", index.track_count);}
                else do_yt_search("", p_artist, tracks, p_top50, p_pn);
                break;
            case 2:
                if (!p_artist.length || !p_title.length) return on_youtube_search_done(); p.c_sort(p_title);
                var t_ind = index.track(p_title, false, p_artist, p_rm, p_curr); yt_rad.do_youtube_search("", p_artist, p_title[t_ind].title, p_i, p_done, "", p_pn);
                break;
        }
    }

    var do_yt_search = function(p_results1, p_results2, p_tracks, p_top50, p_pn) {
        var i = 0; timer.reset(timer.yt, timer.yti);
        timer.yt = window.SetInterval(function() {
            if (i < p_tracks && i < p_results2.length) {
                if (p_top50 == 1) {
                    while (i < p_results2.length && index.arr_contains(rad.t50_array, p_results2[i].title.strip())) p_results2.splice(i, 1);
                    if (i < p_results2.length) {
                        yt_rad.do_youtube_search("", p_results1, p_results2[i].title, i, p_tracks, p_top50, p_pn);
                        rad.t50_array.push(p_results2[i].title.strip()); i++;
                    }
                } else {yt_rad.do_youtube_search("", p_results2[i].artist, p_results2[i].title, i, p_tracks, p_top50, p_pn); i++;}
            } else timer.reset(timer.yt, timer.yti);
        }, 20);
    }

    this.do_youtube_search = function(p_alb_id, p_artist, p_title, p_i, p_done, p_top50, p_pn, p_alb_set) {
        if (!p_top50 && !p_alb_set && ml.rad || (p_top50 || p_alb_set) && ml.top)
            if (lib && lib.in_library(p_artist, p_title, p_i, p_top50, p_alb_set, false, false)) {if (p_alb_set) {alb.set_row(p_alb_id, 1, p_artist); t.paint();} return on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_i, p_done, p_top50, p_pn, p_alb_set);}

        var yt_search = new youtube_search(function() {yt_search.on_state_change();}, on_youtube_search_done);
        if (p_alb_set) {alb.set_row(p_alb_id, 1, p_artist); rec[p_alb_id] = 0; t.paint();} yt_search.Search(p_alb_id, p_artist, p_title, p_i, p_done, p_top50, p_pn, "", p_alb_set);
    }

    var run_add_loc = function(p_loc, p_top50, p_pn, p_alb_set) {p.json_sort(p_loc, "id", false); for (var l = 0; l < p_loc.length; l++) if (p_loc[l].id != "x") {p_loc[l].id = "x"; p.plmanAddloc ? p.add_locations([p_loc[l].path], p_pn, true, p_top50, p_alb_set) : p.add_fb2k_locations(p_loc[l].path, true, p_top50, p_alb_set);}}

    var on_youtube_search_done = function(p_alb_id, link, p_artist, p_title, p_i, p_done, p_top50, p_pn, p_alb_set) {
        if (p_top50 || !p_top50 && !p_alb_set && ml.rad || p_alb_set && ml.top) {
            !p_alb_set ? (!p_top50 ? yt_rad.rec++ : yt_rad.t50++) : rec[p_alb_id]++;
            if (link && link.length) !p_top50 ? p.add_loc.push({"path":link,"id":p_i}) : p.t50_loc.push({"path":link,"id":p_i}); var loc = !p_top50 ? p.add_loc : p.t50_loc;
            if (loc.length) for (var k = 0; k < loc.length; k++) if (loc[k].id == (!p_alb_set ? (!p_top50 ? p.loc_ix : p.t50_ix) : p_alb_id)) {loc[k].id = "x"; !p_top50 ? p.loc_ix++ : p.t50_ix++; p.plmanAddloc ? p.add_locations([loc[k].path], p_pn, true, p_top50, p_alb_set) : p.add_fb2k_locations(loc[k].path, true, p_top50, p_alb_set);}
            if ((!p_alb_set ? (!p_top50 ? yt_rad.rec : yt_rad.t50) : rec[p_alb_id]) == p_done || p_done == "force") run_add_loc(loc, p_top50, p_pn , p_alb_set); // run outstanding
        } else if (link && link.length) p.plmanAddloc ? p.add_locations([link], p_pn, true, p_top50, p_alb_set) : p.add_fb2k_locations(link, true, p_top50, p_alb_set);
        if (p_alb_set) {alb.set_row(p_alb_id, 2, p_artist); t.paint();}
    }
}
var yt_rad = new dld_radio_tracks();

function dld_album_tracks() {
    var alb_id, album_artist, album, d_run, date, done = [], extra, prime, re_mbid, rg_mbid, rec = [], yt_i = [], yt_timer = [];

    this.Execute = function(p_alb_id, p_rg_mbid, p_album_artist, p_album, p_prime, p_extra, p_date) {
        if (alb.track_source == alb.pref_mb_tracks) {re_mbid = ""; rg_mbid = p_rg_mbid; alb_id = p_alb_id; album_artist = p_album_artist; album = p_album; prime = p_prime; extra = p_extra; date = p_date; d_run = false;}
        switch (((!p.btn_mode && alb.mb) || d_run) ? alb.track_source : 1) {
            case 0: get_lfm_tracks(); break;
            case 1: if ((p.btn_mode || !alb.mb) && d_run) on_mb_releases_search_done(alb_id, re_mbid, album_artist, date); else get_mb_tracks(); break;
        }
    }

    var get_lfm_tracks = function() {
        var lfm_tracks = new album_tracks(function() {lfm_tracks.on_state_change();}, on_tracks_search_done);
        lfm_tracks.Search(alb_id, "", album_artist, album);
    }

    var get_mb_tracks = function() {
        var mb_releases = new musicbrainz_releases(function() {mb_releases.on_state_change();}, on_mb_releases_search_done);
        mb_releases.Search(alb_id, rg_mbid, album_artist, album, prime, extra);
    }

    var on_mb_releases_search_done = function(p_alb_id, p_re_mbid, p_album_artist, p_date) {
        re_mbid = p_re_mbid; if (p.btn_mode || !alb.mb) {if (!p_date) return on_tracks_search_done([]); else date = p_date;}
        var mb_tracks = new album_tracks(function() {mb_tracks.on_state_change();}, on_tracks_search_done);
        if ((p.btn_mode || !alb.mb) && !d_run) d_run = true;
        if ((p.btn_mode || !alb.mb) && d_run) {
            if (alb.track_source) {if (!re_mbid) {alb.track_source = 0; return get_lfm_tracks();}; mb_tracks.Search(p_alb_id, re_mbid, p_album_artist);}
            else get_lfm_tracks();
        }
        if (!p.btn_mode && alb.mb) {if (!re_mbid) return on_tracks_search_done([]); mb_tracks.Search(p_alb_id, re_mbid, p_album_artist);}
    }

    var many_tracks = function(length, artist, album) {
        var ns = p.InputBox("This Album Has A Lot of Tracks: " + length + "\n\nProceed?\n\nLoading May Take a Few Seconds", "Album Search", artist + " | " + album);
        if (!ns || ns == "Artist | Album") return false; return true;
    }

    var on_tracks_search_done = function(p_alb_id, list) {
        if (!list || !list.length) {if (!p.btn_mode) return; else return fb.ShowPopupMessage(ml.alb == 3 ? "Request Made: Load Album Using Only Original Library Tracks\n\nResult: No Matching Tracks Found" : "Artist | Album Not Recognised\n\n"+ album_artist + " | " + album, "YouTube Track Manager");}
        if (list.length > 25 && list[0].artist.length + album.length < 251 && !many_tracks(list.length, list[0].artist, album)) return;
        done[p_alb_id] = list.length; rec[p_alb_id] = 0; yt_i[p_alb_id] = 0; reset_yt_timer(p_alb_id);
        plman.ActivePlaylist = pl.alb; if (ml.alb && ml.mtags_installed) {p.mtags[p_alb_id] = []; plman.ClearPlaylist(plman.ActivePlaylist);} else p.loc_add[p_alb_id] = [];
        yt_timer[p_alb_id] = window.SetInterval(function() {
            if (yt_i[p_alb_id] < list.length) {do_youtube_search(p_alb_id, list[yt_i[p_alb_id]].artist, list[yt_i[p_alb_id]].title, yt_i[p_alb_id] + 1); yt_i[p_alb_id]++;} else reset_yt_timer(p_alb_id);
        }, 20);
    }

    var do_youtube_search = function(p_alb_id, p_artist, p_title, p_index) {
        if (ml.mtags_installed && (ml.alb > 1 && lib && lib.in_library_alb(p_alb_id, p_artist, p_title, album, date, p_index, false, false) || ml.alb == 3))
            return on_youtube_search_done(p_alb_id, "", p_artist, p_title, p_index);
        var yt_search = new youtube_search(function() {yt_search.on_state_change();}, on_youtube_search_done);
        yt_search.Search(p_alb_id, p_artist, p_title, p_index, "", "", "", ml.alb && ml.mtags_installed ? "" : "fb2k_tracknumber=" + p_index + "&fb2k_album=" + encodeURIComponent(album) + (date.length ? ("&fb2k_date=" + encodeURIComponent(date)) : ""));
    }

    var reset_yt_timer = function(p_alb_id) {if (yt_timer[p_alb_id]) window.ClearTimeout(yt_timer[p_alb_id]); yt_timer[p_alb_id] = false;}
    var run_add_loc = function(p_alb_id) {var add_loc_arr = []; p.json_sort(p.loc_add[p_alb_id], "id", false); add_loc_arr[p_alb_id] = []; for (var l = 0; l < p.loc_add[p_alb_id].length; l++) if (p.plmanAddloc) {add_loc_arr[p_alb_id].push(p.loc_add[p_alb_id][l].path);} else p.add_fb2k_locations(p.loc_add[p_alb_id][l].path); if (p.plmanAddloc) p.add_locations(add_loc_arr[p_alb_id], pl.alb);}

    var on_youtube_search_done = function(p_alb_id, link, p_artist, p_title, p_ix, p_done, p_top50, p_pn, p_alb_set, p_length, p_orig_title, p_yt_title, p_full_alb, p_fn, p_type) {
        rec[p_alb_id]++;
        if (link && link.length) {
            if (ml.alb && ml.mtags_installed) {var type_arr = ["", "YouTube Track", "Prefer Library Track", "Library Track"]; p.mtags[p_alb_id].push({"@":link,"ALBUM":album,"ARTIST":p_artist,"DATE":date,"DURATION":p_length.toString(),"REPLAYGAIN_TRACK_GAIN":[],"REPLAYGAIN_TRACK_PEAK":[],"TITLE":p_title,"TRACKNUMBER":p_ix.toString(),"YOUTUBE_TITLE":p_yt_title ? p_yt_title : [],"YOUTUBE_TRACK_MANAGER_SEARCH_TITLE":p_orig_title ? p_orig_title : [],"YOUTUBE_TRACK_MANAGER_TRACK_TYPE":type_arr[ml.alb]});}
            else p.loc_add[p_alb_id].push({"path":link,"id":p_ix});
        }
        if ((rec[p_alb_id] == done[p_alb_id] || p_done == "force") &&  done[p_alb_id] != "done")
            if (p.mtags[p_alb_id].length || p.loc_add[p_alb_id].length) {
                alb.set_row(p_alb_id, 2, p_artist); t.paint();
                if (ml.alb && ml.mtags_installed) alb.save_mtags(p_alb_id, p_artist, album); else run_add_loc(p_alb_id); done[p_alb_id] = "done"
            } else {alb.set_row(p_alb_id, 0, p_artist); t.paint(); if (ml.alb == 3) fb.ShowPopupMessage("Request Made: Load Album Using Only Original Library Tracks\n\nResult: No Matching Tracks Found", "YouTube Track Manager");}
    }
}

function dld_album_names(p_callback) {
    var on_finish_callback = p_callback;

    this.Execute = function(p_album_artist, p_just_mbid, p_dbl_load, p_mode) {
        var mb_artist_id = new musicbrainz_artist_id(function() {mb_artist_id.on_state_change();}, on_mb_artist_id_search_done);
        mb_artist_id.Search(p_album_artist, p_just_mbid, p_dbl_load, p_mode)
    }

    var on_mb_artist_id_search_done = function(ar_mbid, just_mbid, mode) {
        var mb_lfm_albums = new album_names(function() {mb_lfm_albums.on_state_change();}, on_album_names_search_done);
        if ((!ar_mbid.length && alb.mb || just_mbid) && !alb.songs_mode()) return on_album_names_search_done([], ar_mbid, mode);
        mb_lfm_albums.Search(ar_mbid, mode);
    }

    var on_album_names_search_done = function(data, ar_mbid, mode) {on_finish_callback(data, ar_mbid, true, mode);}
}

function dld_more_album_names(p_callback) {
    var on_finish_callback = p_callback;

    this.Execute = function(ar_mbid, mode) {
        var mb_lfm_albums = new album_names(function() {mb_lfm_albums.on_state_change();}, on_album_names_search_done);
        if (!ar_mbid.length && alb.mb) return on_album_names_search_done([], ar_mbid, mode);
        mb_lfm_albums.Search(ar_mbid, mode);
    }

    var on_album_names_search_done = function(data, ar_mbid, mode) {on_finish_callback(data, ar_mbid, true, mode);}
}

function scrollbar() {
    var smoothness = 1 - window.GetProperty("ADV.Scroll: Smooth Scroll Level 0-1", 0.6561); smoothness = Math.max(Math.min(smoothness, 0.99), 0.01); this.bar_timer = false; this.count = -1; this.draw_timer = false; this.hover = false; this.hover_o = false; this.s1 = 0; this.s2 = 0; this.scroll_step = window.GetProperty(" Scroll - Mouse Wheel: Page Scroll", true); this.smooth = window.GetProperty(" Scroll: Smooth Scroll", true); this.timer_but = false;
    this.alpha = !ui.scr_col ? 75 : (!ui.scr_type ? 68 : 51); this.init = true; var alpha1 = this.alpha, alpha2 = !ui.scr_col ? 128 : (!ui.scr_type ? 119 : 85), inStep = ui.scr_type && ui.scr_col ? 12 : 18;
    this.x = 0; this.y = 0; this.w = 0; this.h = 0; this.bar_ht = 0; this.but_h = 0; this.bar_y = 0; this.row_count = 0; this.scroll = 0; this.delta = 0; this.ratio = 1; this.rows_drawn = 0; this.row_h = 0; this.scrollbar_height = 0; this.scrollable_lines = 0; this.scrollbar_travel = 0; this.stripe_w = 0; this.text_y = 0; this.text_h = 0;
    this.b_is_dragging = false; this.drag_distance_per_row; this.initial_drag_y = 0; // dragging
    this.leave = function() {if (!alb.show || t.halt()) return; this.hover = !this.hover; this.paint(); this.hover = false; this.hover_o = false;}
    this.nearest = function(y) {y = (y - this.but_h) / this.scrollbar_height * this.scrollable_lines * this.row_h; y = y / this.row_h; y = Math.round(y) * this.row_h; return y;}
    this.reset = function() {this.delta = this.scroll = this.s1 = this.s2 = 0;}
    this.scroll_timer = function() {var that = this; this.draw_timer = window.SetInterval(function() {if (p.w < 1 || !window.IsVisible) return; that.smooth_scroll();}, 16);}
    this.set_rows = function(row_count) {this.row_count = row_count; this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h, this.text_y, this.text_h);}
    this.wheel = function(step, pgkey) {this.check_scroll(this.scroll + step * - (this.scroll_step || pgkey ? this.rows_drawn : 3) * this.row_h); alb.wheel();}

    this.metrics = function(x, y, w, h, rows_drawn, row_h, text_y, text_h) {
        this.x = x; this.y = Math.round(y); this.w = w; this.h = h; this.rows_drawn = rows_drawn; this.row_h = row_h; this.text_y = text_y; this.text_h = text_h; this.but_h = p.but_h;
        // draw info
        this.scrollbar_height = Math.round(this.h - this.but_h * 2);
        this.bar_ht = Math.max(Math.round(this.scrollbar_height * this.rows_drawn / this.row_count), Math.max(Math.min(this.scrollbar_height / 2, p.grip_h), 5));
        this.lmt = this.row_count * this.row_h - this.rows_drawn * 2 * this.row_h
        this.scrollbar_travel = this.scrollbar_height - this.bar_ht;
        // scrolling info
        this.scrollable_lines = this.row_count - this.rows_drawn;
        this.ratio = this.row_count / this.scrollable_lines;
        this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h);
        this.drag_distance_per_row = this.scrollbar_travel / this.scrollable_lines;
        if (ui.alternate) this.stripe_w = p.scrollbar_show && this.scrollable_lines > 0 ? p.w - p.sbar_sp : p.w;
    }

    this.draw = function(gr) {if (this.scrollable_lines > 0) {try {
        switch (p.scr_type) {
            case 0:
                switch (p.scr_col) {
                    case 0: gr.FillSolidRect(this.x, this.y + this.bar_y, this.w, this.bar_ht, RGBA(ui.ct, ui.ct, ui.ct, !this.hover && !this.b_is_dragging ? this.alpha : this.hover && !this.b_is_dragging ? this.alpha : 192)); break;
                    case 1: gr.FillSolidRect(this.x, this.y + this.bar_y, this.w, this.bar_ht, ui.textcol & (!this.hover && !this.b_is_dragging ? RGBA(255, 255, 255, this.alpha) : this.hover && !this.b_is_dragging ? RGBA(255, 255, 255, this.alpha) : 0x99ffffff)); break;
                } break;
            case 1:
                switch (p.scr_col) {
                    case 0: gr.FillSolidRect(this.x, this.y - p.sbar_o, this.w, this.h + p.sbar_o * 2, RGBA(ui.ct, ui.ct, ui.ct, 15)); gr.FillSolidRect(this.x, this.y + this.bar_y, this.w, this.bar_ht, RGBA(ui.ct, ui.ct, ui.ct, !this.hover && !this.b_is_dragging ? this.alpha : this.hover && !this.b_is_dragging ? this.alpha : 192)); break;
                    case 1: gr.FillSolidRect(this.x, this.y - p.sbar_o, this.w, this.h + p.sbar_o * 2, ui.textcol & 0x15ffffff); gr.FillSolidRect(this.x, this.y + this.bar_y, this.w, this.bar_ht, ui.textcol & (!this.hover && !this.b_is_dragging ? RGBA(255, 255, 255, this.alpha) : this.hover && !this.b_is_dragging ? RGBA(255, 255, 255, this.alpha) : 0x99ffffff)); break;
                } break;
            case 2: p.theme.SetPartAndStateId(6, 1); p.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h); p.theme.SetPartAndStateId(3, !this.hover && !this.b_is_dragging ? 1 : this.hover && !this.b_is_dragging ? 2 : 3); p.theme.DrawThemeBackground(gr, this.x, this.y + this.bar_y, this.w, this.bar_ht); break;}} catch (e) {}}
    }

    this.paint = function() {
        if (this.hover) this.init = false; if (this.init) return; this.alpha = this.hover ? alpha1 : alpha2; var that = this
        window.ClearTimeout(this.bar_timer); this.bar_timer = false;
        this.bar_timer = window.SetInterval(function() {that.alpha = that.hover ? Math.min(that.alpha += inStep, alpha2) : Math.max(that.alpha -= 3, alpha1); window.RepaintRect(that.x, that.y, that.w, that.h);
            if (that.hover && that.alpha == alpha2 || !that.hover && that.alpha == alpha1) {that.hover_o = that.hover; window.ClearTimeout(that.bar_timer); that.bar_timer = false;}}, 25);
    }

    this.lbtn_up = function(p_x, p_y) {
        var x = p_x - this.x; var y = p_y - this.y;
        if (!this.hover && this.b_is_dragging) this.paint(); else window.RepaintRect(this.x, this.y, this.w, this.h); if (this.b_is_dragging) {this.b_is_dragging = false; but.Dn = false;} this.initial_drag_y = 0;
        if (this.timer_but) {window.ClearTimeout(this.timer_but); this.timer_but = false;}; this.count = -1;
    }

    this.lbtn_dn = function(p_x, p_y) {
        var x = p_x - this.x; var y = p_y - this.y;
        if (x < 0 || x > this.w || y < 0 || y > this.h || this.row_count <= this.rows_drawn) return;
        if (y < this.but_h || y > this.h - this.but_h) return;
        if (y < this.bar_y) var dir = 1; // above bar
        else if (y > this.bar_y + this.bar_ht) var dir = -1; // below bar
        if (y < this.bar_y || y > this.bar_y + this.bar_ht)
            this.check_scroll(this.nearest(y));
        else { // on bar
            this.b_is_dragging = true; but.Dn = true; window.RepaintRect(this.x, this.y, this.w, this.h);
            this.initial_drag_y = y - this.bar_y;
        }
    }

    this.move = function(p_x, p_y) {
        var x = p_x - this.x; var y = p_y - this.y;
        if (x < 0 || x > this.w || y > this.bar_y + this.bar_ht || y < this.bar_y || but.Dn) this.hover = false; else this.hover = true;
        if (this.hover != this.hover_o && !this.bar_timer) this.paint();
        if (!this.b_is_dragging || this.row_count <= this.rows_drawn) return;
        this.check_scroll(Math.round((y - this.initial_drag_y - this.but_h) / this.drag_distance_per_row) * this.row_h);
    }

    this.check_scroll = function(new_scroll) {
        var s = Math.max(0, Math.min(new_scroll, this.scrollable_lines * this.row_h));
        if (s == this.scroll) return; this.scroll = s;
        if (this.smooth) {if (!this.draw_timer) this.scroll_timer();}
        if (!this.smooth) {this.delta = this.scroll; this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h); if (t.rp) window.RepaintRect(0, this.text_y, p.w, this.text_h + 3);}
    }

    this.smooth_scroll = function() {
        if (this.delta <= 0.5) {this.delta = 0; this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h); if (t.rp) window.RepaintRect(0, this.text_y, p.w, this.text_h + 3);}
        if(Math.abs(this.scroll - this.delta) > 0.5) {
            this.s1 += (this.scroll - this.s1) * smoothness; this.s2 += (this.s1 - this.s2) * smoothness; this.delta += (this.s2 - this.delta) * smoothness;
            this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h); if (t.rp) window.RepaintRect(0, this.text_y, p.w, this.text_h + 3);
        } else if (this.draw_timer) {window.ClearTimeout(this.draw_timer); this.draw_timer = false;}
    }

    this.but = function(dir) {
        this.check_scroll(this.scroll + (dir * -this.row_h));
        if(!this.timer_but) {var that = this; this.timer_but = window.SetInterval(function() {if (that.count > 6) {that.check_scroll(that.scroll + (dir * -that.row_h));} else that.count++;}, 40);}
    }
}
var alb_scrollbar = new scrollbar(), art_scrollbar = new scrollbar();

function favourites_manager() {
    this.auto = window.GetProperty("SYSTEM.Auto Favourites", true);
    this.toggle_auto = function() {this.auto = !this.auto;}
    this.save_fav_to_file = function() {return p.use_local ? true : false;} // use return true for file save/load of favourites

    this.init = function() {
        if (this.save_fav_to_file()) {var n = fb.ProfilePath + "yttm\\" + "favourites.json"; if (!p.file(n)) p.save(n, "No Favourites", true); window.SetProperty("SYSTEM.Radio Favourites", utils.ReadTextFile(n));}
        this.stations = window.GetProperty("SYSTEM.Radio Favourites", "No Favourites");
        this.stations = this.stations.indexOf("No Favourites") == -1 ? p.json_parse(this.stations) : [];
        if (this.stations.length) p.json_sort(p.num_sort(this.stations, "type"), "source", false);
    }

    this.save = function(fv) {
        window.SetProperty("SYSTEM.Radio Favourites", fv);
        this.stations = fv.indexOf("No Favourites") == -1 ? p.json_parse(fv) : [];
        if (this.stations.length) p.json_sort(p.num_sort(this.stations, "type"), "source", false);
        if (this.save_fav_to_file()) p.save(fb.ProfilePath + "yttm\\favourites.json", fv, true);
    }

    this.add_current_station = function(source) {
        if (!source.length || source == "N/A") return;
        var station_array = window.GetProperty("SYSTEM.Radio Favourites", "No Favourites"), rq =  index.rad_query, rt = index.rad_type; if (rt == 4) rt = 1;
        station_array = station_array.indexOf("No Favourites") == -1 ? p.json_parse(station_array) : [];
        if (station_array.length)
            for (var i = 0; i < station_array.length; i++)
                if (station_array[i].source == source + (!rq ? "" : " [Query - " + index.n[3] + index.s[3] + "]") && station_array[i].type == rt) {station_array.splice(i, 1); break;}
        station_array.push({"source":source + (!rq ? "" : " [Query - " + index.n[3] + index.s[3] + "]"),"type":rt,"query":rq});
        if (station_array.length > 30) station_array.splice(0, 1);
        this.save(JSON.stringify(station_array));
    }

    this.remove_current_station = function(source) {
        var station_array = window.GetProperty("SYSTEM.Radio Favourites", "No Favourites");
        station_array = station_array.indexOf("No Favourites") == -1 ? p.json_parse(station_array) : [];
        var i = station_array.length; while (i--) if (station_array[i].source == source) station_array.splice(i, 1);
        this.save(station_array.length ? JSON.stringify(station_array) : "No Favourites");
    }
}
var fav = new favourites_manager(); fav.init();

function new_radio() {
    var ct = 0, played_artist_arr = p.json_parse(window.GetProperty("SYSTEM.Radio Played Artists", JSON.stringify([]))), played_track_arr = p.json_parse(window.GetProperty("SYSTEM.Radio Played Tracks", JSON.stringify([]))), pll = 0, pop1 = 0.8, pop2 = 0.2, rad_found = false, tag_feed = [], song_feed = [];
    var pc_at_adjust = window.GetProperty("ADV.PopularTrack [AllTime] LfmPlaycount", 500000) / 20000; // base value of all-time popular track of 500000 can be altered to respond to changes in last.fm scrobbling frequency
    var pc_curr_adjust = window.GetProperty("ADV.PopularTrack [Current] LfmPlaycount (6mth)", 10000) / 20000; // base value of current popular track of 10000 can be altered to respond to changes in last.fm scrobbling frequency
    var calc_bias = function(v){if (isNaN(v)) return 0.2; else return  v >= 10 ? 0 : Math.min(1 / Math.abs(v), 0.9)}
    var rsn = ["Last.fm ","Radio","iSelect ","Radio","MySelect ","Radio","Separator"," ∙ "]; try {rsn = window.GetProperty(" Radio Names: Pairs + Separator", "Last.fm, Radio,iSelect, Radio,MySelect, Radio,Separator, ∙ ").split(",");} catch (e) {};
    var prop = ["ADV.Radio BestTracks Bias 1-10 Artist","ADV.Radio BestTracks Bias 1-10 Genre.TopTracks","ADV.Radio BestTracks Bias 1-10 Similar Artists","ADV.Radio BestTracks Bias 1-10 Similar Songs","ADV.Radio BestTracks Bias 1-10 Genre.TopArtists","ADV.Radio BestTracks Bias 1-10 Query"], weight = [[0.5,0.9,0.2],[0.9,0.9,0],[0.2,0.2,0],[0.5,0.9,"N/A"],[0.2,0.2,0],["N/A","N/A",0]], wt = [];
    try {
        wt[0] = window.GetProperty(prop[0], rsn[0].trim() + ",2," + rsn[2].trim() + ",1," + rsn[4].trim() + ",5").replace(/^[,\s]+|[,\s]+$/g, "").split(",");
        wt[1] = window.GetProperty(prop[1], rsn[0].trim() + ",1," + rsn[2].trim() + ",1," + rsn[4].trim() + ",10").replace(/^[,\s]+|[,\s]+$/g, "").split(",");
        wt[2] = window.GetProperty(prop[2], rsn[0].trim() + ",5," + rsn[2].trim() + ",5," + rsn[4].trim() + ",10").replace(/^[,\s]+|[,\s]+$/g, "").split(",");
        wt[3] = window.GetProperty(prop[3], rsn[0].trim() + ",2," + rsn[2].trim() + ",1," + rsn[4].trim() + ",N/A").replace(/^[,\s]+|[,\s]+$/g, "").split(",");
        wt[4] = window.GetProperty(prop[4], rsn[0].trim() + ",5," + rsn[2].trim() + ",5," + rsn[4].trim() + ",10").replace(/^[,\s]+|[,\s]+$/g, "").split(",");
        wt[5] = window.GetProperty(prop[5], rsn[0].trim() + ",N/A," + rsn[2].trim() + ",N/A," + rsn[4].trim() + ",10").replace(/^[,\s]+|[,\s]+$/g, "").split(",");
        for (var i = 0; i < weight.length; i ++) {if (wt[i][0] != rsn[0] || wt[i][2] != rsn[2] || wt[i][4] != rsn[4]) window.SetProperty(prop[i], rsn[0].trim() + "," + wt[i][1] + "," + rsn[2].trim() + "," + wt[i][3] + "," + rsn[4].trim() + "," + wt[i][5]); weight[i] = [calc_bias(wt[i][1]),calc_bias(wt[i][3]),calc_bias(wt[i][5])];}
    } catch (e) {}
    var youtube_title_filter = window.GetProperty("ADV.YouTube 'Live' Filter Title", "awards|bootleg|\\bclip\\b|concert\\b|grammy|interview|jools|karaoke|(- |\\/ |\\/|\\| |\\(|\\[|\{|\\\")live|live at|mtv|o2|parody|perform|preview|sample|\\bsession|teaser|\\btour\\b|tutorial|unplugged|\\d\/\\d|\\d-\\d|(?=.*\\blive\\b)(19|20)\\d\\d|(?=.*(19|20)\\d\\d)\\blive\\b|(?:[^n]).\\breaction\\b");
    var youtube_descr_filter = window.GetProperty("ADV.YouTube 'Live' Filter Description", "awards|bootleg|\\bclip\\b|concert\\b|grammy|interview|jools|karaoke|(- |\\/ |\\/|\\| |\\(|\\[|\{|\\\")live|live at|mtv|o2|parody|preview|sample|\\bsession|teaser|\\btour\\b|tutorial|unplugged|(?=.*\\blive\\b)(19|20)\\d\\d|(?=.*(19|20)\\d\\d)\\blive\\b"); // intentionally different
    if (!window.GetProperty("SYSTEM.YouTube 'Pref' Keywords Update", false)) {window.SetProperty("ADV.YouTube 'Preference' Keywords", "vevo"); window.SetProperty("SYSTEM.YouTube 'Pref' Keywords Update", true);}
    var youtube_pref_filter = window.GetProperty("ADV.YouTube 'Preference' Keywords", "vevo"); this.yt_pref_kw = youtube_pref_filter.split("//");
    this.activate = window.GetProperty(" Playlists Soft Activate On Create", true); this.curr_pop = window.GetProperty("SYSTEM.Tracks: Curr Popularity", true); this.ec_variety = window.GetProperty("SYSTEM.Artist Variety Ec", 50);
    var refine = window.GetProperty("ADV.Feed Refine 0 or 1", rsn[0] + rsn[1] + ",1," + rsn[2] + rsn[3] + "/SoftPlaylists,1").replace(/^[,\s]+|[,\s]+$/g, "").split(",");
    if (refine[0] != rsn[0] + rsn[1] || refine[2] != rsn[2] + rsn[3] + "/SoftPlaylists") {window.SetProperty("ADV.Feed Refine 0 or 1",  rsn[0] + rsn[1] + ","  + refine[1] + "," + rsn[2] + rsn[3] + "/SoftPlaylists," + refine[3]);}
    this.refine_iS = 0; if (refine[3] != 0) this.refine_iS = 1; this.refine_lfm = 0; if (refine[1] != 0) this.refine_lfm = 1;
    this.filter_yt = function(title, descr) {try {if (title && (RegExp(youtube_title_filter, "i")).test(title)) return true; if (descr && (RegExp(youtube_descr_filter, "i")).test(descr)) return true; return false;} catch (e) {p.trace("Syntax error in custom regular expression. Panel Property: ADV.YouTube 'Live' Filter..."); return false;}}
    this.pref_yt = function(kw, n) {try {if (n && (RegExp(kw, "i")).test(n)) return true; return false;} catch (e) {p.trace("Syntax error in custom regular expression. Panel Property: ADV.YouTube 'Preference'..."); return false;}}
    this.genre_tracks = window.GetProperty("SYSTEM.Genre Tracks", true);
    this.lfm_variety = window.GetProperty("SYSTEM.Artist Variety Lfm", 50);
    var preset = window.GetProperty(" Radio TopTracks Feed Size: Artist 5'Hot'-1000","Highly Popular,25,Popular,50,Normal,75,Varied,100,Diverse,150,Highly Diverse,200").replace(/^[,\s]+|[,\s]+$/g, "");
    var tag_feed = window.GetProperty(" Radio TopTracks Feed Size: Genre/Tag", "Artist Values Multiplied By,10").replace(/^[,\s]+|[,\s]+$/g, "").split(","); if (!tag_feed.length) tag_feed.push(500);
    if (!window.GetProperty("SYSTEM.Similar Songs Reset")) {window.SetProperty(" Radio TopTracks Feed Size: Similar Songs", "Artist Values Multiplied By,2.5"); window.SetProperty("SYSTEM.Similar Songs Reset", true);}
    var song_feed = window.GetProperty(" Radio TopTracks Feed Size: Similar Songs", "Artist Values Multiplied By,2.5").replace(/^[,\s]+|[,\s]+$/g, "").split(","); if (!song_feed.length) song_feed.push(250);
    var p_name = preset.split(","); this.pool = [] ;this.preset = [];
    for (var i = 0; i < p_name.length; i += 2) this.preset.push(p_name[i]); preset = preset.replace(/\s+/g, "").split(",");
    for (var i = 1; i < preset.length; i += 2) this.pool.push(Math.max(parseFloat(preset[i]), 5)); if (!this.pool.length) this.pool.push(50)
    this.mode = window.GetProperty("SYSTEM.Radio Mode", 1); if (!p.use_saved || !p.ec_saved) this.mode = Math.max(this.mode, 1);
    this.n = ["Echonest", rsn[0], rsn[2], rsn[4]]; this.s = [" Radio", rsn[1], rsn[3], rsn[5], rsn[7]];
    this.rad_ec_variety = window.GetProperty("SYSTEM.RAD.Artist Variety Ec", 50); // RAD are for last opened radio; other are menu settings
    this.rad_lfm_variety = window.GetProperty("SYSTEM.RAD.Artist Variety Lfm", 50);
    this.rad_mode = window.GetProperty("SYSTEM.RAD.Mode", 1); if (!p.use_saved || !p.ec_saved) this.rad_mode = Math.max(this.rad_mode, 1);
    this.rad_query = window.GetProperty("SYSTEM.RAD.Query", false);
    this.rad_range = window.GetProperty("SYSTEM.RAD.Range", 1);
    if (this.rad_range > this.pool.length - 1 || this.rad_range < 0) {this.rad_range = 0; window.SetProperty("SYSTEM.RAD.Range", this.rad_range);}
    this.rad_source = window.GetProperty("SYSTEM.RAD.Source", "N/A");
    this.rad_type = window.GetProperty("SYSTEM.RAD.Type", 2); pop2 = weight[this.rad_type][this.rad_mode - 1];
    if (this.mode == 3 && this.rad_query) pop2 = weight[5][2]; pop1 = 1 - pop2;
    this.random_artist = window.GetProperty("SYSTEM.Artists: Random Pick", false);
    this.range = window.GetProperty("SYSTEM.Range", 1);
    if (this.range > this.pool.length - 1 || this.range < 0) {this.range = 0; window.SetProperty("SYSTEM.Range", this.range);}
    this.rem_played = window.GetProperty("SYSTEM.Remove Played", true);
    this.softplaylist = window.GetProperty("SYSTEM.Softplaylist Create", false);
    this.track_count = window.GetProperty("SYSTEM.Track Count", 0);
    this.yt_filter = window.GetProperty(" YouTube 'Live' Filter", true);
    var yt_pref = window.GetProperty("ADV.YouTube 'Preference' Filter 0 or 1 Check:", "Uploader,0,Title,0,Description,0").replace(/\s+/g, "").split(","); this.chk_upl = parseFloat(yt_pref[1]); if (isNaN(this.chk_upl)) this.chk_upl = 1; if (this.chk_upl !== 1 && this.chk_upl !== 0) this.chk_upl = 1; this.chk_title = parseFloat(yt_pref[3]); if (isNaN(this.chk_title)) this.chk_title = 1; if (this.chk_title !== 1 && this.chk_title !== 0) this.chk_title = 1; this.chk_descr = parseFloat(yt_pref[5]); if (isNaN(this.chk_descr)) this.chk_descr = 1; if (this.chk_descr !== 1 && this.chk_descr !== 0) this.chk_descr = 1; this.yt_pref = this.chk_upl || this.chk_title || this.chk_descr;
    this.arr_contains = function(arr, item) {for (var i = 0; i < arr.length; i++) if (arr[i] == item) return true; return false;}
    this.arr_count = function(list, threshold, length) {var count = 0; length = Math.min(list.length, length); for (var i = 0; i < length; ++i) if (list[i].playcount > threshold) count++; return count;}
    this.reset_add_loc = function(p_t50) {if (!p_t50) {p.add_loc = []; p.loc_ix = 0; yt_rad.rec = 0;} else {p.t50_loc = []; p.t50_ix = 0; yt_rad.t50 = 0;}}

    this.get_range = function (rt, r) {
        r = Math.max(Math.min(r, this.pool.length - 1), 0); var range = 50, sw = this.pool[r] < 51 ? 0 : this.pool[r] < 100 ? 1 : 2;
        if (rt != 1 && rt != 3) {range = rt ? this.pool[r] : Math.max(this.pool[r], 50); if (isNaN(range)) range = 50; range = Math.min(range, 1000);}
        else if (rt == 1) {range = this.pool[r] * tag_feed[1]; range = Math.max(Math.min(range, 1000), 10); if (isNaN(range)) range = 500;}
        else {range = this.pool[r] * song_feed[1]; range = Math.max(Math.min(range, 250), 10); if (isNaN(range)) range = 250;}
        return range;
    }

    this.get_radio = function(rs, rm, rt, rv, rr, rf, rq) {
        if (rq && rm != 3) {rm = 3; this.mode = 3; window.SetProperty("SYSTEM.Radio Mode", 3);}
        rad.text = "Searching...\n For " + (!this.softplaylist ? "Radio": "Radio / Soft Playlist"); t.repaint();
        var load_timer = false; rad.bypass_read_file = false; rad_found = false; rad.read_file = false; rad.search = true; this.rad_source = rs; this.rad_mode = rm; rad.sync = false; this.rad_query = rq; this.rad_type = rt;
        this.rad_range = Math.max(Math.min(rr, this.pool.length - 1), 0); rm ? this.rad_lfm_variety = rv : this.rad_ec_variety = rv;
        if (!load_timer) load_timer = window.SetTimeout(function() {index.load(rs, rm, rt, rv, rr, rf, rq); load_timer = false;}, 200); this.track_count = 0; // delay improves feedback
    }

    this.radio_found = function(p_q) {
        if (rad_found) return; rad_found = true; ct = 0;
        if (rad.search) {played_artist_arr = []; played_track_arr = []; window.SetProperty("SYSTEM.Radio Played Artists", JSON.stringify(played_artist_arr)); window.SetProperty("SYSTEM.Radio Played Tracks", JSON.stringify(played_track_arr));}
        pll = 0; pop2 = !p_q ? weight[this.rad_type][this.rad_mode - 1] : weight[5][2]; pop1 = 1 - pop2; rad.list = []; rad.param = false;
        window.SetProperty("SYSTEM.RAD.Source", this.rad_source);
        window.SetProperty("SYSTEM.RAD.Type", this.rad_type);
        this.rad_mode ? window.SetProperty("SYSTEM.RAD.Artist Variety Lfm", this.rad_lfm_variety) : window.SetProperty("SYSTEM.RAD.Artist Variety Ec", this.rad_ec_variety);
        window.SetProperty("SYSTEM.RAD.Mode", this.rad_mode);
        window.SetProperty("SYSTEM.RAD.Query", p_q);
        window.SetProperty("SYSTEM.RAD.Range", this.rad_range);
    }

    this.load = function(rs, rm, rt, rv, rr, rf, rq) {
        if (rm == 3 && rad.filterID) p.trace(this.n[rm] + this.s[rm] + ": " + "Library Filter Applied: " + rad.filter[rad.filterID]);
        if (rm < 2 || (rt == 2 || rt == 4)) {rad.search_for_artist(rs, rm, rt, rv, rm ? this.get_range(rt, rr) : "", rt != 1 && rt != 3 && this.get_range(rt, rr) < 101 && this.curr_pop ? true : false, rf);
            if (rm > 1 && rt == 4) p.trace(this.n[rm] + this.s[rm] + ": " + (rm == 2 ? "Filtered Library for Tracks in Last.fm Top Tracks Lists for Top \"" + rs  + "\" Artists" : "Last.fm Top \"" + rs  + "\" Artists: Pool: Matching Library Tracks") + "\nRadio Independent of Genre Tag in Music Files");
            if (rm > 1 && rt == 2) p.trace(this.n[rm] + this.s[rm] + ": " + (rm == 2 ? "Filtered Library for Tracks in Last.fm Top Tracks Lists for \""  : "Pool: Library Tracks for \"") + rs + " and Similar Artists\"");
        } else if (rt < 2 || rt == 3) {rad.med_lib_radio("", rs, rm, rt, "N/A", rm == 1 ? "" : this.get_range(rt, rr), rq); p.trace(this.n[rm] + this.s[rm] + ": " + (rm == 2 ? "Filtered Library for Tracks in Last.fm Top Track List for \"" + rs + "\"" + (rt == 1 ? "\nRadio Independent of Genre Tag in Music Files" : "") : (!rq ? (rt == 0 ? "Artist" : "Genre") + " IS " + rs : "Query: " + rs) + ": Pool: Matching Library Tracks"));}
    }

    this.artist = function(length) {
        if (!length) return 0; var a_ind =  0;
        if (played_artist_arr.length != 0 || this.rad_type == 4) {
            var r = Math.random();
            if (this.random_artist)  a_ind = this.pop(0, "", length -= 1, 3, 0) + 1;
            else if (this.arr_contains(played_artist_arr, 0) || r > (this.rad_lfm_variety * -0.13 + 19.5) / 100) a_ind = this.pop(0, "", length -= 1, 2, 0) + 1;
        }
        played_artist_arr.push(a_ind); if (played_artist_arr.length > 6) played_artist_arr.splice(0, 1); window.SetProperty("SYSTEM.Radio Played Artists", JSON.stringify(played_artist_arr)); return a_ind;
    }

    this.genre = function(length, list, rad_lib) {
        if (!length) return; var g_ind = this.pop(rad_lib, list, length, 1, 0);
        played_track_arr.push(g_ind); if (played_track_arr.length > length - 1) played_track_arr.splice(0, 1); window.SetProperty("SYSTEM.Radio Played Tracks", JSON.stringify(played_track_arr));
        if (!rad_lib) {played_artist_arr.push(list[g_ind].artist.strip()); if (played_artist_arr.length > 6) played_artist_arr.splice(0, 1); window.SetProperty("SYSTEM.Radio Played Artists", JSON.stringify(played_artist_arr));} return g_ind;
    }

    this.track = function(list, artist, name, rm, curr) {
        if (!list.length) return 0; var extend = false, extend_pool = this.pool[this.rad_range], filter_pool = 0, h_ind = 0, min_pool = extend_pool * (extend_pool < 251 ? 0.15 : 0.12), pool = 0, pc_adjust = curr ? pc_curr_adjust : pc_at_adjust, sw = extend_pool < 51 ? 0 : extend_pool < 100 ? 1 : 2, threshold = 1000 * pc_adjust / extend_pool * 1000 / 6, min_filter = threshold * 0.3; /*calc before higher hot values*/ if (extend_pool < 100) threshold = Math.min(threshold * 2.25 * (100 - extend_pool) / 25, 15000 * pc_adjust); min_pool = Math.floor(sw == 1 ? min_pool - 1 : extend_pool > 149 ? Math.max(min_pool, 25) : min_pool); var h_factor = Math.max(4 * min_pool / 7, 3); /*calc before min value set*/ if (min_pool < 7) min_pool = Math.min(extend_pool, 7); var seed_pool = Math.floor(min_pool * (extend_pool < 126 ? 3 : 2.5));
        if (rm != 2 || !artist) {if (sw) extend = Math.random() < 0.6 ? false : true;} else extend = true; var max_pool = Math.min(sw == 0 ? extend_pool : extend ? extend_pool : sw == 1 ?  50 : Math.round(extend_pool / 2), list.length);
        if (artist && played_track_arr.length > Math.min(Math.floor(list.length * 0.9), 100)) {played_track_arr = []; window.SetProperty("SYSTEM.Radio Played Tracks", JSON.stringify(played_track_arr));}
        if (rm == 1 && this.refine_lfm || rm == 2) {
            threshold +=  Math.floor(threshold * 2 / 3 * Math.random()); if (extend) threshold /= sw == 1 ? 1.5 : 2;
            if (this.rad_source == name) {min_pool = this.arr_count(list, min_filter * (extend_pool < 101 ? 0.85 : 1), max_pool) > seed_pool ? Math.max(seed_pool, 50) : Math.min(seed_pool, 50); filter = Infinity;}
            else {
                var filter = Math.max(list.length > 2 ? (parseFloat(list[0].playcount) + parseFloat(list[1].playcount) + parseFloat(list[2].playcount)) / (h_factor * 3) : parseFloat(list[0].playcount) / h_factor);
                filter = !artist ? Math.max(min_filter, filter) : Math.min(min_filter * (extend_pool < 101 ? 0.65 : 0.75), filter);
                if (artist && !this.track_count && rm == 1) {this.track_count = Math.max(this.arr_count(list, filter, extend_pool), 50); window.SetProperty("SYSTEM.Track Count", this.track_count);}
            }
            filter = Math.min(threshold, rm == 2 && !artist && filter * h_factor < threshold ? Infinity : filter); pool = this.arr_count(list, filter, max_pool); pool = Math.max(Math.min(min_pool, list.length), pool); if (artist) pool = Math.max(pool, 50);
            if (!artist && rm == 1) {pll = pool + pll; ct++; if (!this.track_count) this.track_count = Math.round(extend_pool * this.rad_lfm_variety / 2); else if (!(ct % rad.limit) || !rad.limit && ct > 1) this.track_count = Math.round(pll * this.rad_lfm_variety / ct); window.SetProperty("SYSTEM.Track Count", this.track_count); t.repaint();}
        } else {pool = Math.min(max_pool, list.length); if (!this.track_count && rm == 1) {if (!artist) this.track_count = Math.round(extend_pool * this.rad_lfm_variety); else this.track_count = Math.min(extend_pool, list.length); window.SetProperty("SYSTEM.Track Count", this.track_count);}}
        if (rm == 2) return pool;
        h_ind = this.pop(0, list, Math.min(list.length, pool), 0, 1);
        if (!artist && this.arr_contains(played_track_arr, list[h_ind].title.strip()) || this.xmas_song(list[h_ind].title)) h_ind = this.pop(0, list, Math.min(list.length, max_pool), 0, 2); // fallback
        played_track_arr.push(list[h_ind].title.strip()); if (played_track_arr.length > 100) played_track_arr.splice(0, 1); window.SetProperty("SYSTEM.Radio Played Tracks", JSON.stringify(played_track_arr)); return h_ind;
    }

    this.load_lfm_sel = function(list, p_rt, lic) {
        var l = list.length; if (l < this.limit + 2) return; var valid_fl = p.expired(rad.f2 + "l\\" + "Last iSelect Radio.json", 120000), h_ind, no = rad.get_no(rad.limit, plman.PlaylistItemCount(pl.rad));
        var handles = fb.CreateHandleList(), item = fb.CreateHandleList(), pn = pl.rad;
        for (var i = 0; i < no; i++) {
            h_ind = p_rt != 1 && p_rt != 3 ? this.pop(1, list, l, p_rt ? 1 : 0, 1) : this.genre(l, list, 1);
            if (rad.read_file && !p.file(list[h_ind].path) && valid_fl) {rad.list = false; rad.bypass_read_file = true; return rad.on_playback_new_track();}
            if (!rad.read_file) {if (!lic || !lic.Count) return; handles.Add(lic.Item(list[h_ind].id));}
            else {try {item = fb.GetQueryItems(lib.get_lib_items(), "(%path% IS " +  list[h_ind].path + ") OR (\"$replace($info(@REFERENCED_FILE),file:'//',)\" IS " + list[h_ind].path + ")")} catch (e) {}; if (item.Count) handles.Add(item.Item(0));}
            if (l) {played_artist_arr.push(list[h_ind].artist.strip()); if (played_artist_arr.length > 6) played_artist_arr.splice(0, 1); window.SetProperty("SYSTEM.Radio Played Artists", JSON.stringify(played_artist_arr));} if (l && p_rt != 1 && p_rt != 3) {played_track_arr.push(list[h_ind].title); if (played_track_arr.length > Math.floor(l * 0.9)) played_track_arr = []; window.SetProperty("SYSTEM.Radio Played Tracks", JSON.stringify(played_track_arr));}
        } if (handles.Count) plman.InsertPlaylistItems(pn, plman.PlaylistItemCount(pn), handles); if (handles) handles.Dispose(); if (item) item.Dispose();
    }

    this.load_my_sel = function(list, p_rt) {
        var l = list.Count; if (l < this.limit + 2) return; var h_ind, handles = fb.CreateHandleList(), pn = pl.rad, no = rad.get_no(rad.limit, plman.PlaylistItemCount(pn));
        for (var i = 0; i < no; i++) {
            h_ind = this.pop(2, list, l, p_rt ? 1 : 0, 0); handles.Add(list.Item(h_ind));
            if (l) {played_artist_arr.push(tf.a0.EvalWithMetadb(list.Item(h_ind)).strip()); played_track_arr.push(tf.t0.EvalWithMetadb(list.Item(h_ind)).strip()); if (played_artist_arr.length > 6) played_artist_arr.splice(0, 1); window.SetProperty("SYSTEM.Radio Played Artists", JSON.stringify(played_artist_arr)); if (played_track_arr.length > Math.floor(l * 0.9)) played_track_arr = []; window.SetProperty("SYSTEM.Radio Played Tracks", JSON.stringify(played_track_arr));}
        } if (handles.Count) plman.InsertPlaylistItems(pn, plman.PlaylistItemCount(pn), handles); if (handles) handles.Dispose();
    }

    this.pop = function(rad_lib, list, l, ar, ti) {
        var ind = Math.floor(l * Math.random()), j = 0, pp1 = rad_lib || ar < 2 ? pop1 : 0.8, pp2 = rad_lib || ar < 2 ? pop2 : 0.2;
        switch (rad_lib) {
            case 0: while (((pp1 > 0.1 && ar != 3 ? ((((1 - ind / l) * pp1 + pp2) + Math.random()) <= 1) : false) || (ar ? this.arr_contains(played_artist_arr, ar > 1 ? ind + 1 : list[ind].artist.strip()) : false) || (ar < 2 ? this.xmas_song(list[ind].title) : false) || (ar < 2 && ti < 2 ? this.arr_contains(played_track_arr, ti ? list[ind].title.strip() : ind) : false)) && j < l) {ind = Math.floor(l * Math.random()); j++;} break;
            case 1: while (((pp1 > 0.1 ? ((((1 - ind / l) * pp1 + pp2) + Math.random()) <= 1) : false) || (ar ? this.arr_contains(played_artist_arr, list[ind].artist.strip()) : false) || this.xmas_song(list[ind].title) || this.arr_contains(played_track_arr, ti ? list[ind].title : ind)) && j < l) {ind = Math.floor(l * Math.random()); j++;} break; // <-title already stripped
            case 2: while (((pp1 > 0.1 ? ((((1 - ind / l) * pp1 + pp2) + Math.random()) <= 1) : false) || (ar ? this.arr_contains(played_artist_arr, tf.a0.EvalWithMetadb(list.Item(ind)).strip()) : false) || this.xmas_song(tf.t0.EvalWithMetadb(list.Item(ind))) || this.arr_contains(played_track_arr, tf.t0.EvalWithMetadb(list.Item(ind)).strip())) && j < l) {ind = Math.floor(l * Math.random()); j++;} break;
        } return ind;
    }

    this.xmas_song = function(title) {
        try {var kw = "christmas|xmas|(?=.*herald)\\bhark|mary's\\s*boy|santa\\s*baby|santa\\s*claus";
            var d = new Date(), n = d.getMonth();
            if (n == 11 || (RegExp(kw, "i")).test(this.rad_source)) return false;
            else if (!(RegExp(kw, "i")).test(title)) return false;
            else return true;} catch (e) {}
    }

    this.best_saved_match = function(source, radtype) {
        var all_files = [], fa, rs = source.clean(), fp = rad.e1 + rs.substr(0, 1).toLowerCase() + "\\" + rs + (radtype == 2 ? " And Similar Artists\\" : radtype == 3 ? " [Similar Songs]\\" : "\\");
        if (p.folder(fp)) for (var k = this.ec_variety / 10; k < 11; k++) {fa = fp + "\\" + (radtype == 0 ? "" : k * 10 + "\\"); if (p.folder(fa)) all_files = utils.Glob(fa + "\\*").toArray(); if (all_files.length) break;}
        if (p.folder(fp) && !p.folder(fa)) for (var k = this.ec_variety / 10 - 1; k >= 0; k--) {fa = fp + "\\" + (radtype == 0 ? "" : k * 10 + "\\"); if (p.folder(fa)) all_files = utils.Glob(fa + "\\*").toArray(); if (all_files.length) break;}
        return all_files;
    }
}
var index = new new_radio();

function radio_manager() {
    var art_variety = !index.rad_mode ? index.rad_ec_variety : index.rad_type == 2 || index.rad_type == 4 ? index.rad_lfm_variety : "N/A", curr_pop = index.curr_pop, finished = false, list = [], li = fb.CreateHandleList(), li_c = fb.CreateHandleList(), rad_fav, rad_mode = index.rad_mode, rad_query = index.rad_query, rad_source = index.rad_source, rad_type = index.rad_type, radio_timer = false, sim1_set = false, song_hot = index.rad_mode ? index.get_range(rad_type, index.rad_range) : "", text_h = 0, text_y = 0, text_type = window.GetProperty("SYSTEM.Text Type", true), text_o, top_50 = 1, update_fav = true;
    var f_s = 36, font_h = 44, font_s = f_s, nowp_f = window.GetProperty(" Nowplaying Font (Name,Size,Style[0-4])", "Calibri,36,1").replace(/^[,\s]+|[,\s]+$/g, "").split(","), np_n = "Calibri", np_s = 1, np_text = window.GetProperty(" Titleformat Nowplaying", "[%artist%]$crlf()[%title%]"), np_sh = window.GetProperty(" Nowplaying Text Shadow Effect", true), part_load = false, rad_id = 0;
    try {f_s = Math.round(parseFloat(nowp_f[1])); font_s = f_s; np_n = nowp_f[0]; np_s = Math.round(parseFloat(nowp_f[2])); var  np_f = gdi.Font(np_n, f_s, np_s), np_l = np_f; np_f.Name; np_f.Size; np_f.Style;} catch (e) {np_n = "Segoe UI"; f_s = 16; np_s = 0; np_f = gdi.Font(np_n, f_s, np_s); font_s = f_s; np_l = np_f; p.trace("JScript panel is unable to use your nowplaying font. Using Segoe UI at default size & style instead");}
    var iSelect_timeout = 120000; try {var iS_timeout = window.GetProperty("ADV.Radio Search Timeout (secs >=30)", index.n[2] + ",120").replace(/^[,\s]+|[,\s]+$/g, "").split(","); if (iS_timeout[0] != index.n[2]) window.SetProperty("ADV.Radio Search Timeout (secs >=30)", index.n[2] + "," + iS_timeout[1]); iSelect_timeout = Math.max(iS_timeout[1] * 1000, 30000); if (isNaN(iSelect_timeout)) iSelect_timeout = 120000;} catch (e) {} if (!p.v) {this.limit = Math.min(window.GetProperty(" Radio Playlist Track Limit 2-25", 5), 25); window.SetProperty(" Radio Playlist Track Limit 2+", null);} else {window.SetProperty(" Radio Playlist Track Limit 2-25", null); this.limit = window.GetProperty(" Radio Playlist Track Limit 2+", 5);}
    this.auto = window.GetProperty("SYSTEM.Auto Radio", true); this.bypass_read_file = false; this.force_refresh = 0; this.full = window.GetProperty("SYSTEM.Image Full", false); if (this.full) p.rel_imgs = 1;
    if (!index.rem_played) this.limit = 0; this.list_index = 0; this.list = false; this.list_type = false; this.param = false; this.read_file = false; this.text = ""; this.search; this.sync = false; this.t50_array = [];
    var calc_text = function(f) {var i = gdi.CreateImage(1, 1), g = i.GetGraphics(); font_h = Math.round(g.CalcTextHeight("String", f)); i.ReleaseGraphics(g); i.Dispose();}
    var create_softplaylist = function(list, p_rs, p_rt) {try {var handles = fb.CreateHandleList(), pln = plman.FindOrCreatePlaylist("'" + p_rs + (p_rt == 2 ? " Similar Artists" : "") + "' " + pl.soft_playlist, false); for (var i = 0; i < list.length; i++) handles.Add(li.Item(list[i].id)); plman.ClearPlaylist(pln); plman.InsertPlaylistItems(pln, 0, handles, false); if (index.activate) plman.ActivePlaylist = pln; if (handles) handles.Dispose();} catch (e) {p.trace("Unable to Create Soft Playlist");}}
    this.feedback = function() {if (this.text == text_o) return; t.repaint(); this.search = false; text_o = this.text; if (fav.auto && update_fav) fav.add_current_station(rad_source); update_fav = false;}
    this.cancel_iSelect = function() {add_loc(rad_mode, rad_type, true, 1, false, false); finished = true; timer.reset(timer.sim1, timer.sim1i); timer.reset(timer.sim2, timer.sim2i); timer.reset(timer.yt, timer.yti); on_dld_radio_tracks_done(false, "", 0, "", "", "", true);}
    if (!window.GetProperty("SYSTEM.Library Check", false)) {var db_lib = fb.GetLibraryItems(); try {var db_pl = fb.GetQueryItems(db_lib, "%play_count% GREATER 4").Count;} catch (e) {var db_pl = 0} try {var db_r = fb.GetQueryItems(db_lib, (p.use_local ? "%_autorating%" : "%rating%") + " GREATER 1").Count;} catch (e) {var db_r = 0} if (db_r < 5000 || db_r / db_lib.Count < 0.2) db_r = 0; if (db_pl < 5000 || db_pl / db_lib.Count < 0.2) db_pl = 0; window.SetProperty("SYSTEM.Library Filter MySelect ID", db_pl || db_r  ? db_r > db_pl ? 1 : 2 : 0);} window.SetProperty("SYSTEM.Library Check", true);
    var filter = window.GetProperty("ADV.Library Filters MySelect (| Separator)", "%rating% GREATER 1 | %play_count% GREATER 4").split("|"); filter.unshift("None");
    this.filter = []; for (var r = 0; r < filter.length; r++) {var fil = p.use_local ? filter[r].replace("%rating%", "%_autorating%").trim() : filter[r].trim(); if (fil.length) this.filter.push(fil);}
    this.filterID = window.GetProperty("SYSTEM.Library Filter MySelect ID", 0); if (this.filterID > this.filter.length - 1) {this.filterID = 0; window.SetProperty("SYSTEM.Library Filter MySelect ID", 0);}
    this.get_no = function(rad_limit, rad_pl_count) {if (rad_limit && rad_pl_count >= rad_limit) return 0; else return rad_limit ? rad_limit - rad_pl_count : 1;}
    this.mbtn_up = function(x, y, n) {if (alb.show || t.halt() || !p.np_graphic || x < 0 || y < 0 || x > p.w || y > p.h) return; var np_txt = n ? n == 1 ? true : false : !but.btns["yt"].trace(x, y); if (np_txt) {this.full = !this.full; p.rel_imgs = this.full ? 1 : window.GetProperty(" Image Size 0-1"); window.SetProperty("SYSTEM.Image Full", this.full); img.on_size(); this.on_size(); if (p.video_mode && this.pss) {this.force_refresh = 2; this.refreshPSS();} but.refresh(true);} else {if (p.f_yt_ok) {p.video_mode = !p.video_mode; video_set_up(); p.set_video(); timer.reset(timer.vid, timer.vidi); if (p.video_mode && !alb.show && p.IsVideo()) timer.video();} video_set_up(); if (ui.blur) img.on_size(); if (img.artistart && p.cycle_art_img) timer.image(); else timer.reset(timer.img, timer.imgi); but.refresh();  if (this.pss) {this.force_refresh = 2; this.refreshPSS();} t.paint(); window.SetProperty("SYSTEM.Nowplaying Prefer Video Mode", p.video_mode);}}
    this.on = function() {return this.auto && plman.ActivePlaylist == pl.rad}
    this.on_playback_new_track = function() {if (!this.auto || plman.PlayingPlaylist != pl.rad || !rad_source) return; this.dld_new_track(); timer.rad_chk = true;}
    this.on_size = function() {font_s = Math.max(Math.min(f_s, f_s / 36 * p.h * (1 - p.rel_imgs) / 3), 1); np_f = gdi.Font(np_n, font_s, np_s); np_l = gdi.Font(np_n, Math.max(Math.min(p.w > 1000 ? 45 * f_s / 38 : 43 * f_s / 38, p.h / 4), 1), np_s); if (!p.np_graphic) return; if (p.text_auto) {text_y = Math.min(p.h * p.rel_imgs, p.h - img.ny); text_h = Math.max(img.ny, p.h * (1 - p.rel_imgs));} else {calc_text(np_f); text_h = Math.max(font_h * 2, 1); Math.max(text_y = p.h - text_h, 0);}}
    this.pss = !ui.dui && window.IsTransparent && utils.CheckComponent("foo_uie_panel_splitter", true);
    this.refreshPSS = function() {if (this.force_refresh != 2 || !this.pss) return; if (fb.IsPlaying || fb.IsPaused) {fb.Pause(); fb.Pause();} else {fb.Play(); fb.Stop();} this.force_refresh = 0;}
    this.reset_t50 = function(p_top50) {this.search = true; this.t50_array = []; text_o = ""; this.text = "Searching...\n For " + (p_top50 == 3 ? "Top40" : "Top" + pl.top50); rad_fav = false; t.repaint();}
    this.set_auto_dld = function(b_auto) {this.auto = b_auto; window.SetProperty("SYSTEM.Auto Radio", this.auto);}
    this.set_rad_selection = function(pn) {var np = plman.GetPlayingItemLocation(), pid = 0; if (plman.PlayingPlaylist == pn && np.IsValid) pid = np.PlaylistItemIndex; plman.SetPlaylistFocusItem(pn, pid); plman.ClearPlaylistSelection(pn); plman.SetPlaylistSelectionSingle(pn, pid, true);}
    this.set_t50_selection = function(pn) {if (plman.PlaylistItemCount(pn) < (top_50 != 3 ? Math.floor(this.t50 * 0.96) : 38)) return; plman.SetPlaylistFocusItem(pn, 0); plman.ClearPlaylistSelection(pn);}
    this.text_toggle = function() {text_type = !text_type; window.SetProperty("SYSTEM.Text Type", text_type); this.refreshPSS();}
    this.toggle_auto = function() {this.auto = !this.auto; window.SetProperty("SYSTEM.Auto Radio", this.auto);}

    this.remove_played = function() {
        if (plman.PlayingPlaylist != pl.rad) return;
        var np = plman.GetPlayingItemLocation(), pn_r = pl.rad;
        if (np.IsValid) {var pid = np.PlaylistItemIndex; if (save_pl.rad) {plman.SetPlaylistSelectionSingle(pn_r, pid, true); pl.save_radio(pn_r, plman.GetPlaylistSelectedItems(pn_r));}}
        if (!this.auto || !this.limit || plman.PlayingPlaylist != pl.rad) return;
        if (plman.PlaylistItemCount(pn_r) > this.limit - 1) {if (np.IsValid) {plman.ClearPlaylistSelection(pn_r); for (var i = 0; i < pid; i++) plman.SetPlaylistSelectionSingle(pn_r, i, true); plman.RemovePlaylistSelection(pn_r, false);}}
    }

    this.dld_new_track = function() {
        var get_list = !this.list && this.get_no(this.limit, plman.PlaylistItemCount(pl.rad)), load_timer = false;
        if (rad_mode == 2 && get_list) {
            if(!this.bypass_read_file) {
                var fl = this.f2 + "l\\" + "Last iSelect Radio.json"; this.read_file = false; this.bypass_read_file = false;
                if (p.file(fl)) {
                    var p_add_loc = p.json_parse(utils.ReadTextFile(fl));
                    if (p_add_loc && p_add_loc[0].radio == rad_source + "_" + (rad_type == 4 ? 2 : rad_type)) {
                        p_add_loc.shift(); if (p_add_loc.length > this.limit + 1) {this.read_file = true; this.list = p_add_loc; index.load_lfm_sel(this.list, rad_type); index.track_count = this.list.length; window.SetProperty("SYSTEM.Track Count", index.track_count); return;}
                    }
                }
            }
            this.search = true; this.bypass_read_file = false; this.read_file = false; this.text = index.n[2] + index.s[2] + "\nSynchronising with Library..."; t.repaint();
        }
        if (!load_timer) load_timer = window.SetTimeout(function() {rad.load(get_list); load_timer = false;}, 300); // delay improves feedback
    }

    this.load = function(get_list) {
        if (get_list) this.sync = true;
        if (rad_mode > 1) {
            if (get_list) {
                if (rad_type == 2 || rad_type == 4) {return this.search_for_artist(rad_source, rad_mode, rad_type, art_variety, song_hot, rad_type != 1 && rad_type != 3 && song_hot < 101 && curr_pop ? true : false);
                } else return this.med_lib_radio("", rad_source, rad_mode, rad_type, "N/A", song_hot, rad_query);
            } else return rad_mode == 2 ? index.load_lfm_sel(this.list, rad_type, li_c) : index.load_my_sel(this.list, rad_type);
        }
        if (!rad_mode ? (this.list_index + 1 > (this.list.length - (this.limit ? this.limit : 1)) || get_list) : get_list)
            this.search_for_artist(rad_source, rad_mode, rad_type, art_variety, song_hot, rad_type != 1 && rad_type != 3 && song_hot < 101 && curr_pop ? true : false);
        else this.dld_next_track();
    }

    this.search_for_artist = function(p_rad_source, p_rad_mode, p_rad_type, p_art_variety, p_song_hot, p_curr_pop, p_rad_fav) {
        rad_source = p_rad_source; rad_mode = p_rad_mode; rad_type = p_rad_type; art_variety = p_art_variety; song_hot = p_song_hot; rad_fav = p_rad_fav; curr_pop = p_curr_pop;
        if (!rad_source || rad_source == "N/A") return on_dld_radio_tracks_done(false);
        yt_rad.Execute(on_dld_radio_tracks_done, rad_source, rad_mode, rad_type, art_variety, song_hot, this.limit, curr_pop, "", pl.rad);
    }

    this.search_for_top50 = function(p_search, p_top50, p_pn) {
        if (!p_search.length || p_search == "N/A" || p_top50 < 1 || p_top50 > 3) return on_dld_radio_tracks_done(false, "", p_top50); var sz = [100, Math.min(pl.top50 * 1.5, 1000), Math.min(pl.top50 * 1.5, 250), 40];
        yt_rad.Execute(on_dld_radio_tracks_done, p_search, rad_mode, p_top50 == 1 ? 0 : 3, art_variety, sz[p_top50], this.limit, false, p_top50, p_pn);
    }

    this.get_top50 = function(n, p_top50) {
        this.reset_t50(p_top50); if (!n) return on_dld_radio_tracks_done(false, "", p_top50); top_50 = p_top50; var pn_50, sav_t50 = p_top50 == 1 ? save_pl.t50 : p_top50 == 2 ? save_pl.songs : save_pl.chart;
        if (pl.exist(n, sav_t50, p_top50 == 3)) {pn_50 = plman.ActivePlaylist = pl.t50(n, sav_t50, p_top50 == 3); if (plman.PlaylistItemCount(pn_50)) return on_dld_radio_tracks_done(true, "", p_top50);}
        pn_50 = pl.t50(n, sav_t50, p_top50 == 3); if (!sav_t50) {plman.ActivePlaylist = pn_50; plman.ClearPlaylist(plman.ActivePlaylist);}; this.search_for_top50(n, p_top50, pn_50);
    }

    this.refresh_top50 = function(pl_active) {
        top_50 = pl_active.indexOf("Singles Chart") != -1 ? 3 :pl_active.indexOf(" | ") == -1 ? 1 : 2; this.reset_t50(top_50);
        var sav_t50 = top_50 == 1 ? save_pl.t50 : top_50 == 2 ? save_pl.songs : save_pl.chart;
        var refresh_name = top_50 != 3 ? (pl_active.indexOf(pl.t50_playlist + ": ") == -1 ? pl_active.replace(pl.t50_playlist + " [","").slice(0, -1) : pl_active.replace(pl.t50_playlist + ": ","")) :
            (pl_active.indexOf(pl.t40_playlist + ": ") == -1 ? pl_active.replace(pl.t40_playlist + " [","").slice(0, -1) : pl_active.replace(pl.t40_playlist + ": ",""));
        plman.ClearPlaylist(plman.ActivePlaylist); this.search_for_top50(refresh_name, top_50, plman.ActivePlaylist);
    }

    this.draw = function(gr) {
        if (t.halt()) return; try {
            if ((!this.search) && this.on()) {
                if (text_type) {
                    this.text = rad_source ? (plman.PlayingPlaylist == pl.rad ? rad_source + (rad_type == 2 ?  " And Similar Artists" : "")  + "\n" : "Active Playlist" + index.s[4] + rad_source + (rad_type == 2 ?  " And Similar Artists" : "") + "\n") +
                        (index.n[rad_mode] + index.s[rad_mode] + (index.track_count ? index.s[4] + index.track_count + " Tracks" : "")) : p.eval(np_text);
                }
                else {var origT = this.text; this.text = p.eval(np_text); if (!this.text && fb.IsPlaying) this.text = origT;}
            } else if (!this.search && text_type) this.text = "Active Playlist" + "\n" + pl.active().replace(pl.alb_yttm,"");
            else if (!this.search || !this.text) this.text = p.eval(np_text);
            if (!p.np_graphic) gr.GdiDrawText(this.text, np_l, ui.textcol, 10, 10, p.w - 20, p.h - 20, t.cc);
            if (p.rel_imgs == 1 || !p.np_graphic) return; if (np_sh && (!ui.blur || !timer.transition)) gr.GdiDrawText(this.text, np_f, ui.outline(ui.textcol), 10 + 1, text_y + 1, p.w - 20, text_h, t.cc); gr.GdiDrawText(this.text, np_f, ui.textcol, 10, text_y, p.w - 20, text_h, t.cc);} catch (e) {}
    }

    var on_dld_radio_tracks_done = function(found, p_rad_mode, p_top50, p_pn, lfm_na, lib_na, cancel, p_q) {
        if (found) {
            if (p_rad_mode != 2 && !p_top50 && !rad.sync) {plman.ActivePlaylist = pl.rad; if (index.rem_played) plman.ClearPlaylist(plman.ActivePlaylist);}
            if (!p_top50) {rad.list_index = 0; text_o = ""; update_fav = true; index.radio_found(p_q);} rad.feedback();
        } else {
            if (!p_top50) {
                if (p.use_saved && p.ec_saved && rad_fav && rad_mode < 2) {rad_mode = !rad_mode ? 1 : 0; return index.get_radio(rad_source, rad_mode, rad_type, rad_mode ? index.lfm_variety : index.ec_variety, index.range, false);} // try other rad_mode if fav fails
                index.track_count = window.GetProperty("SYSTEM.Track Count");
                rad_mode = index.rad_mode = window.GetProperty("SYSTEM.RAD.Mode");
                art_variety = rad_mode ? window.GetProperty("SYSTEM.RAD.Artist Variety Lfm") : window.GetProperty("SYSTEM.RAD.Artist Variety Ec");
                rad_query = index.rad_query = window.GetProperty("SYSTEM.RAD.Query");
                rad_source = index.rad_source = window.GetProperty("SYSTEM.RAD.Source");
                rad_type = index.rad_type = window.GetProperty("SYSTEM.RAD.Type");
                song_hot = rad_mode ? index.get_range(rad_type, window.GetProperty("SYSTEM.RAD.Range")) : "";
            }
            rad.text = cancel ? index.n[2] + "\nSearch Cancelled" : "Failed To Open " + (p_top50 ? "Top " + (p_top50 != 3 ? pl.top50 : 40) + "\n" : "Radio" + (!index.softplaylist ? "" : " / SoftPlaylist") + "\n") + (p.use_saved ? "No Saved Source" : lib_na ? "Media Library N/A" : (p_rad_mode < 2 || p_top50 || lfm_na ? "Unrecognised Source or Last.fm N/A" : "Insufficient Matching Tracks In Library")); t.repaint();
            if (p_top50 && p_pn > 0) switch (p_top50) {case 1: if (save_pl.t50) plman.RemovePlaylist(p_pn); break; case 2: if (save_pl.songs) plman.RemovePlaylist(p_pn); break;}
            if (!radio_timer) {radio_timer = window.SetTimeout(function() {rad.search = false; t.repaint(); radio_timer = false;}, 5000);}
        }
    }

    this.dld_next_track = function() {
        if (!this.list.length) return;
        index.reset_add_loc();
        switch (rad_mode) {
            case 0:
                var tracks = [];
                tracks = this.list.slice(this.list_index, this.list_index + this.get_no(this.limit, plman.PlaylistItemCount(pl.rad)));
                for (var i = 0; i < tracks.length; i++) yt_rad.do_youtube_search("", tracks[i].artist, tracks[i].title, i, tracks.length, "", pl.rad);
                this.list_index = this.list_index + tracks.length;
                break;
            default:
                var tracks = this.get_no(this.limit, plman.PlaylistItemCount(pl.rad));
                switch (rad_type == 4 ? 2 : rad_type) {
                    case 0:
                        for (var i = 0; i < tracks; i++) {var t_ind = index.track(this.list, true, "", rad_mode, this.list_type); yt_rad.do_youtube_search("", this.param, this.list[t_ind].title, i, tracks, "", pl.rad);}
                        break;
                    case 1:
                    case 3:
                        for (var i = 0; i < tracks; i++) {var g_ind = index.genre(this.list.length, this.list, 0); yt_rad.do_youtube_search("", this.list[g_ind].artist, this.list[g_ind].title, i, tracks, "", pl.rad);}
                        index.track_count = this.list.length; window.SetProperty("SYSTEM.Track Count", index.track_count);
                        break;
                    case 2:
                        if (!p.use_saved)
                            for (var i = 0; i < tracks; i++) {var s_ind = index.artist(this.list.length); yt_rad.do_lfm_radio_tracks_search(rad_type != 4 ? this.list[s_ind].name : this.list[s_ind], rad_mode, rad_type == 4 ? 2 : rad_type, art_variety, song_hot, curr_pop, i, tracks, "", pl.rad);}
                        else {
                            var ft;
                            for (var l = 0; l < tracks; l++) {
                                for (var k = 0; k < this.list.length; k++) {
                                    var s_ind = index.artist(this.list.length), lp = rad_type != 4 && this.list[0].hasOwnProperty('name') ? this.list[s_ind].name.clean() : this.list[s_ind].clean();
                                    ft = this.f2 + lp.substr(0, 1).toLowerCase() + "\\" + lp + (curr_pop ? " [curr]" : "") + ".json";
                                    if (!p.file(ft)) ft = this.f2 + lp.substr(0, 1).toLowerCase() + "\\" + lp + (!curr_pop ? " [curr]" : "") + ".json";
                                    if (p.file(ft)) break;
                                }
                                if (!p.file(ft)) return on_dld_radio_tracks_done(false);
                                var data = p.json_parse(utils.ReadTextFile(ft));
                                if (!data) return on_dld_radio_tracks_done(false); var curr = ft.indexOf(" [curr]") != -1;
                                if (data[0].hasOwnProperty('artist')) data.shift();
                                for (var j = 0; j < Math.min(song_hot, data.length); j++) list[j] = {title: data[j].title.strip_remaster(), playcount: data[j].playcount}; var art_nm = p.fs.GetBaseName(ft).replace(" [curr]", "");
                                if (list.length) {p.c_sort(list); var t_ind = index.track(list, false, art_nm, rad_mode, curr); yt_rad.do_youtube_search("", art_nm, list[t_ind].title, l, tracks, "", pl.rad);}
                            }
                        }
                        break;
                }
                break;
        }
    }

    var add_loc = function(p_rs, p_rm, p_rt, sort, load, save, ended) {
        if (sort) p.c_sort(p.add_loc);
        if (p.add_loc.length > rad.limit + 1) {
            if (ended) on_dld_radio_tracks_done(true, p_rm);
            if (load) {
                if (!ended) index.radio_found(); if (li_c) li_c.Dispose(); li_c = li.clone(); rad.list = p.add_loc.slice(0); index.track_count = rad.list.length; t.repaint(); window.SetProperty("SYSTEM.Track Count",index.track_count);
                if (load == 2 || !part_load) {
                    var syn = rad.sync && plman.PlayingPlaylist == pl.rad && index.rem_played; if (syn) var np = plman.GetPlayingItemLocation();
                    if (syn && np.IsValid) {var affectedItems = [], pid = np.PlaylistItemIndex, pn = pl.rad; for (var i = pid + 1; i < plman.PlaylistItemCount(pn); i++) affectedItems.push(i); plman.ClearPlaylistSelection(pn); plman.SetPlaylistSelection(pn, affectedItems, true); plman.RemovePlaylistSelection(pn, false);}
                    else {plman.ActivePlaylist = pl.rad; if (index.rem_played) plman.ClearPlaylist(plman.ActivePlaylist);}
                    index.load_lfm_sel(rad.list, p_rt, li_c); part_load = true; rad.sync = false;
                }
            }
            if (save) {var ploc = p.add_loc.slice(0); ploc.unshift({radio:p_rs + "_" + p_rt}); p.save(rad.f2 +"l\\" + "Last iSelect Radio.json", JSON.stringify(ploc), true);}
            timer.reset(timer.sim1, timer.sim1i);
        } else if (ended) on_dld_radio_tracks_done(false); if (ended) rad.sync = false;
        if (index.softplaylist && ended && p.add_loc.length) create_softplaylist(p.add_loc.slice(0), p_rs, p_rt);
    }

    var set_text = function(p_done) {
        if (!part_load) {index.track_count = p.add_loc.length; rad.text = "Analysing Library for Last.fm Top Tracks...\nFound " + index.track_count + " Tracks" + " (" + Math.round(yt_rad.rec / p_done * 100) +"% Done)";}
        else if (index.softplaylist) {index.track_count = p.add_loc.length; rad.text = "Radio Loaded" + index.s[4] + "Soft Playlist Pending...\nFound " + index.track_count + " Tracks" + " (" + Math.round(yt_rad.rec / p_done * 100) +"% Done)";}
        else {index.track_count = p.add_loc.length; rad.search = false;} t.repaint();
    }

    this.do_lfm_lib_radio_tracks_search = function(p_artist, p_rad_mode, p_rad_type, p_art_variety, p_song_hot, p_curr_pop, p_i, p_done, p_top50, p_pn) {
        var lfm_lib_search = new lfm_radio_tracks_search(function() {lfm_lib_search.on_state_change();}, on_lfm_lib_radio_tracks_search_done);
        lfm_lib_search.Search(p_artist, p_rad_mode, p_rad_type, p_art_variety, p_song_hot, p_curr_pop, p_i, p_done, p_top50, p_pn);
    }

    var on_lfm_lib_radio_tracks_search_done = function(p_artist, p_title, p_i, p_done, p_top50, p_pn, p_rm, p_rt) {
        if (p_i != rad_id) return;
        switch (p_rt) {
            case 0:
                if (!p_artist.length || !p_title.length) return on_dld_radio_tracks_done(false, "", 0, 0, true);
                p.c_sort(p_title); var le = Math.min(song_hot, p_title.length), q = "(NOT %path% HAS !!.tags) AND (NOT \"$ext(%path%)\" IS cue) AND (", q_t = name.q_a + " IS "; if (lib.pm_art && lib.pmt[5] != 0) q_t = name.q_a + " HAS "; q += q_t + p_artist + ")";
                if (index.refine_iS) {var pool =  index.track(p_title, true, "", 2, false); le = Math.min(pool, le);}
                try {li = fb.GetQueryItems(lib.get_lib_items(), q)} catch (e) {};
                lib.get_lib_sel(li); for (var i = 0; i < le; i++) lib.in_library_sel(p_artist, p_title[i].title, 0, p_title[i].playcount); add_loc(rad_source, p_rm, p_rt, false, 2, true, true);
                break;
            case 1:
            case 3:
                if (!p_artist.length) return on_dld_radio_tracks_done(false, "", 0, 0, true);
                var a = "", a_arr = [], a_o = "", i = 0, j = 0, le = Math.min(song_hot, p_artist.length), q = "(NOT %path% HAS !!.tags) AND (NOT \"$ext(%path%)\" IS cue) AND (", q_t = name.q_a + " IS "; if (lib.pm_art && lib.pmt[5] != 0) q_t = name.q_a + " HAS ";
                for (i = 0; i < le; i++) {a = p_artist[i].artist.toLowerCase(); if (a != a_o) {a_arr.push(a); a_o = a;}}
                for (i = 0; i < a_arr.length; i++) {a = a_arr[i]; if (lib.in_library_art(a)) {q += (j ? " OR " : "") + q_t + a; j++;}} if (!j) return on_dld_radio_tracks_done(false); q += ")";
                try {li = fb.GetQueryItems(lib.get_lib_items(), q)} catch (e) {}
                lib.get_lib_sel(li); for (i = 0; i < le; i++) lib.in_library_sel(p_artist[i].artist, p_artist[i].title, 0, "N/A"); add_loc(rad_source, p_rm, p_rt, false, 2, true, true);
                break;
            case 2:
                if (finished) return; yt_rad.rec++;
                if (p_artist.length && p_title.length && lib) {
                    p.c_sort(p_title); var le = Math.min(song_hot, p_title.length);
                    if (index.refine_iS) {var pool =  index.track(p_title, false, p_artist, 2, false); le = Math.min(pool, le);}
                    for (var i = 0; i < le; i++) lib.in_library_sel(p_artist, p_title[i].title, i, yt_rad.rec, p_title[i].playcount);
                } set_text(p_done);
                if (!sim1_set && !timer.sim1) timer.sim1 = window.SetInterval(function() {add_loc(rad_source, p_rm, p_rt, true, 2, false, false); set_text(p_done);}, 10000);
                if (timer.sim1) sim1_set = true;
                timer.reset(timer.sim2, timer.sim2i); timer.sim2 = window.SetTimeout(function() {finished = true; timer.reset(timer.sim1, timer.sim1i); timer.sim2 = false; add_loc(rad_source, p_rm, p_rt, true, 1, true, true);}, iSelect_timeout);
                if (yt_rad.rec == p_done) {timer.reset(timer.sim1, timer.sim1i); timer.reset(timer.sim2, timer.sim2i); add_loc(rad_source,p_rm, p_rt, true, 1, true, true);}
                break;
        }
    }

    this.med_lib_radio = function(data, p_rad_source, p_rad_mode, p_rad_type, p_art_variety, p_song_hot, p_query) {
        var a = "", i = 0, j = 0; index.reset_add_loc(); if (rad_id == 19) rad_id = 0; else rad_id++; if (li) li.Dispose(); li = fb.CreateHandleList();
        finished = true; part_load = true; sim1_set = true; timer.reset(timer.sim1, timer.sim1i); timer.reset(timer.sim2, timer.sim2i); timer.reset(timer.yt, timer.yti); if (!data && p_rad_mode == 2 && (p_rad_type == 2 || p_rad_type == 4)) return on_dld_radio_tracks_done(false, "", 0, 0, true); if (!lib) return on_dld_radio_tracks_done(false, "", 0, 0, false, true);
        finished = false; part_load = false; sim1_set = false; rad_source = p_rad_source; rad_mode = p_rad_mode; rad_type = p_rad_type; art_variety = p_art_variety; if (p_song_hot) song_hot = p_song_hot; rad_query = p_query;
        switch (rad_mode) {
            case 2:
                switch (rad_type) {
                    case 0: if (lib.in_library_art(rad_source)) {this.do_lfm_lib_radio_tracks_search(rad_source, rad_mode, rad_type, art_variety, song_hot, false, rad_id, 0, 0, "");} else return on_dld_radio_tracks_done(false); break;
                    case 1:
                    case 3: this.do_lfm_lib_radio_tracks_search(rad_source, rad_mode, rad_type, art_variety, song_hot, false, rad_id, 0, 0, ""); break;
                    default:
                        var done = 0, q = "(NOT %path% HAS !!.tags) AND (NOT \"$ext(%path%)\" IS cue) AND (", q_t = name.q_a + " IS "; if (lib.pm_art && lib.pmt[5] != 0) q_t = name.q_a + " HAS ";
                        j = 0; for (i = 0; i < data.length; i++) {a = rad_type != 4 && data[0].hasOwnProperty('name') ? data[i].name : data[i]; if (lib.in_library_art(a)) {q += (j ? " OR " : "") + q_t + a; if (j == art_variety - 1) {done = j + 1; break;} else {j++; done = j}}} if (!done) return on_dld_radio_tracks_done(false);
                        q += ")"; try {li = fb.GetQueryItems(lib.get_lib_items(), q)} catch (e) {};
                        lib.get_lib_sel(li); j = 0; i = 0; timer.sim2 = window.SetTimeout(function() {finished = true; timer.reset(timer.sim1, timer.sim1i); timer.sim2 = false; add_loc(rad_source, rad_mode, rad_type, true, 1, true, true);}, iSelect_timeout);
                        timer.yt = window.SetInterval(function() {if (i < data.length && j < art_variety) {a = rad_type != 4 && data[0].hasOwnProperty('name') ? data[i].name : data[i]; if (lib.in_library_art(a)) {rad.do_lfm_lib_radio_tracks_search(a, rad_mode, rad_type == 4 ? 2 : rad_type, art_variety, song_hot, false, rad_id, done, 0, ""); j++;} i++;} else timer.reset(timer.yt, timer.yti);}, 20); // delay improves feedback
                        break;
                }
                break;
            case 3:
                if (rad_type > 1 && !data) return on_dld_radio_tracks_done(false, "", 0, 0, true); var q = "";
                switch (rad_type) {
                    case 0: q += name.q_a + " IS " + rad_source; break; case 1: q = !rad_query ? name.q_g + " IS " + rad_source : rad_source; break;
                    default: j = 0; for (i = 0; i < data.length; i++) {a = rad_type != 4 && data[0].hasOwnProperty('name') ? data[i].name : data[i]; if (lib.in_library_art(a)) {q += (j ? " OR " : "") + name.q_a + " IS " + a; if (j == art_variety - 1) break; j++;}} break;
                }
                if (this.filterID) q = "(" + q + ")" + " AND " + this.filter[this.filterID];
                if (!j && rad_type > 1) return on_dld_radio_tracks_done(false); try {li = fb.GetQueryItems(lib.get_lib_items(), q)} catch (e) {};
                li.OrderByFormat(tf.r, 1); if (!ml.sort_rand) li.OrderByFormat(ml.item_sort, ml.dir);
                if (li.Count > this.limit + 1) {index.track_count = li.Count; window.SetProperty("SYSTEM.Track Count", index.track_count); on_dld_radio_tracks_done(true, rad_mode, false, false, false, false, false, rad_query); this.list = li; index.load_my_sel(this.list, rad_type); } else on_dld_radio_tracks_done(false);
                break;
        }
    }

    var video_set_up = function() {
        switch (true) {
            case !p.video_mode: if (p.f_yt_ok || window.GetProperty("SYSTEM.Video Install", false)) return; fb.ShowPopupMessage("Enabling \"Prefer Video\" mode requires foo_youtube_preconf or standalone foo_youtube and LAVFilters", "YouTube Track Manager"); window.SetProperty("SYSTEM.Video Install", true); break;
            case p.video_mode: if (window.GetProperty("SYSTEM.Video Check", false)) return; fb.ShowPopupMessage("\"Prefer Video\" mode (yV):\n\nThis employs the foo_youtube video player popup.\n\nIt's recommended to set the video player up as follows:\n\n1) For best results set show and hide video frame \"Manually\" (\"foobar2000\\Preferences\\Tools\\Youtube Source\\Video\").\n\n2) Overlay the video player on top of YouTube Track Manager. Position and size as required.\n\n3) Enable \"window: Lock relative to main window\", \"window: Show video only\" & \"Fix to current\" in the video player right click menu.\n\n4) See the foo_youtube documentation for more info.\n\nLimitations:\n\nAs the foo_youtube video player can't be embedded in JScript panel, the above works by overlaying the popup version. Since it's a popup panel it doesn't resize with foobar2000.\n\nIt's recommended to set up video mode before closing this window.", "YouTube Track Manager"); window.SetProperty("SYSTEM.Video Check", true); break;
        }
    }

    if (p.ec_saved) this.e1 = fb.ProfilePath + "yttm\\" + "echonest\\";
    this.f2 = fb.ProfilePath + "yttm\\" + "lastfm\\"; p.create(this.f2);
}
var rad = new radio_manager();

function album_manager(p_album_name_callback) {
    var alb_info = [], alb_info_lfm = [[], [], []], alb_info_mb = [[], [], [], [], []], alb_n = "", ar_id_done = false, ar_mbid = false, artist = "", artist_timer = false, dat = "", data = [], dbl_force = false, do_sim = false, ht = 32, load_artist = "", mbidSort = true, nm = [], on_album_search_done_callback = p_album_name_callback, row_ix = [], search_done = [true, true, true, true], sim_artists = [], sim_nm = "", song, type_width = [], valid_prime = false;
    var bor = window.GetProperty(" Border", 25), extra_sbar_w = window.GetProperty(" Border Increase Right Margin By Scrollbar Width", false), lfm_type = ["Top Albums", "Top Tracks", "Top Songs"]; if (!p.scrollbar_show) extra_sbar_w = false;
    var alb_h = 0, alb_m_i = -1, alb_m_i_o = 0, alb_y = 0, alb_r = 0, alb_sp = 0, art_l = 0, art_m_i = -1, art_m_i_o = 0, art_r = 0, art_sp = 0, art_y = 0, ln_sp = 0, ln1_y = 0, ln2_y = 0, margin = p.scrollbar_show && !extra_sbar_w ? Math.max(p.sbar_sp + 10, bor) : bor, pc_h = 0, sel_x = 0, sel_w = 0, text_w = 0, top = bor * 0.625 + 8, tot_r = 0, tx1_w = 0, tx2_w = 0, txt_w = 0, txt1_w = 0, txt2_w = 0, type = 0;
    var bot = 0, cursor = false, cx = 0, end = 0, shift = false, htmlfile = new ActiveXObject('htmlfile'), lbtn_dn = false, lfm_width = [], mb_width = [], mb_type = ["All Releases", "Releases", "Albums", "Compilations", "Singles and EPs", "Remixes"], alb_search = false, lg = [], log = [], offset = 0, search_txt = "", shift_x = 0, start = 0, tx_w = 0, w1 = 0, w2 = 0, w3 = 0; window.DlgCode = 0x004;
    var calc_txt = function () {var im = gdi.CreateImage(1, 1), g = im.GetGraphics(); tx_w = g.CalcTextWidth(search_txt.substr(offset), ui.font); im.ReleaseGraphics(g); im.Dispose();}
    var do_youtube_search = function(p_alb_id, p_artist, p_title, p_date) {plman.ActivePlaylist = pl.alb; if (ml.alb && ml.mtags_installed) plman.ClearPlaylist(plman.ActivePlaylist); var yt_search = new youtube_search(function() {yt_search.on_state_change();}, on_youtube_search_done); yt_search.Search(p_alb_id, p_artist, p_title, "", "", "", "", ml.alb && ml.mtags_installed ? "" : "&fb2k_album=" + encodeURIComponent(p_title) + (p_date ? ("&fb2k_date=" + encodeURIComponent(p_date)) : ""), "", true);}
    var get_cursor_x = function (pos) {var im = gdi.CreateImage(1, 1), g = im.GetGraphics(), x = 0; if (pos >= offset) x = g.CalcTextWidth(search_txt.substr(offset, pos - offset), ui.font); im.ReleaseGraphics(g); im.Dispose(); return x;}
    var get_mb_tracks = function(alb_id, a, alb_n) {var mb_releases = new musicbrainz_releases(function() {mb_releases.on_state_change();}, on_mb_releases_search_done); mb_releases.Search(alb_id, "", a, alb_n);}
    var get_width = function() {w_arr = ["date", "sp", "rank", "pc", "score", "lfm"]; for (var i = 0; i < w_arr.length; i++) this[w_arr[i]] = 0;}; var w = new get_width();
    var num = function(x) {if (!x) return; return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}
    var on_mb_releases_search_done = function(p_alb_id, p_re_mbid, p_album_artist, p_date) {dat = p_date; do_youtube_search(p_alb_id, p_album_artist, alb_n, p_date); t.paint();}
    var repaint = function() {if (!alb.show || t.halt()) return; if (t.rp) window.RepaintRect(margin, Math.floor(top), txt_w, ht + 1);}
    var record = function() {lg.push(search_txt); log = []; if (lg.length > 30) lg.shift();}
    this.artist = ""; this.orig_artist = ""; this.artists = []; this.dld; this.edit = false; this.get = true; this.more = window.GetProperty("SYSTEM.More Artists", true); this.lock_artist = false; p.create(rad.f2 + "r"); this.related_artists = rad.f2 + "r\\related_artists.json"; this.rel_artists = []; this.track_source = 1;
    this.artist_recognised = function() {return this.artist && !search_done[this.mb ? 3 : this.lfm_mode] ?  "Searching..." : !ar_mbid || this.songs_mode() ? "Unrecognised " + (!this.songs_mode() ? "Artist" : "Song"): this.mb && (this.show_live ? !data.length : !valid_prime) || !this.mb ? "Nothing Found" : "Nothing Found For Release Type:\n" + this.release_name[this.release_type];}
    this.border = function() {return bor;}
    this.calc_rows_alb = function() {alb_scrollbar.reset(); alb_scrollbar.set_rows(alb_info.length);}
    this.calc_rows_art = function() {art_l = this.more ? this.artists.length : 0; art_scrollbar.reset(); art_scrollbar.set_rows(art_l);}
    this.drawcursor = function (gr) {if (alb_search && cursor && start == end && cx >= offset) {var x1 = margin + this.release_w() + get_cursor_x(cx), x2 = x1; gr.DrawLine(x1, top, x2, top + ht - 1, 1, ui.textcol);}}
    this.drawsel = function(gr) {if (start == end) return; var clamp = margin + this.release_w() + (w3 - this.release_w()); gr.DrawLine(Math.min(margin + this.release_w() + get_cursor_x(start), clamp), top + ht / 2, Math.min(margin + this.release_w() + get_cursor_x(end), clamp), top + ht / 2, ht - 1, ui.ibeamcol2);}
    this.done = function(new_artist) {if (nm[!this.mb ? this.lfm_mode : 3] == (!this.songs_mode() ? new_artist : this.artist_title)) return true; else return false}
    this.get_cursor_pos = function (x) {var im = gdi.CreateImage(1, 1), g = im.GetGraphics(), nx = x - margin - this.release_w(), pos = 0; for (var i = offset; i < search_txt.length; i++) {pos += g.CalcTextWidth(search_txt.substr(i, 1), ui.font); if (pos >= nx + 3) break;} im.ReleaseGraphics(g); im.Dispose(); return i;}
    this.get_offset = function (gr) {var tx = gr.CalcTextWidth(search_txt.substr(offset, cx - offset), ui.font); var j = 0; while (tx >= w3 - this.release_w() && j < 500) {j++; offset++; tx = gr.CalcTextWidth(search_txt.substr(offset, cx - offset), ui.font);}}
    this.fit = function() {return [margin, top, ht];}; this.lbtn_up = function(x, y, mask) {if (start != end) timer.reset(timer.search_cursor, timer.search_cursori); lbtn_dn = false;}
    this.focus = function() {if (fb.IsPlaying && this.orig_artist != this.artist) return; if (!this.lock_artist) this.orig_artist = this.artist = name.artist(); if (!this.artist) return; this.on_playback_new_track();};
    this.leave = function() {if (!this.show|| t.halt()) return; alb_m_i = -1; alb_m_i_o = 0; art_m_i = -1; art_m_i_o = 0; t.paint(); type = 0;}; this.lfm_mode = window.GetProperty("SYSTEM.Lfm Mode", 1); this.lfm_sort = window.GetProperty("SYSTEM.Lfm Sort", false);
    this.mb = window.GetProperty("SYSTEM.AlbMode", 0); this.mb_sort = window.GetProperty("SYSTEM.Mb Sort", false);
    this.on_focus = function(p_is_focused) {if (!p_is_focused) {timer.reset(timer.search_cursor, timer.search_cursori); cursor = false; repaint();}}
    this.on_key_up = function(vkey) {if (!this.show || t.halt()) return; if (vkey == v.shift) {shift = false; shift_x = cx;}}; this.show_live = window.GetProperty("SYSTEM.Show Live MB Releases", false);
    this.pref_mb_tracks = window.GetProperty("SYSTEM.AlbTracks Pref: Lfm-0 Mb-1", 1); this.release_type = window.GetProperty("SYSTEM.Release Type", 0);
    this.rbtn_up = function(x, y) {men.search_menu(x, y, start, end, htmlfile.parentWindow.clipboardData.getData('text') ? true : false)}
    this.release_name = [this.show_live ? "All Releases" : "Releases", "Albums", "Compilations", "Singles and EPs", "Remixes"];
    this.release_w = function() {return (this.mb ? mb_width[this.release_type == 0 ? this.show_live ? 0 : 1 : this.release_type + 1] : lfm_width[this.lfm_mode]) + w.sp;}
    this.reset = function() {artist = ""; offset = start = end = cx = 0; this.orig_artist = this.artist = name.artist(); this.artist_title = name.artist_title(); search_txt = !this.songs_mode() ? this.artist : this.artist_title; nm = []; sim_nm = ""; this.search_for_album_names(0, this.mb ? 3 : this.lfm_mode);}
    this.reset_album = function(mode) {search_done[mode] = false; if (mode == 3) {alb_info_mb = [[], [], [], [], []]; data = [];} else alb_info_lfm[mode] = [];}
    this.reset_albums = function(new_artist, mode, bypass) {alb_info = []; if (this.show) t.paint(); this.reset_album(mode); if (!bypass) {ar_id_done = ar_mbid = false;} if (mode == 3) nm[3] = new_artist; else nm[mode] = (mode != 2 ? new_artist : this.artist_title); valid_prime = false;}
    this.scrollbar_type = function() {return type == 1 ? art_scrollbar : type == 2 ? alb_scrollbar : 0;}
    this.set_txt = function(ns) {search_txt = ns ? ns : !this.songs_mode() ? this.artist : this.artist_title; if (!ns) {alb_search = false; offset = start = end = cx = 0;} repaint();}
    this.show_similar = window.GetProperty("SYSTEM.Similar Artists", true); var reset_type = this.show_similar;
    this.show = window.GetProperty("SYSTEM.Show Albums", true); this.songs_mode = function() {return !this.mb && this.lfm_mode == 2}; this.state = function() {return search_txt ? true : false;}
    this.type_text = function() {return (this.mb ? this.release_name[this.release_type] : lfm_type[this.lfm_mode]) + ":"}; this.wheel = function() {alb_m_i = -1; alb_m_i_o = 0; art_m_i = -1; art_m_i_o = 0;}

    this.get_releases = function(m, r) {
        switch (m) {
            case "lfm": this.lfm_mode = r; this.search_for_album_names(2, r, r == 2 ? this.artist_title : this.artist, ar_mbid); text_w = !r ? tx1_w : tx2_w; window.SetProperty("SYSTEM.Lfm Mode", r); break;
            case "mb":
                this.release_type = r; text_w = txt_w - w.date - type_width[r]; window.SetProperty("SYSTEM.Release Type", r)
                for (var i = 0; i < 5; i++) if (this.release_type == i ) {if (alb_info_mb[i].length) alb_info = alb_info_mb[i]; else analyse("", 3); on_album_search_done_callback();}; break;
        } this.set_txt();
    }

    this.set_row = function(alb_id, n, a) {
        if (p.btn_mode) return; var id = null; for (var i = 0; i < p.loading.length; i++) if (p.loading[i].id == alb_id) {id = p.loading[i].t; break;}
        var mb = id < 6 ? true : false, nn = "", j = mb ? id - 1 : id - 6, k = row_ix[alb_id];
        if (mb && !alb_info_mb[j][k] || !mb && !alb_info_lfm[j][k] || id != 8 && this.artist && a != this.artist || id == 8 && alb_info_lfm[j][k].artist && a != alb_info_lfm[j][k].artist) return;
        if (mb) nn = alb_info_mb[j][k].name = alb_info_mb[j][k].name.replace(/^(x |> |>> )/,"");
        else nn = alb_info_lfm[j][k].name = alb_info_lfm[j][k].name.replace(/^(x |> |>> )/,"");
        if (n == 4) return; switch (n) {case 0: nn = "x " + nn; break; case 1: nn = "> " + nn; break; case 2: nn = ">> " + nn; break; case 3: nn = (p.loc_add[alb_id].length ? ">> " : "x ") + nn; break;}
        mb ? alb_info_mb[j][k].name = nn : alb_info_lfm[j][k].name = nn;
    }

    this.on_playback_new_track = function() {
        if (rad.pss) if (window.IsVisible) rad.force_refresh = 1; else rad.force_refresh = 0;
        if (!this.show || (this.lock_artist && this.artist) || t.block()) {this.get = true; t.repaint(); return;} // block
        this.artist_title = name.artist_title(); this.set_txt(); if (rad.pss) rad.force_refresh = 2;
        timer.reset(timer.search_cursor, timer.search_cursori); this.search_for_album_names(0, this.mb ? 3 : this.lfm_mode);
    }

    this.get_albums_fallback = function() {
        if (!this.get || (this.lock_artist && this.artist)) return;
        if (!this.lock_artist && !this.artist) this.orig_artist = this.artist = name.artist();
        if (!this.lock_artist) this.artist_title = name.artist_title(); this.set_txt(); if (rad.pss && !rad.force_refresh) rad.force_refresh = 2;
        timer.reset(timer.search_cursor, timer.search_cursori); this.search_for_album_names(0, this.mb ? 3 : this.lfm_mode);
    }

    this.dld_album = function(alb_id, index) {
        if (index >= alb_info.length || index < 0) return; if (utils.IsKeyPressed(0x12)) return p.browser("https://musicbrainz.org/release-group/"+ alb_info[index].rg_mbid);
        var i_n = alb_info[index].name.replace(/^> /,"");
        if (ml.alb) if (this.library_test(this.artist, i_n)) return; this.dld = new dld_album_tracks();
        this.dld.Execute(alb_id, alb_info[index].rg_mbid, this.artist, i_n, alb_info[index].prime, alb_info[index].extra, alb_info[index].date);
    }

    this.search_for_album_names = function(type, mode, new_artist, ar_id, just_mbid) {
        switch (type) {
            case 0: // new track or reset
                if (!new_artist) new_artist = this.artist; this.get = false; if (!new_artist) return; do_sim = false;
                var albums = new dld_album_names(on_albums_search_done);
                if (this.more && this.show_similar && !new_artist.uuid() && sim_nm != new_artist) this.search_for_similar_artists(new_artist);
                if (this.done(new_artist) && !just_mbid) return;
                if (!this.show_similar) {this.artists = []; this.rel_artists = []; this.artists[0] = {name: "Searching...", id: ""}; this.calc_rows_art();}
                if (!just_mbid) this.reset_albums(new_artist, mode); albums.Execute(new_artist, just_mbid, "", mode);
                break;
            case 1: // mouse click similar or related artist
                if (this.show_similar) this.rel_artists = []; else sim_artists = []; this.reset_albums(new_artist, mode);
                if (ar_id) {var albums = new dld_more_album_names(on_albums_search_done); albums.Execute(ar_id, mode);} // get album names
                else {var albums = new dld_album_names(on_albums_search_done); albums.Execute(new_artist, false, this.show_similar ? false : true, mode);} // get mbid then album names
                if (this.more && !this.show_similar) {sim_artists[0] = {name: "Searching..."}; sim_nm = ""; do_sim = true;}; load_artist = new_artist;
                break;
            case 2: // but actions mostly
                if (artist_timer) window.ClearTimeout(artist_timer); artist_timer = false;
                if (!ar_id_done) {this.reset_album(mode); t.paint(); /*immediate reset*/ return artist_timer = window.SetTimeout(function() {alb.reset(); artist_timer = false;}, 1500);}
                if (this.done(new_artist)) {
                    if (this.mb) {alb_info = alb_info_mb[this.release_type]; return on_album_search_done_callback();}
                    else {alb_info = alb_info_lfm[mode]; return on_album_search_done_callback();}
                }
                else {var albums = new dld_more_album_names(on_albums_search_done); this.reset_albums(new_artist, mode, true); albums.Execute(ar_id, mode);} // get album names if no data
                break;
        }
    }

    this.search_for_similar_artists = function(n) {
        if (n == sim_nm) return; sim_nm = n; this.artists = []; do_sim = false; sim_artists = []; this.artists[0] = {name: "Searching...", id: ""}; this.calc_rows_art();
        var similar = new lfm_similar_artists(function() {similar.on_state_change();}, on_similar_search_done); similar.Search(n);
    }

    this.chooseartist = function(ns, type) {
        if (!type) {
            if (!this.songs_mode()) ns = p.InputBox("Type Artist Name Or\nPaste Musicbrainz ID (MBID)\n\n#Prefix Directly Gets Top " + pl.top50 + " Artist Tracks", "Mode: Artist Look Up", "#" + name.art());
            else ns = p.InputBox("Type Artist | Title\nUse Pipe Separator\n\n#Prefix Directly Gets Top " + pl.top50 + " Songs", "Mode: Song Look Up", "#" + this.artist_title);
        }
        if (!ns) return; ns = ns.titlecase(); var t50 = ns.match(/^#/) == "#"; if (t50) ns = ns.replace(/^#/, ""); ns = ns.trim(); this.set_txt(ns);
        if (!p.btn_mode) {
            if (!ns.uuid()) this.artist = !this.songs_mode() ? ns : ns.split("|")[0].trim();
            if (this.songs_mode()) {this.artist_title = ns; ns = this.artist;}
            if (!this.show && ns.uuid()) this.search_for_album_names(0, this.mb ? 3 : this.lfm_mode, ns, "", true); // true blocks chain before album names obtained if uuid true
            if (this.show) this.search_for_album_names(0, this.mb ? 3 : this.lfm_mode, ns); else this.get = true;
        }
        if (p.btn_mode) {if (!ns.uuid()) this.artist = ns; else this.search_for_album_names(0, this.mb ? 3 : this.lfm_mode, ns, "", true);}
        if (t50) {
            if (ns.uuid() && !ar_id_done && !this.songs_mode()) {return artist_timer = window.SetTimeout(function() {rad.get_top50(name.art(), 1); artist_timer = false;}, 1500);}
            if (!this.songs_mode()) rad.get_top50(ns.uuid() ? name.art() : ns, 1); else rad.get_top50(this.artist_title, 2);
        }
    }

    this.lockartist = function() {
        this.lock_artist = !this.lock_artist;
        if (this.lock_artist) return; this.orig_artist = this.artist = name.artist(); this.artist_title = name.artist_title(); this.set_txt();
        this.search_for_album_names(0, this.mb ? 3 : this.lfm_mode);
    }

    this.calc_text = function() {
        var g = gdi.CreateImage(1, 1), gb = g.GetGraphics(), h, i = 0, rel_name = ["Remix Album  ", "Album ", "Compilation ", "Single ", "Remix Album "], sp_arr = ["0000  ", "  ", "00  ", " 10,000,000", " Score", "   Last.fm Playcount"];
        for (i = 0; i < 2; i++) {h = gb.CalcTextHeight("String", i == 0 ? ui.font : ui.pc); i == 0 ? ht = h + window.GetProperty(" Row Vertical Item Padding", 0) : pc_h = h}
        w1 = p.w - margin - (!extra_sbar_w ? 0 : p.sbar_sp); w2 = w1 - ht * 0.75; w3 = w2 - margin; sel_x = Math.round(margin - margin / 2); if (p.scrollbar_show) sel_x = !extra_sbar_w ? Math.max(sel_x, p.sbar_sp) + 2 : Math.min(sel_x + 2, bor); sel_w = p.w - sel_x * 2 - (!extra_sbar_w ? 0 : p.sbar_sp); txt_w = p.w - margin * 2 - (!extra_sbar_w ? 0 : p.sbar_sp);
        for (i = 0; i < sp_arr.length; i++) {w[w_arr[i]] = gb.CalcTextWidth(sp_arr[i] , i == 4 ? ui.head : i == 5  ? ui.pc : ui.font);}
        for (i = 0; i < 5; i++) type_width[i] = gb.CalcTextWidth(rel_name[i], ui.font);
        for (i = 0; i < 3; i++) lfm_width[i] = gb.CalcTextWidth(lfm_type[i], ui.font);
        for (i = 0; i < 6; i++) mb_width[i] = gb.CalcTextWidth(mb_type[i], ui.font);
        g.ReleaseGraphics(gb); g.Dispose();
        txt1_w = txt_w - w.score - w.sp; txt2_w = w.score; tx1_w = txt_w - w.pc; tx2_w = txt_w - w.rank - w.sp - w.pc;
        text_w = this.mb ? txt_w - w.date - type_width[this.release_type] : !this.lfm_mode ? tx1_w : tx2_w;
        if (!this.show_similar) {txt1_w = txt_w * 2 / 3 - w.sp; txt2_w = txt_w / 3};
    }

    this.calc_rows = function() {
        top = bor * 0.625 + 19 * but.scale; bot = top + ht; ln_sp = ht * 0.2; ln1_y = top + ht + ln_sp; alb_y = ln1_y + ln_sp; // temp values with min allowed ln_sp
        var sp1 = p.h - top - ht - (p.text_auto ? Math.max(ht, bor) : 1), sp2 = sp1 - ln_sp * (this.more ? 5 : 3); tot_r = Math.floor(sp2 / ht);
        ln_sp = (sp1 - tot_r * ht) / (this.more ? 5 : 3); top = top + ln_sp; bot = top + ht; ln1_y = bot + ln_sp; alb_y = ln1_y + ln_sp; // recalc
        art_r = this.more ? tot_r  > 8 ? Math.max(Math.round(tot_r / 3), 5) : Math.floor(tot_r / 2) : 0;
        alb_r = tot_r - art_r; art_sp = art_r * ht; alb_sp = alb_r * ht; alb_h = alb_y + alb_sp;
        ln2_y = alb_y + alb_sp + ln_sp; art_y = ln2_y + ln_sp;
        var top_corr = [p.sbar_o - (p.but_h - p.scr_but_w) / 2, p.sbar_o, 0][p.scr_type], bot_corr = [(p.but_h - p.scr_but_w) - p.sbar_o * 2, -p.sbar_o, 0][p.scr_type];
        var sbar_alb_y = alb_y + top_corr, sbar_art_y = art_y + top_corr, sbar_alb_h = alb_sp + bot_corr, sbar_art_h = art_sp + bot_corr; if (p.scr_type == 2) {sbar_alb_y += 1; sbar_art_y += 1; sbar_alb_h -= 2; sbar_art_h -= 2;}
        alb_scrollbar.metrics(p.sbar_x, sbar_alb_y, p.scr_w, sbar_alb_h, alb_r, ht, alb_y, alb_sp);
        art_scrollbar.metrics(p.sbar_x, sbar_art_y, p.scr_w, sbar_art_h, art_r, ht, art_y, art_sp);
    }

    this.move = function(x, y) {
        if (!this.show || t.halt()) return; type = p.m_y > art_y ? 1 : p.m_y > alb_y && p.m_y < alb_h ? 2 : 0; if (but.Dn) return;
        if (y > top && y < bot && x > margin && x < w2) {window.SetCursor(32513); this.edit = true;} else this.edit = false;
        if (y > top && y < bot && x < w1 && x > w2) window.SetCursor(32649);
        if (y > top && y < bot && x > margin && x < w1 && lbtn_dn) {var n_x = margin + this.release_w(), n_w = w3 - this.release_w(), tp = this.get_cursor_pos(x), t_x = get_cursor_x(tp); calc_txt(); if(tp < start) {if (tp < end) {if (t_x < n_x) if(offset > 0) offset--;} else if (tp > end) {if (t_x + n_x > n_x + n_w) {var l = (txt_w > n_w) ? txt_w - n_w : 0; if(l > 0) offset++;}} end = tp;} else if (tp > start) {if(t_x + n_x > n_x + n_w) {var l = (txt_w > n_w) ? txt_w - n_w : 0; if(l > 0) offset++;} end = tp;} cx = tp; repaint();}
        if (!art_l && !alb_info.length) return;
        alb_m_i = -1; art_m_i = -1;
        if (p.m_y > art_y && p.m_y < art_y + art_sp) art_m_i = get_ix(x, y);
        else if (p.m_y > alb_y && p.m_y < alb_h) alb_m_i = get_ix(x, y);
        if (alb_m_i == alb_m_i_o && art_m_i == art_m_i_o) return;
        alb_m_i_o = alb_m_i; art_m_i_o = art_m_i; t.paint();
    }

    this.draw = function(gr) {
        if (t.halt()) return; try {this.get_albums_fallback(); var i = 0;
            start = Math.min(Math.max(start, 0), search_txt.length); end = Math.min(Math.max(end, 0), search_txt.length);
            cx = Math.min(Math.max(cx, 0), search_txt.length);
            end = (end < search_txt.length) ? end : search_txt.length;
            gr.GdiDrawText(this.type_text(), ui.font, ui.textcol_h, margin, top, w3, ht, t.ls); this.drawsel(gr); this.get_offset(gr);
            gr.GdiDrawText(search_txt.substr(offset), ui.font, ui.textcol_h, margin + this.release_w(), top, w3 - this.release_w(), ht, t.ls);
            this.drawcursor(gr); gr.DrawLine(margin, ln1_y, w1 - (!this.mb ? w.lfm : 0), ln1_y, 1, ui.textcol_h); var f = 0, row_y = 0, s = 0, txt_col;
            if (!this.mb) gr.GdiDrawText("Last.fm Playcount", ui.pc, ui.textcol_h, margin, ln1_y - ui.pc.Size + 1, txt_w, pc_h, t.r);
            if (alb_info.length) {
                s = Math.round(alb_scrollbar.delta / ht + 0.4); f = s + alb_r; f = alb_info.length < f ? alb_info.length : f;
                var d_h = (f - s) * ht + alb_y - ht * 0.9;
                for (i = s; i < f; i++) {
                    if (row_y < d_h) {
                        row_y = i * ht + alb_y - alb_scrollbar.delta;
                        if (ui.alternate) {if (i % 2 == 0) gr.FillSolidRect(0, row_y + 1, alb_scrollbar.stripe_w, ht - 2, ui.b1); else gr.FillSolidRect(0, row_y, p.w, ht, ui.b2);}
                        if (alb_info[i].name.indexOf(">>") == 0 && ui.backcolsel != 0) gr.FillSolidRect(sel_x, row_y, sel_w, ht, ui.backcolsel);
                    }
                }
                for (i = s; i < f; i++) {
                    row_y = i * ht + alb_y - alb_scrollbar.delta;
                    if (row_y < d_h) {
                        txt_col = alb_info[i].name.indexOf(">>") == 0 ? ui.textselcol : alb_m_i == i ? ui.textcol_h : ui.textcol;
                        if (alb_m_i == i) {gr.FillSolidRect(sel_x, row_y, sel_w, ht, ui.backcol_h); gr.DrawRect(sel_x, row_y, sel_w - 1, ht, 1, ui.framecol);}
                        if (!this.mb && this.lfm_mode) gr.GdiDrawText((i < 9 ? "0" : "") + (i + 1), ui.font, txt_col, margin, row_y, w.rank, ht, t.l);
                        gr.GdiDrawText(alb_info[i].name, ui.font, txt_col, margin + (this.mb || !this.lfm_mode ? 0 : w.rank), row_y, text_w, ht, t.l);
                        if (this.mb) gr.GdiDrawText(alb_info[i].release_type, ui.font, txt_col, margin, row_y, txt_w - w.date, ht, t.r);
                        gr.GdiDrawText(this.mb ? alb_info[i].date : num(alb_info[i].playcount), ui.font, txt_col, this.mb ? margin : margin + tx1_w, row_y, this.mb ? txt_w : w.pc, ht, t.r);
                    }
                }
            }
            else gr.GdiDrawText(this.artist_recognised(), ui.font, ui.textcol, margin, Math.round(alb_y), txt_w, ht * 2, t.l);
            if (p.scrollbar_show && alb_scrollbar.scrollable_lines > 0) alb_scrollbar.draw(gr);
            if (art_l) {
                s = Math.round(art_scrollbar.delta / ht + 0.4); f = s + art_r; f = art_l < f ? art_l : f;
                var d_h = (f - s) * ht + art_y - ht * 0.9;
                for (i = s; i < f; i++) {
                    if (row_y < d_h) {
                        row_y = i * ht + art_y - art_scrollbar.delta;
                        if (ui.alternate) {if (i % 2 == 0) gr.FillSolidRect(0, row_y + 1, art_scrollbar.stripe_w, ht - 2, ui.b1); else gr.FillSolidRect(0, row_y, p.w, ht, ui.b2);}
                        if (this.artists[i].name.indexOf(">>") == 0 && ui.backcolsel != 0) gr.FillSolidRect(sel_x, row_y, sel_w, ht, ui.backcolsel);
                    }
                }
                for (i = s; i < f; i++) {
                    row_y = i * ht + art_y - art_scrollbar.delta;
                    if (row_y < d_h) {
                        var ft = i == 0 ? ui.head : ui.font;
                        txt_col = this.artists[i].name.indexOf(">>") == 0 ? ui.textselcol : art_m_i == i ? ui.textcol_h : ui.textcol;
                        if (art_m_i == i) {gr.FillSolidRect(sel_x, row_y, sel_w, ht, ui.backcol_h); gr.DrawRect(sel_x, row_y, sel_w - 1, ht, 1, ui.framecol);}
                        gr.GdiDrawText(this.artists[i].name, ft, txt_col, margin, row_y, txt1_w, ht, t.l);
                        if (this.show_similar) gr.GdiDrawText(this.artists[i].score, ft, txt_col, margin + txt_w - txt2_w, row_y, txt2_w, ht, t.r);
                        else if (i > 0) gr.GdiDrawText(this.artists[i].disambiguation, ui.font, txt_col, margin + txt_w - txt2_w, row_y, txt2_w, ht, t.r);
                    }
                }
                gr.DrawLine(margin, ln2_y, w1, ln2_y, 1, ui.blend);
            } if (p.scrollbar_show && art_scrollbar.scrollable_lines > 0) art_scrollbar.draw(gr);} catch(e) {}
    }

    this.library_test = function(p_album_artist, p_album) {
        if (!lib) return; var j = 0; lib.artist_edit(p_album_artist); var orig_alb = false, mtags_alb = false;
        var albums = tf.l0.EvalWithMetadbs(lib.art_ed).toArray(); if (lib.art_ed.Count) for (j = 0; j < lib.art_ed.Count; j++) if (albums[j].strip() == p_album.strip()) {orig_alb = true; break;}
        albums = tf.l0.EvalWithMetadbs(lib.art_ed_tags).toArray(); if (lib.art_ed_tags.Count) for (j = 0; j < lib.art_ed_tags.Count; j++) if (albums[j].strip() == p_album.strip()) {mtags_alb = true; break;}
        if ((orig_alb || mtags_alb) && album_in_ml(p_album_artist, p_album, orig_alb, mtags_alb)) return true; return false;
    }

    var album_in_ml = function(artist, album, orig_alb, mtags_alb) {
        var ns = p.InputBox("This Album Exists In Library As:" + (orig_alb ? "\n\nOriginal Library Album" : "") + (orig_alb && mtags_alb ? "\n\nAND" : "") + (mtags_alb ? "\n\nAlbum Built With m-TAGS" : "") + "\n\nProceed?", "Album Search", artist + " | " + album);
        if (!ns || ns == "Artist | Album") return true; return false;
    }

    var on_youtube_search_done = function(p_alb_id, link, p_artist, p_title, p_ix, p_done, p_top50, p_pn, p_alb_set, p_length, p_orig_title, p_yt_title, p_full_alb, p_fn, p_type) {
        if (link && link.length) {
            alb.set_row(p_alb_id, 2, p_artist); t.paint();
            if (!ml.alb || !ml.mtags_installed) p.plmanAddloc ? p.add_locations([link], pl.alb) : p.add_fb2k_locations(link);
            else {
                var type_arr = ["", "YouTube Track", "Prefer Library Track", "Library Track"];
                p.mtags[p_alb_id] = []; p.mtags[p_alb_id].push({"@":link,"ALBUM":p_title,"ARTIST":p_artist,"DATE":dat,"DURATION":p_length.toString(),"TITLE":p_title + " (Full Album)","YOUTUBE_TITLE":p_yt_title,"YOUTUBE_TRACK_MANAGER_SEARCH_TITLE":p_orig_title ? p_orig_title : [],"YOUTUBE_TRACK_MANAGER_TRACK_TYPE":type_arr[ml.alb]});
                alb.save_mtags(p_alb_id, p_artist, p_title, true);
            }
        }
    }

    this.save_mtags = function(p_alb_id, p_artist, p_album, p_full_alb) {
        var a = p_artist.clean() + " - " + p_album.clean(), fns = fb.ProfilePath + "yttm\\albums\\" + a.substr(0, 1).toLowerCase() + "\\", fna = fns + a + "\\"; p.create(fns), j = 0;
        if (!p_full_alb) p.num_sort(p.mtags[p_alb_id],"TRACKNUMBER");
        var pth = fna + a + " !!.tags"; if (pth.length > 259) pth = fna + a.titlecase().match(/[A-Z0-9]/g).join('') + " !!.tags"; if (pth.length > 259) {fna = fns + a.titlecase().match(/[A-Z0-9]/g).join('') + "\\"; pth = fna + a.titlecase().match(/[A-Z0-9]/g).join('') + " !!.tags";} p.create(fna);
        if (!ml.abs_path) for (j = 0; j < p.mtags[p_alb_id].length; j++) if (p.mtags[p_alb_id][j]["@"].charAt(0) == "/")  p.mtags[p_alb_id][j]["@"] = ml.getRelativePath("/" + pth, p.mtags[p_alb_id][j]["@"]);
        if (!p.save(pth, JSON.stringify(p.mtags[p_alb_id], null, 3), true)) return; var all_files = utils.Glob(fna + "*").toArray(), cov = false;
        for (j = 0; j < all_files.length; j++) if ((/(?:jpe?g|gif|png|bmp)$/i).test(p.fs.GetExtensionName(all_files[j]))) {cov = true; break;}
        if (!cov) {var lfm_cov = new lfm_alb_cov(function() {lfm_cov.on_state_change();}); lfm_cov.Search(p_artist, p_album, fna);}
        plman.ClearPlaylist(plman.ActivePlaylist); p.plmanAddloc ? p.add_locations([pth], plman.ActivePlaylist) : p.add_fb2k_locations(pth);
    }

    this.lbtn_dn = function(x, y) {
        if (y < top) return; repaint(); alb_search = lbtn_dn = (y > top && y < bot && x > margin && x < w2); if (y > bot) return;
        if (!lbtn_dn) {offset = start = end = cx = 0; timer.reset(timer.search_cursor, timer.search_cursori); return;}
        else if (x > margin && x < w2) {if (shift) {start = cx; end = cx = this.get_cursor_pos(x);} else {cx = this.get_cursor_pos(x); start = end = cx;} timer.reset(timer.search_cursor, timer.search_cursori); cursor = true; timer.search_cursor = window.SetInterval(function() {cursor = !cursor; repaint();}, 530);}
        repaint();
    }

    this.load = function(x, y, full_alb) {
        if (y < top || but.Dn) return; repaint(); alb_search = (y > top && y < bot && x > margin && x < w2); if (y <= bot) return;
        if (!this.show || x > p.w - p.sbar_sp) return; var i = get_ix(x, y); if (i == -1) return timer.reset(timer.search_cursor, timer.search_cursori);
        switch (type) {
            case 1:
                if (artist_timer || this.show_similar && i >= sim_artists.length || !this.show_similar && i >= this.rel_artists.length) return;
                if (reset_type) for (var j = 0; j < sim_artists.length; j++) sim_artists[j].name = sim_artists[j].name.replace(/^(x |>> )/,"");
                else if (this.rel_artists.length) for (var j = 0; j < this.rel_artists.length; j++) this.rel_artists[j].name = this.rel_artists[j].name.replace(/^(x |>> )/,"");
                reset_type = this.show_similar;
                if (this.songs_mode() && this.artists[i]) {
                    var n = this.artists[i].name; this.artists[i].name = "x N/A In Similar Songs Mode"; t.paint();
                    if (!artist_timer)
                        artist_timer = window.SetTimeout(function() {
                            if (alb.artists[i]) alb.artists[i].name = n; t.paint(); artist_timer = false;
                        }, 3000);
                } else {
                    if (!this.artists[i] || this.artists.length == 1 && this.artists[i].name.indexOf("Artists N/A") != -1) return; dbl_force = true;
                    this.artist = i == 0 ? this.artists[i].name.replace(/( \[Similar\]:| \[Related\]:)/g, "") : this.artists[i].name; this.set_txt();
                    this.search_for_album_names(1, this.mb ? 3 : this.lfm_mode, this.artist, this.artists[i].id ? this.artists[i].id : "");
                    var alb_artist = this.artists[0].name.replace(/( \[Related\]:)/g, "");
                    if (!this.show_similar && alb_artist.length && this.artists[i].id) {
                        if (p.file(this.related_artists)) var related_artists = p.json_parse(utils.ReadTextFile(this.related_artists)); else var related_artists = {}
                        this.artists[0].name.replace(/( \[Related\]:)/g, "");
                        var key = alb_artist.toUpperCase(); related_artists[key] = this.artists[i].id;
                        if (mbidSort) {var keys = [], len, k, ordered = {}, v; for (k in related_artists) if (related_artists.hasOwnProperty(k)) keys.push(k); keys.sort(); len = keys.length; for (v = 0; v < len; v++) {k = keys[v]; ordered[k] = related_artists[k];} p.save(this.related_artists, JSON.stringify(ordered, null, 3), true); mbidSort = false;}
                        else p.save(this.related_artists, JSON.stringify(related_artists, null, 3), true);
                    }
                    if (i != 0) {this.artists[i].name = ">> " + this.artists[i].name; t.paint();}
                }
                break;
            case 2:
                if (p.alb_id == 19) p.alb_id = 0; else p.alb_id++;
                plman.UndoBackup(pl.alb);
                if (this.mb || !this.mb && this.lfm_mode == 0) {
                    p.loading[p.alb_id] = {"id":p.alb_id,"t":this.mb ? this.release_type + 1 : this.lfm_mode + 6};
                    row_ix[p.alb_id] = i; this.set_row(p.alb_id, 4, this.artist);
                    if (!full_alb || (this.mb && alb_info[i].release_type.indexOf("Album") == -1 && alb_info[i].release_type.indexOf("Compilation") == -1)) {
                        this.track_source = this.pref_mb_tracks; this.set_row(p.alb_id, 1, this.artist); this.dld_album(p.alb_id, i);
                    } else {
                        /*mbtn_up*/ alb_n = alb_info[i].name; if (ml.alb) if (this.library_test(this.artist, alb_n)) return;
                        this.set_row(p.alb_id, 1, this.artist); dat = this.mb ? alb_info[i].date : ""; if (!this.mb) {get_mb_tracks(p.alb_id, this.artist, alb_n);} else do_youtube_search(p.alb_id, this.artist, alb_n, this.mb ? alb_info[i].date : "");
                    } t.paint();
                } else if (alb_info.length) {
                    p.loading[p.alb_id] = {"id":p.alb_id,"t":this.lfm_mode + 6}; row_ix[p.alb_id] = i; this.set_row(p.alb_id, 4, this.lfm_mode == 1 ? this.artist : alb_info_lfm[this.lfm_mode][i].artist);
                    plman.ActivePlaylist = pl.tracks; yt_rad.do_youtube_search(p.alb_id, this.lfm_mode == 1 ? this.artist : alb_info_lfm[this.lfm_mode][i].artist, this.lfm_mode == 1 ? alb_info_lfm[1][i].name.strip_remaster() : alb_info_lfm[2][i].title.strip_remaster(), p.alb_id, 1, "", pl.tracks, true);
                }
                break;
        }
        cursor = false; offset = start = end = cx = 0; timer.reset(timer.search_cursor, timer.search_cursori);
    }

    this.set_similar = function() {
        if (do_sim) {this.search_for_similar_artists(load_artist); do_sim = false;} // get similar artists after mouse click trigger if needed
        else {
            txt1_w = txt_w - w.score; txt2_w = w.score;
            if (this.show_similar) {if (sim_nm == this.artist) {this.artists = sim_artists; this.calc_rows_art();} else {this.search_for_similar_artists(this.artist);}}
            else {txt1_w = txt_w * 2 / 3 - w.sp; txt2_w = txt_w / 3; this.artists = this.rel_artists; this.calc_rows_art();}
            window.SetProperty("SYSTEM.Similar Artists", this.show_similar);
        }
    }

    var analyse = function(list, mode) {
        var prime, extra;
        if (mode == 3) {
            if (!data.length) return valid_prime = false;
            alb_info_mb[alb.release_type] = [];
            for (var i = 0; i < data.length; i++) {
                prime = data[i]["primary-type"]; extra = data[i]["secondary-types"].join("").toLowerCase();
                if (!valid_prime) valid_prime = prime ? true : false;
                var comp = extra.indexOf("compilation") != -1, filter, live = extra.indexOf("live") != -1, remix = extra.indexOf("remix") != -1, type;
                var primary = prime == "Album" || prime == "EP" || prime == "Single";
                switch (alb.release_type) {
                    case 0: filter = alb.show_live ? (live || primary) : primary && !live; break;
                    case 1: filter = prime == "Album" && !live && !comp && !remix; break;
                    case 2: filter = comp && !live && !remix; break;
                    case 3: filter =  (prime == "EP" || prime == "Single") && !live && !comp && !remix; break;
                    case 4: filter =  primary && remix; break;
                }
                if (filter) {
                    switch (true) {
                        case remix: type = "Remix " + prime; break;
                        case comp: type = "Compilation"; break;
                        case live: type = "Live" + (prime ? (" " + prime) : ""); break;
                        default: type = prime; break;
                    }
                } else if (alb.show_live && !alb.release_type) {type = "Other"; filter = true;}
                if (filter) alb_info_mb[alb.release_type].push({date: data[i]["first-release-date"].substring(0, 4), name: data[i].title.replace(/’/g, "'"), release_type: type, rg_mbid: data[i].id, prime: prime, extra: extra});
            }
            alb_info = []; alb_info = !alb.mb_sort ? alb_info_mb[alb.release_type] : p.json_sort(alb_info_mb[alb.release_type], "release_type", false);
        } else {
            alb_info_lfm[mode] = [];
            switch (mode) {
                case 0: for (var i = 0; i < list.length; i++) alb_info_lfm[0].push({name: list[i].name, rg_mbid:list[i].mbid, playcount:list[i].playcount, rank:i}); break;
                case 1: for (var i = 0; i < list.length; i++) alb_info_lfm[1].push({name: list[i].title, playcount:list[i].playcount, rank:i}); break;
                case 2: for (var i = 0; i < list.length; i++) alb_info_lfm[2].push({name: list[i].artist + " - " + list[i].title, artist: list[i].artist, title: list[i].title, playcount:list[i].playcount, rank:i}); break;
            }
            alb_info = []; if (alb_info_lfm[alb.lfm_mode].length) {alb_info = alb.lfm_sort ? p.c_sort(alb_info_lfm[alb.lfm_mode]) : alb_info_lfm[alb.lfm_mode];}
        }
    }

    this.toggle = function(n) {
        switch (n) {
            case "lfm_sort":
                this.lfm_sort = !this.lfm_sort; window.SetProperty("SYSTEM.Lfm Sort", this.lfm_sort); if (!alb_info_lfm[this.lfm_mode].length) return;
                this.lfm_sort ? p.c_sort(alb_info_lfm[this.lfm_mode]) : alb_info_lfm[this.lfm_mode].sort(function(a, b) {return parseFloat(a.rank) - parseFloat(b.rank)});
                if (this.mb) return; alb_info = alb_info_lfm[this.lfm_mode]; t.paint(); break;
            case "mb_sort":
                this.mb_sort = !this.mb_sort; window.SetProperty("SYSTEM.Mb Sort", this.mb_sort); if (!alb_info_mb[0].length) return;
                !this.mb_sort ? p.json_sort(alb_info_mb[0], "date", true) : p.json_sort(alb_info_mb[0], "release_type", false);
                if (!this.mb || this.release_type) return; alb_info = alb_info_mb[0]; t.paint(); break;
            case "mode": this.mb = this.mb == 1 ? 0 : 1; text_w = this.mb ? txt_w - w.date - type_width[this.release_type] : !this.lfm_mode ? tx1_w : tx2_w; this.set_txt(); window.SetProperty("SYSTEM.AlbMode", this.mb); this.search_for_album_names(2, this.mb ? 3 : this.lfm_mode, this.songs_mode() ? this.artist_title : this.artist, ar_mbid); break;
            case "more": this.more = !this.more; this.calc_rows(); this.calc_rows_alb(); this.calc_rows_art(); but.refresh(true); window.SetProperty("SYSTEM.More Artists", this.more); break;
            case "show":
                this.show = !this.show; if (p.video_mode) {if (this.show && p.eval("%video_popup_status%") == "visible") fb.RunMainMenuCommand("View/Visualizations/Video");
                if (!this.show && p.eval("%video_popup_status%") == "hidden" && p.IsVideo()) fb.RunMainMenuCommand("View/Visualizations/Video");} window.SetProperty("SYSTEM.Show Albums", this.show);
                if (p.video_mode && rad.pss) {rad.force_refresh = 2; rad.refreshPSS();} timer.reset(timer.vid, timer.vidi); if (p.video_mode && !this.show && p.IsVideo()) timer.video();
                if (!this.show) {cursor = false; offset = start = end = cx = 0; timer.reset(timer.search_cursor, timer.search_cursori);}
                if (this.show && !t.halt()) this.get_albums_fallback(); if (!p.show_images) return; if (ui.blur) img.on_size();
                if (!this.show && img.artistart && p.cycle_art_img) timer.image(); else timer.reset(timer.img, timer.imgi); break;
            case "show_live": this.show_live = !this.show_live; this.release_name[0] = (this.show_live ? "All Releases" : "Releases"); window.SetProperty("SYSTEM.Show Live MB Releases", this.show_live); if (!alb_info_mb[0].length) {t.paint(); return;} alb_info_mb[0] = [];if (!this.mb || this.release_type) return; analyse("", 3); on_album_search_done_callback(); break;
        }
    }

    this.on_char = function(code, force) {
        if (!this.show || t.halt()) return;
        if (force) alb_search = true; timer.reset(timer.search, timer.searchi); timer.search = window.SetTimeout(function() {alb.chooseartist(search_txt, true); timer.search = false; but.refresh(false);}, 1500);
        if (alb_search) {
            var input = String.fromCharCode(code); cursor = true;
            switch(code) {
                case v.enter: this.chooseartist(search_txt, true); alb_search = false; offset = start = end = cx = 0; timer.reset(timer.search_cursor, timer.search_cursori); break;
                case v.redo: lg.push(search_txt); if (lg.length > 30) lg.shift(); if (log.length > 0) search_txt = log.pop() + ""; break;
                case v.undo: log.push(search_txt); if (log.length > 30) lg.shift(); if (lg.length > 0) search_txt = lg.pop() + ""; break;
                case v.selAll: start = 0; end = search_txt.length; break;
                case v.copy: (start != end) && htmlfile.parentWindow.clipboardData.setData('text', search_txt.substring(start, end)); break; case v.cut: (start != end) && htmlfile.parentWindow.clipboardData.setData('text', search_txt.substring(start, end));
                case v.back: record();
                    if (start == end) {if (cx > 0) {search_txt = search_txt.substr(0, cx - 1) + search_txt.substr(cx, search_txt.length - cx); if (offset > 0) offset--; cx--;}}
                    else {if (end - start == search_txt.length) {search_txt = ""; cx = 0;} else {if (start > 0) {var st = start, en = end; start = Math.min(st, en); end = Math.max(st, en); search_txt = search_txt.substring(0, start) + search_txt.substring(end, search_txt.length); cx = start;} else {search_txt = search_txt.substring(end, search_txt.length); cx = start;}}}
                    calc_txt(); offset = offset >= end - start ? offset - end + start : 0; start = cx; end = start; break;
                case "delete": record();
                    if (start == end) {if (cx < search_txt.length) {search_txt = search_txt.substr(0, cx) + search_txt.substr(cx + 1, search_txt.length - cx - 1);}}
                    else {if (end - start == search_txt.length) {search_txt = ""; cx = 0;} else {if (start > 0) {var st = start, en = end; start = Math.min(st, en); end = Math.max(st, en); search_txt = search_txt.substring(0, start) + search_txt.substring(end, search_txt.length); cx = start;} else {search_txt = search_txt.substring(end, search_txt.length); cx = start;}}}
                    calc_txt(); offset = offset >= end - start ? offset - end + start : 0; start = cx; end = start; break;
                case v.paste: input = htmlfile.parentWindow.clipboardData.getData('text');
                default: if (!input) break; record();
                    if (start == end) {search_txt = search_txt.substring(0, cx) + input + search_txt.substring(cx); cx += input.length; end = start = cx;}
                    else if (end > start) {search_txt = search_txt.substring(0, start) + input + search_txt.substring(end); calc_txt(); offset = offset >= end - start ? offset - end + start : 0; cx = start + input.length; start = cx; end = start;}
                    else {search_txt = search_txt.substring(start) + input + search_txt.substring(0, end); calc_txt(); offset = offset < end - start ? offset - end + start : 0; cx = end + input.length; start = cx; end = start;} break;
            }
            if (!timer.search_cursor) timer.search_cursor = window.SetInterval(function() {cursor = !cursor; repaint();}, 530); repaint();
        }
    }

    this.on_key_down = function(vkey) {
        if (!this.show || t.halt()) return;
        switch(vkey) {
            case v.shift: shift = true; shift_x = cx; break;
            case v.pgUp: if (!this.scrollbar_type()) break; this.scrollbar_type().wheel(1, true); break;
            case v.pgDn: if (!this.scrollbar_type()) break; this.scrollbar_type().wheel(-1, true); break;
            case v.left: case v.right: if (!alb_search) break; if (vkey == v.left) {if (offset > 0) {if (cx <= offset) {offset--; cx--;} else cx--;} else if (cx > 0) cx--; start = end = cx} if (vkey == v.right && cx < search_txt.length) cx++; start = end = cx;
            if (shift) {start = Math.min(cx, shift_x); end = Math.max(cx, shift_x);} cursor = true;
            timer.reset(timer.search_cursor, timer.search_cursori); timer.search_cursor = window.SetInterval(function() {cursor = !cursor; repaint();}, 530); break;
            case v.home: case v.end:
            if (alb_search) {if (vkey == v.home) offset = start = end = cx = 0; else start = end = cx = search_txt.length; cursor = true; timer.reset(timer.search_cursor, timer.search_cursori); timer.search_cursor = window.SetInterval(function() {cursor = !cursor; repaint();}, 530);}
            else if (this.scrollbar_type()) {vkey == v.home ? this.scrollbar_type().check_scroll(0) : this.scrollbar_type().check_scroll(((this.scrollbar_type() == 1 ? alb_info.length : art_l) - 1) * ht);}; break;
            case v.del: this.on_char("delete"); break;
        } repaint(); return true;
    }

    this.clear = function() {
        if (search_txt) {
            offset = start = end = cx = 0; alb_search = true; timer.reset(timer.search_cursor, timer.search_cursori);
            timer.search_cursor = window.SetInterval(function() {cursor = !cursor; repaint();}, 530); search_txt = "";
        } else search_txt = !this.songs_mode() ? this.artist : this.artist_title; repaint(); but.refresh(false)}

    var get_ix = function(x, y) {
        var ix;
        if (y > art_y  && y < art_y + art_sp && x >= sel_x && x < sel_x + sel_w) ix = Math.round((y + art_scrollbar.scroll - art_y - ht * 0.5) / ht);
        else if (y < alb_h && x >= sel_x && x < sel_x + sel_w) ix = Math.round((y + alb_scrollbar.scroll - alb_y - ht * 0.5) / ht);
        else ix = -1; return ix;
    }

    var on_similar_search_done = function(list, n) {
        if (!list.length) {list = []; list[0] = {name: "Similar Artists N/A"}}; sim_artists = list.slice(0, 100);
        if (sim_artists.length > 1) {sim_artists[0] = {"name":n + " [Similar]:","score":"Score"};}
        if (alb.show_similar) {alb.artists = sim_artists; alb.calc_rows_art();}
        on_album_search_done_callback();
    }

    var on_albums_search_done = function(list, mbid, rec, mode) {ar_mbid = mbid; ar_id_done = rec; search_done[mode] = rec; if (mode == 3) data = list; analyse(list, mode); on_album_search_done_callback();}
}
var alb = new album_manager(on_album_search_done_callback);

function button_manager() {
    var alb_byDn, alb_byUp, art_byDn, art_byUp, albDn_y, alb_hot_o, albUp_y, artDn_y, art_hot_o, artUp_y, b_x, bx, by, b_w, bw, bh, cross = [], font1, font2, font3, font4, ht = 0, j = 0, margin = 0, mx, my, scr = [], scrollBut_x, top = 0, yt = [], yt_x, yt_y;
    var arrow_sy = window.GetProperty(" Scrollbar Arrow Custom: Icon // Examples", " // ▲  ⮝    ⯅ ⏫ ⏶ ⤊   "), arrow_symb = 0; if (window.GetProperty(" Scrollbar Arrow Custom", false)) try {arrow_symb = arrow_sy.replace(/\s+/g, "").charAt(0);} catch (e) {arrow_symb = 0} if (!arrow_symb.length) arrow_symb = 0;
    var custom_col = window.GetProperty("_CUSTOM COLOURS/FONTS: USE", false), cust_icon_font = window.GetProperty("_Custom.Font Icon [Scroll] (Name,Style[0or1])", "Segoe UI Symbol,0"), icon_f_name= "Segoe UI", icon_f_style = 0, pad = Math.min(Math.max(window.GetProperty(" Scrollbar Arrow Custom: Icon: Vertical Offset %", -24) / 100, -0.5), 0.3);
    if (custom_col) {if (cust_icon_font.length) {cust_icon_font = cust_icon_font.split(","); try {var st = Math.round(parseFloat(cust_icon_font[1])); if (!st) st = 0; var font_test = gdi.Font(cust_icon_font[0], 16, st); icon_f_name = cust_icon_font[0]; icon_f_style = st;} catch (e) {p.trace("JScript Panel is unable to use your scroll icon font. Using Segoe UI instead");}}}
    var b1 = ["all", "album", "comp", "single", "remix", "lock", "toggle", "more", "mode", "cross", "yt"], b2 = ["topalbums", "toptracks", "topsongs", "lock", "toggle", "more", "mode", "cross", "yt"], b3 = ["alb_scrollDn", "alb_scrollUp", "art_scrollDn", "art_scrollUp"], i, tt = window.CreateTooltip("Segoe UI", 15 * ui.scale * window.GetProperty(" Zoom Tooltip (%)", 100) / 100, 0);
    if (!window.GetProperty("SYSTEM.Zoom Update", false) && window.GetProperty("SYSTEM.Software Notice Checked")) window.SetProperty(" Zoom Button Size (%)", window.GetProperty(" Zoom Button Size (%)", 100) / ui.scale); window.SetProperty("SYSTEM.Zoom Update", true);
    var scale = Math.max(window.GetProperty(" Zoom Button Size (%)", 100) / 100, 0.7); window.SetProperty(" Zoom Button Size (%)", scale * 100); this.scale = ui.scale * scale;
    this.b = null; this.btns = []; this.Dn = false; this.yt_w = 22 * this.scale, this.yt_h = 16 * this.scale;
    var scroll = function() {return p.scrollbar_show && alb.show;}
    var scroll_alb = function() {return scroll() && alb_scrollbar.scrollable_lines > 0;}
    var scroll_art = function() {return scroll() && art_scrollbar.scrollable_lines > 0;}
    var tooltip = function(n) {if (tt.text == n) return; tt.text = n; tt.activate();}
    this.create_images = function() {var alpha = [75, 192, 228], col = [ui.textcol & 0x44ffffff, ui.textcol & 0x99ffffff, ui.textcol], g, sz = arrow_symb == 0 ? Math.max(Math.round(p.but_h * 1.666667), 1) : 100, sc = sz / 100; for (j = 0; j < 3; j++) {scr[j] = gdi.CreateImage(sz, sz); g = scr[j].GetGraphics(); g.SetTextRenderingHint(3); g.SetSmoothingMode(2); if (p.scr_col) {arrow_symb == 0 ? g.FillPolygon(col[j], 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(arrow_symb, gdi.Font(icon_f_name, sz, icon_f_style), col[j], 0, sz * pad, sz, sz, StringFormat(1, 1));} else {arrow_symb == 0 ? g.FillPolygon(RGBA(ui.ct, ui.ct, ui.ct, alpha[j]), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(arrow_symb, gdi.Font(icon_f_name, sz, icon_f_style), RGBA(ui.ct, ui.ct, ui.ct, alpha[j]), 0, sz * pad, sz, sz, StringFormat(1, 1));} g.SetSmoothingMode(0); scr[j].ReleaseGraphics(g);}}; this.create_images();
    this.lbtn_dn = function(x, y) {this.move(x, y); if (!this.b) return false; this.Dn = this.b;
        if (scroll()) for (j = 0; j < b3.length; j++) if (this.b == b3[j]) {if (this.btns[this.b].trace(x, y)) this.btns[this.b].down = true; this.btns[this.b].changestate("down");} this.btns[this.b].lbtn_dn(x, y); return true;}
    this.lbtn_up = function(x, y) {this.Dn = false; if (scroll()) for (j = 0; j < b3.length; j++) this.btns[b3[j]].down = false; if (!this.b) return false; if (scroll()) for (j = 0; j < b3.length; j++) if (this.b == b3[j]) this.btns[this.b].changestate(this.btns[this.b].trace(x, y) ? "hover" : "normal"); this.move(x, y); if (!this.b) return false; this.btns[this.b].lbtn_up(x, y); if (this.b && !p.btn_mode && this.b.indexOf("_") == -1) this.refresh(false); return true;}
    this.leave = function() {if (this.b) this.btns[this.b].changestate("normal"); this.b = null; tooltip("");}
    this.on_script_unload = function() {tooltip("");}

    this.draw = function(gr) {
        try {for (i in this.btns) {
            if (p.btn_mode) {if (i == "yt") this.btns[i].draw(gr);}
            else if (!alb.show) {if (i == "yt") this.btns[i].draw(gr);}
            else if (!alb.mb) {for (j = 0; j < b2.length; j++) if (i == b2[j]) this.btns[i].draw(gr);}
            else for (j = 0; j < b1.length; j++) if (i == b1[j]) this.btns[i].draw(gr);
            if (scroll_alb()) for (j = 0; j < 2; j++) if (i == b3[j]) this.btns[i].draw(gr);
            if (scroll_art()) for (j = 2; j < 4; j++) if (i == b3[j]) this.btns[i].draw(gr);
        }} catch (e) {}
    }

    this.move = function(x, y) {
        if (alb_scrollbar.timer_but) {if ((this.btns["alb_scrollUp"].down || this.btns["alb_scrollDn"].down) && !this.btns["alb_scrollUp"].trace(x, y) && !this.btns["alb_scrollDn"].trace(x, y)) {this.btns["alb_scrollUp"].changestate("normal"); this.btns["alb_scrollDn"].changestate("normal"); window.ClearTimeout(alb_scrollbar.timer_but); alb_scrollbar.timer_but = false; alb_scrollbar.count = -1;}}
        else if (art_scrollbar.timer_but) {if ((this.btns["art_scrollUp"].down || this.btns["art_scrollDn"].down) && !this.btns["art_scrollUp"].trace(x, y) && !this.btns["art_scrollDn"].trace(x, y)) {this.btns["art_scrollUp"].changestate("normal"); this.btns["art_scrollDn"].changestate("normal"); window.ClearTimeout(art_scrollbar.timer_but); art_scrollbar.timer_but = false; art_scrollbar.count = -1;}}
        else for (j = 0; j < 4; j++) if (this.b == b3[j] && this.btns[this.b].down) {this.btns[this.b].changestate("down"); this.btns[this.b].l_dn();}
        var b = null, hand = false;
        for (i in this.btns) {
            if (p.btn_mode) {if (i == "yt" && (!this.Dn || this.Dn == "yt")) if (this.btns[i].trace(x, y)) {b = i; hand = true;}}
            else if (!alb.show) {if (i == "yt" && (!this.Dn || this.Dn == "yt")) if (this.btns[i].trace(x, y)) {b = i; hand = true;}}
            else if (!alb.mb) {for (j = 0; j < b2.length; j++) if (i == b2[j] && (!this.Dn || this.Dn == b2[j])) if (this.btns[i].trace(x, y)) {b = i; hand  = true;}}
            else {for (j = 0; j < b1.length; j++) if (i == b1[j] && (!this.Dn || this.Dn == b1[j])) if (this.btns[i].trace(x, y)) {b = i; hand = true;}}
            if (scroll_alb()) for (j = 0; j < 2; j++) if (i == b3[j] && (!this.Dn || this.Dn == b3[j]) && this.btns[i].trace(x, y)) b = i;
            if (scroll_art()) for (j = 2; j < 4; j++) if (i == b3[j] && (!this.Dn || this.Dn == b3[j]) && this.btns[i].trace(x, y)) b = i;
        }
        window.SetCursor(!hand || (this.Dn && this.Dn != this.b) ? 32512 : 32649);
        if (this.b == b) return this.b; if (b && (!this.Dn || this.Dn == b)) this.btns[b].changestate("hover");
        if (this.b) this.btns[this.b].changestate("normal"); this.b = b; if (!this.b) tooltip(""); return this.b;
    }

    this.wheel = function(step) {
        if (p.m_y > by + bh || scale < 0.7 || utils.IsKeyPressed(0x10)) return;
        scale += step * 0.005; scale = Math.max(scale, 0.7); this.scale = ui.scale * scale; this.yt_w = 22 * this.scale, this.yt_h = 16 * this.scale;
        this.refresh(true); alb.calc_rows(); alb.calc_rows_alb(); alb.calc_rows_art();
        window.SetProperty(" Zoom Button Size (%)", scale * 100);
        if (p.btn_mode) {window.MinWidth = window.MaxWidth = this.yt_w; window.MinHeight = window.MaxHeight = this.yt_h;}
    }

    var btn = function(x, y, w, h, type, ft, txt, stat, img_src, down, l_dn, l_up, tooltext) {
        var l = alb.mb ? 1 : 0;
        this.draw = function (gr) {
            if (stat && type < 4) {gr.SetSmoothingMode(2); gr.FillRoundRect(this.x, this.y, this.w, this.h, 6 * but.scale, 6 * but.scale, ui.outline(ui.backcol, true));}
            if (type == 1) {gr.SetSmoothingMode(2);
                if (!ui.dkMode) {var c1 = [RGBA(210, 19, 9, 114), RGBA(227, 222, 248, 100)], c2 = [RGBA(210, 19, 9, 228), RGBA(227, 222, 248, 200)], c3 = [,,RGBA(244, 31, 19, 255), RGBA(238, 234, 251, 228)]; gr.FillRoundRect(this.x, this.y, this.w, this.h, 2 * but.scale, 2 * but.scale, c1[l]); gr.FillRoundRect(this.x, this.y, this.w, this.h - 1, 2 * but.scale, 2 * but.scale, l < 2 ? c2[l] : c3[l]);}
                else {gr.FillRoundRect(this.x, this.y, this.w, this.h, 2 * but.scale, 2 * but.scale, l < 2 ? ui.btnBlur1 : ui.btnBlur2); gr.DrawRoundRect(this.x, this.y, this.w, this.h, 2 * but.scale, 2 * but.scale, 1, l < 2 ? ui.btnBlur3 : ui.btnBlur4);}
            }
            if (type == 1 && ui.dkMode) gr.gdiDrawText(txt, ft, this.img, this.x + 1 * but.scale, this.y, this.w, this.h, t.cc); else if (type < 2) gr.gdiDrawText(txt, ft, this.img, this.x, this.y, this.w, this.h, t.cc);
            if (type == 2) {
                var cc = StringFormat(1, 1), fd1 = 25, fd2 = 42, norm = !p.np_graphic || !rad.full || alb.show ? true : false; gr.SetSmoothingMode(2);
                if (norm || this.img) gr.FillRoundRect(this.x, this.y, 11 * but.scale, 14 * but.scale, 2 * but.scale, 2 * but.scale, RGBA(0, 0, 0, this.img ? 200 : 128));
                gr.FillRoundRect(this.x + (norm || this.img ? 10 : 0) * but.scale, this.y, ((norm || this.img ? 11 : 21) + (p.video_mode ? 1 : 0)) * but.scale, 14 * but.scale, 2 * but.scale, 2 * but.scale, RGBA(255, 255, 255, this.img ? 200 : norm ? 100 : 8));
                gr.SetSmoothingMode(0); gr.SetTextRenderingHint(3);
                if (!norm && !this.img) gr.DrawString("y", font1, RGBA(0, 0, 0, fd1), this.x + 1 + 0 * but.scale, this.y + 1 -5 * but.scale, 12 * but.scale, 20 * but.scale, cc);
                gr.DrawString("y", font1, RGBA(255, 255, 255, this.img ? 200 : norm ? 100 : fd2), this.x + 0 * but.scale, this.y -5 * but.scale, 12 * but.scale, 20 * but.scale, cc);
                gr.DrawString(alb.show || !p.np_graphic ? "T" : p.video_mode ? "V" : "I", font2, RGBA(0, 0, 0, this.img ? 200 : norm ? 150 : fd1), this.x + (!p.video_mode && (norm || this.img) ? 0 : 1) + 10.5 * but.scale, this.y + (norm || this.img ? 0 : 1) -2.8 * but.scale, 11 * but.scale, 20 * but.scale, cc);
                if (!norm && !this.img) gr.DrawString(alb.show || !p.np_graphic ? "T" : p.video_mode ? "V" : "I", font2, RGBA(255, 255, 255, this.img ? 200 : fd2), this.x + 10.5 * but.scale, this.y -2.8 * but.scale, 11 * but.scale, 20 * but.scale, cc);
            }
            if (type == 3) {gr.DrawLine(this.x + ht * 0.67, this.y + ht * 0.67 - 1, this.x + ht * 0.27, this.y + ht * 0.27 - 1, ht / 10, RGBA(136, 136, 136, this.img)); gr.DrawLine(this.x + ht * 0.67, this.y + ht * 0.27 - 1, this.x + ht * 0.27, this.y + ht * 0.67 - 1, ht / 10, RGBA(136, 136, 136, this.img));}
            if (type == 4 || type == 5) if (this.img) gr.DrawImage(this.img, this.x + ft, txt, stat, stat, 0, 0, this.img.Width, this.img.Height, type == 4 ? 0 : 180);
            if (type == 6) {p.theme.SetPartAndStateId(1, this.img); p.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);}
        }

        this.trace = function(x, y) {return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;}
        this.lbtn_dn = function () {this.l_dn && this.l_dn(x, y);}
        this.lbtn_up = function () {this.l_up && this.l_up(x, y);}

        this.changestate = function(state) {
            switch (state) {case "hover": l = alb.mb ? 3 : 2; this.img = this.img_hover; this.ix = 2; tooltip(this.tooltext); break; case "down": this.img = this.img_down; break; default: l = alb.mb ? 1 : 0; this.img = this.img_normal; this.ix = 0;break;}
            if (t.rp) window.RepaintRect(this.x, this.y, this.w + 1, this.h + 1);
        }

        this.ix = 0; this.x = x; this.y = y; this.w = w; this.h = h; this.l_dn = l_dn; this.l_up = l_up; this.tooltext = tooltext;
        this.img_normal = img_src.normal; this.img_hover = img_src.hover || this.img_normal; this.img_down = img_src.down || this.img_normal; this.img = this.img_normal;
    }

    this.refresh = function(upd) {
        if (upd) {
            var bor = alb.border(); bx = p.btn_mode ? 0 : p.w - bor - this.yt_w; by = p.btn_mode ? 0 : bor * 0.625; b_w = 36 * this.scale; bw = 35 * this.scale; bh = 16 * this.scale; ht = alb.fit()[2]; mx = alb.fit()[0]; yt_x = p.rel_imgs == 1 && !p.btn_mode ? bx + bor : bx; yt_y = p.rel_imgs == 1 && !p.btn_mode ? 0 : by;
            font1 =  gdi.Font("segoe ui", scale > 1.05 ? Math.floor(15 * this.scale) : 15 * this.scale, 1); font2 = gdi.Font("segoe ui", 14 * this.scale, 1); font3 = gdi.Font("segoe ui", scale > 1.05 ? Math.floor(11 * this.scale) : 11 * this.scale, 1); font4 = gdi.Font("segoe ui", 12 * this.scale, 1);
            b_x = p.sbar_x; alb_byUp =  alb_scrollbar.y; alb_byDn =  alb_scrollbar.y + alb_scrollbar.h - p.but_h; art_byUp =  art_scrollbar.y; art_byDn =  art_scrollbar.y + art_scrollbar.h - p.but_h;
            if (p.scr_type < 2) {b_x -= 1; alb_hot_o = alb_byUp - alb_scrollbar.text_y; albUp_y = -p.arrow_pad + alb_byUp + (p.but_h - 1 - p.scr_but_w) / 2; albDn_y = p.arrow_pad + alb_byDn + (p.but_h - 1 - p.scr_but_w) / 2; art_hot_o = art_byUp - art_scrollbar.text_y; artUp_y = -p.arrow_pad + art_byUp + (p.but_h - 1 - p.scr_but_w) / 2; artDn_y = p.arrow_pad + art_byDn + (p.but_h - 1 - p.scr_but_w) / 2; scrollBut_x = (p.but_h - p.scr_but_w) / 2;}
        }
        this.btns = {
            all: new btn(bx - b_w * 7, by, bw, bh, 0, font3, "All", alb.release_type == 0 ? true : false, {normal: alb.release_type == 0 ? ui.blend : ui.textcol, hover: ui.blend}, false, "", function() {alb.get_releases("mb", 0);}, alb.release_name[0]),
            album: new btn(bx - b_w * 6, by, bw, bh, 0, font3, "Album", alb.release_type == 1 ? true : false, {normal: alb.release_type == 1 ? ui.blend : ui.textcol, hover: ui.blend}, false, "", function() {alb.get_releases("mb", 1);}, alb.release_name[1]),
            comp: new btn(bx - b_w * 5, by, bw, bh, 0, font3, "Comp", alb.release_type == 2 ? true : false, {normal: alb.release_type == 2 ? ui.blend : ui.textcol, hover: ui.blend}, false, "", function() {alb.get_releases("mb", 2);}, alb.release_name[2]),
            single: new btn(bx - b_w * 4, by, bw, bh, 0, font3, "Single", alb.release_type == 3 ? true : false, {normal: alb.release_type == 3 ? ui.blend : ui.textcol, hover: ui.blend}, false, "", function() {alb.get_releases("mb", 3);}, alb.release_name[3]),
            remix: new btn(bx - b_w * 3, by, bw, bh, 0, font3, "Remix", alb.release_type == 4 ? true : false, {normal: alb.release_type == 4 ? ui.blend : ui.textcol, hover: ui.blend}, false, "", function() {alb.get_releases("mb", 4);}, alb.release_name[4]),
            topalbums: new btn(bx - b_w * 5, by, bw, bh, 0, font3, "Album", alb.lfm_mode == 0 ? true : false, {normal: alb.lfm_mode == 0 ? ui.blend : ui.textcol, hover: ui.blend}, false, "", function() {alb.get_releases("lfm", 0);}, "Top Albums"),
            toptracks: new btn(bx - b_w * 4, by, bw, bh, 0, font3, "Track", alb.lfm_mode == 1 ? true : false, {normal: alb.lfm_mode == 1 ? ui.blend : ui.textcol, hover: ui.blend}, false, "", function() {alb.get_releases("lfm", 1);}, "Top Tracks"),
            topsongs: new btn(bx - b_w * 3, by, bw, bh, 0,  font3, "Song", alb.lfm_mode == 2 ? true : false, {normal: alb.lfm_mode == 2 ? ui.blend : ui.textcol, hover: ui.blend}, false, "", function() {alb.get_releases("lfm", 2);}, "Top Similar Songs"),
            lock: new btn(bx - b_w * 2, by, bw, bh, 0, font3, "Lock",alb.lock_artist ? true : false, {normal: alb.lock_artist ? ui.blend : ui.textcol, hover: ui.blend}, false, "", function() {alb.lockartist();}, alb.lock_artist ? "Unlock" : "Lock: Stop Track Change Updates"),
            toggle: new btn(bx - b_w, by - 1, 13 * this.scale, bh, 0, font1, "≡", "", {normal: ui.textcol, hover: ui.blend}, false, "", function() {alb.show_similar = !alb.show_similar; alb.set_similar(); !alb.more && alb.toggle("more");}, alb.show_similar ? "Show Related Artists" : "Show Similar Artists"),
            more: new btn(bx - b_w + 16 * this.scale, by, 13 * this.scale, bh, 0, font3, "▼", "", {normal: ui.textcol, hover: ui.blend}, false, "", function() {men.button(bx - bw, by + bh)},"Album Manager Settings"),
            mode: new btn(mx, !ui.dkMode ? by : by - 1 * this.scale, (!ui.dkMode ? 71 : alb.mb ? 74 : 46) * this.scale, (!ui.dkMode ? 14 : 15) * but.scale, 1, font4, alb.mb ? "MusicBrainz" : "last.fm", "", {normal: !ui.dkMode ? alb.mb ? RGB(96, 73, 139) : RGB(225, 225, 245) : ui.textcol, hover: !ui.dkMode ? alb.mb ? RGB(52, 23, 107) : RGB(225, 225, 245) : ui.textcol_h}, false, "", function() {alb.toggle("mode")}, alb.mb ? "Switch To Last.fm Mode" : "Switch To MusicBrainz Mode"),
            cross: new btn(p.w - mx - ht * 0.75, alb.fit()[1], ht, ht, 3, "", "", "", {normal: "85", hover: "192"}, false, "", function() {alb.clear()}, (alb.state() ? "Clear Search Text" : "Show Text")),
            yt: new btn(yt_x, yt_y, this.yt_w, this.yt_h, 2, "", "", "", {normal: 0, hover: 1}, false, "", function() {
                    if (p.w > but.yt_w && !p.btn_mode) alb.toggle("show");
                    else men.rbtn_up(bx + but.yt_w / 2, by + but.yt_h / 2);},
                p.w > but.yt_w && !p.btn_mode ? alb.show ? "Show Now Playing" : "Toggle" : "youTube")
        }; t.paint();
        if (p.scrollbar_show) {
            switch (p.scr_type) {
                case 2:
                    this.btns.alb_scrollUp = new btn(b_x, alb_byUp, p.but_h, p.but_h, 6, "", "", "", {normal: 1, hover: 2, down: 3}, false, function() {alb_scrollbar.but(1);}, "", "");
                    this.btns.alb_scrollDn = new btn(b_x, alb_byDn, p.but_h, p.but_h, 6, "", "", "", {normal: 5, hover: 6, down: 7}, false, function() {alb_scrollbar.but(-1);}, "", "");
                    this.btns.art_scrollUp = new btn(b_x, art_byUp, p.but_h, p.but_h, 6, "", "", "", {normal: 1, hover: 2, down: 3}, false, function() {art_scrollbar.but(1);}, "", "");
                    this.btns.art_scrollDn = new btn(b_x, art_byDn, p.but_h, p.but_h, 6, "", "", "", {normal: 5, hover: 6, down: 7}, false, function() {art_scrollbar.but(-1);}, "", "");
                    break;
                default:
                    this.btns.alb_scrollUp = new btn(b_x, alb_byUp - alb_hot_o, p.scr_w, p.scr_w + alb_hot_o, 4, scrollBut_x, albUp_y, p.scr_but_w, {normal: scr[0], hover: scr[1], down: scr[2]}, false, function() {alb_scrollbar.but(1);}, "", "");
                    this.btns.alb_scrollDn = new btn(b_x, alb_byDn, p.scr_w, p.scr_w + alb_hot_o, 5, scrollBut_x, albDn_y, p.scr_but_w, {normal: scr[0], hover: scr[1], down: scr[2]}, false, function() {alb_scrollbar.but(-1);}, "", "");
                    this.btns.art_scrollUp = new btn(b_x, art_byUp - art_hot_o, p.scr_w, p.scr_w + art_hot_o, 4, scrollBut_x, artUp_y, p.scr_but_w, {normal: scr[0], hover: scr[1], down: scr[2]}, false, function() {art_scrollbar.but(1);}, "", "");
                    this.btns.art_scrollDn = new btn(b_x, art_byDn, p.scr_w, p.scr_w + art_hot_o, 5, scrollBut_x, artDn_y, p.scr_but_w, {normal: scr[0], hover: scr[1], down: scr[2]}, false, function() {art_scrollbar.but(-1);}, "", "");
                    break;
            }
        }
    }
}
var but = new button_manager();
if (p.btn_mode) {window.MinWidth = window.MaxWidth = but.yt_w; window.MinHeight = window.MaxHeight = but.yt_h;}
function create_dl_file() {var n = fb.ProfilePath + "yttm\\foo_lastfm_img.vbs"; if (!p.file(n) || p.fs.GetFile(n).Size == "696") {var dl_im = "If (WScript.Arguments.Count <> 2) Then\r\nWScript.Quit\r\nEnd If\r\n\r\nurl = WScript.Arguments(0)\r\nfile = WScript.Arguments(1)\r\n\r\nSet objFSO = Createobject(\"Scripting.FileSystemObject\")\r\nIf objFSO.Fileexists(file) Then\r\nSet objFSO = Nothing\r\nWScript.Quit\r\nEnd If\r\n\r\nSet objXMLHTTP = CreateObject(\"MSXML2.XMLHTTP\")\r\nobjXMLHTTP.open \"GET\", url, false\r\nobjXMLHTTP.send()\r\n\r\nIf objXMLHTTP.Status = 200 Then\r\nSet objADOStream = CreateObject(\"ADODB.Stream\")\r\nobjADOStream.Open\r\nobjADOStream.Type = 1\r\nobjADOStream.Write objXMLHTTP.ResponseBody\r\nobjADOStream.Position = 0\r\nobjADOStream.SaveToFile file\r\nobjADOStream.Close\r\nSet objADOStream = Nothing\r\nEnd If\r\n\r\nSet objFSO = Nothing\r\nSet objXMLHTTP = Nothing"; p.save(n, dl_im, false);}}
if (p.dl_art_img) create_dl_file(); if (p.btn_mode) {p.show_images == false; p.show_video = false;}

function image_manager() {
    var all_files_o_length = 0, alb_id = "", alb_id_o = "", alpha = 255, artist = "", artist_img = false, artistBlur = "", b_aim = [], b_fim = [], blurAutofill = window.GetProperty("ADV.Image Blur Background Auto-Fill", false), bor_w1 = 0, bor_w2 = 0, bp = false, core_img = [], covBlur = window.GetProperty(" Image Blur Background Always Use Cover", false), f_blur = false, f_im = [], folder = "", fresh_artist = true, f_sz = [], i_x = 0, image_path_o = "", imgID = "", imgID_o = "", init = true, ir = false, newalbum = true, new_BlurAlb = false, nw = 0, r = 0, rsimgA = [], rsimgL = [], sh_img = false, transLevel = Math.min(Math.max((100 - window.GetProperty(" Image Smooth Transition Level (0-100)", 92)), 0.1), 100), transIncr = Math.min(Math.max((1.04 + 8 / transLevel * 0.21), 1.09), 1.25), xa = 0, xf = 0, ya = 0, yf = 0, update = 0; if (transLevel == 100) transLevel = 255;
    var a_im = [], a_img = [], a_run = 1; if (p.cycle_art_img) {var a_sz = [], g_valid_tid = 0, ix = 0;}
    this.arr = []; this.artistart = window.GetProperty("SYSTEM.Artist Art", false); this.blurImg = false; this.border = window.GetProperty("SYSTEM.Image Border-1 Shadow-2 Both-3", 0); this.get = true; this.nh = 0; this.ny = 0; this.reflection = window.GetProperty( "SYSTEM.Image Reflection", false); this.smoothTrans = window.GetProperty("SYSTEM.Image Smooth Transition", false);
    this.artist_reset = function() {this.blurCheck(); var artist_o = artistBlur; artist = name.artist(); artistBlur = artist + (!ui.blur ? "" : p.IsVideo()); var new_artist = artist && artistBlur != artist_o || !artist || covBlur && alb_id != alb_id_o; if (new_artist) {folder = p.cleanPth(p.imgArtPth); this.clear_art_cache(); if (p.cycle_art_img) a_run = 1; all_files_o_length = 0; ix = 0;}}
    this.blurCheck = function() {if (!covBlur && !this.smoothTrans) return; alb_id_o = alb_id; alb_id = !p.eval("[%album%]") ? p.eval("%album artist%%path%") : p.eval("%album artist%%album%%discnumber%%date%"); if (alb_id != alb_id_o) new_BlurAlb = true;}
    this.change = function(incr) {ix += incr; if (ix < 0) ix = this.arr.length - 1; else if (ix >= this.arr.length) ix = 0; this.artist_image();}
    this.clear_a_rs_cache = function() {for (var i = 0; i < a_im.length; i++) {rsimgA[i] = false; if (a_im[i]) a_im[i].Dispose(); a_im = [];} for (i = 0; i < b_aim.length; i++) {if (b_aim[i]) b_aim[i].Dispose(); b_aim = [];} rsimgL[1] = false; if (f_im[1]) f_im[1].Dispose(); f_im[1] = false; if (b_fim[1]) b_fim[1].Dispose(); b_fim[1] = false;}
    this.clear_art_cache = function() {if (artist_img) artist_img.Dispose(); for (var i = 0; i < a_img.length; i++) if (a_img[i]) a_img[i].Dispose(); a_img = []; this.arr = []; if (core_img[1]) core_img[1].Dispose(); artist_img = core_img[1] = false; this.clear_a_rs_cache();}
    this.clear_c_rs_cache = function() {rsimgL[0] = false; if (f_im[0]) f_im[0].Dispose(); f_im[0] = false; if (b_fim[0]) b_fim[0].Dispose(); b_fim[0] = false;}
    this.clear_cov_cache = function() {if (core_img[0]) core_img[0].Dispose(); core_img[0] = false; this.clear_c_rs_cache();}
    var exclArr = [6473, 6500, 24104, 35875, 37235, 68626, 86884, 92172];
    this.focus = function() {r++; if (r == 1) {this.on_playback_new_track(); timer.reset(timer.focus, timer.focusi); timer.focus = window.SetTimeout(function() {r = 0; timer.focus = false;}, 250); return;} timer.reset(timer.focus, timer.focusi); timer.focus = window.SetTimeout(function() {img.on_playback_new_track(); r = 0; timer.focus = false;}, 250);}
    this.get_img_fallback = function() {if (!this.get) return; if (p.video_mode && !alb.show) p.set_video(); if (this.artistart && p.cycle_art_img) {timer.image(); this.artist_reset(); update = 0; this.grab_a_img();} else this.grab_f_img(); this.get = false;}
    this.grab_a_img = function() {if (!this.artistart) return; if (a_run || update) {a_run = 0; if (artist) this.read_arr();} this.artist_image();}
    this.grab_f_img = function() {this.blurCheck(); i_x = this.artistart ? 1 : 0; var handle = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem(); if (handle) return utils.GetAlbumArtAsync(window.ID, handle, this.artistart ? 4 : 0); if (fb.IsPlaying) return; core_img[i_x] = this.noimg[2].Clone(0, 0, this.noimg[2].Width, this.noimg[2].Height); if (!core_img[i_x]) return; this.img_c(); core_img[i_x] = this.img_rs("", f_im, i_x, core_img[i_x], f_sz, 0); rsimgL[i_x] = true; this.paint();}
    this.img_c = function() {nw = Math.round(p.rel_imgs != 1 ? p.w : p.w - (this.border > 1 ? 10 : 0)); this.ny = Math.round(p.rel_imgs != 1 ? alb.border() * 0.625 + but.yt_h : 0); this.nh = Math.round(p.rel_imgs != 1 ? Math.min(p.h * p.rel_imgs - this.ny, p.h - this.ny * 2) : p.h - (this.border > 1 && !this.reflection ? 10 : 0)); if (this.border == 1 || this.border == 3) {var i_sz = Math.max(Math.min(this.nh, nw), 0); bor_w1 = !i_sz ? 5 * ui.scale : i_sz > 250 ? 5 * ui.scale : Math.ceil(5 * ui.scale * i_sz / 250);} else bor_w1 = 0; bor_w2 = bor_w1 * 2; nw = Math.max(nw - bor_w2, 10); this.nh = Math.max(this.nh - bor_w2, 10);}
    this.on_key_down = function(vkey) {if (alb.show || !p.show_images) return; switch(vkey) {case v.left: this.wheel(1); break; case v.right: this.wheel(-1); break;} return true;}
    this.on_size = function() {this.img_c(); this.clear_a_rs_cache(); this.clear_c_rs_cache(); if (this.artistart) this.grab_a_img(); else this.grab_f_img(); init = false;}
    this.paint = function() {if (!this.smoothTrans || alb.show) {alpha = 255; t.paint(); return;} imgID_o = imgID; imgID = this.artistart && this.arr.length && p.cycle_art_img ? this.arr[ix] : image_path_o; if (imgID_o != imgID && imgID_o) alpha = transLevel; else alpha = 255; timer.reset(timer.transition, timer.transitioni); timer.transition = window.SetInterval(function() {alpha = Math.min(alpha *= transIncr, 255); t.paint(); if (alpha == 255) timer.reset(timer.transition, timer.transitioni);}, 12);}
    var refl_mask = false, reflSetup = window.GetProperty(" Image Reflection Setting (0-100)", "Strength,14.5,Size,100,Gradient,10").split(",");
    var reflAlpha = parseFloat(reflSetup[1]), reflSlope = parseFloat(reflSetup[5]), reflSz = parseFloat(reflSetup[3]); if (isNaN(reflAlpha)) reflAlpha = 14.5; reflAlpha =  255 * reflAlpha / 100; reflAlpha = Math.max(Math.min(reflAlpha, 255), 0);  if (isNaN(reflSlope)) reflSlope = 10; reflSlope /= 10; reflSlope = Math.max(Math.min(reflSlope - 1, 9), -1); if (isNaN(reflSz)) reflSz = 100; reflSz /= 100; reflSz = Math.max(Math.min(reflSz, 1), 0.1);
    this.setReflStrength = function(n) {reflAlpha += n; reflAlpha = Math.max(Math.min(reflAlpha, 255), 0); window.SetProperty(" Image Reflection Setting (0-100)", "Strength," + Math.round(reflAlpha / 2.55) + ",Size," + reflSetup[3] + ",Gradient," + reflSetup[5]); if (refl_mask) refl_mask.Dispose(); refl_mask = false; bp = true; if (this.artistart && p.cycle_art_img) this.clear_a_rs_cache(); if (this.artistart) this.grab_a_img(); else this.grab_f_img();}
    var shuffle = function(ary) {for (var i = ary.length - 1; i >= 0; i--) {var randomIndex = Math.floor(Math.random() * (i + 1)), itemAtIndex = ary[randomIndex]; ary[randomIndex] = ary[i]; ary[i] = itemAtIndex;} return ary;}
    var uniq = function(a) {var j = 0, len = a.length, out = [], seen = {}; for (var i = 0; i < len; i++) {var item = a[i]; if (seen[item] !== 1) {seen[item] = 1; out[j++] = item;}} return out;}
    this.update = function() {update = 1; if (t.block()) return; this.grab_a_img(); update = 0;}
    this.wheel = function(step) {switch (utils.IsKeyPressed(0x10)){case false: if (!this.artistart || !p.cycle_art_img) break; if (this.arr.length < 2) break; this.change(-step); if (this.artistart && p.cycle_art_img) timer.image(); break; case true: if (this.reflection) this.setReflStrength(-step * 5); break;}}

    this.on_playback_new_track = function() {
        ir = fb.PlaybackLength <= 0 ? 1 : 0; p.vid_chk();
        if (!p.np_graphic || alb.show && !ui.blur || t.block()) {this.get = true;}
        else {if (p.video_mode && !alb.show) p.set_video();
            if (this.artistart && p.cycle_art_img) {if (!ir || !fb.IsPlaying) {timer.image(); this.artist_reset(); this.grab_a_img();}}
            else this.grab_f_img(); this.get = false;}
    }

    this.on_playback_dynamic_track = function() {
        timer.reset(timer.vid, timer.vidi);
        if (!p.show_images || alb.show && !ui.blur || t.block()) this.get = true;
        else {
            if (this.artistart && p.cycle_art_img) {timer.image(); this.artist_reset(); this.grab_a_img();}
            else if (this.artistart) this.grab_f_img(); this.get = false;
        }
    }

    this.get_album_art_done = function(image, image_path) {
        if (image_path_o == image_path && f_im[i_x] && image && !bp) {core_img[i_x] = f_im[i_x].Clone(0, 0, f_im[i_x].Width, f_im[i_x].Height); xf = f_sz[i_x].x; yf = f_sz[i_x].y; rsimgL[i_x] = true; return this.paint();}
        image_path_o = image_path + (!ui.blur ? "" : p.IsVideo()); this.clear_cov_cache(); core_img[i_x] = image;
        if (!core_img[i_x]) {core_img[i_x] = this.artistart ? this.noimg[1].Clone(0, 0, this.noimg[1].Width, this.noimg[1].Height) : this.noimg[0].Clone(0, 0, this.noimg[0].Width, this.noimg[0].Height);} if (!core_img[i_x]) return;
        this.img_c(); core_img[i_x] = this.img_rs("", f_im, i_x, core_img[i_x], f_sz , 0); rsimgL[i_x] = true; this.paint();
    }

    this.read_arr = function() {
        if (!p.dl_art_img) timer.decelerating();
        var all_files = utils.Glob(folder + "*").toArray();
        if (all_files.length == all_files_o_length) return;
        var newArr = false;
        var j = 0; if (!this.arr.length) {newArr = true; for (j = 0; j < a_im.length; j++) {rsimgA[j] = false; if (a_im[j]) a_im[j].Dispose(); a_im = [];} for (j = 0; j < a_img.length; j++)  if (a_img[j]) a_img[j].Dispose(); a_img = [];}
        all_files_o_length = all_files.length;
        var incl_lge = 0; // 0 & 1 - exclude & include artist images > 8 MB
        for (j = 0; j < all_files.length; j++) {
            if (p.fs.GetFile(all_files[j]).Size >= 8388608 && !incl_lge) continue;
            if ((/_([a-z0-9]){32}\.jpg$/).test(p.fs.GetFileName(all_files[j])) || (/(?:jpe?g|gif|png|bmp)$/i).test(p.fs.GetExtensionName(all_files[j])) && !(/ - /).test(p.fs.GetBaseName(all_files[j]))) {
                var bAdd = true; if (bAdd) for (var h = 0; h < exclArr.length; h++) if (p.fs.GetFile(all_files[j]).Size == exclArr[h]) {bAdd = false; break;}
                if (bAdd) this.arr.push(all_files[j]);}}
        if (this.arr.length > 1) this.arr = uniq(this.arr); if (newArr && this.arr.length > 1) this.arr = shuffle(this.arr);
    }

    this.artist_image = function() {
        if (this.arr.length > 0) {
            if (a_im[ix]) {artist_img = a_im[ix]; xa = a_sz[ix].x; ya = a_sz[ix].y; rsimgA[ix] = true; this.paint();}
            else if (a_img[ix]) {artist_img = a_img[ix]; this.img_c(); artist_img = this.img_rs(a_img, a_im, ix, artist_img, a_sz, 1); this.paint();}
            else {g_valid_tid = gdi.LoadImageAsync(window.ID, this.arr[ix]);}
        } else if (!init) this.grab_f_img();
    }

    this.load_done = function(tid, image) {
        if (g_valid_tid != tid) return;
        artist_img = image; if (!artist_img) {this.arr.splice(ix, 1); if (this.arr.length > 1) this.change(1); return;}
        artist_img = this.img_rs(a_img, a_im, ix, artist_img, a_sz, 1); this.paint();
    }

    this.img_rs = function(p_img, p_im, i, image, o_sz, n) {
        try {
            if (!image) return;
            var s = Math.min(this.nh / image.Height, nw / image.Width), tw = Math.round(image.Width * s), th = Math.round(image.Height * s), tx = Math.round((nw - tw) / 2), ty = Math.round((this.nh - th) / 2 + this.ny);
            switch (n) {case 0: xf = tx; yf = ty; break; case 1: xa = tx; ya = ty; p_img[i] = image; break;} o_sz[i] = {"x": tx, "y": ty};
            switch (this.border) {
                case 0:
                    p_im[i] = image.Clone(0, 0, image.Width, image.Height); p_im[i] = p_im[i].Resize(tw, th, 2);
                    if (this.reflection) {p_im[i] = this.refl_img(p_im[i], i, tx, ty, tw, th, o_sz); tx = o_sz[i].x; ty = o_sz[i].y;}
                    if (ui.blur && p_im[i]) {
                        if (!this.smoothTrans) p_im[i] = this.blur_img(image, p_im[i], tx, ty, p_im[i].Width, p_im[i].Height);
                        else {if (n) b_aim[i] = this.blur_img(image, p_im[i], tx, ty, p_im[i].Width, p_im[i].Height); else b_fim[i] = this.blur_img(image, p_im[i], tx, ty, p_im[i].Width, p_im[i].Height);}
                    }
                    if (n) rsimgA[i] = true; else rsimgL[i] = true; return p_im[i];
                default:
                    p_im[i] = image.Clone(0, 0, image.Width, image.Height);
                    var imgb = 0; if (this.border > 1 && !this.reflection) {var imgo = 7,  dpiCorr = (ui.scale - 1) * imgo, imb = imgo - dpiCorr; imgb = 15 + dpiCorr; sh_img = gdi.CreateImage(Math.floor(tw + bor_w2 + imb), Math.floor(th + bor_w2 + imb)); var gb = sh_img.GetGraphics(); gb.FillSolidRect(imgo, imgo, tw + bor_w2 - imgb, th + bor_w2 - imgb, RGB(0, 0, 0)); sh_img.ReleaseGraphics(gb); sh_img.StackBlur(12);}
                    var bor_img = gdi.CreateImage(Math.floor(tw + bor_w2 + imgb), Math.floor(th + bor_w2 + imgb)); var gb = bor_img.GetGraphics();
                    if (this.border > 1 && !this.reflection) gb.DrawImage(sh_img, 0, 0, Math.floor(tw + bor_w2 + imgb), Math.floor(th + bor_w2 + imgb), 0, 0, sh_img.Width, sh_img.Height);
                    if (this.border == 1 || this.border == 3) gb.FillSolidRect(0, 0, tw + bor_w2, th + bor_w2, RGB(255, 255, 255));
                    image = image.Resize(tw, th, 2); gb.DrawImage(image, bor_w1, bor_w1, image.Width, image.Height, 0, 0, image.Width, image.Height);
                    bor_img.ReleaseGraphics(gb); if (sh_img) sh_img.Dispose(); sh_img = false;
                    if (this.reflection) {bor_img = this.refl_img(bor_img, i, tx, ty, bor_img.Width, bor_img.Height, o_sz); tx = o_sz[i].x; ty = o_sz[i].y;}
                    if (ui.blur && bor_img ) {
                        if (!this.smoothTrans) bor_img = this.blur_img(p_im[i], bor_img, tx, ty, bor_img.Width, bor_img.Height);
                        else {if (n) b_aim[i] = this.blur_img(p_im[i], bor_img, tx, ty, bor_img.Width, bor_img.Height); else b_fim[i] = this.blur_img(p_im[i], bor_img, tx, ty, bor_img.Width, bor_img.Height);}
                    }
                    p_im[i] = bor_img; if (n) rsimgA[i] = true; else rsimgL[i] = true; return bor_img;
            }} catch (e) {}
    }

    this.blur_img = function(image, im, x, y, w, h) {
        if (!image || !im || !p.w || !p.h) return;
        if (covBlur && this.artistart && new_BlurAlb) {
            if (f_blur) f_blur.Dispose(); f_blur = false;
            var handle = fb.IsPlaying && !p.focus ? fb.GetNowPlaying() : fb.GetFocusItem(); if (handle) f_blur = utils.GetAlbumArtV2(handle, 0);
            if (!f_blur) f_blur = this.noimg[0].Clone(0, 0, this.noimg[0].Width, this.noimg[0].Height); new_BlurAlb = false; if (f_blur && !blurAutofill) f_blur = f_blur.Resize(p.w, p.h);
        }
        if (covBlur && this.artistart && f_blur) image = f_blur;
        this.blurImg = gdi.CreateImage(p.w, p.h), g = this.blurImg.GetGraphics(); g.SetInterpolationMode(0);
        if (blurAutofill) {var s1 = image.Width / p.w, s2 = image.Height / p.h; if (s1 > s2) {var imgw = Math.round(p.w * s2), imgh = image.Height, imgx = Math.round((image.Width - imgw) / 2), imgy = 0;} else {var imgw = image.Width, imgh = Math.round(p.h * s1), imgx = 0, imgy = Math.round((image.Height - imgh) / 8);} image = image.Clone(imgx, imgy, imgw, imgh);}
        if (ui.blur_blend) {
            var iSmall = image.Resize(p.w * ui.blurLevel / 100, p.h * ui.blurLevel / 100, 2), iFull = iSmall.resize(p.w, p.h, 2), offset = 90 - ui.blurLevel;
            g.DrawImage(iFull, 0 - offset, 0 - offset, p.w + offset * 2, p.h + offset * 2, 0, 0, iFull.Width, iFull.Height, 0, 63 * ui.blurAlpha);
        } else {
            g.DrawImage(image, 0, 0, p.w, p.h, 0, 0, image.Width, image.Height); if (ui.blurLevel > 1) this.blurImg.StackBlur(ui.blurLevel);
            var colorScheme_array = this.blurImg.GetColourScheme(1).toArray(), light_cover = ui.get_textselcol(colorScheme_array[0], true) == 50 ? true : false;
            g.FillSolidRect(0, 0, p.w, p.h, light_cover ? ui.bg_color_light : ui.bg_color_dark);
        }
        if (!alb.show && (!p.show_video || !p.IsVideo())&& !this.smoothTrans) g.DrawImage(im, x, y, w, h, 0, 0, im.Width, im.Height); this.blurImg.ReleaseGraphics(g);
        return this.blurImg;
    }

    this.refl_img = function(image, i, x, y, w, h, o_sz) {
        if (!refl_mask) {refl_mask = gdi.CreateImage(500, 500), gb = refl_mask.GetGraphics(), km = reflSlope != -1 ? reflAlpha / 500 + reflSlope  / 10 : 0; for (var k = 0; k < 500; k++) {var c = 255 - Math.min(Math.max(reflAlpha - k * km, 0), 255); gb.FillSolidRect(0, k, 500, 1, RGB(c, c, c));} refl_mask.ReleaseGraphics(gb);}
        var ref_sz = Math.round(Math.min(p.h - y - h, image.Height * reflSz)); if (ref_sz <= 0) return image; var refl = image.Clone(0, image.Height - ref_sz, image.Width, ref_sz), r_mask = refl_mask.Clone(0, 0, refl_mask.Width, refl_mask.Height); if (refl) {r_mask = r_mask.Resize(refl.Width, refl.Height); refl.RotateFlip(6); refl.ApplyMask(r_mask);} var reflImg = gdi.CreateImage(w, h + ref_sz), gb = reflImg.GetGraphics(); gb.DrawImage(image, 0, 0, w, h, 0, 0, w, h); gb.DrawImage(refl, 0, h, w, h, 0, 0, w, h); o_sz[i].h = h + ref_sz; reflImg.ReleaseGraphics(gb);
        if (r_mask) r_mask.Dispose(); if (refl) refl.Dispose(); return reflImg;
    }

    this.draw = function(gr) {
        this.get_img_fallback(); if (!p.show_images || alb.show && !ui.blur) return;
        try {var artArr = this.artistart && this.arr.length;
            if (artArr && !rsimgA[ix]) return; if (!artArr && !rsimgL[i_x]) return;
            var pic = artArr ? artist_img : core_img[i_x]; if (!pic) return;
            if (ui.blur && this.smoothTrans) {var arr = artArr ? b_aim : b_fim, ex = artArr ? ix : i_x; if (arr[ex]) gr.DrawImage(arr[ex], 0, 0, arr[ex].Width, arr[ex].Height, 0, 0, arr[ex].Width, arr[ex].Height);}
            if (!ui.blur || this.smoothTrans) {if (!alb.show && (!p.show_video || !p.IsVideo())) {if (artArr) gr.DrawImage(pic, xa, ya, pic.Width, pic.Height, 0, 0, pic.Width, pic.Height, 0, alpha); else gr.DrawImage(pic, xf, yf, pic.Width, pic.Height, 0, 0, pic.Width, pic.Height, 0, alpha);}}
            else gr.DrawImage(pic, 0, 0, pic.Width, pic.Height, 0, 0, pic.Width, pic.Height, 0, alpha);} catch (e) {}
    }

    this.lbtn_up = function(x, y) {
        if (y > Math.min(p.h * p.rel_imgs, p.h - this.ny)) {rad.text_toggle(); t.repaint();}
        else {
            this.artistart = !this.artistart; window.SetProperty("SYSTEM.Artist Art", this.artistart);
            if (this.artistart && p.cycle_art_img) {this.grab_a_img(this.artist_reset()); timer.image();}
            else {this.grab_f_img(); timer.reset(timer.img, timer.imgi);}
        }
    }

    this.create_images = function() {
        var cc = StringFormat(1, 1), font1 = gdi.Font("Segoe UI", 270, 1), font2 = gdi.Font("Segoe UI", 120, 1), font3 = gdi.Font("Segoe UI", 200, 1), font4 = gdi.Font("Segoe UI", 90, 1), gb, tcol = !ui.blur_dark && !ui.blur_light || (this.border != 1 && this.border != 3) ? ui.textcol : ui.dui ? window.GetColourDUI(0) : window.GetColourCUI(0);
        this.noimg = ["COVER", "PHOTO", "SELECTION"];
        for (var i = 0; i < this.noimg.length; i++) {
            var n = this.noimg[i];
            this.noimg[i] = gdi.CreateImage(500, 500);
            gb = this.noimg[i].GetGraphics(); gb.SetSmoothingMode(2);
            if (!ui.blur_dark && !ui.blur_light || this.border == 1 || this.border == 3) {gb.FillSolidRect(0, 0, 500, 500, tcol); gb.FillGradRect(-1, 0, 505, 500, 90, ui.backcol & 0xbbffffff, ui.backcol, 1.0);}
            gb.SetTextRenderingHint(3);
            gb.DrawString("NO", i == 2 ? font3 : font1, tcol & 0x25ffffff, 0, 0, 500, 275, cc);
            gb.DrawString(n, i == 2 ? font4 : font2, tcol & 0x20ffffff, 2.5, 175, 500, 275, cc);
            gb.FillSolidRect(60, 388, 380, 50, tcol & 0x15ffffff);
            this.noimg[i].ReleaseGraphics(gb);
        } this.get = true;
    }
    this.create_images();
}
if (p.np_graphic) var img = new image_manager();

function dl_art_images() {
    var dl_ar = "";
    this.run = function() {
        if (!p.file(fb.ProfilePath + "yttm\\foo_lastfm_img.vbs")) return;  var img_folder, n_artist = name.artist(); if (n_artist == dl_ar || n_artist == "") return; dl_ar = n_artist; img_folder = p.cleanPth(p.imgArtPth);
        if (!p.img_exp(img_folder, p.Thirty_Days)) return; var lfm_art = new lfm_art_img(function() {lfm_art.on_state_change();}); lfm_art.Search(dl_ar, img_folder);
    }
}
if (p.dl_art_img) var dl_art = new dl_art_images();

function lfm_art_img(state_callback) {
    var dl_ar, img_folder; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = false;

    this.on_state_change = function() {
        if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {
            window.ClearTimeout(this.ie_timer); this.ie_timer = false;
            if (this.xmlhttp.status == 200) this.func();
            else {p.trace("download artist images N/A: " + dl_ar + ": none found" + " Status error: " + this.xmlhttp.status);}
        }
    }

    this.Search = function(p_dl_ar, p_img_folder) {
        dl_ar = p_dl_ar; img_folder = p_img_folder; if (p.np_graphic) timer.decelerating();
        this.func = null; this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        var URL = "https://www.last.fm/music/" + encodeURIComponent(dl_ar) + "/+images"; // <- edit to use custom local lastfm domain
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; this.xmlhttp.send();
        if (!this.ie_timer) {var a = this.xmlhttp, that = this; this.ie_timer = window.SetTimeout(function() {a.abort(); that.ie_timer = false;}, 30000);}
    }

    this.Analyse = function() {
        var artist = dl_ar.clean(), doc = new ActiveXObject("htmlfile"); doc.open();
        var div = doc.createElement("div"); div.innerHTML = this.xmlhttp.responsetext;
        var list = div.getElementsByTagName("img"), links = []; if (!list) return; for (var i = 0; i < list.length; i++) if (list[i].className == "image-list-image") links.push(list[i].src.replace("avatar170s/", ""));
        if (links.length) {p.buildFullPth(img_folder); if (p.folder(img_folder)) {p.save(img_folder + "update.txt", "", true); for (var j = 0; j < Math.min(links.length, 5); j++)
            p.run("cscript //nologo \"" + fb.ProfilePath + "yttm\\foo_lastfm_img.vbs\" \"" + links[j] + "\" \"" + img_folder + artist + "_" + links[j].substring(links[j].lastIndexOf("/") + 1) + ".jpg" + "\"", 0);}}  doc.close();
    }
}

function timers() {
    var timer_arr = ["dl", "focus", "img", "search", "search_cursor", "sim1", "sim2", "transition", "vid", "yt", "zSearch"];
    for (var i = 0; i < timer_arr.length; i++) {this[timer_arr[i]] = false; this[timer_arr[i] + "i"] = i;} this.rad_chk = true; this.step = 0;
    this.reset = function(timer, n) {if (timer) window.ClearTimeout(timer); this[timer_arr[n]] = false;}
    this.res = function() {img.update(); this.reset(this.dl, this.dli);}
    this.decelerating = function() {this.reset(this.dl, this.dli); this.dl = window.SetTimeout(function() {timer.res(); timer.dl = window.SetTimeout(function() {timer.res(); timer.dl = window.SetTimeout(function() {timer.res(); timer.dl = window.SetTimeout(function() {timer.res(); timer.dl = window.SetTimeout(function() {timer.res(); timer.dl = window.SetTimeout(function() {timer.res(); timer.dl = window.SetTimeout(function() {timer.res(); timer.dl = window.SetTimeout(function() {timer.res();}, 7000)}, 6000)}, 5000)}, 4000)}, 3000)}, 2000)}, 1000)}, 1000);}
    this.image = function() {this.reset(this.img, this.imgi); this.img = window.SetInterval(function() {if (!p.show_images || !img.artistart || alb.show || t.block() || p.video_mode && p.IsVideo() || ui.zoom()) return; if (img.arr.length < 2) return; img.change(1);}, p.cycle * 1000);}
    this.radio = function() {if (!this.rad_chk || !rad.auto || (plman.PlayingPlaylist != pl.rad)) return; var np = plman.GetPlayingItemLocation(); if (!np.IsValid) return; var pid = np.PlaylistItemIndex, pn = pl.rad; if (plman.PlaylistItemCount(pn) > pid + 1) return this.rad_chk = false; rad.on_playback_new_track();}
    this.video = function() {this.vid = window.SetInterval(function() {timer.videoState();}, 50);}
    this.videoState = function() {if (p.btn_mode || !p.video_mode || t.visible == t.block()) return; t.visible = t.block(); if (t.block()) if (p.eval("%video_popup_status%") == "visible") {img.get = true; fb.RunMainMenuCommand("View/Visualizations/Video"); this.reset(this.vid, this.vidi);}}
}
var timer = new timers(); if (!alb.show && p.np_graphic) p.set_video();

function on_album_search_done_callback() {alb.calc_rows_alb(); t.paint();}
function on_get_album_art_done(metadb, art_id, image, image_path) {img.get_album_art_done(image, image_path);}
function on_item_focus_change() {if (!t.block() && !alb.show && !ui.blur) t.repaint(); if (fb.IsPlaying) return; if (p.np_graphic) {if (t.block()) {img.get = true; img.artist_reset();} else {img.get = false;}} if (!alb.show) {if (!ui.blur) t.repaint(); alb.get = true;} if ((!alb.show || ui.blur) && p.np_graphic) img.focus(); timer.reset(timer.zSearch, timer.zSearchi); timer.zSearch = window.SetTimeout(function() {if (!alb.lock_artist) alb.orig_artist = alb.artist = name.artist(); if (alb.show) alb.focus(); if (p.np_graphic && p.dl_art_img) dl_art.run(); timer.zSearch = false;}, 1000);}
function on_load_image_done(tid, image) {img.load_done(tid, image);}
function on_metadb_changed() {if (p.ir()) return; if (!t.block() && !alb.show && !ui.blur) t.repaint(); if (p.np_graphic) img.focus(); timer.reset(timer.zSearch, timer.zSearchi); timer.zSearch = window.SetTimeout(function() {alb.focus(); if (p.np_graphic && p.dl_art_img) dl_art.run(); timer.zSearch = false;}, 500);}
function on_playback_stop(reason) {if (reason == 2) return; on_item_focus_change();}
function on_size() {t.rp = false; p.w = window.Width; p.h = window.Height; if (!p.w || !p.h) return; p.on_size(); ui.get_font(); but.refresh(true); if (p.np_graphic) img.on_size(); rad.on_size(); t.rp = true;}
function on_paint(gr) {ui.draw(gr); if (p.np_graphic) img.draw(gr); if (!alb.show) rad.draw(gr); else alb.draw(gr); but.draw(gr);}

function on_playback_new_track() {
    ml.Execute(); if (ml.upd_yt_mtags|| ml.upd_lib_mtags) upd_mtags.Execute();
    if (!alb.lock_artist) alb.orig_artist = alb.artist = name.artist();
    if (fb.PlaybackLength > 0) timer.reset(timer.dl, timer.dli);
    if (p.np_graphic) img.on_playback_new_track();
    if (p.dl_art_img && fb.PlaybackLength > 0) dl_art.run();
    rad.remove_played();
    rad.on_playback_new_track();
    alb.on_playback_new_track();
}

function on_playback_dynamic_info_track() {
    if (!alb.lock_artist) alb.orig_artist = alb.artist = name.artist();
    timer.reset(timer.dl, timer.dli);
    if (p.show_images) img.on_playback_dynamic_track();
    if (p.dl_art_img) dl_art.run();
    alb.on_playback_new_track();
}

function menu_object() {
    var a_n = "", an = "", a_t = "", ar_n = "", alb_playlist = false, artis = "", fn, get_source = "", c_t = "Singles Chart", lib_n = [!ml.mtags_installed ? "Library Options N/A: m-TAGS Not Installed" : "To Use m-TAGS: Set Album Build Type From Options Below", "To Add m-TAGS To Library, Set Media Library To Monitor: foobar2000\\yttm\\albums", "YouTube Tracks", "Prefer Library Tracks", "Library Tracks"], MenuMap = [], MF_GRAYED = 0x00000001, MF_SEPARATOR = 0x00000800, MF_STRING = 0x00000000, obj, pl_active, rad_on, rn = [], t50_n = "", title = "", v_id = "";
    this.NewMenuItem = function(index, type, value) {MenuMap[index] = [{type: ""},{value: 0}]; MenuMap[index].type = type; MenuMap[index].value = value;}

    this.TrackMenu = function(Menu, StartIndex) {
        var Index = StartIndex;
        a_n = t50_n = name.art(); an = a_n.replace(/&/g, "&&"); a_t = name.artist_title(); ar_n = name.artist(); pl_active = pl.active(); rad_on = rad.on() || rad.auto && plman.PlayingPlaylist == pl.rad;
        for (var i = 0; i < 4; i++) {
            this.NewMenuItem(Index, "New", i + 1); var available = false; rn[i] = (i == 0 || i == 2) ? (ar_n ? ar_n : "N/A") : i == 1 ? name.genre() : a_t;
            if (p.use_saved) {
                if (index.mode) {var rs = rn[i].clean(); available =
                    p.file(rad.f2 + rs.substr(0, 1).toLowerCase() + "\\" + rs + (i < 2 ? ".json" : i == 2 ? " And Similar Artists.json" :  i == 3 ? " [Similar Songs].json" : " - Top Artists.json")) ||
                    p.file(rad.f2 + rs.substr(0, 1).toLowerCase() + "\\" + rs + " [curr]" + (i < 2 ? ".json" : i == 2 ? " And Similar Artists.json" :  i == 3 ? " [Similar Songs].json" : " - Top Artists.json"))
                } else {var all_files = index.best_saved_match(rn[i], i); if (all_files.length) available = true;}
            }
            rn[i] = p.use_saved && !available ? "N/A" : rn[i]; if (index.mode == 3 && i == 3) rn[i] = "N/A"; var na_arr = ["Artist ", "Genre ", "Similar Artists ", "Similar Songs "];
            Menu.AppendMenuItem(rn[i] == "N/A" ? MF_GRAYED : MF_STRING, Index,rn[i] == "N/A" ? na_arr[i] + (p.use_saved ? "- Saved N/A" : "N/A")  + (index.mode == 3 && i == 3 ? " - " + index.n[3] + " Mode" : "") : rn[i].replace(/&/g, "&&") + (i == 2 ? " And Similar Artists" : "")); Index++;
        } Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        return Index;
    }

    this.AlbumTypeMenu = function(Menu, StartIndex) {var Index = StartIndex; for (var i = 0; i < (ml.mtags_installed ? lib_n.length : 1); i++) {this.NewMenuItem(Index, "Album", i + 1); Menu.AppendMenuItem(i < 2 ? MF_GRAYED : ml.mtags_installed ? MF_STRING : MF_GRAYED, Index, lib_n[i]); Menu.CheckMenuItem(Index++, i > 1 && ml.alb == i - 1);} return Index;}
    this.ArtistTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, n = ["Favour Higher Similarity (Recommended)", "Random Pick"]; for (var i = 0; i < n.length; i++) {this.NewMenuItem(Index, "Artist", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++;} Menu.CheckMenuRadioItem(StartIndex, StartIndex + 1, StartIndex + index.random_artist); return Index;}
    this.button = function(x, y) {var menu = window.CreatePopupMenu(), idx, Index = 1; Index = this.MoreMenu(menu, Index); idx = menu.TrackPopupMenu(x, y); if (idx >= 1 && idx <= Index) {var i = MenuMap[idx].value; switch (i) {case 1: alb.toggle("show_live"); break; case 2: alb.toggle("mb_sort"); break; case 3: alb.toggle("lfm_sort"); break; case 4: alb.toggle("more"); alb.more && alb.set_similar(); break; case 5: window.Reload(); break;}} menu.Dispose();}
    this.CancelTypeMenu = function(Menu, StartIndex) {var Index = StartIndex; this.NewMenuItem(Index, "Cancel",1); Menu.AppendMenuItem(MF_STRING, Index, "Cancel iSelect Search"); Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++; return Index;}
    this.ChooseArtistTypeMenu = function(Menu, StartIndex) {var Index = StartIndex; this.NewMenuItem(Index, "Search", 1); Menu.AppendMenuItem(MF_STRING, Index, "Choose"); Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++; return Index;}
    this.DefaultMenu = function(Menu, StartIndex) {var Index = StartIndex, n = ["Panel Properties", "Configure..."]; Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); for (var i = 0; i < 2; i++) {this.NewMenuItem(Index, "Default", i + 1); if (!i || i && utils.IsKeyPressed(0x10)) Menu.AppendMenuItem(MF_STRING, Index++, n[i]);} return Index;}
    this.GenreTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, n = ["Artists", "Tracks"]; for (var i = 0; i < n.length; i++) {this.NewMenuItem(Index, "Genre", i + 1); Menu.AppendMenuItem(MF_STRING, Index, "Top " + n[i]); Index++;} Menu.CheckMenuRadioItem(StartIndex, StartIndex + 1, StartIndex + index.genre_tracks); return Index;}
    this.ImageTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, n = ["Smooth Transition", "Reflection", "Border", "Shadow"], c = [img.smoothTrans, img.reflection, img.border == 1 || img.border == 3, img.border > 1]; for (var i = 0; i < n.length; i++) {this.NewMenuItem(Index, "Image", i + 1); Menu.AppendMenuItem(!img.reflection || i != 3 ? MF_STRING : MF_GRAYED, Index, n[i]); Menu.CheckMenuItem(Index++, c[i]); if (!i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} return Index;}
    this.LibFilterTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, n = []; for (var i = 0; i < lib.filter.length; i++) n.push(lib.filter[i]); for (i = 0; i < n.length; i++) {this.NewMenuItem(Index, "LibFilter", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++; if (!i)  Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} Menu.CheckMenuRadioItem(StartIndex, StartIndex + lib.filter.length - 1, StartIndex + lib.filterID); return Index;}
    this.LibOptTypeMenu = function(Menu, StartIndex) {var Index = StartIndex; this.NewMenuItem(Index, "LibraryOpt",1); return Index;}
    this.LibTypeMenu = function(Menu, StartIndex) {var Index = StartIndex; for (var i = 0; i < ml.track_pref.length; i++) {this.NewMenuItem(Index, "Lib", i + 1); Menu.AppendMenuItem(MF_STRING, Index, ml.track_pref[i]); Index++; if (i == 2)  Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} Menu.CheckMenuRadioItem(StartIndex, StartIndex + ml.track_pref.length - 1, StartIndex + ml.sort_type); return Index;}
    this.RadFilterTypeMenu  = function(Menu, StartIndex) {var Index = StartIndex, n = []; for (var i = 0; i < rad.filter.length; i++) n.push(rad.filter[i]); for (i = 0; i < n.length; i++) {this.NewMenuItem(Index, "RadFilter", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++; if (!i)  Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} Menu.CheckMenuRadioItem(StartIndex, StartIndex + rad.filter.length - 1, StartIndex + rad.filterID); return Index;}
    this.LibraryTypeMenu = function(Menu, StartIndex) {var Index = StartIndex; for (var i = 0; i < ml.track_pref.length; i++) {this.NewMenuItem(Index, "Library", i + 1); Menu.AppendMenuItem(MF_STRING, Index, ml.track_pref[i]); Index++; if (i == 2)  Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} Menu.CheckMenuRadioItem(StartIndex, StartIndex + ml.track_pref.length - 1, StartIndex + ml.sort_type); return Index;}
    this.ManageTypeMenu = function(Menu, StartIndex) {var Index = StartIndex; this.NewMenuItem(Index, "Manage", 1); Menu.AppendMenuItem(MF_STRING, Index, "Auto Radio"); Menu.CheckMenuItem(Index++, rad.auto); Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); return Index;}
    this.MoreMenu = function(Menu, StartIndex) {var Index = StartIndex, c =[alb.show_live, alb.mb_sort,, !alb.more], n =["Musicbrainz \"All\" Releases: Include \"Live\" + \"Other\"", "Musicbrainz \"All\" Releases: Group", "Last.fm Sorted by " + (alb.lfm_sort ? "Playcount" : "Last.fm Rank (Listeners)") +  ": Sort by " + (alb.lfm_sort ? "Last.fm Rank (Listeners)..." : "Playcount..."), "Hide Artists", "Reload"]; for (var i = 0; i < 5; i++) {this.NewMenuItem(Index, "Settings", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); if (i != 2 && i != 4) Menu.CheckMenuItem(Index++, c[i]); else Index++; if (i != 0 && i != 4) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} return Index;}
    this.NowplayingTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, c = [p.rel_imgs != 1, p.video_mode], n = ["Show Text", "Prefer Video"]; for (var i = 0; i < (p.f_yt_ok ? 2 : 1); i++) {this.NewMenuItem(Index, "Nowplaying", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Menu.CheckMenuItem(Index++, c[i]);} return Index;}
    this.PlaylistMenu = function(i, Menu, StartIndex) {Index = StartIndex; for (var j = i * 30; j < Math.min(pl.menu.length, 30 + i * 30); j++) {this.NewMenuItem(Index, "Playlists", j + 5); Menu.AppendMenuItem(MF_STRING, Index, pl.menu[j].name); Index++;} Menu.CheckMenuRadioItem(StartIndex, StartIndex + 30 + i * 30, StartIndex - i * 30 + plman.ActivePlaylist); return Index;}
    this.PlaylistsTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, n = ["Radio Playlist", "Album Playlist", "TopTracks Playlist", "Loved Playlist"]; for (var i = 0; i < 4; i++) {this.NewMenuItem(Index, "Playlists", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++;} Menu.CheckMenuRadioItem(StartIndex, StartIndex + 3, StartIndex + (plman.ActivePlaylist == pl.rad ? 0 : plman.ActivePlaylist == pl.alb ? 1 : plman.ActivePlaylist == pl.tracks ? 2 : plman.ActivePlaylist == pl.loved ? 3 : -1)); Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); return Index;}
    this.RadioOptTypeMenu = function(Menu, StartIndex) {var Index = StartIndex; this.NewMenuItem(Index, "RadioOpt", 1); Menu.AppendMenuItem(MF_STRING, Index, "Remove Played Tracks From Radio Playlist"); Menu.CheckMenuItem(Index++, index.rem_played); Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); return Index;}
    this.RadioVarietyMenu = function(Menu, StartIndex) {var Index = StartIndex, n = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150, 200, 250], r = index.mode ? index.lfm_variety : index.ec_variety; for (var i = 0; i < (index.mode ? 14 : 10); i++) {this.NewMenuItem(Index, "Variety", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++; Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i + (r != n[i])); if (index.mode && i == 9) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} return Index;}
    this.RadioHotMenu = function(Menu, StartIndex) {var Index = StartIndex; for (var i = 0; i < index.preset.length; i++) {this.NewMenuItem(Index, "Hotness", i + 1); Menu.AppendMenuItem(MF_STRING, Index, index.preset[i]); Index++; Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i + (index.preset[i] != index.preset[index.range])); if (i % 3 == 2 && i !=index.preset.length - 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0)} return Index;}
    this.RadLibTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, n = ["Library Not Used", "Prefer Library Tracks"]; for (var i = 0; i < n.length; i++) {this.NewMenuItem(Index, "RadLib", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++;} Menu.CheckMenuRadioItem(StartIndex, StartIndex + 1, StartIndex + ml.rad); return Index;}
    this.RadioModeMenu = function(Menu, StartIndex) {if (!p.use_saved || !p.ec_saved) {var Index = StartIndex; for (var i = 0; i < 4; i++) {this.NewMenuItem(Index, "Mode", i + 1); Menu.AppendMenuItem(MF_STRING, Index, i < 3 ? index.n[i + 1] : index.n[2] + " / Save Soft Playlists"); Index++; if (i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} Menu.CheckMenuRadioItem(StartIndex, StartIndex + 3, StartIndex + (index.mode == 1 && !index.softplaylist ? 0 : index.mode == 2 && !index.softplaylist ? 1 : index.mode == 3 && !index.softplaylist ? 2 : index.softplaylist ? 3 : -1)); return Index;} else {var Index = StartIndex; for (var i = 0; i < 5; i++) {this.NewMenuItem(Index, "Mode", i + 1); Menu.AppendMenuItem(MF_STRING, Index, i < 4 ? index.n[i] : index.n[2] + " / Save Soft Playlists"); Index++; if (i == 3) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} Menu.CheckMenuRadioItem(StartIndex, StartIndex + 4, StartIndex + (!index.mode && !index.softplaylist ? 0 : index.mode == 1 && !index.softplaylist ? 1 : index.mode == 2 && !index.softplaylist ? 2 : index.mode == 3 && !index.softplaylist ? 3 : index.softplaylist ? 4 : -1)); return Index;}}
    this.RadioTopTagsMenu = function(Menu, StartIndex) {var Index = StartIndex; this.NewMenuItem(Index, "TopTags", 1); Menu.AppendMenuItem(MF_STRING, Index, index.mode != 3 ? "Open Tag Search..." : "Open Query Search..."); Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++; var topArr = index.mode != 3 ? t.TopTags : t.TopGenre; for (var i = 0; i <topArr.length; i++) {this.NewMenuItem(Index, "TopTags", i + 2); Menu.AppendMenuItem(MF_STRING, Index, topArr[i]); Index++;} return Index;}
    this.search = function(Menu, StartIndex, start, end, paste) {var Index = StartIndex, n = ["Copy", "Cut", "Paste"]; for (var i = 0; i < n.length; i++) {this.NewMenuItem(Index, "Search", i + 1); Menu.AppendMenuItem(start == end && i < 2 || i == 2 && !paste ? MF_GRAYED : MF_STRING, Index, n[i]); Index++; if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} return Index;}
    this.search_menu = function(x, y, start, end, paste) {var menu = window.CreatePopupMenu(), idx, Index = 1; Index = this.search(menu, Index, start, end, paste); idx = menu.TrackPopupMenu(x, y); if (idx >= 1 && idx <= Index) {var i = MenuMap[idx].value; switch (i) {case 1: alb.on_char(v.copy); break; case 2: alb.on_char(v.cut); break; case 3: alb.on_char(v.paste, true); break;}} menu.Dispose();}
    this.SearchMenu1 = function(Menu, StartIndex) {var Index = StartIndex; Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); this.NewMenuItem(Index, "New", 5); Menu.AppendMenuItem(MF_STRING, Index, "Search for Artist..."); Index++; return Index;}
    this.SearchMenu2 = function(Menu, StartIndex) {var Index = StartIndex; this.NewMenuItem(Index, "New", 6); Menu.AppendMenuItem(MF_STRING, Index, "Search for Genre..."); Index++; return Index;}
    this.SearchMenu3 = function(Menu, StartIndex) {var Index = StartIndex, n = ["Search for Similar Artists...", "Search for Similar Songs..."]; for (var i = 0; i < 2; i++) {this.NewMenuItem(Index, "New", i + 7); Menu.AppendMenuItem(index.mode == 3 && i == 1 ? MF_GRAYED : MF_STRING, Index, n[i]); Index++;} return Index;}
    this.SearchMenu4 = function(Menu, StartIndex) {var Index = StartIndex; if (p.btn_mode) {var n = ["Current Radio: " + (!rad.search && index.rad_source.length && rad_on ? index.rad_source ? index.rad_source.replace(/&/g, "&&") + (index.rad_type == 2 ? " And Similar Artists (" : " (") + index.n[index.rad_mode] + ")" : "None" : "None"), "Search for Album..."]; for (var i = 0; i < 2; i++) {this.NewMenuItem(Index, "New", i + 9); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++;}} return Index;}
    this.SongTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, n = ["Current Popularity", "All-Time Popularity"]; for (var i = 0; i < n.length; i++) {this.NewMenuItem(Index, "Song", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++;} Menu.CheckMenuRadioItem(StartIndex, StartIndex + 1, StartIndex + !index.curr_pop); return Index;}
    this.ThemeTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, c = [!ui.blur_dark && !ui.blur_blend && !ui.blur_light, ui.blur_dark, ui.blur_blend, ui.blur_light], n = ["None", "Dark", "Blend", "Light"]; for (var i = 0; i < n.length; i++) {this.NewMenuItem(Index, "Theme", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++; Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i + 1 - c[i]); if (!i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);} return Index;}
    this.TopLibTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, n = ["Library Not Used", "Prefer Library Tracks"]; for (var i = 0; i < n.length; i++) {this.NewMenuItem(Index, "TopLib", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++;} Menu.CheckMenuRadioItem(StartIndex, StartIndex + 1, StartIndex + ml.top); return Index;}
    this.TrackListTypeMenu = function(Menu, StartIndex) {var Index = StartIndex, c = [!alb.pref_mb_tracks, alb.pref_mb_tracks], n = ["Prefer Last.fm", "Prefer Musicbrainz"]; for (var i = 0; i < n.length; i++) {this.NewMenuItem(Index, "TrackList", i + 1); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++;} Menu.CheckMenuRadioItem(StartIndex, StartIndex + 1, StartIndex + alb.pref_mb_tracks); return Index;}

    this.FavRadioMenu = function(Menu, StartIndex) {
        var i = 0, Index = StartIndex, rt = index.rad_type; if (rt == 4) rt = 1;
        if (!fav.stations.length) {this.NewMenuItem(Index, "Favourites", 1); Menu.AppendMenuItem(MF_STRING, Index, "None"); Index++;}
        else {
            for (i = 0; i < fav.stations.length; i++) {
                this.NewMenuItem(Index, "Favourites", i);
                Menu.AppendMenuItem(index.mode == 3 && fav.stations[i].type == 3 ? MF_GRAYED : MF_STRING, Index, fav.stations[i].source.replace(/&/g, "&&") + (fav.stations[i].type == 2 ? " And Similar Artists" : ""));
                if (rad_on && index.rad_source ==  fav.stations[i].source && rt == fav.stations[i].type) get_source = fav.stations[i].source;
                Index++; Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i + 1 - (rad_on && index.rad_source ==  fav.stations[i].source && rt == fav.stations[i].type));
            }
        }
        Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        this.NewMenuItem(Index, "Favourites", fav.stations ? fav.stations.length + 1 : 2); Menu.AppendMenuItem(MF_STRING, Index, "Auto Favourites"); Menu.CheckMenuItem(Index++, fav.auto);
        if (!fav.auto) {
            var n = ["Add Current", "Remove Current", "Reset"]; Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
            for (i = 0; i < 3; i++) {this.NewMenuItem(Index, "Favourites", fav.stations ? fav.stations.length + i + 2 : i + 3); Menu.AppendMenuItem(MF_STRING, Index, n[i]); Index++;}
        }
        return Index;
    }

    this.TracksTypeMenu = function(Menu, StartIndex) {
        var Index = StartIndex, available = false;
        this.NewMenuItem(Index, "Tracks", 1); alb_playlist = lib.alb_playlist(a_n);
        Menu.AppendMenuItem(alb_playlist ? MF_STRING : MF_GRAYED, Index, "Albums" + " [" + an + (alb_playlist ? "" : (an ? " - " : "") + "None Found") + "]");
        Index++; Menu.CheckMenuRadioItem(StartIndex, StartIndex, StartIndex + (pl_active.indexOf(pl.alb_yttm) == -1 || lib.albumartist != a_n)); Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        this.NewMenuItem(Index, "Tracks", 2);
        if (pl_active.indexOf(pl.t50_playlist) != -1 && pl_active.indexOf(" | ") == -1 && pl_active.indexOf("Singles Chart") == -1) t50_n = pl_active.indexOf(pl.t50_playlist + ": ") == -1 ? pl_active.replace(pl.t50_playlist + " [","").slice(0, -1) : pl_active.replace(pl.t50_playlist + ": ","");
        if (p.use_saved) {var rs = t50_n.clean(); available = p.file(rad.f2 + rs.substr(0, 1).toLowerCase() + "\\" + rs + ".json");}
        var text = p.use_saved && !available ? "Saved N/A " : "";
        Menu.AppendMenuItem(text == "Saved N/A " ? MF_GRAYED : MF_STRING, Index, text + "Top " + pl.top50 + " Tracks" + " [" + (t50_n ? t50_n.replace(/&/g, "&&") : "N/A") + "]");
        var pn1 = pl_active.toLowerCase(), pn2 = pl.t50_playlist + ": " + t50_n, pn3 = pl.t50_playlist + " [" + t50_n + "]"; pn2 = pn2.toLowerCase(); pn3 = pn3.toLowerCase();
        Menu.CheckMenuRadioItem(Index, Index, Index + (pn1 != pn2 && pn1 != pn3)); Index++;
        this.NewMenuItem(Index, "Tracks", 3); available = false;
        if (pl_active.indexOf(pl.t50_playlist) != -1 && pl_active.indexOf(" | ") != -1 && pl_active.indexOf("Singles Chart") == -1) a_t = pl_active.indexOf(pl.t50_playlist + ": ") == -1 ? pl_active.replace(pl.t50_playlist + " [","").slice(0, -1) : pl_active.replace(pl.t50_playlist + ": ","");
        if (p.use_saved) {var rs = a_t.clean(); available = p.file(rad.f2 + rs.substr(0, 1).toLowerCase() + "\\" + rs + " [Similar Songs].json");}
        text = p.use_saved && !available ? "Saved N/A " : "";
        Menu.AppendMenuItem(text == "Saved N/A " ? MF_GRAYED : MF_STRING, Index, text + "Top " + pl.top50 + " Similar Tracks" + " [" + a_t.replace(/&/g, "&&") + "]");
        var pn4 = pl.t50_playlist + ": " + a_t, pn5 = pl.t50_playlist + " [" + a_t + "]"; pn4 = pn4.toLowerCase(); pn5 = pn5.toLowerCase();
        Menu.CheckMenuRadioItem(Index, Index, Index + (pn1 != pn4 && pn1 != pn5)); Index++; Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        this.NewMenuItem(Index, "Tracks", 4); available = false;
        if (pl_active.indexOf(pl.t40_playlist) != -1 && pl_active.indexOf(" | ") == -1 && pl_active.indexOf("Singles Chart") != -1) c_t = pl_active.indexOf(pl.t40_playlist + ": ") == -1 ? pl_active.replace(pl.t40_playlist + " [","").slice(0, -1) : pl_active.replace(pl.t40_playlist + ": ","");
        if (p.use_saved) {var rs = c_t.clean(); available = p.file(rad.f2 + rs.substr(0, 1).toLowerCase() + "\\" + rs + ".json");}
        text = p.use_saved && !available ? "Saved N/A " : "";
        Menu.AppendMenuItem(text == "Saved N/A " ? MF_GRAYED : MF_STRING, Index, text + "Top 40" + " [" + c_t.replace(/&/g, "&&") + "]");
        var pn6 = pl.t40_playlist + ": " + c_t, pn7 = pl.t40_playlist + " [" + c_t + "]"; pn6 = pn6.toLowerCase(); pn7 = pn7.toLowerCase();
        Menu.CheckMenuRadioItem(Index, Index, Index + (pn1 != pn6 && pn1 != pn7)); Index++;
        if (pl_active.indexOf(pl.t50_playlist) != -1 || pl_active.indexOf(pl.t40_playlist) != -1) {Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); this.NewMenuItem(Index, "Tracks", 5); Menu.AppendMenuItem(MF_STRING, Index, "Refresh " + pl_active.replace(/&/g, "&&")); Index++;}
        return Index;
    }

    this.BlacklistMenu = function(Menu, StartIndex) {
        var black_menu_list = [], i = 0, Index = StartIndex, valid = plman.GetPlayingItemLocation().IsValid, pl_loved = pl.loved == (fb.IsPlaying && valid ? plman.PlayingPlaylist : plman.ActivePlaylist) ? true : false, yt_video = p.eval("%path%").indexOf(".tags") == -1 ? p.eval("%path%").replace(/[\.\/\\]/g, "") : p.eval("$info(@REFERENCED_FILE)").replace(/[\.\/\\]/g, ""); yt_video = yt_video.indexOf("youtubecomwatch") != -1 ? true : false; fn = fb.ProfilePath + "yttm\\" + "blacklist.json";
        if (!p.file(fn)) p.save(fn, JSON.stringify({"blacklist":{}}), true);
        if (p.file(fn)) {artis = ar_n.tidy(); obj = p.json_parse(utils.ReadTextFile(fn)); if (obj.blacklist[artis]) for (i = 0; i < obj.blacklist[artis].length; i++) black_menu_list.push(obj.blacklist[artis][i].title);}
        if (yt_video) {if (p.eval("%path%").indexOf(".tags") == -1) {title = p.eval("[%fy_title%]"); v_id = p.eval("[%path%]").slice(-13)} else {title = p.eval("[%youtube_title%]"); var inf = p.eval("[$info(@REFERENCED_FILE)]"); v_id = inf.indexOf("v="); v_id = inf.slice(v_id, v_id + 13);}}
        var n = [(pl_loved ? "♡ Unlove" : "♥ Add to Loved Playlist") + (p.ir()  ? "" : ": " + ((name.artist(pl_loved ? !valid : false) ? name.artist(pl_loved ? !valid : false) + " | " : "") + name.title(pl_loved ? !valid : false)).replace(/&/g, "&&")), "+ Add to Black List: " + (yt_video ? title ? title.replace(/&/g, "&&") : "N/A - Youtube Source: Title Missing" : "N/A - Track Not A YouTube Video"), black_menu_list.length ? blk.remove ? " - Remove from Black List: " : "View: " : "No Black Listed Videos For Current Artist", "Undo"];
        for (i = 0; i < 4; i++) {this.NewMenuItem(Index, "Blacklist", i + 1); if (i < 3 || blk.undo[0] == artis) Menu.AppendMenuItem(i == 1 && !yt_video ? MF_GRAYED : MF_STRING, Index, n[i]); if (i < 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++;}
        if (black_menu_list.length) for (i = 0; i < black_menu_list.length; i++) {this.NewMenuItem(Index, "Blacklist", i + (blk.undo[0] == artis ? 5 : 4)); Menu.AppendMenuItem(MF_STRING, Index, black_menu_list[i].replace(/&/g, "&&")); Index++;}
        return Index;
    }

    this.rbtn_up = function(x, y) {
        if (!lib) return; var AlbumMenu = window.CreatePopupMenu(), ArtistMenu = window.CreatePopupMenu(), BlackMenu = window.CreatePopupMenu(), CancelMenu = window.CreatePopupMenu(), FavMenu = window.CreatePopupMenu(), GenreMenu = window.CreatePopupMenu(), HotMenu = window.CreatePopupMenu(), ImageMenu = window.CreatePopupMenu(), LibFilterMenu = window.CreatePopupMenu(), LibOptMenu = window.CreatePopupMenu(), LibMenu = window.CreatePopupMenu(), LibraryMenu = window.CreatePopupMenu(), ManageMenu = window.CreatePopupMenu(), MoreMenu = window.CreatePopupMenu(), ModeMenu = window.CreatePopupMenu(), NewMenu = window.CreatePopupMenu(), NowplayingMenu = window.CreatePopupMenu(), PlaylistsMenu = window.CreatePopupMenu(), RadioOptMenu = window.CreatePopupMenu(), RadFilterMenu = window.CreatePopupMenu(), RadLibMenu = window.CreatePopupMenu(), SongMenu = window.CreatePopupMenu(), ThemeMenu = window.CreatePopupMenu(), TopLibMenu = window.CreatePopupMenu(), TopTagsMenu = window.CreatePopupMenu(), TrackListMenu = window.CreatePopupMenu(), TracksMenu =  window.CreatePopupMenu(), VarietyMenu = window.CreatePopupMenu(), menu = window.CreatePopupMenu();
        var idx, Index = 1;
        if (index.mode == 2 && (rad.search || timer.sim1 || timer.sim2)) Index = this.CancelTypeMenu(menu, Index);
        NewMenu.AppendTo(menu, MF_STRING, "New Radio..."); Index = this.TrackMenu(NewMenu, Index);
        Index = this.RadioVarietyMenu(VarietyMenu, Index); VarietyMenu.AppendTo(NewMenu, MF_STRING, "> Artist Variety: " + (index.mode ? index.lfm_variety : index.ec_variety));
        Index = this.RadioModeMenu(ModeMenu, Index); ModeMenu.AppendTo(NewMenu, MF_STRING, "> Radio: " + (!index.softplaylist ? index.n[index.mode] :  index.n[2] + " / Save Soft Playlists"));
        if (index.mode < 3) {Index = this.RadioHotMenu(HotMenu, Index); HotMenu.AppendTo(NewMenu, index.mode ? MF_STRING : MF_GRAYED, "> Tracks: " +  (index.mode ? index.preset[index.range] : "No Options for Echonest Radio"));}
        else {Index = this.LibTypeMenu(LibMenu, Index); LibMenu.AppendTo(NewMenu, MF_STRING, "> Tracks: Favour " + (ml.track_pref[ml.sort_type]));}
        Index = this.SearchMenu1(NewMenu, Index);
        if (!index.mode) Index = this.SearchMenu2(NewMenu, Index);
        else {Index = this.RadioTopTagsMenu(TopTagsMenu, Index); TopTagsMenu.AppendTo(NewMenu, MF_STRING, index.mode != 3 ? "Search for Genre/Tag..." : "Search for Genre / by Query...");}
        Index = this.SearchMenu3(NewMenu, Index);
        Index = this.FavRadioMenu(FavMenu, Index); FavMenu.AppendTo(menu, MF_STRING, "Favourites..."); menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = this.TracksTypeMenu(TracksMenu, Index); TracksMenu.AppendTo(menu, MF_STRING, "Load..."); menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = this.SearchMenu4(menu, Index);
        if (p.btn_mode || utils.IsKeyPressed(0x10)) Index = this.ChooseArtistTypeMenu(menu, Index);
        Index = this.PlaylistsTypeMenu(PlaylistsMenu, Index); PlaylistsMenu.AppendTo(menu, MF_STRING, "Playlists");
        var pl_me = [], pl_no = Math.ceil(pl.menu.length / 30);
        for (var j = 0; j < pl_no; j++) {pl_me[j] = window.CreatePopupMenu(); Index = this.PlaylistMenu(j, pl_me[j], Index); pl_me[j].AppendTo(PlaylistsMenu, MF_STRING, "# " + (j * 30 + 1 +  " - " + Math.min(pl.menu.length, 30 + j * 30) + (30 + j * 30 > plman.ActivePlaylist && ((j * 30) - 1) < plman.ActivePlaylist ? "  >>>" : "")));}
        Index = this.ManageTypeMenu(ManageMenu, Index); ManageMenu.AppendTo(menu, MF_STRING, "Manage"); menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        if (p.np_graphic) {
            Index = this.ThemeTypeMenu(ThemeMenu, Index); ThemeMenu.AppendTo(ManageMenu, MF_STRING, "Theme"); ManageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
            Index = this.ImageTypeMenu(ImageMenu, Index); ImageMenu.AppendTo(ManageMenu, MF_STRING, "Image"); ManageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        }
        Index = this.BlacklistMenu(BlackMenu, Index); BlackMenu.AppendTo(menu, MF_STRING, "Love / Black List: Videos");
        if (!alb.show && !t.halt() && p.np_graphic) {Index = this.NowplayingTypeMenu(NowplayingMenu, Index); NowplayingMenu.AppendTo(ManageMenu, MF_STRING, "Nowplaying"); ManageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);}
        Index = this.TrackListTypeMenu(TrackListMenu, Index); TrackListMenu.AppendTo(ManageMenu, MF_STRING, "Album Track List: Prefer " + (alb.pref_mb_tracks ? "Musicbrainz" : "Last.fm")); ManageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = this.RadioOptTypeMenu(RadioOptMenu, Index); RadioOptMenu.AppendTo(ManageMenu, MF_STRING, "Radio && Soft Playlists"); ManageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = this.SongTypeMenu(SongMenu, Index); SongMenu.AppendTo(RadioOptMenu, MF_STRING, index.n[1] + index.s[1] + " > Tracks: " + (index.curr_pop ? "Current Popularity" : "All-Time Popularity"));
        Index = this.ArtistTypeMenu(ArtistMenu, Index); ArtistMenu.AppendTo(RadioOptMenu, MF_STRING, index.n[1] + index.s[1] + " > Artists: " + (!index.random_artist ? "Higher Similarity" : "Random Pick")); RadioOptMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = this.GenreTypeMenu(GenreMenu, Index); GenreMenu.AppendTo(RadioOptMenu, MF_STRING, "Genre/Tag Method: " + ("Top " + (index.genre_tracks ? "Tracks" : "Artists")));
        Index = this.LibOptTypeMenu(LibOptMenu, Index); LibOptMenu.AppendTo(ManageMenu, MF_STRING, "Library");
        Index = this.AlbumTypeMenu(AlbumMenu, Index); AlbumMenu.AppendTo(LibOptMenu, MF_STRING, "Albums: " + (ml.alb && ml.mtags_installed ? "Use m-TAGS: " + lib_n[ml.alb + 1] : "Library Not Used"));
        Index = this.RadLibTypeMenu(RadLibMenu, Index); RadLibMenu.AppendTo(LibOptMenu, MF_STRING, index.n[1] + index.s[1] + ": " + (ml.rad ? "Prefer Library Tracks" : "Library Not Used"));
        Index = this.TopLibTypeMenu(TopLibMenu, Index); TopLibMenu.AppendTo(LibOptMenu, MF_STRING, "Top Tracks: " + (ml.top ? "Prefer Library Tracks" : "Library Not Used"));
        LibOptMenu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index = this.RadFilterTypeMenu(RadFilterMenu, Index); RadFilterMenu.AppendTo(LibOptMenu, MF_STRING, "Filter [MySelect Radio]: " + rad.filter[rad.filterID]);
        if (lib.filter.length > 1) {LibOptMenu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index = this.LibFilterTypeMenu(LibFilterMenu, Index); LibFilterMenu.AppendTo(LibOptMenu, MF_STRING, "Filter [All Modes]: " + lib.filter[lib.filterID]);}
        LibOptMenu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index = this.LibraryTypeMenu(LibraryMenu, Index); LibraryMenu.AppendTo(LibOptMenu, MF_STRING, "Track Preference");
        Index = this.DefaultMenu(menu, Index);

        idx = menu.TrackPopupMenu(x, y);
        if (idx >= 1 && idx <= Index) {
            var i = MenuMap[idx].value;
            switch (MenuMap[idx].type) {
                case "Cancel": rad.cancel_iSelect(); break;
                case "New":
                    switch (true) {
                        case i > 0 && i < 5: index.get_radio(rn[i - 1], index.mode, i == 2 && index.mode && !index.genre_tracks ? 4 : i - 1, index.mode ? index.lfm_variety : index.ec_variety, index.range); break;
                        case i > 4 && i < 9:
                            var rs = null, rt = i - 5; rs = p.InputBox("Type Name Of " + ((rt == 0 || rt == 2) ? "Artist" : rt == 1 ? "Genre" : "Artist | Title"+ "\nUse Pipe Separator"), "Radio Type: " + (rt == 0 ? "Artist" : rt == 1 ? "Genre" : rt == 2 ? "Artist & Similar Artists" : "Similar Songs"), index.rad_source);
                            if (rs) index.get_radio(rs.titlecase(), index.mode, rt == 1 && index.mode && !index.genre_tracks ? 4 : rt, index.mode ? index.lfm_variety : index.ec_variety, index.range);
                            break;
                        case i == 10:
                            try {var ns = null; ns = p.InputBox("Type Name Of Artist | Album\nUse Pipe Separator\nLoading May Take a Few Seconds...\nIf Load Fails Artist or Album Name Unrecognised\nTry Another...", "Album Search", "Artist | Album");
                                if (ns && ns != "Artist | Album") {ns = ns.split("|"); alb.dld = new dld_album_tracks(); alb.track_source = alb.pref_mb_tracks; var a = ns[0].titlecase().trim(), l = ns[1].titlecase().trim(); if (ml.alb) if (alb.library_test(a, l)) return; alb.dld.Execute(0, "", a, l);}
                            } catch (e) {fb.ShowPopupMessage("Artist | Album Not Recognised\n\nEnsure A Pipe Separator Is Used", "YouTube Track Manager")}
                            break;
                    }
                    break;
                case "Favourites":
                    if (fav.stations.length && i < fav.stations.length) {index.get_radio(fav.stations[i].source.replace(" [Query - " + index.n[3] + index.s[3] + "]", ""), index.mode, fav.stations[i].type == 1 && index.mode &&!index.genre_tracks && !fav.stations[i].query ? 4 : fav.stations[i].type, index.mode ? index.lfm_variety : index.ec_variety, index.range, true, fav.stations[i].query);}
                    if (i == fav.stations.length + 1) {fav.toggle_auto(); if (fav.auto) fav.add_current_station(index.rad_source); window.SetProperty("SYSTEM.Auto Favourites", fav.auto);}
                    if (!fav.auto) {
                        if (i == fav.stations.length + 2) {fav.add_current_station(index.rad_source); break;}
                        if (i == fav.stations.length + 3) {fav.remove_current_station(get_source); break;}
                        if (i == fav.stations.length + 4) {var ns = p.InputBox("This Action Removes All Items From The List\n\nProceed?", "Reset List", "List Has " + fav.stations.length + " Items"); if (ns) {var fv = "No Favourites"; window.SetProperty("SYSTEM.Radio Favourites", fv); fav.save(fv);}}
                    }
                    break;
                case "Tracks": switch (i) {case 1: if (alb_playlist) lib.albums_playlist(a_n); break; case 2: rad.get_top50(t50_n, 1); break; case 3: rad.get_top50(a_t, 2); break; case 4: rad.get_top50(c_t, 3); break; case 5: rad.refresh_top50(pl_active); break;} break;
                case "TopTags":
                    var rs = null; if (i == 1) {
                    if (index.mode == 3) rs = p.InputBox("Enter Media Library Query. Examples:\n\nRock\nGenre HAS Rock\n%rating% GREATER 3\nGenre IS Rock AND %Date% AFTER 1979 AND %Date% BEFORE 1981", "MySelect Radio Query Search", index.rad_source ? index.rad_source : "Enter Query");
                    else rs = p.InputBox("Type Tag\n\nAny Valid Last.fm Tag Can Be Used, e.g. 2015, Rock etc", "Last.fm Tag Search", index.rad_source);
                }
                else {var tt_ind = i - 2; rs = (index.mode != 3 ? t.TopTags[tt_ind] : t.TopGenre[tt_ind]);}
                    if (rs) index.get_radio(rs.titlecase(), index.mode, index.genre_tracks || i == 1 && index.mode == 3 ? 1 : 4, index.mode ? index.lfm_variety : index.ec_variety, index.range, false, i == 1 && index.mode == 3 ? true : false);
                    break;
                case "Variety":
                    switch (index.mode) {
                        case 0: index.ec_variety = i * 10; window.SetProperty("SYSTEM.Artist Variety Ec", index.ec_variety); break;
                        default: var n = [125, 150, 200, 250]; i < 11 ? index.lfm_variety = i * 10 : index.lfm_variety = n[i - 11]; window.SetProperty("SYSTEM.Artist Variety Lfm", index.lfm_variety); break;
                    }
                    break;
                case "Hotness": index.range = i - 1; window.SetProperty("SYSTEM.Range", index.range); break;
                case "Mode": if (p.use_saved && p.ec_saved) i = i - 1; if (i < 4) {index.mode = i; index.softplaylist = false} else {index.mode = 2; index.softplaylist = true;} window.SetProperty("SYSTEM.Softplaylist Create", index.softplaylist); lib.upd = true; window.SetProperty("SYSTEM.Radio Mode", index.mode); break;
                case "TrackList": alb.pref_mb_tracks = alb.pref_mb_tracks == 1 ? 0 : 1; window.SetProperty("SYSTEM.AlbTracks Pref: Lfm-0 Mb-1", alb.pref_mb_tracks); break;
                case "RadLib": ml.rad = ml.rad ? 0 : 1; window.SetProperty("SYSTEM.Library", "" + ml.alb + "," + ml.rad + "," + ml.top + ""); break; case "TopLib": ml.top = ml.top ? 0 : 1; window.SetProperty("SYSTEM.Library", "" + ml.alb + "," + ml.rad + "," + ml.top + ""); break;
                case "Album": if (ml.alb == i - 2) ml.alb = 0; else ml.alb = i - 2; lib.update = true; window.SetProperty("SYSTEM.Library", "" + ml.alb + "," + ml.rad + "," + ml.top + ""); break;
                case "LibFilter": lib.filterID = i - 1; lib.upd = true; lib.update = true; window.SetProperty("SYSTEM.Library Filter All Modes ID", lib.filterID); break;
                case "Lib": ml.sort(i, true); lib.update = true; break;
                case "Library": ml.sort(i, true); lib.update = true; break;
                case "RadFilter": rad.filterID = i - 1; window.SetProperty("SYSTEM.Library Filter MySelect ID", rad.filterID); break;
                case "RadioOpt": index.rem_played = !index.rem_played; rad.limit = !index.rem_played ? 0 : Math.min(window.GetProperty(" Radio Playlist Track Limit 2-25"), 25); window.SetProperty("SYSTEM.Remove Played", index.rem_played); break;
                case "Song": index.curr_pop = !index.curr_pop; window.SetProperty("SYSTEM.Tracks: Curr Popularity", index.curr_pop); break;
                case "Artist": index.random_artist = !index.random_artist; window.SetProperty("SYSTEM.Artists: Random Pick", index.random_artist); break;
                case "Genre": index.genre_tracks = !index.genre_tracks; window.SetProperty("SYSTEM.Genre Tracks", index.genre_tracks); break;
                case "Search": alb.chooseartist(); break;
                case "Playlists": switch (i) {case 1: plman.ActivePlaylist = pl.rad; break; case 2: plman.ActivePlaylist = pl.alb; break; case 3: plman.ActivePlaylist = pl.tracks; break; case 4: plman.ActivePlaylist = pl.loved; break; default: plman.ActivePlaylist = pl.menu[i - 5].ix; break}; break;
                case "Manage": rad.toggle_auto(); t.paint(); break;
                case "Theme": ui.changeBlur(i); break;
                case "Image":
                    switch (i) {
                        case 1: img.smoothTrans = !img.smoothTrans; img.on_size(); window.SetProperty("SYSTEM.Image Smooth Transition", img.smoothTrans); break;
                        case 2: img.reflection = !img.reflection; img.on_size(); window.SetProperty("SYSTEM.Image Reflection", img.reflection); break;
                        case 3: img.border = img.border == 0 ? 1 : img.border == 1 ? 0 : img.border == 2 ? 3 : 2; window.SetProperty("SYSTEM.Image Border-1 Shadow-2 Both-3", img.border); img.create_images(); img.on_size(); break;
                        case 4: img.border = img.border == 0 ? 2 : img.border == 1 ? 3 : img.border == 2 ? 0 : 1; window.SetProperty("SYSTEM.Image Border-1 Shadow-2 Both-3", img.border); img.on_size(); break;
                    }
                    break;
                case "Nowplaying": rad.mbtn_up(x, y, i); break;
                case "Blacklist":
                    if (i == 1) pl.love();
                    else if (i == 2) {
                        if (!obj.blacklist[artis]) obj.blacklist[artis] = []; if (title.length) obj.blacklist[artis].push({"title":title,"id":v_id});
                        if (obj.blacklist[artis]) p.json_sort(obj.blacklist[artis], "title", false); p.save(fn, JSON.stringify(obj), true);
                    }
                    else if (i == 3) blk.remove = !blk.remove;
                    else if (blk.undo[0] == artis && i == 4) {
                        if (!obj.blacklist[blk.undo[0]]) obj.blacklist[artis] = []; if (blk.undo[1].length) obj.blacklist[blk.undo[0]].push({"title":blk.undo[1],"id":blk.undo[2]});
                        if (obj.blacklist[artis]) p.json_sort(obj.blacklist[artis], "title", false); p.save(fn, JSON.stringify(obj), true); blk.undo = [];
                    } else {
                        var bl_ind = i - (blk.undo[0] == artis ? 5 : 4);
                        if (blk.remove) {
                            blk.undo = [artis, obj.blacklist[artis][bl_ind].title, obj.blacklist[artis][bl_ind].id]; obj.blacklist[artis].splice(bl_ind, 1); blk.removeNulls(obj);
                            if (obj.blacklist[artis]) p.json_sort(obj.blacklist[artis], "title", false); p.save(fn, JSON.stringify(obj), true);
                        } else p.browser("https://www.youtube.com/results?search_query=" + encodeURIComponent(obj.blacklist[artis][bl_ind].id));
                    }
                    break;
                case "Default": switch (i) {case 1: window.ShowProperties(); break; case 2: window.ShowConfigure(); break;} break;
            }
        }
        AlbumMenu.Dispose(); ArtistMenu.Dispose(); BlackMenu.Dispose(); CancelMenu.Dispose(); FavMenu.Dispose(); GenreMenu.Dispose(); HotMenu.Dispose(); ImageMenu.Dispose(); LibFilterMenu.Dispose(); LibOptMenu.Dispose(); LibMenu.Dispose(); LibraryMenu.Dispose(); ManageMenu.Dispose(); MoreMenu.Dispose(); ModeMenu.Dispose(); NewMenu.Dispose(); NowplayingMenu.Dispose(); PlaylistsMenu.Dispose(); RadFilterMenu.Dispose(); RadioOptMenu.Dispose(); RadLibMenu.Dispose(); SongMenu.Dispose(); ThemeMenu.Dispose(); TopLibMenu.Dispose(); TopTagsMenu.Dispose(); TrackListMenu.Dispose(); TracksMenu.Dispose(); VarietyMenu.Dispose(); menu.Dispose(); for (var j in pl_me) pl_me[j].Dispose();
    }
}
var men = new menu_object();

function on_char(code) {alb.on_char(code)}
function on_focus(is_focused) {alb.on_focus(is_focused);}
function on_library_items_added() {if (!lib) return; lib.upd = true; lib.update = true;}; function on_library_items_removed() {if (!lib) return; lib.upd = true; lib.update = true;}; function on_library_items_changed() {if (!lib) return; if ((ml.pc_installed && ml.sort_type > 1) && (fb.PlaybackTime > 59 && fb.PlaybackTime < 65)) return; if (fb.IsPlaying) {var handle = fb.GetNowPlaying(); if (handle && handle.Path.slice(-7) == "!!.tags") return; /*!!.tags use mtags_mng due to m-TAGS/YouTube popup triggers*/} lib.upd = true; lib.update = true;}
function on_key_down(vkey) {alb.on_key_down(vkey); if (p.np_graphic) img.on_key_down(vkey)}; function on_key_up(vkey) {alb.on_key_up(vkey)}
function on_mouse_lbtn_dblclk(x, y) {but.lbtn_dn(x, y); if (!p.dbl_click) return; p.click(x, y);}
function on_mouse_lbtn_down(x, y) {but.lbtn_dn(x, y); alb.lbtn_dn(x, y); if (alb.scrollbar_type()) alb.scrollbar_type().lbtn_dn(x, y);}
function on_mouse_lbtn_up(x, y) {if (!p.dbl_click && !but.Dn) p.click(x, y); but.lbtn_up(x, y); alb.lbtn_up(x, y); alb_scrollbar.lbtn_up(x, y); art_scrollbar.lbtn_up(x, y);}
function on_mouse_leave() {but.leave(); alb.leave(); alb_scrollbar.leave(); art_scrollbar.leave();}
function on_mouse_mbtn_up(x, y) {alb.load(x, y, true); rad.mbtn_up(x, y);}
function on_mouse_move(x, y) {if (p.m_x == x && p.m_y == y) return; p.m_x = x; p.m_y = y; but.move(x, y); alb.move(x, y); if (!alb.scrollbar_type()) return; alb.scrollbar_type().move(x, y);}
function on_mouse_rbtn_up(x, y) {if (!alb.edit) {men.rbtn_up(x, y); return true;} else {alb.rbtn_up(x, y); return true;}}
function on_mouse_wheel(step) {switch (utils.IsKeyPressed(0x11)) {case false: if (t.halt()) break; if (!alb.show && p.show_images) img.wheel(step); if (!alb.show && p.show_images || !alb.scrollbar_type()) break; alb.scrollbar_type().wheel(step, false); break; case true: but.wheel(step); ui.wheel(step); break;}}
function on_playback_time(pbt) {ml.on_playback_time(); if (!(pbt % 25)) timer.radio();}
function on_playlists_changed() {pl.playlists_changed();}
function on_playlist_items_added(pn) {if (pn == pl.rad) rad.set_rad_selection(pn); if (plman.GetPlaylistName(pn).indexOf(pl.t50_playlist) == 0 || plman.GetPlaylistName(pn).indexOf(pl.t40_playlist) == 0) rad.set_t50_selection(pn); on_item_focus_change(); if (pn == pl.alb) {if (!ml.alb || !ml.mtags_installed) plman.SortByFormat(pn, "%album artist%|%album%|%tracknumber%|%title%", true); if (!lib) return; lib.get_album_metadb();}}
function on_playlist_items_removed(pn) {on_item_focus_change(); if (pn == pl.alb) {if (!lib) return; lib.get_album_metadb();}}
function on_playlist_switch() {on_item_focus_change();}
function on_script_unload() {timer.reset(timer.img, timer.imgi); timer.reset(timer.vid, timer.vidi); if (p.video_mode && p.eval("%video_popup_status%") == "visible") fb.RunMainMenuCommand("View/Visualizations/Video"); but.on_script_unload();}
function RGB(r, g, b) {return 0xff000000 | r << 16 | g << 8 | b;}
function RGBA(r, g, b, a) {return a << 24 | r << 16 | g << 8 | b;}
function StringFormat() {var a = arguments, h_align = 0, v_align = 0, trimming = 0, flags = 0; switch (a.length) {case 3: trimming = a[2]; case 2: v_align = a[1]; case 1: h_align = a[0]; break; default: return 0;} return (h_align << 28 | v_align << 24 | trimming << 20 | flags);}

if (!window.GetProperty("SYSTEM.Software Notice Checked", false)) fb.ShowPopupMessage("THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHORS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.", "YouTube Track Manager"); window.SetProperty("SYSTEM.Software Notice Checked", true);
if (!window.GetProperty("SYSTEM.Playlist Check", false)) fb.ShowPopupMessage("The following playlists by default:\n\nAlbum, Loved, Radio, RadioTracks, Top [prefix for Top50, Top40, TopTracks etc].\n\nIf you already use any of these, change the ones used by YouTube Track Manager before using the script.\n\nTo do this, open panel properties. Just change the names as required. Ensure comma \",\" separators are retained & not used in names. See the documentation for more info.", "YouTube Track Manager"); window.SetProperty("SYSTEM.Playlist Check", true); window.SetProperty(" Image Border-1 Shadow-2 Both-3", null); window.SetProperty(" Titleformat Artist", null); window.SetProperty(" Titleformat Genre", null); window.SetProperty(" Titleformat Title", null); window.SetProperty("ADV.Playback Statistics: Use JScript Panel Fields", null); window.SetProperty("ADV.Library Filter (Use Query Syntax)", null); window.SetProperty("SYSTEM.Library Sort Type", null); window.SetProperty("SYSTEM.Use Library Filter", null);