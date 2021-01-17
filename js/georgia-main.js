// Georgia
//
// Description  a fullscreen now-playing script for foo_jscript_panel
// Author 		Mordred
// Version 		2.0.0b1
// Dev. Started 2017-12-22
// Last change  2020-08-31
// --------------------------------------------------------------------------------------

// CONFIGURATION //////////////////////////////////////

var themeBaseName = "Georgia"; // this is the base name of the theme, and will be used for finding some of the theme's files in the configuration folder.

var ft = {}; // fonts

/**
 * @typedef {Object} ColorsObj
 * @property {number=} shadow color of the shadow
 * @property {number=} accent typically, the primary color shaded by 15%
 * @property {number=} artist color of artist text on background
 * @property {number=} bg background of the entire panel from geo.top_bg_h to bottom
 * @property {number=} darkAccent typically, the primary color shaded by 30%
 * @property {number=} extraDarkAccent the primary color shaded by 50% - used for dropshadow of colored text
 * @property {number=} hotness color of hotness text in metadatagrid
 * @property {number=} primary primary theme color generated from artwork
 * @property {number=} info_text default color of text in metadatagrid
 * @property {number=} lightAccent typically, the primary color tinted (lightened) 20%
 * @property {number=} menu_bg background color under menu (i.e. from y = 0 - geo.top_bg_h)
 * @property {number=} now_playing color of the lower bar text, including tracknum, title, elapsed and remaining time
 * @property {number=} progress_bar the background of the progress bar. Fill will be `col.primary`
 * @property {number=} rating color of rating stars in metadatagrid
 * @property {number=} tl_added background color for timeline block from added to first played
 * @property {number=} tl_played background color for timeline block from first played to last played
 * @property {number=} tl_unplayed background color for timeline block from last played to present time
 */
/** @type ColorsObj */
var col = {}; // colors
/**
 * @typedef {Object} GeometryObj
 * @property {number=} aa_shadow size of albumart shadow
 * @property {number=} lower_bar_h height of song title and time + progress bar area
 * @property {number=} pause_size width and height of pause button
 * @property {number=} prog_bar_h height of progress bar
 * @property {number=} timeline_h height of timeline
 * @property {number=} top_art_spacing space between top of theme and artwork
 * @property {number=} top_bg_h height of offset color background
 */
/** @type GeometryObj */
let geo = {};

let is_4k = false;

const fontThin = 'HelveticaNeueLT Pro 35 Th';
const fontLight = 'HelveticaNeueLT Pro 45 Lt';
const fontRegular = 'HelveticaNeueLT Pro 55 Roman';
const fontBold = 'HelveticaNeueLT Pro 65 Md';
const fontLightAlternate = 'NeueHaasGroteskDisp Pro XLt';
const fontGuiFx = 'Guifx v2 Transports';

var fontList = [fontThin, fontLight, fontRegular, fontBold, fontLightAlternate, fontGuiFx];

// FONTS
var fontsInstalled = true;
fontList.forEach(function(fontName) {
	if (!testFont(fontName)) {
		fontsInstalled = false;
	}
});

var useNeue = false;
var fontsCreated = null;

function createFonts() {
	g_tooltip = window.Tooltip;
	g_tooltip.Text = '';	// just in case
	g_tooltip.SetFont('Segoe UI', scaleForDisplay(15))
	g_tooltip.SetMaxWidth(scaleForDisplay(300));

	function font(name, size, style) {
		var font;
		try {
			font = gdi.Font(name, Math.round(scaleForDisplay(size)), style);
		} catch (e) {
			console.log('Failed to load font >>>', name, size, style);
		}
		return font;
	}
	ft.album_lrg = font(fontBold, 36, 0);
	ft.album_med = font(fontBold, 32, 0);
	ft.album_sml = font(fontBold, 28, 0);
	ft.album_lrg_alt = font(fontRegular, 36, 0);
	ft.album_med_alt = font(fontRegular, 32, 0);
	ft.album_sml_alt = font(fontRegular, 28, 0);
	ft.album_substitle_lrg = font(fontBold, 36, g_font_style.italic);
	ft.album_substitle_med = font(fontBold, 32, g_font_style.italic);
	ft.album_substitle_sml = font(fontBold, 28, g_font_style.italic);
	ft.title_lrg = font(fontThin, 34, 0);
	ft.title_med = font(fontThin, 30, 0);
	ft.title_sml = font(fontThin, 26, 0);
	ft.tracknum_lrg = font(fontLight, 34, g_font_style.bold);
	ft.tracknum_med = font(fontLight, 30, g_font_style.bold);
	ft.tracknum_sml = font(fontLight, 26, g_font_style.bold);
	ft.year = font(fontRegular, 48, g_font_style.bold);
	ft.artist_lrg = font(fontBold, 40, 0);
	ft.artist_med = font(fontBold, 36, 0);
	ft.artist_sml = font(fontBold, 30, 0);
	ft.track_info = font(fontThin, 18, 0);
	ft.grd_key_lrg = font(fontRegular, 24, 0); // used instead of ft.grd_key if ww > 1280
	ft.grd_val_lrg = font(fontLight, 24, 0); // used instead of ft.grd_val if ww > 1280
	ft.grd_key_med = font(fontRegular, 20, 0);
	ft.grd_val_med = font(fontLight, 20, 0);
	ft.grd_key_sml = font(fontRegular, 18, 0);
	ft.grd_val_sml = font(fontLight, 18, 0);
	ft.lower_bar = font(fontLight, 30, 0);
	if (updateHyperlink) {
		updateHyperlink.setFont(ft.lower_bar);
	}
	ft.lower_bar_bold = font(fontBold, 30, 0);
	ft.lower_bar_sml = font(fontLight, 26, 0);
	ft.lower_bar_sml_bold = font(fontBold, 26, 0);
	if (utils.CheckFont(fontLightAlternate)) {
		useNeue = true;
		ft.lower_bar_artist = font(fontLightAlternate, 31, g_font_style.italic);
		ft.lower_bar_artist_sml = font(fontLightAlternate, 27, g_font_style.italic);
	} else {
		ft.lower_bar_artist = font(fontThin, 31, g_font_style.italic);
		ft.lower_bar_artist_sml = font(fontThin, 27, g_font_style.italic);
	}
	ft.small_font = font(fontRegular, 14, 0);
	ft.guifx = font(fontGuiFx, Math.floor(pref.transport_buttons_size / 2), 0);
	ft.Marlett = font('Marlett', 13, 0);
	ft.SegoeUi = font('Segoe Ui Semibold', pref.menu_font_size, 0);
	ft.library_tree = font('Segoe UI', libraryProps.baseFontSize, 0);
	ft.lyrics = font(fontRegular, pref.lyrics_font_size || 20, 1);
}


function initColors() {
	col.artist = RGB(255, 255, 255);

	if (pref.darkMode) {
		col.bg = RGB(50, 54, 57);
		col.menu_bg = RGB(23, 23, 23);
		col.progress_bar = RGB(23, 22, 25);
		col.now_playing = RGB(255, 255, 255); // tracknumber, title, and time
		col.shadow = RGBA(128, 128, 128, 54);
	} else {
		col.bg = RGB(185, 185, 185);
		col.menu_bg = RGB(54, 54, 54);
		col.progress_bar = RGB(125, 125, 125);
		col.now_playing = RGB(0, 0, 0); // tracknumber, title, and time
		col.shadow = RGBA(0, 0, 0, 64);
	}

	col.rating = RGB(255, 170, 32);
	col.hotness = RGB(192, 192, 0);

	col.tl_added = RGB(15, 51, 65);
	col.tl_played = RGB(44, 66, 75);
	col.tl_unplayed = RGB(126, 173, 195);
}
initColors();

function setGeometry() {
	geo.aa_shadow = scaleForDisplay(8); // size of albumart shadow
	geo.pause_size = scaleForDisplay(150);
	geo.prog_bar_h = scaleForDisplay(12) + (ww > 1920 ? 2 : 0); // height of progress bar
	geo.lower_bar_h = scaleForDisplay(80); // height of song title and time + progress bar area
	geo.top_art_spacing = scaleForDisplay(96); // space between top of theme and artwork
	geo.top_bg_h = scaleForDisplay(160); // height of offset color background
	geo.timeline_h = scaleForDisplay(18); // height of timeline
	if (!pref.show_progress_bar) {
		geo.lower_bar_h -= geo.prog_bar_h * 2;
	}

	if (is_4k) {
		settingsImg = gdi.Image(pref.setting_4k_img); // settings image
		propertiesImg = gdi.Image(pref.prop_4k_img); // properties image
		ratingsImg = gdi.Image(pref.rating_4k_img); // rating image
		playlistImg = gdi.Image(pref.list_4k_img); // playlist image
		libraryImg = gdi.Image(pref.library_4k_img); // library image
		lyricsImg = gdi.Image(pref.lyrics_4k_img); // lyrics image
	} else {
		settingsImg = gdi.Image(pref.settng_img); // settings image
		propertiesImg = gdi.Image(pref.prop_img); // properties image
		ratingsImg = gdi.Image(pref.rating_img); // rating image
		playlistImg = gdi.Image(pref.list_img); // playlist image
		libraryImg = gdi.Image(pref.library_img); // library image
		lyricsImg = gdi.Image(pref.lyrics_img); // lyrics image
	}
}

var playedTimesRatios = [];

// PATHS
pref.settng_img = fb.ProfilePath + 'georgia/images/settings.png';
pref.prop_img = fb.ProfilePath + 'georgia/images/properties.png';
pref.list_img = fb.ProfilePath + 'georgia/images/playlist.png';
pref.library_img = fb.ProfilePath + 'georgia/images/library.png';
pref.lyrics_img = fb.ProfilePath + 'georgia/images/lyrics.png';
pref.rating_img = fb.ProfilePath + 'georgia/images/star.png';

pref.setting_4k_img = fb.ProfilePath + 'georgia/images/4k/settings.png';
pref.prop_4k_img = fb.ProfilePath + 'georgia/images/4k/properties.png';
pref.list_4k_img = fb.ProfilePath + 'georgia/images/4k/playlist.png';
pref.library_4k_img = fb.ProfilePath + 'georgia/images/4k/library.png';
pref.lyrics_4k_img = fb.ProfilePath + 'georgia/images/4k/lyrics.png';
pref.rating_4k_img = fb.ProfilePath + 'georgia/images/4k/star.png';

pref.last_fm_img = fb.ProfilePath + 'georgia/images/last-fm-red-36.png';
pref.last_fmw_img = fb.ProfilePath + 'georgia/images/last-fm-36.png';
pref.label_base = fb.ProfilePath + 'images/recordlabel/'; // location of the record label logos for the bottom right corner
pref.logo_hq = fb.ProfilePath + 'images/artistlogos/'; // location of High-Qualiy band logos for the bottom left corner
pref.logo_color = fb.ProfilePath + 'images/artistlogos color/';
pref.codec_base = fb.ProfilePath + 'images/codec logos/';
pref.flags_base = fb.ProfilePath + 'images/flags/'; // location of artist country flags

// MOUSE WHEEL SEEKING SPEED
pref.mouse_wheel_seek_speed = 5; // seconds per wheel step

// DEBUG
// var pref.show_debug_log = window.GetProperty("Debug: Show Debug Output", false);
var timings = {
	showDebugTiming: false, 	// spam console with debug timings
	showDrawTiming: false, 	// spam console with draw times
	showExtraDrawTiming: false,// spam console with every section of the draw code to determine bottlenecks
}

// PLAYLIST JUNK
var btns = {};
let btnImg = undefined;
// =================================================== //

// END OF CONFIGURATION /////////////////////////////////



// VARIABLES
// Artwork
var albumart = null; // albumart image
let albumart_size = new ImageSize(0, 0, 0, 0); // position (big image)
var cdart = null; // cdart image
let cdart_size = new ImageSize(0, 0, 0, 0); // cdart position (offset from albumart_size)
var albumart_scaled = null; // pre-scaled album art to speed up drawing considerably
var recordLabels = []; // array of record label images
var recordLabelsInverted = []; // array of inverted record label images
var bandLogo = null; // band logo image
var invertedBandLogo = null; // inverted band logo image
var settingsImg = null; // settings image
var propertiesImg = null; // properties image
var ratingsImg = null; // rating image
var playlistImg = null; // playlist image
var libraryImg = null; // library image
var lyricsImg = null; // lyrics image
var lastFmImg = gdi.Image(pref.last_fm_img); // Last.fm logo image
var lastFmWhiteImg = gdi.Image(pref.last_fmw_img); // white Last.fm logo image
var shadow_image = null; // shadow behind the artwork + discart
var labelShadowImg = null; // shadow behind labels
var playlist_shadow = null; // shadow behind the playlist
var flagImgs = []; // array of flag images
let releaseFlagImg = null;
var rotatedCD = null; // drawing cdArt rotated is slow, so first draw it rotated into the rotatedCD image, and then draw rotatedCD image unrotated
let disc_art_loading; // for on_load_image_done()
let album_art_loading; // for on_load_image_done()
var isStreaming = false; // is the song from a streaming source?
var retrieveThemeColorsWhenLoaded = false; // only load theme colors on first image in aa_array
var newTrackFetchingArtwork = false; // only load theme colors when newTrackFetchingArtwork = true
var noArtwork = false; // only use default theme when noArtwork was found
var themeColorSet = false; // when no artwork, don't set themeColor every redraw
var playCountVerifiedByLastFm = false; // show Last.fm image when we %lastfm_play_count% > 0
var art_off_center = false; // if true, album art has been shifted 40 pixels to the right
var loadFromCache = true; // always load art from cache unless this is set

/**
 * @typedef {Object} MetadataGridObj
 * @property {boolean=} age Should the age of the field also be calculated (i.e. add the "(3y 5m 11d)" to `val`)
 * @property {string} label Grid label
 * @property {string} val Grid value. If `val.trim().length === 0`. The grid entry will not be shown.
 */
/**
 * @typedef {Object} StringsObj Collection of strings and other objects to be displayed throughout UI
 * @property {string=} artist
 * @property {string=} album
 * @property {string=} album_subtitle
 * @property {string=} disc By default this string is displayed if there is more than one total disc. Formated like: "CD1/2"
 * @property {Array<MetadataGridObj>=} grid
 * @property {string=} length Length of the song in MM:SS format
 * @property {string=} original_artist
 * @property {string=} time Current time of the song in MM:SS format
 * @property {string=} title Title of the song
 * @property {string=} title_lower Title of the song to be displayed above the progress bar. Can include more information such as translation, original artist, etc.
 * @property {string=} tracknum
 * @property {*=} trackInfo The piece of text shown in the upper right corner under the year
 * @property {string=} year
 * @property {Timeline=} timeline Timeline object
 */
/** @type StringsObj */
let str = {};
var state = {}; // panel state

// TIMERS
var progressTimer; // 40ms repaint of progress bar
var globTimer; // Timer for rotating globs
let hideCursorTimer; // Timer for hiding cursor

// STATUS VARIABLES
let ww = 0;
let wh = 0; // size of panel
/** @type ProgressBar */
let progressBar = null;
var last_pb; // saves last playback order
var just_dblclicked = false;
var aa_list = [];
var albumArtIndex = 0; // index of currently displayed album art if more than 1
var t_interval; // milliseconds between screen updates
let lastLeftEdge = 0; // the left edge of the record labels. Saved so we don't have to recalculate every on every on_paint unless size has changed
let lastLabelHeight = 0;
let displayPlaylist = false;
let displayLibrary = false;
let displayLyrics = false;

var tl_firstPlayedRatio = 0;
var tl_lastPlayedRatio = 0;

var current_path;
var last_path;
var lastDiscNumber;
var lastVinylSide;
var currentLastPlayed = '';

let g_tooltip;
const tt = new _.tt_handler;

let g_playtimer = null;

// MENU STUFF
var menu_down = false;

///////// OBJECTS

var art_cache = new ArtCache(10);
var cdartPath = '';
var album_art_path = '';

var pauseBtn = new PauseButton();

var last_accent_col = undefined;
var progressAlphaCol = undefined;

var volume_btn;

// Call initialization function
on_init();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function draw_ui(gr) {
	gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
	gr.SetSmoothingMode(SmoothingMode.None);

	// Background
	if (!albumart && noArtwork) { // we use noArtwork to prevent flashing of blue default theme
		albumart_size.x = Math.floor(ww * 0.33); // if there's no album art info panel takes up 1/3 screen
		albumart_size.y = geo.top_art_spacing;
		albumart_size.h = wh - albumart_size.y - geo.lower_bar_h - 32;
		if (!themeColorSet) {
			setTheme(blueTheme.colors);
			themeColorSet = true;
		}
	}
	gr.FillSolidRect(0, geo.top_bg_h, ww, wh - geo.top_bg_h, col.bg);
	gr.FillSolidRect(0, 0, ww, geo.top_bg_h, col.menu_bg);
	if ((fb.IsPaused || fb.IsPlaying) && (!albumart && cdart)) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, col.primary);
		gr.DrawRect(-1, albumart_size.y, albumart_size.x, albumart_size.h - 1, 1, col.accent);
	}

	gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);

	var textLeft = Math.round(Math.min(0.015 * ww, scaleForDisplay(20)));
	// Top bar Year, and track info
	if (((!displayPlaylist && !displayLibrary) || (!albumart && noArtwork)) && fb.IsPlaying) {
		var trackInfoHeight = 0;
		var infoWidth = Math.floor(ww / 3);
		if (str.trackInfo) {
			gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
			trackInfoHeight = gr.MeasureString(str.trackInfo, ft.track_info, 0, 0, 0, 0).Height;
			gr.DrawString(str.trackInfo, ft.track_info, col.artist, ww - textLeft * 2 - infoWidth, geo.top_bg_h - trackInfoHeight - 15, infoWidth, trackInfoHeight, StringFormat(2));
			gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
		}
		if (str.year) {
			const height = gr.MeasureString(str.year, ft.year, 0, 0, 0, 0).Height;
			gr.DrawString(str.year, ft.year, col.artist, ww - textLeft * 2 - infoWidth, geo.top_bg_h - trackInfoHeight - height - 20, infoWidth, height, StringFormat(2));
		}
	}

	// BIG ALBUMART
	if (fb.IsPlaying) {
		if (cdart && !rotatedCD && !displayPlaylist && !displayLibrary && pref.display_cdart) {
			CreateRotatedCDImage();
		}
		if (!pref.darkMode && (albumart_scaled || rotatedCD)) {
			shadow_image && gr.DrawImage(shadow_image, -geo.aa_shadow, albumart_size.y - geo.aa_shadow, shadow_image.Width, shadow_image.Height,
				0, 0, shadow_image.Width, shadow_image.Height);
			// gr.DrawRect(-geo.aa_shadow, albumart_size.y - geo.aa_shadow, shadow_image.Width, shadow_image.Height, 1, RGBA(0,0,255,125));	// viewing border line
		}
		if (albumart && albumart_scaled) {
			let drawArt = null;
			if (timings.showExtraDrawTiming) {
				drawArt = fb.CreateProfiler('on_paint -> artwork');
			}
			if (!pref.cdart_ontop || displayLyrics) {
				if (rotatedCD && !displayPlaylist && !displayLibrary) {
					drawCdArt(gr);
				}
				gr.DrawImage(albumart_scaled, albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h, 0, 0, albumart_scaled.Width, albumart_scaled.Height);
			} else { // draw cdart on top of front cover
				gr.DrawImage(albumart_scaled, albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h, 0, 0, albumart_scaled.Width, albumart_scaled.Height);
				if (rotatedCD && !displayPlaylist && !displayLibrary) {
					drawCdArt(gr);
				}
			}
			if (displayLyrics && albumart_scaled && fb.IsPlaying) {
				gr.FillSolidRect(albumart_size.x - 1, albumart_size.y - 1, albumart_size.w + 1, albumart_size.h + 1, RGBA(0, 0, 0, 155));
				gLyrics && gLyrics.drawLyrics(gr);
			}
			if (timings.showExtraDrawTiming) drawArt.Print();
		} else if (rotatedCD && pref.display_cdart) {
			// cdArt, but no album art
			drawCdArt(gr);
		}
	}
	if (fb.IsPlaying && (albumart || !cdart) && ((!displayLibrary && !displayPlaylist) || !settings.hidePanelBgWhenCollapsed)) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, col.primary); // info bg -- must be drawn after shadow
		gr.DrawRect(-1, albumart_size.y, albumart_size.x, albumart_size.h - 1, 1, col.accent);
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	}
	if (fb.IsPaused) {
		pauseBtn.draw(gr);
	}

	if (str.artist) {
		var availableWidth = displayPlaylist || displayLibrary ? Math.min(ww / 2 - 20, btns.playlist.x - textLeft) : btns.playlist.x - textLeft;
		var artistFont = chooseFontForWidth(gr, availableWidth, str.artist, [ft.artist_lrg, ft.artist_med, ft.artist_sml]);
		const height = gr.CalcTextHeight(str.artist, artistFont);
		var artistY = albumart_size.y - height - scaleForDisplay(8);
		gr.DrawString(str.artist, artistFont, col.artist, textLeft, artistY, availableWidth, height, StringFormat(0, 0, 4));
		const width = gr.MeasureString(str.artist, artistFont, 0, 0, 0, 0).Width;
		if (pref.show_flags && flagImgs.length && width + flagImgs[0].Width * flagImgs.length < availableWidth) {
			var flagsLeft = textLeft + width + scaleForDisplay(15);
			for (let i = 0; i < flagImgs.length; i++) {
				gr.DrawImage(flagImgs[i], flagsLeft, Math.round(artistY + 1 + height / 2 - flagImgs[i].Height / 2),
					flagImgs[i].Width, flagImgs[i].Height, 0, 0, flagImgs[i].Width, flagImgs[i].Height)
				flagsLeft += flagImgs[i].Width + scaleForDisplay(5);
			}
		}
	}

	// text info grid
	if (((!displayPlaylist && !displayLibrary) || (!albumart && noArtwork)) && fb.IsPlaying) {
		let gridSpace = 0;
		if (!albumart && cdart) {
			gridSpace = Math.round(cdart_size.x - geo.aa_shadow - textLeft);
		} else {
			gridSpace = Math.round(albumart_size.x - geo.aa_shadow - textLeft);
		}
		const text_width = gridSpace;
		let drawTextGrid = null;

		if (timings.showExtraDrawTiming) drawTextGrid = fb.CreateProfiler('on_paint -> textGrid');

		var c = new Color(col.primary);
		if (c.brightness > 190) {
			col.info_text = rgb(32,32,32);
		} else {
			col.info_text = rgb(255,255,255);
		}

		var top = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) + scaleForDisplay(15);
		if (gridSpace > 120) {
			if (str.title) {
				ft.title = ft.title_lrg;
				ft.tracknum = ft.tracknum_lrg;
				var title_spacing = scaleForDisplay(8);
				var trackNumWidth = 0;
				if (str.tracknum) {
					trackNumWidth = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Width + title_spacing;
				}
				txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width - trackNumWidth, wh);
				if (txtRec.Lines > 2) {
					ft.title = ft.title_med;
					ft.tracknum = ft.tracknum_med;
					if (str.tracknum) {
						trackNumWidth = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Width + title_spacing;
					}
					txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width - trackNumWidth, wh);
					if (txtRec.Lines > 2) {
						ft.title = ft.title_sml;
						ft.tracknum = ft.tracknum_sml;
						if (str.tracknum) {
							trackNumWidth = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Width + title_spacing;
						}
						txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width - trackNumWidth, wh);
					}
				}
				const tracknumHeight = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Height;
				const heightAdjustment = Math.ceil((tracknumHeight - gr.MeasureString(str.title, ft.title, 0, 0, 0, 0).Height) / 2);
				const  numLines = Math.min(2, txtRec.Lines);
				const height = gr.CalcTextHeight(str.title, ft.title) * numLines + 3;

				trackNumWidth = Math.ceil(trackNumWidth);
				gr.DrawString(str.tracknum, ft.tracknum, col.info_text, textLeft, top - heightAdjustment, trackNumWidth, height);
                // gr.DrawRect(textLeft, top, trackNumWidth, height, 1, rgb(255,0,0));
                if (is_4k) {
                    gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
                } else {
                    gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit); // thicker fonts can use anti-alias
                }
				gr.DrawString(str.title, ft.title, col.info_text, textLeft + trackNumWidth, top, text_width - trackNumWidth, height, g_string_format.trim_ellipsis_word);
				// gr.DrawRect(textLeft, top, text_width - trackNumWidth, height, 1, rgb(255,0,0));

				top += height + scaleForDisplay(12);
				gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
			}

			//Timeline playcount bars
			if (fb.IsPlaying && str.timeline) {
				str.timeline.setSize(0, top, albumart_size.x);
				str.timeline.draw(gr);
			}

			top += geo.timeline_h + scaleForDisplay(12);

			if (str.album) {
				let height = 0;
				let font_array = [ft.album_lrg, ft.album_med, ft.album_sml];
				if (str.album.indexOf('Á') !== -1) {
					// some fonts don't work correctly with this character
					font_array = [ft.album_lrg_alt, ft.album_med_alt, ft.album_sml_alt];
				}
				var subtitlefont_array = [ft.album_substitle_lrg, ft.album_substitle_med, ft.album_substitle_sml];
				if (str.album_subtitle.length) {
					top += drawMultipleLines(gr, text_width, textLeft, top, col.info_text, str.album, font_array,
						str.album_subtitle, subtitlefont_array, 2);
				} else {
					var ft_album = chooseFontForWidth(gr, text_width, str.album, font_array, 2);
					var txtRec = gr.MeasureString(str.album, ft_album, 0, 0, text_width, wh);
					var numLines = txtRec.Lines;
					var lineHeight = txtRec.Height / numLines;
					if (numLines > 2) {
						numLines = 2;
					}
					height = lineHeight * numLines;
					gr.DrawString(str.album, ft_album, col.info_text, textLeft, top, text_width, height, g_string_format.trim_ellipsis_word);
				}
				top += height + scaleForDisplay(10);
			}

			// Tag grid
			var font_array = [ft.grd_key_lrg, ft.grd_key_med, ft.grd_key_sml];
			var key_font_array = [ft.grd_val_lrg, ft.grd_val_med, ft.grd_val_sml];
			let grid_key_ft = ft.grd_key_lrg;
			str.grid.forEach((el) => {
				if (font_array.length > 1) {	// only check if there's more than one entry in font_array
					grid_key_ft = chooseFontForWidth(gr, text_width / 3, el, font_array);
					while (grid_key_ft !== font_array[0]) {	// if font returned was first item in the array, then everything fits, otherwise pare down array
						font_array.shift();
						key_font_array.shift();
					}
				}
			});
			const grid_val_ft = key_font_array.shift();
			const col1_width = calculateGridMaxTextWidth(gr, str.grid, grid_key_ft);

			var column_margin = scaleForDisplay(10);
			var col2_width = text_width - column_margin - col1_width;
			var col2_left = textLeft + col1_width + column_margin;

            gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
			for (let k = 0; k < str.grid.length; k++) {
				var key = str.grid[k].label;
				var value = str.grid[k].val;
				let showLastFmImage = false;
				let showReleaseCountryFlagImage = false;
				var dropShadow = false;
				var grid_val_col = col.info_text;

				if (value.length) {
					switch (key) {
						case 'Rating':
							grid_val_col = col.rating;
							dropShadow = true;
							break;
						case 'Hotness':
							grid_val_col = col.hotness;
							dropShadow = true;
							break;
						case 'Play Count':
							showLastFmImage = true;
							break;
						case 'Catalog #':
						case 'Release Country':
							showReleaseCountryFlagImage = settings.showReleaseCountryFlag;
							break;
						default:
							break;
					}
					txtRec = gr.MeasureString(value, grid_val_ft, 0, 0, col2_width, wh);
					if (top + txtRec.Height < albumart_size.y + albumart_size.h) {
						var border_w = scaleForDisplay(0.5);
						const cell_height = txtRec.Height + 5;
						if (dropShadow) {
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left + border_w, top + border_w, col2_width, cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left - border_w, top + border_w, col2_width, cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left + border_w, top - border_w, col2_width, cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left - border_w, top - border_w, col2_width, cell_height, StringFormat(0, 0, 4));
						}
						gr.DrawString(key, grid_key_ft, col.info_text, textLeft, top, col1_width, cell_height, g_string_format.trim_ellipsis_char); // key
						gr.DrawString(value, grid_val_ft, grid_val_col, col2_left, top, col2_width, cell_height, StringFormat(0, 0, 4));

						if (playCountVerifiedByLastFm && showLastFmImage) {
                            let lastFmLogo = lastFmImg;
							if (colorDistance(col.primary, rgb(185, 0, 0), false) < 133) {
								lastFmLogo = lastFmWhiteImg;
							}
							const heightRatio = (cell_height - 12) / lastFmLogo.Height;
							if (txtRec.Width + scaleForDisplay(12) + Math.round(lastFmLogo.Width * heightRatio) < col2_width) {
								gr.DrawImage(lastFmLogo, col2_left + txtRec.Width + scaleForDisplay(12), top + 3, Math.round(lastFmLogo.Width * heightRatio), cell_height - 12,
									0, 0, lastFmLogo.Width, lastFmLogo.Height);
							}
						}
						if (showReleaseCountryFlagImage && releaseFlagImg) {
							const heightRatio = (cell_height) / releaseFlagImg.Height;
							if (txtRec.Width + scaleForDisplay(10) + Math.round(releaseFlagImg.Width * heightRatio) < col2_width) {
								gr.DrawImage(releaseFlagImg, col2_left + txtRec.Width + scaleForDisplay(10), top - 3, Math.round(releaseFlagImg.Width * heightRatio), cell_height,
									0, 0, releaseFlagImg.Width, releaseFlagImg.Height);
							}
						}
						top += cell_height + 5;
					}
				}
            }
            gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
		}
		if (timings.showExtraDrawTiming) drawTextGrid.Print();

	} /* if (!displayPlaylist && !displayLibrary) */

	if ((fb.IsPlaying && !displayPlaylist && !displayLibrary) || (!albumart && !cdart && noArtwork)) {
		let drawBandLogos = null;
        // BAND LOGO drawing code
        const brightBackground = (new Color(col.primary).brightness) > 190;
		timings.showExtraDrawTiming && (drawBandLogos = fb.CreateProfiler('on_paint -> band logos'));
        const availableSpace = albumart_size.y + albumart_size.h - top;
        var logo = brightBackground ? (invertedBandLogo ? invertedBandLogo : bandLogo) : bandLogo;
		if (logo && availableSpace > 75) {
			// max width we'll draw is 1/2 the full size because the HQ images are just so big
			let logoWidth = Math.min(is_4k ? logo.Width : logo.Width / 2, albumart_size.x - ww * 0.05);
			let heightScale = logoWidth / logo.Width; // width is fixed to logoWidth, so scale height accordingly
			if (logo.Height * heightScale > availableSpace) {
				// TODO: could probably do this calc just once, but the logic is complicated
				heightScale = availableSpace / logo.Height;
				logoWidth = logo.Width * heightScale;
			}
			let logoTop = Math.round(albumart_size.y + albumart_size.h - (heightScale * logo.Height)) - 4;
			if (is_4k) {
				logoTop -= 20;
			}
			gr.DrawImage(logo, Math.round(albumart_size.x / 2 - logoWidth / 2), logoTop, Math.round(logoWidth), Math.round(logo.Height * heightScale),
				0, 0, logo.Width, logo.Height, 0);
		}
		if (timings.showExtraDrawTiming) drawBandLogos.Print();


		// RECORD LABEL drawing code
		// this section should draw in 3ms or less always
		if (recordLabels.length > 0) {
            const labels = brightBackground && !pref.labelArtOnBg ? (recordLabelsInverted.length ? recordLabelsInverted : recordLabels) : recordLabels;
			var rightSideGap = 20, // how close last label is to right edge
				labelSpacing = 0,
				leftEdgeGap = (art_off_center ? 20 : 40) * (is_4k ? 1.8 : 1), // space between art and label
				maxLabelWidth = scaleForDisplay(200);
			let leftEdgeWidth = is_4k ? 45 : 30; // how far label background extends on left
			let drawLabelTime = null;
			let totalLabelWidth = 0;
			let labelAreaWidth = 0;
			let leftEdge = 0;
			let topEdge = 0;
			let labelWidth;
			let labelHeight;
			if (timings.showExtraDrawTiming) drawLabelTime = fb.CreateProfiler('on_paint -> record labels');

			for (let i = 0; i < labels.length; i++) {
				if (labels[i].Width > maxLabelWidth) {
					totalLabelWidth += maxLabelWidth;
				} else {
					if (is_4k && labels[i].Width < 200) {
						totalLabelWidth += labels[i].Width * 2;
					} else {
						totalLabelWidth += labels[i].Width;
					}
				}
			}
			if (!lastLeftEdge) { // we don't want to recalculate this every screen refresh
				debugLog('recalculating lastLeftEdge');
				labelShadowImg = disposeImg(labelShadowImg);
				labelWidth = Math.round(totalLabelWidth / labels.length);
				labelHeight = Math.round(labels[0].Height * labelWidth / labels[0].Width); // might be recalc'd below
				if (albumart) {
					if (cdart && pref.display_cdart) {
						leftEdge = Math.round(Math.max(albumart_size.x + albumart_scaled.Width + 5, ww * 0.975 - totalLabelWidth + 1));
						var cdCenter = {};
						cdCenter.x = Math.round(cdart_size.x + cdart_size.w / 2);
						cdCenter.y = Math.round(cdart_size.y + cdart_size.h / 2);
						var radius = cdCenter.y - cdart_size.y;

						while (true) {
							const allLabelsWidth = Math.max(Math.min(Math.round((ww - leftEdge - rightSideGap) / labels.length), maxLabelWidth), 50);
							//console.log("leftEdge = " + leftEdge + ", ww-leftEdge-10 = " + (ww-leftEdge-10) + ", allLabelsWidth=" + allLabelsWidth);
							var maxWidth = is_4k && labels[0].Width < 200 ? labels[0].Width * 2 : labels[0].Width;
							labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
							labelHeight = Math.round(labels[0].Height * labelWidth / labels[0].Width); // width is based on height scale
							topEdge = Math.round(albumart_size.y + albumart_size.h - labelHeight);

							var a = topEdge - cdCenter.y + 1; // adding 1 to a and b so that the border just touches the edge of the cdart
							var b = leftEdge - cdCenter.x + 1;

							if ((a * a + b * b) > radius * radius) {
								break;
							}
							leftEdge += 4;
						}
					} else {
						leftEdge = Math.round(Math.max(albumart_size.x + albumart_size.w + leftEdgeWidth + leftEdgeGap, ww * 0.975 - totalLabelWidth + 1));
					}
				} else {
					leftEdge = Math.round(ww * 0.975 - totalLabelWidth);
				}
				labelAreaWidth = ww - leftEdge - rightSideGap;
				lastLeftEdge = leftEdge;
				lastLabelHeight = labelHeight;
			} else {
				// already calculated
				leftEdge = lastLeftEdge;
				labelHeight = lastLabelHeight;
				labelAreaWidth = ww - leftEdge - rightSideGap;
			}
			if (labelAreaWidth >= scaleForDisplay(50)) {
				if (labels.length > 1) {
					labelSpacing = Math.min(12, Math.max(3, Math.round((labelAreaWidth / (labels.length - 1)) * 0.048))); // spacing should be proportional, and between 3 and 12 pixels
				}
				// console.log('labelAreaWidth = ' + labelAreaWidth + ", labelSpacing = " + labelSpacing);
				const allLabelsWidth = Math.max(Math.min(Math.round((labelAreaWidth - (labelSpacing * (labels.length - 1))) / labels.length), maxLabelWidth), 50); // allLabelsWidth must be between 50 and 200 pixels wide
				var labelX = leftEdge;
				topEdge = albumart_size.y + albumart_size.h - labelHeight - 20;
				const origLabelHeight = labelHeight;

				if (!pref.labelArtOnBg) {
					if (!pref.darkMode) {
						if (!labelShadowImg) {
							labelShadowImg = createShadowRect(ww - labelX + leftEdgeWidth, labelHeight + 40);
						}
						gr.DrawImage(labelShadowImg, labelX - leftEdgeWidth - geo.aa_shadow, topEdge - 20 - geo.aa_shadow, ww - labelX + leftEdgeWidth + 2 * geo.aa_shadow, labelHeight + 40 + 2 * geo.aa_shadow,
							0, 0, labelShadowImg.Width, labelShadowImg.Height);
					}
					gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
					gr.FillSolidRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40, col.primary);
					gr.DrawRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40 - 1, 1, col.accent);
					gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
				}
				for (let i = 0; i < labels.length; i++) {
					// allLabelsWidth can never be greater than 200, so if a label image is 161 pixels wide, never draw it wider than 161
					var maxWidth = is_4k && labels[i].Width < 200 ? labels[i].Width * 2 : labels[i].Width;
					labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
					labelHeight = Math.round(labels[i].Height * labelWidth / labels[i].Width); // width is based on height scale

					gr.DrawImage(labels[i], labelX, Math.round(topEdge + origLabelHeight / 2 - labelHeight / 2), labelWidth, labelHeight, 0, 0, recordLabels[i].Width, recordLabels[i].Height);
					// gr.DrawRect(labelX, topEdge, labelWidth, labelHeight, 1, RGB(255,0,0));	// shows bounding rect of record labels
					labelX += labelWidth + labelSpacing;
				}
				labelHeight = origLabelHeight; // restore
			}
			if (timings.showExtraDrawTiming) drawLabelTime.Print();
		}
	} /* if (!displayPlaylist && !displayLibrary) */

	// LOWER BAR
	var lowerBarTop = wh - geo.lower_bar_h;

	// Title & artist
	let timeAreaWidth = 0;
	if (ww > 600) {
		if (str.disc != '') {
			timeAreaWidth = gr.CalcTextWidth(str.disc + '   ' + str.time + '   ' + str.length, ft.lower_bar);
		} else {
			timeAreaWidth = gr.CalcTextWidth(' ' + str.time + '   ' + str.length, ft.lower_bar);
		}
	}

	// Playlist/Library
	if (displayPlaylist) {
		let drawPlaylistProfiler = null;
		timings.showExtraDrawTiming && (drawPlaylistProfiler = fb.CreateProfiler('on_paint -> playlist'));
		if (!pref.darkMode) {
			if (!playlist_shadow) {
				playlist_shadow = createShadowRect(playlist.w + 2 * geo.aa_shadow, playlist.h); // extend shadow past edge
			}
			gr.DrawImage(playlist_shadow, playlist.x - geo.aa_shadow, playlist.y - geo.aa_shadow, playlist.w + 2 * geo.aa_shadow, playlist.h + 2 * geo.aa_shadow,
				0, 0, playlist_shadow.Width, playlist_shadow.Height);
		} else {
			gr.DrawRect(playlist.x - 1, playlist.y - 1, playlist.w + 2, playlist.h + 2, 1, rgb(64,64,64));
		}
		playlist.on_paint(gr);
		timings.showExtraDrawTiming && drawPlaylistProfiler.Print();
	} else if (displayLibrary) {
		libraryPanel.on_paint(gr);
		if (pref.darkMode) {
			gr.DrawRect(libraryPanel.x - 1, libraryPanel.y - 1, libraryPanel.w + 2, libraryPanel.h + 2, 1, rgb(64,64,64));
		}
	}

	// MENUBAR
	let drawMenuBar = null;
	timings.showExtraDrawTiming && (drawMenuBar = fb.CreateProfiler('on_paint -> menu bar'));
	for (var i in btns) {
		var x = btns[i].x,
			y = btns[i].y,
			w = btns[i].w,
			h = btns[i].h,
			img = btns[i].img;

		if (img) { // TODO: fix
			gr.DrawImage(img[0], x, y, w, h, 0, 0, w, h, 0, 255); // normal
			gr.DrawImage(img[1], x, y, w, h, 0, 0, w, h, 0, btns[i].hoverAlpha);
			gr.DrawImage(img[2], x, y, w, h, 0, 0, w, h, 0, btns[i].downAlpha);
		}
	}

	timings.showExtraDrawTiming && drawMenuBar.Print();

    gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);

	var ft_lower_bold = ft.lower_bar_bold;
	var ft_lower = ft.lower_bar;
	var ft_lower_orig_artist = ft.lower_bar_artist;
	var trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width);
	var titleMeasurements = gr.MeasureString(str.title_lower, ft_lower, 0, 0, 0, 0);
	var origArtistWidth = gr.MeasureString(str.original_artist, ft_lower_orig_artist, 0, 0, 0, 0).Width;
	if (timeAreaWidth + trackNumWidth + titleMeasurements.Width + origArtistWidth > 0.95 * ww) {
		// we don't have room for all the text so use a smaller font and recalc size
		ft_lower_bold = ft.lower_bar_sml_bold;
		ft_lower = ft.lower_bar_sml;
		ft_lower_orig_artist = ft.lower_bar_artist_sml;
		titleMeasurements = gr.MeasureString(str.title_lower, ft_lower, 0, 0, 0, 0);
		trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft.lower_bar_sml_bold, 0, 0, 0, 0).Width);
		if (str.disc !== '') {
			timeAreaWidth = gr.CalcTextWidth(str.disc + '   ' + str.time + '   ' + str.length, ft_lower);
		} else {
			timeAreaWidth = gr.CalcTextWidth(' ' + str.time + '   ' + str.length, ft_lower);
		}
    }
	var heightAdjustment = is_4k ? 1 : 0;
    gr.DrawString(str.tracknum, ft_lower_bold, col.now_playing, progressBar.x, lowerBarTop + heightAdjustment, 0.95 * ww - timeAreaWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
	let bottomTextWidth = timeAreaWidth + trackNumWidth;
	gr.DrawString(str.title_lower, ft_lower, col.now_playing, progressBar.x + trackNumWidth, lowerBarTop, 0.95 * ww - bottomTextWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
	bottomTextWidth += Math.ceil(titleMeasurements.Width);
	if (str.original_artist && bottomTextWidth < 0.95 * ww) {
		var h_spacing = 0;
		var v_spacing = 0;
		if (useNeue) {
			h_spacing = scaleForDisplay(4);
			v_spacing = scaleForDisplay(1);
		}
		gr.DrawString(str.original_artist, ft_lower_orig_artist, col.now_playing, progressBar.x + trackNumWidth + titleMeasurements.Width + h_spacing, lowerBarTop + v_spacing, 0.95 * ww - bottomTextWidth, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
	}

	// Progress bar/Seekbar
	progressBar.setY(Math.round(lowerBarTop + titleMeasurements.Height) + scaleForDisplay(8));
	if (ww > 600) {
        gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		if (fb.PlaybackLength > 0) {
			gr.DrawString(str.length, ft_lower, col.now_playing, 0.725 * ww, lowerBarTop, 0.25 * ww, titleMeasurements.Height, StringFormat(2, 0));
			let width = gr.CalcTextWidth('  ' + str.length, ft_lower);
			gr.DrawString(str.time, ft_lower_bold, col.now_playing, 0.725 * ww, lowerBarTop + heightAdjustment, 0.25 * ww - width, titleMeasurements.Height, StringFormat(2, 0));
			width += gr.CalcTextWidth('  ' + str.time, ft_lower_bold);
			gr.DrawString(str.disc, ft_lower, col.now_playing, 0.725 * ww, lowerBarTop, 0.25 * ww - width, titleMeasurements.Height, StringFormat(2, 0));
		} else if (fb.IsPlaying) { // streaming, but still want to show time
			gr.DrawString(str.time, ft.lower_bar, col.now_playing, Math.floor(0.725 * ww), lowerBarTop, 0.25 * ww, 0.5 * geo.lower_bar_h, StringFormat(2, 0));
		} else {
			let color = pref.darkMode ? tintColor(col.bg, 20) : shadeColor(col.bg, 20);
			let offset = 0;
			if (updateAvailable && updateHyperlink) {
				offset = updateHyperlink.getWidth();
				updateHyperlink.setContainerWidth(ww);
				updateHyperlink.set_y(lowerBarTop);
				updateHyperlink.set_xOffset(-offset - Math.floor(ww*0.025));
				updateHyperlink.draw(gr, color);
				offset += scaleForDisplay(6);
			}
			gr.DrawString(str.time, ft.lower_bar, color, Math.floor(0.725 * ww) - offset, lowerBarTop, 0.25 * ww, geo.lower_bar_h, StringFormat(2, 0));
		}
	}
	if (pref.show_progress_bar) {
		progressBar.draw(gr);
	}
    gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
}

function drawCdArt(gr) {
	if (pref.display_cdart && cdart_size.y >= albumart_size.y && cdart_size.h <= albumart_size.h) {
		let drawCdProfiler = null;
		if (timings.showExtraDrawTiming) drawCdProfiler = fb.CreateProfiler('cdart');
		gr.DrawImage(rotatedCD, cdart_size.x, cdart_size.y, cdart_size.w, cdart_size.h, 0, 0, rotatedCD.Width, rotatedCD.Height, 0);
		if (timings.showExtraDrawTiming) drawCdProfiler.Print();
	}
}

function on_paint(gr) {
	let onPaintProfiler = null;
	if (timings.showDrawTiming) onPaintProfiler = fb.CreateProfiler("on_paint");
	draw_ui(gr);
	if (pref.show_volume_button) {
		volume_btn.on_paint(gr);
	}

	if (timings.showDrawTiming) {
		onPaintProfiler.Print();
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function onRatingMenu(x, y) {
	menu_down = true;

	var rating = fb.TitleFormat("$if2(%rating%,0)").Eval();

	var menu = new Menu();
	menu.addRadioItems(['No rating', '1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'], parseInt(rating), [0,1,2,3,4,5],
		(rating) => {
			if (rating === 0) {
				fb.RunContextCommand("Playback Statistics/Rating/<not set>");
			} else {
				fb.RunContextCommand("Playback Statistics/Rating/" + rating);
			}
		});

	const idx = menu.trackPopupMenu(x, y);
	menu.doCallback(idx);

	menu_down = false;
}

function onOptionsMenu(x, y) {
	menu_down = true;

	var menu = new Menu();	// helper class for creating simple menu items. See helpers.js
	menu.addToggleItem('Check for theme updates', pref, 'checkForUpdates', () => { scheduleUpdateCheck(1000) });
	menu.createRadioSubMenu('Use 4K mode', ['Auto-detect', 'Never', 'Always'], pref.use_4k, ['auto', 'never', 'always'], (mode) => {
		pref.use_4k = mode;
		on_size();
		RepaintWindow();
	});
	menu.addToggleItem('Use dark theme', pref, 'darkMode', () => {
		initColors();
		if (fb.IsPlaying) {
			albumart = null;
			loadFromCache = false;
			on_playback_new_track(fb.GetNowPlaying());
		} else {
			RepaintWindow();
		}
	});
	menu.addToggleItem('Cycle through all artwork', pref, 'aa_glob', () => {
		if (!pref.aa_glob) {
			clearTimeout(globTimer);
			globTimer = 0;
		} else {
			doRotateImage();
		}
	});
	menu.addToggleItem('Display CD art (cd.pngs)', pref, 'display_cdart', () => {
		if (fb.IsPlaying) fetchNewArtwork(fb.GetNowPlaying());
		lastLeftEdge = 0; // resize labels
		ResizeArtwork(true);
		RepaintWindow();
	});
	menu.addToggleItem('Rotate CD art on track change', pref, 'rotate_cdart', () => { RepaintWindow(); }, !pref.display_cdart);
	menu.createRadioSubMenu('CD art Rotation Amount', ['2 degrees', '3 degrees', '4 degrees', '5 degrees'], parseInt(pref.rotation_amt), [2,3,4,5], function (rot) {
		pref.rotation_amt = rot;
		CreateRotatedCDImage();
		RepaintWindow();
	});

	menu.addItem('Display CD art above cover', pref.cdart_ontop, () => {
		pref.cdart_ontop = !pref.cdart_ontop;
		RepaintWindow();
	}, !pref.display_cdart);
	menu.addItem('Draw label art on background', pref.labelArtOnBg, () => {
		pref.labelArtOnBg = !pref.labelArtOnBg;
		RepaintWindow();
	});

	menu.addSeparator();
	var menuFontMenu = new Menu('Menu font size');
	menuFontMenu.addRadioItems(['-1', '11px', '12px (default)', '13px', '14px', '16px', '+1'], pref.menu_font_size, [-1,11,12,13,14,16,999], (size) => {
		if (size === -1) {
			pref.menu_font_size--;
		} else if (size === 999) {
			pref.menu_font_size++;
		} else {
			pref.menu_font_size = size;
		}
		ft.SegoeUi = gdi.Font('Segoe Ui Semibold', scaleForDisplay(pref.menu_font_size), 0);
		createButtonImages();
		createButtonObjects(ww, wh);
		RepaintWindow();
	});
	menuFontMenu.appendTo(menu);

	var transportMenu = new Menu('Transport controls');
	transportMenu.addToggleItem('Show transport controls', pref, 'show_transport', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		RepaintWindow();
	});
	transportMenu.addToggleItem('Show transport below art', pref, 'show_transport_below', () => {
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		if (displayPlaylist) {
			playlist.on_size(ww, wh);
		}
		if (displayLibrary) {
			setLibrarySize();
		}
		RepaintWindow();
	}, !pref.show_transport);
	transportMenu.addToggleItem('Show random button', pref, 'show_random_button', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !pref.show_transport);
	transportMenu.addToggleItem('Show volume control', pref, 'show_volume_button', () => {
		createButtonObjects(ww, wh);
		RepaintWindow();
	}, !pref.show_transport);
	transportMenu.addToggleItem('Show reload button', pref, 'show_reload_button', () => { window.Reload(); }, !pref.show_transport);
	transportMenu.appendTo(menu);

	const transportSizeMenu = new Menu('Transport Button Size');
	transportSizeMenu.addRadioItems(['-2', '28px', '32px (default)', '36px', '40px', '44px', '+2'], pref.transport_buttons_size, [-1,28,32,36,40,44,999], (size) => {
		if (size === -1) {
			pref.transport_buttons_size -= 2;
		} else if (size === 999) {
			pref.transport_buttons_size += 2;
		} else {
			pref.transport_buttons_size = size;
		}
		ft.guifx = gdi.Font(fontGuiFx, scaleForDisplay(Math.floor(pref.transport_buttons_size / 2)), 0);
		createButtonImages();
		createButtonObjects(ww, wh);
		if (pref.show_transport_below) {
			ResizeArtwork(true);
		}
		RepaintWindow();
	});
	transportSizeMenu.appendTo(transportMenu);

	const transportSpacingMenu = new Menu('Transport Button Spacing');
	transportSpacingMenu.addRadioItems(['0px', '3px', '5px (default)', '8px', '15px', '20px', '+2'], pref.transport_buttons_spacing, [-1,3,5,8,15,20,999], (size) => {
		if (size === -1) {
			pref.transport_buttons_spacing -= 2;
		} else if (size === 999) {
			pref.transport_buttons_spacing += 2;
		} else {
			pref.transport_buttons_spacing = size;
		}
		createButtonImages();
		createButtonObjects(ww, wh);
		if (pref.show_transport_below) {
			ResizeArtwork(true);
		}
		RepaintWindow();
	});
	transportSpacingMenu.appendTo(transportMenu);

	menu.addToggleItem('Show timeline tooltips', pref, 'show_timeline_tooltips');
	menu.addToggleItem('Show progress bar', pref, 'show_progress_bar', () => {
		setGeometry();
		ResizeArtwork(true);
		RepaintWindow();
	});
	menu.addToggleItem('Update progress bar frequently (higher CPU)', pref, 'freq_update', () => { SetProgressBarRefresh(); }, !pref.show_progress_bar);

	menu.addSeparator();

	menu.addToggleItem('Use vinyl style numbering if available', pref, 'use_vinyl_nums', () => { RepaintWindow(); });

	menu.addSeparator();

	menu.addToggleItem('Show artist country flags', pref, 'show_flags', () => {
		loadCountryFlags();
		RepaintWindow();
	});
	menu.addToggleItem('Show release country flags', settings, 'showReleaseCountryFlag', () => {
		loadReleaseCountryFlag();
		RepaintWindow();
	});

	menu.addSeparator();

	const playlistMenu = new Menu('Playlist Settings');
	var playlistCallback = function () {
		playlist.on_size(ww, wh);
		window.Repaint();
	};
	playlistMenu.addToggleItem('Display playlist on startup', pref, 'start_Playlist');
	playlistMenu.addToggleItem('Show group header', g_properties, 'show_header', playlistCallback);
	playlistMenu.addToggleItem('Use compact group header', g_properties, 'use_compact_header', playlistCallback, !g_properties.show_header);
	playlistMenu.createRadioSubMenu('Header font size', ['-1', '14px', '15px (default)', '16px', '18px', '20px', '22px', '+1'], pref.font_size_playlist_header,
		[-1, 14, 15, 16, 18, 20, 22, 999],
		(size) => {
			if (size === -1) {
				pref.font_size_playlist_header--;
			} else if (size === 999) {
				pref.font_size_playlist_header++;
			} else {
				pref.font_size_playlist_header = size;
			}
			playlist.on_size(ww, wh);
			window.Repaint();
		});

	var rowsMenu = new Menu('Rows');
	rowsMenu.createRadioSubMenu('Row font size', ['-1', '11px', '12px (default)', '13px', '14px', '16px', '18px', '+1'], pref.font_size_playlist,
		[-1, 11, 12, 13, 14, 16, 18, 999],
		(size) => {
			if (size === -1) {
				pref.font_size_playlist--;
			} else if (size === 999) {
				pref.font_size_playlist++;
			} else {
				pref.font_size_playlist = size;
			}
			g_properties.row_h = Math.round(pref.font_size_playlist * 1.667);
			playlist.on_size(ww, wh);
			window.Repaint();
		});
	rowsMenu.addToggleItem('Alternate row color', g_properties, 'alternate_row_color', playlistCallback);
	rowsMenu.addToggleItem('Show play count', g_properties, 'show_playcount', playlistCallback, !g_component_playcount);
	rowsMenu.addToggleItem('Show queue position', g_properties, 'show_queue_position', playlistCallback);
	rowsMenu.addToggleItem('Show rating', g_properties, 'show_rating', playlistCallback);
	rowsMenu.appendTo(playlistMenu);

	playlistMenu.addToggleItem('Follow hyperlinks only if CTRL is down', pref, 'hyperlinks_ctrl');
	playlistMenu.addToggleItem('Show weblinks in context menu', pref, 'show_weblinks');
	playlistMenu.appendTo(menu);

	menu.addSeparator();

	const libraryMenu = new Menu('Library Settings');
	libraryMenu.addToggleItem('Remember library state', libraryProps, 'rememberTree');
	libraryMenu.addToggleItem('Full line clickable', libraryProps, 'fullLine');
	libraryMenu.addToggleItem('Show tooltips', libraryProps, 'tooltips', () => { setLibrarySize(); });
	libraryMenu.createRadioSubMenu('Root node type', ['Hide', '"All Music"', 'View name'], libraryProps.rootNode, [0,1,2], function (nodeIndex) {
		libraryProps.rootNode = nodeIndex;
		lib_manager.rootNodes(1);
	});
	libraryMenu.createRadioSubMenu('Node item counts', ['Hidden', '# Tracks', '# Sub-Items'], libraryProps.nodeItemCounts, [0,1,2], function (nodeIndex) {
		libraryProps.nodeItemCounts = nodeIndex;
		lib_manager.rootNodes(1);
	});
	libraryMenu.addToggleItem('Show Tracks', libraryProps, 'nodeShowTracks', () => { library_tree.collapseAll(); });
	libraryMenu.addToggleItem('Show library scrollbar', libraryProps, 'showScrollbar', () => { setLibrarySize(); });
	libraryMenu.addToggleItem('Send files to current playlist', libraryProps, 'sendToCurrent');
	libraryMenu.addToggleItem('Auto-fill playlist on selection', libraryProps, 'autoFill');
	libraryMenu.createRadioSubMenu('Double-click action', ['Expand/Collapse Folders', 'Send and Play', 'Send to Playlist'], libraryProps.doubleClickAction, [0,1,2], function(action) {
		libraryProps.doubleClickAction = action;
	});
	libraryMenu.addToggleItem('Auto collapse nodes', libraryProps, 'autoCollapse');
	libraryMenu.addItem('Reset library zoom', false, () => {
		libraryProps.filterZoom = 100;
		libraryProps.fontZoom = 100;
		libraryProps.nodeZoom = 100;
		setLibrarySize();
	});
	libraryMenu.appendTo(menu);

	menu.addSeparator();

	const debugMenu = new Menu('Debug Settings');
	debugMenu.addToggleItem('Enable debug output', settings, 'showDebugLog');
	debugMenu.addItem('Enable theme debug output', settings.showThemeLog, () => {
		settings.showThemeLog = !settings.showThemeLog;
		if (settings.showThemeLog) {
			albumart = null;
			on_playback_new_track(fb.GetNowPlaying());
		}
	});
	debugMenu.addToggleItem('Show draw timing (doesn\'t persist)', timings, 'showDrawTiming');
	debugMenu.addToggleItem('Show extra draw timing (doesn\'t persist)', timings, 'showExtraDrawTiming');
	debugMenu.addToggleItem('Show debug timing (doesn\'t persist)', timings, 'showDebugTiming');
	debugMenu.addToggleItem('Show reload button', pref, 'show_reload_button', () => { window.Reload(); });
	debugMenu.appendTo(menu);

	menu.addSeparator();

	menu.addToggleItem('Lock right click...', settings, 'locked');
	menu.addItem('Restart foobar', false, () => { fb.RunMainMenuCommand("File/Restart"); });

	var idx = menu.trackPopupMenu(x, y);
	menu.doCallback(idx);

	menu_down = false;
}

function on_mouse_leave() {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_mouse_leave();
}


// -----------------------------------------------------------------------
// CALLBACKS
// -----------------------------------------------------------------------

// custom initialisation function, called once after variable declarations
function on_init() {
	console.log("in on_init()");

	str = clearUIVariables();

	ww = window.Width;
	wh = window.Height;

	last_path = '';

	last_pb = fb.PlaybackOrder;

	if (pref.loadAsync) {
		on_size();	// needed when loading async, otherwise just needed in fb.IsPlaying conditional
	}
	setGeometry();
	progressBar = new ProgressBar(ww, wh);
	if (fb.IsPlaying && fb.GetNowPlaying()) {
		on_playback_new_track(fb.GetNowPlaying());
	}
	window.Repaint();	// needed when loading async, otherwise superfluous

	/** Workaround so we can use the Edit menu or run fb.RunMainMenuCommand("Edit/Something...")
		when the panel has focus and a dedicated playlist viewer doesn't. */
	plman.SetActivePlaylistContext(); // once on startup

	if (pref.start_Playlist) {
		displayPlaylist = false;
		setTimeout(() => {
			if (btns && btns.playlist) {
				btns.playlist.onClick();	// displays playlist
			}
		}, 30);
	}

	setTimeout(() => {
		// defer initing of library panel until everything else has loaded
		if (!libraryInitialized) {
			initLibraryPanel();
		}
	}, 10000);
}

// window size changed
function on_size() {
	ww = window.Width;
	wh = window.Height;
	console.log(`in on_size() => width: ${ww}, height: ${wh}`);

	if (ww <= 0 || wh <= 0) return;

	checkFor4k(ww, wh);

	if (!sizeInitialized) {
		createFonts();
		setGeometry();
		if (fb.IsPlaying) {
			loadCountryFlags(); // wrong size flag gets loaded on 4k systems
		}
		rescalePlaylist();
		initPlaylist();
		volume_btn = new VolumeBtn();
        sizeInitialized = true;
        if (str.timeline) {
            str.timeline.setHeight(geo.timeline_h);
        }
	}
	progressBar && progressBar.on_size(ww, wh);

	lastLeftEdge = 0;

	ResizeArtwork(true);
	createButtonImages();
	createButtonObjects(ww, wh);

	// we aren't creating these buttons anymore, but we still use these values for now. TODO: replace these
	const settingsY = btns[30].y;

	playlist_shadow = disposeImg(playlist_shadow);
	if (displayPlaylist) {
		playlist.on_size(ww, wh);
	} else if (displayLibrary) {
		initLibraryPanel();
		setLibrarySize();
	}
}

function setLibrarySize() {
	if (typeof libraryPanel !== 'undefined') {
		var x = Math.round(ww * .5);
		var y = btns[30].y + btns[30].h + scaleForDisplay(16) + 2;
		var lowerSpace = calcLowerSpace();
		var library_w = ww - x;
		var library_h = Math.max(0, wh - lowerSpace - scaleForDisplay(16) - y);

		ui.sizedNode = false;
		ui.node_sz = Math.round(16 * ui.scale);
		p.setFilterFont();	// resets filter font in case the zoom was reset
		libraryPanel.on_size(x, y, library_w, library_h);
	} else {
		// TODO: take this if/else out once this part is done
		displayLibrary = false;
	}
}

function on_playback_dynamic_info_track() {
	// how frequently does this get called?
	const metadb = fb.IsPlaying ? fb.GetNowPlaying() : null;
	on_playback_new_track(metadb);

	if (displayPlaylist) {
		playlist.on_playback_dynamic_info_track();
	}
}

// new track
function on_playback_new_track(metadb) {
	let newTrackProfiler = null;
	debugLog('in on_playback_new_track()');
	if (timings.showDebugTiming) newTrackProfiler = fb.CreateProfiler('on_playback_new_track');
	lastLeftEdge = 0;
	newTrackFetchingArtwork = true;
	themeColorSet = false;
	updateTimezoneOffset();

	isStreaming = metadb ? !metadb.RawPath.match(/^file\:\/\//) : false;
	if (!isStreaming) {
		current_path = $('%directoryname%');
	} else {
		current_path = '';
	}

	SetProgressBarRefresh();

	if (globTimer) {
		clearTimeout(globTimer);
		globTimer = 0;
	}

	str.timeline = new Timeline(geo.timeline_h);

	// Fetch new albumart
	if ((pref.aa_glob && aa_list.length != 1) || current_path != last_path || albumart == null ||
		$('$if2(%discnumber%,0)') != lastDiscNumber || $('$if2(' + tf.vinyl_side + ',ZZ)') != lastVinylSide) {
		fetchNewArtwork(metadb);
	}
	loadFromCache = true;
	CreateRotatedCDImage(); // we need to always setup the rotated image because it rotates on every track

	/* code to retrieve record label logos */
	var labelStrings = [];
	while (recordLabels.length) {
        disposeImg(recordLabels.pop());
    }
    while (recordLabelsInverted.length) {
        disposeImg(recordLabelsInverted.pop());
    }
	for (let i = 0; i < tf.labels.length; i++) {
		labelStrings.push(...getMetaValues(tf.labels[i], this.metadb));
	}
	labelStrings = [... new Set(labelStrings)];
	for (let i = 0; i < labelStrings.length; i++) {
		var addLabel = LoadLabelImage(labelStrings[i]);
		if (addLabel != null) {
            recordLabels.push(addLabel);
            try {
                recordLabelsInverted.push(addLabel.InvertColours());
            } catch (e) {
                // probably not using foo_jscript v2.3.6
            }
		}
	}

	function testArtistLogo(artistStr) {
		// see if artist logo exists at various paths
		const testBandLogoPath = (imgDir, name) => {
			if (name) {
				const logoPath = imgDir + name + '.png'
				if (IsFile(logoPath)) {
					console.log('Found band logo: ' + logoPath);
					return logoPath;
				}
			}
			return false;
		};

		return testBandLogoPath(pref.logo_hq, artistStr) || // try 800x310 white
			testBandLogoPath(pref.logo_color, artistStr); // try 800x310 color
	}

	/* code to retrieve band logo */
	let tryArtistList = [
		... getMetaValues('%album artist%').map(artist => replaceFileChars(artist)),
		replaceFileChars($('[%track artist%]')),
		... getMetaValues('%artist%').map(artist => replaceFileChars(artist))
	];
	tryArtistList = [... new Set(tryArtistList)];

	bandLogo = disposeImg(bandLogo);
    invertedBandLogo = disposeImg(invertedBandLogo);
	let path;
	tryArtistList.some(artistString => {
		return path = testArtistLogo(artistString);
	});
	if (path) {
		bandLogo = gdi.Image(path);
		try {
			invertedBandLogo = bandLogo.InvertColours();
		} catch (e) {
			invertedBandLogo = undefined;
		}
	}

	last_path = current_path; // for art caching purposes
	lastDiscNumber = $('$if2(%discnumber%,0)'); // for art caching purposes
	lastVinylSide = $('$if2(' + tf.vinyl_side + ',ZZ)');
	currentLastPlayed = $(tf.last_played);

	if (fb.GetNowPlaying()) {
		on_metadb_changed(); // refresh panel
	}

	on_playback_time();
	progressBar.progressLength = 0;

	if (displayPlaylist) {
		playlist.on_playback_new_track(metadb);
	} else if (displayLibrary) {
		library.on_playback_new_track(metadb);
	}

	// Lyrics stuff
	if (displayLyrics) { // no need to try retrieving them if we aren't going to display them now
		initLyrics();
	}
	if (timings.showDebugTiming) newTrackProfiler.Print();
}

// tag content changed
function on_metadb_changed(handle_list, fromhook) {
	console.log('on_metadb_changed()');
	if (fb.IsPlaying) {
		var nowPlayingUpdated = !handle_list; // if we don't have a handle_list we called this manually from on_playback_new_track
		var metadb = fb.GetNowPlaying();
		if (metadb && handle_list) {
			for (let i = 0; i < handle_list.Count; i++) {
				if (metadb.RawPath === handle_list[i].RawPath) {
					nowPlayingUpdated = true;
					break;
				}
			}
		}

		if (nowPlayingUpdated) {
			// the handle_list contains the currently playing song so update
			var title = $(tf.title);
			var artist = $(tf.artist);
			var original_artist = $(tf.original_artist);
			let tracknum = '';
			if (pref.use_vinyl_nums)
				tracknum = $(tf.vinyl_track);
			else
				tracknum = $(tf.tracknum);

			str.tracknum = tracknum.trim();
			str.title = title + original_artist;
			str.title_lower = '  ' + title;
			str.original_artist = original_artist;
            str.artist = artist;
			str.year = $('[$year($if3(%original release date%,%originaldate%,%date%,%fy_upload_date%))]');
			if (str.year === '0000') {
				str.year = '';
			}
            str.album = $("[%album%][ '['" + tf.album_translation + "']']");
			str.album_subtitle = $("[ '['" + tf.album_subtitle + "']']");
			var codec = $("$lower($if2(%codec%,$ext(%path%)))");
			if (codec == "dca (dts coherent acoustics)") {
				codec = "dts";
			}
			if (codec == "cue") {
				codec = $("$ext($info(referenced_file))");
			} else if (codec == "mpc") {
				codec = codec + "-" + $("$info(codec_profile)").replace("quality ", "q");
			} else if (codec == "dts" || codec == "ac3" || codec == "atsc a/52") {
				codec += $("[ $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0))] %bitrate%") + " kbps";
				codec = codec.replace("atsc a/52", "Dolby Digital");
			} else if ($("$info(encoding)") == "lossy") {
				if ($("$info(codec_profile)") == "CBR") codec = codec + "-" + $("%bitrate%") + " kbps";
				else codec = codec + "-" + $("$info(codec_profile)");
			}
			str.trackInfo = $(codec + '[ | %replaygain_album_gain%]');
			// TODO: Add LUFS option?
			// str.trackInfo += $('$if(%replaygain_track_gain%, | LUFS $puts(l,$sub(-1800,$replace(%replaygain_track_gain%,.,)))$div($get(l),100).$right($get(l),2) dB,)');

			str.disc = fb.TitleFormat(tf.disc).Eval();

			const h = Math.floor(fb.PlaybackLength / 3600);
			const m = Math.floor(fb.PlaybackLength % 3600 / 60);
			const s = Math.floor(fb.PlaybackLength % 60);
			str.length = (h > 0 ? h + ":" + (m < 10 ? "0" : '') + m : m) + ":" + (s < 10 ? "0" : '') + s;

			str.grid = [];
			for (let k = 0; k < metadataGrid.length; k++) {
				let val = $(metadataGrid[k].val);
				if (val && metadataGrid[k].label) {
					if (metadataGrid[k].age) {
						val = $('$date(' + val + ')'); // never show time
						var age = calcAgeDateString(val);
						if (age) {
							val += ' (' + age + ')';
						}
					}
					str.grid.push({
						age: metadataGrid[k].age,
						label: metadataGrid[k].label,
						val: val,
					});
				}
			}

			var lastfm_count = $('%lastfm_play_count%');
			if (lastfm_count !== '0' && lastfm_count !== '?') {
				playCountVerifiedByLastFm = true;
			} else {
				playCountVerifiedByLastFm = false;
			}

			if (str.timeline) {	// TODO: figure out why this is null for foo_input_spotify
				str.timeline.setColors(col.tl_added, col.tl_played, col.tl_unplayed);
			}
			const lastPlayed = $(tf.last_played);
			calcDateRatios($date(currentLastPlayed) !== $date(lastPlayed), currentLastPlayed); // last_played has probably changed and we want to update the date bar
			if (lastPlayed.length) {
				const today = dateToYMD(new Date());
				if (!currentLastPlayed.length || $date(lastPlayed) !== today) {
					currentLastPlayed = lastPlayed;
				}
			}

			const lp = str.grid.find(value => value.label === 'Last Played');
			if (lp) {
				lp.val = $date(currentLastPlayed);
				if (calcAgeDateString(lp.val)) {
					lp.val += ' (' + calcAgeDateString(lp.val) + ')';
				}
			}

			if (pref.show_flags) {
				loadCountryFlags();
			}
			if (settings.showReleaseCountryFlag) {
				loadReleaseCountryFlag();
			}
		}
	}
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_metadb_changed(handle_list, fromhook);
	}
	RepaintWindow();
}


// User activity

function on_playback_order_changed(this_pb) {
	// Repaint playback order
	if (this_pb != last_pb) {
		debugLog("Repainting on_playback_order_changed");
		window.RepaintRect(0.5 * ww, wh - geo.lower_bar_h, 0.5 * ww, geo.lower_bar_h);
	}
	last_pb = this_pb;
}

function on_playback_seek() {
	progressBar.progressMoved = true;
	if (displayLyrics) {
		gLyrics.seek();
	}
	on_playback_time();
	refresh_seekbar();
}

function on_mouse_lbtn_down(x, y, m) {
	if (progressBar.mouseInThis(x, y)) {
		progressBar.on_mouse_lbtn_down(x, y);
	} else if (!volume_btn.on_mouse_lbtn_down(x, y, m)) {
		// not handled by volume_btn

		// clicking on progress bar
		if (pref.show_progress_bar && y >= wh - 0.5 * geo.lower_bar_h && y <= wh - 0.5 * geo.lower_bar_h + geo.prog_bar_h && x >= 0.025 * ww && x < 0.975 * ww) {
			var v = (x - 0.025 * ww) / (0.95 * ww);
			v = (v < 0) ? 0 : (v < 1) ? v : 1;
			if (fb.PlaybackTime != v * fb.PlaybackLength) fb.PlaybackTime = v * fb.PlaybackLength;
			window.RepaintRect(0, wh - geo.lower_bar_h, ww, geo.lower_bar_h);
		}

		buttonEventHandler(x, y, m);
		if (updateHyperlink && !fb.IsPlaying && updateHyperlink.trace(x, y)) {
			updateHyperlink.click();
		}

		if (displayPlaylist) {// && playlist.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			playlist.on_mouse_lbtn_down(x, y, m);
		} else if (displayLibrary && library.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			library.on_mouse_lbtn_down(x, y, m);
		}
	}
}

function on_mouse_lbtn_up(x, y, m) {
	progressBar.on_mouse_lbtn_up(x, y);

	if (!volume_btn.on_mouse_lbtn_up(x, y, m)) {
		// not handled by volume_btn
		if (displayPlaylist && playlist.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());

			playlist.on_mouse_lbtn_up(x, y, m);

			qwr_utils.EnableSizing(m);
		} else if (displayLibrary && library.mouse_in_this(x, y)) {
			trace_call && console.log(qwr_utils.function_name());
			library.on_mouse_lbtn_up(x, y, m);
		} else {

			if (just_dblclicked) {
				// You just did a double-click, so do nothing
				just_dblclicked = false;
			} else {
				if ((albumart && albumart_size.x <= x && albumart_size.y <= y && albumart_size.x + albumart_size.w >= x && albumart_size.y + albumart_size.h >= y) ||
					(cdart && !albumart && cdart_size.x <= x && cdart_size.y <= y && cdart_size.x + cdart_size.w >= x && cdart_size.y + cdart_size.h >= y) ||
					pauseBtn.mouseInThis(x, y)) {
					fb.PlayOrPause();
				}
			}
		}
		on_mouse_move(x, y);
		buttonEventHandler(x, y, m);
	}
}

function on_mouse_lbtn_dblclk(x, y, m) {
	if (displayPlaylist && playlist.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	} else if (displayLibrary && library.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_mouse_lbtn_dblclk(x, y, m);
	} else {
		// re-initialize the panel
		just_dblclicked = true;
		if (fb.IsPlaying) {
			albumart = null;
			art_cache.clear();
			on_playback_new_track(fb.GetNowPlaying());
		}
		buttonEventHandler(x, y, m);
	}
}

function on_mouse_rbtn_down(x, y, m) {
	if (displayPlaylist && playlist.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_mouse_rbtn_down(x, y, m);
	} else if (displayLibrary) {
		// trace_call && console.log(qwr_utils.function_name());
		// library.on_mouse_rbtn_down(x, y, m);
	}
}

function on_mouse_rbtn_up(x, y, m) {
	if (displayPlaylist && playlist.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		return playlist.on_mouse_rbtn_up(x, y, m);
	} else if (displayLibrary && library.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		return library.on_mouse_rbtn_up(x, y, m);
	} else
		return settings.locked;
}

function on_mouse_move(x, y, m) {
	if (x != state.mouse_x || y != state.mouse_y) {
		window.SetCursor(32512); // arrow
		progressBar.on_mouse_move(x, y);
		state.mouse_x = x;
		state.mouse_y = y;

		if (settings.hideCursor) {
			clearTimeout(hideCursorTimer);
			hideCursorTimer = setTimeout(() => {
				// if there's a menu id (i.e. a menu is down) we don't want the cursor to ever disappear
				if (!menu_down) {
					window.SetCursor(-1); // hide cursor
				}
			}, 10000);
		}

		buttonEventHandler(x, y, m);
		if (updateHyperlink) Hyperlinks_on_mouse_move(updateHyperlink, x, y);

		if (displayPlaylist && playlist.mouse_in_this(x, y)) {
			trace_call && trace_on_move && console.log(qwr_utils.function_name());

			if (mouse_move_suppress.is_supressed(x, y, m)) {
				return;
			}

			qwr_utils.DisableSizing(m);
			playlist.on_mouse_move(x, y, m);
		} else if (displayLibrary && library.mouse_in_this(x, y)) {
			library.on_mouse_move(x, y, m);
        } else if (str.timeline && str.timeline.mouseInThis(x, y)) {
			str.timeline.on_mouse_move(x, y, m);
		}
		if (pref.show_volume_button && volume_btn) {
			volume_btn.on_mouse_move(x, y, m);
		}
	}
}

function on_mouse_wheel(delta) {
	if (pref.show_volume_button) {
		if (volume_btn.on_mouse_wheel(delta)) return;
	}
	if (state.mouse_y > wh - geo.lower_bar_h) {
		fb.PlaybackTime = fb.PlaybackTime - delta * pref.mouse_wheel_seek_speed;
		refresh_seekbar();
		return;
	}
	if (displayLyrics && state.mouse_x > albumart_size.x && state.mouse_x <= albumart_size.x + albumart_size.w &&
		                 state.mouse_y > albumart_size.y && state.mouse_y <= albumart_size.y + albumart_size.h) {
		gLyrics.on_mouse_wheel(delta);
	} else if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_mouse_wheel(delta);
	} else if (displayLibrary) {
		// trace_call && console.log(qwr_utils.function_name());
		library.on_mouse_wheel(delta);
	}
}
// =================================================== //

function on_mouse_leave() {

	if (pref.show_volume_button) {
		volume_btn.on_mouse_leave();
	}
	if (displayPlaylist) {
		playlist.on_mouse_leave();
	} else if (displayLibrary) {
		library.on_mouse_leave();
	}
}

function on_playlists_changed() {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlists_changed();
	}
}

function on_playlist_switch() {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_switch();
	}
}

function on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	}
}

function on_playlist_items_added(playlistIndex) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_added(playlistIndex);
	}
}

function on_playlist_items_reordered(playlistIndex) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_reordered(playlistIndex);
	}
}

function on_playlist_items_removed(playlistIndex) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_removed(playlistIndex);
	}
}

function on_playlist_items_selection_change() {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_playlist_items_selection_change();
	}
}

function on_library_items_added(handle_list) {
	if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_library_items_added(handle_list);
	}
}

function on_library_items_removed(handle_list) {
	if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_library_items_removed(handle_list);
	}
}

function on_library_items_changed(handle_list) {
	if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_library_items_changed(handle_list);
	}
}

function on_item_focus_change(playlist_arg, from, to) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_item_focus_change(playlist_arg, from, to);
	} else if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_item_focus_change();
	}
}

function on_key_down(vkey) {

	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());

		if (key_down_suppress.is_supressed(vkey)) {
			return;
		}

		playlist.on_key_down(vkey);
	} else if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_key_down(vkey);
	}

	switch (vkey) {
		case 0x6B: // VK_ADD ??
		case 0x6D: // VK_SUBTRACT ??
			if (CtrlKeyPressed && ShiftKeyPressed) {
				var action = vkey === 0x6B ? '+' : '-';
				if (fb.IsPlaying) {
					var metadb = fb.GetNowPlaying();
					fb.RunContextCommandWithMetadb('Playback Statistics/Rating/' + action, metadb);
				} else if (!metadb && displayPlaylist) {
					var metadbList = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
					if (metadbList.Count === 1) {
						fb.RunContextCommandWithMetadb('Playback Statistics/Rating/' + action, metadbList[0]);
					} else {
						console.log('Won\'t change rating with more than one selected item');
					}
				}
			}
			break;
	}
}
// =================================================== //


function on_char(code) {
	if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_char(code);
	}
}

function on_key_up(vkey) {
	if (displayLibrary) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_key_up(vkey);
	}
}

function on_playback_queue_changed(origin) {
	trace_call && console.log(qwr_utils.function_name());
	playlist.on_playback_queue_changed(origin);
}


function on_playback_pause(state) {
	refreshPlayButton();
	if (state) { // pausing
		if (progressTimer) clearInterval(progressTimer);
		progressTimer = 0;
		window.RepaintRect(0.015 * ww, 0.12 * wh, Math.max(albumart_size.x - 0.015 * ww, 0.015 * ww), wh - geo.lower_bar_h - 0.12 * wh);
	} else { // unpausing
		if (progressTimer > 0) clearInterval(progressTimer); // clear to avoid multiple progressTimers which can happen depending on the playback state when theme is loaded
		debugLog("on_playback_pause: creating refresh_seekbar() interval with delay = " + t_interval);
		progressTimer = setInterval(function () {
			refresh_seekbar();
		}, t_interval);
	}

	pauseBtn.repaint();
	if (albumart && displayLyrics) { // if we are displaying lyrics we need to refresh all the lyrics to avoid tearing at the edges of the pause button
		gLyrics.on_playback_pause(state);
	}

	if (displayPlaylist) {
		playlist.on_playback_pause(state);
	}
}

function on_playback_stop(reason) {
	if (reason !== 2) { // 2 = starting_another
		// clear all variables and repaint
		str = clearUIVariables()
		debugLog("Repainting on_playback_stop");
		RepaintWindow();
		last_path = '';
		lastDiscNumber = '0';
		while (recordLabels.length) {
			disposeImg(recordLabels.pop());
        }
        while (recordLabelsInverted.length) {
            disposeImg(recordLabelsInverted.pop());
		}
		refreshPlayButton();
		loadFromCache = false;
	}
	progressTimer && clearInterval(progressTimer);
	if (globTimer)
		clearTimeout(globTimer);
	if (albumart && ((pref.aa_glob && aa_list.length != 1) || last_path == '')) {
		debugLog("disposing artwork");
		albumart = null;
		albumart_scaled = disposeImg(albumart_scaled);
	}
    bandLogo = disposeImg(bandLogo);
    invertedBandLogo = disposeImg(invertedBandLogo);
	if (displayLyrics) {
		gLyrics.on_playback_stop(reason);
	}

	while (flagImgs.length > 0)
		disposeImg(flagImgs.pop());
	rotatedCD = disposeImg(rotatedCD);
	globTimer = 0;

	if (reason === 0) {
		// Stop
		cdart = disposeCDImg(cdart);
		window.Repaint();
	}
	if (displayPlaylist) {
		playlist.on_playback_stop(reason);
	}
}

function on_playback_starting(cmd, is_paused) {
	if (settings.hideCursor) {
		window.SetCursor(-1); // hide cursor
	}
	refreshPlayButton();
}

function on_drag_enter(action, x, y, mask) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_drag_enter(action, x, y, mask);
	}
}

function on_drag_leave() {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_drag_leave();
	}
}

function on_drag_drop(action, x, y, mask) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_drag_drop(action, x, y, mask);
	}
}

function on_focus(is_focused) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_focus(is_focused);
	}
	if (is_focused) {
		plman.SetActivePlaylistContext(); // When the panel gets focus but not on every click.
	} else {
		clearTimeout(hideCursorTimer); // not sure this is required, but I think the mouse was occasionally disappearing
	}
}

function on_notify_data(name, info) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_notify_data(name, info);
	}
}

function on_volume_change(val) {
    trace_call && console.log(qwr_utils.function_name());
    volume_btn.on_volume_change(val);
}

var debounced_init_playlist = _.debounce(function (playlistIndex) {
	trace_call && console.log('debounced_init_playlist');
	playlist.on_playlist_items_added(playlistIndex);
}, 0, {
	leading: false,
	trailing: true
});

// =================================================== //

function clearUIVariables() {
	return {
		artist: '',
		tracknum: $(settings.stoppedString1, undefined, true),
		title_lower: '  ' + $(settings.stoppedString2, undefined, true),
		year: '',
		grid: [],
		time: stoppedTime
	}
}

// album art retrieved from GetAlbumArtAsync
function on_get_album_art_done(metadb, art_id, image, image_path) {
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_get_album_art_done(metadb, art_id, image, image_path);
	} else if (displayLibrary) {
		// trace_call && console.log(qwr_utils.function_name());
		// library.on_get_album_art_done(metadb, art_id, image, image_path);
	}
}

function on_script_unload() {
	console.log('Unloading Script');
	// it appears we don't need to dispose the images which we loaded using gdi.Image in their declaration for some reason. Attempting to dispose them causes a script error.
}

// Timed events

function on_playback_time() {
	// Refresh playback time
	str.time = $('%playback_time%');
}

function refresh_seekbar() {
	window.RepaintRect(0.025 * ww, wh - geo.lower_bar_h, 0.95 * ww, geo.lower_bar_h);
}

// TIMER Callback functions
function doRotateImage() {
	debugLog("Repainting in doRotateImate: " + albumArtIndex);
	albumArtIndex = (albumArtIndex + 1) % aa_list.length;
	glob_image(albumArtIndex, true);
	lastLeftEdge = 0;
	RepaintWindow();
	globTimer = setTimeout(() => {
		doRotateImage();
	}, pref.art_rotate_delay * 1000);
}

function createShadowRect(width, height) {
	var shadow = gdi.CreateImage(width + 2 * geo.aa_shadow, height + 2 * geo.aa_shadow);
	var shimg = shadow.GetGraphics();
	shimg.FillRoundRect(geo.aa_shadow, geo.aa_shadow, width, height, 0.5 * geo.aa_shadow, 0.5 * geo.aa_shadow, col.shadow);
	shadow.ReleaseGraphics(shimg);
	shadow.StackBlur(geo.aa_shadow);

	return shadow;
}

// HELPER FUNCTIONS
function createDropShadow() {
	let shadowProfiler = null;
	if (timings.showDebugTiming) shadowProfiler = fb.CreateProfiler("createDropShadow");
	if ((albumart && albumart_size.w > 0) || (cdart && pref.display_cdart && cdart_size.w > 0)) {
		disposeImg(shadow_image);
		if (cdart && !displayPlaylist && !displayLibrary && pref.display_cdart)
			shadow_image = gdi.CreateImage(cdart_size.x + cdart_size.w + 2 * geo.aa_shadow, cdart_size.h + 4 + 2 * geo.aa_shadow);
		else
			shadow_image = gdi.CreateImage(albumart_size.x + albumart_size.w + 2 * geo.aa_shadow, albumart_size.h + 2 * geo.aa_shadow);
		if (shadow_image) {
			const shimg = shadow_image.GetGraphics();
			if (albumart) {
				shimg.FillRoundRect(geo.aa_shadow, geo.aa_shadow, albumart_size.x + albumart_size.w, albumart_size.h,
					0.5 * geo.aa_shadow, 0.5 * geo.aa_shadow, col.shadow);
			}

			if (cdart && pref.display_cdart && !displayPlaylist && !displayLibrary) {
				var offset = cdart_size.w * 0.40; // don't change this value
				var xVal = cdart_size.x;
				var shadowOffset = geo.aa_shadow * 2;
				shimg.DrawEllipse(xVal + shadowOffset, shadowOffset + 1, cdart_size.w - shadowOffset, cdart_size.w - shadowOffset, geo.aa_shadow, col.shadow); // outer shadow
				shimg.DrawEllipse(xVal + geo.aa_shadow + offset - 2, offset + geo.aa_shadow + 1, cdart_size.w - offset * 2, cdart_size.h - offset * 2, 60, col.shadow); // inner shadow
			}
			shadow_image.ReleaseGraphics(shimg);
			shadow_image.StackBlur(geo.aa_shadow);
		}
	}

	if (timings.showDebugTiming) shadowProfiler.Print();
}

function SetProgressBarRefresh() {
	debugLog("SetProgressBarRefresh()");
	if (fb.PlaybackLength > 0) {
		if (pref.freq_update) {
			t_interval = Math.abs(Math.ceil(1000 / ((0.95 * ww) / fb.PlaybackLength))); // we want to update the progress bar for every pixel so divide total time by number of pixels in progress bar
			while (t_interval > 500) // we want even multiples of the base t_interval, so that the progress bar always updates as smoothly as possible
				t_interval = Math.floor(t_interval / 2);
			while (t_interval < 25)
				t_interval *= 2;
		} else {
			t_interval = 333; // for slow computers, only update 3x a second
		}

		if (timings.showDebugTiming)
			console.log("Progress bar will update every " + t_interval + "ms or " + 1000 / t_interval + " times per second.");

		progressTimer && clearInterval(progressTimer);
		progressTimer = null;
		if (!fb.IsPaused) { // only create progressTimer if actually playing
			progressTimer = setInterval(() => {
				refresh_seekbar();
			}, t_interval);
		}
	}
}

function parseJson(json, label, log) {
	var parsed = [];
	try {
		if (log) {
			console.log(label + json);
		}
		parsed = JSON.parse(json);
	} catch (e) {
		console.log('<<< ERROR IN parseJson >>>');
		console.log(json);
	}
	return parsed;
}

var lfmPlayedTimesJsonLast = '';
var playedTimesJsonLast = '';

function calcDateRatios(dontUpdateLastPlayed, currentLastPlayed) {
    var newDate = new Date();
	dontUpdateLastPlayed = dontUpdateLastPlayed || false;

	playedTimesRatios = [];
	var added = toTime($('$if2(%added_enhanced%,%added%)'));
    var first_played = toTime($('$if2(%first_played_enhanced%,%first_played%)'));
    let last_played = toTime($('$if2(%last_played_enhanced%,%last_played%)'));
	var today = dateToYMD(newDate);
	if (dontUpdateLastPlayed && $date(last_played) === today) {
		last_played = toTime(currentLastPlayed);
	}

	var lfmPlayedTimes = [];
	var playedTimes = [];
	if (componentEnhancedPlaycount) {
		const playedTimesJson = $('[%played_times_js%]', fb.GetNowPlaying());
		const lastfmJson = $('[%lastfm_played_times_js%]', fb.GetNowPlaying());
		var log = true;
		if (playedTimesJson == playedTimesJsonLast && lastfmJson == lfmPlayedTimesJsonLast) {
			log = false;    // cut down on spam
		}
		lfmPlayedTimesJsonLast = lastfmJson;
		playedTimesJsonLast = playedTimesJson;
		lfmPlayedTimes = parseJson(lastfmJson, 'lastfm: ', log);
		playedTimes = parseJson(playedTimesJson, 'foobar: ', log);
	} else {
		playedTimes.push(first_played);
		playedTimes.push(last_played);
	}

	if (added && first_played) {
		const age = calcAge(added);

		tl_firstPlayedRatio = calcAgeRatio(first_played, age);
        tl_lastPlayedRatio = calcAgeRatio(last_played, age);
		if (tl_lastPlayedRatio < tl_firstPlayedRatio) {
			// due to daylight savings time, if there's a single play before the time changed lastPlayed could be < firstPlayed
			tl_lastPlayedRatio = tl_firstPlayedRatio;
		}

		if (playedTimes.length) {
			for (let i = 0; i < playedTimes.length; i++) {
				var ratio = calcAgeRatio(playedTimes[i], age);
				playedTimesRatios.push(ratio);
            }
		} else {
			playedTimesRatios = [tl_firstPlayedRatio, tl_lastPlayedRatio];
			playedTimes = [first_played, last_played];
		}

		var j = 0;
		var tempPlayedTimesRatios = playedTimesRatios.slice();
		tempPlayedTimesRatios.push(1.0001); // pick up every last.fm time after last_played fb knows about
		for (let i = 0; i < tempPlayedTimesRatios.length; i++) {
			while (j < lfmPlayedTimes.length &&
				(ratio = calcAgeRatio(lfmPlayedTimes[j], age)) < tempPlayedTimesRatios[i]) {
				playedTimesRatios.push(ratio);
				playedTimes.push(lfmPlayedTimes[j]);
				j++;
			}
			if (ratio === tempPlayedTimesRatios[i]) { // skip one instance
				// console.log('skipped -->', ratio);
				j++;
			}
		}
		playedTimesRatios.sort();
		playedTimes.sort();

		tl_firstPlayedRatio = playedTimesRatios[0];
		tl_lastPlayedRatio = playedTimesRatios[Math.max(0, playedTimesRatios.length - (dontUpdateLastPlayed ? 2 : 1))];
	} else {
		tl_firstPlayedRatio = 0.33;
		tl_lastPlayedRatio = 0.66;
	}
	str.timeline.setPlayTimes(tl_firstPlayedRatio, tl_lastPlayedRatio, playedTimesRatios, playedTimes);
}

function glob_image(index, loadFromCache) {
	var temp_albumart;
	if (loadFromCache) {
		temp_albumart = art_cache.getImage(aa_list[index]);
	}
	if (temp_albumart) {
		albumart = temp_albumart;
		if (index === 0 && newTrackFetchingArtwork) {
			newTrackFetchingArtwork = false;
			getThemeColors(albumart);
		}
	} else {
		gdi.LoadImageAsyncV2(window.ID, aa_list[index]).then(coverImage => {
			albumart = art_cache.encache(coverImage, album_art_path);
			if (retrieveThemeColorsWhenLoaded && newTrackFetchingArtwork) {
				getThemeColors(albumart);
				retrieveThemeColorsWhenLoaded = false;
				newTrackFetchingArtwork = false;
			}
			ResizeArtwork(true);
			cdart && CreateRotatedCDImage();
			lastLeftEdge = 0; // recalc label location
			RepaintWindow();
		});
		album_art_path = aa_list[index];
		if (index === 0) {
			retrieveThemeColorsWhenLoaded = true;
		}
	}
	ResizeArtwork(false); // recalculate image positions
	if (cdart) {
		CreateRotatedCDImage();
	}
}

function disposeImg(oldImage) {
	oldImage = null;
	return null;
}

function disposeCDImg(cdImage) {
	cdart_size = new ImageSize(0, 0, 0, 0);
	cdImage = null;
	return null;
}

function CreateRotatedCDImage() {
	rotatedCD = disposeImg(rotatedCD);
	if (pref.display_cdart) { // drawing cdArt rotated is slow, so first draw it rotated into the rotatedCD image, and then draw rotatedCD image unrotated in on_paint
        if (cdart && cdart_size.w > 0) { // cdart must be square so just use cdart_size.w (width)
			rotatedCD = gdi.CreateImage(cdart_size.w, cdart_size.w);
			const rotCDimg = rotatedCD.GetGraphics();
			let trackNum = parseInt(fb.TitleFormat('$num($if(' + tf.vinyl_tracknum + ',$sub($mul(' + tf.vinyl_tracknum + ',2),1),$if2(%tracknumber%,1)),1)').Eval()) - 1;
			if (!pref.rotate_cdart || trackNum != trackNum) trackNum = 0; // avoid NaN issues when changing tracks rapidly
			rotCDimg.DrawImage(cdart, 0, 0, cdart_size.w, cdart_size.h, 0, 0, cdart.Width, cdart.Height, trackNum * pref.rotation_amt, 255);
			rotatedCD.ReleaseGraphics(rotCDimg);
		}
	}
}

function calcLowerSpace() {
	return pref.show_transport_below ? geo.lower_bar_h + scaleForDisplay(pref.transport_buttons_size + 10) : geo.lower_bar_h + scaleForDisplay(16);
}

function ResizeArtwork(resetCDPosition) {
	debugLog('Resizing artwork');
	var hasArtwork = false;
	var lowerSpace = calcLowerSpace();
	if (albumart && albumart.Width && albumart.Height) {
		// Size for big albumart
		let xCenter = 0;
		var album_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.47 * ww : 0.75 * ww) / albumart.Width,
								   (wh - geo.top_art_spacing - lowerSpace - scaleForDisplay(16)) / albumart.Height);
		if (displayPlaylist || displayLibrary) {
			xCenter = 0.25 * ww;
		} else if (ww / wh < 1.40) { // when using a roughly 4:3 display the album art crowds, so move it slightly off center
			xCenter = 0.56 * ww; // TODO: check if this is still needed?
		} else {
			xCenter = 0.5 * ww;
			art_off_center = false;
			if (album_scale == 0.75 * ww / albumart.Width) {
				xCenter += 0.1 * ww;
				art_off_center = true; // TODO: We should probably suppress labels in this case
			}
		}
		albumart_size.w = Math.floor(albumart.Width * album_scale); // width
		albumart_size.h = Math.floor(albumart.Height * album_scale); // height
		albumart_size.x = Math.floor(xCenter - 0.5 * albumart_size.w); // left
		if (album_scale !== (wh - geo.top_art_spacing - lowerSpace - 16) / albumart.Height) {
			// restricted by width
			var y = geo.top_art_spacing + Math.floor(((wh - geo.top_art_spacing - lowerSpace - scaleForDisplay(16)) / 2) - albumart_size.h / 2);
			albumart_size.y = Math.min(y, scaleForDisplay(150) + 10);	// 150 or 300 + 10? Not sure where 160 comes from
		} else {
			albumart_size.y = geo.top_art_spacing; // height of menu bar + spacing + height of Artist text (32+32+32)	// top
		}
		if (btns.playlist && albumart_size.x + albumart_size.w > btns.playlist.x - 50) {
			albumart_size.y += 16 - pref.show_transport * 6;
		}

		if (albumart_scaled) {
			albumart_scaled = null;
		}
		albumart_scaled = albumart.Resize(albumart_size.w, albumart_size.h);
		pauseBtn.setCoords(albumart_size.x + albumart_size.w / 2, albumart_size.y + albumart_size.h / 2);
		hasArtwork = true;
	} else {
		albumart_size = new ImageSize(0, 0, 0, 0);
	}
	if (cdart) {
		if (hasArtwork) {
			if (resetCDPosition) {
				if (ww - (albumart_size.x + albumart_size.w) < albumart_size.h * pref.cdart_amount + 5)
					cdart_size.x = Math.floor(0.99 * ww - albumart_size.h);
				else
					cdart_size.x = Math.floor(albumart_size.x + albumart_size.w - (albumart_size.h - 4) * (1 - pref.cdart_amount));
				cdart_size.y = albumart_size.y + 2;
				cdart_size.w = albumart_size.h - 4; // cdart must be square so use the height of album art for width of cdart
				cdart_size.h = cdart_size.w;
			} else { // when CDArt moves because folder images are different sizes we want to push it outwards, but not move it back in so it jumps around less
				cdart_size.x = Math.max(cdart_size.x, Math.floor(Math.min(0.99 * ww - albumart_size.h, albumart_size.x + albumart_size.w - (albumart_size.h - 4) * (1 - pref.cdart_amount))));
				cdart_size.y = cdart_size.y > 0 ? Math.min(cdart_size.y, albumart_size.y + 2) : albumart_size.y + 2;
				cdart_size.w = Math.max(cdart_size.w, albumart_size.h - 4);
				cdart_size.h = cdart_size.w;
				if (cdart_size.x + cdart_size.w > ww) {
					cdart_size.x = ww - cdart_size.w - scaleForDisplay(15);
				}
			}
			// console.log(cdart_size.x, cdart_size.y, cdart_size.w, cdart_size.h);
		} else {
			// no album art so we need to calc size of disc
			const cd_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.47 * ww : 0.75 * ww) / cdart.Width, (wh - geo.top_art_spacing - lowerSpace - scaleForDisplay(16)) / cdart.Height);
			let xCenter = 0;
			if (displayPlaylist || displayLibrary) {
				xCenter = 0.25 * ww;
			} else if (ww / wh < 1.40) { // when using a roughly 4:3 display the album art crowds, so move it slightly off center
				xCenter = 0.56 * ww; // TODO: check if this is still needed?
			} else {
				xCenter = 0.5 * ww;
				art_off_center = false;
				if (cd_scale == 0.75 * ww / cdart.Width) {
					xCenter += 0.1 * ww;
					art_off_center = true; // TODO: We should probably suppress labels in this case
				}
			}
			// need to -4 from height and add 2 to y to avoid skipping cdArt drawing - not sure this is needed
			cdart_size.w = Math.floor(cdart.Width * cd_scale) - 4; // width
			cdart_size.h = cdart_size.w; // height
			cdart_size.x = Math.floor(xCenter - 0.5 * cdart_size.w); // left
			if (cd_scale !== (wh - geo.top_art_spacing - lowerSpace - scaleForDisplay(16)) / cdart.Height) {
				// restricted by width
				var y = geo.top_art_spacing + Math.floor(((wh - geo.top_art_spacing - lowerSpace - scaleForDisplay(16)) / 2) - cdart_size.h / 2);
				cdart_size.y = Math.min(y, 160);
			} else {
				cdart_size.y = geo.top_art_spacing + 2; // top
			}
			pauseBtn.setCoords(cdart_size.x + cdart_size.w / 2, cdart_size.y + cdart_size.h / 2);
			hasArtwork = true;
		}
	} else {
		cdart_size = new ImageSize(0, 0, 0, 0);
	}
	if (hasArtwork) {
		if (gLyrics) {
			gLyrics.on_size(albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h);
		}
		if (!pref.darkMode) {
			createDropShadow();
		}
	} else {
		if (displayLibrary || displayPlaylist) {
			pauseBtn.setCoords(ww * (0.33 + .167 / 2), wh / 2);
		} else {
			pauseBtn.setCoords(ww / 2, wh / 2);
		}
	}
}

function loadFlagImage(country) {
	const countryName = convertIsoCountryCodeToFull(country) || country;	// in case we have a 2-digit country code
	const path = $(pref.flags_base) + (is_4k ? '64\\' : '32\\') + countryName.trim().replace(/ /g, '-') + '.png';
	return gdi.Image(path);
}

function loadCountryFlags() {
	while (flagImgs.length) {
		disposeImg(flagImgs.pop());
	}
	getMetaValues(tf.artist_country).forEach(country => {
		const flagImage = loadFlagImage(country);
		flagImage && flagImgs.push(flagImage);
	});
}

function loadReleaseCountryFlag() {
	if (releaseFlagImg) {
		disposeImg(releaseFlagImg);
	}
	releaseFlagImg = loadFlagImage($(tf.releaseCountry));
}

function replaceFileChars(s) {
	return s.replace(/:/g, '_')
		.replace(/\\/g, '-')
		.replace(/\//g, '-')
		.replace(/\?/g, '')
		.replace(/</g, '')
		.replace(/>/g, '')
		.replace(/\*/g, '')
		.replace(/"/g, '\'')
		.replace(/\|/g, '-');
}

function LoadLabelImage(publisherString) {
	let recordLabel = null;
	const d = new Date();
	let labelStr = replaceFileChars(publisherString);
	if (labelStr) {
		/* First check for record label folder */
		const lastSrchYear = d.getFullYear();
		let dir = pref.label_base; // also used below
		if (IsFolder(dir + labelStr) ||
			IsFolder(dir + (labelStr = labelStr.replace(/ Records$/, '')
                    .replace(/ Recordings$/, '')
                    .replace(/ Music$/, '')
                    .replace(/\.$/, '')))) {
			let year = parseInt($('$year(%date%)'));
			for (; year <= lastSrchYear; year++) {
				const yearFolder = dir + labelStr + '\\' + year;
				if (IsFolder(yearFolder)) {
					console.log('Found folder for ' + labelStr + ' for year ' + year + '.');
					dir += labelStr + '\\' + year + '\\';
					break;
				}
			}
			if (year > lastSrchYear) {
				dir += labelStr + '\\'; /* we didn't find a year folder so use the "default" logo in the root */
			}
		}
		/* actually load the label from either the directory we found above, or the base record label folder */
		labelStr = replaceFileChars(publisherString); // we need to start over with the original string when searching for the file, just to be safe
		let label = dir + labelStr + '.png';
		if (IsFile(label)) {
			recordLabel = gdi.Image(label);
			console.log('Found Record label:', label, !recordLabel ? '<COULD NOT LOAD>' : '');
		} else {
			labelStr = labelStr.replace(/ Records$/, '').replace(/ Recordings$/, '').replace(/ Music$/, '');
			label = dir + labelStr + '.png';
			if (IsFile(label)) {
				recordLabel = gdi.Image(label);
			} else {
				label = dir + labelStr + ' Records.png';
				if (IsFile(label)) {
					recordLabel = gdi.Image(label);
				}
			}
		}
	}
	return recordLabel;
}

function fetchNewArtwork(metadb) {
	let fetchArtworkProfiler = null;
	if (timings.showDebugTiming) fetchArtworkProfiler = fb.CreateProfiler('fetchNewArtwork');
	console.log('Fetching new art'); // can remove this soon
	aa_list = [];
	var disc_art_exists = true;

	if (pref.display_cdart && !isStreaming) { // we must attempt to load CD/vinyl art first so that the shadow is drawn correctly
		cdartPath = $(pref.vinylside_path); // try vinyl%vinyl disc%.png first
		if (!IsFile(cdartPath)) {
			cdartPath = $(pref.vinyl_path); // try vinyl.png
			if (!IsFile(cdartPath)) {
				cdartPath = $(pref.cdartdisc_path); // try cd%discnumber%.png
				if (!IsFile(cdartPath)) {
					cdartPath = $(pref.cdart_path); // cd%discnumber%.png didn't exist so try cd.png.
					if (!IsFile(cdartPath)) {
						disc_art_exists = false; // didn't find anything
					}
				}
			}
		}
		if (disc_art_exists) {
			let temp_cdart;
			if (loadFromCache) {
				temp_cdart = art_cache.getImage(cdartPath);
			}
			if (temp_cdart) {
				disposeCDImg(cdart);
				cdart = temp_cdart;
				ResizeArtwork(true);
				CreateRotatedCDImage();
			} else {
				gdi.LoadImageAsyncV2(window.ID, cdartPath).then(cdImage => {
					disposeCDImg(cdart); // delay disposal so we don't get flashing
					cdart = art_cache.encache(cdImage, cdartPath);
					ResizeArtwork(true);
					CreateRotatedCDImage();
					lastLeftEdge = 0; // recalc label location
					RepaintWindow();
				});
			}
		} else {
			cdart = disposeCDImg(cdart);
		}
	}
	if (timings.showDebugTiming) fetchArtworkProfiler.Print();

	if (isStreaming) {
		cdart = disposeCDImg(cdart);
		albumart = utils.GetAlbumArtV2(metadb);
		getThemeColors(albumart);
		ResizeArtwork(true);
	} else {
		aa_list = globals.imgPaths.map(path => utils.Glob($(path))).flat();
		const pattern = new RegExp('(cd|vinyl|' + settings.cdArtBasename + ')([0-9]*|[a-h])\.png', 'i');
		const imageType = /jpg|png$/i;
		// remove duplicates and cd/vinyl art and make sure all files are jpg or pngs
		aa_list = [... new Set(aa_list)].filter(path => !pattern.test(path) && imageType.test(path));

		if (aa_list.length) {
			noArtwork = false;
			if (aa_list.length > 1 && pref.aa_glob) {
				globTimer = setTimeout(() => {
					doRotateImage();
				}, pref.art_rotate_delay * 1000);
			}
			albumArtIndex = 0;
			glob_image(albumArtIndex, loadFromCache); // display first image
		} else if (metadb && (albumart = utils.GetAlbumArtV2(metadb))) {
			getThemeColors(albumart);
			ResizeArtwork(true);
		} else {
			noArtwork = true;
			albumart = null;
			ResizeArtwork(true);
			debugLog("Repainting on_playback_new_track due to no cover image");
			RepaintWindow();
		}
	}
	if (timings.showDebugTiming) fetchArtworkProfiler.Print();
}


function RepaintWindow() {
	debugLog("Repainting from RepaintWindow()");
	window.Repaint();
}

function createButtonObjects(ww, wh) {
	btns = [];

	if (ww <= 0 || wh <= 0) {
		return;
	} else if (typeof btnImg === 'undefined') {
		createButtonImages();
	}

	var buttonSize = scaleForDisplay(pref.transport_buttons_size);
	//---> Transport buttons
	if (pref.show_transport) {
		let count = 4 + (pref.show_random_button ? 1 : 0) +
				(pref.show_volume_button ? 1 : 0) +
				(pref.show_reload_button ? 1 : 0);

		const y = pref.show_transport_below ? wh - geo.lower_bar_h - scaleForDisplay(10) - buttonSize : scaleForDisplay(10);
		const w = buttonSize;
		const h = w;
		const p = scaleForDisplay(pref.transport_buttons_spacing); // space between buttons
		const x = (ww - w * count - p * (count - 1)) / 2;

		const calcX = (index) => {
			return x + (w + p) * index;
		}

		count = 0;
		btns.stop = new Button(x, y, w, h, 'Stop', btnImg.Stop, 'Stop');
		btns.prev = new Button(calcX(++count), y, w, h, 'Previous', btnImg.Previous, 'Previous');
		btns.play = new Button(calcX(++count), y, w, h, 'Play/Pause', !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause, 'Play');
		btns.next = new Button(calcX(++count), y, w, h, 'Next', btnImg.Next, 'Next');
		if (pref.show_random_button) {
			btns.random = new Button(calcX(++count), y, w, h, 'Playback/Random', btnImg.PlaybackRandom, 'Randomize Playlist');
		}
		if (pref.show_volume_button) {
			btns.volume = new Button(calcX(++count), y, w, h, 'Volume', btnImg.ShowVolume);
			volume_btn.set_position(btns.volume.x, y, w);
		}
		if (pref.show_reload_button) {
			btns.reload = new Button(calcX(++count), y, w, h, 'Reload', btnImg.Reload, 'Reload');
		}
	}

	//---> Caption buttons
	// if (uiHacks && UIHacks.FrameStyle) {

	// 	(UIHacks.FrameStyle == FrameStyle.SmallCaption && UIHacks.FullScreen != true) ? hideClose = true : hideClose = false;

	// 	var y = 5;
	// 	var w = 22;
	// 	var h = w;
	// 	var p = 3;
	// 	var x = ww - w * (hideClose ? 2 : 3) - p * (hideClose ? 1 : 2) - 8;

	// 	btns[10] = new Button(x, y, w, h, "Minimize", btnImg.Minimize);
	// 	btns[11] = new Button(x + w + p, y, w, h, "Maximize", btnImg.Maximize);
	// 	if (!hideClose)
	// 		btns[12] = new Button(x + (w + p) * 2, y, w, h, "Close", btnImg.Close);

	// }

	let img = btnImg.File;
	let x = 5;
	let y = 5;
	let h = img[0].Height;
	let w = img[0].Width;
	btns[20] = new Button(x, y, w, h, 'File', img);

	x += img[0].Width;
	img = btnImg.Edit;
	btns[21] = new Button(x, y, img[0].Width, h, 'Edit', img);

	x += img[0].Width;
	img = btnImg.View;
	btns[22] = new Button(x, y, img[0].Width, h, 'View', img);

	x += img[0].Width;
	img = btnImg.Playback;
	btns[23] = new Button(x, y, img[0].Width, h, 'Playback', img);

	x += img[0].Width;
	img = btnImg.Library;
	btns[24] = new Button(x, y, img[0].Width, h, 'Library', img);

	x += img[0].Width;
	img = btnImg.Help;
	btns[25] = new Button(x, y, img[0].Width, h, 'Help', img);

	x += img[0].Width;
	img = btnImg.Playlists;
	btns[26] = new Button(x, y, img[0].Width, h, 'Playlists', img);

	x += img[0].Width;
	img = btnImg.Options;
	btns[27] = new Button(x, y, img[0].Width, h, 'Options', img);

	img = btnImg.Settings;
	x = ww - settingsImg.Width * 2;
	y = 15;
	h = img[0].Height;
	btns[30] = new Button(x, y, img[0].Width, h, 'Settings', img, 'Foobar Settings');
	img = btnImg.Properties;
	x -= (img[0].Width + 10);
	btns[31] = new Button(x, y, img[0].Width, h, 'Properties', img, 'Properties');
	img = btnImg.Rating;
	x -= (img[0].Width + 10);
	btns[32] = new Button(x, y, img[0].Width, h, 'Rating', img, 'Rate Song');
	img = btnImg.Lyrics;
	x -= (img[0].Width + 10);
	btns[33] = new Button(x, y, img[0].Width, h, 'Lyrics', img, 'Display Lyrics');
	img = btnImg.ShowLibrary;
	x -= (img[0].Width + 10);
	btns.library = new Button(x, y, img[0].Width, h, 'ShowLibrary', img, 'Show Library');
	img = btnImg.Playlist;
	x -= (img[0].Width + 10);
	btns.playlist = new Button(x, y, img[0].Width, h, 'Playlist', img, 'Show Playlist');
	/* if a new image button is added to the left of playlist we need to update the ResizeArtwork code */
}

// =================================================== //

function createButtonImages() {
	let createButtonProfiler = null;
	if (timings.showExtraDrawTiming) createButtonProfiler = fb.CreateProfiler('createButtonImages');
	const transportCircleSize = Math.round(pref.transport_buttons_size * 0.93333);
	let btns = {}

	try {
		btns = {
			Stop: {
				ico: g_guifx.stop,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Previous: {
				ico: g_guifx.previous,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Play: {
				ico: g_guifx.play,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Pause: {
				ico: g_guifx.pause,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Next: {
				ico: g_guifx.next,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			PlaybackRandom: {
				ico: g_guifx.shuffle,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			ShowVolume: {
				ico:  g_guifx.volume_up,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Reload: {
				ico: g_guifx.power,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Minimize: {
				ico: "0",
				font: ft.Marlett,
				type: "caption",
				w: 22,
				h: 22
			},
			Maximize: {
				ico: "2",
				font: ft.Marlett,
				type: "caption",
				w: 22,
				h: 22
			},
			Close: {
				ico: "r",
				font: ft.Marlett,
				type: "caption",
				w: 22,
				h: 22
			},
			File: {
				ico: "File",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Edit: {
				ico: "Edit",
				font: ft.SegoeUi,
				type: 'menu'
			},
			View: {
				ico: "View",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Playback: {
				ico: "Playback",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Library: {
				ico: "Library",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Help: {
				ico: "Help",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Playlists: {
				ico: "Playlists",
				font: ft.SegoeUi,
				type: 'menu'
			},
			Options: {
				ico: "Options",
				font: ft.SegoeUi,
				type: 'menu'
			},

			Playlist: {
				ico: playlistImg,
				type: 'image',
				w: playlistImg.Width,
				h: playlistImg.Height
			},
			ShowLibrary: {
				ico: libraryImg,
				type: 'image',
				w: libraryImg.Width,
				h: libraryImg.Height
			},
			Lyrics: {
				ico: lyricsImg,
				type: 'image',
				w: lyricsImg.Width,
				h: lyricsImg.Height
			},
			Rating: {
				ico: ratingsImg,
				type: 'image',
				w: ratingsImg.Width,
				h: ratingsImg.Height
			},
			Properties: {
				ico: propertiesImg,
				type: 'image',
				w: propertiesImg.Width,
				h: propertiesImg.Height
			},
			Settings: {
				ico: settingsImg,
				type: 'image',
				w: settingsImg.Width,
				h: settingsImg.Height
			},
		};
	} catch (e) {
		var str = pref.lyrics_img;
		console.log('**********************************');
		console.log('ATTENTION: Buttons could not be created, most likely because the images were not found in "' + str.substring(0, str.lastIndexOf('/')) + '"');
		console.log('Make sure you installed the theme correctly to ' + fb.ProfilePath + '.');
		console.log('**********************************');
	}


	btnImg = [];

	for (var i in btns) {

		if (btns[i].type === 'menu') {
			const img = gdi.CreateImage(100, 100);
			const g = img.GetGraphics();

			const measurements = g.MeasureString(btns[i].ico, btns[i].font, 0, 0, 0, 0);
			btns[i].w = Math.ceil(measurements.Width + 20);
			img.ReleaseGraphics(g);
			btns[i].h = Math.ceil(measurements.Height + 5);
		}

		let w = btns[i].w;
		let	h = btns[i].h;
		let	lw = scaleForDisplay(2);

		if (is_4k && btns[i].type === 'transport') {
			w *= 2;
			h *= 2;
		} else if (is_4k && btns[i].type !== 'menu') {
			w = Math.round(btns[i].w * 1.5);
			h = Math.round(btns[i].h * 1.6);
		} else if (is_4k) {
			w += 20;
			h += 10;
		}

		var stateImages = []; //0=normal, 1=hover, 2=down;
		for (let s = 0; s <= 2; s++) {

			var img = gdi.CreateImage(w, h);
			const g = img.GetGraphics();
			g.SetSmoothingMode(SmoothingMode.AntiAlias);
			if (btns[i].type !== 'transport') {
				g.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit); // positions playback icons weirdly
			} else {
                g.SetTextRenderingHint(TextRenderingHint.AntiAlias)
            }

			var useDarkTransport = !pref.darkMode && pref.show_transport_below;
			var transportButtonColor = useDarkTransport ? rgb(110, 112, 114) : rgb(150, 152, 154);
			var transportOutlineColor = useDarkTransport ? rgb(100, 100, 100) : rgb(120, 120, 120);

			var menuTextColor = RGB(140, 142, 144);
			var menuRectColor = RGB(120, 122, 124);
			var captionIcoColor = RGB(140, 142, 144);
			var transportIconColor = transportButtonColor;
			var transportEllipseColor = transportOutlineColor;
			var iconAlpha = 140;

			if (s == 1) {	// hover
				menuTextColor = RGB(180, 182, 184);
				menuRectColor = RGB(160, 162, 164);
				captionIcoColor = RGB(190, 192, 194);
				transportIconColor = useDarkTransport ? shadeColor(transportButtonColor, 40) : tintColor(transportButtonColor, 30);
				transportEllipseColor = useDarkTransport ? shadeColor(transportOutlineColor, 35) : tintColor(transportOutlineColor, 35);
				iconAlpha = 215;
			} else if (s == 2) {	// down
				menuTextColor = RGB(180, 182, 184);
				menuRectColor = RGB(160, 162, 164);
				captionIcoColor = RGB(100, 102, 104);
				transportIconColor = useDarkTransport ? tintColor(transportButtonColor, 15) : shadeColor(transportButtonColor, 20);
				transportEllipseColor = useDarkTransport ? tintColor(transportOutlineColor, 15) : shadeColor(transportOutlineColor, 20);
				iconAlpha = 190;
			}

			if (btns[i].type == 'menu') {
				s && g.DrawRoundRect(Math.floor(lw / 2), Math.floor(lw / 2), w - lw, h - lw, 3, 3, 1, menuRectColor);
				g.DrawString(btns[i].ico, btns[i].font, menuTextColor, 0, 0, w, h - 1, StringFormat(1, 1));
			} else if (btns[i].type == 'caption') {
				g.DrawString(btns[i].ico, btns[i].font, captionIcoColor, 0, 0, w, h, StringFormat(1, 1));
			} else if (btns[i].type == 'transport') {
				g.DrawEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, lw, transportEllipseColor);
				g.DrawString(btns[i].ico, btns[i].font, transportIconColor, 1, (i == 'Stop' || i == 'Reload') ? 0 : 1, w, h, StringFormat(1, 1));
			} else if (btns[i].type == 'image') {
				g.DrawImage(btns[i].ico, Math.round((w - btns[i].ico.Width) / 2), Math.round((h - btns[i].ico.Height) / 2), btns[i].ico.Width, btns[i].ico.Height, 0, 0, btns[i].ico.Width, btns[i].ico.Height, 0, iconAlpha);
			}

			img.ReleaseGraphics(g);
			stateImages[s] = img;
		}

		btnImg[i] = stateImages;
	}
	if (timings.showExtraDrawTiming) createButtonProfiler.Print();
}
