// Georgia
//
// Description  a fullscreen now-playing script for foo_jscript_panel
// Author 		Mordred
// Version 		1.1.6
// Dev. Started 2017-12-22
// Last change  2019-11-13
// --------------------------------------------------------------------------------------

// CONFIGURATION //////////////////////////////////////

var themeBaseName = "Georgia"; // this is the base name of the theme, and will be used for finding some of the theme's files in the configuration folder.

var ft = {}; // fonts
var col = {}; // colors
var geo = {}; // sizes

var is_4k = false;

var fontThin = 'HelveticaNeueLT Pro 35 Th';
var fontLight = 'HelveticaNeueLT Pro 45 Lt';
var fontRegular = 'HelveticaNeueLT Pro 55 Roman';
var fontBold = 'HelveticaNeueLT Pro 65 Md';
var fontLightAlternate = 'NeueHaasGroteskDisp Pro XLt';

// FONTS
testFont(fontThin);
testFont(fontLight);
testFont(fontRegular);
testFont(fontBold);
testFont(fontLightAlternate);
testFont('Guifx v2 Transports');

var useNeue = false;
var fontsCreated = null;

function createFonts() {
	var font_size = is_4k.toString();
	if (fontsCreated && fontsCreated == font_size) {
		return; // don't redo fonts
	}

	g_tooltip = window.CreateTooltip('Segoe UI', scaleForDisplay(15));
	g_tooltip.text = '';	// just in case

	function font(name, size, style) {
		var font;
		try {
			font = gdi.Font(name, font_size === 'true' ? Math.min(size * 2) : size, style);
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
	if (utils.checkFont(fontLightAlternate)) {
		useNeue = true;
		ft.lower_bar_artist = font(fontLightAlternate, 31, g_font_style.italic);
		ft.lower_bar_artist_sml = font(fontLightAlternate, 27, g_font_style.italic);
	} else {
		ft.lower_bar_artist = font(fontThin, 31, g_font_style.italic);
		ft.lower_bar_artist_sml = font(fontThin, 27, g_font_style.italic);
	}
	ft.small_font = font(fontRegular, 14, 0);
	ft.guifx = font('Guifx v2 Transports', 16, 0);
	ft.Marlett = font('Marlett', 13, 0);
	ft.SegoeUi = font('Segoe Ui Semibold', 12, 0);
	ft.library_tree = font('Segoe UI', libraryProps.baseFontSize, 0);
	ft.lyrics = font(fontRegular, pref.lyrics_font_size || 20, 1);
}


function initColors() {
	col.artist = RGB(255, 255, 255);
	col.info_text = RGB(255, 255, 255);

	if (!pref.darkMode) {
		col.bg = RGB(205, 205, 205);
		col.menu_bg = RGB(58, 58, 58);
		col.progress_fill = RGB(235, 59, 70);
		col.progress_bar = RGB(125, 125, 125);
		col.now_playing = RGB(0, 0, 0); // tracknumber, title, and time
		col.aa_shadow = RGBA(000, 000, 000, 64);
	} else {
		col.bg = RGB(50, 54, 57);
		col.menu_bg = RGB(23, 23, 23);
		col.progress_fill = RGB(235, 59, 70);
		col.progress_bar = RGB(23, 22, 25);
		col.now_playing = RGB(255, 255, 255); // tracknumber, title, and time
		col.aa_shadow = RGBA(128, 128, 128, 54);
	}

	col.rating = RGB(255, 170, 032);
	col.mood = RGB(000, 128, 255);
	col.hotness = RGB(192, 192, 000);

	col.playcount = RGB(000, 153, 153);
	col.dark_grey = RGB(128, 128, 128);

	col.tl_added = RGB(15, 51, 65);
	col.tl_played = RGB(44, 66, 75);
	col.tl_unplayed = RGB(126, 173, 195);
	col.tl_play = RGB(255, 255, 255); // each individual play

	// ALBUM ART DISPLAY PROPERTIES
	col.aa_border = RGBA(060, 060, 060, 128);
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
pref.bg_image = fb.ProfilePath + 'georgia/images/wallpaper-blueish.jpg';
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

pref.divider_img = fb.ProfilePath + 'georgia/images/divider.png';
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
	showLyricsTiming: true, 	// spam console with timing for lyrics loading
}

// Lyrics Constants
var DEFAULT_OFFSET = 29;
var SCROLL_STEP = 1; // do not modify this value
var PLAYTIMER_VALUE = 01; // do not modify this value


// PLAYLIST JUNK
var listLeft = 15;
var listTop = 15;
var listRight = 15;
var listBottom = 15;
var showNowPlayingCalled = false; //TODO: Remove?

//--->
var listLength = maxRows = listX = listY = listW = listH = 0;
var listStep = [];
var rowDrag = fileDrag = makeSelectionDrag = linkToLastItem = false;
var nowPlayingGroupNr = -1;
var focusGroupNr = -1;
var keyPressed = false;
var guiInstanceType = window.InstanceType;
var tempFocusItemIndex;
var btns = [];
var hyperlinks = [];
//--->
AlbumArtId = {
	front: 0,
	back: 1,
	disc: 2,
	icon: 3,
	artist: 4
};
// =================================================== //
//--->
var thisPanelName = "Playlist"; //Don't change!! needed in Scrollbar.txt.
//---> Fonts
var playlistFontSize = window.GetProperty("Playlist: Font Size", 12);
if (playlistFontSize < 7) {
	playlistFontSize = 7;
	window.SetProperty("Playlist: Font Size", playlistFontSize);
}

// END OF CONFIGURATION /////////////////////////////////



// VARIABLES
// Artwork
var albumart = null; // albumart image
var albumart_size = new ImageSize(0, 0, 0, 0); // position (big image)
var cdart = null; // cdart image
var cdart_size = new ImageSize(0, 0, 0, 0); // cdart position (offset from albumart_size)
var image_bg = gdi.Image(pref.bg_image); // background image
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
var dividerImg = gdi.Image(pref.divider_img); // end lyrics image
var lastFmImg = gdi.Image(pref.last_fm_img); // Last.fm logo image
var lastFmWhiteImg = gdi.Image(pref.last_fmw_img); // white Last.fm logo image
var shadow_image = null; // shadow behind the artwork + discart
var labelShadowImg = null; // shadow behind labels
var playlist_shadow = null; // shadow behind the playlist
var flagImgs = []; // array of flag images
var rotatedCD = null; // drawing cdArt rotated is slow, so first draw it rotated into the rotatedCD image, and then draw rotatedCD image unrotated
var disc_art_loading; // for on_load_image_done()
var album_art_loading; // for on_load_image_done()
var isStreaming = false; // is the song from a streaming source?
var retrieveThemeColorsWhenLoaded = false; // only load theme colors on first image in aa_array
var newTrackFetchingArtwork = false; // only load theme colors when newTrackFetchingArtwork = true
var noArtwork = false; // only use default theme when noArtwork was found
var themeColorSet = false; // when no artwork, don't set themeColor every redraw
var playCountVerifiedByLastFm = false; // show Last.fm image when we %lastfm_play_count% > 0
var art_off_center = false; // if true, album art has been shifted 40 pixels to the right
var loadFromCache = true; // always load art from cache unless this is set

var str = new Object();
var state = new Object(); // panel state

var metadb_handle = null; // watch db for tag changes
// TIMERS
var progressTimer; // 40ms repaint of progress bar
var globTimer; // Timer for rotating globs
var slideTimer; // Timer for CD Slide out
var hideCursor; // Timer for hiding cursor

// STATUS VARIABLES
var ww = 0,
	wh = 0; // size of panel
var progressLength = 0; // fixing jumpiness in progressBar
var progressMoved = false; // playback position changed, so reset progressLength
var last_pb; // saves last playback order
var g_drag = 0; // status variable for clickable progress bar
var just_dblclicked = false;
var aa_list = new Array();
var albumArtIndex = 0; // index of currently displayed album art if more than 1
var fadeAlpha = 255; // full alpha which will be decremented
var nextPrevAlpha = 255; // full alpha for next/prev icons which will be decremented
var bandLogoHQ = false; // if true will partially remove the 10 pixel "gutter" around the image that fanart.tv requires around their high-rez images so that logos use more of the available space.
var t_interval; // milliseconds between screen updates
var lastLeftEdge = 0; // the left edge of the record labels. Saved so we don't have to recalculate every on every on_paint unless size has changed
var displayPlaylist = false;
var displayLibrary = false;
var displayLyrics = false;
var showLibraryButton = true; // TODO: Remove once library goes live

var tl_firstPlayedRatio = 0;
var tl_lastPlayedRatio = 0;

var current_path;
var last_path;
var lastDiscNumber;
var lastVinylSide;
var currentLastPlayed = '';

// Lyrics Variables
var len_seconds = fb.Titleformat("%length_seconds%");
var elap_seconds = fb.TitleFormat("%playback_time_seconds%");

var g_tooltip;

var g_playtimer = null;
var g_timer_abs;

// TODO change these variable names
var g_tab = Array();
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


// MENU STUFF
var pad_x = 4;
var pad_y = 2;
var mymenu = Array(7);
var menu_img = new Array(7);
var menu_down = false;
var menu_padx = pad_x;
var menu_pady = pad_y + 4;
var menu_width = 250; // this will get sized based on the font later

StringAlignment = {
	Near: 0,
	Centre: 1,
	Far: 2
};
var lt_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Near);
var ct_stringformat = StringFormat(StringAlignment.Centre, StringAlignment.Near);
var rt_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Near);
var lc_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Centre);
var cc_stringformat = StringFormat(StringAlignment.Centre, StringAlignment.Centre);
var rc_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Centre);
var lb_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Far);
var cb_stringformat = StringFormat(StringAlignment.Centre, StringAlignment.Far);
var rb_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Far);

// Flags, used with GdiDrawText()
// For more information, see: http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx
DT_TOP = 0x00000000;
DT_LEFT = 0x00000000;
DT_CENTER = 0x00000001;
DT_RIGHT = 0x00000002;
DT_VCENTER = 0x00000004;
DT_BOTTOM = 0x00000008;
DT_WORDBREAK = 0x00000010;
DT_SINGLELINE = 0x00000020;
DT_EXPANDTABS = 0x00000040;
DT_TABSTOP = 0x00000080;
DT_NOCLIP = 0x00000100;
DT_EXTERNALLEADING = 0x00000200;
DT_CALCRECT = 0x00000400; // [1.2.1] Handles well
DT_NOPREFIX = 0x00000800; // NOTE: Please use this flag, or a '&' character will become an underline '_'
DT_INTERNAL = 0x00001000;
DT_EDITCONTROL = 0x00002000;
DT_PATH_ELLIPSIS = 0x00004000;
DT_END_ELLIPSIS = 0x00008000;
DT_MODIFYSTRING = 0x00010000; // do not use
DT_RTLREADING = 0x00020000;
DT_WORD_ELLIPSIS = 0x00040000;
DT_NOFULLWIDTHCHARBREAK = 0x00080000;
DT_HIDEPREFIX = 0x00100000;
DT_PREFIXONLY = 0x00200000;

// File IO Modes
var ForReading = 1;
var ForWriting = 2;
var ForAppending = 8;

///////// OBJECTS

var fso = new ActiveXObject("Scripting.FileSystemObject");

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
		gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, col.info_bg);
		gr.DrawRect(-1, albumart_size.y, albumart_size.x, albumart_size.h - 1, 1, col.accent);
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	}

	gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);

	var textLeft = Math.round(Math.min(0.015 * ww, scaleForDisplay(20)));
	if (((!displayPlaylist && !displayLibrary) || (!albumart && noArtwork)) && fb.IsPlaying) {
		var trackInfoHeight = 0;
		var infoWidth = Math.floor(ww / 3);
		if (str.trackInfo) {
			gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
			trackInfoHeight = gr.MeasureString(str.trackInfo, ft.track_info, 0, 0, 0, 0).Height;
			gr.DrawString(str.trackInfo, ft.track_info, col.artist, ww - textLeft * 2 - infoWidth, geo.top_bg_h - trackInfoHeight - 15, infoWidth, trackInfoHeight, StringFormat(StringAlignment.Far));
			gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
		}
		if (str.year) {
			height = gr.MeasureString(str.year, ft.year, 0, 0, 0, 0).Height;
			gr.DrawString(str.year, ft.year, col.artist, ww - textLeft * 2 - infoWidth, geo.top_bg_h - trackInfoHeight - height - 20, infoWidth, height, StringFormat(StringAlignment.Far));
		}
	}

	// BIG ALBUMART
	if (fb.IsPlaying) {
		if (albumart && albumart_scaled) {
			if (timings.showExtraDrawTiming) drawArt = fb.CreateProfiler('on_paint -> artwork');
			if (!pref.darkMode) {
				if (!shadow_image) { // when switching views, the drop shadow won't get created initially which is very jarring when it suddenly appears later, so create it if we don't have it.
					createDropShadow();
				}
				shadow_image && gr.DrawImage(shadow_image, -geo.aa_shadow, albumart_size.y - geo.aa_shadow, shadow_image.Width, shadow_image.Height,
					0, 0, shadow_image.Width, shadow_image.Height);
				// gr.DrawRect(-geo.aa_shadow, albumart_size.y - geo.aa_shadow, shadow_image.Width, shadow_image.Height, 1, RGBA(0,0,255,125));	// viewing border line
			}
			if (cdart && !rotatedCD && !displayPlaylist && !displayLibrary && pref.display_cdart) {
				CreateRotatedCDImage();
			}
			if (!pref.cdart_ontop || displayLyrics) {
				if (rotatedCD && !displayPlaylist && !displayLibrary && pref.display_cdart && 
						cdart_size.y > albumart_size.y && cdart_size.h < albumart_size.h) {
					if (timings.showExtraDrawTiming) drawCD = fb.CreateProfiler('cdart');
					gr.DrawImage(rotatedCD, cdart_size.x, cdart_size.y, cdart_size.w, cdart_size.h, 0, 0, rotatedCD.width, rotatedCD.height, 0);
					if (timings.showExtraDrawTiming) drawCD.Print();
				}
				gr.DrawImage(albumart_scaled, albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h, 0, 0, albumart_scaled.width, albumart_scaled.height);
			} else { // draw cdart on top of front cover
				gr.DrawImage(albumart_scaled, albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h, 0, 0, albumart_scaled.width, albumart_scaled.height);
				if (rotatedCD && !displayPlaylist && !displayLibrary && pref.display_cdart && 
						cdart_size.y > albumart_size.y && cdart_size.h < albumart_size.h) {
					if (timings.showExtraDrawTiming) drawCD = fb.CreateProfiler('cdart');
					gr.DrawImage(rotatedCD, cdart_size.x, cdart_size.y, cdart_size.w, cdart_size.h, 0, 0, rotatedCD.width, rotatedCD.height, 0);
					if (timings.showExtraDrawTiming) drawCD.Print();
				}
			}
			if (displayLyrics && albumart_scaled && fb.IsPlaying) {
				gr.FillSolidRect(albumart_size.x - 1, albumart_size.y - 1, albumart_size.w + 1, albumart_size.h + 1, RGBA(0, 0, 0, 155));
				show_lyrics(gr, g_tab, Math.floor(lyrPos - pref.lyrics_h_padding));
			}
			if (timings.showExtraDrawTiming) drawArt.Print();
		} else {
			if (cdart && !rotatedCD && !displayPlaylist && !displayLibrary && pref.display_cdart) {
				CreateRotatedCDImage();
			}
			if (!shadow_image && !pref.darkMode) { // when switching views, the drop shadow won't get created initially which is very jarring when it suddenly appears later, so create it if we don't have it.
				createDropShadow();
			}
			if (rotatedCD && pref.display_cdart) {
				if (timings.showExtraDrawTiming) drawCD = fb.CreateProfiler('cdart');
				if (!pref.darkMode) {
					shadow_image && gr.DrawImage(shadow_image, -geo.aa_shadow, albumart_size.y - geo.aa_shadow, shadow_image.Width, shadow_image.Height,
						0, 0, shadow_image.Width, shadow_image.Height);
				}
				gr.DrawImage(rotatedCD, cdart_size.x, cdart_size.y, cdart_size.w, cdart_size.h, 0, 0, rotatedCD.width, rotatedCD.height, 0);
				if (timings.showExtraDrawTiming) drawCD.Print();
			}
		}
	}
	if (fb.IsPlaying && (albumart || !cdart)) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, col.info_bg); // info bg -- must be drawn after shadow
		gr.DrawRect(-1, albumart_size.y, albumart_size.x, albumart_size.h - 1, 1, col.accent);
		gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
	}
	if (fb.IsPaused) {
		pauseBtn.draw(gr);
	}

	if (str.artist) {
		var availableWidth = displayPlaylist || displayLibrary ? Math.min(ww / 2 - 20, btns.playlist.x - textLeft) : btns.playlist.x - textLeft;
		var artistFont = chooseFontForWidth(gr, availableWidth, str.artist, [ft.artist_lrg, ft.artist_med, ft.artist_sml]);
		height = gr.CalcTextHeight(str.artist, artistFont);
		var artistY = albumart_size.y - height - scaleForDisplay(8);
		gr.DrawString(str.artist, artistFont, col.artist, textLeft, artistY, availableWidth, height, StringFormat(0, 0, 4));
		width = gr.MeasureString(str.artist, artistFont, 0, 0, 0, 0).Width;
		if (pref.show_flags && flagImgs.length && width + flagImgs[0].width * flagImgs.length < availableWidth) {
			var flagsLeft = textLeft + width + scaleForDisplay(15);
			for (i = 0; i < flagImgs.length; i++) {
				gr.DrawImage(flagImgs[i], flagsLeft, Math.round(artistY + 1 + height / 2 - flagImgs[i].height / 2),
					flagImgs[i].width, flagImgs[i].height, 0, 0, flagImgs[i].width, flagImgs[i].height)
				flagsLeft += flagImgs[i].width + scaleForDisplay(5);
			}
		}
	}

	if (((!displayPlaylist && !displayLibrary) || (!albumart && noArtwork)) && fb.IsPlaying) {
		if (!albumart && cdart) {
			gridSpace = Math.round(cdart_size.x - geo.aa_shadow - textLeft);
		} else {
			gridSpace = Math.round(albumart_size.x - geo.aa_shadow - textLeft);
		}
		text_width = gridSpace;

		if (timings.showExtraDrawTiming) drawTextGrid = fb.CreateProfiler('on_paint -> textGrid');

		var c = new Color(col.info_bg);
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
				if (txtRec.lines > 2) {
					ft.title = ft.title_med;
					ft.tracknum = ft.tracknum_med;
					if (str.tracknum) {
						trackNumWidth = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Width + title_spacing;
					}
					txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width - trackNumWidth, wh);
					if (txtRec.lines > 2) {
						ft.title = ft.title_sml;
						ft.tracknum = ft.tracknum_sml;
						if (str.tracknum) {
							trackNumWidth = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Width + title_spacing;
						}
						txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width - trackNumWidth, wh);
					}
				}
				var tracknumHeight = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Height;
				var heightAdjustment = Math.ceil((tracknumHeight - gr.MeasureString(str.title, ft.title, 0, 0, 0, 0).Height) / 2);
				var numLines = Math.min(2, txtRec.lines);
				height = gr.CalcTextHeight(str.title, ft.title) * numLines + 3;

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
				var font_array = [ft.album_lrg, ft.album_med, ft.album_sml];
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
					var numLines = txtRec.lines;
					var lineHeight = txtRec.Height / numLines;
					if (numLines > 2) {
						numLines = 2;
					}
					height = lineHeight * numLines;
					gr.DrawString(str.album, ft_album, col.info_text, textLeft, top, text_width, height, g_string_format.trim_ellipsis_word);
				}
				top += height + scaleForDisplay(10);
			}

			if (0 && str.album) {
				var drawSubtitle = !!str.album_subtitle.length;
				ft_album = ft.album_lrg;
				ft_subtitle = ft.album_substitle_lrg;
				txtRec = gr.MeasureString(str.album, ft_album, 0, 0, text_width, wh);
				subtitleRec = gr.MeasureString(str.album_subtitle, ft_subtitle, 0, 0, text_width, wh);
				if (txtRec.lines > 2 || subtitleRec.lines > 2) {
					ft_album = ft.album_med;
					txtRec = gr.MeasureString(str.album, ft_album, 0, 0, text_width, wh);
					if (txtRec.lines > 2) {
						ft.album = ft.album_sml;
					}
					album_text = str.album + str.album_subtitle;
					drawSubtitle = false;
				} else if (txtRec.width + subtitleRec.width > text_width) {
					album_text = str.album + str.album_subtitle;
					txtRec = gr.MeasureString(album_text, ft_album, 0, 0, text_width, wh);
					var lineText = gr.EstimateLineWrap(album_text, ft_album, text_width).toArray();
					lineText.forEach(function (l) {
						console.log(JSON.stringify(l));
					});
					drawSubtitle = false;
				} else {
					// draw subtitle separately
					album_text = str.album;
				}
				var numLines = Math.min(2, txtRec.lines);
				height = gr.CalcTextHeight(album_text, ft_album) * numLines;

				gr.DrawString(album_text, ft_album, col.info_text, textLeft, top, text_width, height, g_string_format.trim_ellipsis_word);
				// console.log(drawSubtitle, str.album_subtitle, txtRec.width, subtitleRec.width, text_width);
				if (drawSubtitle) {
					gr.DrawString(str.album_subtitle, ft_subtitle, col.info_text,
						textLeft + Math.ceil(txtRec.width), top, text_width - Math.ceil(txtRec.width), height, g_string_format.trim_ellipsis_word);
				}

				top += height + scaleForDisplay(10);
			}

			// Tag grid
			grid_key_ft = ft.grd_key_lrg;
			col1_width = calculateGridMaxTextWidth(gr, str.grid, grid_key_ft);
			if (col1_width < text_width / 3) {
				grid_val_ft = ft.grd_val_lrg;
			} else {
				grid_key_ft = ft.grd_key_med;
				col1_width = calculateGridMaxTextWidth(gr, str.grid, grid_key_ft);
				if (col1_width < text_width / 3) {
					grid_val_ft = ft.grd_val_med;
				} else {
					grid_key_ft = ft.grd_key_sml;
					grid_val_ft = ft.grd_val_sml;
					col1_width = calculateGridMaxTextWidth(gr, str.grid, grid_key_ft);
					if (col1_width > text_width / 3) {
						col1_width = Math.floor(text_width / 3);
					}
				}
			}
			var column_margin = scaleForDisplay(10);
			var col2_width = text_width - column_margin - col1_width;
			var col2_left = textLeft + col1_width + column_margin;

            gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
			for (k = 0, i = 0; k < str.grid.length; k++) {
				var key = str.grid[k].label;
				var value = str.grid[k].val;
				var showLastFmImage = false;
				var dropShadow = false;
				var grid_val_col = col.info_text;

				if (value.length) {
					switch (key) {
						case 'Rating':
							grid_val_col = col.rating;
							dropShadow = true;
							break;
						case 'Mood':
							grid_val_col = col.mood;
							dropShadow = true;
							break;
						case 'Hotness':
							grid_val_col = col.hotness;
							dropShadow = true;
							break;
						case 'Play Count':
							showLastFmImage = true;
							break;
						default:
							break;
					}
					txtRec = gr.MeasureString(value, grid_val_ft, 0, 0, col2_width, wh);
					if (top + txtRec.Height < albumart_size.y + albumart_size.h) {
						var border_w = scaleForDisplay(0.5);
						cell_height = txtRec.Height + 5;
						if (dropShadow) {
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left + border_w, top + border_w, col2_width, cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left - border_w, top + border_w, col2_width, cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left + border_w, top - border_w, col2_width, cell_height, StringFormat(0, 0, 4));
							gr.DrawString(value, grid_val_ft, col.extraDarkAccent, col2_left - border_w, top - border_w, col2_width, cell_height, StringFormat(0, 0, 4));
						}
						gr.DrawString(key, grid_key_ft, col.info_text, textLeft, top, col1_width, cell_height, g_string_format.trim_ellipsis_char); // key
						gr.DrawString(value, grid_val_ft, grid_val_col, col2_left, top, col2_width, cell_height, StringFormat(0, 0, 4));
						// Attempting to solve white on light color
						// gr.DrawString(value, grid_val_ft, rgb(128,128,128), col2_left + border_w, top + border_w, col2_width, cell_height, StringFormat(0, 0, 4));
						// gr.DrawString(value, grid_val_ft, rgb(255,255,255), col2_left, top, col2_width, cell_height, StringFormat(0, 0, 4));

						if (playCountVerifiedByLastFm && showLastFmImage) {
                            var lastFmLogo = lastFmImg;
							if (colorDistance(col.primary, rgb(185, 0, 0), false) < 133) {
								lastFmLogo = lastFmWhiteImg;
							}
							var heightRatio = (cell_height - 12) / lastFmLogo.height;
							if (txtRec.Width + 20 + Math.round(lastFmLogo.width * heightRatio) < col2_width) {
								gr.DrawImage(lastFmLogo, col2_left + txtRec.Width + 20, top + 3, Math.round(lastFmLogo.width * heightRatio), cell_height - 12,
									0, 0, lastFmLogo.width, lastFmLogo.height);
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
        // BAND LOGO drawing code
        var brightBackground = (new Color(col.info_bg).brightness) > 190;
		timings.showExtraDrawTiming && (drawBandLogos = fb.CreateProfiler("on_paint -> band logos"));
        availableSpace = albumart_size.y + albumart_size.h - top;
        var logo = brightBackground ? (invertedBandLogo ? invertedBandLogo : bandLogo) : bandLogo;
		if (logo && availableSpace > 75) {
			// max width we'll draw is 1/2 the full size because the HQ images are just so big
			logoWidth = Math.min(bandLogoHQ ? (is_4k ? logo.width : logo.width / 2) : logo.width * 1.5, albumart_size.x - ww * 0.05);
			heightScale = logoWidth / logo.width; // width is fixed to logoWidth, so scale height accordingly
			if (logo.height * heightScale > availableSpace) {
				// TODO: could probably do this calc just once, but the logic is complicated
				heightScale = availableSpace / logo.height;
				logoWidth = logo.width * heightScale;
			}
			logoTop = Math.round(albumart_size.y + albumart_size.h - (heightScale * logo.height)) - 4;
			if (!bandLogoHQ || is_4k) {
				logoTop -= 20;
			}
			gr.DrawImage(logo, Math.round(albumart_size.x / 2 - logoWidth / 2), logoTop, Math.round(logoWidth), Math.round(logo.height * heightScale),
				0, 0, logo.width, logo.height, 0);
		}
		if (timings.showExtraDrawTiming) drawBandLogos.Print();


		// RECORD LABEL drawing code
		// this section should draw in 3ms or less always
		if (recordLabels.length > 0) {
            var labels = brightBackground ? (recordLabelsInverted.length ? recordLabelsInverted : recordLabels) : recordLabels;
			var rightSideGap = 20, // how close last label is to right edge
				labelSpacing = 0,
				leftEdgeGap = (art_off_center ? 20 : 40) * (is_4k ? 1.8 : 1), // space between art and label
				maxLabelWidth = scaleForDisplay(200);
			leftEdgeWidth = is_4k ? 45 : 30; // how far label background extends on left
			if (timings.showExtraDrawTiming) drawLabelTime = fb.CreateProfiler("on_paint -> record labels");
			totalLabelWidth = 0;
			for (i = 0; i < labels.length; i++) {
				if (labels[i].width > maxLabelWidth) {
					totalLabelWidth += maxLabelWidth;
				} else {
					if (is_4k && labels[i].width < 200) {
						totalLabelWidth += labels[i].width * 2;
					} else {
						totalLabelWidth += labels[i].width;
					}
				}
			}
			if (!lastLeftEdge) { // we don't want to recalculate this every screen refresh
				debugLog('recalculating lastLeftEdge');
				labelShadowImg = disposeImg(labelShadowImg);
				labelWidth = Math.round(totalLabelWidth / labels.length);
				labelHeight = Math.round(labels[0].height * labelWidth / labels[0].width); // might be recalc'd below
				if (albumart) {
					if (cdart && pref.display_cdart) {
						leftEdge = Math.round(Math.max(albumart_size.x + albumart_scaled.Width + 5, ww * 0.975 - totalLabelWidth + 1));
						var cdCenter = {};
						cdCenter.x = Math.round(cdart_size.x + cdart_size.w / 2);
						cdCenter.y = Math.round(cdart_size.y + cdart_size.h / 2);
						var radius = cdCenter.y - cdart_size.y;

						while (true) {
							allLabelsWidth = Math.max(Math.min(Math.round((ww - leftEdge - rightSideGap) / labels.length), maxLabelWidth), 50);
							//console.log("leftEdge = " + leftEdge + ", ww-leftEdge-10 = " + (ww-leftEdge-10) + ", allLabelsWidth=" + allLabelsWidth);
							var maxWidth = is_4k && labels[0].width < 200 ? labels[0].width * 2 : labels[0].width;
							labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
							labelHeight = Math.round(labels[0].height * labelWidth / labels[0].width); // width is based on height scale
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
			} else {
				// already calculated
				leftEdge = lastLeftEdge;
				labelAreaWidth = ww - leftEdge - rightSideGap;
			}
			if (labelAreaWidth >= scaleForDisplay(50)) {
				if (labels.length > 1) {
					labelSpacing = Math.min(12, Math.max(3, Math.round((labelAreaWidth / (labels.length - 1)) * 0.048))); // spacing should be proportional, and between 3 and 12 pixels
				}
				// console.log('labelAreaWidth = ' + labelAreaWidth + ", labelSpacing = " + labelSpacing);
				allLabelsWidth = Math.max(Math.min(Math.round((labelAreaWidth - (labelSpacing * (labels.length - 1))) / labels.length), maxLabelWidth), 50); // allLabelsWidth must be between 50 and 200 pixels wide
				var labelX = leftEdge;
				topEdge = albumart_size.y + albumart_size.h - labelHeight - 20;
				var origLabelHeight = labelHeight;

				if (!pref.darkMode) {
					if (!labelShadowImg) {
						labelShadowImg = createShadowRect(ww - labelX + leftEdgeWidth, labelHeight + 40);
					}
					gr.DrawImage(labelShadowImg, labelX - leftEdgeWidth - geo.aa_shadow, topEdge - 20 - geo.aa_shadow, ww - labelX + leftEdgeWidth + 2 * geo.aa_shadow, labelHeight + 40 + 2 * geo.aa_shadow,
						0, 0, labelShadowImg.width, labelShadowImg.height);
				}
				gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
                gr.FillSolidRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40, col.info_bg);
                gr.DrawRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40 - 1, 1, col.accent);
				gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
				for (i = 0; i < labels.length; i++) {
					// allLabelsWidth can never be greater than 200, so if a label image is 161 pixels wide, never draw it wider than 161
					var maxWidth = is_4k && labels[i].width < 200 ? labels[i].width * 2 : labels[i].width;
					labelWidth = (allLabelsWidth > maxWidth) ? maxWidth : allLabelsWidth;
					labelHeight = Math.round(labels[i].height * labelWidth / labels[i].width); // width is based on height scale

					gr.DrawImage(labels[i], labelX, Math.round(topEdge + origLabelHeight / 2 - labelHeight / 2), labelWidth, labelHeight, 0, 0, recordLabels[i].width, recordLabels[i].height);
					// gr.DrawRect(labelX, topEdge, labelWidth, labelHeight, 1, RGB(255,0,0));	// shows bounding rect of record labels
					labelX += labelWidth + labelSpacing;
				}
				labelHeight = origLabelHeight; // restore
			}
			if (timings.showExtraDrawTiming) drawLabelTime.Print();
		}
	} /* if (!displayPlaylist && !displayLibrary) */

	// MENUBAR
	timings.showExtraDrawTiming && (drawMenuBar = fb.CreateProfiler("on_paint -> menu bar"));
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

	// LOWER BAR
	var lowerBarTop = wh - geo.lower_bar_h;
	var pbLeft = Math.round(0.025 * ww);

	// Title & artist
	//if (timings.showExtraDrawTiming) drawLowerBar = fb.CreateProfiler("on_paint -> lowerBar");
	if (ww > 600) {
		if (str.disc != '')
			width = gr.CalcTextWidth(str.disc + '   ' + str.time + '   ' + str.length, ft.lower_bar);
		else
			width = gr.CalcTextWidth(' ' + str.time + '   ' + str.length, ft.lower_bar);
	} else {
		width = 0;
	}

	// Playlist/Library
	if (displayPlaylist) {
		timings.showExtraDrawTiming && (drawPlaylist = fb.CreateProfiler('on_paint -> playlist'));
		if (!pref.darkMode) {
			if (!playlist_shadow) {
				playlist_shadow = createShadowRect(playlist.w + 2 * geo.aa_shadow, playlist.h); // extend shadow past edge
			}
			gr.DrawImage(playlist_shadow, playlist.x - geo.aa_shadow, playlist.y - geo.aa_shadow, playlist.w + 2 * geo.aa_shadow, playlist.h + 2 * geo.aa_shadow,
				0, 0, playlist_shadow.width, playlist_shadow.height);
		} else {
			gr.DrawRect(playlist.x - 1, playlist.y - 1, playlist.w + 2, playlist.h + 2, 1, rgb(64,64,64));
		}
		playlist.on_paint(gr);
		timings.showExtraDrawTiming && drawPlaylist.Print();
	} else if (displayLibrary) {
		libraryPanel.on_paint(gr);
		if (pref.darkMode) {
			gr.DrawRect(libraryPanel.x - 1, libraryPanel.y - 1, libraryPanel.w + 2, libraryPanel.h + 2, 1, rgb(64,64,64));
		}
	}

    gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);

	var ft_lower_bold = ft.lower_bar_bold;
	var ft_lower = ft.lower_bar;
	var ft_lower_orig_artist = ft.lower_bar_artist;
	var trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft_lower, 0, 0, 0, 0).Width);
	var titleMeasurements = gr.MeasureString(str.title_lower, ft_lower, 0, 0, 0, 0);
	var titleWidth = titleMeasurements.Width;
	var origArtistWidth = gr.MeasureString(str.original_artist, ft_lower_orig_artist, 0, 0, 0, 0).Width;
	if (width + trackNumWidth + titleWidth + origArtistWidth > 0.95 * ww) {
		// we don't have room for all the text so use a smaller font and recalc size
		ft_lower_bold = ft.lower_bar_sml_bold;
		ft_lower = ft.lower_bar_sml;
		ft_lower_orig_artist = ft.lower_bar_artist_sml;
		titleMeasurements = gr.MeasureString(str.title_lower, ft_lower, 0, 0, 0, 0);
		trackNumWidth = Math.ceil(gr.MeasureString(str.tracknum, ft.lower_bar_sml_bold, 0, 0, 0, 0).Width);
		if (str.disc !== '') {
			width = gr.CalcTextWidth(str.disc + '   ' + str.time + '   ' + str.length, ft_lower);
		} else {
			width = gr.CalcTextWidth(' ' + str.time + '   ' + str.length, ft_lower);
		}
    }
    var heightAdjustment = is_4k ? 1 : 0;
    gr.DrawString(str.tracknum, ft_lower_bold, col.now_playing, pbLeft, lowerBarTop + heightAdjustment, 0.95 * ww - width, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
	width += trackNumWidth;
	gr.DrawString(str.title_lower, ft_lower, col.now_playing, pbLeft + trackNumWidth, lowerBarTop, 0.95 * ww - width, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
	width += Math.ceil(titleMeasurements.Width);
	if (str.original_artist && width < 0.95 * ww) {
		var h_spacing = 0;
		var v_spacing = 0;
		if (useNeue) {
			h_spacing = scaleForDisplay(4);
			v_spacing = scaleForDisplay(1);
		}
		gr.DrawString(str.original_artist, ft_lower_orig_artist, col.now_playing, pbLeft + trackNumWidth + titleMeasurements.Width + h_spacing, lowerBarTop + v_spacing, 0.95 * ww - width, titleMeasurements.Height, StringFormat(0, 0, 4, 0x00001000));
	}

	// Progress bar/Seekbar
	var pbTop = Math.round(lowerBarTop + titleMeasurements.Height) + scaleForDisplay(8);
	gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
	if (pref.show_progress_bar) {
		// if (pref.darkMode) {
		//     // TODO: keep this? Only do when accent is too close?
		//     gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		//     gr.DrawRect(pbLeft - 0.5, pbTop - 0.5, Math.round(0.95 * ww), geo.prog_bar_h, 1, col.darkAccent);
		//     gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
		// }
		gr.FillSolidRect(pbLeft, pbTop, Math.round(0.95 * ww), geo.prog_bar_h, col.progress_bar);
	}
	if (fb.PlaybackLength > 0) {
        gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		if (ww > 600) {
			gr.DrawString(str.length, ft_lower, col.now_playing, 0.725 * ww, lowerBarTop, 0.25 * ww, titleMeasurements.Height, StringFormat(2, 0));
			width = gr.CalcTextWidth('  ' + str.length, ft_lower);
			gr.DrawString(str.time, ft_lower_bold, col.now_playing, 0.725 * ww, lowerBarTop + heightAdjustment, 0.25 * ww - width, titleMeasurements.Height, StringFormat(2, 0));
			width += gr.CalcTextWidth('  ' + str.time, ft_lower_bold);
			gr.DrawString(str.disc, ft_lower, col.now_playing, 0.725 * ww, lowerBarTop, 0.25 * ww - width, titleMeasurements.Height, StringFormat(2, 0));
		}

        gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
		if (pref.show_progress_bar) {
			var progressStationary = false;
			/* in some cases the progress bar would move backwards at the end of a song while buffering/streaming was occurring.
				This created strange looking jitter so now the progress bar can only increase unless the user seeked in the track. */
			if (progressMoved || Math.floor(0.95 * ww * (fb.PlaybackTime / fb.PlaybackLength)) > progressLength) {
				progressLength = Math.floor(0.95 * ww * (fb.PlaybackTime / fb.PlaybackLength));
			} else {
				progressStationary = true;
			}
			progressMoved = false;
			gr.FillSolidRect(pbLeft, pbTop, progressLength, geo.prog_bar_h, col.progress_fill);
			if (pref.darkMode) {
				// TODO: keep this? Only do when accent is too close?
				gr.DrawRect(pbLeft, pbTop, progressLength, geo.prog_bar_h - 1, 1, col.darkAccent);
			}
			if (progressStationary && fb.IsPlaying && !fb.IsPaused) {
				if (col.accent !== last_accent_col || progressAlphaCol === undefined) {
					var c = new Color(col.accent);
					progressAlphaCol = rgba(c.r, c.g, c.b, 100); // fake anti-aliased edge so things look a little smoother
					last_accent_col = col.accent;
				}
				gr.DrawLine(progressLength + pbLeft + 1, pbTop, progressLength + pbLeft + 1, pbTop + geo.prog_bar_h - 1, 1, progressAlphaCol);
			}
		}
	} else if (ww > 600) {
        gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
		if (fb.IsPlaying) { // streaming, but still want to show time
			gr.DrawString(str.time, ft.lower_bar, col.now_playing, Math.floor(0.725 * ww), lowerBarTop, 0.25 * ww, 0.5 * geo.lower_bar_h, StringFormat(2, 0));
		} else {
			var color = pref.darkMode ? tintColor(col.bg,20) : shadeColor(col.bg, 20);
			var offset = 0;
			if (updateAvailable) {
				offset = updateHyperlink.get_w();
				updateHyperlink.set_w(ww);
				updateHyperlink.set_y(lowerBarTop + 2); // +2 counteracts the -2 in the set_y method required for playlist
				updateHyperlink.set_xOffset(-offset - Math.floor(ww*0.025));
				updateHyperlink.draw(gr, color);
				offset += scaleForDisplay(6);
			}
			gr.DrawString(str.time, ft.lower_bar, color, Math.floor(0.725 * ww) - offset, lowerBarTop, 0.25 * ww, geo.lower_bar_h, StringFormat(2, 0));
		}
	}
    gr.SetSmoothingMode(SmoothingMode.AntiAliasGridFit);
}

function on_paint(gr) {
	if (timings.showDrawTiming) drawStuff = fb.CreateProfiler("on_paint");
	draw_ui(gr);
	if (pref.show_volume_button) {
		volume_btn.on_paint(gr);
	}
	
	if (timings.showDrawTiming) {
		drawStuff.Print();
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function show_lyrics(gr, tab, posy) {
	var i, k, text_colour;
	divider_spacing = scaleForDisplay(40);
	divider_height = scaleForDisplay(10);

	if (timings.showDebugTiming)
		show_lyricsTime = fb.CreateProfiler("show_lyrics");
	gr.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
	var g_txt_align = cc_stringformat;

	if (dividerImg && dividerImg.width < (albumart_size.w - 10) && posy - divider_spacing - dividerImg.height >= albumart_size.y + pref.lyrics_h_padding) {
		gr.FillRoundRect(albumart_size.x + Math.floor(albumart_size.w * .2) - 1, posy - divider_spacing - divider_height + 1, Math.floor(albumart_size.w * 0.6), divider_height, divider_height / 2, divider_height / 2, col.darkAccent);
		gr.FillRoundRect(albumart_size.x + Math.floor(albumart_size.w * .2), posy - divider_spacing - divider_height, Math.floor(albumart_size.w * 0.6), divider_height, divider_height / 2, divider_height / 2, col.info_bg);
	}
	for (i = 0; i < tab.length; i++) {
		if (posy >= albumart_size.y + pref.lyrics_h_padding && posy < albumart_size.h - pref.lyrics_h_padding) {
			if (i == focus && g_lyrics_status == 1) {
				text_colour = g_txt_highlightcolour;
			} else {
				if (g_lyrics_status == 0) {
					text_colour = g_txt_highlightcolour;
				} else {
					text_colour = g_txt_normalcolour;
				}
			}
			lineHeight = tab[i].total_lines * pref.lyrics_line_height;
			// maybe redo this to use albumart_size.x+(albumart_size.w-lyricsWidth)/2  and  lyricsWidth
			pref.lyrics_glow && gr.DrawString(tab[i].text, ft.lyrics, g_txt_shadowcolor, albumart_size.x + (albumart_size.w - lyricsWidth) / 2 - 1, posy, lyricsWidth, lineHeight, g_txt_align);
			pref.lyrics_glow && gr.DrawString(tab[i].text, ft.lyrics, g_txt_shadowcolor, albumart_size.x + (albumart_size.w - lyricsWidth) / 2, posy - 1, lyricsWidth, lineHeight, g_txt_align);
			pref.lyrics_text_shadow && gr.DrawString(tab[i].text, ft.lyrics, g_txt_shadowcolor, albumart_size.x + (albumart_size.w - lyricsWidth) / 2 + 2, posy + 2, lyricsWidth, lineHeight, g_txt_align);
			gr.DrawString(tab[i].text, ft.lyrics, text_colour, albumart_size.x + (albumart_size.w - lyricsWidth) / 2, posy, lyricsWidth, lineHeight, g_txt_align);
		}
		posy = Math.floor(posy + pref.lyrics_line_height + ((tab[i].total_lines - 1) * pref.lyrics_line_height));
	}
	posy += divider_spacing;
	if (dividerImg && dividerImg.width < (albumart_size.w - 10) && posy < albumart_size.h - pref.lyrics_h_padding) {
		// gr.DrawImage(dividerImg, albumart_size.x+(albumart_size.w-dividerImg.width)/2, posy, dividerImg.width, dividerImg.height, 0,0,dividerImg.width,dividerImg.height);
		gr.FillRoundRect(albumart_size.x + Math.floor(albumart_size.w * .2) - 1, posy + 1, Math.floor(albumart_size.w * 0.6), divider_height, divider_height / 2, divider_height / 2, col.darkAccent);
		gr.FillRoundRect(albumart_size.x + Math.floor(albumart_size.w * .2), posy, Math.floor(albumart_size.w * 0.6), divider_height, divider_height / 2, divider_height / 2, col.info_bg);
	}

	if (timings.showDebugTiming)
		show_lyricsTime.Print();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function onRatingMenu(x, y) {
	var MF_SEPARATOR = 0x00000800;
	var MF_STRING = 0x00000000;
	var idx;
	var _menu = window.CreatePopupMenu();

	menu_down = true;

	var rating = fb.TitleFormat("$if2(%rating%,0)").Eval();

	_menu.AppendMenuItem(MF_STRING, 1, "No rating");
	_menu.CheckMenuItem(1, rating == 0);
	_menu.AppendMenuItem(MF_STRING, 11, "1 Star");
	_menu.CheckMenuItem(11, rating == 1);
	_menu.AppendMenuItem(MF_STRING, 12, "2 Stars");
	_menu.CheckMenuItem(12, rating == 2);
	_menu.AppendMenuItem(MF_STRING, 13, "3 Stars");
	_menu.CheckMenuItem(13, rating == 3);
	_menu.AppendMenuItem(MF_STRING, 14, "4 Stars");
	_menu.CheckMenuItem(14, rating == 4);
	_menu.AppendMenuItem(MF_STRING, 15, "5 Stars");
	_menu.CheckMenuItem(15, rating == 5);

	idx = _menu.TrackPopupMenu(x, y);
	switch (true) {
		case idx == 0:
			break;
		case idx == 1:
			fb.RunContextCommand("Playback Statistics/Rating/<not set>");
			break;
		default:
			fb.RunContextCommand("Playback Statistics/Rating/" + (idx - 10));
			break;
	}
	_menu.Dispose();
	menu_down = false;
}

function onOptionsMenu(x, y) {
	var idx;

	menu_down = true;

	var menu = new Menu();	// helper class for creating simple menu items. See helpers.js

	// Settings
	var _menu = window.CreatePopupMenu();
	var _debugMenu = window.CreatePopupMenu();
	var _libraryMenu = window.CreatePopupMenu();

	// DO NOT USE ITEM 0 OR THINGS BREAK
	menu.addToggleItem(_menu, 'Check for Theme Updates', pref, 'checkForUpdates');
	menu.createRadioSubMenu(_menu, 'Use 4K mode', ['Auto-detect', 'Never', 'Always'], pref.use_4k, ['auto', 'never', 'always'], function(mode) {
		pref.use_4k = mode;
		on_size();
		RepaintWindow();
	});
	menu.addToggleItem(_menu, 'Use Dark Theme', pref, 'darkMode', function () {
		initColors();
		if (fb.IsPlaying) {
			albumart = null;
			loadFromCache = false;
			on_playback_new_track(fb.GetNowPlaying());
		} else {
			RepaintWindow();
		}
	});
	menu.addToggleItem(_menu, 'Cycle Through All Artwork', pref, 'aa_glob', function () {
		if (!pref.aa_glob) {
			window.ClearTimeout(globTimer);
			globTimer = 0;
		} else {
			doRotateImage();
		}
	});
	menu.addToggleItem(_menu, 'Display CD Art (cd.pngs)', pref, 'display_cdart', function () {
		if (fb.IsPlaying) fetchNewArtwork(fb.GetNowPlaying());
		lastLeftEdge = 0; // resize labels
		ResizeArtwork(true);
		RepaintWindow();
	});
	menu.addToggleItem(_menu, 'Rotate CD Art on track change', pref, 'rotate_cdart', function () { RepaintWindow(); }, !pref.display_cdart);	
	menu.createRadioSubMenu(_menu, 'CD Art Rotation Amount', ['2 degrees', '3 degrees', '4 degrees', '5 degrees'], parseInt(pref.rotation_amt), [2,3,4,5], function (rot) {
		pref.rotation_amt = rot;
		CreateRotatedCDImage();
		RepaintWindow();		
	});

	menu.addItem(_menu, 'Display CD Art above cover', pref.cdart_ontop, function () {
		pref.cdart_ontop = !pref.cdart_ontop;
		RepaintWindow();
	}, !pref.display_cdart);

	_menu.AppendMenuSeparator();

	menu.addToggleItem(_menu, 'Display playlist on startup', pref, 'start_Playlist');
	menu.addToggleItem(_menu, 'Show Transport Controls', pref, 'show_transport', function () { 
		createButtonImages();
		createButtonObjects(ww, wh);
		ResizeArtwork(true);
		RepaintWindow();
	});
	menu.addToggleItem(_menu, 'Show Volume Control', pref, 'show_volume_button', function () { 
		createButtonObjects(ww, wh);
		RepaintWindow();
	});
	menu.addToggleItem(_menu, 'Show Progress Bar', pref, 'show_progress_bar', function () { 
		setGeometry();
		ResizeArtwork(true);
		RepaintWindow();
	});
	menu.addToggleItem(_menu, 'Update Progress Bar frequently (higher CPU)', pref, 'freq_update', function () { SetProgressBarRefresh(); });

	_menu.AppendMenuSeparator();

	menu.addToggleItem(_menu, 'Use Vinyl Style Numbering if Available', pref, 'use_vinyl_nums', function () { RepaintWindow(); });

	_menu.AppendMenuSeparator();

	menu.addToggleItem(_menu, 'Show Artist Country Flags', pref, 'show_flags', function () {
		LoadCountryFlags();
		RepaintWindow();
	});

	_menu.AppendMenuSeparator();

	menu.addToggleItem(_menu, 'Follow Hyperlinks only if CTRL-key is down', pref, 'hyperlinks_ctrl');

	_menu.AppendMenuSeparator(); 

	menu.addToggleItem(_libraryMenu, 'Remember Library State', libraryProps, 'rememberTree');
	menu.addToggleItem(_libraryMenu, 'Full Line Clickable', libraryProps, 'fullLine');
	menu.addToggleItem(_libraryMenu, 'Show Tooltips', libraryProps, 'tooltips', function () { setLibrarySize(); });
	menu.createRadioSubMenu(_libraryMenu, 'Root Node Type', ['Hide', '"All Music"', 'View Name'], libraryProps.rootNode, [0,1,2], function (nodeIndex) {
		libraryProps.rootNode = nodeIndex;
		lib_manager.rootNodes(1);
	});
	menu.createRadioSubMenu(_libraryMenu, 'Node Item Counts', ['Hidden', '# Tracks', '# Sub-Items'], libraryProps.nodeItemCounts, [0,1,2], function (nodeIndex) {
		libraryProps.nodeItemCounts = nodeIndex;
		lib_manager.rootNodes(1);
	});
	menu.addToggleItem(_libraryMenu, 'Show Library Scrollbar', libraryProps, 'showScrollbar', function () { setLibrarySize(); });
	menu.addToggleItem(_libraryMenu, 'Send files to Current Playlist', libraryProps, 'sendToCurrent');
	menu.addToggleItem(_libraryMenu, 'Auto-Fill Playlist on Selection', libraryProps, 'autoFill');
	menu.createRadioSubMenu(_libraryMenu, 'Double Click Action', ['Expand/Collapse Folders', 'Send and Play', 'Send to Playlist'], libraryProps.doubleClickAction, [0,1,2], function(action) {
		libraryProps.doubleClickAction = action;
	});
	menu.addToggleItem(_libraryMenu, 'Auto Collapse Nodes', libraryProps, 'autoCollapse');
	menu.addItem(_libraryMenu, 'Reset Library Zoom', false, function () {
		libraryProps.filterZoom = 100;
		libraryProps.fontZoom = 100;
		libraryProps.nodeZoom = 100;
		setLibrarySize();
	});
	_libraryMenu.AppendTo(_menu, MF_STRING, 'Library Settings');

	_menu.AppendMenuSeparator();

	menu.addToggleItem(_debugMenu, 'Enable debug output', pref, 'show_debug_log');
	menu.addItem(_debugMenu, 'Enable theme debug output', pref.show_theme_log, function () {
		pref.show_theme_log = !pref.show_theme_log;
		if (pref.show_theme_log) {
			// this is overkill, but it'll print the theme logging at least
			albumart = null;
			loadFromCache = false;
			on_playback_new_track(fb.GetNowPlaying());
		}
	});
	menu.addToggleItem(_debugMenu, 'Show draw timing', timings, 'showDrawTiming');
	menu.addToggleItem(_debugMenu, 'Show extra draw timing', timings, 'showExtraDrawTiming');
	menu.addToggleItem(_debugMenu, 'Show debug timing', timings, 'showDebugTiming');
	menu.addToggleItem(_debugMenu, 'Show Reload button', pref, 'show_reload_button', function () { window.Reload(); });
	_debugMenu.AppendTo(_menu, MF_STRING, 'Debug Settings');

	_menu.AppendMenuSeparator();
	_menu.AppendMenuItem(MF_STRING, 100, 'Lock Right Click...');
	_menu.CheckMenuItem(100, pref.locked);
	_menu.AppendMenuItem(MF_STRING, 101, 'Restart');

	idx = _menu.TrackPopupMenu(x, y);
	switch (idx) {
		case 100:
			pref.locked = !pref.locked;
			break;
		case 101:
			fb.RunMainMenuCommand("File/Restart");
			break;
		default:
			menu.doCallback(idx);
	}
	_menu.Dispose();

	menu_down = false;
	window.RepaintRect(pad_x, pad_y, menu_width, 24);
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
	var i;
	console.log("in on_init()");

	if (!fso.folderExists(fb.ProfilePath + themeBaseName)) {
		fso.createFolder(fb.ProfilePath + themeBaseName);
	}

	str = clearUIVariables();

	ww = window.Width;
	wh = window.Height;

	last_path = '';

	last_pb = fb.PlaybackOrder;

	if (fb.IsPlaying && fb.GetNowPlaying()) {
		on_size();
		on_playback_new_track(fb.GetNowPlaying());
	}

	g_playtimer && window.ClearInterval(g_playtimer);
	g_playtimer = null;

	if (pref.start_Playlist) {
		displayPlaylist = false;
		setTimeout(function () {
			if (btns && btns.playlist) {
				btns.playlist.onClick();	// displays playlist
			}
		}, 30);
	}

	setTimeout(function () {
		// defer initing of library panel until everything else has loaded
		if (!libraryInitialized) {
			initLibraryPanel();
		}
	}, 10000);
}

// window size changed
function on_size() {
	console.log("in on_size()");
	ww = window.Width;
	wh = window.Height;
	console.log('width: ' + ww + ', height: ' + wh);

	if (ww <= 0 || wh <= 0) return;

	checkFor4k(ww, wh);

	if (!sizeInitialized) {
		createFonts();
		setGeometry();
		if (fb.IsPlaying) {
			LoadCountryFlags(); // wrong size flag gets loaded on 4k systems
		}
		initPlaylist();
		volume_btn = new VolumeBtn();
        sizeInitialized = true;
        if (str.timeline) {
            str.timeline.setHeight(geo.timeline_h);
        }
	}

	lastLeftEdge = 0;

	ResizeArtwork(true);
	createButtonImages();
	createButtonObjects(ww, wh);

	// we aren't creating these buttons anymore, but we still use these values for now. TODO: replace these
	settingsY = btns[30].y;

	if (albumart)
		midpoint = Math.ceil(albumart_size.y + pref.lyrics_line_height + albumart_size.h / 2);
	else
		midpoint = Math.ceil((wh - geo.lower_bar_h + pref.lyrics_line_height) / 2);
	if (displayLyrics) {
		refresh_lyrics();
	}

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
		var y = btns[30].y + btns[30].h + 10 + listTop;
		var library_w = ww - x;
		var library_h = Math.max(0, wh - geo.lower_bar_h - 10 - y - listBottom);
		ui.sizedNode = false;
		ui.node_sz = Math.round(16 * ui.scale);
		p.setFilterFont();	// resets filter font in case the zoom was reset
		libraryPanel.on_size(x, y, library_w, library_h);
	} else {
		// TODO: take this if/else out once this part is done
		displayLibrary = false;
	}
}

// new track
function on_playback_new_track(metadb) {
	console.log('in on_playback_new_track()');
	if (timings.showDebugTiming) newTrackTime = fb.CreateProfiler('on_playback_new_track');
	start_timer = 0;
	lastLeftEdge = 0;
	newTrackFetchingArtwork = true;
	themeColorSet = false;

	isStreaming = metadb ? !metadb.RawPath.match(/^file\:\/\//) : false;
	if (!isStreaming) {
		current_path = $('%directoryname%');
	} else {
		current_path = '';
	}

	SetProgressBarRefresh();

	if (globTimer) {
		window.ClearTimeout(globTimer);
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
	for (i = 0; i < tf.labels.length; i++) {
		for (j = 0; j < $('$meta_num(' + tf.labels[i] + ')'); j++) {
			labelStrings.push($('$meta(' + tf.labels[i] + ',' + j + ')'));
		}
	}
	labelStrings = _.uniq(labelStrings);
	for (i = 0; i < labelStrings.length; i++) {
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

	function testBandLogo(imgDir, bandStr, isHQ) {
		var logoPath = imgDir + bandStr + '.png'
		if (IsFile(logoPath)) {
			if (isHQ) {
				bandLogoHQ = true;
				console.log('Found band logo: ' + logoPath);
			}
			return logoPath;
		}
		return false;
	}

	/* code to retrieve band logo */
	bandStr = replaceFileChars($('[%artist%]'));
    bandLogo = disposeImg(bandLogo);
    invertedBandLogo = disposeImg(invertedBandLogo);
	if (bandStr) {
		bandLogoHQ = false;

		var path = testBandLogo(pref.logo_hq, bandStr, true) || // try 800x310 white
			testBandLogo(pref.logo_color, bandStr, true); // try 800x310 color
		if (path) {
            bandLogo = gdi.Image(path);
            try {
                invertedBandLogo = bandLogo.InvertColours();
            } catch (e) {
                // not using the latest foo_jscript_panel so can't InvertColours
                invertedBandLogo = undefined;
            }
		}
	}

	last_path = current_path; // for art caching purposes
	lastDiscNumber = $('$if2(%discnumber%,0)'); // for art caching purposes
	lastVinylSide = $('$if2(" + tf.vinyl_side + ",ZZ)');
	currentLastPlayed = $(tf.last_played);

	// enable "watch for tag changes" on new track
	metadb_handle = fb.GetNowPlaying();
	if (metadb_handle) {
		on_metadb_changed(); // refresh panel
	}

	on_playback_time();
	progressLength = 0;

	if (displayPlaylist) {
		playlist.on_playback_new_track(metadb);
	} else if (displayLibrary) {
		library.on_playback_new_track(metadb);
	}

	// Lyrics stuff
	g_playtimer && window.ClearInterval(g_playtimer);
	g_playtimer = null;
	if (displayLyrics) { // no need to try retrieving them if we aren't going to display them now
		updateLyricsPositionOnScreen();
	}
	if (timings.showDebugTiming) newTrackTime.Print();
}

// tag content changed
function on_metadb_changed(handle_list, fromhook) {
	console.log('on_metadb_changed()');
	if (fb.IsPlaying) {
		var nowPlayingUpdated = !handle_list; // if we don't have a handle_list we called this manually from on_playback_new_track
		var metadb = fb.GetNowPlaying();
		if (metadb && handle_list) {
			for (i = 0; i < handle_list.Count; i++) {
				if (metadb.RawPath === handle_list.Item(i).RawPath) {
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
            str.album = $("[%album%][ '['" + tf.album_trans + "']']");
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

			str.disc = fb.TitleFormat(tf.disc).Eval();

			h = Math.floor(fb.PlaybackLength / 3600);
			m = Math.floor(fb.PlaybackLength % 3600 / 60);
			s = Math.floor(fb.PlaybackLength % 60);
			str.length = (h > 0 ? h + ":" + (m < 10 ? "0" : '') + m : m) + ":" + (s < 10 ? "0" : '') + s;

			str.grid = [];
			for (k = 0; k < tf.grid.length; k++) {
				val = $(tf.grid[k].val);
				if (val) {
					if (tf.grid[k].age) {
						val = $('$date(' + val + ')'); // never show time
						var age = calcAgeDateString(val);
						if (age) {
							val += ' (' + age + ')';
						}
					}
					str.grid.push({
						age: tf.grid[k].age,
						label: tf.grid[k].label,
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
			lastPlayed = $(tf.last_played);
			calcDateRatios($date(currentLastPlayed) !== $date(lastPlayed), currentLastPlayed); // last_played has probably changed and we want to update the date bar
			if (lastPlayed.length) {
				today = dateToYMD(new Date());
				if (!currentLastPlayed.length || $date(lastPlayed) !== today) {
					currentLastPlayed = lastPlayed;
				}
			}

			lp = str.grid.find(function (value) {
				return value.label === 'Last Played';
			});
			if (lp) {
				lp.val = $date(currentLastPlayed);
				if (calcAgeDateString(lp.val)) {
					lp.val += ' (' + calcAgeDateString(lp.val) + ')';
				}
			}

			if (pref.show_flags) {
				LoadCountryFlags();
			}
		}
	}
	// createHyperlinks();
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
	progressMoved = true;
	if (displayLyrics) {
		refresh_lyrics();
	}
	on_playback_time();
	refresh_seekbar();
}

var onMouseLbtnDown = false;

function on_mouse_lbtn_down(x, y, m) {
	if (y > wh - geo.lower_bar_h) {
		g_drag = 1;
	}

	if (!volume_btn.on_mouse_lbtn_down(x, y, m)) {
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
	g_drag = 0;

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
					pauseBtn.trace(x, y)) {
					fb.PlayOrPause();
				}
			}
		}
		on_mouse_move(x, y);
		buttonEventHandler(x, y, m);
	}

	onMouseLbtnDown = false;
}

function on_mouse_lbtn_dblclk(x, y, m) {
	if (displayPlaylist && playlist.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	} else if (displayLibrary && library.mouse_in_this(x, y)) {
		trace_call && console.log(qwr_utils.function_name());
		library.on_mouse_lbtn_dblclk(x, y, m);
	} else {
		// re-initialise the panel
		just_dblclicked = true;
		if (fb.IsPlaying) {
			albumart = null;
			loadFromCache = false;
			on_playback_new_track(fb.GetNowPlaying());
		}
		if (displayLyrics) {
			refresh_lyrics();
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
		return pref.locked;
}

function on_mouse_move(x, y, m) {
	if (x != state["mouse_x"] || y != state["mouse_y"]) {
		window.SetCursor(32512); // arrow
		if (g_drag) {
			var v = (x - 0.025 * ww) / (0.95 * ww);
			v = (v < 0) ? 0 : (v < 1) ? v : 1;
			if (fb.PlaybackTime != v * fb.PlaybackLength) fb.PlaybackTime = v * fb.PlaybackLength;
		}
		state["mouse_x"] = x;
		state["mouse_y"] = y;
		if (pref.hide_cursor) {
			window.ClearTimeout(hideCursor);
			hideCursor = window.SetTimeout(function () {
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
        } else {
            // str.timeline.mouse_in_this(x, y);
		}
		if (pref.show_volume_button) {
			volume_btn.on_mouse_move(x, y, m);
		}
	}
}

function on_mouse_wheel(delta) {
	if (state["mouse_y"] > wh - geo.lower_bar_h) {
		fb.PlaybackTime = fb.PlaybackTime - delta * pref.mouse_wheel_seek_speed;
		refresh_seekbar();
		return;
	}
	if (pref.show_volume_button) {
		volume_btn.on_mouse_wheel(delta);
	}
	if (displayPlaylist) {
		trace_call && console.log(qwr_utils.function_name());
		playlist.on_mouse_wheel(delta);
	} else if (displayLibrary) {
		// trace_call && console.log(qwr_utils.function_name());
		library.on_mouse_wheel(delta);
	}
}
// =================================================== //

// trace_call = true;

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
						fb.RunContextCommandWithMetadb('Playback Statistics/Rating/' + action, metadbList.Item(0));
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
	if (pref.show_transport) {
		createButtonObjects(ww, wh);
		window.RepaintRect(btns[2].x, btns[2].y, btns[2].w, btns[2].h); // redraw play/pause button
	}
	if (state) { // pausing
		if (progressTimer) window.ClearInterval(progressTimer);
		progressTimer = 0;
		window.RepaintRect(0.015 * ww, 0.12 * wh, Math.max(albumart_size.x - 0.015 * ww, 0.015 * ww), wh - geo.lower_bar_h - 0.12 * wh);
	} else { // unpausing
		if (progressTimer > 0) window.ClearInterval(progressTimer); // clear to avoid multiple progressTimers which can happen depending on the playback state when theme is loaded
		debugLog("on_playback_pause: creating refresh_seekbar() interval with delay = " + t_interval);
		progressTimer = window.SetInterval(function () {
			refresh_seekbar();
		}, t_interval);
	}

	pauseBtn.repaint();
	if (albumart && displayLyrics) { // if we are displaying lyrics we need to refresh all the lyrics to avoid tearing at the edges of the pause button
		window.RepaintRect(albumart_size.x + (albumart_size.w - lyricsWidth) / 2, albumart_size.y + pref.lyrics_h_padding, lyricsWidth, albumart_size.h - pref.lyrics_h_padding * 2);
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
		lastDiscNumber = "0";
		while (recordLabels.length) {
			disposeImg(recordLabels.pop());
        }
        while (recordLabelsInverted.length) {
            disposeImg(recordLabelsInverted.pop());
        }
		if (metadb_handle) {
			metadb_handle = null;
		}
		createButtonObjects(ww, wh); // switch pause button to play
		loadFromCache = false;
	}
	progressTimer && window.ClearInterval(progressTimer);
	if (globTimer)
		window.ClearTimeout(globTimer);
	if (albumart && ((pref.aa_glob && aa_list.length != 1) || last_path == '')) {
		debugLog("disposing artwork");
		albumart = null;
		albumart_scaled = disposeImg(albumart_scaled);
	}
    bandLogo = disposeImg(bandLogo);
    invertedBandLogo = disposeImg(invertedBandLogo);

	while (flagImgs.length > 0)
		disposeImg(flagImgs.pop());
	rotatedCD = disposeImg(rotatedCD);
	globTimer = 0;

	g_playtimer && window.ClearInterval(g_playtimer);
	g_playtimer = null;
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
	if (pref.hide_cursor) {
		window.SetCursor(-1); // hide cursor
	}
	createButtonObjects(ww, wh); // play button to pause
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
		tracknum: stoppedStr1,
		title_lower: '  ' + stoppedStr2,
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

// returned from LoadImageAsync
function on_load_image_done(cookie, image) {
	console.log('on_load_image_done returned');
	if (cookie == disc_art_loading) {
		disposeCDImg(cdart); // delay disposal so we don't get flashing
		cdart = art_cache.encache(image, cdartPath);
		ResizeArtwork(true);
		CreateRotatedCDImage();
		lastLeftEdge = 0; // recalc label location
	} else if (cookie == album_art_loading) {
		albumart = art_cache.encache(image, album_art_path);
		if (retrieveThemeColorsWhenLoaded && newTrackFetchingArtwork) {
			getThemeColors(albumart);
			retrieveThemeColorsWhenLoaded = false;
			newTrackFetchingArtwork = false;
		}
		ResizeArtwork(true);
		cdart && CreateRotatedCDImage();
		lastLeftEdge = 0; // recalc label location
		displayLyrics && updateLyricsPositionOnScreen();
	}
	RepaintWindow();
}

function on_script_unload() {
	console.log('Unloading Script');
	// it appears we don't need to dispose the images which we loaded using gdi.Image in their declaration for some reason. Attempting to dispose them causes a script error.
}

// Timed events

function on_playback_time() {
	// Refresh playback time
	str.time = $('%playback_time%');

	// at each new second, hundredth is reset to 0 (Increment on timer every 100ms)
	hundredth = 0;
	if (displayLyrics && g_lyrics_status == 0 && lyricsWidth > 0 && albumart_size.w > 0) {
		if (elap_seconds.Eval() == 3) {
			refresh_lyrics();
		}
		window.RepaintRect(albumart_size.x + (albumart_size.w - lyricsWidth) / 2, albumart_size.y + pref.lyrics_h_padding, lyricsWidth, albumart_size.h - pref.lyrics_h_padding * 2);
	}
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
	globTimer = window.SetTimeout(function () {
		doRotateImage();
	}, pref.art_rotate_delay * 1000);
}

function timerTick(id) {
	if (displayLyrics) {
		var t1 = elap_seconds.Eval() * 100 + hundredth;
		var t2 = len_seconds.Eval() * 100;
		var p1, p2;

		if (t1 > t2 - 200) {
			// stop scrolling in final 2 seconds to make sure we clear interval
			console.log('clearing g_playtimer because t1 > t2-200 - t1 = ' + t1 + ', t2 = ' + t2);
			g_playtimer && window.clearInterval(g_playtimer);
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

function createShadowRect(width, height) {
	var shadow = gdi.CreateImage(width + 2 * geo.aa_shadow, height + 2 * geo.aa_shadow);
	var shimg = shadow.GetGraphics();
	shimg.FillRoundRect(geo.aa_shadow, geo.aa_shadow, width, height, 0.5 * geo.aa_shadow, 0.5 * geo.aa_shadow, col.aa_shadow);
	shadow.ReleaseGraphics(shimg);
	shadow.StackBlur(geo.aa_shadow);

	return shadow;
}

// HELPER FUNCTIONS
function createDropShadow() {
	if (timings.showDebugTiming) shadow = fb.CreateProfiler("createDropShadow");
	if ((albumart && albumart_size.w > 0) || (cdart && pref.display_cdart && cdart_size.w > 0)) {
		disposeImg(shadow_image);
		if (cdart && !displayPlaylist && !displayLibrary && pref.display_cdart)
			shadow_image = gdi.CreateImage(cdart_size.x + cdart_size.w + 2 * geo.aa_shadow, cdart_size.h + 4 + 2 * geo.aa_shadow);
		else
			shadow_image = gdi.CreateImage(albumart_size.x + albumart_size.w + 2 * geo.aa_shadow, albumart_size.h + 2 * geo.aa_shadow);
		if (shadow_image) {
			shimg = shadow_image.GetGraphics();
			if (albumart) {
				shimg.FillRoundRect(geo.aa_shadow, geo.aa_shadow, albumart_size.x + albumart_size.w, albumart_size.h,
					0.5 * geo.aa_shadow, 0.5 * geo.aa_shadow, col.aa_shadow);
			}

			if (cdart && pref.display_cdart && !displayPlaylist && !displayLibrary) {
				var offset = cdart_size.w * 0.40; // don't change this value
				var xVal = cdart_size.x;
				var shadowOffset = geo.aa_shadow * 2;
				shimg.DrawEllipse(xVal + shadowOffset, shadowOffset + 1, cdart_size.w - shadowOffset, cdart_size.w - shadowOffset, geo.aa_shadow, col.aa_shadow); // outer shadow
				shimg.DrawEllipse(xVal + geo.aa_shadow + offset - 2, offset + geo.aa_shadow + 1, cdart_size.w - offset * 2, cdart_size.h - offset * 2, 60, col.aa_shadow); // inner shadow
			}
			shadow_image.ReleaseGraphics(shimg);
			shadow_image.StackBlur(geo.aa_shadow);
		}
	}

	if (timings.showDebugTiming) shadow.Print();
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

		progressTimer && window.ClearInterval(progressTimer);
		progressTimer = null;
		if (!fb.IsPaused) { // only create progressTimer if actually playing
			progressTimer = window.SetInterval(function () {
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
    var timezoneOffset = newDate.getTimezoneOffset();
	dontUpdateLastPlayed = dontUpdateLastPlayed || false;

	playedTimesRatios = [];
	var added = toTime($('$if2(%added_enhanced%,%added%)'));
    var first_played = toTime($('$if2(%first_played_enhanced%,%first_played%)'));
    var last_played = $('$if2(%last_played_enhanced%,%last_played%)');
	var today = dateToYMD(newDate);
	if (dontUpdateLastPlayed && $date(last_played) === today) {
		last_played = toTime(currentLastPlayed);
	} else {
		last_played = toTime(last_played);
    }
    /* first_played and last_played are already in local time, converting them to date objects treats
     * them as UTC time, and again adjusts to local time, so the timezone offset is applied twice.
     * therefore we need to add it back in here.
     */
    first_played += timezoneOffset * 60000;
    last_played += timezoneOffset * 60000;

	var lfmPlayedTimes = [];
	var playedTimes = [];
	if (componentEnhancedPlaycount) {
		var playedTimes = $('[%played_times_js%]', fb.GetNowPlaying());
		var lastfm = $('[%lastfm_played_times_js%]', fb.GetNowPlaying());
		var log = true;
		if (playedTimes == playedTimesJsonLast && lastfm == lfmPlayedTimesJsonLast) {
			log = false;    // cut down on spam
		}
		lfmPlayedTimesJsonLast = lastfm;
		playedTimesJsonLast = playedTimes;
		lfmPlayedTimes = parseJson(lastfm, 'lastfm: ', log);
		playedTimes = parseJson(playedTimes, 'foobar: ', log);
	} else {
		playedTimes.push(first_played);
		playedTimes.push(last_played);
	}

	if (added && first_played) {
		age = calcAge(added);

		tl_firstPlayedRatio = calcAgeRatio(first_played, age);
        tl_lastPlayedRatio = calcAgeRatio(last_played, age);
		if (tl_lastPlayedRatio < tl_firstPlayedRatio) {
			// due to daylight savings time, if there's a single play before the time changed lastPlayed could be < firstPlayed
			tl_lastPlayedRatio = tl_firstPlayedRatio;
		}

		if (playedTimes.length) {
			for (i = 0; i < playedTimes.length; i++) {
				var ratio = calcAgeRatio(playedTimes[i], age);
				playedTimesRatios.push(ratio);
            }
		} else {
			playedTimesRatios = [tl_firstPlayedRatio, tl_lastPlayedRatio];
		}

		var j = 0;
		var tempPlayedTimesRatios = playedTimesRatios.slice();
		tempPlayedTimesRatios.push(1.0001); // pick up every last.fm time after last_played fb knows about
		for (i = 0; i < tempPlayedTimesRatios.length; i++) {
			while (j < lfmPlayedTimes.length &&
				(ratio = calcAgeRatio(lfmPlayedTimes[j], age)) < tempPlayedTimesRatios[i]) {
				playedTimesRatios.push(ratio);
				j++;
			}
			if (ratio === tempPlayedTimesRatios[i]) { // skip one instance
				// console.log('skipped -->', ratio);
				j++;
			}
		}
		playedTimesRatios.sort();

		tl_firstPlayedRatio = playedTimesRatios[0];
		tl_lastPlayedRatio = playedTimesRatios[Math.max(0, playedTimesRatios.length - (dontUpdateLastPlayed ? 2 : 1))];
	} else {
		tl_firstPlayedRatio = 0.33;
		tl_lastPlayedRatio = 0.66;
	}
	str.timeline.setPlayTimes(tl_firstPlayedRatio, tl_lastPlayedRatio, playedTimesRatios);
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
		album_art_loading = gdi.LoadImageAsync(window.ID, aa_list[index]);
		album_art_path = aa_list[index];
		if (index === 0) {
			retrieveThemeColorsWhenLoaded = true;
		}
	}
	ResizeArtwork(false); // recalculate image positions
	if (cdart) {
		CreateRotatedCDImage();
	}
	displayLyrics && updateLyricsPositionOnScreen();
}

function fisherYates(myArray) {
	var i = myArray.length;
	if (i == 0) return false;
	while (--i) {
		var j = Math.floor(Math.random() * (i + 1));
		var tempi = myArray[i];
		var tempj = myArray[j];
		myArray[i] = tempj;
		myArray[j] = tempi;
	}
}

/* I use the debugLog function instead of console.log so that I can easily hide messages that I don't want cluttering the console constantly */
function debugLog(str) {
	if (pref.show_debug_log) console.log(str);
}

function disposeImg(oldImage) {
	if (oldImage)
		oldImage.Dispose();
	return null;
}

function disposeCDImg(cdImage) {
	cdart_size = new ImageSize(0, 0, 0, 0);
	// disposeImg(cdImage);
	return null;
}

function CreateRotatedCDImage() {
	rotatedCD = disposeImg(rotatedCD);
	if (pref.display_cdart) { // drawing cdArt rotated is slow, so first draw it rotated into the rotatedCD image, and then draw rotatedCD image unrotated in on_paint
        if (cdart && cdart_size.w > 0) { // cdart must be square so just use cdart_size.w (width)
			rotatedCD = gdi.CreateImage(cdart_size.w, cdart_size.w);
			rotCDimg = rotatedCD.GetGraphics();
			trackNum = parseInt(fb.TitleFormat('$num($if(' + tf.vinyl_tracknum + ',$sub($mul(' + tf.vinyl_tracknum + ',2),1),$if2(%tracknumber%,1)),1)').Eval()) - 1;
			if (!pref.rotate_cdart || trackNum != trackNum) trackNum = 0; // avoid NaN issues when changing tracks rapidly
			rotCDimg.DrawImage(cdart, 0, 0, cdart_size.w, cdart_size.h, 0, 0, cdart.Width, cdart.Height, trackNum * pref.rotation_amt, 255);
			rotatedCD.ReleaseGraphics(rotCDimg);
		}
	}
}

function ResizeArtwork(resetCDPosition) {
	debugLog('Resizing artwork');
	var hasArtwork = false;
	if (albumart && albumart.Width && albumart.Height) {
		// Size for big albumart
		var album_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.47 * ww : 0.75 * ww) / albumart.Width,
								   (wh - geo.top_art_spacing - geo.lower_bar_h - 32) / albumart.Height);
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
		if (album_scale !== (wh - geo.top_art_spacing - geo.lower_bar_h - 32) / albumart.Height) {
			// restricted by width
			var y = geo.top_art_spacing + Math.floor(((wh - geo.top_art_spacing - geo.lower_bar_h - 32) / 2) - albumart_size.h / 2);
			albumart_size.y = Math.min(y, scaleForDisplay(150) + 10);	// 150 or 300 + 10? Not sure where 160 comes from
		} else {
			albumart_size.y = geo.top_art_spacing; // height of menu bar + spacing + height of Artist text (32+32+32)	// top
		}
		if (btns.playlist && albumart_size.x + albumart_size.w > btns.playlist.x - 50) {
			albumart_size.y += 16 - pref.show_transport * 6;
		}

		if (albumart_scaled) {
			albumart_scaled.Dispose();
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
			var album_scale = Math.min(((displayPlaylist || displayLibrary) ? 0.47 * ww : 0.75 * ww) / cdart.Width, (wh - geo.top_art_spacing - geo.lower_bar_h - 32) / cdart.Height);
			if (displayPlaylist || displayLibrary) {
				xCenter = 0.25 * ww;
			} else if (ww / wh < 1.40) { // when using a roughly 4:3 display the album art crowds, so move it slightly off center
				xCenter = 0.56 * ww; // TODO: check if this is still needed?
			} else {
				xCenter = 0.5 * ww;
				art_off_center = false;
				if (album_scale == 0.75 * ww / cdart.Width) {
					xCenter += 0.1 * ww;
					art_off_center = true; // TODO: We should probably suppress labels in this case
				}
			}
			cdart_size.w = Math.floor(cdart.Width * album_scale); // width
			cdart_size.h = Math.floor(cdart.Height * album_scale); // height
			cdart_size.x = Math.floor(xCenter - 0.5 * cdart_size.w); // left
			if (album_scale !== (wh - geo.top_art_spacing - geo.lower_bar_h - 32) / cdart.Height) {
				// restricted by width
				var y = geo.top_art_spacing + Math.floor(((wh - geo.top_art_spacing - geo.lower_bar_h - 32) / 2) - cdart_size.h / 2);
				cdart_size.y = Math.min(y, 160);
			} else {
				cdart_size.y = geo.top_art_spacing; // height of menu bar + spacing + height of Artist text (32+32+32)	// top
			}
			pauseBtn.setCoords(cdart_size.x + cdart_size.w / 2, cdart_size.y + cdart_size.h / 2);
			hasArtwork = true;
		}
	} else {
		cdart_size = new ImageSize(0, 0, 0, 0);
	}
	if (hasArtwork && !pref.darkMode) {
		createDropShadow();
	} else {
		if (displayLibrary || displayPlaylist) {
			pauseBtn.setCoords(ww * (0.33 + .167 / 2), wh / 2);
		} else {
			pauseBtn.setCoords(ww / 2, wh / 2);
		}
	}
}

function LoadCountryFlags() {
	while (flagImgs.length) {
		disposeImg(flagImgs.pop());
	}
	for (i = 0; i < $('$meta_num(' + tf.artist_country + ')'); i++) {
		path = $(pref.flags_base) + (is_4k ? '64\\' : '32\\') + $('$meta(' + tf.artist_country + ',' + i + ')').replace(/ /g, '-') + '.png';
		var fImg = gdi.Image(path);
		fImg && flagImgs.push(fImg);
	}
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
	recordLabel = null;
	d = new Date();
	labelStr = replaceFileChars(publisherString);
	if (labelStr) {
		/* First check for record label folder */
		lastSrchYear = d.getFullYear();
		dir = pref.label_base; // also used below
		if (IsFolder(dir + labelStr) ||
			IsFolder(dir + (labelStr = labelStr.replace(/ Records$/, '')
                    .replace(/ Recordings$/, '')
                    .replace(/ Music$/, '')
                    .replace(/\.$/, '')))) {
			year = parseInt($('$year(%date%)'));
			for (; year <= lastSrchYear; year++) {
				yearFolder = dir + labelStr + '\\' + year;
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
		label = dir + labelStr + '.png';
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
	if (timings.showDebugTiming) artworkTime = fb.CreateProfiler('fetchNewArtwork');
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
			var temp_cdart;
			if (loadFromCache)
				temp_cdart = art_cache.getImage(cdartPath);
			if (temp_cdart) {
				disposeCDImg(cdart);
				cdart = temp_cdart;
				ResizeArtwork(true);
				CreateRotatedCDImage();
			} else {
				disc_art_loading = gdi.LoadImageAsync(window.ID, cdartPath);
			}
		} else {
			cdart = disposeCDImg(cdart);
		}
	}
	if (timings.showDebugTiming) artworkTime.Print();

	if (isStreaming) {
		cdart = disposeCDImg(cdart);
		albumart = utils.GetAlbumArtV2(metadb);
		getThemeColors(albumart);
		ResizeArtwork(true);
	} else {
		for (k = 0; k < tf.glob_paths.length; k++) {
			aa_list = aa_list.concat(utils.Glob($(tf.glob_paths[k])).toArray());
		}
		pattern = /(cd|vinyl)([0-9]*|[a-h])\.png/i;
		// remove duplicates and cd/vinyl art
		aa_list = _.remove(_.uniq(aa_list), function (path) {
			return !pattern.test(path);
		});
		imageTest = /jpg|png$/i
		aa_list = _.remove(aa_list, function (path) {
			return imageTest.test(path);
		})

		if (aa_list.length) {
			noArtwork = false;
			if (aa_list.length > 1 && pref.aa_glob) {
				globTimer = window.SetTimeout(function () {
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
	if (timings.showDebugTiming) artworkTime.Print();
}


function RepaintWindow() {
	debugLog("Repainting from RepaintWindow()");
	window.Repaint();
}

function createHyperlinks() {
	hyperlinks = [];
}

function createButtonObjects(ww, wh) {
	btns = [];

	if (ww <= 0 || wh <= 0) {
		return;
	} else if (typeof btnImg === 'undefined') {
		createButtonImages();
	}

	//---> Transport buttons
	if (pref.show_transport) {
		var count = 4 + (pref.show_random_button ? 1 : 0) + (pref.show_volume_button ? 1 : 0) + (pref.show_reload_button ? 1 : 0);

		var y = scaleForDisplay(10);
		var w = scaleForDisplay(32);
		var h = w;
		var p = scaleForDisplay(5); // space between buttons
		var x = (ww - w * count - p * (count - 1)) / 2;

		count = 0;

		btns[count] = new Button(x, y, w, h, "Stop", btnImg.Stop, "Stop");
		btns[++count] = new Button(x + (w + p) * count, y, w, h, "Previous", btnImg.Previous, 'Previous');
		btns[++count] = new Button(x + (w + p) * count, y, w, h, "Play/Pause", (fb.IsPlaying ? (fb.IsPaused ? btnImg.Play : btnImg.Pause) : btnImg.Play), 'Play');
		btns[++count] = new Button(x + (w + p) * count, y, w, h, "Next", btnImg.Next, 'Next');
		if (pref.show_random_button) {
			btns[++count] = new Button(x + (w + p) * count, y, w, h, "Playback/Random", btnImg.PlaybackRandom, 'Randomize Playlist');
		}
		if (pref.show_volume_button) {
			btns[++count] = new Button(x + (w + p) * count, y, w, h, 'Volume', btnImg.ShowVolume);
			volume_btn.set_position(x + (w + p) * count, y, w);
		}
		if (pref.show_reload_button) {
			btns[++count] = new Button(x + (w + p) * count, y, w, h, "Reload", btnImg.Reload, 'Reload');
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
	//---> Menu buttons

	var img = btnImg.File;
	var x = 5;
	var y = 5;
	var h = img[0].Height;
	var w = img[0].Width;
	//var p = 0;

	btns[20] = new Button(x, y, w, h, 'File', img);
	var img = btnImg.Edit;
	var x = x + w;
	var w = img[0].Width;
	btns[21] = new Button(x, y, w, h, 'Edit', img);
	var img = btnImg.View;
	var x = x + w;
	var w = img[0].Width;
	btns[22] = new Button(x, y, w, h, 'View', img);
	var img = btnImg.Playback;
	var x = x + w;
	var w = img[0].Width;
	btns[23] = new Button(x, y, w, h, 'Playback', img);
	var img = btnImg.Library;
	var x = x + w;
	var w = img[0].Width;
	btns[24] = new Button(x, y, w, h, 'Library', img);
	var img = btnImg.Help;
	var x = x + w;
	var w = img[0].Width;
	btns[25] = new Button(x, y, w, h, 'Help', img);
	var img = btnImg.Playlists;
	var x = x + w;
	var w = img[0].Width;
	btns[26] = new Button(x, y, w, h, 'Playlists', img);
	var img = btnImg.Options;
	var x = x + w;
	var w = img[0].Width;
	btns[27] = new Button(x, y, w, h, 'Options', img);

	var img = btnImg.Settings;
	var x = ww - settingsImg.width * 2;
	var y = 15;
	var h = img[0].height;
	var w = img[0].width;
	btns[30] = new Button(x, y, w, h, 'Settings', img, 'Foobar Settings');
	var img = btnImg.Properties;
	var w = img[0].width;
	x -= (w + 10);
	btns[31] = new Button(x, y, w, h, 'Properties', img, 'Properties');
	var img = btnImg.Rating;
	var w = img[0].width;
	x -= (w + 10);
	btns[32] = new Button(x, y, w, h, 'Rating', img, 'Rate Song');
	var img = btnImg.Lyrics;
	var w = img[0].width;
	x -= (w + 10);
	btns[33] = new Button(x, y, w, h, 'Lyrics', img, 'Display Lyrics');
	if (showLibraryButton) {
		var img = btnImg.ShowLibrary;
		var w = img[0].width;
		x -= (w + 10);
		btns.library = new Button(x, y, w, h, 'ShowLibrary', img, 'Show Library');
	}
	var img = btnImg.Playlist;
	var w = img[0].width;
	x -= (w + 10);
	btns.playlist = new Button(x, y, w, h, 'Playlist', img, 'Show Playlist');
	/* if a new image button is added to the left of playlist we need to update the ResizeArtwork code */
}

// =================================================== //

function createButtonImages() {
	if (timings.showExtraDrawTiming) createButtonTime = fb.CreateProfiler('createButtonImages');

	try {
		var btn = {

			Stop: {
				ico: g_guifx.stop,
				font: ft.guifx,
				type: 'transport',
				w: 30,
				h: 30
			},
			Previous: {
				ico: g_guifx.previous,
				font: ft.guifx,
				type: 'transport',
				w: 30,
				h: 30
			},
			Play: {
				ico: g_guifx.play,
				font: ft.guifx,
				type: 'transport',
				w: 30,
				h: 30
			},
			Pause: {
				ico: g_guifx.pause,
				font: ft.guifx,
				type: 'transport',
				w: 30,
				h: 30
			},
			Next: {
				ico: g_guifx.next,
				font: ft.guifx,
				type: 'transport',
				w: 30,
				h: 30
			},
			PlaybackRandom: {
				ico: g_guifx.shuffle,
				font: ft.guifx,
				type: 'transport',
				w: 30,
				h: 30
			},
			ShowVolume: {
				ico:  g_guifx.volume_up,
				font: ft.guifx,
				type: 'transport',
				w: 30,
				h: 30
			},
			Reload: {
				ico: g_guifx.power,
				font: ft.guifx,
				type: 'transport',
				w: 30,
				h: 30
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
				type: "menu"
			},
			Edit: {
				ico: "Edit",
				font: ft.SegoeUi,
				type: "menu"
			},
			View: {
				ico: "View",
				font: ft.SegoeUi,
				type: "menu"
			},
			Playback: {
				ico: "Playback",
				font: ft.SegoeUi,
				type: "menu"
			},
			Library: {
				ico: "Library",
				font: ft.SegoeUi,
				type: "menu"
			},
			Help: {
				ico: "Help",
				font: ft.SegoeUi,
				type: "menu"
			},
			Playlists: {
				ico: "Playlists",
				font: ft.SegoeUi,
				type: "menu"
			},
			Options: {
				ico: "Options",
				font: ft.SegoeUi,
				type: "menu"
			},


			Playlist: {
				ico: playlistImg,
				type: 'image',
				w: playlistImg.width,
				h: playlistImg.height
			},
			ShowLibrary: {
				ico: libraryImg,
				type: 'image',
				w: libraryImg.width,
				h: libraryImg.height
			},
			Lyrics: {
				ico: lyricsImg,
				type: 'image',
				w: lyricsImg.width,
				h: lyricsImg.height
			},
			Rating: {
				ico: ratingsImg,
				type: 'image',
				w: ratingsImg.width,
				h: ratingsImg.height
			},
			Properties: {
				ico: propertiesImg,
				type: 'image',
				w: propertiesImg.width,
				h: propertiesImg.height
			},
			Settings: {
				ico: settingsImg,
				type: 'image',
				w: settingsImg.width,
				h: settingsImg.height
			},
		};
	} catch (e) {
		var str = pref.lyrics_img;
		console.log("**********************************");
		console.log("ATTENTION: Buttons could not be created, most likely because the images were not found in \"" + str.substring(0, str.lastIndexOf("/")) + '\"');
		console.log("Make sure you installed the theme correctly to your configuration folder.")
		console.log("**********************************");
	}


	btnImg = [];

	for (var i in btn) {

		if (btn[i].type === 'menu') {
			var img = gdi.CreateImage(100, 100);
			g = img.GetGraphics();

			var measurements = g.MeasureString(btn[i].ico, btn[i].font, 0, 0, 0, 0);
			btn[i].w = Math.ceil(measurements.Width + 20);
			img.ReleaseGraphics(g);
			img.Dispose();
			btn[i].h = Math.ceil(measurements.Height + 5);
		}

		var w = btn[i].w
		h = btn[i].h,
			lw = 2;

		if (is_4k && btn[i].type === 'transport') {
			w *= 2;
			h *= 2;
		} else if (is_4k && btn[i].type !== 'menu') {
			w = Math.round(btn[i].w * 1.5);
			h = Math.round(btn[i].h * 1.6);
		} else if (is_4k) {
			w += 20;
			h += 10;
		}

		var stateImages = []; //0=normal, 1=hover, 2=down;

		for (var s = 0; s <= 2; s++) {

			var img = gdi.CreateImage(w, h);
			g = img.GetGraphics();
			g.SetSmoothingMode(SmoothingMode.AntiAlias);
			if (btn[i].type !== 'transport') {
				g.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit); // positions playback icons weirdly
			} else {
                g.SetTextRenderingHint(TextRenderingHint.AntiAlias)
            }

			var menuTextColor = RGB(140, 142, 144);
			var menuRectColor = RGB(120, 122, 124);
			var captionIcoColor = RGB(140, 142, 144);
			var playbackIcoColor = RGB(150, 152, 154);
			var playbackEllypseColor = RGB(80, 80, 80);
			var iconAlpha = 140;

			if (s == 1) {
				menuTextColor = RGB(180, 182, 184);
				menuRectColor = RGB(160, 162, 164);
				captionIcoColor = RGB(190, 192, 194);
				playbackIcoColor = RGB(190, 192, 194);
				playbackEllypseColor = RGB(190, 195, 200);
				iconAlpha = 215;
			} else if (s == 2) {
				menuTextColor = RGB(120, 122, 124);
				menuRectColor = RGB(110, 112, 114);
				captionIcoColor = RGB(100, 102, 104);
				playbackIcoColor = RGB(90, 90, 90);
				playbackEllypseColor = RGB(80, 80, 80);
				iconAlpha = 190;
			}

			//--->
			if (btn[i].type == 'menu') {
				s && g.DrawRoundRect(Math.floor(lw / 2), Math.floor(lw / 2), w - lw, h - lw, 3, 3, 1, menuRectColor);
				g.DrawString(btn[i].ico, btn[i].font, menuTextColor, 0, 0, w, h - 1, StringFormat(1, 1));
			} else if (btn[i].type == 'caption') {
				g.DrawString(btn[i].ico, btn[i].font, captionIcoColor, 0, 0, w, h, StringFormat(1, 1));
			} else if (btn[i].type == 'transport') {
				g.DrawEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, lw, playbackEllypseColor);
				g.DrawString(btn[i].ico, btn[i].font, playbackIcoColor, 1, (i == 'Stop' || i == 'Reload') ? 0 : 1, w, h, StringFormat(1, 1));
			} else if (btn[i].type == 'image') {
				g.DrawImage(btn[i].ico, Math.round((w - btn[i].ico.width) / 2), Math.round((h - btn[i].ico.height) / 2), btn[i].ico.width, btn[i].ico.height, 0, 0, btn[i].ico.width, btn[i].ico.height, 0, iconAlpha);
			}
			//--->

			img.ReleaseGraphics(g);
			stateImages[s] = img;

		}

		btnImg[i] = stateImages;

	}
	if (timings.showExtraDrawTiming) createButtonTime.Print();
}

// =================================================== //

function resizeDone() {
	console.log("resizeDone()");
	// to speed up draw times, we scale the bg image once, and then draw it without scaling in on_paint which is up to 3-4x faster

	progressMoved = true;
	SetProgressBarRefresh();
	window.Repaint();
	if (displayPlaylist && listLength) {
		getAlbumArt();
	}
}
