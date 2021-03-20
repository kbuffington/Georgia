﻿// ==PREPROCESSOR==
// @name "Library Tree"
// @author "WilB"
// @version "1.4.0.4 beta1 -- modified by Mordred"
// ==/PREPROCESSOR==

if (!window.GetProperty("SYSTEM.Chakra Checked", false) && !Date.now) {
	fb.ShowPopupMessage("Use the 'Chakra' script engine if possible (requires IE9 or later) - it's faster. Select in the JScript panel configuration window (shift + right click)", "Library Tree");
	window.SetProperty("SYSTEM.Chakra Checked", true);
}

function GetPropertyPrefix(system) {
	var prefix = system ? 'SYSTEM.' : ' ';
	var testProp = system ? 'SYSTEM.Font Size' : ' Zoom Filter Size (%)';
	var propertiesSet = window.GetProperty(testProp, '<not_set>');
	if (propertiesSet === '<not_set>') {
		prefix = 'Library: ';
		window.SetProperty(testProp, null);
	}
	return prefix;
}

/** @type {*} */
var libraryProps = new PanelProperties(); // library Preferences
var prefix = GetPropertyPrefix(false);
var systemPrefix = GetPropertyPrefix(true);
libraryProps.add_properties({
	doubleClickAction: ['Library: Double Click Action', 1],
	rememberTree: [prefix + 'Tree: Remember State', true],
	fullLine: [prefix + 'Text Whole Line Clickable', false],
	searchMode: [prefix + 'Search: Hide-0, SearchOnly-1, Search+Filter-2', 2],
	searchAutoExpand: [prefix + 'Search: Auto-expand', false],
	tooltips: [prefix + 'Tooltips', false],
	rootNode: [prefix + 'Root Node: 0=Hide 1=All Music 2=View Name', 0],
	autoCollapse: [prefix + 'Node: Auto Collapse', false],
	nodeItemCounts: [prefix + 'Node Item Counts: 0=Hide 1=# Tracks 2=Sub-Items', 1],
	nodeHighlight: ['Library: Highlight Node on Hover', false],
	nodeShowTracks: [prefix + 'Node: Show Tracks', true],
	autoFill: ['Library: Playlist: AutoFill', true],
	playlistCustomSort: [prefix + 'Playlist: Custom Sort', ''],
	sendToCurrent: ['Library: Send to Current Playlist', false],
	libPlaylistName: [prefix + 'Playlist Name', 'Library Playlist'],
	rowVertPadding: [prefix + 'Row Vertical Item Padding', 3],
	showScrollbar: [prefix + 'Scrollbar Show', true],
	pageScroll: ['Library: Scroll: Mouse Wheel Page Scroll', false],
	btnTooltipZoom: [prefix + 'Zoom Tooltip [Button] (%)', 100],
	filterZoom: [prefix + 'Zoom Filter Size (%)', 100],
	fontZoom: [prefix + 'Zoom Font Size (%)', 100],
	nodeZoom: [prefix + 'Zoom Node Size (%)', 100],
	baseFontSize: [systemPrefix + 'Font Size', 18],
});

function userinterface() {
	let dpi;
	try {
		dpi = WshShell.RegRead("HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI");
	} catch (e) {
		dpi = 120;
	}
	this.scale = dpi < 121 ? 1 : dpi / 120;
	this.zoomUpd = window.GetProperty("SYSTEM.Zoom Update", false);
	// var blurImg = false,
		// custom_col = window.GetProperty("_CUSTOM COLOURS/FONTS: USE", false),
		// cust_icon_font = window.GetProperty("_Custom.Font Icon [Node] (Name,Style[0or1])", "Segoe UI Symbol,0"),
	var k = 0,
		// icon = window.GetProperty(" Node: Custom Icon: +|- // Examples","| // (+)|(−) | | | | | | | | |").trim(),
		// icon_f_name= "Segoe UI",
		// icon_f_style = 0,
		iconcol_c = "",
		// iconcol_e = "",
		iconcol_h = "",
		// linecol = window.GetProperty(" Node: Lines: Hide-0 Grey-1 Blend-2 Text-3", 1),
		mix = 0,
		noimg = [],
		orig_font_sz = 16,
		// s_col = window.GetProperty(" Search Style: Fade-0 Blend-1 Norm-2 Highlight-3", 0),
		sp = 6,
		sp1 = 6,
		sp2 = 6,
		sum = 0,
		node_sz, // = Math.round(12 * this.scale),
		zoom = 100,
		zoom_font_sz = 16;
		// zoom_node = 100;
	this.b1 = 0x04ffffff;
	this.b2 = 0x04000000;
	this.backcol = "";
	this.backcolsel; // = "";
	// this.backcoltrans = "";
	this.bg = false;
	// this.blur_blend = window.GetProperty("SYSTEM.Blur Blend Theme", false);
	// this.blur_dark = window.GetProperty("SYSTEM.Blur Dark Theme", false);
	// this.blur_light = window.GetProperty("SYSTEM.Blur Light Theme", false);
	// var blur_tmp = window.GetProperty("ADV.Image Blur Background Level (0-100)", 90),
	//     blurAutofill = window.GetProperty("ADV.Image Blur Background Auto-Fill", false);
	// this.blurLevel = this.blur_blend ? 91.05 - Math.max(Math.min(blur_tmp, 90), 1.05) : Math.max(Math.min(blur_tmp * 2, 254), 0);
	// this.blur = this.blur_blend || this.blur_dark || this.blur_light;
	this.collapse = "";
	// this.blurAlpha = window.GetProperty("ADV.Image Blur Background Opacity (0-100)", 30);
	// this.blurAlpha = Math.min(Math.max(this.blurAlpha, 0), 100) / 30;
	var changeBrightness = function (r, g, b, percent) {
		return RGB(Math.min(Math.max(r + (256 - r) * percent / 100, 0), 255), Math.min(Math.max(g + (256 - g) * percent / 100, 0), 255), Math.min(Math.max(b + (256 - b) * percent / 100, 0), 255));
	}
	this.countscol = "";
	this.expand =  "";
	this.ct = false;
	this.dui = window.InstanceType;
	this.font = undefined;
	this.icon_font = undefined;
	this.icon_pad = -2; //window.GetProperty(" Node: Custom Icon: Vertical Padding", -2);
	this.icon_w = 17;
	this.iconcol_c = "";
	this.iconcol_e;
	this.iconcol_h = "";
	this.imgBg = window.GetProperty("SYSTEM.Image Background", false);
	this.j_font = undefined;
	this.l_s1 = 4;
	this.l_s2 = 6;
	this.l_s3 = 7;
	this.l_width = scaleForDisplay(1);
	this.linecol = "";
	this.row_h = 20;
	this.s_font = undefined;
	this.s_linecol = 0;
	this.searchcol = "";
	this.sel = 3;
	this.textcol = "";
	this.textcol_h = "";
	this.textselcol = "";
	this.txt_box = "";
	this.x = 0;
	this.y = 0;
	this.h = 0;
	this.w = 0;
	this.alternate = true; // window.GetProperty(" Row Stripes", false);
	// this.local = false; //typeof conf === 'undefined' ? false : true;
	this.margin = 8;
	this.node_sz = Math.round(16 * this.scale);
	this.trace = function(message) {
		var trace = true;
		if (trace) console.log("Library Tree" + ": " + message);
	};
	this.node_style = 1;
	// window.GetProperty(" Node: Custom (No Lines)", false) ? 0 : !win_node ? 1 : 2;
	// if (this.node_style > 2 || this.node_style < 0) this.node_style = 1;
	this.node_win = 0;
	// if (!this.node_style) {
	// if (!icon.charAt(0).length) this.node_style = 1;
	// else try {
	// 		icon = icon.split("//");
	// 		icon = icon[0].split("|");
	// 		this.expand = icon[0].trim();
	// 		this.collapse = icon[1].trim();
	// 	} catch (e) {
	// 		this.node_style = 1;
	// 	}
	// }
	// if (!this.expand.length || !this.collapse.length) this.node_style = 1;
	// this.hot = libraryProps.nodeHighlight; //window.GetProperty(" Node: Hot Highlight", true);
	this.pad = Math.round(this.node_sz + (7 * this.scale)); //window.GetProperty(" Tree Indent", 19);
	// window.SetProperty("_CUSTOM COLOURS/FONTS: EMPTY = DEFAULT", "R-G-B (any) or R-G-B-A (not Text...), e.g. 255-0-0");
	// this.scrollbar_show = libraryProps.showScrollbar;
	// try {
	// 	this.scr_type = parseFloat(window.GetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "0").replace(/\s+/g, "").charAt(0));
	// 	if (isNaN(this.scr_type)) this.scr_type = 0;  if (this.scr_type > 2 || this.scr_type < 0) this.scr_type = 0;
	// 	if (this.scr_type ==2)  window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "2 // Scrollbar Settings N/A For Themed");
	// 	else window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + this.scr_type + "");
	// } catch (e) {this.scr_type = 0; window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + 0 + "");}
	this.scr_type = 2;
	this.scr_col = 1; //Math.min(Math.max( window.GetProperty(" Scrollbar Colour Grey-0 Blend-1", 1), 0), 1);
	if (this.scr_type == 2) {
		this.theme = window.CreateThemeManager("scrollbar");
		var im = gdi.CreateImage(21, 50),
			j = im.GetGraphics();
		try {
			this.theme.SetPartAndStateID(6, 1);
			this.theme.DrawThemeBackground(j, 0, 0, 21, 50);
			for (var i = 0; i < 3; i++) {
				this.theme.SetPartAndStateID(3, i + 1);
				this.theme.DrawThemeBackground(j, 0, 0, 21, 50);
			}
			for (i = 0; i < 3; i++) {
				this.theme.SetPartAndStateID(1, i + 1);
				this.theme.DrawThemeBackground(j, 0, 0, 21, 21);
			}
		} catch(e) {
			this.scr_type = 1;
			window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + 1 + "");
		}
		im.ReleaseGraphics(j);
	}
	var themed_w = 21;
	try {
		themed_w = utils.GetSystemMetrics(2);
	} catch (e) {}
	// var sbw = window.GetProperty(" Scrollbar Size");
	// if (sbw && sbw.indexOf("GripMinHeight") == -1)
	// 	window.SetProperty(" Scrollbar Size", sbw + ",GripMinHeight,20");
	// var sbar_w = window.GetProperty(" Scrollbar Size", "Bar,11,Arrow,11,Gap(+/-),0,GripMinHeight,20").replace(/\s+/g, "").split(",");
	// sbar_w = [,,,,,,,,]
	// this.scr_w = parseFloat(sbar_w[1]);
	// if (isNaN(this.scr_w)) this.scr_w = 11;
	this.scr_w = themed_w;

	// this.scr_w = Math.min(Math.max(this.scr_w, 0), 400);
	// var scr_w_o = Math.min(Math.max(window.GetProperty("SYSTEM.Scrollbar Width Bar", 11), 0), 400);
	// this.arrow_pad = parseFloat(sbar_w[5]);
	// if (isNaN(this.arrow_pad))
	this.arrow_pad = 0;
	// this.grip_h = parseFloat(sbar_w[7]);
	// if (isNaN(this.grip_h))
	this.grip_h = scaleForDisplay(20);
	// if (this.scr_w != scr_w_o) {
	// 	this.scr_but_w = parseFloat(sbar_w[3]);
	// 	if (isNaN(this.scr_but_w))
	// 		this.scr_but_w = 11;
	// 	this.scr_but_w = Math.min(this.scr_but_w, this.scr_w, 400);
	// 	window.SetProperty(" Scrollbar Size", "Bar," + this.scr_w +",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad + ",GripMinHeight," + this.grip_h);
	// } else {
	// this.scr_but_w = parseFloat(sbar_w[3]);
	// if (isNaN(this.scr_but_w))
	// 	this.scr_but_w = 11;
	// this.scr_but_w = Math.min(Math.max(this.scr_but_w, 0), 400);
	this.scr_but_w = themed_w;
	// this.scr_w = parseFloat(sbar_w[1]);
	// if (isNaN(this.scr_w))
	// 	this.scr_w = 11;
	// this.scr_w = Math.min(Math.max(this.scr_w, this.scr_but_w), 400);
		// window.SetProperty(" Scrollbar Size", "Bar," + this.scr_w +",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad + ",GripMinHeight," + this.grip_h);
	// }
	// window.SetProperty("SYSTEM.Scrollbar Width Bar", this.scr_w);
	if (this.scr_type == 2)
		this.scr_w = themed_w;
	if (!libraryProps.showScrollbar)
		this.scr_w = 0;
	this.but_h = this.scr_w + (this.scr_type != 2 ? 1 : 0);
	if (this.scr_type != 2)
		this.scr_but_w += 1;
	this.sbar_sp = this.scr_w ? this.scr_w + (this.scr_w - this.scr_but_w < 5 || this.scr_type == 2 ? 1 : 0) : 0;
	this.arrow_pad = Math.min(Math.max(-this.but_h / 5, this.arrow_pad), this.but_h / 5);
	var R = function(c) {return c >> 16 & 0xff;}; var G = function(c) {return c >> 8 & 0xff;}; var B = function(c) {return c & 0xff;}; var A = function (c) {return c >> 24 & 0xff;}
	var RGBAtoRGB = function(col, bg) {var r = R(col) / 255, g = G(col) / 255, b = B(col) / 255, a = A(col) / 255, bgr = R(bg) / 255, bgg = G(bg) / 255, bgb = B(bg) / 255, nR = ((1 - a) * bgr) + (a * r), nG = ((1 - a) * bgg) + (a * g), nB = ((1 - a) * bgb) + (a * b); nR = Math.max(Math.min(Math.round(nR * 255), 255), 0); nG = Math.max(Math.min(Math.round(nG * 255), 255), 0); nB = Math.max(Math.min(Math.round(nB * 255), 255), 0); return RGB(nR, nG, nB);}
	var get_blend = function(c1, c2, f) {var nf = 1 - f, r = (R(c1) * f + R(c2) * nf), g = (G(c1) * f + G(c2) * nf), b = (B(c1) * f + B(c2) * nf); return RGB(r, g, b);}
	var get_grad = function (c, f1, f2) {return [RGB(Math.min(R(c) + f1, 255), Math.min(G(c) + f1, 255), Math.min(B(c) + f1, 255)), RGB(Math.max(R(c) + f2, 0), Math.max(G(c) + f2, 0), Math.max(B(c) + f2, 0))];}
	var get_textselcol = function(c, n) {var cc = [R(c), G(c), B(c)]; var ccc = []; for (var i = 0; i < cc.length; i++) {ccc[i] = cc[i] / 255; ccc[i] = ccc[i] <= 0.03928 ? ccc[i] / 12.92 : Math.pow(((ccc[i] + 0.055 ) / 1.055), 2.4);} var L = 0.2126 * ccc[0] + 0.7152 * ccc[1] + 0.0722 * ccc[2]; if (L > 0.31) return n ? 50 : RGB(0, 0, 0); else return n ? 200 : RGB(255, 255, 255);}
	this.outline = function(c, but) {if (but) {if (window.IsTransparent || R(c) + G(c) + B(c) > 30) return RGBA(0, 0, 0, 36); else return RGBA(255, 255, 255, 36);} else if (R(c) + G(c) + B(c) > 255 * 1.5) return RGB(30, 30, 10); else return RGB(225, 225, 245);}
	this.reset_colors = function () {
		iconcol_c = ""; iconcol_h = ""; this.backcol = ""; this.countscol = ""; this.iconcol_c = ""; this.iconcol_h = "";
		this.linecol = ""; this.s_linecol = 0; this.searchcol = ""; this.textcol = ""; this.textcol_h = ""; this.textselcol = ""; this.txt_box = "";
	}

	this.icon_col = function() {
		if (iconcol_c === "") {this.iconcol_c = this.node_style ? [RGB(252, 252, 252), RGB(223, 223, 223)] : this.textcol;} else if (this.node_style) {if (A(iconcol_c) != 255) {this.iconcol_c = RGBAtoRGB(iconcol_c, this.backcol);} else this.iconcol_c = iconcol_c; this.iconcol_c = get_grad(this.iconcol_c, 15, -14);}
		// if (iconcol_e === "") {this.iconcol_e = this.node_style ? [RGB(252, 252, 252), RGB(223, 223, 223)] : this.textcol & 0xC0ffffff;} else if (this.node_style) {if (A(iconcol_e) != 255) {this.iconcol_e = RGBAtoRGB(iconcol_e, this.backcol);} else this.iconcol_e = iconcol_e; this.iconcol_e = get_grad(this.iconcol_e, 15, -14);}
		this.iconcol_e = [rgb(252, 252, 252), rgb(223, 223, 223)];
		this.iconpluscol = RGB(72, 72, 92); //get_textselcol(this.iconcol_e[0], true) == 50 ? RGB(41, 66, 114) : RGB(225, 225, 245);
		if (!libraryProps.nodeHighlight) return;
		if (iconcol_h === "") {
			this.iconcol_h = this.textcol_h;
			iconcol_h = this.iconcol_h;
		}
		if (A(iconcol_h) != 255) {
			this.iconcol_h = RGBAtoRGB(iconcol_h, this.backcol);
		} else if (iconcol_h !== "") {
			this.iconcol_h = iconcol_h;
		}
		this.iconcol_h = get_grad(this.iconcol_h, 15, -14);
		this.iconpluscol_h = RGB(72, 72, 92); //get_textselcol(this.iconcol_h[0], true) == 50 ? RGB(41, 66, 114) : RGB(225, 225, 245);
	}

	this.get_colors = function() {
		this.backcol = g_theme.colors.pss_back;
		// this.backcolsel = set_custom_col(window.GetProperty("_Custom.Colour Background Selected", ""), 1);
		this.countscol;
		this.linecol = g_pl_colors.title_selected & 0x80ffffff;
		this.txt_box;
		this.s_linecol = g_pl_colors.title_selected & 0x80ffffff;
		this.searchcol;
		this.textcol = g_pl_colors.artist_normal;
		this.textselcol = rgb(255,255,255);
		this.iconcol_c = '';
		iconcol_c = this.iconcol_c;
		// this.iconcol_e = set_custom_col(window.GetProperty("_Custom.Colour Node Expand", ""), 1); iconcol_e = this.iconcol_e;
		this.iconcol_h = '';
		iconcol_h = this.iconcol_h;
		// this.backcoltrans = set_custom_col(window.GetProperty("_Custom.Colour Transparent Fill", ""), 1);
		this.blur = false; //this.blur_dark || this.blur_light;
		// if (this.blur_dark) {
		// 	this.bg_color_light = RGBA(0, 0, 0, Math.min(160 / this.blurAlpha, 255));
		// 	this.bg_color_dark = RGBA(0, 0, 0, Math.min(80 / this.blurAlpha, 255));
		// }
		// if (this.blur_light) {
		// 	this.bg_color_light = RGBA(255, 255, 255, Math.min(160 / this.blurAlpha, 255));
		// 	this.bg_color_dark = RGBA(255, 255, 255, Math.min(205 / this.blurAlpha, 255));
		// }
		let textCol = 0;
		if (this.dui) { // custom colour mapping: DUI colours can be remapped by changing the numbers (0-3)
			if (this.backcol === "") this.backcol = window.GetColourDUI(1);
			this.backcolsel = window.GetColourDUI(3);
			textCol = window.GetColourDUI(0);
		} else { // custom colour mapping: CUI colours can be remapped by changing the numbers (0-6)
			if (this.backcol === "") this.backcol = window.GetColourCUI(3);
			this.backcolsel = window.GetColourCUI(4);
			textCol = window.GetColourCUI(0);
		}
		const textColHover = rgb(220, 220, 220);
		if (this.textcol === "") this.textcol = textCol;
		this.textcol_h = textColHover;
		// if (s_linecol == 1 && window.IsTransparent && !this.dui) s_linecol = 0;
		// if (this.searchcol === "") this.searchcol = s_col < 3 ? this.textcol : this.textcol_h;
		// blend = get_blend(this.backcol == 0 ? 0xff000000 : this.backcol, !s_col || s_col == 2 ? this.textcol : this.textcol_h, 0.75);
        // if (this.txt_box === "")
        //     this.txt_box = s_col < 2 ? get_blend(!s_col ? this.textcol : this.textcol_h, this.backcol == 0 ? 0xff000000 : this.backcol, !s_col ? 0.65 : 0.7) : s_col == 2 ? this.textcol : this.textcol_h;
        // console.log(' >>> ', colToRgb(this.txt_box));
        this.txt_box = rgb(125, 127, 128);
        this.searchcol = rgb(180, 182, 184);
		// if (this.s_linecol === "") this.s_linecol = s_linecol == 0 ? RGBA(136, 136, 136, 85) : s_linecol == 1 ? blend : this.txt_box;
		// if (window.IsTransparent && this.backcoltrans) {this.bg = true; this.backcol = this.backcoltrans}
		if (!window.IsTransparent || this.dui) {this.bg = true; if ((R(this.backcol) + G(this.backcol) + B(this.backcol)) > 759) this.b2 = 0x06000000;}
		this.icon_col();
		this.ct = this.bg ? get_textselcol(this.backcol, true) : 200;
        this.ibeamcol1 = window.IsTransparent ? 0xffe1e1f5 : this.outline(this.backcol);
		this.ibeamcol2 = window.IsTransparent || !this.backcolsel ? 0xff0099ff : this.backcolsel != this.searchcol ? this.backcolsel : 0xff0099ff;
	}
	this.get_colors();

	this.get_font = function() {
		this.font = ft.library_tree;
		orig_font_sz = libraryProps.baseFontSize;
		zoom = libraryProps.fontZoom;
		zoom_font_sz = Math.max(Math.round(orig_font_sz * zoom / 100), 1);
		if (!this.sizedNode) {	// prevents node sizes from growing every time this method is called
			ui.node_sz = Math.round(ui.node_sz * libraryProps.nodeZoom / 100);
			this.sizedNode = true;
		}
		this.font = gdi.Font(this.font.Name, zoom_font_sz, this.font.Style);
		libraryProps.fontZoom = Math.round(zoom_font_sz / orig_font_sz * 100);
		this.s_font = gdi.Font(this.font.Name, this.font.Size, 2);
		this.j_font = gdi.Font(this.font.Name, this.font.Size * 1.5, 1);
		this.calc_text();
	}

	this.calc_text = function() {
		var i = gdi.CreateImage(1, 1),
			g = i.GetGraphics();
		this.row_h = Math.round(g.CalcTextHeight("String", this.font)) + libraryProps.rowVertPadding;
		this.node_sz = Math.round(Math.max(Math.min(this.node_sz, this.row_h - 2), 7));
		library_tree.create_images();	// is this needed??
		// zoom_node = Math.round(this.node_sz / node_sz * 100);
		// libraryProps.nodeZoom = zoom_node;
		sp = Math.max(Math.round(g.CalcTextWidth(" ", this.font)), scaleForDisplay(4));
		sp1 = scaleForDisplay(10); //Math.max(Math.round(sp * 1.5), 6);
		if (!this.node_style) {
			var sp_e = g.MeasureString(this.expand, this.icon_font, 0, 0, 500, 500).Width;
			var sp_c = g.MeasureString(this.collapse, this.icon_font, 0, 0, 500, 500).Width;
			sp2 = Math.round(Math.max(sp_e, sp_c) + sp / 3);
		}
		this.l_s1 = Math.round(sp1 / 2) + scaleForDisplay(1); //Math.max(sp1 / 2, 4);
		this.l_s2 = Math.ceil(this.node_sz / 2);
		this.l_s3 = Math.max(scaleForDisplay(8), this.node_sz / 2)
		this.icon_w = this.node_style ? this.node_sz + sp1 : sp + sp2;
		this.sel = (this.node_style ? sp1 : sp + Math.round(sp / 3)) / 2;
		this.tt = this.node_style ? -Math.ceil(sp1 / 2 - 3) + sp1 : sp;
		i.ReleaseGraphics(g);
	}

	this.wheel = function(step) {
        if (p.m_y > p.s_h + ui.y) {
			if (p.m_x >= ui.x + Math.round(this.icon_w + this.margin + (libraryProps.rootNode ? this.pad : 0))) {
				zoom_font_sz += step;
				zoom_font_sz = Math.min(is_4k ? 96 : 60, Math.max(zoom_font_sz, 12));
				this.font = gdi.Font(this.font.Name, zoom_font_sz, this.font.Style);
				this.s_font = gdi.Font(this.font.Name, this.font.Size, 2);
				this.j_font = gdi.Font(this.font.Name, this.font.Size * 1.5, 1);
				this.calc_text();
				p.on_size();
				quickSearch.on_size();
				library_tree.create_tooltip();
				if (libraryProps.searchMode || libraryProps.showScrollbar)
					but.refresh(true);
				sbar.reset();
				window.Repaint();
				libraryProps.fontZoom = Math.round(zoom_font_sz / orig_font_sz * 100);
			} else {
				this.node_sz += step;
				this.calc_text();
				p.on_size();
				window.Repaint();
				libraryProps.nodeZoom = Math.round(this.node_sz / 12 * 100);
			}
		} else {
			if (p.scale < 0.9)
				return;
			p.scale += step * 0.1;
			p.scale = Math.max(p.scale, 0.9);
			libraryProps.filterZoom = Math.round(p.scale * 100);
			p.setFilterFont();
			p.calc_text();
			but.refresh(true);
			p.search_paint();
		}
	}

	this.block = function() {return this.w <= 10 || this.h <= 10 || !window.IsVisible;}
	// this.blur_img = function(image) {
	// 	console.log('this.blur_img');
	// 	if (!this.w || !this.h)
	// 		return;
	// 	var blurImg = gdi.CreateImage(this.w, this.h),
	// 		gb = blurImg.GetGraphics();
	//     if (!this.blur && autoFill || this.blur && blurAutofill) {
	// 		var s1 = image.Width / this.w, s2 = image.Height / this.h;
	// 		if (!this.blur && autoFill && Math.abs(s1 / s2 - 1) < 0.05) {
	// 			var imgx = 0,imgy = 0, imgw = image.Width, imgh = image.Height;
	// 		} else {
	// 			if (s1 > s2) {
	// 				var imgw = Math.round(this.w * s2), imgh = image.Height, imgx = Math.round((image.Width - imgw) / 2), imgy = 0;
	// 			} else {
	// 				var imgw = image.Width, imgh = Math.round(this.h * s1), imgx = 0, imgy = Math.round((image.Height - imgh) / 8);
	// 			}
	// 		}
	// 	}
	//     if (this.blur) {
	// 		gb.SetInterpolationMode(0);
	// 		if (blurAutofill)
	// 			image = image.Clone(imgx, imgy, imgw, imgh);
	// 		if (this.blur_blend) {
	// 			var iSmall = image.Resize(this.w * this.blurLevel / 100, this.h * this.blurLevel / 100, 2),
	// 				iFull = iSmall.resize(this.w, this.h, 2),
	// 				offset = 90 - this.blurLevel;
	// 			// gb.DrawImage(iFull, 0 - offset, 0 - offset, this.w + offset * 2, this.h + offset * 2, 0, 0, iFull.Width, iFull.Height, 0, 63 * ui.blurAlpha);
	// 			console.log(this.x - offset, this.y - offset, this.w + offset * 2, this.h + offset * 2, ' - ', iFull.Width, iFull.Height, 63 * ui.blurAlpha);
	// 			gb.DrawImage(iFull, this.x - offset, this.y - offset, this.w + offset * 2, this.h + offset * 2, 0, 0, iFull.Width, iFull.Height, 0, 63 * ui.blurAlpha);
	// 		} else {
	// 			gb.DrawImage(image, this.x, this.y, this.w, this.h, 0, 0, image.Width, image.Height); if (this.blurLevel > 1) blurImg.StackBlur(this.blurLevel);
	// 			var colorScheme_array = blurImg.GetColourScheme(1),
	// 				light_cover = get_textselcol(colorScheme_array[0], true) == 50 ? true : false;
	// 			gb.FillSolidRect(this.x, this.y, this.w, this.h, light_cover ? this.bg_color_light : this.bg_color_dark);
	// 		}
	// 	} else {
	// 		if (autoFill) {
	// 			gb.DrawImage(image, this.x, this.y, this.w, this.h, imgx, imgy, imgw, imgh, 0, alpha);
	// 		}
	// 		else {
	// 			var s = Math.min(this.h / image.Height, this.w / image.Width);
	// 			var tw = Math.round(image.Width * s);
	// 			var th = Math.round(image.Height * s);
	// 			gb.DrawImage(image, (this.w - tw) / 2, (this.h - th) / 2, tw, th, 0, 0, image.Width, image.Height, 0, alpha);
	// 		}
	//     }
	// 	blurImg.ReleaseGraphics(gb);
	// 	window.Repaint();
	// }
	// this.blurChange = function (n) {
	// 	this.blur_dark = false;
	// 	this.blur_blend = false;
	// 	this.blur_light = false;
	// 	this.imgBg = false;
	// 	switch (n) {
	// 		case 2:
	// 			this.blur_dark = true;
	// 			break;
	// 		case 3:
	// 			this.blur_blend = true;
	// 			break;
	// 		case 4:
	// 			this.blur_light = true;
	// 			break;
	// 		case 5:
	// 			this.imgBg = true;
	// 			break;
	// 	}
	// 	var blur_tmp = window.GetProperty("ADV.Image Blur Background Level (0-100)");
	// 	this.blurLevel = this.blur_blend ? 91.05 - Math.max(Math.min(blur_tmp, 90), 1.05) : Math.max(Math.min(blur_tmp * 2, 254), 0);
	// 	window.SetProperty("SYSTEM.Blur Blend Theme", this.blur_blend);
	// 	window.SetProperty("SYSTEM.Blur Dark Theme", this.blur_dark);
	// 	window.SetProperty("SYSTEM.Blur Light Theme", this.blur_light);
	// 	window.SetProperty("SYSTEM.Image Background", this.imgBg);
	// 	this.blurReset(true);
	// }
	// this.blurReset = function(clear) {if (blurImg) blurImg.Dispose(); blurImg = false; image_path_o = ""; if (clear) on_colours_changed(); this.on_playback_new_track();}
	this.create_images = function () {
		var cc = StringFormat(1, 1),
			font1 = gdi.Font("Segoe UI", 270, 1),
			font2 = gdi.Font("Segoe UI", 120, 1),
			font3 = gdi.Font("Segoe UI", 200, 1),
			font4 = gdi.Font("Segoe UI", 90, 1),
			gb,
			tcol = !this.blur_dark && !this.blur_light ? this.textcol : this.dui ? window.GetColourDUI(0) : window.GetColourCUI(0);
		const imgTypes = ["COVER", "SELECTION"];
		const noimg = {};
		for (var i = 0; i < imgTypes.length; i++) {
			var n = imgTypes[i];
			noimg[i] = gdi.CreateImage(500, 500);
			gb = noimg[i].GetGraphics();
			gb.SetSmoothingMode(SmoothingMode.HighQuality);
			if (!this.blur_dark && !this.blur_light) {
				gb.FillSolidRect(0, 0, 500, 500, tcol);
				gb.FillGradRect(-1, 0, 505, 500, 90, this.backcol & 0xbbffffff, this.backcol, 1.0);
			}
			gb.SetTextRenderingHint(3);
			gb.DrawString("NO", i ? font3 : font1, tcol & 0x25ffffff, 0, 0, 500, 275, cc);
			gb.DrawString(n, i ? font4 : font2, tcol & 0x20ffffff, 2.5, 175, 500, 275, cc);
			gb.FillSolidRect(60, 388, 380, 50, tcol & 0x15ffffff);
			noimg[i].ReleaseGraphics(gb);
		}
		this.get = true;
	};
	this.create_images();
	this.draw = function (gr) {
		try {
			if (this.bg)
				gr.FillSolidRect(this.x, this.y, this.w, this.h, this.backcol);
			if (!this.blur && !this.imgBg)
				return;
			this.get_img_fallback();
			// if (blurImg)
			// 	gr.DrawImage(blurImg, this.x, this.y, this.w, this.h, 0, 0, blurImg.Width, blurImg.Height);
		} catch (e) {}
	}
	this.focus_changed = function(ms) {k++; if (k == 1) {this.on_playback_new_track(); timer.reset(timer.focus, timer.focusi); timer.focus = setTimeout(function() {k = 0; timer.focus = false;}, ms); return;} timer.reset(timer.focus, timer.focusi); timer.focus = setTimeout(function() {ui.on_playback_new_track(); k = 0; timer.focus = false;}, ms);}
	// this.get_album_art_done = function (image, image_path) {
	// 	console.log('library.get_album_art_done');
	// 	if (image_path_o == image_path && blurImg && image) {
	// 		return window.Repaint();
	// 	}
	// 	image_path_o = image_path;
	// 	if (!image)
	// 		image = stub(0);
	// 	if (!image) {
	// 		if (blurImg)
	// 			blurImg.Dispose();
	// 		blurImg = false;
	// 		return;
	// 	}
	// 	this.blur_img(image);
	// }
	this.get_img_fallback = function () {
		if (sbar.draw_timer || !this.get) return;
		this.grab_f_img();
		this.get = false;
	}
	this.grab_f_img = function (handle) {
		if (!handle) handle = this.handle();
		if (handle)
		return utils.GetAlbumArtAsync(window.ID, handle, 0);
		if (fb.IsPlaying)
			return;
		const image = stub(1);
		if (!image) {
			// blurImg = false;
			return;
		}
		this.blur_img(image);
	}

	var handle_list = fb.CreateHandleList();
	this.upd_handle_list = true;
	this.handle = function() {
		var handle = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
		if (!handle) {
			if (this.upd_handle_list) {
				handle_list = plman.GetPlaylistItems(plman.ActivePlaylist);
				this.upd_handle_list = false;
			}
			if (handle_list.Count) handle = handle_list[0];
		}
		return handle;
	}

	this.on_playback_new_track = function (handle) {
		console.log('library.on_playback_new_track');
		if (!this.blur && !this.imgBg) return;
		if (this.block()) {
			this.get = true;
		} else {
			this.grab_f_img(handle);
			this.get = false;
		}
	}
	var stub = function (n) {
		// image_path_o = n ? "noitem" : "stub";
		return noimg[n].Clone(0, 0, noimg[n].Width, noimg[n].Height);
	}
}

function scrollbar() {
	var prefix = GetPropertyPrefix();
	var smoothness = 1 - 0.70; //window.GetProperty("ADV.Scroll: Smooth Scroll Level 0-1", 0.6561);
	smoothness = Math.max(Math.min(smoothness, 0.99), 0.01);
	this.bar_timer = false;
	this.count = -1;
	this.draw_timer = false;
	this.hover = false;
	this.s1 = 0;
	this.s2 = 0;
	// this.scroll_step = libraryProps.pageScroll;
	this.smooth = window.GetProperty(prefix + "Scroll: Smooth Scroll", true);
	this.timer_but = false;
	this.alpha = !ui.scr_col ? 75 : (!ui.scr_type ? 68 : 51);
	this.init = true;
	var alpha1 = this.alpha,
		alpha2 = !ui.scr_col ? 128 : (!ui.scr_type ? 119 : 85),
		inStep = ui.scr_type && ui.scr_col ? 12 : 18;
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 0;
	this.bar_ht = 0; this.but_h = 0; this.bar_y = 0; this.row_count = 0; this.scroll = 0; this.delta = 0; this.ratio = 1; this.rows_drawn = 0; this.row_h = 0; this.scrollbar_height = 0; this.scrollable_lines = 0; this.scrollbar_travel = 0; this.stripe_w = 0; this.tree_w = 0;
	this.b_is_dragging = false; this.drag_distance_per_row; this.initial_drag_y = 0; // dragging
	this.leave = function() {if (this.b_is_dragging) return; this.hover = !this.hover; this.paint(); this.hover = false; this.hover_o = false;}
	this.nearest = function(y) {y = (y - this.but_h) / this.scrollbar_height * this.scrollable_lines * this.row_h; y = y / this.row_h; y = Math.round(y) * this.row_h; return y;}
	this.reset = function() {this.delta = this.scroll = this.s1 = this.s2 = 0; this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);}
	this.scroll_timer = function() {var that = this; this.draw_timer = setInterval(function() {if (ui.w < 1 || !window.IsVisible) return; that.smooth_scroll();}, 16);}
	this.set_rows = function(row_count) {this.row_count = row_count; this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);}
	this.wheel = function(step, pgkey) {this.check_scroll(this.scroll + step * - (libraryProps.pageScroll || pgkey ? this.rows_drawn - 1 : 3) * this.row_h);}

	this.metrics = function(x, y, w, h, rows_drawn, row_h) {
		this.x = x;
		this.y = Math.round(y);
		this.w = w;
		this.h = h;
		this.rows_drawn = Math.floor(rows_drawn);
		this.row_h = row_h;
		this.but_h = ui.but_h;
		// draw info
		this.scrollbar_height = Math.round(this.h - this.but_h * 2);
		this.bar_ht = Math.max(Math.round(this.scrollbar_height * this.rows_drawn / this.row_count), Math.max(Math.min(this.scrollbar_height / 2, ui.grip_h), 5));
		this.scrollbar_travel = this.scrollbar_height - this.bar_ht;
		// scrolling info
		this.scrollable_lines = this.rows_drawn > 0 ? this.row_count - this.rows_drawn : 0;
        this.ratio = this.row_count / this.scrollable_lines;
		this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h);
		this.drag_distance_per_row = this.scrollbar_travel / this.scrollable_lines;
		// panel info
		this.tree_w = ui.w - Math.max(libraryProps.showScrollbar && this.scrollable_lines > 0 ? ui.sbar_sp + ui.sel : ui.sel, ui.margin);
		if (ui.alternate) this.stripe_w = libraryProps.showScrollbar && this.scrollable_lines > 0 ? ui.w - ui.sbar_sp : ui.w;
	}

	this.draw = function(gr) {if (this.scrollable_lines > 0) {try {
		switch (ui.scr_type) {
			case 0:
				switch (ui.scr_col) {
					case 0: gr.FillSolidRect(this.x, this.y + this.bar_y, this.w, this.bar_ht, RGBA(ui.ct, ui.ct, ui.ct, !this.hover && !this.b_is_dragging ? this.alpha : this.hover && !this.b_is_dragging ? this.alpha : 192)); break;
					case 1: gr.FillSolidRect(this.x, this.y + this.bar_y, this.w, this.bar_ht, ui.textcol & (!this.hover && !this.b_is_dragging ? RGBA(255, 255, 255, this.alpha) : this.hover && !this.b_is_dragging ? RGBA(255, 255, 255, this.alpha) : 0x99ffffff)); break;
				}
				break;
			case 1:
				switch (ui.scr_col) {
					case 0: gr.FillSolidRect(this.x, this.y - p.sbar_o, this.w, this.h + p.sbar_o * 2, RGBA(ui.ct, ui.ct, ui.ct, 15)); gr.FillSolidRect(this.x, this.y + this.bar_y, this.w, this.bar_ht, RGBA(ui.ct, ui.ct, ui.ct, !this.hover && !this.b_is_dragging ? this.alpha : this.hover && !this.b_is_dragging ? this.alpha : 192)); break;
					case 1: gr.FillSolidRect(this.x, this.y - p.sbar_o, this.w, this.h + p.sbar_o * 2, ui.textcol & 0x15ffffff); gr.FillSolidRect(this.x, this.y + this.bar_y, this.w, this.bar_ht, ui.textcol & (!this.hover && !this.b_is_dragging ? RGBA(255, 255, 255, this.alpha) : this.hover && !this.b_is_dragging ? RGBA(255, 255, 255, this.alpha) : 0x99ffffff)); break;
				}
				break;
			case 2:
				ui.theme.SetPartAndStateID(6, 1);
				ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
				ui.theme.SetPartAndStateID(3, !this.hover && !this.b_is_dragging ? 1 : this.hover && !this.b_is_dragging ? 2 : 3);
				ui.theme.DrawThemeBackground(gr, this.x, this.y + this.bar_y, this.w, this.bar_ht);
				break;
		}} catch (e) {}}
	}

	this.paint = function() {
		if (this.hover) this.init = false; if (this.init) return; this.alpha = this.hover ? alpha1 : alpha2; var that = this
		clearTimeout(this.bar_timer); this.bar_timer = false;
		this.bar_timer = setInterval(function() {that.alpha = that.hover ? Math.min(that.alpha += inStep, alpha2) : Math.max(that.alpha -= 3, alpha1); window.RepaintRect(that.x, that.y, that.w, that.h);
			if (that.hover && that.alpha == alpha2 || !that.hover && that.alpha == alpha1) {that.hover_o = that.hover; clearTimeout(that.bar_timer); that.bar_timer = false;}}, 25);
	}

	this.lbtn_up = function(p_x, p_y) {
		var x = p_x - this.x; var y = p_y - this.y;
		if (!this.hover && this.b_is_dragging) this.paint(); else window.RepaintRect(this.x, this.y, this.w, this.h); if (this.b_is_dragging) {this.b_is_dragging = false; but.Dn = false;} this.initial_drag_y = 0;
		if (this.timer_but) {clearTimeout(this.timer_but); this.timer_but = false;}; this.count = -1;
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
		if (!this.smooth) {this.delta = this.scroll; this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h); p.tree_paint(); lib_manager.treeState(false, libraryProps.rememberTree);}
	}

	this.smooth_scroll = function() {
		if (this.delta <= 0.5) {this.delta = 0; this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h); p.tree_paint();}
		if (Math.abs(this.scroll - this.delta) > 0.5) {
			this.s1 += (this.scroll - this.s1) * smoothness; this.s2 += (this.s1 - this.s2) * smoothness; this.delta += (this.s2 - this.delta) * smoothness;
			this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h); p.tree_paint();
		} else if (this.draw_timer) {clearTimeout(this.draw_timer); this.draw_timer = false; lib_manager.treeState(false, libraryProps.rememberTree);}
	}

	this.but = function(dir) {
		this.check_scroll(this.scroll + (dir * -this.row_h));
		if (!this.timer_but) {var that = this; this.timer_but = setInterval(function() {if (that.count > 6) {that.check_scroll(that.scroll + (dir * -that.row_h));} else that.count++;}, 40);}
	}
}

function panel_operations() {
	var prefix = GetPropertyPrefix();
	var def_ppt = window.GetProperty(prefix + "View by Folder Structure: Name // Pattern", "View by Folder Structure // Pattern Not Configurable");
	var DT_LEFT = 0x00000000,
		DT_CENTER = 0x00000001,
		DT_RIGHT = 0x00000002,
		DT_VCENTER = 0x00000004,
		DT_SINGLELINE = 0x00000020,
		DT_CALCRECT = 0x00000400,
		DT_NOPREFIX = 0x00000800,
		DT_END_ELLIPSIS = 0x00008000,
		grps = [],
		i = 0;
	// 	js_stnd = window.GetProperty("ADV.Scrollbar Height Always Full", true);
	// js_stnd = !js_stnd ? 2 : 0;

	// TODO: Move this to config file, create object with properties for each entry and include optional custom sort
	var view_ppt = [
		window.GetProperty(prefix + "View 01: Name // Pattern", "View by Artist // %artist%|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
		window.GetProperty(prefix + "View 02: Name // Pattern", "View by Album Artist // %album artist%|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
		window.GetProperty(prefix + "View 03: Name // Pattern", "View by Album Artist ordered by Date // %album artist%|[$year($if3(%original release date%,%originaldate%,%date%)) - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
		window.GetProperty(prefix + "View 04: Name // Pattern", "View by Album Artist - Album // [%album artist% - ][$year($if3(%original release date%,%originaldate%,%date%)) - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
		window.GetProperty(prefix + "View 05: Name // Pattern", "View by Album // %album%[ '['%album artist%']']|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
		window.GetProperty(prefix + "View 06: Name // Pattern", "View by Genre // %<genre>%|[%album artist% - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
		window.GetProperty(prefix + "View 07: Name // Pattern", "View by Year // $year($if3(%original release date%,%originaldate%,%date%))|[%album artist% - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%")
	];
	var nm = "",
		ppt_l = view_ppt.length + 1;
	for (i = ppt_l; i < ppt_l + 93; i++) {
		nm = window.GetProperty(prefix + "View " + padNumber(i, 2) + ": Name // Pattern");
		if (nm && nm != " // ") view_ppt.push(window.GetProperty(prefix + "View " + padNumber(i, 2) + ": Name // Pattern"));
	}
	if (!window.GetProperty("SYSTEM.View Update", false)) {
		i = view_ppt.length + 1;
		window.SetProperty(prefix + "View " + padNumber(i, 2) + ": Name // Pattern", null);
		view_ppt.push(window.GetProperty(prefix + "View " + padNumber(i, 2) + ": Name // Pattern", "View by Path // $directory_path(%path%)|%filename_ext%$nodisplay{%subsong%}"));
		window.SetProperty("SYSTEM.View Update", true);
	}

	var filter_ppt = [
		window.GetProperty(prefix + "View Filter 01: Name // Query", "Filter // Query Not Configurable"),
		window.GetProperty(prefix + "View Filter 02: Name // Query", "Lossless // \"$info(encoding)\" IS lossless"),
		window.GetProperty(prefix + "View Filter 03: Name // Query", "Lossy // \"$info(encoding)\" IS lossy"),
		window.GetProperty(prefix + "View Filter 04: Name // Query", "Missing Replaygain // %replaygain_track_gain% MISSING"),
		window.GetProperty(prefix + "View Filter 05: Name // Query", "Never Played // %play_count% MISSING"),
		window.GetProperty(prefix + "View Filter 06: Name // Query", "Played Often // %play_count% GREATER 9 OR %lastfm_play_count% GREATER 9"),
		window.GetProperty(prefix + "View Filter 07: Name // Query", "Recently Added // %added% DURING LAST 2 WEEKS"),
		window.GetProperty(prefix + "View Filter 08: Name // Query", "Recently Played // %last_played% DURING LAST 2 WEEKS"),
		window.GetProperty(prefix + "View Filter 09: Name // Query", "Top Rated // %rating% IS 5")
	];
	var filt_l = filter_ppt.length + 1;
	for (i = filt_l; i < filt_l + 90; i++) {

		nm = window.GetProperty(prefix + "View Filter " + padNumber(i, 2) + ": Name // Query");
		if (nm && nm != " // ") {
			filter_ppt.push(window.GetProperty(prefix + "View Filter " + padNumber(i, 2) + ": Name // Query"));
		}
	}

	this.cc = DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX;
	this.l = DT_LEFT | DT_VCENTER | DT_SINGLELINE | DT_CALCRECT | DT_NOPREFIX;
	this.lc = DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_END_ELLIPSIS;
	this.rc = DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX;
	this.s_lc = StringFormat(0, 1)
	this.f_w = [];
	this.f_h = 0;
	this.filter_x1 = 0;
	this.filt = [];
	this.folder_view = 10;
	this.grp = [];
	this.grp_sort = "";
	this.grp_split = [];
	this.grp_split_clone = [];
	this.grp_split_orig = [];
	this.f_menu = [];
	this.menu = [];
	this.multi_value = [];
	this.m_x = 0;
	this.m_y = 0;
	this.pos = -1;
	this.s_cursor = false;
	this.s_search = false;
	this.s_txt = "";
	this.s_x = 0;
	this.s_h = 0;
	this.s_w1 = 0;
	this.s_w2 = 0;
	this.tf = "";

	libraryProps.rootNode = Math.max(Math.min(libraryProps.rootNode, 2), 0);
	//this.syncType = window.GetProperty(" Library Sync: Auto-0, Initialisation Only-1") !== undefined ? window.GetProperty(" Library Sync: Auto-0, Initialisation Only-1") : 1;
	this.syncType = 1;	// init only
	this.scale = Math.max(libraryProps.filterZoom / 100, 0.9);
	libraryProps.filterZoom = this.scale * 100;

	this.setFilterFont = function() {
		var scale = Math.max(libraryProps.filterZoom / 100, 0.9);
		this.filter_font = gdi.Font("Segoe UI", scale > 1.05 ? Math.floor(12 * ui.scale * scale) : 12 * ui.scale * scale, 1);
		this.filter_but_ft = gdi.Font("Segoe UI", scale > 1.05 ? Math.floor(9 * ui.scale * scale) : 9 * ui.scale * scale, 1);
	}
	this.setFilterFont();

	this.filter_by = window.GetProperty("SYSTEM.Filter By", 0);
	// this.pn_h_auto = window.GetProperty("ADV.Height Auto [Expand/Collapse With Root]", false) && libraryProps.rootNode; this.init = true;
	// this.pn_h_max = window.GetProperty("ADV.Height Auto-Expand", 578);
	// this.pn_h_min = window.GetProperty("ADV.Height Auto-Collapse", 100);
	// if (this.pn_h_auto) {this.pn_h = window.GetProperty("SYSTEM.Height", 578); window.MaxHeight = window.MinHeight = this.pn_h;}
	var replaceAt = function(s, n, t) {return s.substring(0, n) + t + s.substring(n + 1);}
	this.reset = window.GetProperty("SYSTEM.Reset Tree", false);
	this.search_paint = function() { window.RepaintRect(ui.x + ui.margin, ui.y, ui.w - ui.margin, this.s_h); }
	// this.setHeight = function(n) {
		// if (!this.pn_h_auto) return; this.pn_h = n ? this.pn_h_max : this.pn_h_min;
		// window.MaxHeight = window.MinHeight = this.pn_h;
		// window.SetProperty("SYSTEM.Height", this.pn_h);
	// }
	this.sort = function(li) {
		switch (this.view_by) {
			case this.folder_view:
				li.OrderByRelativePath();
				break;
			default:
				// var tfo = fb.TitleFormat(this.grp_sort);
				var tfo = fb.TitleFormat(settings.defaultSortString);	// TOOD: Add custom sort to object in settings
				li.OrderByFormat(tfo, 1);
				break;
			}
		}
	var paint_y = Math.floor(libraryProps.searchMode || !libraryProps.showScrollbar ? this.s_h : 0);
	this.tree_paint = function() {window.RepaintRect(ui.x, ui.y + paint_y, ui.w, ui.h - paint_y + 1);}
	this.view_by = window.GetProperty("SYSTEM.View By", 1);
	this.calc_text = function() {
		this.f_w = [];
		var im = gdi.CreateImage(1, 1),
			g = im.GetGraphics();
		for (i = 0; i < this.filt.length; i++) {
			this.f_w[i] = g.CalcTextWidth(this.filt[i].name, this.filter_font);
			if (!i)
				this.f_h = g.CalcTextHeight("String", this.filter_font);
		}
		this.f_sw = g.CalcTextWidth("   ▼", this.filter_but_ft);
		this.filter_x1 = ui.x + ui.w - ui.margin - this.f_w[this.filter_by] - this.f_sw;
		this.s_w2 = libraryProps.searchMode > 1 ? this.filter_x1 - this.s_x - 11 : this.s_w1 - Math.round(ui.row_h * 0.75) - this.s_x + 1;
		im.ReleaseGraphics(g);
	}

	this.getBaseName = function() {
		return libraryProps.rootNode == 2 ? this.grp[this.view_by].name : "All Music";
	}

	this.fields = function(view, filter) {
		this.filt = [];
		this.folder_view = 10;
		this.grp = [];
		this.grp_sort = "";
		this.multi_process = false;
		this.multi_swap = false;
		this.filter_by = filter;
		// this.mv_sort = "";
		this.view = "";
		this.view_by = view;
		for (i = 0; i < view_ppt.length; i++) {
			if (view_ppt[i].indexOf("//") != -1) {
				grps = view_ppt[i].split("//");
				this.grp[i] = { name:grps[0].trim(), type:grps[1] };
			}
		}
		grps = [];
		for (i = 0; i < filter_ppt.length; i++) {
			if (filter_ppt[i].indexOf("//") != -1) {
				grps = filter_ppt[i].split("//");
				this.filt[i] = { name:grps[0].trim(), type:grps[1].trim() };
			}
		}
		i = this.grp.length;
		while (i--) if (!this.grp[i] || this.grp[i].name == "" || this.grp[i].type == "") this.grp.splice(i, 1);
		i = this.filt.length;
		while (i--) if (!this.filt[i] || this.filt[i].name == "" || this.filt[i].type == "") this.filt.splice(i, 1);
		this.grp[this.grp.length] = {name: def_ppt.split("//")[0].trim(), type: ""}
		this.folder_view = this.grp.length - 1; this.filter_by = Math.min(this.filter_by, this.filt.length - 1); this.view_by = Math.min(this.view_by, this.grp.length - 1);
		if (this.grp[this.view_by].type.indexOf("%<") != -1) {
			this.multi_process = true;
		}
		if (this.view_by != this.folder_view) {
			if (this.multi_process) {
				if (this.grp[this.view_by].type.indexOf("$swapbranchprefix{%<") != -1) {
					this.multi_swap = true;
				}
				// this.mv_sort = fb.TitleFormat((this.grp[this.view_by].type.indexOf("album artist") != -1 || this.grp[this.view_by].type.indexOf("%artist%") == -1 && this.grp[this.view_by].type.indexOf("%<artist>%") == -1 && this.grp[this.view_by].type.indexOf("$meta(artist") == -1 ? "%album artist%" : "%artist%") + "|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%");
			}
			this.grp_split = this.grp[this.view_by].type.replace(/^\s+/, "").split("|");
			for (i = 0; i < this.grp_split.length; i++) {
				this.multi_value[i] = this.grp_split[i].indexOf("%<") != -1 ? true : false;
				if (this.multi_value[i]) {
					this.grp_split_orig[i] = this.grp_split[i].slice();
					if (this.grp_split[i].indexOf("$swapbranchprefix{%<") != -1) {
						var ip1 = this.grp_split[i].indexOf("$swapbranchprefix{%<"),
							ip2 = this.grp_split[i].indexOf(">%}", ip1) + 2;
						this.grp_split[i] = replaceAt(this.grp_split[i], ip2, "");
						this.grp_split_orig[i] = this.grp_split[i].replace(/\$swapbranchprefix{%</g, "%<");
						this.grp_split[i] = this.grp_split[i].replace(/\$swapbranchprefix{%</g, "~%<");
					}
					this.grp_split[i] = this.grp_split[i].replace(/%<album artist>%/i,"$if3(%<#album artist#>%,%<#artist#>%,%<#composer#>%,%<#performer#>%)").replace(/%<album>%/i,"$if2(%<#album#>%,%<#venue#>%)").replace(/%<artist>%/i,"$if3(%<artist>%,%<album artist>%,%<composer>%,%<performer>%)").replace(/<#/g,"<").replace(/#>/g,">");
					this.grp_split_clone[i] = this.grp_split[i].slice();
					this.grp_split[i] = this.grp_split_orig[i].replace(/[<>]/g,"");
				}
				this.grp_sort += (this.grp_split[i] + "  |");
				if (this.multi_value[i]) this.grp_split[i] = this.grp_split_clone[i].replace(/%</g, "#!#$meta_sep(").replace(/>%/g, "," + "@@)#!#");
				this.view += (this.grp_split[i] + "|");
			}
			if (!this.multi_process) this.view = this.view.replace(/\$nodisplay{.*?}/gi, "");
			else while(this.view.indexOf("$nodisplay{") != -1) {var ix1 = this.view.indexOf("$nodisplay{"), ix2 = this.view.indexOf("}", ix1); this.view = replaceAt(this.view, ix2, " #@#"); this.view = this.view.replace("$nodisplay{", "#@#");}
			this.view = this.view.slice(0, -1);
			while(this.grp_sort.indexOf("$nodisplay{") != -1) {var ix1 = this.grp_sort.indexOf("$nodisplay{"), ix2 = this.grp_sort.indexOf("}", ix1); this.grp_sort = replaceAt(this.grp_sort, ix2, " "); this.grp_sort = this.grp_sort.replace("$nodisplay{", "");}
		} window.SetProperty("SYSTEM.Filter By", filter); window.SetProperty("SYSTEM.View By", view);
		this.baseName = this.getBaseName();
		this.f_menu = [];
		this.menu = [];
		for (i = 0; i < this.grp.length; i++) this.menu.push(this.grp[i].name);
		for (i = 0; i < this.filt.length; i++) this.f_menu.push(this.filt[i].name);
		this.calc_text();
	}
	this.fields(this.view_by, this.filter_by);

	var propCount = 0;
	for (i = 1; i < 100; i++) {
		var val = window.GetProperty(prefix + "View " + padNumber(i, 2) + ": Name // Pattern");
		if (val && val != " // ") {
			propCount++;
			window.SetProperty(prefix + "View " + padNumber(propCount, 2) + ": Name // Pattern", val);
		} else {
			window.SetProperty(prefix + "View " + padNumber(i, 2) + ": Name // Pattern", null);
		}
	}
	for (i = propCount + 1; i < propCount + 3; i++) {
		window.SetProperty(prefix + "View " + padNumber(i, 2) + ": Name // Pattern", " // ");
	}
	propCount = 0;
	for (i = 1; i < 100; i++) {
		var val = window.GetProperty(prefix + "View Filter " + padNumber(i, 2) + ": Name // Query");
		if (val && val != " // ") {
			propCount++;
			window.SetProperty(prefix + "View Filter " + padNumber(propCount, 2) + ": Name // Query", val);
		} else window.SetProperty(prefix + "View Filter " + padNumber(i, 2) + ": Name // Query", null);
	}
	for (i = propCount + 1; i < propCount + 3; i++) {
		window.SetProperty(prefix + "View Filter " + padNumber(i, 2) + ": Name // Query", " // ");
	}

	this.on_size = function() {
		this.filter_x1 = ui.x + ui.w - ui.margin - this.f_w[this.filter_by] - this.f_sw;
		this.s_x = ui.x + Math.round(ui.margin + ui.row_h);
		this.s_y = ui.y;
		this.s_w1 = ui.w - ui.margin;
		this.s_w2 = libraryProps.searchMode > 1 ? this.filter_x1 - this.s_x - 11 : this.s_w1 - Math.round(ui.row_h * 0.75) - this.s_x + 1;
		this.ln_sp = libraryProps.searchMode && Math.floor(ui.row_h * 0.1);
		this.s_h = libraryProps.searchMode ? ui.row_h + (this.ln_sp * 2) : ui.margin;
		this.s_sp = this.s_h - this.ln_sp;
		this.sp = ui.h - this.s_h - (libraryProps.searchMode ? 0 : ui.margin);
		this.rows = this.sp / ui.row_h;
		this.rows = Math.floor(this.rows);
		this.sp = ui.row_h * this.rows;
		this.node_y = Math.round((ui.row_h - ui.node_sz) / 1.75);
		var sbar_top = !ui.scr_type ? 5 : libraryProps.searchMode ? 3 : 0, sbar_bot = !ui.scr_type ? 5 : 0;
		this.sbar_o = [ui.arrow_pad, Math.max(Math.floor(ui.scr_but_w * 0.2), 3) + ui.arrow_pad * 2, 0][ui.scr_type];
		this.sbar_x = ui.x + ui.w - ui.sbar_sp;
		var top_corr = [this.sbar_o - (ui.but_h - ui.scr_but_w) / 2, this.sbar_o, 0][ui.scr_type];
		var bot_corr = [(ui.but_h - ui.scr_but_w) / 2 - this.sbar_o, -this.sbar_o, 0][ui.scr_type];
		var sbar_y = ui.y + (libraryProps.searchMode ? this.s_sp + 1 : 0) + sbar_top + top_corr;
		var sbar_h =
				// ui.scr_type < js_stnd && true ?
				this.sp + 1 - sbar_top - sbar_bot + bot_corr * 2 //:
				// ui.y + ui.h - sbar_y - sbar_bot + bot_corr;
		if (ui.scr_type == 2) {
			sbar_y += 1;
			sbar_h -= 2;
		}
		sbar.metrics(this.sbar_x, sbar_y, ui.scr_w, sbar_h, this.rows, ui.row_h);
	}
}
if ('DlgCode' in window) { window.DlgCode = 4; }

const SHIFT = 0;
const CTRL = 1;
const ALT = 2;
const CTRL_ALT = 3;

function v_keys() {
	this.selAll = 1;
	this.copy = 3;
	this.back = 8;
	this.enter = 13;
	this.shift = 16;
	this.control = 17;
	this.alt = 18;
	this.paste = 22;
	this.cut = 24;
	this.redo = 25;
	this.undo = 26;
	this.pgUp = 33;
	this.pgDn = 34;
	this.end = 35;
	this.home = 36;
	this.left = 37;
	this.up = 38;
	this.right = 39;
	this.dn = 40;
	this.del = 46;
	this.k = function (n) {
		switch (n) {
			case 0:
				return utils.IsKeyPressed(this.shift);
				break;
			case 1:
				return utils.IsKeyPressed(this.control);
				break;
			case 2:
				return utils.IsKeyPressed(this.alt);
				break;
			case 3:
				return utils.IsKeyPressed(this.control) && utils.IsKeyPressed(this.alt);
				break;
		}
	}
}
// var v = new v_keys();

function library_manager() {
	// const prefix = GetPropertyPrefix();
	var exp = [], full_list, full_list_need_sort = false, node = [], node_s = [],  scr = [], sel = [];
	this.allmusic = []; this.init = false; this.list; this.none = ""; this.node = []; this.process = false; this.root = []; this.time = fb.CreateProfiler(); this.upd = 0, this.upd_search = false;
	const swapPrefix = window.GetProperty("ADV.$swapbranchprefix. Prefixes to Swap (| Separator)", "A|The").split("|");
	if (libraryProps.rememberTree) {
		exp = JSON.parse(window.GetProperty("SYSTEM.Remember.Exp", JSON.stringify(exp)));
		this.process = window.GetProperty("SYSTEM.Remember.Proc", false);
		scr = JSON.parse(window.GetProperty("SYSTEM.Remember.Scr", JSON.stringify(scr)));
		sel = JSON.parse(window.GetProperty("SYSTEM.Remember.Sel", JSON.stringify(sel)));
		p.s_txt = window.GetProperty("SYSTEM.Remember.Search Text", "");
	} else {
		window.SetProperty("SYSTEM.Remember.Exp", JSON.stringify(exp));
		window.SetProperty("SYSTEM.Remember.Scr", JSON.stringify(scr));
		window.SetProperty("SYSTEM.Remember.Sel", JSON.stringify(sel));
		window.SetProperty("SYSTEM.Remember.Search Text", "");
	}
	var arraysIdentical = function (a, b) {
		var i = a.length;
		if (i != b.length) return false;
		while (i--)
			if (a[i] !== b[i]) return false;
		return true;
	}
	var binaryInsert = function(item) {
		var min = 0,
		max = p.list.Count,
		index = Math.floor((min + max) / 2);
		while (max > min) {
			// var tmp = fb.CreateHandleList(item);
			var tmp = fb.FbMetadbHandleList(item);	// cannot get this method to ever be called, not sure if this is what is intended
			tmp.Add(p.list[index]);
			p.sort(tmp);
			if (item.Compare(tmp[0])) max = index;
			else min = index + 1;
			index = Math.floor((min + max) / 2);
		}
		return index;
	}
	this.checkTree = function() {if (!this.upd && !(this.init && libraryProps.rememberTree)) return; this.init = false; timer.reset(timer.update, timer.updatei); this.time.Reset(); library_tree.subCounts =  {"standard": {}, "search": {}, "filter": {}}; this.rootNodes(this.upd == 2 ? 2 : 1, this.process); this.upd = 0;}
	this.removed_f = function(handle_list) {var j = handle_list.Count; while (j--) {var i = this.list.Find(handle_list[j]); if (i != -1) {this.list.RemoveById(i); node.splice(i, 1);}}}
	this.removed_s = function(handle_list) {var j = handle_list.Count; while (j--) {var i = p.list.Find(handle_list[j]); if (i != -1) {p.list.RemoveById(i); node_s.splice(i, 1);}}}
	var sort = function (a, b) {return a.toString().replace(/^\?/,"").replace(/(\d+)/g, function (n) {return ('0000' + n).slice(-5)}).localeCompare(b.toString().replace(/^\?/,"").replace(/(\d+)/g, function (n) {return ('0000' + n).slice(-5)}));}
	var tr_sort = function(data) {data.sort(function(a, b) {return parseFloat(a.tr) - parseFloat(b.tr)}); return data;}

	this.treeState = function(b, state, handle_list, n) {
		if (!state) return;
		p.search_paint();
		p.tree_paint();
		try {
			var i = 0, ix = -1, tr = 0; this.process = false;
			if (library_tree.tree.length && (!b || b && !p.reset)) {
				tr = 0; exp = []; this.process = true; sel = [];
				for (i = 0; i < library_tree.tree.length; i++) {
					tr = !libraryProps.rootNode ? library_tree.tree[i].tr : library_tree.tree[i].tr - 1;
					if (library_tree.tree[i].child.length) exp.push({
						tr: tr,
						a: tr < 1 ? library_tree.tree[i].name : library_tree.tree[library_tree.tree[i].par].name,
						b: tr < 1 ? "" : library_tree.tree[i].name
					});
					tr = library_tree.tree[i].tr;
					if (library_tree.tree[i].sel == true) sel.push({
						tr: tr,
						a: library_tree.tree[i].name,
						b: tr != 0 ? library_tree.tree[library_tree.tree[i].par].name : "",
						c: tr > 1 ? library_tree.tree[library_tree.tree[library_tree.tree[i].par].par].name : ""
					});
				}
				ix = library_tree.get_ix(0, p.s_h + ui.row_h / 2, true, false); tr = 0; var l = Math.min(Math.floor(ix + p.rows), library_tree.tree.length);
				if (ix != -1) {scr = []; for (i = ix; i < l; i++) {tr = library_tree.tree[i].tr; scr.push({tr:tr, a:library_tree.tree[i].name, b:tr != 0 ? library_tree.tree[library_tree.tree[i].par].name : "", c:tr > 1 ? library_tree.tree[library_tree.tree[library_tree.tree[i].par].par].name : ""})}}
				tr_sort(exp); if (libraryProps.rememberTree) {window.SetProperty("SYSTEM.Remember.Exp",JSON.stringify(exp)); window.SetProperty("SYSTEM.Remember.Proc", this.process); window.SetProperty("SYSTEM.Remember.Scr",JSON.stringify(scr)); window.SetProperty("SYSTEM.Remember.Sel",JSON.stringify(sel));}
			}
			if (!b || b && !p.reset && libraryProps.rememberTree) {window.SetProperty("SYSTEM.Remember.Search Text", p.s_txt); if (state == 1) return;}
		} catch (e) {}
		if (!handle_list) {
			this.get_library(); this.rootNodes(1, this.process);
		}
		else {
			switch (n) {
				case 0:
					this.added(handle_list);
					if (ui.w < 1 || !window.IsVisible)
						this.upd = 2;
					else
						timer.lib_update();
					break;
				case 1:
					var upd_done = false, tree_type = p.view_by != p.folder_view ? 0 : 1;
					let items_b;
					switch (tree_type) { // check for changes to items; any change updates all
						case 0:
							var tfo = fb.TitleFormat(p.view);
							items_b = tfo.EvalWithMetadbs(handle_list);
							for (var j = 0; j < handle_list.Count; j++) {
								var h = this.list.Find(handle_list[j]);
								if (h != -1) {if (!arraysIdentical(node[h], items_b[j].split("|"))) {this.removed(handle_list); this.added(handle_list); if (ui.w < 1 || !window.IsVisible) this.upd = 2; else timer.lib_update(); upd_done = true; break;}}
							}
							break;
						case 1:
							items_b = handle_list.GetLibraryRelativePaths();
                            for (var j = 0; j < handle_list.Count; j++) {
                                var h = this.list.Find(handle_list[j]);
                                if (h != -1) {if (!arraysIdentical(node[h], items_b[j].split("\\"))) {this.removed(handle_list); this.added(handle_list); if (ui.w < 1 || !window.IsVisible) this.upd = 2; else timer.lib_update(); upd_done = true; break;}};
                            }
                            break;
					}
					if (upd_done) break;
                    if (p.filter_by > 0 && p.s_show > 1) { // filter: check if not done
                        var handlesInFilter = fb.CreateHandleList(), newFilterItems = fb.CreateHandleList(), origFilter = this.list.Clone();
						// addns
                        try {newFilterItems = fb.GetQueryItems(handle_list, p.filt[p.filter_by].type);} catch (e) {}
                        origFilter.Sort();
						newFilterItems.Sort();
						newFilterItems.MakeDifference(origFilter);
                        if (newFilterItems.Count) this.added_f(newFilterItems);
						// removals
						var removeFilterItems = handle_list.Clone();
						removeFilterItems.Sort();
						removeFilterItems.MakeIntersection(origFilter);
						try {handlesInFilter = fb.GetQueryItems(removeFilterItems, p.filt[p.filter_by].type);} catch (e) {}
						handlesInFilter.Sort();
						removeFilterItems.MakeDifference(handlesInFilter);
						if (removeFilterItems.Count) this.removed_f(removeFilterItems);
						if (removeFilterItems.Count || newFilterItems.Count) {if (!p.s_txt) p.list = this.list; if (ui.w < 1 || !window.IsVisible) this.upd = 2; else timer.lib_update();}
                    }
					if (p.s_txt) { // search: check if not done
						var newSearchItems = fb.CreateHandleList(), origSearch = p.list.Clone();
						// addns
                        try {newSearchItems = fb.GetQueryItems(handle_list, p.s_txt);} catch (e) {}
						origSearch.Sort();
						newSearchItems.Sort();
                        if (p.filter_by > 0 && p.s_show > 1) {var newFilt = this.list.Clone(); newFilt.Sort(); newSearchItems.MakeIntersection(newFilt); newFilt.Dispose();}
						newSearchItems.MakeDifference(origSearch);
                        if (newSearchItems.Count) this.added_s(newSearchItems);
						// removals
						var removeSearchItems = handle_list.Clone();
						removeSearchItems.Sort();
						removeSearchItems.MakeIntersection(origSearch);
						try {
							const handlesInSearch = fb.GetQueryItems(removeSearchItems, p.s_txt);
							handlesInSearch.Sort();
							removeSearchItems.MakeDifference(handlesInSearch);
						} catch (e) {}
						if (removeSearchItems.Count) this.removed_s(removeSearchItems);
						if (newSearchItems.Count || removeSearchItems.Count) {
							this.node = node_s.slice();
							if (!p.list.Count) {
								library_tree.tree = [];
								library_tree.line_l = 0;
								sbar.set_rows(0);
								this.none = "Nothing found";
								p.tree_paint();
								break;
							}
							if (ui.w < 1 || !window.IsVisible) this.upd = 2; else timer.lib_update();
						}
                        // handlesInSearch.Dispose(); newSearchItems.Dispose(); origSearch.Dispose(); removeSearchItems.Dispose();
					}
					break;
				case 2:
					this.removed(handle_list);
					if (ui.w < 1 || !window.IsVisible)
						this.upd = 2;
					else
						timer.lib_update();
					break;
			}
		}
	}

	this.get_library = function() {
		this.empty = "";
		p.list = null;
		this.time.Reset();
		this.none = "";
		this.list = fb.GetLibraryItems();
		full_list = this.list.Clone();
		if (!this.list.Count || !fb.IsLibraryEnabled()) {library_tree.tree = []; library_tree.line_l = 0; sbar.set_rows(0); this.empty = "Nothing to show\n\nConfigure Media Library first\n\nFile>Preferences>Media library"; p.tree_paint(); return;}
		if (p.filter_by > 0 && libraryProps.searchMode > 1) try {this.list = fb.GetQueryItems(this.list, p.filt[p.filter_by].type)} catch (e) {};
		if (!this.list.Count) {library_tree.tree = []; library_tree.line_l = 0; sbar.set_rows(0); this.none = "Nothing found"; p.tree_paint(); return;} this.rootNames("", 0);
	}

	this.rootNames = function(li, search) {
		var i = 0, total; switch (search) {case 0: p.sort(this.list); li = p.list = this.list; node = []; var arr = node; break; case 1: node_s = []; var arr = node_s; break;}
		total = li.Count; var tree_type = p.view_by != p.folder_view ? 0 : 1;
		let items;
        switch (tree_type) {
			case 0: var tfo = fb.TitleFormat(p.view); items = tfo.EvalWithMetadbs(li); for (i = 0; i < total; i++) arr[i] = items[i].split("|"); break; case 1: items = li.GetLibraryRelativePaths(); for (i = 0; i < total; i++) arr[i] = items[i].split("\\"); break;}
	}

	this.prefixes = function(n) {
		if (n.indexOf("~#!#") == -1) return n;
		var found = false, j = 0, ln = 0;
		for (j = 0; j < swapPrefix.length; j++) if (n.indexOf(swapPrefix[j] + " ") != -1) {found = true; break;}
		if (!found) return n.replace("~#!#", "#!#");
		var pr1 = n.split("~#!#"), pr2 = pr1[1].split("#!#"), pr = pr2[0].split("@@");
		for (var i = 0; i < pr.length; i++) for (j = 0; j < swapPrefix.length; j++)  {ln = swapPrefix[j].length + 1; if (pr[i].substr(0, ln) == swapPrefix[j] + " ") pr[i] = pr[i].substr(ln) + ", " + swapPrefix[j];}
		return pr1[0] + "#!#" + pr.join("@@") + "#!#" + pr2[1];
	}

	this.rootNodes = function(lib_update, process) {
		if (!this.list.Count) return;
		this.root = []; var i = 0, j = 1, h = 0, l = 0, n = "";
		if (p.s_txt && (this.upd_search || lib_update == 1)) {
			this.none = ""; try {p.list = fb.GetQueryItems(this.list, p.s_txt);} catch (e) {};
			if (!p.list.Count) {library_tree.tree = []; library_tree.line_l = 0; sbar.set_rows(0); this.none = "Nothing found"; p.tree_paint(); return;}
			this.rootNames(p.list, 1);
			this.node = node_s.slice(); this.upd_search = false;
		} else if (!p.s_txt) {
			p.list = this.list;
			this.node = node.slice()
		};
		var n_o = "#get_node#",
			nU = "",
			total = p.list.Count;
		if (libraryProps.rootNode) {
			this.root[0] = { name: p.getBaseName(), sel: false, child:[], item:[] };
			for (l = 0; l < total; l++) this.root[0].item.push(l);
		}
		else switch (p.multi_process) {
			case false: for (l = 0; l < total; l++) {n = this.node[l][0]; nU = n.toUpperCase(); if (nU != n_o) {n_o = nU; this.root[i] = {name:n, sel:false, child:[], item:[]}; this.root[i].item.push(l); i++;} else this.root[i - 1].item.push(l);} break;
			case true:
				switch (p.multi_swap) {
					case false: for (l = 0; l < total; l++) {n = this.node[l][0]; nU = n.toUpperCase(); if (nU != n_o) {n_o = nU; n = n.replace(/#!##!#/g, "?"); this.root[i] = {name:n.replace(/#@#.*?#@#/g,""), sel:false, child:[], item:[], srt:n}; this.root[i].item.push(l); i++;} else this.root[i - 1].item.push(l);} break;
					case true: for (l = 0; l < total; l++) {n = this.node[l][0]; nU = n.toUpperCase(); if (nU != n_o) {n_o = nU; n = n.replace(/~#!##!#|#!##!#/g, "?"); n = this.prefixes(n); this.root[i] = {name:n.replace(/#@#.*?#@#/g,""), sel:false, child:[], item:[], srt:n}; this.root[i].item.push(l); i++;} else this.root[i - 1].item.push(l);} break;
				}
				break;
		}
		if (!lib_update) sbar.reset();
		/* Draw tree -> */
		if (!libraryProps.rootNode || p.s_txt) library_tree.buildTree(this.root, 0);
		if (libraryProps.rootNode) library_tree.branch(this.root[0], true);
		// if (p.pn_h_auto && (p.init || lib_update) && p.pn_h == p.pn_h_min && library_tree.tree[0]) library_tree.clear_child(library_tree.tree[0]);
		p.init = false;
		// console.log("Library Initialized in: " + this.time.Time / 1000 + " seconds");
		if (lib_update && process) {
			try {
				var exp_l =  exp.length, scr_l = scr.length, sel_l = sel.length, tree_l = library_tree.tree.length;
				for (h = 0; h < exp_l; h++) {
					if (exp[h].tr == 0) {for (j = 0; j < tree_l; j++) if (library_tree.tree[j].name.toUpperCase() == exp[h].a.toUpperCase()) {library_tree.branch(library_tree.tree[j]); tree_l = library_tree.tree.length; break;}}
					else if (exp[h].tr > 0) {for (j = 0; j < tree_l; j++) if (library_tree.tree[j].name.toUpperCase() == exp[h].b.toUpperCase() && library_tree.tree[library_tree.tree[j].par].name.toUpperCase() == exp[h].a.toUpperCase()) {library_tree.branch(library_tree.tree[j]); tree_l = library_tree.tree.length; break;}}
				}
				for (h = 0; h < sel_l; h++) {
					if (sel[h].tr == 0) {for (j = 0; j < tree_l; j++) if (library_tree.tree[j].name.toUpperCase() == sel[h].a.toUpperCase()) {library_tree.tree[j].sel = true; break;}}
					else if (sel[h].tr == 1) {for (j = 0; j < tree_l; j++) if (library_tree.tree[j].name.toUpperCase() == sel[h].a.toUpperCase() && library_tree.tree[library_tree.tree[j].par].name.toUpperCase() == sel[h].b.toUpperCase()) {library_tree.tree[j].sel = true; break;}}
					else if (sel[h].tr > 1) {for (j = 0; j < tree_l; j++) if (library_tree.tree[j].name.toUpperCase() == sel[h].a.toUpperCase() && library_tree.tree[library_tree.tree[j].par].name.toUpperCase() == sel[h].b.toUpperCase() && library_tree.tree[library_tree.tree[library_tree.tree[j].par].par].name.toUpperCase() == sel[h].c.toUpperCase()) {library_tree.tree[j].sel = true; break;}}
				}
				var scr_pos = false; h = 0;
				while (h < scr_l && !scr_pos) {
					if (scr[h].tr == 0) {for (j = 0; j < tree_l; j++) if (library_tree.tree[j].name.toUpperCase() == scr[h].a.toUpperCase()) {sbar.check_scroll(!h ? j * ui.row_h : (j - 3) * ui.row_h); scr_pos = true; break;}}
					else if (scr[h].tr == 1 && !scr_pos) {for (j = 0; j < tree_l; j++) if (library_tree.tree[j].name.toUpperCase() == scr[h].a.toUpperCase() && library_tree.tree[library_tree.tree[j].par].name.toUpperCase() == scr[h].b.toUpperCase()) {sbar.check_scroll(!h ? j * ui.row_h : (j - 3) * ui.row_h); scr_pos = true; break;}}
					else if (scr[h].tr > 1 && !scr_pos) {for (j = 0; j < tree_l; j++) if (library_tree.tree[j].name.toUpperCase() == scr[h].a.toUpperCase() && library_tree.tree[library_tree.tree[j].par].name.toUpperCase() == scr[h].b.toUpperCase() && library_tree.tree[library_tree.tree[library_tree.tree[j].par].par].name.toUpperCase() == scr[h].c.toUpperCase()) {sbar.check_scroll(!h ? j * ui.row_h : (j - 3) * ui.row_h); scr_pos = true; break;}}
					h++;
				}
				if (!scr_pos) {sbar.reset(); p.tree_paint();}
			} catch (e) {};
		} else this.treeState(false, libraryProps.rememberTree);
		if (lib_update && !process) {sbar.reset(); p.tree_paint();}
	}

	this.binaryInsert = function(folder, insert, li, n) {
		let item_a;
		switch (true) {
            case !folder:
				var tfo = fb.TitleFormat(p.view);
				item_a = tfo.EvalWithMetadbs(insert);
				for (var j = 0; j < insert.Count; j++) {var i = binaryInsert(insert[j]); n.splice(i, 0, item_a[j].split("|")); li.Insert(i, insert[j]);} break;
			case folder:
				item_a = insert.GetLibraryRelativePaths(); for (var j = 0; j < insert.Count; j++) {
				var i = binaryInsert(insert[j]); if (i != -1) {n.splice(i, 0, item_a[j].split("\\")); li.Insert(i, insert[j]);}} break;
		}
	}

	this.added = function(handle_list) {
		var tree_type = p.view_by != p.folder_view ? 0 : 1;
        switch (true) {
			case handle_list.Count < 100:
				var lis = fb.CreateHandleList();
				console.log('blah');
				if (p.filter_by > 0 && p.s_show > 1) {try {lis = fb.GetQueryItems(handle_list, p.filt[p.filter_by].type);} catch (e) {}} else lis = handle_list; p.sort(lis);
				this.binaryInsert(p.view_by == p.folder_view, lis, this.list, node);
				if (this.list.Count) this.empty = "";
				if (p.s_txt) {
					var newSearchItems = fb.CreateHandleList();
					try {newSearchItems = fb.GetQueryItems(handle_list, p.s_txt);} catch(e) {}
					this.binaryInsert(p.view_by == p.folder_view, newSearchItems, p.list, node_s);
					this.node = node_s.slice();
					if (!p.list.Count) {
						// pop.tree = []; pop.line_l = 0;
						sbar.set_rows(0); this.none = "Nothing found"; p.tree_paint();
					}
				} else p.list = this.list;
				break;
			default:
				full_list.InsertRange(full_list.Count, handle_list); full_list_need_sort = true;
				if (p.filter_by > 0 && p.s_show > 1) {
					var newFilterItems = fb.CreateHandleList();
					try {newFilterItems = fb.GetQueryItems(handle_list, p.filt[p.filter_by].type);} catch (e) {}
					this.list.InsertRange(this.list.Count, newFilterItems);
					p.sort(this.list);
				}
				else {if (full_list_need_sort) p.sort(full_list); this.list = full_list.Clone(); full_list_need_sort = false;} p.sort(handle_list);
				let item_a;
				switch (tree_type) {
					case 0: var tfo = fb.TitleFormat(p.view); item_a = tfo.EvalWithMetadbs(handle_list); for (var j = 0; j < handle_list.Count; j++) {var i = this.list.Find(handle_list[j]); if (i != -1) node.splice(i, 0, item_a[j].split("|"));} break;
					case 1: item_a = handle_list.GetLibraryRelativePaths(); for (var j = 0; j < handle_list.Count; j++) {var i = this.list.Find(handle_list[j]); if (i != -1) node.splice(i, 0, item_a[j].split("\\"));} break;
				}
				if (this.list.Count) this.empty = "";
				if (p.s_txt) {
					var newSearchItems = fb.CreateHandleList();
					try {newSearchItems = fb.GetQueryItems(handle_list, p.s_txt);} catch(e) {}
					p.list.InsertRange(p.list.Count, newSearchItems); p.sort(p.list); p.sort(newSearchItems);
					let item_a;
					switch (tree_type) {
						case 0: var tfo = fb.TitleFormat(p.view); item_a = tfo.EvalWithMetadbs(newSearchItems); for (var j = 0; j < newSearchItems.Count; j++) {var i = p.list.Find(newSearchItems[j]); if (i != -1) node_s.splice(i, 0, item_a[j].split("|"));} break;
						case 1: item_a = newSearchItems.GetLibraryRelativePaths();
						for (var j = 0; j < newSearchItems.Count; j++) {
							var i = p.list.Find(newSearchItems[j]); if (i != -1) node_s.splice(i, 0, item_a[j].split("\\"));
						} break;
					}
					this.node = node_s.slice();
					if (!p.list.Count) {
						// pop.tree = []; pop.line_l = 0;
						sbar.set_rows(0); this.none = "Nothing found"; p.tree_paint();
					}
				} else p.list = this.list;
				break;
		}
	}

	this.added_f = function(handle_list) {
		console.log('added_f')
        switch (true) {
			case handle_list.Count < 100:
				this.binaryInsert(p.view_by == p.folder_view, handle_list, this.list, node); break;
            default:
                this.list.InsertRange(this.list.Count, handle_list); p.sort(this.list); p.sort(handle_list);
				var tree_type = p.view_by != p.folder_view ? 0 : 1;
				let item_a;
				switch (tree_type) {
						case 0:
							var tfo = fb.TitleFormat(p.view);
							item_a = tfo.EvalWithMetadbs(handle_list);
							for (var j = 0; j < handle_list.Count; j++) {var i = this.list.Find(handle_list[j]); if (i != -1) node.splice(i, 0, item_a[j].split("|"));}
							if (!this.list.Count) this.none = "Nothing found";
							break;
						case 1:
							item_a = handle_list.GetLibraryRelativePaths();
							for (var j = 0; j < handle_list.Count; j++) {var i = this.list.Find(handle_list[j]); if (i != -1) node.splice(i, 0, item_a[j].split("\\"));}
							if (!this.list.Count) this.none = "Nothing found";
							break;
				}
        }
	}

    this.added_s = function(handle_list) {
		console.log('added_s')
		switch (true) {
			case handle_list.Count < 100:
				this.binaryInsert(p.view_by == p.folder_view, handle_list, p.list, node_s); break;
            default:
                p.list.InsertRange(p.list.Count, handle_list); p.sort(p.list);
				var tree_type = p.view_by != p.folder_view ? 0 : 1;
				let item_a;
				switch (tree_type) {
					case 0:
						var tfo = fb.TitleFormat(p.view);
						item_a = tfo.EvalWithMetadbs(handle_list);
						for (var j = 0; j < handle_list.Count; j++) {var i = p.list.Find(handle_list[j]); if (i != -1) node_s.splice(i, 0, item_a[j].split("|"));}
						break;
					case 1:
						item_a = handle_list.GetLibraryRelativePaths();
						for (var j = 0; j < handle_list.Count; j++) {var i = p.list.Find(handle_list[j]); if (i != -1) node_s.splice(i, 0, item_a[j].split("\\"));}
						break;
				}
        }
    }

	this.removed = function(handle_list) {
		var j = handle_list.Count; while (j--) {var i = this.list.Find(handle_list[j]); if (i != -1) {this.list.RemoveById(i); node.splice(i, 1);}}
		if (p.filter_by > 0 && libraryProps.searchMode > 1) {j = handle_list.Count; if (full_list_need_sort) p.sort(full_list); full_list_need_sort = false; while (j--) {i = full_list.Find(handle_list[j]); if (i != -1) full_list.RemoveById(i);}}
		else full_list = this.list.Clone();
		if (p.s_txt) {
			j = handle_list.Count; while (j--) {i = p.list.Find(handle_list[j]); if (i != -1) {p.list.RemoveById(i); node_s.splice(i, 1);}}
			this.node = node_s.slice();
			if (!p.list.Count) {library_tree.tree = []; library_tree.line_l = 0; sbar.set_rows(0); this.none = "Nothing found"; p.tree_paint();}
		}
		else p.list = this.list;
		if (!full_list.Count) {this.empty = "Nothing to show\n\nConfigure Media Library first\n\nFile>Preferences>Media library"; this.root = []; library_tree.tree = []; library_tree.line_l = 0; sbar.set_rows(0); p.tree_paint();}
	}
}

const ObjType = {
	Node: 0,
	Item: 1,
	NoObj: 2
};

function LibraryTree() {

	var get_pos = -1,
		handles = null,
		is_focused = false,
		ix_o = 0,
		last_pressed_coord = {
			x: undefined,
			y: undefined
		},
		last_sel = -1,
		lbtn_dn = false,
		m_i = -1,
		m_br = -1,
		nd = [],
		row_o = 0,
		sent = false,
		tt = g_tooltip,
		//tooltip = window.GetProperty(" Tooltips", false),
		tt_c = 0,
		tt_y = 0,
		tt_id = -1;
    var autoplay = true; // window.GetProperty(" Playlist: Play On Enter Or Send From Menu", false);
	// var btn_pl  = window.GetProperty(" Playlist Use: 0 or 1", "General,1,Alt+LeftBtn,1,MiddleBtn,1").replace(/\s+/g, "").split(",");
	// if (btn_pl[0] == "LeftBtn") window.SetProperty(" Playlist Use: 0 or 1", "General," + btn_pl[1] + ",Alt+LeftBtn," + btn_pl[3] + ",MiddleBtn," + btn_pl[5]);
    var alt_lbtn_pl = !libraryProps.sendToCurrent; //btn_pl[3] == 1 ? true : false,
	const mbtn_pl = !libraryProps.sendToCurrent; //btn_pl[5] == 1 ? true : false;
	// var hotKeys = window.GetProperty(" Hot Key: 1-10 // Assign JScript Panel index in keyboard shortcuts", "CollapseAll,0,PlaylistAdd,0,PlaylistInsert,0,Search,0,SearchClear,0").replace(/^[,\s]+|[,\s]+$/g, "").split(",");
	// var collapseAllIX = parseFloat(hotKeys[1]),
	// 	addIX = parseFloat(hotKeys[3]),
	// 	insertIX = parseFloat(hotKeys[5]),
	// 	searchFocusIX = parseFloat(hotKeys[7]),
	// 	searchClearIX = parseFloat(hotKeys[9]);
	// var custom_sort = window.GetProperty(" Playlist: Custom Sort", "");
	// if (libraryProps.playlistCustomSort) {
	// 	var tf_customSort = fb.TitleFormat(libraryProps.playlistCustomSort);
	// }
	const tf_customSort = fb.TitleFormat(settings.defaultSortString);	// TODO: Do we still need this?
	// var libraryProps.doubleClickAction = window.GetProperty(" Text Double-Click: ExplorerStyle-0 Play-1 Send-2", 1);
	// var lib_playlist = window.GetProperty(" Playlist", "Library View");
	// libraryProps.autoFill = window.GetProperty(" Playlist: AutoFill", true);
	var selection_holder = fb.AcquireUiSelectionHolder(), symb = window.CreateThemeManager("TREEVIEW");
	var im = gdi.CreateImage(ui.node_sz, ui.node_sz),
		g = im.GetGraphics();
	if (ui.node_win) try {
		symb.SetPartAndStateID(2, 1);
		symb.SetPartAndStateID(2, 2);
		symb.DrawThemeBackground(g, 0, 0, ui.node_sz, ui.node_sz);
	} catch (e) {
		ui.node_win = 0;
	}
	im.ReleaseGraphics(g);
	this.line_l = 0; this.sel_items = []; this.subCounts =  {"standard": {}, "filter": {}, "search": {}}; this.tree = [];
	// if (!window.GetProperty("SYSTEM.Playlist Checked", false))
	// 	fb.ShowPopupMessage("Default playlist: Library View.\n\nChange in panel properties if required.", "Library Tree");
	// window.SetProperty("SYSTEM.Playlist Checked", true);
	var arr_contains = function(arr, item) {for (var i = 0; i < arr.length; i++) if (arr[i] == item) return true; return false;}
	var arr_index = function(arr, item) {var n = -1; for (var i = 0; i < arr.length; i++) if (arr[i] == item) {n = i; break;} return n;}
	var check_node = function(gr) {if (sbar.draw_timer || !ui.node_win) return; try {symb.SetPartAndStateID(2, 1); symb.SetPartAndStateID(2, 2); symb.DrawThemeBackground(gr, -ui.node_sz, -ui.node_sz, ui.node_sz, ui.node_sz);} catch (e) {ui.node_win = 0;}}
	var draw_node = function (gr, j, x, y) {
		switch (ui.node_win) {
			case 0:
				if (!libraryProps.nodeHighlight && j > 1) j -= 2;
				x = Math.round(x);
				y = Math.round(y);
				gr.DrawImage(nd[j], x, y, nd[j].Width, nd[j].Height, 0, 0, nd[j].Width, nd[j].Height);
				break;
			case 1:
				if (j > 1) j -= 2;
				symb.SetPartAndStateID(2, !j ? 1 : 2);
				symb.DrawThemeBackground(gr, x, y, ui.node_sz, ui.node_sz);
				break;
		}
	}
	var num_sort = function (a, b) {
		return a - b;
	}
	var sort = function (a, b) {return a.srt.replace(/^\?/,"").replace(/(\d+)/g, function (n) {return ('0000' + n).slice(-5)}).localeCompare(b.srt.replace(/^\?/,"").replace(/(\d+)/g, function (n) {return ('0000' + n).slice(-5)}));}
	var uniq = function(a) {var j = 0, len = a.length, out = [], seen = {}; for (var i = 0; i < len; i++) {var item = a[i]; if (seen[item] !== 1) {seen[item] = 1; out[j++] = item;}} return out.sort(num_sort);}
	this.add = function (x, y, pl) {
		if (y < p.s_h) return;
		var ix = this.get_ix(x, y, true, false);
		p.pos = ix;
		if (ix < this.tree.length && ix >= 0)
			if (this.check_ix(this.tree[ix], x, y, true)) {
				this.clear();
				this.tree[ix].sel = true;
				this.get_sel_items();
				this.load(this.sel_items, true, true, false, pl, false);
				lib_manager.treeState(false, libraryProps.rememberTree);
			}
	}
	// libraryProps.autoCollapse = window.GetProperty(" Node: Auto Collapse", false);
	this.branch_chg = function(br) {var new_br = 0; if (br.tr == 0) {for (var i = 0; i < lib_manager.root.length; i++) {new_br += lib_manager.root[i].child.length; lib_manager.root[i].child = [];}} else {var par = this.tree[br.par]; for (var i = 0; i < par.child.length; i++) {new_br += par.child[i].child.length; par.child[i].child = [];}} return new_br;}
	this.check_row = function (x, y) {
		m_br = -1;
		var im = this.get_ix(x, y, true, false);
		if (im >= this.tree.length || im < 0) return -1;
		var item = this.tree[im];
		if (x < Math.round(ui.pad * item.tr) + ui.icon_w + ui.margin + ui.x && (!item.track || libraryProps.rootNode && item.tr == 0)) m_br = im;
		return im;
	}
	this.clear = function () {
		for (var i = 0; i < this.tree.length; i++) this.tree[i].sel = false;
	}
	this.clear_child = function(br) {br.child = []; this.buildTree(lib_manager.root, 0, true, true);}
	this.deActivate_tooltip = function() {tt_c = 0; tt.Text = ""; tt.TrackActivate = false; tt.Deactivate(); p.tree_paint();}
	this.expandNodes = function (obj, isRoot) {
		this.branch(obj, isRoot, true, true);
		if (obj.child)
			for (var k = 0; k < obj.child.length; k++)
				if (!obj.child[k].track)
					this.expandNodes(obj.child[k], false);
	}
    this.gen_pl = !libraryProps.sendToCurrent;
    this.get_sel_items = function () {p.tree_paint(); var i = 0; this.sel_items = []; for (i = 0; i < this.tree.length; i++) if (this.tree[i].sel) this.sel_items = this.sel_items.concat(this.sel_items, this.tree[i].item); this.sel_items = uniq(this.sel_items);}
	this.getHandles = function(n) {if (n) this.get_sel_items(); var handle_list = fb.CreateHandleList(); try {for (var i = 0; i < this.sel_items.length; i++) handle_list.Add(p.list[this.sel_items[i]]);} catch (e) {} return handle_list;}
	this.leave = function(){if (men.r_up || tt.Text) return; m_br = -1; row_o = 0; m_i = -1; ix_o = 0; p.tree_paint();}
	this.mbtn_up = function(x, y) {this.add(x, y, mbtn_pl);}
	this.on_char = function(code) {if (p.s_search || code != v.copy) return; var handle_list = this.getHandles(true); fb.CopyHandleListToClipboard(handle_list); }
	this.on_focus = function(p_is_focused) {is_focused = p_is_focused; if (p_is_focused && handles && handles.Count) selection_holder.SetSelection(handles);}
	this.row = function(y) {return Math.round((y - p.s_h - ui.row_h * 0.5) / ui.row_h);}
	this.setGetPos = function(pos) {m_i = get_pos = pos;}

	this.create_tooltip = function() {
		if (!libraryProps.tooltips) return;
		tt = g_tooltip;
		tt_y = ui.row_h - libraryProps.rowVertPadding;
		tt_y = p.s_h - Math.floor((ui.row_h - tt_y) / 2)
		tt.SetDelayTime(0, 500);
		tt.Text = "";
	}

	this.Activate_tooltip = function(ix, y) {
		if (tt_id == ix || Math.round(ui.pad * this.tree[ix].tr + ui.margin) + ui.icon_w + (!libraryProps.tooltips || !libraryProps.fullLine ? this.tree[ix].w : this.tree[ix].tt_w) <= sbar.tree_w - ui.sel) return;
		if (tt_c == 2) {
			tt_id = ix;
			return;
		}
		tt_c += 1;
		tt.Activate();
		tt.TrackActivate = true;
		tt.Text = this.tree[ix].name + this.tree[ix].count;
		tt.TrackPosition(Math.round(ui.x + ui.pad * this.tree[ix].tr + ui.margin + ui.icon_w - ui.tt + 2), Math.round(this.row(y) * ui.row_h + tt_y));
		p.tree_paint();
		timer.tooltip();
	}

	this.branch = function(br, base, node, block) {
		if (!br || br.track) return;
		var br_l = br.item.length,
			folderView = p.view_by == p.folder_view ? true : false,
			i = 0,
			k = 0,
			isTrack = false,
			l = base ? 0 : libraryProps.rootNode ? br.tr : br.tr + 1,
			n = "", n_o = "#get_branch#", nU = "", pos = -1;
		if (folderView) base = false;
		if (base) node = false;
		var get = !base || p.s_txt;
		if (!p.multi_process) {
			for (k = 0; k < br_l; k++) {
				pos = br.item[k];
				try {
					if (base || get && l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]
					else n = '#get_track#';
					// if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
					isTrack = libraryProps.nodeShowTracks ? false : l < lib_manager.node[pos].length - 2 ? false : true;
					if (n == "#get_track#") {n = lib_manager.node[pos][l]; isTrack = true;}
					nU = n.toUpperCase();
					if (n_o != nU) {
						n_o = nU;
						br.child[i] = {
							name: n,
							sel: false,
							child: [],
							track: isTrack,
							item: []
						};
						br.child[i].item.push(pos);
						i++;
					} else br.child[i - 1].item.push(pos);
				}
				catch (e) {}
			}
		} else {
			if (p.multi_swap) {
				var srt = "";
				for (k = 0; k < br_l; k++) {
					pos = br.item[k];
					try {
						if (base) n = lib_manager.node[pos][l];
						if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
						isTrack = libraryProps.nodeShowTracks ? false : l < lib_manager.node[pos].length - 2 ? false : true;
						if (n == "#get_track#") {n = lib_manager.node[pos][l]; isTrack = true;}
						nU = n.toUpperCase();
						if (n_o != nU) {
							n_o = nU;
							n = n.replace(/~#!##!#|#!##!#/g, "?");
							n = lib_manager.prefixes(n);
							srt = n;
							n = n.replace(/#@#.*?#@#/g, "");
							br.child[i] = {
								name: n,
								sel: false,
								child: [],
								track: isTrack,
								item: [],
								srt: srt
							};
							br.child[i].item.push(pos);
							i++;
						} else br.child[i - 1].item.push(pos);
					} catch (e) {}
				}
			} else {
				var srt = "";
				for (k = 0; k < br_l; k++) {
					pos = br.item[k];
					try {
						if (base) n = lib_manager.node[pos][l];
						if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
						isTrack = libraryProps.nodeShowTracks ? false : l < lib_manager.node[pos].length - 2 ? false : true;
						if (n == "#get_track#") {n = lib_manager.node[pos][l]; isTrack = true;}
						nU = n.toUpperCase();
						if (n_o != nU) {
							n_o = nU;
							n = n.replace(/#!##!#/g, "?");
							srt = n;
							n = n.replace(/#@#.*?#@#/g, "");
							br.child[i] = {
								name: n,
								sel: false,
								child: [],
								track: isTrack,
								item: [],
								srt: srt
							};
							br.child[i].item.push(pos);
							i++;
						} else br.child[i - 1].item.push(pos);
					} catch (e) {}
				}
			}
		}
		this.buildTree(lib_manager.root, 0, node, true, block);
	}

	var getAllCombinations = function(n) {
		var combinations = [], divisors = [], nn = [], arraysToCombine = []; nn = n.split("#!#");
		for (var i = 0; i < nn.length; i++) {nn[i] = nn[i].split("@@"); if (nn[i] != "") arraysToCombine.push(nn[i]);}
		for (var i = arraysToCombine.length - 1; i >= 0; i--) divisors[i] = divisors[i + 1] ? divisors[i + 1] * arraysToCombine[i + 1].length : 1;
		function getPermutation(n, arraysToCombine) {
			var result = [], curArray;
			for (var i = 0; i < arraysToCombine.length; i++) {
				curArray = arraysToCombine[i];
				result.push(curArray[Math.floor(n / divisors[i]) % curArray.length]);
			} return result;
		}
		var numPerms = arraysToCombine[0].length;
		for (var i = 1; i < arraysToCombine.length; i++) numPerms *= arraysToCombine[i].length;
		for (var i = 0; i < numPerms; i++) combinations.push(getPermutation(i, arraysToCombine));
		return combinations;
	}

	this.buildTree = function(br, tr, node, full, block) {
		var br_l = br.length, i = 0, j = 0, l = !libraryProps.rootNode ? tr : tr - 1;
		if (p.multi_process) {
			var h = -1, multi = [], multi_cond = [], multi_obj = [], multi_rem = [], n = "", n_o = "#condense#", nm_arr = [], nU = "";
			for (i = 0; i < br_l; i++) {
				if (br[i].name.indexOf("@@") != -1) {
					multi = getAllCombinations(br[i].srt);
					multi_rem.push(i);
					for (var m = 0; m < multi.length; m++) multi_obj.push({name:multi[m].join("").replace(/#@#.*?#@#/g,""), item:br[i].item.slice(), track:br[i].track, srt:multi[m].join("")});
				}
			}
            i = multi_rem.length; while (i--) br.splice(multi_rem[i], 1); br_l = br.length; multi_obj.sort(sort);
            i = 0; while (i < multi_obj.length) {n = multi_obj[i].name; nU = n.toUpperCase(); if (n_o != nU) {n_o = nU; multi_cond[j] = {name:n, item:multi_obj[i].item.slice(), track:multi_obj[i].track, srt:multi_obj[i].srt}; j++} else multi_cond[j - 1].item = multi_cond[j - 1].item.concat(multi_obj[i].item.slice()); i++}
            for (i = 0; i < br_l; i++) {br[i].name = br[i].name.replace(/#!#/g, ""); nm_arr.push(br[i].name); if (br[i].srt) br[i].srt = br[i].srt.replace(/#!#/g, "");}
            for (i = 0; i < multi_cond.length; i++) {h = arr_index(nm_arr, multi_cond[i].name); if (h != -1) {br[h].item = br[h].item.concat(multi_cond[i].item.slice()); multi_cond.splice(i ,1);}}
            for (i = 0; i < multi_cond.length; i++) br.splice(i + 1, 0, {name:multi_cond[i].name, sel:false, track:multi_cond[i].track, child:[], item:multi_cond[i].item.slice(), srt:multi_cond[i].srt});
            if (!node || node && !full) br.sort(sort);
            i = br.length; while (i--) {if (i != 0 && br[i].name.toUpperCase() == br[i - 1].name.toUpperCase()) {br[i - 1].item = br[i - 1].item.concat(br[i].item.slice()); br.splice(i, 1);}}
		}
		var par = this.tree.length - 1; if (tr == 0) this.tree = []; br_l = br.length;
		if (libraryProps.nodeItemCounts == 2) var type = p.s_txt ? "search" : p.filter_by > 0 && libraryProps.searchMode > 1 ? "filter" : "standard";
		for (i = 0; i < br_l; i++) {
			j = this.tree.length; this.tree[j] = br[i];
			this.tree[j].top = !i ? true : false; this.tree[j].bot = i == br_l - 1 ? true : false;
			if (tr == (libraryProps.rootNode ? 1 : 0) && i == br_l - 1) this.line_l = j;
			this.tree[j].ix = j; this.tree[j].tr = tr; this.tree[j].par = par;
			if (libraryProps.nodeItemCounts == 2 && tr > 1) var pr = this.tree[par].par;
			switch (true) {
				case l != -1 && !libraryProps.nodeShowTracks: for (var r = 0; r < this.tree[j].item.length; r++) {if (lib_manager.node[this.tree[j].item[r]].length == l + 1 || lib_manager.node[this.tree[j].item[r]].length == l + 2) {this.tree[j].track = true; break;}} break;
				case l == 0 && lib_manager.node[this.tree[j].item[0]].length == 1: this.tree[j].track = true; break;
			}
			this.tree[j].count = !this.tree[j].track || !libraryProps.nodeShowTracks  ? (libraryProps.nodeItemCounts == 1 ? " (" + this.tree[j].item.length + ")" : libraryProps.nodeItemCounts == 2 ?  " (" + this.branchCounts(this.tree[j], !libraryProps.rootNode || j ? false : true, true, false, tr + (tr > 2 ? this.tree[this.tree[pr].par].name : "") + (tr > 1 ? this.tree[pr].name : "") + (tr > 0 ? this.tree[par].name : "") + this.tree[j].name, type) + ")" : "") : "";
			if (!libraryProps.nodeShowTracks && this.tree[j].count == " (0)") this.tree[j].count = "";
			if (br[i].child.length > 0) this.buildTree(br[i].child, tr + 1, node, libraryProps.rootNode && tr == 0 ? true : false);
		}
		if (!block) {if (libraryProps.rootNode && this.tree.length == 1) this.line_l = 0; sbar.set_rows(this.tree.length); p.tree_paint();}
	}

	this.branchCounts = function(br, base, node, block, key, type) {
		if (!br) return; if (this.subCounts[type][key]) return this.subCounts[type][key];
		var b = []; var br_l = br.item.length, folderView = p.view_by == p.folder_view ? true : false, k = 0, l = base ? 0 : libraryProps.rootNode ? br.tr : br.tr + 1, n = "", n_o = "#get_branch#", nU = "", pos = -1; if (folderView) base = false; if (base) node = false; var get = !p.s_txt && !base || p.s_txt;
		switch (p.multi_process) {
			case false:
				for (k = 0; k < br_l; k++) {
					pos = br.item[k];
					try {
						if (base) n = lib_manager.node[pos][l];
						if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
						if (n == "#get_track#") n = lib_manager.node[pos][l]; nU = n.toUpperCase();
						if (n_o != nU) {n_o = nU; b.push({name:n});}
					} catch (e) {}
				}
				break;
			case true:
				switch (p.multi_swap) {
					case false:
						for (k = 0; k < br_l; k++) {
							pos = br.item[k];
							try {
								if (base) n = lib_manager.node[pos][l];
								if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
								if (n == "#get_track#") n = lib_manager.node[pos][l]; nU = n.toUpperCase();
								if (n_o != nU) {
									n_o = nU;
									n = n.replace(/#!##!#/g, "?");
									const srt = n;
									n = n.replace(/#@#.*?#@#/g,"");
									b.push({name:n, srt:srt});}
							} catch (e) {}
						}
						break;
					case true:
						for (k = 0; k < br_l; k++) {
							pos = br.item[k];
							try {
								if (base) n = lib_manager.node[pos][l];
								if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
								if (n == "#get_track#") n = lib_manager.node[pos][l]; nU = n.toUpperCase();
								if (n_o != nU) {
									n_o = nU;
									n = n.replace(/~#!##!#|#!##!#/g, "?");
									n = lib_manager.prefixes(n);
									const srt = n;
									n = n.replace(/#@#.*?#@#/g,"");
									b.push({name:n, srt:srt});}
							} catch (e) {}
						}
						break;
				}
				var h = -1, j = 0, multi = [], multi_cond = [], multi_obj = [], multi_rem = [],nm_arr = []; br_l = b.length; n = ""; n_o = "#condense#"; nU = "";
				for (let i = 0; i < br_l; i++) {
					if (b[i].name.indexOf("@@") != -1) {
						multi = getAllCombinations(b[i].srt);
						multi_rem.push(i);
						for (var m = 0; m < multi.length; m++) multi_obj.push({name:multi[m].join("").replace(/#@#.*?#@#/g,""), srt:multi[m].join("")});
					}
				}
				let i = multi_rem.length; while (i--) b.splice(multi_rem[i], 1); br_l = b.length; multi_obj.sort(sort);
				i = 0; while (i < multi_obj.length) {n = multi_obj[i].name; nU = n.toUpperCase(); if (n_o != nU) {n_o = nU; multi_cond[j] = {name:n, srt:multi_obj[i].srt}; j++} i++}
				for (i = 0; i < br_l; i++) {b[i].name = b[i].name.replace(/#!#/g, ""); nm_arr.push(b[i].name);}
				for (i = 0; i < br_l; i++) {b[i].name = b[i].name.replace(/#!#/g, ""); nm_arr.push(b[i].name); if (b[i].srt) b[i].srt = b[i].srt.replace(/#!#/g, "");}
				for (i = 0; i < multi_cond.length; i++) {h = arr_index(nm_arr, multi_cond[i].name); if (h != -1) multi_cond.splice(i ,1);}
				for (i = 0; i < multi_cond.length; i++) b.splice(i + 1, 0, {name:multi_cond[i].name, srt:multi_cond[i].srt});
				var full = libraryProps.rootNode && br.tr == 0 ? true : false; if (!node || node && !full) b.sort(sort);
				i = b.length; while (i--) {if (i != 0 && b[i].name.toUpperCase() == b[i - 1].name.toUpperCase()) b.splice(i, 1);}
				break;
		}
		this.subCounts[type][key] = b.length; return b.length;
	}

	this.create_images = function() {
		var sz = ui.node_sz,
			plus = true,
			hot = false,
			ln_w = Math.max(Math.floor(sz / 7), 1),
			sy_w = ln_w,
			x = 0,
			y = 0;
		// if (((sz - ln_w * 3) / 2) % 1 != 0)
		// 	sy_w = ln_w > 1 ? ln_w - 1 : ln_w + 1;
		for (var j = 0; j < 4; j++) {
			nd[j] = gdi.CreateImage(sz, sz);
			g = nd[j].GetGraphics();
			g.SetSmoothingMode(SmoothingMode.AntiAlias);
			hot = j > 1 ? true : false;
			plus = !j || j == 2 ? true : false;
			g.FillSolidRect(x, y, sz, sz, RGB(145, 145, 145));
			if (!hot) {
				g.FillGradRect(x + ln_w, y + ln_w, sz - ln_w * 2, sz - ln_w * 2, 91, plus ? ui.iconcol_e[0] : ui.iconcol_c[0],
					plus ? ui.iconcol_e[1] : ui.iconcol_c[1], 1.0);
			} else {
				g.FillGradRect(x + ln_w, y + ln_w, sz - ln_w * 2, sz - ln_w * 2, 91, ui.iconcol_h[0], ui.iconcol_h[1], 1.0);
			}
			var x_o = [x, x + sz - ln_w, x, x + sz - ln_w],
				y_o = [y, y, y + sz - ln_w, y + sz - ln_w];
			for (var i = 0; i < 4; i++)
				g.FillSolidRect(x_o[i], y_o[i], ln_w, ln_w, RGB(186, 187, 188));
			if (plus)
			// 	g.FillSolidRect(Math.floor(x + (sz - sy_w) / 2), y + ln_w + Math.min(ln_w, sy_w), sy_w, sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, !hot ? ui.iconpluscol : ui.iconpluscol_h);
			// g.FillSolidRect(x + ln_w + Math.min(ln_w, sy_w), Math.floor(y + (sz - sy_w) / 2), sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, sy_w, !hot ? ui.iconpluscol : ui.iconpluscol_h);
				g.FillSolidRect(x + (sz - sy_w) / 2, y + ln_w + Math.min(ln_w, sy_w), sy_w, sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, !hot ? ui.iconpluscol : ui.iconpluscol_h);
			g.FillSolidRect(x + ln_w + Math.min(ln_w, sy_w), y + (sz - sy_w) / 2, sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, sy_w, !hot ? ui.iconpluscol : ui.iconpluscol_h);
			nd[j].ReleaseGraphics(g);
		}
	}

	this.tracking = function(list, type) {
		if (type) {handles = fb.CreateHandleList(); try {for (var i = 0; i < list.length; i++) handles.Add(p.list[list[i]]);} catch (e) {}}
		else handles = list.Clone();
		handles.OrderByFormat(tf_customSort, 1);
		selection_holder.SetSelection(handles);
	}

	this.load = function(list, type, add, send, def_pl, insert) {
		var i = 0,
			np_item = -1,
			pid = -1,
			pln = plman.FindOrCreatePlaylist(libraryProps.libPlaylistName, false);
		let items;
		if (!def_pl) pln = plman.ActivePlaylist;
		else plman.ActivePlaylist = pln;
		if (type) {
			items = fb.CreateHandleList();
			for (i = 0; i < list.length; i++)
				items.Add(p.list[list[i]]);
		} else items = list.Clone();
		// if (p.multi_process && !libraryProps.playlistCustomSort) items.OrderByFormat(p.mv_sort, 1);
		// if (libraryProps.playlistCustomSort) items.OrderByFormat(tf_customSort, 1);
		handles = items.Clone();
		selection_holder.SetSelection(handles);
		if (fb.IsPlaying && !add && fb.GetNowPlaying()) {
			for (i = 0; i < items.Count; i++)
				if (fb.GetNowPlaying().Compare(items[i])) {
					np_item = i;
					break;
				}
			var pl_chk = true;
			if (np_item != -1) { var np = plman.GetPlayingItemLocation(); if (np.IsValid) { if (np.PlaylistIndex != pln) pl_chk = false; else pid = np.PlaylistItemIndex; } }
			if (np_item != -1 && pl_chk && pid == -1 && items.Count < 5000) {
				if (ui.dui) plman.SetActivePlaylistContext();
				for (i = 0; i < 20; i++) {
					fb.RunMainMenuCommand("Edit/Undo");
					var np = plman.GetPlayingItemLocation();
					if (np.IsValid) {
						pid = np.PlaylistItemIndex;
						if (pid != -1) break;
					}
				}
			}
			if (np_item != -1 && pid != -1) {
				plman.ClearPlaylistSelection(pln); plman.SetPlaylistSelectionSingle(pln, pid, true); plman.RemovePlaylistSelection(pln, true);
				var it = items.Clone(); items.RemoveRange(np_item, items.Count); it.RemoveRange(0, np_item + 1);
				if (plman.PlaylistItemCount(pln) < 5000)
					plman.UndoBackup(pln);
				plman.InsertPlaylistItems(pln, 0, items);
				plman.InsertPlaylistItems(pln, plman.PlaylistItemCount(pln), it);
			} else {
				if (plman.PlaylistItemCount(pln) < 5000)
					plman.UndoBackup(pln);
				plman.ClearPlaylist(pln);
				plman.InsertPlaylistItems(pln, 0, items);
			}
		} else if (!add) {
			if (plman.PlaylistItemCount(pln) < 5000) plman.UndoBackup(pln); plman.ClearPlaylist(pln); plman.InsertPlaylistItems(pln, 0, items);
		} else {
			if (plman.PlaylistItemCount(pln) < 5000) plman.UndoBackup(pln);
			plman.InsertPlaylistItems(pln, !insert ? plman.PlaylistItemCount(pln) : plman.GetPlaylistFocusItemIndex(pln), items, true);
			var f_ix = !insert || plman.GetPlaylistFocusItemIndex(pln) == -1 ? plman.PlaylistItemCount(pln) - items.Count : plman.GetPlaylistFocusItemIndex(pln) - items.Count;
			plman.SetPlaylistFocusItem(pln, f_ix); plman.EnsurePlaylistItemVisible(pln, f_ix);
		}
		if (autoplay && send) {
			var c = (plman.PlaybackOrder === 3 || plman.PlaybackOrder === 4) ? Math.ceil(plman.PlaylistItemCount(pln) * Math.random() - 1) : 0;
			plman.ExecutePlaylistDefaultAction(pln, c);
		}
	}

	// this function seems setup to collapse and scroll to the selected item, but it doesn't take an x,y so it always
	// collapses everything and does a bunch of useless checks given that it always starts from the first node
	this.collapseAll = function() {
		// var ic = this.get_ix(ui.x + 10, ui.y + p.s_h + ui.row_h / 2, true, false),
			// j = this.tree[ic].tr;
		var ic = 0;
		// console.log(ic, j, 10, p.s_h + ui.row_h / 2, this.tree[ic].tr);
		// if (libraryProps.rootNode) j -= 1;
		// if (this.tree[ic].tr != 0) {
		// 	var par = this.tree[ic].par,
		// 		pr_pr = [];
		// 	for (var m = 1; m < j + 1; m++) {
		// 		if (m == 1) pr_pr[m] = par;
		// 		else pr_pr[m] = this.tree[pr_pr[m - 1]].par;
		// 		ic = pr_pr[m];
		// 	}
		// }
		var nm = this.tree[ic].name.toUpperCase();
		for (var h = 0; h < this.tree.length; h++) {
			if (!libraryProps.rootNode || this.tree[h].tr)
				this.tree[h].child = [];
		}
		this.buildTree(lib_manager.root, 0);
		let scr_pos = false;
		for (let j = 0; j < this.tree.length; j++)
			if (this.tree[j].name.toUpperCase() == nm) {
				sbar.check_scroll(j * ui.row_h);
				scr_pos = true;
				break;
			}
		if (!scr_pos) {
			sbar.reset();
			p.tree_paint();
		}
		lib_manager.treeState(false, libraryProps.rememberTree);
	}

	this.expand = function(ie, nm) {
		var h = 0, m = 0; this.tree[ie].sel = true;
		if (libraryProps.autoCollapse) {
			var j = 0, par = 0, parent = [];
			for (h = 0; h < this.tree.length; h++) if (this.tree[h].sel) {
				j = this.tree[h].tr;
				if (libraryProps.rootNode) j -= 1;
				if (this.tree[h].tr != 0) {
					par = this.tree[h].par;
					let pr_pr = [];
					for (let m = 1; m < j + 1; m++) {
						if (m == 1) pr_pr[m] = par;
						else pr_pr[m] = this.tree[pr_pr[m - 1]].par;
						parent.push(pr_pr[m]);
					}
				}
			}
			for (h = 0; h < this.tree.length; h++) if (!arr_contains(parent, h) && !this.tree[h].sel && (!libraryProps.rootNode || this.tree[h].tr)) this.tree[h].child = [] ; this.buildTree(lib_manager.root, 0);
		}
		var start_l = this.tree.length,
			nodes = -1;
		m = this.tree.length;
		while (m--) {
			if (this.tree[m].sel) {
				this.expandNodes(this.tree[m], !!libraryProps.rootNode && !m);
				nodes++;
			}
		}
		this.clear();
		if (libraryProps.rootNode && this.tree.length == 1) this.line_l = 0; sbar.set_rows(this.tree.length); p.tree_paint(); var nm_n = "";
		for (h = 0; h < this.tree.length; h++) {
			nm_n = (this.tree[h].tr ? this.tree[this.tree[h].par].name : "") + this.tree[h].name; nm_n = nm_n.toUpperCase();
			if (nm_n == nm) break;
		}
		var new_items = this.tree.length - start_l + nodes, s = Math.round(sbar.scroll / ui.row_h + 0.4), n = Math.max(h - s, libraryProps.rootNode ? 1 : 0);
		if (n + 1 + new_items > sbar.rows_drawn) {if (new_items > (sbar.rows_drawn - 2)) sbar.check_scroll(h * ui.row_h); else sbar.check_scroll(Math.min(h * ui.row_h,(h + 1 - sbar.rows_drawn + new_items) * ui.row_h));}
		if (sbar.scroll > h * ui.row_h) sbar.check_scroll(h * ui.row_h); lib_manager.treeState(false, libraryProps.rememberTree);
	}

	this.draw = function(gr) {
		try {
			// ui.linecol = rgb(0,0,255);
			if (lib_manager.empty)
				return gr.GdiDrawText(lib_manager.empty, ui.font, ui.textcol, ui.x + ui.margin, ui.y + p.s_h, sbar.tree_w, ui.row_h * 5, 0x00000004 | 0x00000400);
			if (!this.tree.length)
				return gr.GdiDrawText(lib_manager.none, ui.font, ui.textcol, ui.x + ui.margin, ui.y + p.s_h, sbar.tree_w, ui.row_h, 0x00000004 | 0x00000400);
			var libraryProfiler = timings.showDrawTiming && fb.CreateProfiler('library_tree');
			var item_x = 0,
				item_y = 0,
				item_w = 0,
				nm = '',
				start_row = Math.round(sbar.delta / ui.row_h + 0.4),
				last_row = this.tree.length < start_row + p.rows ? this.tree.length : start_row + p.rows,
				sel_x = 0,
				sel_w = 0;
			var lineWidth = scaleForDisplay(1);
			check_node(gr);
			var depthRows = [];
			for (var j = 0; j <= this.tree[start_row].tr; j++) {
				// first row in the tree needs start_row set for all depths (in case expanded and scrolled tree)
				depthRows[j] = start_row;
			}
			if (this.tree[start_row].tr > 0) {
				var topLevel = this.tree[start_row].par;
				for (i = 1; i < this.tree[start_row].tr; i++) {
					topLevel = this.tree[topLevel].par;
				}
				if (this.tree[topLevel].bot) {
					// clear depthRows[0] if the parent node of the first item is the bottom of the main branch
					depthRows[0] = undefined;
				}
			}
			for (var i = start_row; i < last_row; i++) {
				const item = this.tree[i];
				const depth = item.tr;
				if (item.top) {
					depthRows[depth] = i;
				}
				if (item.bot || i === last_row - 1) {
					// if this is the bottom of the branches nodes, draw the line
					// if it is the last visible row in the tree, draw all lines, if they haven't been drawn previously
					for (var drawDepth = (i === last_row - 1 ? 0 : depth); drawDepth <= depth; drawDepth++) {
						if (depthRows[drawDepth] !== undefined) {
							const line_row_start = depthRows[drawDepth];
							const line_row_end = i + (item.bot && drawDepth === depth ? .5 : 1);
							var l_x = (ui.x + Math.round(ui.pad * drawDepth + ui.margin) + Math.floor(ui.node_sz / 2));
							var l_y = Math.round(ui.y + ui.row_h * line_row_start + p.s_h - sbar.delta);
							var lineHeight = Math.ceil(ui.row_h * (line_row_end - line_row_start)) + 1;
							gr.FillSolidRect(l_x, l_y, lineWidth, lineHeight, ui.linecol);
						}
					}
					if (item.bot) {
						depthRows[depth] = undefined;
					}
				}

				item_y = Math.round(ui.y + ui.row_h * i + p.s_h - sbar.delta);
				if (ui.alternate) {
					if (i % 2 == 0)
						gr.FillSolidRect(ui.x, item_y + 1, sbar.stripe_w, ui.row_h - 2, ui.b1);
					else
						gr.FillSolidRect(ui.x, item_y, sbar.stripe_w, ui.row_h, ui.b2);
				}
				// item selected
				let bgColor = ui.backcolsel;
				if (item.sel && (ui.backcolsel !== 0 || col.primary !== 0)) {
					nm = item.name + item.count;
					item_x = Math.round(ui.pad * item.tr + ui.margin) + ui.icon_w;
					item_w = gr.CalcTextWidth(nm, ui.font);
					sel_x = ui.x + item_x - ui.sel;
					sel_w = Math.min(item_w + ui.sel * 2, ui.x + sbar.tree_w - sel_x - 1);
					if (libraryProps.fullLine) sel_w = ui.x + sbar.tree_w - sel_x;
					if (!tt.Text || m_i != i && tt.Text) {
						bgColor = col.primary;
						gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, bgColor);
						gr.DrawRect(sel_x, item_y, sel_w, ui.row_h, 1, col.lightAccent);
					}
				}
			}
			for (i = start_row; i < last_row; i++) {
				const item = this.tree[i];
				item_y = Math.round(ui.y + ui.row_h * i + p.s_h - sbar.delta);
				nm = item.name + item.count;
				item_x = Math.round(ui.x + ui.pad * item.tr + ui.margin);
				item_w = gr.CalcTextWidth(nm, ui.font);
				var nodeLineWidth = scaleForDisplay(2);
				if (libraryProps.tooltips && libraryProps.fullLine) item.tt_w = item_w;
				var y2 = Math.round(ui.y + ui.row_h * (i + 0.5) + p.s_h - sbar.delta) - 1;
				if (!item.track) {
					gr.FillSolidRect(item_x + ui.node_sz, y2, ui.l_s1, nodeLineWidth, ui.linecol);
                    draw_node(gr, item.child.length < 1 ? m_br != i ? 0 : 2 : m_br != i ? 1 : 3, item_x, item_y + p.node_y);
				}
				else {
					// y2 = Math.round(p.s_h - sbar.delta) + Math.ceil(ui.row_h * (i + 0.5)) - ui.l_widthf; // TODO: Do we need this line?
					gr.FillSolidRect(item_x + ui.l_s2, y2, ui.l_s3, nodeLineWidth, ui.linecol);
				}
				item_x += ui.icon_w;
				let bgColor = item.sel ? col.primary : undefined;
				if (!tt.Text) {
					if (m_i == i) {	// hovered
						sel_x = item_x - ui.sel;
						sel_w = Math.min(item_w + ui.sel * 2, ui.x + sbar.tree_w - sel_x - 1);
						if (libraryProps.fullLine)
							sel_w = ui.x + sbar.tree_w - sel_x;
						bgColor = shadeColor(col.primary, 10);
						gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, bgColor);
						gr.DrawRect(sel_x, item_y, sel_w, ui.row_h, 1, col.lightAccent);
					}
				}
				if (libraryProps.fullLine) {
					item_w = ui.x + sbar.tree_w - item_x;
				}
				item.w = item_w;
				var txt_c = item.sel ? ui.textselcol : m_i == i ? ui.textcol_h : ui.textcol;
				if (new Color(bgColor).brightness > 180) {
					txt_c = m_i == i ? rgb(0,0,0) : rgb(48,48,48);
				}
				gr.GdiDrawText(nm, ui.font, txt_c, item_x, item_y, ui.x + sbar.tree_w - item_x - ui.sel, ui.row_h, p.lc);
				if (timings.showDrawTiming) {
					libraryProfiler.Print();
				}
			}
		} catch (e) {}
	}

	this.send = function(item, x, y) {
		if (!this.check_ix(item, x, y, false)) return;
		if (v.k(CTRL)) this.load(this.sel_items, true, false, false, this.gen_pl, false);
		else if (v.k(SHIFT)) this.load(this.sel_items, true, false, false, this.gen_pl, false);
		else this.load(item.item, true, false, false, this.gen_pl, false);
	}

	this.track = function(item, x, y) {
		if (!this.check_ix(item, x, y, false)) return;
		if (v.k(CTRL)) this.tracking(this.sel_items, true);
		else if (v.k(SHIFT)) this.tracking(this.sel_items, true);
		else this.tracking(item.item, true);
	}

	this.lbtn_dn = function(x, y) {
		lbtn_dn = false;
		sent = false;
		if (y < p.s_h) return;
		var ix = this.get_ix(x, y, true, false);
		p.pos = ix;
		if (ix >= this.tree.length || ix < 0)
			return this.get_selection(-1);
		var item = this.tree[ix],
			clickedOn = x < Math.round(ui.pad * item.tr) + ui.icon_w + ui.margin + ui.x ? ObjType.Node : this.check_ix(item, x, y, false) ? ObjType.Item : ObjType.NoObj,
			expanded = item.child.length > 0;
		switch (clickedOn) {
			case ObjType.Node:
				if (expanded) {
					this.clear_child(item);
					// if (!ix && this.tree.length == 1) {
					// 	p.setHeight(false);
					// }
				} else {
					if (libraryProps.autoCollapse)
						this.branch_chg(item, false, true);
					var row = this.row(y);
					this.branch(item, !libraryProps.rootNode || ix ? false : true, true);
					// if (!ix) p.setHeight(true);
					if (libraryProps.autoCollapse)
						ix = item.ix
					if (row + 1 + item.child.length > sbar.rows_drawn) {
						if (item.child.length > (sbar.rows_drawn - 2)) {
							sbar.check_scroll(ix * ui.row_h);
						} else {
							sbar.check_scroll(Math.min(ix * ui.row_h, (ix + 1 - sbar.rows_drawn + item.child.length) * ui.row_h));
						}
					}
				}
				if (sbar.scroll > ix * ui.row_h)
					sbar.check_scroll(ix * ui.row_h);
				this.check_row(x, y);
				break;
			case ObjType.Item:
				last_pressed_coord.x = x - ui.x;
				last_pressed_coord.y = y - ui.y;
				lbtn_dn = true;
				if (v.k(ALT) && libraryProps.autoFill) return;
				if (!item.sel && !v.k(CTRL)) this.get_selection(ix, item.sel);
				break;
		}
		lib_manager.treeState(false, libraryProps.rememberTree);
	}

	this.lbtn_up = function(x, y) {
		// x -= ui.x; y -= ui.y;  // Mordred: fix mouse offsets
		last_pressed_coord = {x: undefined, y: undefined};
		lbtn_dn = false;
		if (y < p.s_h || sent || but.Dn) return;
		var ix = this.get_ix(x, y, true, false);
		p.pos = ix;
		if (ix >= this.tree.length || ix < 0)
			return this.get_selection(-1);
		var item = this.tree[ix],
			clickedOn = x < Math.round(ui.pad * item.tr) + ui.icon_w + ui.margin ? ObjType.Node : this.check_ix(item, x, y, false) ? ObjType.Item : ObjType.NoObj;
		if (clickedOn !== ObjType.Item) return;
		if (v.k(ALT) && libraryProps.autoFill) {
			return this.add(x, y, alt_lbtn_pl);
		}
		if (!v.k(CTRL)) {
			this.clear();	// clear selected items unless ctrl key is down
		}
		this.get_selection(ix, item.sel);
		p.tree_paint();
		lib_manager.treeState(false, libraryProps.rememberTree);
		if (libraryProps.autoFill) this.send(item, x, y);
		else this.track(item, x, y);
	}

	this.dragDrop = function(x, y) {
		x -= ui.x; y -= ui.y;  // Mordred: fix mouse offsets
		if (!lbtn_dn) return;
		if (Math.sqrt((Math.pow(last_pressed_coord.x - x, 2) + Math.pow(last_pressed_coord.y - y, 2))) > 7) {
			last_pressed_coord = {x: undefined, y: undefined}
			var handle_list = this.getHandles();
			fb.DoDragDrop(window.ID, handle_list, handle_list.Count ? 0|1 : 0);
			lbtn_dn = false;
		}
	}

	this.lbtn_dblclk = function(x, y) {
		sent = true;
		if (y < p.s_h)
			return;
		var ix = this.get_ix(x, y, true, false);
		if (ix >= this.tree.length || ix < 0)
			return;
		var item = this.tree[ix];
		if (!libraryProps.autoFill) this.send(item, x, y);
		if (!this.check_ix(item, x, y, false) || libraryProps.doubleClickAction == 2) return;
		var mp = 1;
		if (!libraryProps.doubleClickAction) {
			if (item.child.length) mp = 0;
			switch (mp) {
				case 0:
					this.clear_child(item);
					// if (!ix && this.tree.length == 1) p.setHeight(false);
					break;
				case 1:
					if (libraryProps.autoCollapse) this.branch_chg(item, false, true);
					// if (!ix) p.setHeight(true);
					var row = this.row(y);
					this.branch(item, !libraryProps.rootNode || ix ? false : true, true);
					if (libraryProps.autoCollapse) ix = item.ix
					if (row + 1 + item.child.length > sbar.rows_drawn) {
						if (item.child.length > (sbar.rows_drawn - 2)) sbar.check_scroll(ix * ui.row_h);
						else sbar.check_scroll(Math.min(ix * ui.row_h,(ix + 1 - sbar.rows_drawn + item.child.length) * ui.row_h));
					}
					break;
			}
			if (sbar.scroll > ix * ui.row_h) sbar.check_scroll(ix * ui.row_h);
			lib_manager.treeState(false, libraryProps.rememberTree);
		}
		if (libraryProps.doubleClickAction || !libraryProps.doubleClickAction && mp == 1 && !item.child.length) {
			var playlistIndex = plman.FindOrCreatePlaylist(libraryProps.libPlaylistName, false);
			if (!this.gen_pl)
				playlistIndex = plman.ActivePlaylist;
			plman.ActivePlaylist = playlistIndex;
			var itemIndex = 0;
			if (plman.PlaybackOrder === PlaybackOrder.Random || plman.PlaybackOrder === PlaybackOrder.ShuffleTracks) {
				itemIndex = Math.ceil(plman.PlaylistItemCount(playlistIndex) * Math.random() - 1);
			}
			library_tree.load(library_tree.sel_items, true, false, true, false, false); // replace current playlist
			plman.ExecutePlaylistDefaultAction(playlistIndex, itemIndex);
		}
	}

	this.get_selection = function(idx, state, add, bypass) {
		var sel_type = idx == -1 && !add ? 0 : v.k(SHIFT) && last_sel > -1 && !bypass ? 1 : v.k(CTRL) && !bypass ? 2 : !state ? 3 : 0;
		switch (sel_type) {
			case 0: this.clear(); this.sel_items = []; break;
			case 1: var direction = (idx > last_sel) ? 1 : -1; if (!v.k(CTRL)) this.clear(); for (var i = last_sel; ; i += direction) {this.tree[i].sel = true; if (i == idx) break;} this.get_sel_items(); p.tree_paint(); break;
			case 2: this.tree[idx].sel = !this.tree[idx].sel; this.get_sel_items(); last_sel = idx; break;
            case 3: this.sel_items = []; if (!add) this.clear(); if (!add) this.tree[idx].sel = true; this.sel_items = this.sel_items.concat(this.tree[idx].item); this.sel_items = uniq(this.sel_items); last_sel = idx; break;
		}
	}

	this.move = function(x, y) {
		if (but.Dn) return;
		var ix = this.get_ix(x, y, false, false);
		get_pos = this.check_row(x, y);
		m_i = -1;
		if (ix !== -1) {
			m_i = ix;
			if (libraryProps.tooltips)
				this.Activate_tooltip(ix, y);
		}
		if (m_i == ix_o && m_br == row_o) return;
		tt_id = -1;
		if (libraryProps.tooltips && tt.Text) this.deActivate_tooltip();
		if (!sbar.draw_timer) p.tree_paint();
		ix_o = m_i;
		row_o = m_br;
	}

	this.get_ix = function(x, y, simple, type) {
		var ix;
		y -= ui.y; // Mordred: fix row indexing?
		x -= ui.x;
		if (y > p.s_h && y < p.s_h + p.sp) {
			ix = this.row(y + sbar.delta);
		} else {
			ix = -1;
		}
		if (simple) return ix;
		if (this.tree.length > ix && ix >= 0 && x < sbar.tree_w && y > p.s_h && y < p.s_h + p.sp && this.check_ix(this.tree[ix], x + ui.x, y + ui.y, type)) return ix;
		else return -1;
	}

	this.check_ix = function(br, x, y, type, print) {
		if (!br) return false;
		x -= ui.x;  // Mordred: fix row indexing?
		return type ? (x >= Math.round(ui.pad * br.tr + ui.margin) && x < Math.round(ui.pad * br.tr + ui.margin) + br.w + ui.icon_w)
			: (x >= Math.round(ui.pad * br.tr + ui.margin) + ui.icon_w) && x < Math.min(Math.round(ui.pad * br.tr + ui.margin) + ui.icon_w + br.w, sbar.tree_w);
	}

	this.on_key_down = function(vkey) {
		if (p.s_search) return;
		switch(vkey) {
			case v.left:
				if (!(p.pos >= 0) && get_pos != -1) p.pos = get_pos;
				else p.pos = p.pos + this.tree.length % this.tree.length;
				p.pos = Math.max(Math.min(p.pos, this.tree.length - 1), 0); get_pos = -1; m_i = -1;
				if ((this.tree[p.pos].tr == (libraryProps.rootNode ? 1 : 0)) && this.tree[p.pos].child.length < 1) break;
				if (this.tree[p.pos].child.length > 0) {var item = this.tree[p.pos]; this.clear_child(item); this.get_selection(item.ix); m_i = p.pos = item.ix;}
				else {try {var item = this.tree[this.tree[p.pos].par]; this.clear_child(item); this.get_selection(item.ix); m_i = p.pos = item.ix;} catch (e) {return;};}
				p.tree_paint();
				if (libraryProps.autoFill) this.load(this.sel_items, true, false, false, this.gen_pl, false);
				sbar.set_rows(this.tree.length); if (sbar.scroll > p.pos * ui.row_h) sbar.check_scroll(p.pos * ui.row_h); lib_manager.treeState(false, libraryProps.rememberTree);
				break;
			case v.right:
				if (!(p.pos >= 0) && get_pos != -1) p.pos = get_pos
				else p.pos = p.pos + this.tree.length % this.tree.length;
				p.pos = Math.max(Math.min(p.pos, this.tree.length - 1), 0); get_pos = -1; m_i = -1;
				var item = this.tree[p.pos]; if (libraryProps.autoCollapse) this.branch_chg(item, false, true);
				this.branch(item, libraryProps.rootNode && p.pos == 0 ? true : false, true);
				this.get_selection(item.ix); p.tree_paint(); m_i = p.pos = item.ix;
				if (libraryProps.autoFill) this.load(this.sel_items, true, false, false, this.gen_pl, false);
				sbar.set_rows(this.tree.length);
				var row = (p.pos * ui.row_h - sbar.scroll) / ui.row_h;
				if (row + item.child.length > sbar.rows_drawn) {
					if (item.child.length > (sbar.rows_drawn - 2)) sbar.check_scroll(p.pos * ui.row_h);
					else sbar.check_scroll(Math.min(p.pos * ui.row_h,(p.pos + 1 - sbar.rows_drawn + item.child.length) * ui.row_h));
				}
				lib_manager.treeState(false, libraryProps.rememberTree);
				break;
			case v.pgUp:
				if (this.tree.length == 0) break; p.pos = Math.round(sbar.scroll / ui.row_h + 0.4) - Math.floor(p.rows); p.pos = Math.max(!libraryProps.rootNode ? 0 : 1, p.pos); sbar.wheel(1, true); this.get_selection(this.tree[p.pos].ix); p.tree_paint();
				if (libraryProps.autoFill) this.load(this.sel_items, true, false, false, this.gen_pl, false); lib_manager.treeState(false, libraryProps.rememberTree); break;
			case v.pgDn: if (this.tree.length == 0) break; p.pos = Math.round(sbar.scroll / ui.row_h + 0.4); p.pos = p.pos + Math.floor(p.rows) * 2 - 1; p.pos = this.tree.length < p.pos ? this.tree.length - 1 : p.pos; sbar.wheel(-1, true); this.get_selection(this.tree[p.pos].ix); p.tree_paint(); if (libraryProps.autoFill) this.load(this.sel_items, true, false, false, this.gen_pl, false); lib_manager.treeState(false, libraryProps.rememberTree); break;
			case v.home: if (this.tree.length == 0) break; p.pos = !libraryProps.rootNode ? 0 : 1; sbar.check_scroll(0); this.get_selection(this.tree[p.pos].ix); p.tree_paint(); if (libraryProps.autoFill) this.load(this.sel_items, true, false, false, this.gen_pl, false); lib_manager.treeState(false, libraryProps.rememberTree); break;
			case v.end: if (this.tree.length == 0) break; p.pos = this.tree.length - 1; sbar.check_scroll((this.tree.length) * ui.row_h); this.get_selection(this.tree[p.pos].ix); p.tree_paint(); if (libraryProps.autoFill) this.load(this.sel_items, true, false, false, this.gen_pl, false); lib_manager.treeState(false, libraryProps.rememberTree); break;
			case v.enter: if (!this.sel_items.length) return; this.load(this.sel_items, true, false, true, this.gen_pl, false); break;
			case v.dn: case v.up:
				if (this.tree.length == 0) break;
				if ((p.pos == 0 && get_pos == -1 && vkey == v.up) || (p.pos == this.tree.length - 1 && vkey == v.dn)) {this.get_selection(-1); break;}
				if (get_pos != -1) p.pos = get_pos;
				else p.pos = p.pos + this.tree.length % this.tree.length;
				get_pos = -1; m_i = -1; if (vkey == v.dn) p.pos++; if (vkey == v.up) p.pos--;
				p.pos = Math.max(Math.min(p.pos, this.tree.length - 1), !libraryProps.rootNode ? 0 : 1);
				var row = (p.pos * ui.row_h - sbar.scroll) / ui.row_h;
				if (sbar.rows_drawn - row < 3) sbar.check_scroll((p.pos + 3) * ui.row_h - sbar.rows_drawn * ui.row_h);
				else if (row < 2 && vkey == v.up) sbar.check_scroll((p.pos - 1) * ui.row_h);
				m_i = p.pos; this.get_selection(p.pos); p.tree_paint();
				if (libraryProps.autoFill)
					this.load(this.sel_items, true, false, false, this.gen_pl, false);
				lib_manager.treeState(false, libraryProps.rememberTree);
				break;
		}
	}

}
// var library_tree = new LibraryTree();

function searchLibrary() {
	// p.s_x and p.s_y are already adjusted for start position
	var cx = 0,
		selEnd = 0,
		selStart = 0,
		expand_limit = 350, //Math.min(Math.max(window.GetProperty("ADV.Limit Search Results Auto Expand: 10-1000", 350), 10), 1000),
		i = 0,
		lbtn_dn = false,
		lg = [],
		log = [],
		offsetChars = 0,	// the number of characters to skip when drawing search string (due to not enough room for entire string)
		shift = false,
		shift_x = 0,
		txt_w = 0,
		cursor_width = scaleForDisplay(1);
	var calc_text = function () {var im = gdi.CreateImage(1, 1), g = im.GetGraphics(); txt_w = g.CalcTextWidth(p.s_txt.substr(offsetChars), ui.font); im.ReleaseGraphics(g); }
	var drawcursor = function (gr) {
		if (p.s_search && p.s_cursor && selStart == selEnd && cx >= offsetChars) {
			var x1 = p.s_x + get_cursor_x(cx);
			gr.DrawLine(x1, p.s_y + p.s_sp * 0.1, x1, p.s_y + p.s_sp * 0.85, cursor_width, ui.textcol);
		}
	}
	/**
	 * Draws selection background
	 * @param {GdiGraphics} gr
	 * @return {number} bgColor drawn
	 */
	var drawsel = function(gr) {
		if (selStart == selEnd) return;
		var cursor_y = Math.round(p.s_sp / 2 + ui.y);
		var clamp = p.s_x + p.s_w2;
		var selcol = col.primary;
		gr.DrawLine(Math.min(p.s_x + get_cursor_x(selStart), clamp), cursor_y, Math.min(p.s_x + get_cursor_x(selEnd), clamp), cursor_y, ui.row_h - 3, selcol);
		return selcol;
	}
	var get_cursor_pos = function (x) {var im = gdi.CreateImage(1, 1), g = im.GetGraphics(), nx = x - p.s_x, pos = 0; for (i = offsetChars; i < p.s_txt.length; i++) {pos += g.CalcTextWidth(p.s_txt.substr(i,1), ui.font); if (pos >= nx + 3) break;} im.ReleaseGraphics(g); return i;}
	var get_cursor_x = function (pos) {
		var im = gdi.CreateImage(1, 1),
		g = im.GetGraphics(),
		x = 0;
		if (pos >= offsetChars) x = g.CalcTextWidth(p.s_txt.substr(offsetChars, pos - offsetChars), ui.font);
		im.ReleaseGraphics(g);
		return x;
	}
	var get_offset = function (gr) {
		var t = gr.CalcTextWidth(p.s_txt.substr(offsetChars, cx - offsetChars), ui.font);
		var j = 0;
		while (t >= p.s_w2 && j < 500) {
			j++; offsetChars++;
			t = gr.CalcTextWidth(p.s_txt.substr(offsetChars, cx - offsetChars), ui.font);
		}
	}
	var record = function() {lg.push(p.s_txt); log = []; if (lg.length > 30) lg.shift();}
	this.clear = function() {
		lib_manager.time.Reset(); library_tree.subCounts.search = {}; offsetChars = selStart = selEnd = cx = 0; p.s_cursor = false; p.s_search = false; p.s_txt = "";
		p.search_paint(); timer.reset(timer.search_cursor, timer.search_cursori); lib_manager.rootNodes();
		// if (p.pn_h_auto && p.pn_h == p.pn_h_min && library_tree.tree[0]) library_tree.clear_child(library_tree.tree[0]);
	}
	this.on_key_up = function(vkey) {if (!p.s_search) return; if (vkey == v.shift) {shift = false; shift_x = cx;}}
	this.lbtn_up = function(x, y) {if (selStart != selEnd) timer.reset(timer.search_cursor, timer.search_cursori); lbtn_dn = false;}
	this.move = function(x, y) {if (y > p.s_h || !lbtn_dn) return; var t = get_cursor_pos(x), t_x = get_cursor_x(t); calc_text(); if(t < selStart) {if (t < selEnd) {if (t_x < p.s_x) if(offsetChars > 0) offsetChars--;} else if (t > selEnd) {if (t_x + p.s_x > p.s_x + p.s_w2) {var l = (txt_w > p.s_w2) ? txt_w - p.s_w2 : 0; if(l > 0) offsetChars++;}} selEnd = t;} else if (t > selStart) {if(t_x + p.s_x > p.s_x + p.s_w2) {var l = (txt_w > p.s_w2) ? txt_w - p.s_w2 : 0; if(l > 0) offsetChars++;} selEnd = t;} cx = t; p.search_paint();}
	this.rbtn_up = function(x, y) {men.search_menu(x, y, selStart, selEnd, doc.parentWindow.clipboardData.getData('text') ? true : false)}
	// this.search_auto_expand = window.GetProperty(" Search Results Auto Expand", false);

	this.lbtn_dn = function(x, y) {
		var hadFocus = p.s_search;
		p.search_paint();
		lbtn_dn = p.s_search = (y < p.s_y + p.s_h && x >= p.s_x && x < p.s_x + p.s_w2);
		if (!lbtn_dn) {
			offsetChars = selStart = selEnd = cx = 0;
			timer.reset(timer.search_cursor, timer.search_cursori);
			return;
		} else {
			if (shift) {
				selStart = cx;
				selEnd = cx = get_cursor_pos(x);
			} else {
				cx = get_cursor_pos(x);
				selStart = selEnd = cx;
			}
			if (!hadFocus) {
				this.searchFocus();
			}
			this.reset_cursor_timer();
		}
		p.search_paint();
    }

    this.on_mouse_lbtn_dblclk = function(x, y, m) {
        if (y < p.s_y + p.s_h && x >= p.s_x && x < p.s_x + p.s_w2) {
			this.on_char(v.selAll, true);
            p.search_paint();
        }
	}

	this.reset_cursor_timer = function () {
		timer.reset(timer.search_cursor, timer.search_cursori);
		p.s_cursor = true;
		timer.search_cursor = setInterval(function() {
			p.s_cursor = !p.s_cursor;
			p.search_paint();
		}, 530);
	}

	this.searchFocus = function() {
		p.search_paint();
		p.s_search = true;
		this.reset_cursor_timer();
		p.search_paint();
		p.tree_paint();
	}

	this.on_char = function(code, force) {
		var text = String.fromCharCode(code);
		if (force) p.s_search = true;
		if (!p.s_search) return;
		p.s_cursor = false;
		p.pos = -1;
		switch (code) {
			case v.enter: if (p.s_txt.length < 3) break; var items = fb.CreateHandleList(); try {items = fb.GetQueryItems(lib_manager.list, p.s_txt)} catch (e) {} library_tree.load(items, false, false, false, library_tree.gen_pl, false); break;
			case v.redo: lg.push(p.s_txt); if (lg.length > 30) lg.shift(); if (log.length > 0) {p.s_txt = log.pop() + ""; cx++} break;
			case v.undo: log.push(p.s_txt); if (log.length > 30) lg.shift(); if (lg.length > 0) p.s_txt = lg.pop() + ""; break;
			case v.selAll:
				selStart = 0; selEnd = p.s_txt.length;
				break;
			case v.copy: if (selStart != selEnd) doc.parentWindow.clipboardData.setData('text', p.s_txt.substring(selStart, selEnd)); break; case v.cut: if (selStart != selEnd) doc.parentWindow.clipboardData.setData('text', p.s_txt.substring(selStart, selEnd));
			case v.back:
				record();
				if (selStart == selEnd) {if (cx > 0) {p.s_txt = p.s_txt.substr(0, cx - 1) + p.s_txt.substr(cx, p.s_txt.length - cx); if (offsetChars > 0) offsetChars--; cx--;}}
				else {if (selEnd - selStart == p.s_txt.length) {p.s_txt = ""; cx = 0;} else {if (selStart > 0) {var st = selStart, en = selEnd; selStart = Math.min(st, en); selEnd = Math.max(st, en); p.s_txt = p.s_txt.substring(0, selStart) + p.s_txt.substring(selEnd, p.s_txt.length); cx = selStart;} else {p.s_txt = p.s_txt.substring(selEnd, p.s_txt.length); cx = selStart;}}}
				calc_text(); offsetChars = offsetChars >= selEnd - selStart ? offsetChars - selEnd + selStart : 0; selStart = cx; selEnd = selStart; break;
			case "delete":
				record();
				if (selStart == selEnd) {if (cx < p.s_txt.length) {p.s_txt = p.s_txt.substr(0, cx) + p.s_txt.substr(cx + 1, p.s_txt.length - cx - 1);}}
				else {if (selEnd - selStart == p.s_txt.length) {p.s_txt = ""; cx = 0;} else {if (selStart > 0) {var st = selStart, en = selEnd; selStart = Math.min(st, en); selEnd = Math.max(st, en); p.s_txt = p.s_txt.substring(0, selStart) + p.s_txt.substring(selEnd, p.s_txt.length); cx = selStart;} else {p.s_txt = p.s_txt.substring(selEnd, p.s_txt.length); cx = selStart;}}}
				calc_text(); offsetChars = offsetChars >= selEnd - selStart ? offsetChars - selEnd + selStart : 0; selStart = cx; selEnd = selStart; break;
			case v.paste:
				text = doc.parentWindow.clipboardData.getData('text');
				// fall through
			default:
				record();
				if (selStart == selEnd) {
					p.s_txt = p.s_txt.substring(0, cx) + text + p.s_txt.substring(cx); cx += text.length; selEnd = selStart = cx;
				}
				else if (selEnd > selStart) {
					p.s_txt = p.s_txt.substring(0, selStart) + text + p.s_txt.substring(selEnd); calc_text(); offsetChars = offsetChars >= selEnd - selStart ? offsetChars - selEnd + selStart : 0; cx = selStart + text.length;
					selStart = cx; selEnd = selStart;
				}
				else {
					p.s_txt = p.s_txt.substring(selStart) + text + p.s_txt.substring(0, selEnd); calc_text(); offsetChars = offsetChars < selEnd - selStart ? offsetChars - selEnd + selStart : 0; cx = selEnd + text.length;
					selStart = cx; selEnd = selStart;
				}
				break;
		}
		if (code == v.copy || code == v.selAll) return;
		if (!timer.search_cursor) timer.search_cursor = setInterval(function() {p.s_cursor = !p.s_cursor; p.search_paint();}, 530);
		p.search_paint(); lib_manager.upd_search = true; timer.reset(timer.search, timer.searchi);
		timer.search = setTimeout(function() {
			lib_manager.time.Reset(); library_tree.subCounts.search = {};
			lib_manager.treeState(false, libraryProps.rememberTree);
			lib_manager.rootNodes();
			// p.setHeight(true);
			if (libraryProps.searchAutoExpand) {
				if (!library_tree.tree.length) return timer.search = false;
				var count = 0, m = libraryProps.rootNode ? 1 : 0;
				for (m; m < library_tree.tree.length; m++) count += library_tree.tree[m].item.length;
				if (count > expand_limit) return timer.search = false; var n = false;
				if (libraryProps.rootNode && library_tree.tree.length > 1) n = true;
				m = library_tree.tree.length;
				while (m--) {
					library_tree.expandNodes(library_tree.tree[m], !!libraryProps.rootNode && !m);
					if (n && m == 1) break;
				}
				if (libraryProps.rootNode && library_tree.tree.length == 1) library_tree.line_l = 0;
				sbar.set_rows(library_tree.tree.length); p.tree_paint(); lib_manager.treeState(false, libraryProps.rememberTree);
			}
			timer.search = false;
		}, 160);
	}

	this.on_key_down = function(vkey) {
		if (!p.s_search) return;
		switch(vkey) {
			case v.left:
			case v.right:
				if (vkey == v.left) {
					if (offsetChars > 0) {
						if (cx <= offsetChars) {
							offsetChars--;
							cx--;
						} else {
							cx--;
						}
					} else if (cx > 0) {
						cx--;
					}
					selStart = selEnd = cx;
				}
				if (vkey == v.right && cx < p.s_txt.length)
					cx++;
				selStart = selEnd = cx;
				if (shift) {
					selStart = Math.min(cx, shift_x);
					selEnd = Math.max(cx, shift_x);
				}
				p.s_cursor = true;
				timer.reset(timer.search_cursor, timer.search_cursori);
				timer.search_cursor = setInterval(function() {
					p.s_cursor = !p.s_cursor; p.search_paint();
				}, 530);
				break;
			case v.home:
			case v.end:
				if (vkey == v.home) offsetChars = selStart = selEnd = cx = 0; else selStart = selEnd = cx = p.s_txt.length; p.s_cursor = true; timer.reset(timer.search_cursor, timer.search_cursori); timer.search_cursor = setInterval(function() {p.s_cursor = !p.s_cursor; p.search_paint();}, 530);
				break;
			case v.shift:
				shift = true;
				shift_x = cx;
				break;
			case v.del:
				this.on_char("delete");
				break;
		}
		p.search_paint();
	}

	this.draw = function(gr) {
		try {
			selStart = Math.min(Math.max(selStart, 0), p.s_txt.length);
			selEnd = Math.min(Math.max(selEnd, 0), p.s_txt.length);
			cx = Math.min(Math.max(cx, 0), p.s_txt.length);
			// divider line
			gr.DrawLine(ui.x + ui.margin, ui.y + p.s_sp, ui.x + p.s_w1, ui.y + p.s_sp, ui.l_width, ui.s_linecol);
			if (p.s_txt) {
				const selColor = drawsel(gr);
				get_offset(gr);
				var txt_col = ui.searchcol;
				if (selStart === 0 && selEnd === p.s_txt.length) {
					if (new Color(selColor).brightness > 180) {
						txt_col = rgb(0,0,0);
					} else {
						txt_col = ui.textselcol;
					}
				}
				gr.GdiDrawText(p.s_txt.substr(offsetChars), ui.font, txt_col, p.s_x, p.s_y, p.s_w2, p.s_sp, p.l);
			} else {
				gr.GdiDrawText('Search', ui.s_font, ui.txt_box, p.s_x, p.s_y, p.s_w2, p.s_sp, p.l);
			}
			drawcursor(gr);
			if (libraryProps.searchMode > 1) {
				var l_x = p.filter_x1 - 8 - ui.l_width,
					l_y = p.s_y;
				gr.GdiDrawText(p.filt[p.filter_by].name, p.filter_font, ui.txt_box, p.filter_x1, ui.y, p.f_w[p.filter_by], p.s_sp, p.cc);
				gr.FillSolidRect(l_x, l_y, ui.l_width, p.s_sp, ui.s_linecol);
			}
		} catch (e) {
            console.log('<Error: Library could not be properly drawn>');
		}
	}
}
// if (libraryProps.searchMode) var sL = new searchLibrary();

function QuickSearch() {
	// this is the quick-type search
	var j_x = 5, j_h = 30, j_y = 5, jSearch = "", jump_search = true, rs1 = 5, rs2 = 4;
	this.on_size = function() {
		j_x = Math.round(ui.x + ui.w / 2);
		j_h = Math.round(ui.row_h * 1.5);
		j_y = Math.round(ui.y + (ui.h - j_h) / 2);
		rs1 = Math.min(5, j_h / 2);
		rs2 = Math.min(4, (j_h - 2) / 2);
	}

	this.on_char = function(code) {
		if (utils.IsKeyPressed(0x09) || utils.IsKeyPressed(0x11) || utils.IsKeyPressed(0x1B)) return;
		var text = String.fromCharCode(code);
		if (!p.s_search) {
			var found = false, i = 0, pos = -1;
			switch(code) {
				case v.back: jSearch = jSearch.substr(0, jSearch.length - 1); break;
				case v.enter: jSearch = ""; return;
				default: jSearch += text; break;
			}
			library_tree.clear();
			if (!jSearch)
				return;
			library_tree.sel_items = []; jump_search = true;
			window.RepaintRect(ui.x, j_y, ui.w, j_h + 1);
			timer.reset(timer.jsearch, timer.jsearchi);
			timer.jsearch = setTimeout(function () {
				for (i = 0; i < library_tree.tree.length; i++) {
					if (library_tree.tree[i].name != p.baseName && library_tree.tree[i].name.substring(0, jSearch.length).toLowerCase() == jSearch.toLowerCase()) {
						found = true;
						pos = i;
						library_tree.tree[i].sel = true;
						p.pos = pos;
						library_tree.setGetPos(pos);
						if (libraryProps.autoFill)
							library_tree.get_sel_items();
							lib_manager.treeState(false, libraryProps.rememberTree);
						break;
					}
				}
				if (!found) jump_search = false;
				p.tree_paint();
				sbar.check_scroll((pos - 5) * ui.row_h);
				timer.jsearch = false;
			}, 500);

			timer.reset(timer.clear_jsearch, timer.clear_jsearchi);
			timer.clear_jsearch = setTimeout(function () {
				if (found && libraryProps.autoFill)
					library_tree.load(library_tree.sel_items, true, false, false, library_tree.gen_pl, false); jSearch = "";
				window.RepaintRect(ui.x, j_y, ui.w, j_h + 1);
				timer.clear_jsearch = false;
			}, 1200);
		}
	}

	this.draw = function(gr) {
		if (jSearch) {try {
			gr.SetSmoothingMode(SmoothingMode.AntiAlias);
			var j_w = gr.CalcTextWidth(jSearch,ui.j_font) + 25;
			gr.FillRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 0x96000000);
			gr.DrawRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 1, 0x64000000);
			gr.DrawRoundRect(j_x - j_w / 2 + 1, j_y + 1, j_w - 2, j_h - 2, rs2, rs2, 1, 0x28ffffff);
			gr.GdiDrawText(jSearch, ui.j_font, RGB(0, 0, 0), j_x - j_w / 2 + 1, j_y + 1 , j_w, j_h, p.cc);
			gr.GdiDrawText(jSearch, ui.j_font, jump_search ? 0xfffafafa : 0xffff4646, j_x - j_w / 2, j_y, j_w, j_h, p.cc);} catch (e) {}
		}
	}
}
// var jS = new j_Search();

function LibraryPanel() {
	this.on_paint = function (gr) {
		ui.draw(gr);
		lib_manager.checkTree();
		if (libraryProps.searchMode) sL.draw(gr);
		library_tree.draw(gr);
		if (libraryProps.showScrollbar) sbar.draw(gr);
		if (libraryProps.searchMode || libraryProps.showScrollbar) but.draw(gr);
		quickSearch.draw(gr);
	}

	this.on_size = function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
		ui.x = x;
		ui.y = y;
		ui.w = width;
		ui.h = height;
		ui.margin = scaleForDisplay(10);
		if (!ui.w || !ui.h) return;
		// ui.blurReset();
		ui.get_font();
		p.on_size();
		library_tree.create_tooltip();
		if (libraryProps.searchMode || libraryProps.showScrollbar) but.refresh(true);
		quickSearch.on_size();
    }

    this.x;
    this.y;
    this.w;
    this.h;
}

// var libraryPanel = new LibraryPanel();

function button_manager() {
	// arrow_symb = 0;
	var b_x,
		b3 = ["scrollUp", "scrollDn"],
		but_tt = g_tooltip,
		bx, by, bh, byDn, byUp, fw, hot_o, i, qx, qy, qh, s_img = [],
		scr = [],
		scrollBut_x, scrollDn_y, scrollUp_y;
	this.btns = [];
	this.b = null;
	this.Dn = false;
	var browser = function(c) {if (!_.runCmd(c)) fb.ShowPopupMessage("Unable to launch your default browser.", "Library Tree");}
	var tooltip = function(n) {if (but_tt.text == n) return; but_tt.text = n; but_tt.Activate();}
	this.lbtn_dn = function (x, y) {
		this.move(x, y);
		if (!this.b) return false;
		this.Dn = this.b;
		if (libraryProps.showScrollbar) {
			for (let j = 0; j < b3.length; j++) {
				if (this.b == b3[j]) {
					if (this.btns[this.b].trace(x, y)) {
						this.btns[this.b].down = true;
					}
					this.btns[this.b].changestate("down");
				}
			}
		}
		this.btns[this.b].lbtn_dn(x, y);
		return true;
	}
	this.lbtn_up = function (x, y) {
		this.Dn = false;
		if (libraryProps.showScrollbar)
			for (let j = 0; j < b3.length; j++) this.btns[b3[j]].down = false;
		if (!this.b) return false;
		if (libraryProps.showScrollbar)
			for (let j = 0; j < b3.length; j++)
				if (this.b == b3[j]) this.btns[this.b].changestate(this.btns[this.b].trace(x, y) ? "hover" : "normal");
		this.move(x, y);
		if (!this.b) return false;
		this.btns[this.b].lbtn_up(x, y);
		return true;
	}
	this.leave = function () {
		if (this.b) this.btns[this.b].changestate("normal");
		this.b = null;
		tooltip("");
	}
	this.on_script_unload = function() {tooltip("");}

	this.create_images = function() {
		var alpha = [75, 192, 228],
			c,
			col = [ui.textcol & 0x44ffffff, ui.textcol & 0x99ffffff, ui.textcol],
			g,
			// sz = arrow_symb == 0 ? Math.max(Math.round(ui.but_h * 1.666667), 1) : 100,
			sz = Math.max(Math.round(ui.but_h * 1.666667), 1),
			sc = sz / 100;
		for (var j = 0; j < 2; j++) {
			c = j ? 0xe4ffffff : 0x99ffffff;
			s_img[j] = gdi.CreateImage(100, 100);
			g = s_img[j].GetGraphics();
			g.SetSmoothingMode(SmoothingMode.HighQuality);
            g.DrawLine(69, 71, 88, 90, 12, ui.txt_box & c);
            g.DrawEllipse(8, 11, 67, 67, 10, ui.txt_box & c);

            g.FillEllipse(15, 17, 55, 55, 0x0AFAFAFA);
			g.SetSmoothingMode(SmoothingMode.Default);
			s_img[j].ReleaseGraphics(g);
		}
		for (j = 0; j < 3; j++) {
			scr[j] = gdi.CreateImage(sz, sz);
			g = scr[j].GetGraphics();
			g.SetTextRenderingHint(3);
			g.SetSmoothingMode(SmoothingMode.HighQuality);
			if (ui.scr_col) {
				g.FillPolygon(col[j], 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]);
			} else {
				g.FillPolygon(RGBA(ui.ct, ui.ct, ui.ct, alpha[j]), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]);
			}
			g.SetSmoothingMode(SmoothingMode.Default);
			scr[j].ReleaseGraphics(g);
		}
	};
	this.create_images();

	this.draw = function(gr) {
		try {
			for (i in this.btns) {
				if ((libraryProps.searchMode == 1 || libraryProps.searchMode > 1 && !p.s_txt) && i == "s_img") this.btns[i].draw(gr);
				if (libraryProps.searchMode == 1 && i == "cross1") this.btns[i].draw(gr);
				if (libraryProps.searchMode > 1 && p.s_txt && i == "cross2") this.btns[i].draw(gr);
				if (libraryProps.searchMode > 1 && i == "filter") this.btns[i].draw(gr);
				if (libraryProps.showScrollbar && sbar.scrollable_lines > 0 && (i == "scrollUp" || i == "scrollDn"))  this.btns[i].draw(gr);
			}
		} catch (e) {}
	}
	this.move = function(x, y) {
		if (sbar.timer_but) {if ((this.btns["scrollUp"].down || this.btns["scrollDn"].down) && !this.btns["scrollUp"].trace(x, y) && !this.btns["scrollDn"].trace(x, y)) {this.btns["scrollUp"].changestate("normal"); this.btns["scrollDn"].changestate("normal"); clearTimeout(sbar.timer_but); sbar.timer_but = false; sbar.count = -1;}}
		else for (let j = 0; j < b3.length; j++) if (this.b == b3[j] && this.btns[this.b].down) {this.btns[this.b].changestate("down"); this.btns[this.b].l_dn();}
		var b = null, hand = false;
		for (i in this.btns) {
			if ((libraryProps.searchMode == 1 || libraryProps.searchMode > 1 && !p.s_txt) && i == "s_img" && (!this.Dn || this.Dn == "s_img") && this.btns[i].trace(x, y)) {b = i; hand = true;}
			if (libraryProps.searchMode == 1 && i == "cross1" && (!this.Dn || this.Dn == "cross1") && this.btns[i].trace(x, y)) {b = i; hand = true;}
			if (libraryProps.searchMode > 1 && p.s_txt && i == "cross2" && (!this.Dn || this.Dn == "cross2") && this.btns[i].trace(x, y)) {b = i; hand = true;}
			if (libraryProps.searchMode > 1 && i == "filter" && (!this.Dn || this.Dn == "filter") && this.btns[i].trace(x, y)) {b = i; hand = true;}
			if (libraryProps.showScrollbar && sbar.scrollable_lines > 0) for (let j = 0; j < b3.length; j++) if (i == b3[j] && (!this.Dn || this.Dn == b3[j]) && this.btns[i].trace(x, y)) b = i;
		}
		window.SetCursor(this.Dn && this.Dn != this.b ? 32512 : hand ? 32649 : y < p.s_h && libraryProps.searchMode && x > qx + qh ? 32513 : 32512);
		if (this.b == b) return this.b;
		if (b && (!this.Dn || this.Dn == b)) this.btns[b].changestate("hover");
		if (this.b) this.btns[this.b].changestate("normal");
		this.b = b;
		if (!this.b) tooltip("");
		return this.b;
	}

	var btn = function(x, y, w, h, type, ft, txt, stat, img_src, down, l_dn, l_up, tooltext) {
		this.draw = function (gr) {
			switch (type) {
				case 3: gr.SetInterpolationMode(2); if (this.img) gr.DrawImage(this.img, this.x, this.y, this.w, this.h, 0, 0, this.img.Width, this.img.Height); gr.SetInterpolationMode(0); break;
				case 4: gr.DrawLine(Math.round(this.x + bh * 0.67), Math.round(this.y + bh * 0.67), Math.round(this.x + bh * 0.27), Math.round(this.y + bh * 0.27), Math.round(bh / 10), RGBA(136, 136, 136, this.img)); gr.DrawLine(Math.round(this.x + bh * 0.67), Math.round(this.y + bh * 0.27), Math.round(this.x + bh * 0.27), Math.round(this.y + bh * 0.67), Math.round(bh / 10), RGBA(136, 136, 136, this.img)); break;
				case 5: gr.SetTextRenderingHint(5); gr.DrawString(txt, ft, this.img, this.x, this.y - 1, this.w, this.h, StringFormat(2, 1)); break;
				case 6: ui.theme.SetPartAndStateID(1, this.img); ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h); break;
				default: if (this.img) gr.DrawImage(this.img, this.x + ft, txt, stat, stat, 0, 0, this.img.Width, this.img.Height, type == 1 ? 0 : 180); break;
			}
		}
		this.trace = function(x, y) {return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;}
		this.lbtn_dn = function () {this.l_dn && this.l_dn(x, y);}
		this.lbtn_up = function () {this.l_up && this.l_up(x, y);}

		this.changestate = function(state) {
			switch (state) {case "hover": this.img = this.img_hover; tooltip(this.tooltext); break; case "down": this.img = this.img_down; break; default: this.img = this.img_normal; break;}
			window.RepaintRect(this.x, this.y, this.w + 1, this.h + 1);
		}
		this.x = x; this.y = y; this.w = w; this.h = h; this.l_dn = l_dn; this.l_up = l_up; this.tooltext = tooltext;
		this.img_normal = img_src.normal; this.img_hover = img_src.hover || this.img_normal; this.img_down = img_src.down || this.img_normal; this.img = this.img_normal;
	}

	this.refresh = function(upd) {
		if (upd) {
			bx = p.s_w1 - Math.round(ui.row_h * 0.75);
			bh = ui.row_h;
			by = ui.y + Math.round((p.s_sp - bh * 0.4) / 2 - bh * 0.27);
			b_x = p.sbar_x;
			byUp = sbar.y;
			byDn = sbar.y + sbar.h - ui.but_h;
			fw = p.f_w[p.filter_by] + p.f_sw + 12;
			qx = ui.x + ui.margin;
			qy = ui.y + (p.s_sp - ui.row_h * 0.6) / 2;
			qh = ui.row_h * 0.6;
			if (ui.scr_type != 2) {b_x -= 1; hot_o = byUp - p.s_h; scrollBut_x = (ui.but_h - ui.scr_but_w) / 2; scrollUp_y = -ui.arrow_pad + byUp + (ui.but_h - 1 - ui.scr_but_w) / 2; scrollDn_y = ui.arrow_pad + byDn + (ui.but_h - 1 - ui.scr_but_w) / 2 ;}
		}
		if (libraryProps.showScrollbar) {
			switch (ui.scr_type) {
				case 2:
					this.btns.scrollUp = new btn(b_x, byUp, ui.but_h, ui.but_h, 6, "", "", "", {normal: 1, hover: 2, down: 3}, false, function() {sbar.but(1);}, "", "");
					this.btns.scrollDn = new btn(b_x, byDn, ui.but_h, ui.but_h, 6, "", "", "", {normal: 5, hover: 6, down: 7}, false, function() {sbar.but(-1);}, "", "");
					break;
				default:
					this.btns.scrollUp = new btn(b_x, byUp - hot_o, ui.but_h, ui.but_h + hot_o, 1, scrollBut_x, scrollUp_y, ui.scr_but_w, {normal: scr[0], hover: scr[1], down: scr[2]}, false, function() {sbar.but(1);}, "", "");
					this.btns.scrollDn = new btn(b_x, byDn, ui.but_h, ui.but_h + hot_o, 2, scrollBut_x, scrollDn_y, ui.scr_but_w, {normal: scr[0], hover: scr[1], down: scr[2]}, false, function() {sbar.but(-1);}, "", "");
					break;
			}
		}
		if (libraryProps.searchMode)  {
			this.btns.s_img = new btn(qx, qy, qh, qh, 3, "", "", "", {normal: s_img[0], hover: s_img[1]}, false, "", function() {browser("\"" + fb.FoobarPath + "doc\\Query Syntax Help.html");}, "Open Query Syntax Help");
			this.btns.cross1 = new btn(bx, by, bh, bh, 4, "", "", "", {normal: "85", hover: "192"}, false, "", function() {sL.clear();}, "Clear Search Text");
			this.btns.cross2 = new btn(qx - bh * 0.2, by, bh, bh, 4, "", "", "", {normal: "85", hover: "192"}, false, "", function() {sL.clear();}, "Clear Search Text");
			this.btns.filter = new btn(p.filter_x1 - 12, ui.y, fw, p.s_sp, 5, p.filter_but_ft, "▼", "", {normal: ui.txt_box & 0x99ffffff, hover: ui.txt_box & 0xe4ffffff}, false, "", function() {men.button(p.filter_x1, p.s_h); but.refresh(true)}, "Filter");
		}
	}
}
// var but = new button_manager();

function menu_object() {
	var use_local = window.GetProperty("SYSTEM.Use Local", false),
		expand_limit = use_local ? 6000 : Math.min(Math.max(window.GetProperty("ADV.Limit Menu Expand: 10-6000", 500), 10), 6000),
		i = 0,
		MenuMap = [],
		MF_GRAYED = 0x00000001,
		MF_SEPARATOR = 0x00000800,
		MF_STRING = 0x00000000,
		mtags_installed = utils.CheckComponent("foo_tags"),
		xp = false;
	this.NewMenuItem = function(index, type, value) {MenuMap[index] = [{type: ""},{value: 0}]; MenuMap[index].type = type; MenuMap[index].value = value;}; this.r_up = false;
	var box = function(n) {return n != null ? 'Unescape("' + encodeURIComponent(n + "") + '")' : "Empty";}
	var InputBox = function(prompt, title, msg) { vb.Language = "VBScript"; var tmp = vb.eval('InputBox(' + [box(prompt), box(title), box(msg)].join(",") + ')'); if (typeof tmp == "undefined") return; if (tmp.length == 254) fb.ShowPopupMessage("Your entry is too long and will be truncated.\n\nEntries are limited to 254 characters.", "Library Tree"); return tmp.trim();}
	var proceed = function(length) {var ns = InputBox("Create m-TAGS in selected music folders\n\nProceed?\n\nm-TAGS creator settings apply", "Create m-TAGS in Selected Folders", "Create " + length + " m-TAGS" + (length ? "" : ": NO FOLDERS SELECTED")); if (!ns) return false; return true;}
	// this.ConfigTypeMenu = function (Menu, StartIndex) {
	// 	var Index = StartIndex,
	// 		n = ["Panel Properties"];
	// 	if (p.syncType) n.push("Refresh");
	// 	if (v.k(SHIFT)) n.push("Configure...");
	// 	for (var i = 0; i < n.length; i++) {
	// 		this.NewMenuItem(Index, "Config", i + 1);
	// 		Menu.AppendMenuItem(MF_STRING, Index, n[i]);
	// 		Index++;
	// 	}
	// 	return Index;
	// }
	this.OptionsTypeMenu = function (Menu, StartIndex) {
		var Index = StartIndex;
		for (i = 0; i < p.menu.length; i++) {
			this.NewMenuItem(Index, "Options", i + 1);
			Menu.AppendMenuItem(MF_STRING, Index, p.menu[i]);
			Index++;
			if (i == p.menu.length - 1 || i == p.menu.length - 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		}
		Menu.CheckMenuRadioItem(StartIndex, StartIndex + p.grp.length - 1, StartIndex + p.view_by);
		return Index;
	}
	this.PlaylistTypeMenu = function (Menu, StartIndex) {
		var idx = StartIndex,
			n = ["Send to Current Playlist", "Insert in Current Playlist", "Add to Current Playlist", "Copy", "Collapse All", "Expand"];
		for (i = 0; i < 6; i++) {
			this.NewMenuItem(idx, "Playlist", i + 1);
			Menu.AppendMenuItem(i < 3 && !plman.IsPlaylistLocked(plman.ActivePlaylist) || i == 3 || i == 4 || i == 5 ? MF_STRING : MF_GRAYED, idx, n[i]);
			if (i == 3) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
			idx++;
		}
		return idx;
	}
	this.TagTypeMenu = function(Menu, StartIndex) {var Index = StartIndex; this.NewMenuItem(Index, "Tag", 1); Menu.AppendMenuItem(mtags_installed && p.view.replace(/^\s+/, "") == "$directory_path(%path%)|%filename_ext%" ? MF_STRING : MF_GRAYED, Index, "Create m-TAGS..." + (mtags_installed ? (p.view.replace(/^\s+/, "").toLowerCase() == "$directory_path(%path%)|%filename_ext%" ? "" : " N/A Requires View by Path // $directory_path(%path%)|%filename_ext%$nodisplay{%subsong%}") : " N/A m-TAGS Not Installed")); Index++; return Index;}
	this.ThemeTypeMenu = function (Menu, StartIndex) {
		var Index = StartIndex,
			c = [!ui.blur_dark && !ui.blur_blend && !ui.blur_light && !ui.imgBg, ui.blur_dark, ui.blur_blend, ui.blur_light, ui.imgBg, false],
			n = ["None", "Dark", "Blend", "Light", "Cover", "Reload"];
		for (var i = 0; i < n.length; i++) {
			this.NewMenuItem(Index, "Theme", i + 1);
			Menu.AppendMenuItem(MF_STRING, Index, n[i]);
			Index++;
			Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i + 1 - c[i]);
			if (!i || i == 4) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		}
		return Index;
	}

	this.FilterMenu = function(Menu, StartIndex) {
		var Index = StartIndex;
		for (i = 0; i < p.f_menu.length + 1; i++) {
			this.NewMenuItem(Index, "Filter", i + 1);
			Menu.AppendMenuItem(MF_STRING, Index, i != p.f_menu.length ? (!i ? "No " : "") + p.f_menu[i] : "Always Reset Scroll");
			if (i == p.f_menu.length) Menu.CheckMenuItem(Index++, p.reset); else Index++;
			if (i == p.f_menu.length - 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		}
		Menu.CheckMenuRadioItem(StartIndex, StartIndex + p.f_menu.length - 1, StartIndex + p.filter_by);
		return Index;
	}

	this.button = function(x, y) {
		var menu = window.CreatePopupMenu(),
			idx,
			Index = 1;
		Index = this.FilterMenu(menu, Index);
		idx = menu.TrackPopupMenu(x, y);
		if (idx >= 1 && idx <= Index) {i = MenuMap[idx].value; library_tree.subCounts.filter = {}; library_tree.subCounts.search = {};
			switch (i) {
				case p.f_menu.length + 1: p.reset = !p.reset; if (p.reset) {p.search_paint(); lib_manager.treeState(true, 2);} window.SetProperty("SYSTEM.Reset Tree", p.reset); break;
				default: p.filter_by = i - 1; p.calc_text(); p.search_paint(); lib_manager.treeState(true, 2); window.SetProperty("SYSTEM.Filter By", p.filter_by); break;
			}
			// if (p.pn_h_auto && p.pn_h == p.pn_h_min && library_tree.tree[0]) library_tree.clear_child(library_tree.tree[0]);
		}
	}

	this.search = function(Menu, StartIndex, s, f, paste) {
		var Index = StartIndex, n = ["Copy", "Cut", "Paste"];
		for (i = 0; i < 3; i++) {
			this.NewMenuItem(Index, "Search", i + 1);
			Menu.AppendMenuItem(s == f && i < 2 || i == 2 && !paste ? MF_GRAYED : MF_STRING, Index, n[i]); Index++;
			if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		}
		return Index;
	}

	this.search_menu = function(x, y, s, f, paste) {
		var menu = window.CreatePopupMenu(), idx, Index = 1;
		Index = this.search(menu, Index, s, f, paste); idx = menu.TrackPopupMenu(x, y);
		if (idx >= 1 && idx <= Index) {
			i = MenuMap[idx].value;
			switch (i) {
				case 1: sL.on_char(v.copy); break;
				case 2: sL.on_char(v.cut); break;
				case 3: sL.on_char(v.paste, true); break;
			}
		}
	}

	this.rbtn_up = function(x, y) {
		this.r_up = true;
		var Context = fb.CreateContextMenuManager(),
			FilterMenu = window.CreatePopupMenu(),
			idx,
			Index = 1,
			menu = window.CreatePopupMenu(),
			OptionsMenu = window.CreatePopupMenu(),
			PlaylistMenu = window.CreatePopupMenu(),
			// ThemeMenu = window.CreatePopupMenu(),
			show_context = false;
		var ix = library_tree.get_ix(x, y, true, false),
			item = library_tree.tree[ix],
			nm = "",
			row = -1,
			xp = false;
		if (y < p.s_h + p.sp + ui.y && library_tree.tree.length > ix && ix != -1 &&
				(x < Math.round(ui.pad * item.tr) + ui.icon_w + ui.margin + ui.x &&
				(!item.track || libraryProps.rootNode && item.tr == 0) ||
				library_tree.check_ix(item, x, y, true))) {
			if (!item.sel) {
				library_tree.clear();
				item.sel = true;
			}
			library_tree.get_sel_items();
			xp = library_tree.tree[ix].item.length > expand_limit || library_tree.tree[ix].track ? false : true;
			if (xp && library_tree.tree.length) {
				var count = 0,
					m = 0;
				for (m = 0; m < library_tree.tree.length; m++)
					if (m == ix || library_tree.tree[m].sel) {
						if (row == -1 || m < row) {
							row = m;
							nm = (library_tree.tree[m].tr ? library_tree.tree[library_tree.tree[m].par].name : "") + library_tree.tree[m].name;
							nm = nm.toUpperCase();
						}
						count += library_tree.tree[m].item.length;
						xp = count <= expand_limit;
					}
			}
			Index = this.PlaylistTypeMenu(menu, Index);
			menu.AppendMenuSeparator();
			if (utils.IsKeyPressed(0x10)) {
				Index = this.TagTypeMenu(menu, Index);
				menu.AppendMenuSeparator();
			}
			show_context = true;
		}
		if (show_context) {
			Index = this.OptionsTypeMenu(OptionsMenu, Index);
			OptionsMenu.AppendTo(menu, MF_STRING, "Options");
			// Index = this.ThemeTypeMenu(ThemeMenu, Index); ThemeMenu.AppendTo(OptionsMenu, MF_STRING, "Theme"); OptionsMenu.AppendMenuSeparator();
			// Index = this.ConfigTypeMenu(OptionsMenu, Index);
			menu.AppendMenuSeparator();
			var items = library_tree.getHandles();
			Context.InitContext(items);
			Context.BuildMenu(menu, 5000);
		} else {
			Index = this.OptionsTypeMenu(menu, Index);
			// Index = this.ThemeTypeMenu(ThemeMenu, Index);
			// ThemeMenu.AppendTo(menu, MF_STRING, "Theme");
			// menu.AppendMenuSeparator();
			// Index = this.ConfigTypeMenu(menu, Index);

		}
		idx = menu.TrackPopupMenu(x, y);
		if (idx >= 1 && idx <= Index) {
			i = MenuMap[idx].value;
			switch (MenuMap[idx].type) {
				case "Playlist":
					switch (i) {
						case 1: // Send to Current Playlist
							library_tree.load(library_tree.sel_items, true, false, true, false, false);
							p.tree_paint();
							lib_manager.treeState(false, libraryProps.rememberTree);
							break;
						case 4: fb.CopyHandleListToClipboard(items); lib_manager.treeState(false, libraryProps.rememberTree); break;
						case 5: library_tree.collapseAll(); break;
						case 6: library_tree.expand(ix, nm); break;
						default: // Insert or Add to Current Playlist
							library_tree.load(library_tree.sel_items, true, true, false, false, i == 2 ? true : false);
							lib_manager.treeState(false, libraryProps.rememberTree);
							break;
					}
					break;
				case "Tag":
					var r = !libraryProps.rootNode ? library_tree.tree[ix].tr : library_tree.tree[ix].tr - 1, list = [];
					if (libraryProps.rootNode && !ix || !r) library_tree.tree[ix].sel = true;
					if (libraryProps.rootNode && library_tree.tree[0].sel) for (var j = 0; j < library_tree.tree.length; j++) if (library_tree.tree[j].tr == 1) library_tree.tree[j].sel = true; p.tree_paint();
					for (j = 0; j < library_tree.tree.length; j++) if ((library_tree.tree[j].tr == (libraryProps.rootNode ? 1 : 0)) && library_tree.tree[j].sel) list.push(library_tree.tree[j].name);
					if (!proceed(list.length)) break;
					p.syncType = 1; for (j = 0; j < list.length; j++) _.runCmd("\"" + fb.FoobarPath + "\\foobar2000.exe\"" + " /m-TAGS \"" + list[j] + "\"");
					p.syncType = window.GetProperty(" Library Sync: Auto-0, Initialisation Only-1", 0); lib_manager.treeState(false, 2);
					break;
				case "Options":
					lib_manager.time.Reset();
					if (p.s_txt) lib_manager.upd_search = true;
					p.fields(i < p.grp.length + 1 ? i - 1 : p.view_by, i - 1 < p.grp.length ? p.filter_by : i - 1 - p.grp.length);
					library_tree.subCounts =  {"standard": {}, "search": {}, "filter": {}};
					lib_manager.get_library();
					lib_manager.rootNodes();
					// if (p.pn_h_auto && p.pn_h == p.pn_h_min && library_tree.tree[0]) library_tree.clear_child(library_tree.tree[0]);
					break;
				// case "Theme": if (i < 6) ui.blurChange(i); else window.Reload(); break;
				// case "Config":
				// 	switch (i) {
				// 		case 1: window.ShowProperties(); break;
				// 		case 2: p.syncType ? lib_manager.treeState(false, 2) : window.ShowConfigure(); break;
				// 		case 3: if (p.syncType) window.ShowConfigure(); break;
				// 	}
				// 	break;
			}
		}
		if (idx >= 5000 && idx <= 5800) {show_context && Context.ExecuteByID(idx - 5000);}
		this.r_up = false;
	}
}
// var men = new menu_object();

function timers() {
	var timer_arr = ["clear_jsearch", "focus", "jsearch", "search", "search_cursor", "tt", "update"];
	for (var i = 0; i < timer_arr.length; i++) {this[timer_arr[i]] = false; this[timer_arr[i] + "i"] = i;}
	this.reset = function(timer, n) {if (timer) clearTimeout(timer); this[timer_arr[n]] = false;}
	this.lib = function() {setTimeout(function() {if ((ui.w < 1 || !window.IsVisible) && libraryProps.rememberTree) lib_manager.init = true; lib_manager.get_library(); lib_manager.rootNodes(libraryProps.rememberTree ? 1 : 0, lib_manager.process);}, 5);}
	this.tooltip = function() {this.reset(this.tt, this.tti); this.tt = setTimeout(function() {library_tree.deActivate_tooltip(); timer.tt = false;}, 5000);}
	this.lib_update = function() {this.reset(this.update, this.updatei); this.update = setTimeout(function() {lib_manager.time.Reset(); library_tree.subCounts =  {"standard": {}, "search": {}, "filter": {}}; lib_manager.rootNodes(2, lib_manager.process); timer.update = false;}, 500);}
}
// var timer = new timers();
// timer.lib();

function LibraryCallbacks() {
	this.on_char = function(code) {
		library_tree.on_char(code);
		quickSearch.on_char(code);
		if (!libraryProps.searchMode) return;
		sL.on_char(code);
	}
	this.on_focus = function(is_focused) {if (!is_focused) {timer.reset(timer.search_cursor, timer.search_cursori); p.s_cursor = false; p.search_paint();} library_tree.on_focus(is_focused);}
	// this.on_get_album_art_done = function(handle, art_id, image, image_path) {ui.get_album_art_done(image, image_path);}
	this.on_metadb_changed = function() {if (!ui.blur && !ui.imgBg || ui.block()) return; ui.on_playback_new_track();}
	this.on_item_focus_change = function() {if (fb.IsPlaying || !ui.blur && !ui.imgBg) return; if (ui.block()) ui.get = true; else {ui.get = false; ui.focus_changed(250);}}
	this.on_key_down = function(vkey) {
		library_tree.on_key_down(vkey);
		if (!libraryProps.searchMode) return;
		sL.on_key_down(vkey);
	}
	this.on_key_up = function(vkey) { if (!libraryProps.searchMode) return; sL.on_key_up(vkey); }
	this.on_library_items_added = function(handle_list) {if (p.syncType) return; lib_manager.treeState(false, 2, handle_list, 0);}
	this.on_library_items_removed = function(handle_list) {if (p.syncType) return; lib_manager.treeState(false, 2, handle_list, 2);}
	this.on_library_items_changed = function(handle_list) {if (p.syncType) return; lib_manager.treeState(false, 2, handle_list, 1);}
	this.on_mouse_lbtn_dblclk = function(x, y, m) {
        but.lbtn_dn(x, y);
        library_tree.lbtn_dblclk(x, y);
        if (libraryProps.searchMode)
            sL.on_mouse_lbtn_dblclk(x, y, m);
    }
	this.on_mouse_lbtn_down = function(x, y) {
		if (libraryProps.searchMode || libraryProps.showScrollbar) {
			but.lbtn_dn(x, y);
		}
		if (libraryProps.searchMode) {
			sL.lbtn_dn(x, y);
		}
		library_tree.lbtn_dn(x, y);
		sbar.lbtn_dn(x, y);
	}
	this.on_mouse_lbtn_up = function(x, y) {library_tree.lbtn_up(x, y); if (libraryProps.searchMode) {sL.lbtn_up(); but.lbtn_up(x, y);} sbar.lbtn_up(x, y);}
	this.on_mouse_leave = function() {if (libraryProps.searchMode || libraryProps.showScrollbar) but.leave(); sbar.leave(); library_tree.leave();}
	this.on_mouse_mbtn_up = function(x, y) {library_tree.mbtn_up(x, y);}
	this.on_mouse_move = function(x, y, m) {if (p.m_x == x && p.m_y == y) return; if (libraryProps.searchMode || libraryProps.showScrollbar) but.move(x, y); if (libraryProps.searchMode) sL.move(x, y); library_tree.move(x, y); library_tree.dragDrop(x, y); sbar.move(x, y); p.m_x = x; p.m_y = y;}
	this.on_mouse_rbtn_up = function(x, y) {if (y < p.s_h && x > p.s_x && x < p.s_x + p.s_w2) {if (libraryProps.searchMode) sL.rbtn_up(x, y); return true;} else {men.rbtn_up(x, y); return true;}}
	this.on_mouse_wheel = function(step) {
        if (!v.k(CTRL_ALT)) {
            sbar.wheel(step, false);
        } else {
            ui.wheel(step);
        }
    }
	this.on_notify_data = function(name, info) {switch (name) {case "!!.tags update": lib_manager.treeState(false, 2); break;}}
	this.on_playback_new_track = function(handle) {ui.on_playback_new_track(handle);}
	this.on_playback_stop = function(reason) {if (reason == 2) return; on_item_focus_change();}
	this.on_playlist_items_added = function(pn) {if (pn == plman.ActivePlaylist) ui.upd_handle_list = true; on_item_focus_change();}
	this.on_playlist_items_removed = function(pn) {if (pn == plman.ActivePlaylist) ui.upd_handle_list = true; on_item_focus_change();}
	this.on_playlist_items_reordered = function(pn) {if (pn == plman.ActivePlaylist) ui.upd_handle_list = true;}
	this.on_playlist_switch = function() {on_item_focus_change();}
	this.on_script_unload = function() {but.on_script_unload();}
	this.mouse_in_this = function (x, y) {
		return (x >= ui.x && x < ui.x + ui.w &&
				y >= ui.y && y < ui.y + ui.h);
	}
}
// var library = new LibraryCallbacks();

var libraryInitialized = false;
var ui, sbar, p, v, lib_manager, library_tree, sL, quickSearch, libraryPanel, but, men, timer, library;
function initLibraryPanel() {
	if (!libraryInitialized) {
		ui = new userinterface();
		sbar = new scrollbar();
		p = new panel_operations();
		v = new v_keys();
		lib_manager = new library_manager();
		library_tree = new LibraryTree();
		if (libraryProps.searchMode) {
			sL = new searchLibrary();
		}
		quickSearch = new QuickSearch();
		libraryPanel = new LibraryPanel();
		but = new button_manager();
		men = new menu_object();
		timer = new timers();
		timer.lib();
		library = new LibraryCallbacks();

		libraryInitialized = true;
	}
}

function freeLibraryPanel() {
	ui = null;
	sbar = null;
	p = null;
	v = null;
	lib_manager = null;
	library_tree = null;
	sL = null;
	quickSearch = null;
	libraryPanel = null;
	but = null;
	men = null;
	timer = null;
	library = null;
	libraryInitialized = false;
}

window.SetProperty("SYSTEM.Software Notice Checked", true);
window.SetProperty(" Node: Item Counts 0-Hide 1-Tracks 2-Sub-Items", null);
window.SetProperty(" Node: Show All Music", null);
window.SetProperty(" Playlist: Play On Send From Menu", null);
window.SetProperty(" Text Single-Click: AutoFill Playlist", null);
window.SetProperty("ADV.Height Auto [Expand/Collapse With All Music]", null);
window.SetProperty("SYSTEM.Zoom Update", true);
