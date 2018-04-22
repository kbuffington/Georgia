/// <reference path="../jscript_api/Interfaces.js" />

//
// Georgia
//
// Description  a fullscreen now-playing script for foo_jscript_panel
// Author 		Mordred
// Version 		0.9.0
// Dev. Started 2017-12-22
// Last change  2017-12-27
// --------------------------------------------------------------------------------------

// CONFIGURATION //////////////////////////////////////

var themeBaseName = "Georgia"; // this is the base name of the theme, and will be used for finding some of the theme's files in the configuration folder.

var tf	 = {}; // titleformating strings
var ft	 = {}; // fonts
var col	 = {}; // colours
var geo	 = {}; // sizes
var pref = {}; // preferences

// THEME PREFERENCES/PROPERTIES EXPLANATIONS - After initial run, these values are changed in Options Menu or by Right Click >> Properties and not here!
pref.locked 			= window.GetProperty("Lock theme", false);						// true: prevent changing theme with right click
pref.rotation_amt 		= window.GetProperty("Art: Degrees to rotate CDart", 3);			// # of degrees to rotate per track change.
pref.aa_glob			= window.GetProperty("Art: Cycle through all images", true);		// true: use glob, false: use albumart reader (front only)
pref.display_cdart 		= window.GetProperty("Art: Display CD art", true);				// true: show CD artwork behind album artwork. This artwork is expected to be named cd.png and have transparent backgrounds (can be found at fanart.tv)
pref.max_cache_size		= window.GetProperty("Art: Max image cache size (in MB)", 50); 	// maximum size of the image cache directory. Maximum size is 250 MB.
pref.t_aa_glob			= window.GetProperty("Art: Seconds to display each art", 30);		// seconds per image
pref.rotate_cdart		= window.GetProperty("Art: Rotate CD art on new track", true);		// true: rotate cdArt based on track number. i.e. rotationAmt = %tracknum% * x degrees
pref.cdart_ontop		= window.GetProperty("Art: Show CD art above front cover", false);	// true: display cdArt above front cover
pref.cache_images		= window.GetProperty("Art: Cache artwork locally", false);		// true: don't attempt to reload images if album/folder hasn't changed from last track; false: reload all images each new track
pref.hide_cursor    	= window.GetProperty("Hide Cursor when stationary", true);     // true: hide cursor when not moving, false: don't
pref.generate_theme		= window.GetProperty("Theme: Generate custom theme from artwork", true);      // true: generate a new theme for artwork, false: use built in themes
// pref.show_codec_img		= window.GetProperty("Show images for codecs", true);				// true: show the icon for individual codecs in upper right corner
// pref.show_mp3_codec		= window.GetProperty("Show MP3 codec image", false);				// true: show the codec icon for mp3s
pref.show_flags			= window.GetProperty("Show country flags", true);					// true: show the artist country flags
pref.check_multich		= window.GetProperty("Check for MultiChannel version", false);	// true: search paths in tf.MultiCh_paths to see if there is a multichannel version of the current album available
pref.use_vinyl_nums		= window.GetProperty("Use vinyl style numbering (e.g. A1)",true);	// true: if the tags specified in tf.vinyl_side and tf.vinyl_tracknum are set, then we'll show vinyl style track numbers (i.e. "B2." instead of "04.")
pref.start_Playlist		= window.GetProperty("Display playlist on startup", false);		// true: show the playlist window when the theme starts up
pref.show_transport		= window.GetProperty("Show transport controls", false);			// true: show the play/pause/next/prev/random buttons at the top of the screen
pref.freq_update		= window.GetProperty("Frequent progress bar updates", true);	// true: update progress bar multiple times a second. Smoother, but uses more CPU
pref.time_zone          = window.GetProperty("Time-zone (formatted +/-HH:MM, e.g. -06:00)", "+00:00");  // used to create accurate timezone offsets. 'Z', '-06:00', '+06:00', etc. are all valid values
if (pref.t_aa_glob < 5) {
	pref.t_aa_glob = 5;
	window.SetProperty("Art: Seconds to display each art", pref.t_aa_glob);
}
if (pref.max_cache_size < 0) {
	pref.max_cache_size = 0;
	window.SetProperty("Art: Max image cache size (in MB)", pref.max_cache_size);
}

// Lyrics Properties
var FONT_SIZE			= window.GetProperty("Lyrics: Font size", 12);
var LINE_HEIGHT			= window.GetProperty("Lyrics: Line height", 24);
var TEXT_SHADOW			= window.GetProperty("Lyrics: Text shadow", true);
var TXT_GLOW_COLOUR 	= window.GetProperty("Lyrics: Text glow color", "RGBA(040, 040, 040, 255);");
var TXT_NORMAL_COLOUR 	= window.GetProperty("Lyrics: Text Color", "RGBA(255, 255, 255, 255);");
var TXT_FOCUS_COLOUR 	= window.GetProperty("Lyrics: Text Highlite Color", "RGBA(255, 241, 150, 255);");
var H_PADDING			= window.GetProperty("Lyrics: Padding Between Lines", 20);
var TEXT_GLOW			= window.GetProperty("Lyrics: Glow enabled", true);
var TXT_ALIGN			= "center";

//Tag Properties
tf.artist			= window.GetProperty("Tag Fields: Artist String", "%artist%");
tf.artist_country 	= window.GetProperty("Tag Fields: Country", "%artistcountry%");	// we call meta_num(artistcountry) so don't wrap this in % signs
tf.disc				= window.GetProperty("Tag Fields: Disc String", "$ifgreater(%totaldiscs%,1,CD %discnumber%/%totaldiscs%,)");
tf.disc_subtitle 	= window.GetProperty("Tag Fields: Disc Subtitle", "%discsubtitle%");
tf.year				= window.GetProperty("Tag Fields: Year", "$puts(d,$if2(%original release date%,%date%))$if($strcmp($year($get(d)),$get(d)),$get(d),)");
tf.date				= window.GetProperty("Tag Fields: Date", "$puts(d,$if2(%original release date%,%date%))$if($strcmp($year($get(d)),$get(d)),,$get(d))");
tf.last_played		= window.GetProperty("Tag Fields: Last Played", "$ifgreater(%lastfm_last_played%,%last_played%,[%lastfm_last_played%],[%last_played%])");
tf.title			= window.GetProperty("Tag Fields: Song Title String", "%title%[ '('%original artist%' cover)'][ '['%translation%']']");
tf.vinyl_side		= window.GetProperty("Tag Fields: Vinyl Side", "%vinyl side%");			// the tag used for determining what side a song appears on for vinyl releases - i.e. song A1 has a %vinyl side% of "A"
tf.vinyl_tracknum 	= window.GetProperty("Tag Fields: Vinyl Track#", "%vinyl tracknumber%");	// the tag used for determining the track number on vinyl releases i.e. song A1 has %vinyl tracknumber% set to "1"
tf.translation		= window.GetProperty("Tag Fields: Translated song title", "%translation%");
tf.album_trans		= window.GetProperty("Tag Fields: Translated album title", "%albumtranslation%");
tf.edition			= window.GetProperty("Tag Fields: Edition", "[$if(%original release date%,$ifequal($year(%original release date%),$year(%date%),,$year(%date%) ))%edition%]");
var componentEnhancedPlaycount = utils.CheckComponent("foo_enhanced_playcount", true);
if (componentEnhancedPlaycount) {
	console.log('foo_enhanced_playcount: loaded');
}
tf.played_times      = window.GetProperty("Tag Fields: All Played Times", "$if($strcmp(%played_times%,'[]'),,%played_times%)");
tf.last_fm_plays     = window.GetProperty("Tag Fields: All Last.Fm Played Times", "$if($strcmp(%lastfm_played_times_js%,'[]'),,%lastfm_played_times_js%)");
tf.artist_country = tf.artist_country.replace('%', '');	// need to strip %'s because we use meta_num on this field

// TEXT FIELDS
var stoppedStr1		= 'foobar2000';
var stoppedStr2		= 'plays music';
tf.tracknum			= '[%tracknumber%.]';
tf.title_trans 		= "%title%[ '['" + tf.translation + "']']";
tf.vinyl_track		= '$if2(' + tf.vinyl_side + '[' + tf.vinyl_tracknum + ']. ,[%tracknumber%. ])';
tf.vinyl_title		= tf.vinyl_track + "%title%[ '['"+ tf.translation + "']']";

/* My ridiculous artist string:
tf.artist		= "$ifgreater($meta_num(ArtistFilter),1,$puts(mArtist,$meta(ArtistFilter,0))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$get(mArtist)\
$if($stricmp($get(mArtist),%artist%),$puts(feat,1),)\
$puts(mArtist,$meta(ArtistFilter,1))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$if($get(feat), feat. ,', ')$get(mArtist)\
$puts(mArtist,$meta(ArtistFilter,2))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),3,' & ',', ')$get(mArtist)\
$puts(mArtist,$meta(ArtistFilter,3))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),4,' & ',', ')$get(mArtist)\
)))))))),%artist%)";

In one line for adding to properties:
$ifgreater($meta_num(ArtistFilter),1,$puts(mArtist,$meta(ArtistFilter,0))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$get(mArtist)$if($stricmp($get(mArtist),%artist%),$puts(feat,1),)$puts(mArtist,$meta(ArtistFilter,1))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$if($get(feat), feat. ,', ')$get(mArtist)$puts(mArtist,$meta(ArtistFilter,2))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),3,' & ',', ')$get(mArtist)$puts(mArtist,$meta(ArtistFilter,3))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),4,' & ',', ')$get(mArtist))))))))),%artist%)
*/

tf.grid = [ // simply add, change or remove entries to change grid layout
	// { label: 'Title',        val: tf.title },
	{ label: 'Disc',		 val: "$if("+ tf.disc_subtitle +",[Disc %discnumber% - ]"+ tf.disc_subtitle +")" },
	{ label: 'Release Type', val: "$if($strstr(%releasetype%,Album),,[%releasetype%])" },
	{ label: 'Year',         val: tf.year },
	{ label: 'Release Date', val: tf.date, age: true },
	{ label: 'Edition', 	 val: tf.edition },
	{ label: 'Label',		 val: '[%label%]' },
	{ label: 'Catalog #',    val: '[%catalognumber%]' },
	{ label: 'Track',		 val: "$if(%tracknumber%,$num(%tracknumber%,1)$if(%totaltracks%,/$num(%totaltracks%,1))$ifgreater(%totaldiscs%,1,   CD %discnumber%/$num(%totaldiscs%,1),)" },
	{ label: 'Genre',		 val: '[%genre%]' },
	{ label: 'Style',		 val: '[%style%]' },
	{ label: 'Release',		 val: '[%release%]' },
	{ label: 'Codec',   	 val: "[$if($not($strstr(%codec%,'MP3')),%codec% $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0)))]" },
	{ label: 'Added', 		 val: '[$date(%added%)]', age: true },
	{ label: 'Last Played',  val: '['+ tf.last_played + ']', age: true },
	{ label: 'URL',		     val: "$if(%source webpage url%,$left($put(url,$replace(%source webpage url%,'http://',,www.,)),$sub($strchr($get(url),/),1)))$if($and(%source webpage url%,%www%),', ')$if(%www%,$left($put(url,$replace(%www%,'http://',,www.,)),$sub($strchr($get(url),/),1)))" },
	{ label: 'Hotness',	     val: "$puts(X,5)$puts(Y,$div(%_dynamic_rating%,400))$repeat($repeat(I,$get(X))   ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))$ifgreater(%_dynamic_rating%,0,   $replace($div(%_dynamic_rating%,1000)'.'$mod($div(%_dynamic_rating%,100),10),0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9),)" },
	{ label: 'Play Count',   val: "$if(%play_count%,$puts(X,5)$puts(Y,$max(%play_count%,%lastfm_play_count%))$repeat($repeat(I,$get(X)) ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))   $get(Y))" },
	// { label: 'Last.fm Count',val: '[%lastfm_play_count%]' },
	// { label: 'Played Times', val: '[' + tf.played_times + ']' },
	// { label: 'Last.fm Plays',val: '[' + tf.last_fm_plays + ']' },
	{ label: 'Rating', 	     val: "$if(%rating%,$repeat(\u2605 ,%rating%))" },
    { label: 'Mood',		 val: "$if(%mood%,$puts(X,5)$puts(Y,$mul(5,%mood%))$repeat($repeat(I,$get(X))   ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))$replace(%mood%,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9))" },
    // { label: 'test', val: "$ifgreater(%lastfm_last_played%,%last_played%,[LFP: %lastfm_last_played%],[LP: %last_played%])" },
    //val: "$put(LP,$left(%last_played%,4)) $put(LFP,$left(%lastfm_last_played%,4)) $ifgreater($num($get(LP),4),$num($get(LFP),4),%last_played%,%lastfm_last_played%)"}
];
tf.lyrics		= "[$if2(%LYRICS%,$if2(%LYRIC%,$if2(%UNSYNCED LYRICS%,%UNSYNCED LYRIC%)))]";

// GLOB PICTURES
tf.glob_paths = Array( // simply add, change or re-order entries as needed
	"$replace(%path%,%filename_ext%,)folder*",
	"$replace(%path%,%filename_ext%,)*.jpg",
	"$replace(%path%,%filename_ext%,)*.png",
	"$replace(%path%,%directoryname%\\%filename_ext%,)folder*"	// all folder images in parent directory
);

tf.lyr_path = Array( // simply add, change or re-order entries as needed
	"$replace($replace(%path%,%filename_ext%,),\,\\)",
	fb.ProfilePath+"lyrics\\",
	"\\\\Ripley\\Dirs\\lyrics\\"
);
tf.lyr_artist	= "$replace(%artist%,'/','_',':','_','\"','_')";	// we need to strip some special characters so we can't use just use tf.artist
tf.lyr_title 	= "$replace(%title%,'/','_',':','_','\"','_')"; 	// we need to strip special characters so we can't just use tf.title
tf.lyr_filename	= Array( // filename to search for of lyrics files. Both .lrc and .txt will be searched for each entry in this list
	tf.lyr_artist + " - " + tf.lyr_title,
	tf.lyr_artist + " -" + tf.lyr_title
);

tf.labels = Array(	// Array of fields to test for publisher. Add, change or re-order as needed.
	"label",				// DO NOT put %s around the field names because we are using $meta() calls
	"publisher"
);

// CD-ART SETTINGS
// we expect cd-art will be in .png with transparent background, best found at fanart.tv.
pref.vinylside_path	= "$replace(%path%,%filename_ext%,)vinyl$if2(" + tf.vinyl_side + ",).png"		// vinyl cdart named vinylA.png, vinylB.png, etc.
pref.vinyl_path		= "$replace(%path%,%filename_ext%,)vinyl.png"		// vinyl cdart named vinylA.png, vinylB.png, etc.
pref.cdartdisc_path	= "$replace(%path%,%filename_ext%,)cd$ifgreater(%totaldiscs%,1,%discnumber%,).png";	// cdart named cd1.png, cd2.png, etc.
pref.cdart_path		= "$replace(%path%,%filename_ext%,)cd.png";											// cdart named cd.png  (the far more common single disc albums)
pref.cdart_amount	= 0.48;		// show 48% of the CD image if it will fit on the screen

pref.display_menu	= true;		// true: show the menu bar at the top of the theme (only useful in CUI); false: don't show menu bar

// FONTS
testFont('HelveticaNeueLT Std');
testFont('HelveticaNeueLT Std Thin');
testFont('HelveticaNeueLT Std Med');
testFont('HelveticaNeueLT Std Lt');
testFont('Guifx v2 Transports');
ft.album_lrg			= gdi.Font('HelveticaNeueLT Std', 36, 0);
ft.album_med 			= gdi.Font('HelveticaNeueLT Std', 32, 0);
ft.album_sml 			= gdi.Font('HelveticaNeueLT Std', 28, 0);
ft.title_lrg			= gdi.Font('HelveticaNeueLT Std Thin', 34, 0);
ft.title_med 			= gdi.Font('HelveticaNeueLT Std Thin', 30, 0);
ft.title_sml 			= gdi.Font('HelveticaNeueLT Std Thin', 26, 0);
ft.year					= gdi.Font('HelveticaNeueLT Std', 48, 1);
ft.artist				= gdi.Font('HelveticaNeueLT Std Med', 40, 0);
ft.track_info			= gdi.Font('HelveticaNeueLT Std Thin', 18, 0);
ft.grd_key   			= gdi.Font('HelveticaNeueLT Std', 18, 0);
ft.grd_val				= gdi.Font('HelveticaNeueLT Std Lt', 18, 0);
ft.grd_key_lg			= gdi.Font('HelveticaNeueLT Std', 24, 0);		// used instead of ft.grd_key if ww > 1280
ft.grd_val_lg			= gdi.Font('HelveticaNeueLT Std Lt', 24, 0);	// used instead of ft.grd_val if ww > 1280
ft.lower_bar			= gdi.Font('HelveticaNeueLT Std Lt', 30, 0);
ft.lower_bar_bold		= gdi.Font('HelveticaNeueLT Std Med', 30, 0);
ft.lower_bar_sml 		= gdi.Font('HelveticaNeueLT Std Lt', 24, 0);
ft.lower_bar_sml_bold 	= gdi.Font('HelveticaNeueLT Std Med', 24, 0);
ft.small_font			= gdi.Font('HelveticaNeueLT Std', 14, 0);
ft.guifx 				= gdi.Font('Guifx v2 Transports', 16, 0);
fontMarlett				= gdi.font('Marlett', 13, 0);
fontSegoeUi				= gdi.font('Segoe Ui Semibold', 12, 0);



var menu_font = gdi.Font("Calibri", 12, 0);

// COLORS
col.progres_bar_text = RGB(0,0,0);
col.title		= RGB(255,255,255);
col.artist		= RGB(192,192,192);
col.grid_key  	= RGB(255,255,255);
col.grid_val  	= RGB(255,255,255);
col.now_playing = RGB(0, 0, 0);		// tracknumber, title, and time

col.bg	   		= RGB(205,205,205);
col.menu_bg 	= RGB(58, 58, 58);
col.rating		= RGB(255,170,032);
col.mood		= RGB(000,128,255);
col.hotness		= RGB(192,192,000);

col.playcount	= RGB(000,153,153);
col.dark_grey	= RGB(128,128,128);
col.progress_fill	= RGB(235,59,70);
col.progress_bar	= RGB(125,125,125);

col.tl_added	= RGB(15,51,65);
col.tl_played	= RGB(44,66,75);
col.tl_unplayed	= RGB(126,173,195);
col.tl_play 	= RGB(255,255,255);	// each individual play

// ALBUM ART DISPLAY PROPERTIES
col.aa_border = RGBA(060,060,060,128);
col.aa_shadow = RGBA(000,000,000,64);

geo.aa_shadow = 8; 		// size of albumart shadow
geo.pause_size = 150;
geo.prog_bar_h = 12;	// height of progress bar
geo.lower_bar_h = 80;	// height of song title and time + progress bar area


var playedTimesRatios = [];
var lfmPlayedTimesRatios = [];	// remove this

// PATHS
pref.bg_image		= fb.ProfilePath + 'georgia/images/wallpaper-blueish.jpg';
pref.settng_img 	= fb.ProfilePath + 'georgia/images/settings.png';
pref.prop_img		= fb.ProfilePath + 'georgia/images/properties.png';
pref.list_img		= fb.ProfilePath + 'georgia/images/playlist.png';
pref.lyrics_img		= fb.ProfilePath + 'georgia/images/lyrics.png';
pref.rating_img		= fb.ProfilePath + 'georgia/images/star.png';
pref.divider_img	= fb.ProfilePath + 'georgia/images/divider.png';
pref.last_fm_img	= fb.ProfilePath + 'georgia/images/last-fm-red-36.png';
pref.last_fmw_img   = fb.ProfilePath + 'georgia/images/last-fm-36.png';
pref.label_base  	= fb.ProfilePath + 'images\\recordlabel\\';		// location of the record label logos for the bottom right corner
pref.logo_base   	= fb.ProfilePath + 'images\\band logos\\';		// location of band logos for the bottom left corner
pref.logo_hq	   	= fb.ProfilePath + 'images\\band logos HQ\\';	// location of High-Qualiy band logos for the bottom left corner
pref.logo_color  	= fb.ProfilePath + 'images\\band logos color\\';
pref.codec_base		= fb.ProfilePath + 'images\\codec logos\\';
pref.flags_base		= fb.ProfilePath + 'images\\flags\\32\\';			// location of artist country flags

// location where MultiChannel recordings are available (for notification purposes when playing 2ch Version). Just add more comma delimited entries to this list if needed
tf.MultiCh_paths	= Array( // simply add, change or re-order entries
	"H:\\Audio\\Multichannel\\%directoryname% '['ac3']'\\*.ac3",
	"H:\\Audio\\Multichannel\\%directoryname% '['dts']'\\*.dts",
	"H:\\Audio\\Multichannel\\%directoryname% '['flac']'\\*.flac"
);

// MOUSE WHEEL SEEKING SPEED
pref.mouse_wheel_seek_speed = 5; // seconds per wheel step

// DEBUG
var showDebugOutput = window.GetProperty("Debug: Show Debug Output", false);
var showDebugTiming = false;	// spam console with debug timings
var showDrawTiming = false;		// spam console with draw times
var showExtraDrawTiming = false;// spam console with every section of the draw code to determine bottlenecks
var showLyricsTiming = true;	// spam console with timing for lyrics loading

// Lyrics Constants
var DEFAULT_OFFSET = 29;
var SCROLL_STEP = 1; // do not modify this value
var PLAYTIMER_VALUE = 01;  // do not modify this value


// PLAYLIST JUNK
var rowsInGroup = window.GetProperty("Playlist: Rows in group header", 4);
if (rowsInGroup < 0) {
	rowsInGroup = 0;
	window.SetProperty("Playlist: Rows in group header", 0);
}
var rowH = window.GetProperty("Playlist: Row height", 20);
//--->
var minRowH = 10;
if (rowH < minRowH) {
	rowH = minRowH;
	window.SetProperty("Playlist: Row height", minRowH);
}
//--->
var scrollStep = window.GetProperty("Playlist: Scroll step", 3);
if (scrollStep < 1) {
	scrollStep = 1;
	window.SetProperty("Playlist: Scroll step", 1);
}
//--->
var componentPlayCount = utils.CheckComponent("foo_playcount", true);
var listLeft = 15;
var listTop = 15;
var listRight = 15;
var listBottom = 15;
var scrollbarRight = window.GetProperty("Playlist: Scrollbar Right", 15);
var showPlayCount = window.GetProperty("Playlist: Show Play Count", componentPlayCount ? true : false);
var showRating = window.GetProperty("Playlist: Show Rating", componentPlayCount ? true : false);
var showAlbumArt = window.GetProperty("Playlist: Show Album Art", true);
var showGroupInfo = window.GetProperty("Playlist: Show Group Info", true);
var showQueueItem = window.GetProperty("Playlist: Show Queue Item", true);
var groupFormat = window.GetProperty("Playlist: Group format", "%album artist% %album% %edition%");
var autoExpandCollapseGroups = window.GetProperty("Playlist: Auto expand/collapse groups", false);
var alternateRowColor = window.GetProperty("Playlist: Alternate row color", true);
var skipLessThan = window.GetProperty("Playlist: Skip songs rated less than", 2);
var enableSkip = window.GetProperty("Playlist: Skip Enable", false);
var useTagRating = window.GetProperty("Playlist: Use tag rating", false);
var showPlaylistInfo = window.GetProperty("Playlist: Show playlist info", false);
var autoCollapseOnPlaylistSwitch = window.GetProperty("Playlist: Auto collapse on playlist switch", false);
var collapseOnStart = window.GetProperty("Playlist: Collapse on start", false);
var showNowPlayingCalled = false;
var showGlassReflection = window.GetProperty("Playlist: Add Shine to Album Art", false);
var glass_reflect_img = null;
if (showGlassReflection) {
	glass_reflect_img = draw_glass_reflect(200,200);
}

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
var titleFontNormal = gdi.font("Segoe Ui Symbol", playlistFontSize, 0);
var titleFontSelected = gdi.font("Segoe Ui", playlistFontSize, 0);
var titleFontPlaying = gdi.font("Segoe Ui Semibold", playlistFontSize, 0);
var artistFont = gdi.font("Segoe Ui Semibold", playlistFontSize + 6, 0);
var playCountFont = gdi.font("Segoe Ui", playlistFontSize - 3, 0);
var albumFont = gdi.font("Segoe Ui", playlistFontSize + 3, 0);
var dateFontSizeDifference = 8;
var dateFont = gdi.font("Segoe UI Semibold", playlistFontSize + dateFontSizeDifference, 2);
var infoFont = gdi.font("Segoe Ui", playlistFontSize-1, 0);
var coverFont = gdi.font("Segoe Ui", playlistFontSize, 0);
var ratingFontNotRated = gdi.font("Segoe Ui Symbol", playlistFontSize + 2);
var ratingFontRated = gdi.font("Segoe Ui Symbol", playlistFontSize + 4);
//---> Group Colors
var groupTitleColor = RGB(190, 192, 194);
var artistColorNormal = groupTitleColor;
var albumColorNormal = groupTitleColor;
var infoColorNormal = RGB(130, 132, 134);
var dateColorNormal = groupTitleColor;
var lineColorNormal = panelsLineColor;
var lineColorSelected = panelsLineColorSelected;
var groupTitleColorSelected = groupTitleColor;
var artAlpha = 220;
//---> Item Colors
var titleColorSelected = groupTitleColorSelected;
var titleColorPlaying = col.grid_key; // RGB(255, 165, 0); old was yellow
var titleColorNormal = panelsNormalTextColor;
var ratingColorRated = titleColorNormal;
var countColorNormal = RGB(120, 122, 124);
var countColorSelected = titleColorSelected;
var countColorPlaying = titleColorPlaying;
//---> Row Colors
var rowColorSelected = RGB(40, 40, 40);
var rowColorAlternate = RGB(40, 40, 40);
var rowColorFocusSelected = RGB(70, 70, 70);
var rowColorFocusNormal = RGB(80, 80, 80);
var rowColorQueued = RGBA(150, 150, 150, 0);
//--->
var backgroundColor = panelsBackColor;
var dropped = false;
var totalLength = selectionLength = 0;
var listInfoHeight = 24;

var g_image_cache = new image_cache;

// END OF CONFIGURATION /////////////////////////////////




// VARIABLES
// Artwork
var albumart		= null;							// albumart image
var albumart_size   = new ImageSize(0,0,0,0);		// position (big image)
var cdart			= null;							// cdart image
var cdart_size	  	= new ImageSize(0,0,0,0);		// cdart position (offset from albumart_size)
var image_bg		= gdi.Image(pref.bg_image); 	// background image
var scaled_bg_img   = null;							// background image pre-scaled based on the dimensions of the window to speed up drawing considerably
var albumart_scaled = null;							// pre-scaled album art to speed up drawing considerably
var recordLabels	= [];							// array of record label images
var bandLogo		= null;							// band logo image
var settingsImg	 	= gdi.Image(pref.settng_img);	// settings image
var propertiesImg   = gdi.Image(pref.prop_img);  	// properties image
var ratingsImg	  	= gdi.Image(pref.rating_img);	// rating image
var playlistImg	 	= gdi.Image(pref.list_img);  	// playlist image
var lyricsImg 		= gdi.Image(pref.lyrics_img);	// lyrics image
var dividerImg		= gdi.Image(pref.divider_img);	// end lyrics image
var lastFmImg       = gdi.Image(pref.last_fm_img);  // Last.fm logo image
var lastFmWhiteImg  = gdi.Image(pref.last_fmw_img); // white Last.fm logo image
var shadow_image	= null;							// shadow behind the artwork + discart
var labelShadowImg  = null;							// shadow behind labels
var playlist_shadow = null;							// shadow behind the playlist
var mediaTypeImg	= null;							// codec image (i.e. DTS, Dolby Digital, etc.)
var flagImgs		= [];							// array of flag images
var rotatedCD		= null;							// drawing cdArt rotated is slow, so first draw it rotated into the rotatedCD image, and then draw rotatedCD image unrotated
var disc_art_loading;								// for on_load_image_done()
var album_art_loading;								// for on_load_image_done()
var retrieveThemeColorsWhenLoaded = false;			// only load theme colors on first image in aa_array
var newTrackFetchingArtwork = false;				// only load theme colors when newTrackFetchingArtwork = true
var noArtwork = false;								// only use default theme when noArtwork was found
var playCountVerifiedByLastFm = false;				// show Last.fm image when we %lastfm_play_count% > 0
var pauseBorderWidth= 2;

//var inShowMenuEntry   = false;

var str	  		= new Object();
//var img	  	= new Object();
var state		= new Object(); // panel state

var metadb_handle = null; // watch db for tag changes
// TIMERS
var timer;		  	// 40ms repaint of progress bar
var globTimer;			// Timer for rotating globs
var pauseTimer;			// Blinks time display
var slideTimer;			// Timer for CD Slide out
var hideCursor;			// Timer for hiding cursor

// STATUS VARIABLES
var ww = 0, wh = 0;			// size of panel
var progressLength = 0;	 // fixing jumpiness in progressBar
var progressMoved = false;  // playback position changed, so reset progressLength
var last_pb;				// saves last playback order
var g_drag = 0;	 		// status variable for clickable progress bar
var just_dblclicked = false;
var aa_list = new Array();
var albumArtIndex = 0;		// index of currently displayed album art if more than 1
var fadeAlpha = 255;		// full alpha which will be decremented
var nextPrevAlpha = 255;	// full alpha for next/prev icons which will be decremented
var showTimeElapsed = true;	// this will alternate while paused to make the elapsed time blink
var bandLogoHQ = false;		// if true will partially remove the 10 pixel "gutter" around the image that fanart.tv requires around their high-rez images so that logos use more of the available space.
var numLabels = 0;			// how many record labels do we need to draw (max is 2 currently)
var t_interval; 			// milliseconds between screen updates
var settingsY = 0;			// location of settings button
var lastLeftEdge = 0;		// the left edge of the record labels. Saved so we don't have to recalculate every on every on_paint unless size has changed
var displayPlaylist = pref.start_Playlist;
var displayLyrics = 0;

var tl_firstPlayedRatio = 0;
var tl_lastPlayedRatio = 0;
var gDrawTimeOnly = 0;

var current_path;
var last_path;
var lastDiscNumber;
var lastVinylSide;
var currentRating;
var currentLastPlayed = '';
var multiChannelAvailable = false;	// display if there's a multi-channel version of the mp3 available

// Lyrics Variables
var len_seconds = fb.Titleformat("%length_seconds%");
var elap_seconds = fb.TitleFormat("%playback_time_seconds%");

var g_font = gdi.Font("segoe ui", FONT_SIZE, 1);
var g_playtimer = null;
var g_timer_abs;

// TODO change these variable names
var g_file = null;
var g_tab = Array();
var g_scroll=0;
var g_lyrics_path;
var g_lyrics_filename;
var g_lyrics_status;
var focus=0;
var focus_next=0;
var g_txt_normalcolour;
var g_txt_highlightcolour;
var g_txt_shadowcolor;
var g_txt_glowcolour;
var g_dither_shadowcolour;
var hundredth = 0;
var g_is_scrolling = false;
var g_multi_balise = false;
var g_balise_total;
var g_balise_char_offset = 10;
var g_tab_length;
var g_txt_align;

var midpoint;		// this is the center of the lyrics, where the highlighted line will display
var lyrPos;			// this is the absolute yPosition of the very first line in the lyrics. It will start at midpoint and then move up and off the screen
var lyricsWidth=0;	// minimum width needed to display the lyrics to speed up drawing



// MENU STUFF
var pad_x = 4;
var pad_y = 2;
var mymenu = Array(7);
var menu_img = new Array(7);
var menu_down = false;
var menu_padx = pad_x;
var menu_pady = pad_y + 4;
var menu_width = 250;	// this will get sized based on the font later

StringAlignment = {Near: 0, Centre: 1, Far: 2};
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
DT_CALCRECT = 0x00000400;  // [1.2.1] Handles well
DT_NOPREFIX = 0x00000800;  // NOTE: Please use this flag, or a '&' character will become an underline '_'
DT_INTERNAL = 0x00001000;
DT_EDITCONTROL = 0x00002000;
DT_PATH_ELLIPSIS = 0x00004000;
DT_END_ELLIPSIS = 0x00008000;
DT_MODIFYSTRING = 0x00010000;  // do not use
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

/*******************************************/
/*** ExtremeHunter's CatRox button stuff ***/
/*******************************************/
//var maximizeToFullScreen = window.GetProperty("Maximize To FullScreen", true);
var showLogo = false; //window.GetProperty("Show foobar2000 logo", false);
var frameFocusShadow = false;//window.GetProperty("Frame Focus Shadow", false);
var showFoobarVersion = false;//window.GetProperty("Show Foobar Version", false);
var showRandomButton = window.GetProperty("Show Random Button", true);
var showOpenExplorerButton = false;//window.GetProperty("Show Open Explorer Button", true);

//var barY = 28;
var streamMetadb;
var displayFont = gdi.font("Segoe Ui Semibold", 14, 0);
var captionColor = RGB(43, 43, 43);


// Call initialization function
on_init();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function on_paint(gr) {
	if (showDrawTiming) drawStuff = fb.CreateProfiler("on_paint");
	gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
	gr.SetSmoothingMode(SmoothingMode.None);

	// Background
	var topBarHeight = 160;
	if (!albumart && noArtwork) {
		albumart_size.x = Math.floor(ww*0.33);	// if there's no album art info panel takes up 1/3 screen
		albumart_size.y = 96;
		albumart_size.h = wh - albumart_size.y - geo.lower_bar_h - 32;
		setTheme(blueTheme.colors);
	}
	gr.FillSolidRect(0, topBarHeight, ww, wh - topBarHeight, col.bg);
	gr.FillSolidRect(0, 0, ww, topBarHeight, col.menu_bg);

	gr.SetSmoothingMode(SmoothingMode.AntiAlias);
	gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);

	// BIG ALBUMART
	if (albumart && albumart_scaled) {
		if (showExtraDrawTiming) drawArt = fb.CreateProfiler("on_paint -> artwork");
		if (!shadow_image) {	// when switching views, the drop shadow won't get created initially which is very jarring when it suddenly appears later, so create it if we don't have it.
			createDropShadow();
		}
		shadow_image && gr.DrawImage(shadow_image, -geo.aa_shadow, albumart_size.y - geo.aa_shadow, shadow_image.Width, shadow_image.Height,
			0, 0, shadow_image.Width, shadow_image.Height);
		// gr.DrawRect(-geo.aa_shadow, albumart_size.y - geo.aa_shadow, shadow_image.Width, shadow_image.Height, 1, RGBA(0,0,255,125));	// viewing border line
		if (cdart && !rotatedCD && !displayPlaylist && pref.display_cdart) {
			CreateRotatedCDImage();
		}
		if (!pref.cdart_ontop || displayLyrics) {
			if (showExtraDrawTiming) drawCD = fb.CreateProfiler("cdart");
			rotatedCD && !displayPlaylist && pref.display_cdart && gr.DrawImage(rotatedCD, cdart_size.x, cdart_size.y, cdart_size.w, cdart_size.h, 0,0,rotatedCD.width,rotatedCD.height,0);
			if (showExtraDrawTiming) drawCD.Print();
			gr.DrawImage(albumart_scaled, albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h, 0, 0, albumart_scaled.width, albumart_scaled.height);
		} else {	// draw cdart on top of front cover
			gr.DrawImage(albumart_scaled, albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h, 0, 0, albumart_scaled.width, albumart_scaled.height);
			if (showExtraDrawTiming) drawCD = fb.CreateProfiler("cdart");
			rotatedCD && !displayPlaylist && pref.display_cdart && gr.DrawImage(rotatedCD, cdart_size.x, cdart_size.y, cdart_size.w, cdart_size.h, 0,0,rotatedCD.width,rotatedCD.height,0);
			if (showExtraDrawTiming) drawCD.Print();
		}
		if (displayLyrics && albumart_scaled) {
			gr.FillSolidRect(albumart_size.x-1,albumart_size.y-1,albumart_size.w+1,albumart_size.h+1,RGBA(0,0,0,155));
			if(fb.IsPlaying||fb.IsPaused)
				show_lyrics(gr, g_tab, Math.floor(lyrPos - H_PADDING));
		}
		if (fb.IsPaused) {
			gr.FillRoundRect(albumart_size.x+0.5*(albumart_size.w-geo.pause_size), albumart_size.y+0.5*(albumart_size.h-geo.pause_size),geo.pause_size,geo.pause_size,
				0.1*geo.pause_size,0.1*geo.pause_size,RGBA(0,0,0,150));
			gr.DrawRoundRect(albumart_size.x+0.5*(albumart_size.w-geo.pause_size)+Math.floor(pauseBorderWidth/2), albumart_size.y+0.5*(albumart_size.h-geo.pause_size)+Math.floor(pauseBorderWidth/2),
				geo.pause_size-pauseBorderWidth,geo.pause_size-pauseBorderWidth,
				0.1*geo.pause_size,0.1*geo.pause_size, pauseBorderWidth, RGBA(128,128,128,60));
			gr.FillRoundRect(albumart_size.x+0.5*albumart_size.w-0.22*geo.pause_size, albumart_size.y+0.5*albumart_size.h-0.25*geo.pause_size,
									0.12*geo.pause_size, 0.5*geo.pause_size, 2,2, RGBA(255,255,255,160));
			gr.FillRoundRect(albumart_size.x+0.5*albumart_size.w+0.22*geo.pause_size-0.12*geo.pause_size, albumart_size.y+0.5*albumart_size.h-0.25*geo.pause_size,
									0.12*geo.pause_size, 0.5*geo.pause_size, 2,2, RGBA(255,255,255,160));
		}
		if (showExtraDrawTiming) drawArt.Print();
	} else {
		if (fb.IsPaused) {
			gr.FillRoundRect(0.5*(ww-geo.pause_size), 0.5*(wh-geo.pause_size),geo.pause_size,geo.pause_size,
				0.1*geo.pause_size,0.1*geo.pause_size,RGBA(0,0,0,150));
			gr.DrawRoundRect(0.5*(ww-geo.pause_size)+Math.floor(pauseBorderWidth/2), 0.5*(wh-geo.pause_size)+Math.floor(pauseBorderWidth/2),geo.pause_size-pauseBorderWidth,geo.pause_size-pauseBorderWidth,
				0.1*geo.pause_size,0.1*geo.pause_size, pauseBorderWidth, RGBA(128,128,128,60));
			gr.FillRoundRect(0.5*ww-0.22*geo.pause_size, 0.5*wh-0.25*geo.pause_size,
									0.12*geo.pause_size, 0.5*geo.pause_size, 2,2, RGBA(255,255,255,160));
			gr.FillRoundRect(0.5*ww+0.22*geo.pause_size-0.12*geo.pause_size, 0.5*wh-0.25*geo.pause_size,
									0.12*geo.pause_size, 0.5*geo.pause_size, 2,2, RGBA(255,255,255,160));
		}
	}
	if (fb.IsPaused || fb.IsPlaying) {
		gr.SetSmoothingMode(SmoothingMode.None);
        gr.FillSolidRect(0, albumart_size.y, albumart_size.x, albumart_size.h, col.info_bg);	// info bg -- must be drawn after shadow
        gr.DrawRect(-1, albumart_size.y, albumart_size.x, albumart_size.h - 1, 1, col.accent);
		gr.SetSmoothingMode(SmoothingMode.AntiAlias);
	}

	var textLeft = Math.round(Math.min(0.015 * ww, 20));
	if (str.artist) {
        height = gr.CalcTextHeight(str.artist, ft.artist);
        var artistY =  albumart_size.y - height - 8;
        gr.DrawString(str.artist, ft.artist, col.title, textLeft, artistY, displayPlaylist ? ww / 2 - 20 : ww-200, height, StringFormat(0,0,4));
		if (pref.show_flags) {
			width = Math.min(gr.CalcTextWidth(str.artist, ft.artist), ww-200);
			var flagWidths = 0;
			for (i=0; i<flagImgs.length; i++) {
				gr.DrawImage(flagImgs[i], Math.round(textLeft+width+15 + i*2 + flagWidths), Math.round(artistY + 1 + height / 2 - flagImgs[i].height / 2),
					flagImgs[i].width,flagImgs[i].height, 0,0,flagImgs[i].width,flagImgs[i].height)
				flagWidths += flagImgs[i].width;
			}
		}
	}

	if (!displayPlaylist) {
		if (albumart)
			gridSpace = Math.round(albumart_size.x-geo.aa_shadow-textLeft);
		else
			gridSpace = .97*ww;
		text_width = gridSpace;

		if (showExtraDrawTiming) drawTextGrid = fb.CreateProfiler("on_paint -> textGrid");

		if (str.year) {
			height = gr.CalcTextHeight(str.year, ft.year);
			gr.DrawString(str.year, ft.year, col.title, ww - textLeft * 2 - text_width, 62, text_width, height, StringFormat(StringAlignment.Far));
		}
		if (str.trackInfo) {
			gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
			gr.DrawString(str.trackInfo, ft.track_info, col.title, ww - textLeft * 2 - text_width, 62 + height + 2, text_width, 25, StringFormat(StringAlignment.Far));
			gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
		}

		if (gridSpace > 120) {
			if (gridSpace < 300) {
				top = Math.round(0.12*wh);	// need to make more room when cramped horizontally
			}
			else {
				top = Math.min((albumart_size.y ? albumart_size.y : 96) + 15, 115);
			}

			if (str.title) {
                gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
				ft.title = ft.title_lrg;
				txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width, wh);
				if (txtRec.lines > 2) {
					ft.title = ft.title_med;
					txtRec = gr.MeasureString(str.title, ft.title, 0, 0, text_width, wh);
					if (txtRec.lines > 2) {
						ft.title = ft.title_sml;
					}
				}
				var numLines = Math.min(2, txtRec.lines);
				height = gr.CalcTextHeight(str.title, ft.title) * numLines + 3;

				gr.DrawString(str.title, ft.title, col.title, textLeft, top, text_width, height, StringFormat(0,0,StringTrimming.EllipsisWord));

				top += height + 12;
                gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
			}

			timelineHeight = 18;
			if (ww > 1920) {
				timelineHeight = 22;
			}

			//Timeline playcount bars
			if (fb.IsPlaying || fb.IsPaused) {
				var extraLeftSpace = 2;	// add a little space to the left so songs that were played a long time ago show more in the "added" stage
				gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
				width = albumart_size.x - extraLeftSpace - 1;	// albumart_size.x set even if no art. Subtract 1 because we want the timeline stop 1 pixel short of art

                gr.FillSolidRect(0, top, width + extraLeftSpace, timelineHeight, col.tl_added);
                if (tl_firstPlayedRatio >= 0 && tl_lastPlayedRatio >= 0) {
					x1 = Math.floor(width* tl_firstPlayedRatio) + extraLeftSpace;
					x2 = Math.floor(width* tl_lastPlayedRatio) + extraLeftSpace;
					gr.FillSolidRect(x1, top, width - x1 + extraLeftSpace, timelineHeight, col.tl_played);
					gr.FillSolidRect(x2, top, width - x2 + extraLeftSpace, timelineHeight, col.tl_unplayed);
				}
				for (i=0; i < playedTimesRatios.length; i++) {
					x = Math.floor(width * playedTimesRatios[i]) + extraLeftSpace;
					if (!isNaN(x)) {
						gr.DrawLine(x, top, x, top + timelineHeight, 2, col.tl_play);
					} else {
						// console.log('Played Times Error! ratio: ' + playedTimesRatios[i], 'x: ' + x);
					}
				}
				gr.SetSmoothingMode(SmoothingMode.AntiAlias);
			}

			top += timelineHeight + 12;

			if (str.album) {
				ft.album = ft.album_lrg;
				txtRec = gr.MeasureString(str.album, ft.album, 0, 0, text_width, wh);
				if (txtRec.lines > 2) {
					ft.album = ft.album_med;
					txtRec = gr.MeasureString(str.album, ft.album, 0, 0, text_width, wh);
					if (txtRec.lines > 2) {
						ft.album = ft.album_sml;
					}
				}
				var numLines = Math.min(2, txtRec.lines);
				height = gr.CalcTextHeight(str.album, ft.album) * numLines;

				gr.DrawString(str.album, ft.album, col.title, textLeft, top, text_width, height, StringFormat(0,0,StringTrimming.EllipsisWord));

				top += height + 10;
			}

			// Tag grid
			trim = StringTrimming.EllipsisWord;

			labelWidth = calculateGridMaxTextWidth(gr, str.grid, ft.grd_key_lg);
			// console.log(labelWidth, text_width / 3, )
			if (labelWidth < text_width / 3) {
				grid_key_ft = ft.grd_key_lg;
				grid_val_ft = ft.grd_val_lg;
				col1_width = labelWidth;
			} else {
				grid_key_ft = ft.grd_key;
				grid_val_ft = ft.grd_val;
				labelWidth = calculateGridMaxTextWidth(gr, str.grid, ft.grd_key);
				if (labelWidth < text_width / 3) {
					col1_width = labelWidth;
				} else {
					col1_width = Math.floor(text_width / 3);
				}
			}
			col2_width = text_width - 10 - col1_width;

			col1_height = gr.CalcTextHeight("A", grid_key_ft);
			for (k=0, i=0; k < str.grid.length; k++) {
				var key   = str.grid[k].label;
				var value = str.grid[k].val;
				var showLastFmImage = false;

				// gr.DrawString(key, grid_key_ft, rgb(0,0,0), textLeft-0.5, top+0.5, col1_width, col1_height, StringFormat(0,0,trim));	// key
				gr.DrawString(key, grid_key_ft, col.grid_key, textLeft, top, col1_width, col1_height, StringFormat(0,0,trim));	// key

				switch (key) {
					case 'Rating':  	grid_val_col = col.rating; dropShadow = true; break;
					case 'Mood':		grid_val_col = col.mood; dropShadow = true; break;
					case 'Hotness':		grid_val_col = col.hotness; dropShadow = true; break;
					case 'Play Count':	showLastFmImage = true; break;
					default:			grid_val_col = col.grid_val; dropShadow = false; break;
				}
				txtRec = gr.MeasureString(value, grid_val_ft, 0, 0, col2_width, wh);
				cell_height = txtRec.Height + 5;
				if (dropShadow) {
					gr.DrawString(value, grid_val_ft, col.extraDarkAccent, textLeft + col1_width + 9.5, top + 0.5, col2_width, cell_height, StringFormat(0,0,4));
					gr.DrawString(value, grid_val_ft, col.extraDarkAccent, textLeft + col1_width + 10.5, top + 0.5, col2_width, cell_height, StringFormat(0,0,4));
					gr.DrawString(value, grid_val_ft, col.extraDarkAccent, textLeft + col1_width + 9.5, top - 0.5, col2_width, cell_height, StringFormat(0,0,4));
					gr.DrawString(value, grid_val_ft, col.extraDarkAccent, textLeft + col1_width + 10.5, top - 0.5, col2_width, cell_height, StringFormat(0,0,4));
				}
				gr.DrawString(value, grid_val_ft, grid_val_col, textLeft + col1_width + 10, top, col2_width, cell_height, StringFormat(0,0,4));
				if (playCountVerifiedByLastFm && showLastFmImage) {
					var lastFmLogo = lastFmImg;
					if (getBlue(col.primary) < 20 && getGreen(col.primary) < 20 && Math.abs(getRed(col.primary) - 185) < 52) {
						lastFmLogo = lastFmWhiteImg;
					}
					var heightRatio = (cell_height - 12) / lastFmImg.height;
					gr.DrawImage(lastFmLogo, textLeft + col1_width + txtRec.Width + 20, top + 3, Math.round(lastFmLogo.width * heightRatio), cell_height - 12,
						0, 0, lastFmLogo.width, lastFmLogo.height);
				}
				top += cell_height + 5;
			}
		}
		if (showExtraDrawTiming) drawTextGrid.Print();

	}	/* if (!displayPlaylist) */

	if (!displayPlaylist) {
		// BAND LOGO drawing code
		showExtraDrawTiming && (drawBandLogos = fb.CreateProfiler("on_paint -> band logos"));
		if (bandLogo) {
			if (bandLogoHQ != true) {
				logoWidth = Math.min(bandLogo.width, albumart_size.x-ww*0.05);
				heightScale = logoWidth / bandLogo.width;
				logoTop = Math.round(albumart_size.y + albumart_size.h - (heightScale * bandLogo.height) - 12);
				gr.DrawImage(bandLogo, Math.round(albumart_size.x/2 - logoWidth/2), logoTop, logoWidth, Math.round(bandLogo.height*heightScale),
					0,0,bandLogo.width, bandLogo.height, 0);
			}
			else {
				logoWidth = Math.min(bandLogo.width/2, albumart_size.x-ww*0.05);	// max width we'll draw is 1/2 the full size because the images are just so big
				heightScale = logoWidth / (bandLogo.width);   // width is fixed to logoWidth, so scale height accordingly
				logoTop = Math.round(albumart_size.y + albumart_size.h - (heightScale * (bandLogo.height)) - 12);
				gr.DrawImage(bandLogo, Math.round(albumart_size.x/2 - logoWidth/2), logoTop, Math.round(logoWidth), Math.round((bandLogo.height)*heightScale),
                    0,0,bandLogo.width, bandLogo.height, 0);
			}
		}
		if (showExtraDrawTiming) drawBandLogos.Print();

		if (multiChannelAvailable && pref.check_multich) {
			gr.DrawString("Multi-Ch Format Available",ft.small_font,col.grid_val, 0.8*ww, settingsY+settingsImg.height+10, 0.19*ww, 60, StringFormat(StringAlignment.Far, 0));
		} else if (mediaTypeImg) {
			if (albumart_scaled) {
				mediaWidth = Math.min(100, ww - (albumart_size.x + albumart_scaled.width) - 10)
				mediaLeft = Math.round(Math.max(albumart_size.x + albumart_scaled.width + 5, ww*.975-mediaWidth-2));
			} else {
				mediaWidth = 100;
				mediaLeft = Math.round(ww*.975-mediaWidth-2);
			}
			gr.DrawImage(mediaTypeImg, mediaLeft, settingsY+settingsImg.height+15, mediaWidth, mediaTypeImg.Height*(mediaWidth/mediaTypeImg.Width), 0,0,mediaTypeImg.Width,mediaTypeImg.Height, 0, logoAlpha);
		}

		// RECORD LABEL drawing code
		// this section should draw in 3ms or less always
		if (recordLabels.length > 0) {
			var rightSideGap = 20,  // how close last label is to right edge
                labelSpacing = 0,
                leftEdgeWidth = 30; // how far label background extends on left
			if (showExtraDrawTiming) drawLabelTime = fb.CreateProfiler("on_paint -> record labels");
			totalLabelWidth = 0;
			for (i=0; i<recordLabels.length; i++) {
				if (recordLabels[i].width > 200)
					totalLabelWidth += 200;
				else
					totalLabelWidth += recordLabels[i].width;
			}
			if (!lastLeftEdge) {	// we don't want to recalculate this every screen refresh
				console.log('recalculating lastLeftEdge');
				labelShadowImg = disposeImg(labelShadowImg);
				labelWidth = Math.round(totalLabelWidth / recordLabels.length);
				labelHeight = Math.round(recordLabels[0].height * labelWidth/recordLabels[0].width);	// might be recalc'd below
				if (albumart) {
					if (cdart && pref.display_cdart) {
						leftEdge = Math.round(Math.max(albumart_size.x+albumart_scaled.Width+5, ww*0.975-totalLabelWidth+1));
						var cdCenter = {};
						cdCenter.x = Math.round(cdart_size.x + cdart_size.w/2);
						cdCenter.y = Math.round(cdart_size.y + cdart_size.h/2);
						var radius = cdCenter.y - cdart_size.y;

						while (true) {
							allLabelsWidth = Math.max(Math.min(Math.round((ww-leftEdge-rightSideGap)/recordLabels.length), 200), 50);
							//console.log("leftEdge = " + leftEdge + ", ww-leftEdge-10 = " + (ww-leftEdge-10) + ", allLabelsWidth=" + allLabelsWidth);
							labelWidth = (allLabelsWidth > recordLabels[0].width) ? recordLabels[0].width : allLabelsWidth;
							labelHeight = Math.round(recordLabels[0].height*labelWidth/recordLabels[0].width);	// width is based on height scale
							topEdge = Math.round(albumart_size.y + albumart_size.h - labelHeight);

							var a = topEdge - cdCenter.y + 1;	// adding 1 to a and b so that the border just touches the edge of the cdart
							var b = leftEdge - cdCenter.x + 1;

							if ((a*a + b*b) > radius * radius) {
								break;
							}
							leftEdge += 4;
						}
					} else  {
                        leftEdge = Math.round(Math.max(albumart_size.x + albumart_size.w + leftEdgeWidth + 40, ww*0.975-totalLabelWidth+1));
					}
				} else {
					leftEdge = Math.round(ww*0.975-totalLabelWidth);
				}
				labelAreaWidth = ww - leftEdge - rightSideGap;
				lastLeftEdge = leftEdge;
			} else {
				// already calculated
				leftEdge = lastLeftEdge;
				labelAreaWidth = ww - leftEdge - rightSideGap;
			}
			if (labelAreaWidth >= 50) {
				if (recordLabels.length > 1) {
				 	labelSpacing = Math.min(12,Math.max(3,Math.round((labelAreaWidth/(recordLabels.length-1))*0.048)));	// spacing should be proportional, and between 3 and 12 pixels
				}
				// console.log('labelAreaWidth = ' + labelAreaWidth + ", labelSpacing = " + labelSpacing);
				allLabelsWidth = Math.max(Math.min(Math.round((labelAreaWidth-(labelSpacing*(recordLabels.length-1)))/recordLabels.length), 200), 50); 	// allLabelsWidth must be between 50 and 200 pixels wide
				var labelX = leftEdge;
				topEdge = albumart_size.y + albumart_size.h - labelHeight - 20;
				var origLabelHeight = labelHeight;

				if (!labelShadowImg) {
					labelShadowImg = createShadowRect(ww - labelX + leftEdgeWidth, labelHeight + 40);
				}
				gr.DrawImage(labelShadowImg, labelX - leftEdgeWidth - geo.aa_shadow, topEdge - 20 - geo.aa_shadow, ww - labelX + leftEdgeWidth + 2*geo.aa_shadow, labelHeight + 40 + 2*geo.aa_shadow,
						0, 0, labelShadowImg.width, labelShadowImg.height);
				gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
                gr.FillSolidRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40, col.info_bg);
                gr.DrawRect(labelX - leftEdgeWidth, topEdge - 20, ww - labelX + leftEdgeWidth, labelHeight + 40 - 1, 1, col.accent);
				gr.SetSmoothingMode(SmoothingMode.AntiAlias);
				for (i=0; i<recordLabels.length; i++) {
					// allLabelsWidth can never be greater than 200, so if a label image is 161 pixels wide, never draw it wider than 161
					labelWidth = (allLabelsWidth > recordLabels[i].width) ? recordLabels[i].width : allLabelsWidth;
					labelHeight = Math.round(recordLabels[i].height*labelWidth/recordLabels[i].width);	// width is based on height scale

					gr.DrawImage(recordLabels[i], labelX, Math.round(topEdge + origLabelHeight/2 - labelHeight/2), labelWidth, labelHeight, 0,0,recordLabels[i].width,recordLabels[i].height);
					// gr.DrawRect(labelX, topEdge, labelWidth, labelHeight, 1, RGB(255,0,0));	// shows bounding rect of record labels
					labelX += labelWidth + labelSpacing;
				}
				labelHeight = origLabelHeight;	// restore
			}
			if (showExtraDrawTiming) drawLabelTime.Print();
		}
	}	/* if (!displayPlaylist) */

	// MENUBAR
	showExtraDrawTiming && (drawMenuBar = fb.CreateProfiler("on_paint -> menu bar"));
	for (var i in btns) {
		var x = btns[i].x,
			y = btns[i].y,
			w = btns[i].w,
			h = btns[i].h,
			img = btns[i].img;

		if (!displayPlaylist || i < 40) {
			gr.DrawImage(img[0], x, y, w, h, 0, 0, w, h, 0, 255); // normal
			gr.DrawImage(img[1], x, y, w, h, 0, 0, w, h, 0, btns[i].hoverAlpha);
			gr.DrawImage(img[2], x, y, w, h, 0, 0, w, h, 0, btns[i].downAlpha);
		}
    }

	showExtraDrawTiming && drawMenuBar.Print();

	// LOWER BAR
	var lowerBarTop = wh-geo.lower_bar_h;
	var pbLeft = Math.round(0.025*ww);

	// Title & artist
	//if (showExtraDrawTiming) drawLowerBar = fb.CreateProfiler("on_paint -> lowerBar");
	if (ww > 600) {
		if (str.disc!='')
			width = gr.CalcTextWidth(str.disc+'   '+str.time+'   '+str.length, ft.lower_bar);
		else
			width = gr.CalcTextWidth(' '+str.time+'   '+str.length, ft.lower_bar);
	} else {
		width = 0;
	}

	var stxt = gr.MeasureString(str.lower_bar1, ft.lower_bar, 0, 0, ww, wh);
	trackNumWidth = stxt.Width;
	stxt = gr.MeasureString(str.lower_bar2, ft.lower_bar, 0, 0, ww, wh);
    titleWidth = stxt.Width;
    var ft_lower_bold = ft.lower_bar_bold;
    var ft_lower = ft.lower_bar
	if (width + trackNumWidth + titleWidth > 0.95*ww) {
		// we don't have room for all the text so use a smaller font and recalc size
        ft_lower_bold =  ft.lower_bar_sml_bold;
        ft_lower = ft.lower_bar_sml;
		stxt = gr.MeasureString(str.lower_bar1, ft.lower_bar_sml_bold, 0, 0, ww, wh);
		trackNumWidth = stxt.Width;
	}
    gr.DrawString(str.lower_bar1, ft_lower_bold, col.now_playing, pbLeft, lowerBarTop, 0.95*ww-width,0.5*geo.lower_bar_h,StringFormat(0,0,4,0x00001000));
    width += trackNumWidth;
    gr.DrawString('  '+str.lower_bar2, ft_lower, col.now_playing, pbLeft + trackNumWidth, lowerBarTop, 0.95*ww-width,0.5*geo.lower_bar_h,StringFormat(0,0,4,0x00001000));

	// Progress bar/Seekbar
	var pbTop = Math.round(lowerBarTop + stxt.Height) + 8;
	gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
    gr.FillSolidRect(pbLeft, pbTop, Math.round(0.95*ww), geo.prog_bar_h, col.progress_bar);
    if (fb.PlaybackLength > 0) {
		if (ww > 600) {
			gr.DrawString(str.length, ft_lower, col.now_playing, 0.725*ww, lowerBarTop, 0.25*ww,0.5*geo.lower_bar_h, StringFormat(2,0));
			width = gr.CalcTextWidth('  '+str.length, ft_lower);
			gr.DrawString(str.time, ft_lower_bold, col.now_playing, 0.725*ww, lowerBarTop, 0.25*ww-width,0.5*geo.lower_bar_h, StringFormat(2,0));
			width += gr.CalcTextWidth('  '+str.time, ft_lower_bold);
			gr.DrawString(str.disc, ft_lower, col.now_playing, 0.725*ww, lowerBarTop, 0.25*ww-width,0.5*geo.lower_bar_h, StringFormat(2,0));
		}

		if (progressMoved || Math.floor(0.95*(ww-2)*(fb.PlaybackTime / fb.PlaybackLength)) > progressLength)
			progressLength = Math.floor(0.95*(ww-2)*(fb.PlaybackTime / fb.PlaybackLength));
		progressMoved = false;
		gr.FillSolidRect(pbLeft, pbTop, progressLength, geo.prog_bar_h, col.progress_fill);
        // gr.DrawRect(pbLeft, pbTop, progressLength, geo.prog_bar_h - 1, 1, col.accent);
        gr.DrawLine(progressLength + pbLeft, pbTop, progressLength + pbLeft, pbTop + geo.prog_bar_h - 1, 1, col.accent);
	} else if (ww > 600) {	// streaming, but still want to show time
		gr.DrawString(str.time, ft.lower_bar, col.now_playing,Math.floor(0.725*ww), lowerBarTop, 0.25*ww,0.5*geo.lower_bar_h,StringFormat(2,0));
	}
	gr.SetSmoothingMode(SmoothingMode.AntiAlias);

	if (displayPlaylist) {
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		var startX = Math.floor(ww*.5);
		var startY = btns[30].y + btns[30].h + 10;

		if (!playlist_shadow)
			createDropShadow();
		playlist_shadow && gr.DrawImage(playlist_shadow, startX - 10, startY - 10, playlist_shadow.width, playlist_shadow.height, 0,0,playlist_shadow.width,playlist_shadow.height)
		gr.FillRoundRect(startX, startY, ww, listH + listTop + listBottom, 6, 6, backgroundColor);
		gr.DrawRoundRect(startX, startY, ww, listH + listTop + listBottom, 6, 6, 1, RGB(20,20,20));
		gr.DrawRoundRect(startX+1, startY+1, ww, listH + listTop + listBottom, 6, 6, 1, RGB(50,50,50));

		gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
		if (showPlaylistInfo) {

			var selectedIndexesLength = selectedIndexes.length;
			var totalItems = 0;

			selectedIndexesLength ? totalItems = selectedIndexesLength : totalItems = playlistItemCount;

			var items = (totalItems > 1 ? " items selected" : " item selected");

			if (!selectedIndexesLength) {
				selectionLength = totalLength;
				items = (totalItems > 1 ? " items" : " item");
			}

			gr.FillSolidRect(startX+2, startY+2, listW, listInfoHeight, RGB(43, 43, 43));
			gr.DrawString(fb.GetPlaylistName(activeList) + ": " + totalItems + items + ", Length: " + selectionLength, titleFontSelected, RGB(150, 152, 154), startX + 12, startY+2, listW - 20, listInfoHeight - 2, StringFormat(1, 1));

		}

		var playingID;
		var selectedID;
		var focusID;
		var queueIndexes = [];
		var queueIndexCount = [];
		var isPlaylistItemQueued = [];
		var groupItemCounter = 0;

		if (plman.PlayingPlaylist == activeList) {
			playingID = plman.GetPlayingItemLocation().PlaylistItemIndex;

		}

		focusID = plman.GetPlaylistFocusItemIndex(activeList);

		if (listLength) {

			//---> Get visible group row count

			var visibleGroupRows = [];
			var tempGroupNr = 0;
			var groupRowCount = 0;

			for (var i = 0; i != maxRows; i++) {

				var ID = playlist[i + listStep[activeList]];

				try {
					if (ID.isGroupHeader) {
						var groupNr = ID.groupNr;
						(groupNr == tempGroupNr) ? groupRowCount++ : groupRowCount = 1;
						visibleGroupRows[groupNr] = groupRowCount;

						tempGroupNr = groupNr;
					}
				} catch (e) {
					console.log("ID.isGroupHeader or ID.groupNr was undefined, presumably because the object was null. listStep[activeList]=" + listStep[activeList] + ", i=" + i);
				}
			}

			//--->

			var tempGroupNr = -1;
			var lastDisc;

			for (var i = 0; i != maxRows; i++) {

				var ID = playlist[i + listStep[activeList]];

				try {
					if (plman.IsPlaylistItemSelected(activeList, ID.nr)) {
						selectedID = ID.nr;
					}
				} catch (e) {
					console.log("ID.nr was undefined, presumably because the object was null. Aborting playlist draw now.");
					break;
				}

				var metadb = ID.metadb;

				var x = listX,
					y = r[i].y,
					w = listW,
					h = rowH,
					rowX = listX - listLeft,
					rowW = listW + listLeft + listRight;

				if (ID.isGroupHeader) {

					var groupNr = ID.groupNr;
					var selectedGroup = isGroupSelected(groupNr, playingID);
					groupItemCounter = 1;
					lastDisc = 0;	// clear lastDisc between groups
					//--->

					if (selectedGroup) {
						lineColor = lineColorSelected;
						artistColor = albumColor = dateColor = infoColor = groupTitleColorSelected;
						rowColorFocus = rowColorFocusSelected;
					} else {
						artistColor = artistColorNormal;
						albumColor = albumColorNormal;
						infoColor = infoColorNormal;
						dateColor = dateColorNormal;
						lineColor = lineColorNormal;
						rowColorFocus = rowColorFocusNormal;
					}

					if (groupNr != tempGroupNr) {

						var clipY = r[i].y + 1;
						var clipH = visibleGroupRows[groupNr] * rowH - 1;
						var clipImg = gdi.CreateImage(listW, clipH);
						var g = clipImg.GetGraphics();

						var groupY;
						(i == 0 && ID.rowNr > 1) ? groupY = -((ID.rowNr - 1) * rowH) : groupY = -1;
						var groupH = rowsInGroup * rowH;

						var padding = 4,
							artX = showAlbumArt ? padding : 0,
							artY = groupY + padding,
							artW = showAlbumArt ? groupH - padding * 2 : 0,
							artH = groupH - padding * 2;

						//--->
						g.FillSolidRect(startX, groupY, w, groupH, backgroundColor); // Solid background for ClearTypeGridFit text rendering
						if (selectedGroup) g.FillSolidRect(0, groupY, w, groupH, rowColorSelected);

						if (isCollapsed[groupNr] && focusGroupNr == groupNr) {
							g.DrawRect(2, groupY + 2, w - 4, groupH - 4, 1, lineColor);
						}

						//************************************************************//

						if (showAlbumArt) {
							var art = g_image_cache.fetch(metadb);

							if (art) {
								g.DrawImage(art, artX + 2, artY + 2, artW - 4, artH - 4, 0, 0, art.Width, art.Height, 0, selectedGroup ? 255 : artAlpha);
							} else if (art === null) {
								g.DrawString("NO COVER", infoFont, lineColor, artX, artY, artW, artH, StringFormat(1, 1));
							} else {
								g.DrawString("LOADING", coverFont, lineColor, artX, artY, artW, artH, StringFormat(1, 1));
							}
							g.DrawRect(artX, artY, artW - 1, artH - 1, 1, lineColor);

						}

						//************************************************************//

						(!showGroupInfo) ? divGroupH = groupH / 2 : divGroupH = groupH / 3;

						var leftPad = artX + artW + 10;
						var path = $("%path%", metadb).slice(0, 4);

						var radio = (path == "http") ? true : false;

						//---> DATE
						var date = $("$year($if2(%original release date%,%date%))", metadb);
						if (date == "?" && radio) date = '';
						dateDimensions = gr.MeasureString(date, dateFont, 0, 0, 0, 0);
						var dateW = Math.ceil(dateDimensions.Width + 3);
						var dateX = w - dateW;
						var dateY = groupY - Math.ceil((dateFontSizeDifference - 4)/2);
						var dateH = groupH;

						g.SetTextRenderingHint(TextRenderingHint.AntiAlias);
						(dateX > leftPad) && g.DrawString(date, dateFont, dateColor, dateX, dateY, dateW, dateH, StringFormat(0, 1));

						//---> ARTIST
						var artistX = leftPad;
						if (showGroupInfo) {
							artistW = 0 + w - artistX - 0;
							artistH = divGroupH;
						} else {
							artistW = dateX - leftPad - 5;
							artistH = divGroupH - 5;
						}
						var artist = $("$if($greater($len(%album artist%),0),%album artist%,%artist%)", metadb);
						if (artist == "?" && radio) artist = "Radio Stream";

						g.DrawString(artist, artistFont, artistColor, artistX, groupY, artistW, artistH, StringFormat(0, 2, 3, 0x1000));
						// hyperlinks.push(new Hyperlink(artist, artistFont, artistColor, 'artist', artistX, groupY));

						//---> ALBUM
						var albumX = leftPad;
						var albumW = dateX - leftPad - 5;
						var albumH = divGroupH;

						showGroupInfo ? albumY = groupY + divGroupH : albumY = groupY + divGroupH + 5;

						var album = $("%album% [ \u2014 '['$if(%original release date%,$ifequal($year(%original release date%),$year(%date%),,$year(%date%) ))%edition%']']", metadb);
						if (album == "?" && radio) album = '';

						g.DrawString(album, albumFont, albumColor, albumX, albumY, albumW, albumH, StringFormat(0, showGroupInfo ? 1 : 0, 3, 0x1000));

						var albumStringW = gr.MeasureString(album, albumFont, 0, 0, 0, 0).Width;

						var lineX1 = leftPad + albumStringW + 10;
						var lineY = albumY + albumH / 2 + 1;

						if (!showGroupInfo) {
							lineX1 = leftPad;
							lineY = groupY + groupH / 2 + 1;
						}
						var lineX2 = dateX - 10;

						(lineX2 - lineX1 > 0) && g.DrawLine(lineX1, lineY, lineX2, lineY, 1, lineColor);

						//---> INFO
						if (showGroupInfo) {
							g.SetTextRenderingHint(TextRenderingHint.SingleBitPerPixelGridFit);
							var infoY = groupY + artistH + albumH;
							var infoH = h;

							var codec = $("$lower($if2(%codec%,$ext(%path%)))", metadb);
							if (codec == "cue") {
								codec = $("$ext($info(referenced_file))", metadb);
							} else if (codec == "mpc") {
								codec = codec + "-" + $("$info(codec_profile)", metadb).replace("quality ", "q");
							} else if (codec == "dts" || codec == "ac3" || codec == "atsc a/52") {
								codec += " " + $(" $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0)) %bitrate%", metadb) + " kbps";
								codec = codec.replace("atsc a/52", "Dolby Digital");
							} else if ($("$info(encoding)", metadb) == "lossy") {
								if ($("$info(codec_profile)", metadb) == "CBR") codec = codec + "-" + $("%bitrate%", metadb) + " kbps";
								else codec = codec + "-" + $("$info(codec_profile)", metadb);
							}
							// console.log(codec, $("$info(encoding)", metadb), $("$info(codec_profile)", metadb), $("$info(channel_mode)", metadb))

							if (!codec) codec = path;
							var iCount = itemCount[ID.groupNr];
							var genre = radio ? '' : "%genre% | ";
							var info = $(genre + codec + "[ | %replaygain_album_gain%]", metadb) + (radio ? '' : " | " + iCount + (iCount == 1 ? " Track" : " Tracks") + $("$ifgreater(%totaldiscs%,1, - %totaldiscs% Discs,)", metadb) + " | Time: " + calculateGroupLength(firstItem[groupNr], lastItem[groupNr]));
							//console.log("w = " + w + ", listW = " + listW + ", x = " + x);
							g.DrawString(info, infoFont, infoColor, artistX, infoY, artistW, infoH, StringFormat(0, 0, 3, 0x1000));

							var stringInfo = gr.MeasureString(info, infoFont, 0, 0, 0, 0);
							var labelString = $("$if2(%label%,[%publisher%])", metadb).replace(/, /g,' \u2022 ');
							labelWidth = Math.ceil(gr.MeasureString(labelString, infoFont, 0, 0, 0, 0).width + 10);
							if (albumW > labelWidth + stringInfo.width)
								g.DrawString(labelString, infoFont, infoColor, artistX + artistW - labelWidth, infoY, labelWidth-4, infoH, StringFormat(2, 0, 3, 0x1000));

							var infoStringH = Math.ceil(stringInfo.Height + 5);
							var lineX1 = artistX,
								lineX2 = 20 + w,
								lineY = infoY + infoStringH;
							(lineX2 - lineX1 > 0) && g.DrawLine(lineX1, lineY, lineX2, lineY, 1, lineColor);

						}

						//************************************************************//

						clipImg.ReleaseGraphics(g);
						gr.DrawImage(clipImg, listX, clipY, listW, clipH, 0, 0, listW, clipH, 0, 255);
						clipImg.Dispose();

					}

					tempGroupNr = groupNr;

					//--->

				} else if (ID.isDiscHeader) {
					if (ID.isOdd && alternateRowColor) {
						gr.FillSolidRect(rowX, y + 1, rowW, rowH + 1, rowColorAlternate);
					}

					titleFont = titleFontPlaying;
					lineColor = lineColorNormal;

					if (selectedID == ID.nr) {

						if (alternateRowColor) {
							gr.DrawRect(x, y, w - 1, rowH, 1, rowColorFocusSelected);
						} else {
							gr.FillSolidRect(rowX, y, rowW, rowH, rowColorSelected);
						}

						titleColor = titleColorSelected;
						countColor = countColorSelected;
						rowColorFocus = rowColorFocusSelected;
						lineColor = lineColorSelected;

					} else {
						titleColor = titleColorNormal;
					}

					var ID = playlist[i+1 + listStep[activeList]];

					discHeaderString = $("[Disc %discnumber% $if("+ tf.disc_subtitle+", \u2014 ,)]["+ tf.disc_subtitle +"]", metadb);
					discLength = calculateDiscLength(ID.nr, lastItem[groupNr]);

					var discPadding = 8;

					var discStringW = gr.MeasureString(discHeaderString, titleFontPlaying, 0, 0, 0, 0).width;
					var discLengthW = gr.MeasureString(discLength, titleFontPlaying, 0, 0, 0, 0).width;
					var lineX1 = Math.round(x + discPadding + discStringW + 10);
					var lineY = Math.ceil(y + h/2);
					var lineX2 = Math.round(x + w - discLengthW - discPadding*2);

					if (lineX2 - lineX1 > 0) gr.DrawLine(lineX1, lineY, lineX2, lineY, 1, lineColor);

					gr.DrawString(discHeaderString, titleFontPlaying, titleColor, x + discPadding, y, w - discLengthW - discPadding*2, rowH, StringFormat(0, 1, 3, 0x1000));
					gr.DrawString(discLength, titleFontPlaying, titleColor, x, y, w-4, rowH, StringFormat(2, 1));

				} else {
					if (ID.isOdd && alternateRowColor && playingID !== ID.nr) {
						gr.FillSolidRect(rowX, y, rowW, rowH, rowColorAlternate);
					}

					if (selectedID == ID.nr) {
						titleColor = titleColorSelected;
						countColor = countColorSelected;
						if (playingID == ID.nr) {
							titleColor = titleColorPlaying;
							countColor = titleColor;
							titleFont = titleFontPlaying;
							gr.FillSolidRect(rowX, y, rowW, rowH, col.accent);
							// gr.DrawRect(rowX, y + 1, rowW, h - 1, 1, RGB(255,0,0));
						} else {
							titleFont = titleFontSelected;
						}

						if (alternateRowColor) {
							// gr.DrawRect(x, y, w - 1, rowH, 1, rowColorFocusSelected);
							gr.DrawRect(rowX + 1, y, rowW - 2, rowH - 1, 1, rowColorFocusSelected);
						} else {
							gr.FillSolidRect(rowX, y, rowW, rowH, rowColorSelected);
						}

						rowColorFocus = rowColorFocusSelected;

					} else if (playingID == ID.nr) {

						titleColor = titleColorPlaying;
						titleFont = titleFontPlaying;
						countColor = countColorPlaying;
						gr.FillSolidRect(rowX, y, rowW, rowH, col.darkAccent);

					} else {
						titleFont = titleFontNormal;
						titleColor = titleColorNormal;
						countColor = countColorNormal;
						rowColorFocus = rowColorFocusNormal;
					}

					if ((rowDrag || fileDrag) && r[i].state == 1) {
						gr.DrawLine(x, y, x + w, y, 2, RGB(140, 142, 144));
					}

					if (!dropped && linkToLastItem && !makeSelectionDrag && i == (maxRows - 1)) {
						gr.DrawLine(x, y + h - 1, x + w, y + h - 1, 2, RGB(255, 165, 0));
					}

					var testRect = 0;

					var playCount = (radio ? '' : $("%play_count%", metadb));
					var length = $("[%length%]", metadb);
					var lengthWidth = length ? 50 : 0;
					var playCountWidth = 0;
					if (playCount != 0 && showPlayCount) {
						playCount = playCount + " |";
						playCountWidth = gr.MeasureString(playCount, playCountFont, 0, 0, 0, 0).Width;
					}
					var ratingW = 0;
					if (componentPlayCount && showRating) ratingW = Math.ceil(ratingBtnW * 6);

					//---> QUEUE
					var queueContents = plman.GetPlaybackQueueHandles();
					if (showQueueItem && queueContents.Count) {

						var queueIndex = plman.FindPlaybackQueueItemIndex(metadb, activeList, ID.nr);

						for (var q = 0; q != queueContents.Count; q++) {

							var handle = queueContents.Item(q);
							var indexCount = 0;

							if (metadb.Compare(handle)) {

								queueIndexes.push(queueIndex);
								isPlaylistItemQueued[i] = true;

								for (var qi = 0, l = queueIndexes.length; qi < l; qi++) {
									if (queueIndex == queueIndexes[qi]) queueIndexCount[queueIndex] = ++indexCount;
								}

							}

						}

					}
					if (isPlaylistItemQueued[i]) gr.FillSolidRect(x, y, w, h, rowColorQueued);

					var queue = ((showQueueItem && queueContents.Count && queueIndex != -1) ? ('  [' + (queueIndex + 1) + ']' + (queueIndexCount[queueIndex] > 1 ? '*' + queueIndexCount[queueIndex] : '')) : '');

					//---> TITLE
					W = w - lengthWidth - playCountWidth - ratingW;
					var gic = groupItemCounter++;
					var itemNr = (((gic) < 10) ? ("0" + (gic)) : (gic));
					var multiDiscs = $("$ifgreater(%totaldiscs%,1,1,0)",metadb);
					var currDisc = $("$if2(" + tf.vinyl_side + ",[%discnumber%])", metadb);
					var trackNumStr;
					var trackNumWidth = 0;
					var discSpace = 0;
					if (pref.use_vinyl_nums) {
						trackNumStr = tf.vinyl_track;
					} else {
						trackNumStr= '$if2(%tracknumber%.,' + itemNr + '.)';
					}
					if (multiDiscs == 1) {
						discSpace = 25;		// leave some space before start of playlistString when we have multiple discs
					}
					trackNumWidth = Math.round(gr.MeasureString($(trackNumStr, metadb), titleFont, 0, 0, 0, 0).Width + 8);
					if (playingID == ID.nr) {
						trackNumStr = '';
						gr.DrawString(fb.IsPaused ? Guifx.Pause : Guifx.Play, ft.guifx, titleColor, x + 10 + discSpace, y, trackNumWidth - 2, h, lc_stringformat);
					} else {
						gr.DrawString($(trackNumStr, metadb), titleFont, titleColor, x + 8 + discSpace, y, trackNumWidth, h, lc_stringformat);
					}
					playlistString = tf.title + "[  \u2022  $if($strcmp("+tf.artist+",%artist%),$ifgreater($len(%album artist%),1,$ifgreater($len(%track artist%),1,%track artist%,),),"+tf.artist+")]";
					gr.DrawString($(playlistString, metadb) + queue, titleFont, titleColor, x + 8 + discSpace + trackNumWidth, y, W - 20 - discSpace - trackNumWidth, h, StringFormat(0, 1, 3, 0x1000));

					testRect && gr.DrawRect(x, y - 1, W, h, 1, RGBA(155, 155, 255, 250));

					//---> LENGTH
					X = Math.floor(x + w - lengthWidth);
					W = lengthWidth;
					gr.DrawString(length, titleFont, titleColor, X, y, W-5, h, StringFormat(2, 1));
					testRect && gr.DrawRect(X, y - 1, W, h, 1, RGBA(155, 155, 255, 250));

					//---> COUNT
					if (componentPlayCount && playCount != 0 && showPlayCount) {
						X = x + w - lengthWidth - playCountWidth - ratingW;
						W = playCountWidth;
						gr.DrawString(playCount, playCountFont, countColor, X, y, W, h, StringFormat(1, 1));
						testRect && gr.DrawRect(X, y - 1, W, h, 1, RGBA(155, 155, 255, 250));

					}

					//---> RATING

					if (useTagRating) {
						var fileInfo = metadb.GetFileInfo();
						var rating = fileInfo.MetaValue(fileInfo.MetaFind("rating"), 0);
					} else {
						var rating = $("%rating%", metadb);
					}

					if (componentPlayCount && showRating) {

						for (var j = 4; j >= 0; j--) {

							var x = ratingBtnX + j * ratingBtnW - ratingBtnRightPad;
							var w = ratingBtnW;

							if (j < rating) {

								if (selectedID == ID.nr)
									var color = titleColor;
								else
									color = titleColor;

								gr.DrawString("\u2605", ratingFontRated, color, x, y - 1, w, h, StringFormat(1, 1));

							} else gr.DrawString("\u2219", ratingFontNotRated, titleColor, x, y - 1, w, h, StringFormat(1, 1));

						} //eol

					}

				}

			} // eo_row_loop
			hyperlinks.forEach(function (h) {
				h.onPaint(gr);
			});

			needsScrollbar && drawScrollbar(gr);

		} else { //eo ifListLength

			var text = "Drag some tracks here";

			if (plman.PlaylistCount) {
				text = "Playlist: " + plman.GetPlaylistName(activeList) + "\n<--- Empty --->";
			}

			gr.DrawString(text, gdi.font("Segoe Ui", 16, 0), RGB(80,80,80), startX,startY, ww-startX,wh-startY-geo.lower_bar_h, StringFormat(1, 1));

		}
		gr.SetSmoothingMode(SmoothingMode.AntiAlias);
	}

	if (showDrawTiming)
		drawStuff.Print();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function show_lyrics(gr, tab, posy) {
	var i, k, text_colour;
	divider_spacing = 10;

 	if (showDebugTiming)
		show_lyricsTime = fb.CreateProfiler("show_lyrics");
	gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
	g_txt_align = cc_stringformat;

	if (dividerImg && dividerImg.width<(albumart_size.w-10) && posy-divider_spacing-dividerImg.height>=albumart_size.y+H_PADDING)
		gr.DrawImage(dividerImg, albumart_size.x+(albumart_size.w-dividerImg.width)/2, posy-divider_spacing-dividerImg.height, dividerImg.width, dividerImg.height, 0,0,dividerImg.width,dividerImg.height, 180);
	for(i=0;i<tab.length;i++) {
		if(posy>=albumart_size.y+H_PADDING && posy<albumart_size.h-H_PADDING) {
			if(i==focus && g_lyrics_status==1) {
				text_colour = g_txt_highlightcolour;
			} else {
				if(g_lyrics_status==0) {
					text_colour = g_txt_highlightcolour;
				} else {
					text_colour = g_txt_normalcolour;
				}
			}
			lineHeight = tab[i].total_lines*LINE_HEIGHT;
			//TEXT_GLOW = 0;
			// maybe redo this to use albumart_size.x+(albumart_size.w-lyricsWidth)/2  and  lyricsWidth
			TEXT_GLOW &&   gr.DrawString(tab[i].text, g_font, g_txt_shadowcolor, albumart_size.x+(albumart_size.w-lyricsWidth)/2-1, posy, lyricsWidth, lineHeight, g_txt_align);
			//TEXT_GLOW &&   gr.DrawString(tab[i].text, g_font, g_txt_glowcolour, albumart_size.x+(albumart_size.w-lyricsWidth)/2+1, posy-1, lyricsWidth, lineHeight, g_txt_align);
			TEXT_GLOW &&   gr.DrawString(tab[i].text, g_font, g_txt_shadowcolor, albumart_size.x+(albumart_size.w-lyricsWidth)/2,   posy-1, lyricsWidth, lineHeight, g_txt_align);
			//TEXT_GLOW &&   gr.DrawString(tab[i].text, g_font, g_txt_glowcolour, albumart_size.x+(albumart_size.w-lyricsWidth)/2,   posy,   lyricsWidth, lineHeight, g_txt_align);
			TEXT_SHADOW && gr.DrawString(tab[i].text, g_font, g_txt_shadowcolor, albumart_size.x+(albumart_size.w-lyricsWidth)/2+2, posy+2, lyricsWidth, lineHeight, g_txt_align);
						   gr.DrawString(tab[i].text, g_font, text_colour, albumart_size.x+(albumart_size.w-lyricsWidth)/2, posy, lyricsWidth, lineHeight, g_txt_align);
		}
		posy = Math.floor(posy+LINE_HEIGHT+((tab[i].total_lines-1)*LINE_HEIGHT));
	}
	posy+=divider_spacing;
	if (dividerImg && dividerImg.width<(albumart_size.w-10) && posy<albumart_size.h-H_PADDING)
		gr.DrawImage(dividerImg, albumart_size.x+(albumart_size.w-dividerImg.width)/2, posy, dividerImg.width, dividerImg.height, 0,0,dividerImg.width,dividerImg.height);

	if (showDebugTiming)
		show_lyricsTime.Print();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function onRatingMenu(x, y) {
	var MF_SEPARATOR = 0x00000800;
	var MF_STRING = 0x00000000;
	var idx;
	var _menu = window.CreatePopupMenu();

	menu_down = true;

	var rating=fb.TitleFormat("%rating%").Eval();

	_menu.AppendMenuItem(MF_STRING, 1,  "No rating");
	_menu.CheckMenuItem(1, rating==null?1:0);
	_menu.AppendMenuItem(MF_STRING, 11, "1 Star");
	_menu.CheckMenuItem(11, rating==1?1:0);
	_menu.AppendMenuItem(MF_STRING, 12, "2 Stars");
	_menu.CheckMenuItem(12, rating==2?1:0);
	_menu.AppendMenuItem(MF_STRING, 13, "3 Stars");
	_menu.CheckMenuItem(13, rating==3?1:0);
	_menu.AppendMenuItem(MF_STRING, 14, "4 Stars");
	_menu.CheckMenuItem(14, rating==4?1:0);
	_menu.AppendMenuItem(MF_STRING, 15, "5 Stars");
	_menu.CheckMenuItem(15, rating==5?1:0);

	idx = _menu.TrackPopupMenu(x, y);
	switch(idx) {
		case 1:
			fb.RunContextCommand("Playback Statistics/Rating/<not set>");
			break;
		case 11:
			fb.RunContextCommand("Playback Statistics/Rating/1");
			break;
		case 12:
			fb.RunContextCommand("Playback Statistics/Rating/2");
			break;
		case 13:
			fb.RunContextCommand("Playback Statistics/Rating/3");
			break;
		case 14:
			fb.RunContextCommand("Playback Statistics/Rating/4");
			break;
		case 15:
			fb.RunContextCommand("Playback Statistics/Rating/5");
			break;
	}
	_menu.Dispose();
	menu_down = false;
}

//function Show_Menu_Settings(entry, x, y) {
function onSettingsMenu(x, y) {
	var MF_SEPARATOR = 0x00000800;
	var MF_STRING = 0x00000000;
	var MF_GRAYED = 0x00000001;
	var MF_DISABLED = 0x00000002;
	var MF_POPUP = 0x00000010;
	var idx;

	menu_down = true;

	// Settings
	var _menu = window.CreatePopupMenu();
	var _rotationMenu = window.CreatePopupMenu();
	var _debugMenu = window.CreatePopupMenu();

	//var pbo = fb.PlaybackOrder;
	_menu.AppendMenuItem(MF_STRING, 1, 'Cycle Through All Artwork');
	_menu.CheckMenuItem(1, pref.aa_glob);
	_menu.AppendMenuItem(MF_STRING, 4, 'Display CD Art (cd.pngs)');
	_menu.CheckMenuItem(4, pref.display_cdart);
	_menu.AppendMenuItem(pref.display_cdart ? MF_STRING : MF_DISABLED, 5, 'Rotate CD Art on track change');
	_menu.CheckMenuItem(5, pref.rotate_cdart);

	_rotationMenu.AppendMenuItem(MF_STRING, 30, '2 degrees');
	_rotationMenu.AppendMenuItem(MF_STRING, 31, '3 degrees');
	_rotationMenu.AppendMenuItem(MF_STRING, 32, '4 degrees');
	_rotationMenu.AppendMenuItem(MF_STRING, 33, '5 degrees');
	_rotationMenu.CheckMenuRadioItem(30, 33, parseInt(pref.rotation_amt)+28);
	_rotationMenu.AppendTo(_menu, MF_STRING, 'CD Art Rotation Amount');

	_menu.AppendMenuItem(MF_STRING, 6, 'Display CD Art above cover');
	_menu.CheckMenuItem(pref.display_cdart ? MF_STRING : MF_DISABLED, pref.cdart_ontop);
	_menu.AppendMenuItem(MF_STRING, 7, 'Cache Artwork (won\'t fetch on every next track)');
	_menu.CheckMenuItem(7, pref.cache_images);
	_menu.AppendMenuSeparator();
	_menu.AppendMenuItem(MF_STRING, 8, 'Blink Time When Paused');
	_menu.CheckMenuItem(8, pref.pause_blink);
	_menu.AppendMenuSeparator();

	/* should I even put this here because there is no visible change to the theme when it's changed? */
	_menu.AppendMenuItem(MF_STRING, 12, 'Display playlist on startup');
	_menu.CheckMenuItem(12, pref.start_Playlist);
	_menu.AppendMenuItem(MF_STRING, 13, 'Show transport controls');
	_menu.CheckMenuItem(13, pref.show_transport);
	_menu.AppendMenuSeparator();

	_menu.AppendMenuItem(MF_STRING, 15, 'Show Codec Images');
	_menu.CheckMenuItem(15, pref.show_codec_img);
	_menu.AppendMenuItem(pref.show_codec_img ? MF_STRING : MF_DISABLED, 16, 'Show Codec Image for mp3s');
	_menu.CheckMenuItem(16, pref.show_mp3_codec);
	_menu.AppendMenuSeparator();
	_menu.AppendMenuItem(MF_STRING, 17, 'Use Vinyl Style Numbering if Available');
	_menu.CheckMenuItem(17, pref.use_vinyl_nums);
	_menu.AppendMenuSeparator();
	_menu.AppendMenuItem(MF_STRING, 18, 'Show Artist Country Flags');
	_menu.CheckMenuItem(18, pref.show_flags);
	_menu.AppendMenuSeparator();
	_menu.AppendMenuItem(MF_STRING, 20, 'Look for multi-channel version of album on disc');
	_menu.CheckMenuItem(20, pref.check_multich);
	_menu.AppendMenuItem(MF_STRING, 21, 'Update Progress Bar frequently (higher CPU)');
	_menu.CheckMenuItem(21, pref.freq_update);
	_menu.AppendMenuSeparator();

	/* TODO: Remove this before release */
	_debugMenu.AppendMenuItem(MF_STRING, 90, 'Show debug output');
	_debugMenu.CheckMenuItem(90, showDebugOutput);
	_debugMenu.AppendMenuItem(MF_STRING, 91, 'Show draw timing');
	_debugMenu.CheckMenuItem(91, showDrawTiming);
	_debugMenu.AppendMenuItem(MF_STRING, 92, 'Show extra draw timing');
	_debugMenu.CheckMenuItem(92, showExtraDrawTiming);
	_debugMenu.AppendMenuItem(MF_STRING, 93, 'Show debug timing');
	_debugMenu.CheckMenuItem(93, showDebugTiming);
	_debugMenu.AppendTo(_menu, MF_STRING, 'Debug Logging');
	_menu.AppendMenuSeparator();
	_menu.AppendMenuItem(MF_STRING, 100, 'Lock Right Click...');
	_menu.CheckMenuItem(100, pref.locked);
	_menu.AppendMenuItem(MF_STRING, 101, 'Restart');

	idx = _menu.TrackPopupMenu(x, y);
	switch(idx) {
		case 1:
			pref.aa_glob = !pref.aa_glob;
			window.SetProperty("Art: Cycle through all images", pref.aa_glob);
			break;
		case 3:
			break;
		case 4:
			pref.display_cdart = !pref.display_cdart;
			window.SetProperty("Art: Display CD art", pref.display_cdart);
			fetchNewArtwork(fb.GetNowPlaying());
			lastLeftEdge = 0; // resize labels
			ResizeArtwork(true);
			RepaintWindow();
			break;
		case 5:
			pref.rotate_cdart = !pref.rotate_cdart;
			window.SetProperty("Art: Spin CD art on new track", pref.rotate_cdart);
			RepaintWindow();
			break;
		case 6:
			pref.cdart_ontop = !pref.cdart_ontop;
			window.SetProperty("Art: Show CD art above front cover", pref.cdart_ontop);
			RepaintWindow();
			break;
		case 7:
			pref.cache_images = !pref.cache_images;
			window.SetProperty("Art: Cache artwork locally", pref.cache_images);
			break;
		case 8:
			pref.pause_blink = !pref.pause_blink;
			window.SetProperty("Blink time when paused", pref.pause_blink);
			break;
		case 12:
			pref.start_Playlist = !pref.start_Playlist;
			window.SetProperty("Display playlist on startup", pref.start_Playlist);
			break;
		case 13:
			pref.show_transport = !pref.show_transport;
			window.SetProperty("Show transport controls", pref.show_transport);
			createButtonImages();
			createButtonObjects(ww, wh);
			ResizeArtwork(true);
			RepaintWindow();
			break;
		case 15:
			pref.show_codec_img = !pref.show_codec_img;
			window.SetProperty("Show images for codecs", pref.show_codec_img);
			LoadMediaTypeImage();
			RepaintWindow();
			break;
		case 16:
			pref.show_mp3_codec = !pref.show_mp3_codec;
			window.SetProperty("Show MP3 codec image", pref.show_mp3_codec);
			LoadMediaTypeImage();
			RepaintWindow();
			break;
		case 17:
			pref.use_vinyl_nums = !pref.use_vinyl_nums;
			window.SetProperty("Use vinyl style numbering (e.g. A1)", pref.use_vinyl_nums);
			RepaintWindow();
			break;
		case 18:
			pref.show_flags = !pref.show_flags;
			window.SetProperty("Show country flags", pref.show_flags);
			LoadCountryFlags();
			RepaintWindow();
			break;
		case 20:
			pref.check_multich = !pref.check_multich;
			window.SetProperty("Check for MultiChannel version", pref.check_multich);
			if (pref.check_multich)
				CheckForMultiChannelVersion();
			window.RepaintRect(0.5*ww, settingsY+settingsImg.height+10, 0.5*ww, 60);
			break;
		case 21:
			pref.freq_update = !pref.freq_update;
			window.SetProperty("Frequent progress bar updates", pref.freq_update);
			SetProgressBarRefresh();
			break;
		case 30:
		case 31:
		case 32:
		case 33:
			pref.rotation_amt = (idx-28) % 360;
			Math.abs(Math.max(0,pref.rotation_amt));
			window.SetProperty("Art: Degrees to rotate CDart", pref.rotation_amt);
			CreateRotatedCDImage();
			RepaintWindow();
			break;
		case 90:
			showDebugOutput = !showDebugOutput;
			window.SetProperty("Debug: Show Debug Output", showDebugOutput);
			break;
		case 91:
			showDrawTiming = !showDrawTiming;
			break;
		case 92:
			showExtraDrawTiming = !showExtraDrawTiming;
			break;
		case 93:
			showDebugTiming = !showDebugTiming;
			break;
		case 100:
			pref.locked = !pref.locked;
			window.SetProperty("Lock theme", pref.locked);
			//window.NotifyOthers("pref.locked", pref.locked);
			break;
		case 101:
			fb.RunMainMenuCommand("File/Restart");
			break;
	}
	_menu.Dispose();

	menu_down = false;
//	Refresh_Menu_Buttons();
	window.RepaintRect(pad_x, pad_y, menu_width, 24);
}

function on_mouse_leave() {
    buttonEventHandler(0, 0);
    hyperlinkEventHandler(0, 0);

	if (uiHacks && UIHacks.FrameStyle == 3) UIHacks.DisableSizing = false;
	mouseInPanel = false;
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
	if (!fso.folderExists(fb.ProfilePath + themeBaseName + '\\imgcache')) {
		fso.createFolder(fb.ProfilePath + themeBaseName + '\\imgcache');
	}
	ClearOldCachedFiles(fb.ProfilePath + themeBaseName + '\\imgcache');

	initList();

	str = clearUIVariables();

	on_size();

	last_path = '';

	last_pb = fb.PlaybackOrder;

	if (fb.IsPlaying || fb.IsPaused) {
		on_playback_new_track(fb.GetNowPlaying());
	}

	// color definitions
	g_txt_normalcolour = eval(TXT_NORMAL_COLOUR);
	g_txt_highlightcolour = eval(TXT_FOCUS_COLOUR);
	g_txt_shadowcolor = RGBA(000, 000, 000, 255);
	g_txt_glowcolour = eval(TXT_GLOW_COLOUR);
	g_dither_shadowcolour = RGBA(000, 000, 000, 150);

	console.log('clearing g_playtimer in on_init()');
	g_playtimer && window.ClearInterval(g_playtimer);
	g_playtimer = null;
}

// window size changed
function on_size() {
	console.log("in on_size()");
	ww = window.Width;
	wh = window.Height;
	console.log('width: ' + ww + ', height: ' + wh);
	var count = 0;

	if (ww <= 0 || wh <= 0) return;

	if (ww > 1920) {
		geo.prog_bar_h = 14;
	}

	lastLeftEdge = 0;

	ResizeArtwork(true);

	createButtonImages();
	createButtonObjects(ww, wh);

	// we aren't creating these buttons anymore, but we still use these values for now. TODO: replace these
	settingsY = btns[30].y;

	if (albumart)
		midpoint = Math.ceil(albumart_size.y + LINE_HEIGHT + albumart_size.h / 2);
	else
		midpoint = Math.ceil((wh-geo.lower_bar_h+LINE_HEIGHT)/2);
	if (displayLyrics) {
		refresh_lyrics();
	}

	listOnSize();
}

// new track
function on_playback_new_track(metadb) {
	console.log('in on_playback_new_track()');
	if (showDebugTiming) newTrackTime = fb.CreateProfiler('on_playback_new_track');
	start_timer = 0;
	lastLeftEdge = 0;
    newTrackFetchingArtwork = true;

	current_path = $('%directoryname%');

	SetProgressBarRefresh();

	if (globTimer) {
		window.ClearTimeout(globTimer);
		globTimer = 0;
	}

	// Fetch new albumart
	if (!pref.cache_images || (pref.aa_glob && aa_list.length != 1) || current_path != last_path || albumart == null ||
			fb.TitleFormat("$if2(%discnumber%,0)").Eval() != lastDiscNumber || fb.TitleFormat("$if2(" + tf.vinyl_side + ",ZZ)").Eval() != lastVinylSide) {
		fetchNewArtwork(metadb);
	}
	CreateRotatedCDImage();	// we need to always setup the rotated image because it rotates on every track

	/* code to retrieve record label logos */
	var labelStrings = [];
	while (recordLabels.length > 0)
		disposeImg(recordLabels.pop());
	for (i=0;i<tf.labels.length;i++) {
		for (j=0;j<fb.TitleFormat("$meta_num("+tf.labels[i]+")").eval();j++) {
			labelStrings.push(fb.TitleFormat("$meta(" + tf.labels[i] + "," + j +")").eval());
		}
	}
	labelStrings = eliminateDuplicates(labelStrings);
	for (i=0;i<labelStrings.length;i++) {
		if ((addLabel = LoadLabelImage(labelStrings[i].replace(/'/,'\'\''))) != null) {
			recordLabels.push(addLabel);
		}
	}

	function testBandLogo(imgDir, bandStr, isHQ) {
		var logoPath = imgDir + bandStr + '.png'
		if (utils.FileTest(logoPath, 'e')) {
			if (isHQ) {
				bandLogoHQ = true;
				console.log('Found band logo: ' + logoPath);
			}
			return logoPath;
		}
		return false;
	}

	/* code to retrieve band logo */
	bandStr = fb.TitleFormat("[%artist%]").Eval().replace(/"/g,'\'').replace(/:/g,'_').replace(/\//g,'-').replace(/\*/g,'').replace(/\?/g,'');
	bandLogo = disposeImg(bandLogo);
	if (bandStr) {
		bandLogoHQ = false;

		var path = testBandLogo(pref.logo_hq, bandStr, true) ||		// try 800x310 white
					testBandLogo(pref.logo_color, bandStr, true) ||	// try 800x310 color
					testBandLogo(pref.logo_base, bandStr, false);	// try 160x79
		if (path) {
			bandLogo = gdi.Image(path);
		}
	}

	// check if a MultiChannel version of the album currently playing is available in your library.
	// this theme assumes that the path of the current album is exactly the same, just in a different location. It could be easily modified to append a different tag on the end of the folder (i.e. "artist-2012-album [dts]")
	if (pref.check_multich) {
        CheckForMultiChannelVersion();
    }

	LoadMediaTypeImage();

	last_path = current_path;								// for art caching purposes
	lastDiscNumber = $('$if2(%discnumber%,0)');				// for art caching purposes
	lastVinylSide = $('$if2(" + tf.vinyl_side + ",ZZ)');
	currentRating = $('$if2(%rating%,)');					// save rating so we can update when it changes in on_metadb_changed()
	currentLastPlayed = $(tf.last_played);
	calcDateRatios();

	// enable "watch for tag changes" on new track
	metadb_handle = fb.GetNowPlaying();
	if (metadb_handle) {
		on_metadb_changed(); // refresh panel
	}

	on_playback_time();
	progressLength = 0;

	// Lyrics stuff
	console.log('clearing g_playtimer in on_playback_new_track()');
	g_playtimer && window.ClearInterval(g_playtimer);
	g_playtimer = null;
	if (displayLyrics) {	// no need to try retrieving them if we aren't going to display them now
		updateLyricsPositionOnScreen();
	}
	if (showDebugTiming) newTrackTime.Print();
}

// tag content changed
function on_metadb_changed() {
	console.log('on_metadb_changed()');
	if (fb.IsPaused || fb.IsPlaying) {
		title  = fb.TitleFormat(tf.title).Eval();
		artist = fb.TitleFormat(tf.artist).Eval();
		if (pref.use_vinyl_nums)
			tracknum = fb.TitleFormat(tf.vinyl_track).Eval();
		else
			tracknum = fb.TitleFormat(tf.tracknum).Eval();

		str.title = tracknum + title;
		str.artist = artist;
		str.year = $('$year($if2(%original release date%,%date%)))');
		str.album = $("[%album%][ '['"+ tf.album_trans +"']']");
		var codec = $("$lower($if2(%codec%,$ext(%path%)))");
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

		if (fb.IsPlaying || fb.IsPaused) {
			str.lower_bar1 = tracknum;
			str.lower_bar2 = title;
		}
		str.disc = fb.TitleFormat(tf.disc).Eval();

		h = Math.floor(fb.PlaybackLength/3600);
		m = Math.floor(fb.PlaybackLength%3600/60);
		s = Math.floor(fb.PlaybackLength%60);
		str.length = (h > 0 ? h+":"+(m < 10 ? "0":'')+m : m) + ":" + (s < 10 ? "0":'') + s;

		str.grid = [];
		for (k=0; k < tf.grid.length; k++) {
			val = $(tf.grid[k].val);
			if (val) {
				if (tf.grid[k].age) {
                    val = $('$date(' + val + ')');  // never show time
                    val += ' (' + calcAgeDateString(val) + ')';
				}
				str.grid.push({
					age: tf.grid[k].age,
					label: tf.grid[k].label,
					val: val,
				});
			}
		}

		if ($('%lastfm_play_count%') != '0') {
			playCountVerifiedByLastFm = true;
		} else {
			playCountVerifiedByLastFm = false;
		}

		rating = $('$if2(%rating%,)');
		if (rating.length > 0 && rating != currentRating) {
			currentRating = rating;
		}

		lastPlayed = $(tf.last_played);
		calcDateRatios($date(currentLastPlayed) !== $date(lastPlayed), currentLastPlayed);	// last_played has probably changed and we want to update the date bar
		if (!currentLastPlayed.length && lastPlayed.length) {
            currentLastPlayed = $date(lastPlayed);
            fullLastPlayed = toDatetime(lastPlayed);
            console.log('fullLastPlayed', fullLastPlayed, currentLastPlayed);
		}

		lp = str.grid.find(function(value) {
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

        tag_timer = 0;
	}
    createHyperlinks();
	refreshScrollbar();
	RepaintWindow();
}


// User activity

function on_playback_order_changed(this_pb) {
	// Repaint playback order
	if (this_pb != last_pb) {
		debugLog("Repainting on_playback_order_changed");
		window.RepaintRect(0.5*ww,wh-geo.lower_bar_h,0.5*ww,geo.lower_bar_h);
	}
	last_pb = this_pb;
}

function on_playback_seek() {
	progressMoved = true;
	if (displayLyrics) {
		refresh_lyrics();
	}
	on_playback_time();
}

var onMouseLbtnDown = false;

function on_mouse_lbtn_down(x, y, m) {
	var menu_yOffset = 19;
	if(y > wh-geo.lower_bar_h) {
		g_drag = 1;
	}

	// clicking on progress bar
	if(y>=wh-0.5*geo.lower_bar_h && y<=wh-0.5*geo.lower_bar_h+geo.prog_bar_h && x >= 0.025*ww && x < 0.975*ww) {
		var v = (x-0.025*ww) / (0.95*ww);
		v = (v < 0) ? 0 : (v < 1) ? v : 1;
		if (fb.PlaybackTime != v*fb.PlaybackLength) fb.PlaybackTime = v*fb.PlaybackLength;
		window.RepaintRect(0,wh-geo.lower_bar_h,ww,geo.lower_bar_h);
	}

    buttonEventHandler(x, y, m);
    hyperlinkEventHandler(x, y, m);

	if (displayPlaylist) {
		onMouseLbtnDown = true;
		if (!listLength) return;
		rowMouseEventHandler(x, y, m);
		scrollbarMouseEventHandler(x, y);
	}
}

function on_mouse_rbtn_down(x, y, m) {
	if (!listLength || !displayPlaylist) return;
	rowMouseEventHandler(x, y, m);
}

function on_mouse_lbtn_up(x, y, m) {
	g_drag = 0;

	if (just_dblclicked) {
		// You just did a double-click, so do nothing
		just_dblclicked = false;
	} else {
		if ((albumart && albumart_size.x <= x && albumart_size.y <= y && albumart_size.x+albumart_size.w >= x && albumart_size.y+albumart_size.h >= y) ||
			(!displayPlaylist && 0.5*(ww-geo.pause_size) <= x && 0.5*(wh-geo.pause_size) <= y && 0.5*(ww-geo.pause_size)+geo.pause_size >=x  && 0.5*(wh-geo.pause_size)+geo.pause_size >= y)) {
			fb.PlayOrPause();
		}
	}
	on_mouse_move(x, y);
    buttonEventHandler(x, y, m);
    hyperlinkEventHandler(x, y, m);

	onMouseLbtnDown = false;
	if (displayPlaylist) {
		if (uiHacks) {
			try {
				if (UIHacks && UIHacks.FrameStyle == 3 && UIHacks.DisableSizing) {
					UIHacks.DisableSizing = false;
				}
			} catch (e) {
				console.log(e)
			};
		}

		if (!listLength) return;

		rowMouseEventHandler(x, y, m);
		scrollbarMouseEventHandler(x, y);
	}
}

function on_mouse_lbtn_dblclk(x, y, m) {
	if (!displayPlaylist) {
		// re-initialise the panel
		just_dblclicked = true;
		if (fb.IsPlaying || fb.IsPaused)
			on_playback_new_track(fb.GetNowPlaying());
		if (displayLyrics) {
			refresh_lyrics();
		}
	}
    buttonEventHandler(x, y, m);
	rowMouseEventHandler(x, y, m);
    hyperlinkEventHandler(x, y, m);
	scrollbarMouseEventHandler(x, y);
}

function on_mouse_move(x, y, m) {
	if (x != state["mouse_x"] || y != state["mouse_y"]) {
		window.SetCursor(32512);	// arrow
		if (g_drag) {
			var v = (x-0.025*ww) / (0.95*ww);
			v = (v < 0) ? 0 : (v < 1) ? v : 1;
			if (fb.PlaybackTime != v*fb.PlaybackLength) fb.PlaybackTime = v*fb.PlaybackLength;
		}
		state["mouse_x"] = x;
		state["mouse_y"] = y;
		if (pref.hide_cursor) {
			window.ClearTimeout(hideCursor);
			//debugLog("on_mouse_move: creating window.SetCursor() timeout with timeout = " + 10000);
			hideCursor = window.SetTimeout(function() {
	            // if there's a menu id (i.e. a menu is down) we don't want the cursor to ever disappear
				if (!menu_down) {
					window.SetCursor(-1);	// hide cursor
				}
			}, 10000);
		}

        buttonEventHandler(x, y, m);
        hyperlinkEventHandler(x, y, m);

		if (displayPlaylist) {
			if (uiHacks) {
				try {
					if (m && UIHacks && UIHacks.FrameStyle == 3 && !UIHacks.DisableSizing) {
						UIHacks.DisableSizing = true;
					}
				} catch (e) {
					console.log(e)
				};
			}
			if (!listLength) return;
			rowMouseEventHandler(x, y, m);
			scrollbarMouseEventHandler(x, y);
		}
	}
}

function on_mouse_wheel(delta) {
	if(state["mouse_y"] > wh - geo.lower_bar_h) {
		fb.PlaybackTime = fb.PlaybackTime - delta * pref.mouse_wheel_seek_speed;
		refresh_seekbar();
		return;
	}
	if (displayPlaylist) {
		if (!listLength) return;
		if (state["mouse_x"] > ww * 0.5 && state["mouse_y"] > btns[30].y + btns[30].h + 10)
		scrollbarMouseEventHandler(delta);
	}
}
// =================================================== //

function on_mouse_leave() {

	rowMouseEventHandler(0, 0);
	scrollbarMouseEventHandler(0, 0);

}

function on_playlist_switch() {
	if (showDebugOutput)
		console.log("on_playlist_switch()");
	initList();
	if (!showNowPlayingCalled && autoExpandCollapseGroups && autoCollapseOnPlaylistSwitch) collapseExpand("collapse");
	if (plman.ActivePlaylist == plman.PlayingPlaylist) showNowPlaying();
	showNowPlayingCalled = false;

}
// =================================================== //

function on_playlists_changed() {
	if (showDebugOutput)
		console.log("on_playlists_changed()");
	if (plman.ActivePlaylist > plman.PlaylistCount - 1) {
		plman.ActivePlaylist = plman.PlaylistCount - 1;
	}
	window.SetProperty("system.List Step", '');
	initList();
}
// =================================================== //

function on_playlist_items_reordered(playlist) {
	if (playlist != activeList) return;
	if (showDebugOutput)
		console.log("on_playlist_items_reordered("+playlist+")");
	initList();
}
// =================================================== //

function on_playlist_items_removed(playlist) {
	if (showDebugOutput)
		console.log("on_playlist_items_removed("+playlist+")");
	if (playlist != activeList) return;
	initList();
}
// =================================================== //

function on_playlist_items_added(playlist) {

	if (playlist != activeList) return;

	if (dragOverID && !linkToLastItem) {

		if (dragOverID.isGroupHeader) {

			plman.MovePlaylistSelection(playlist, -(playlistItemCount - firstItem[dragOverID.groupNr]));

		} else {

			plman.MovePlaylistSelection(playlist, -(playlistItemCount - dragOverID.nr));

		}

	}

	dragOverID = undefined;
	fileDrag = false;
	initList();

	if (linkToLastItem) {
		onScrollStep("scrollToEnd");
		linkToLastItem = false;
		refreshScrollbar();
	}
}

// =================================================== //

function on_playlist_items_selection_change() {

	repaintList();

	if (!mouseOverList) { //this code executes only if selection is made from external panel.
		if (plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count <= 1) {
			selectedIndexes = [];
			window.Repaint();
		}
	}

	if (showPlaylistInfo) {

		selectedIndexes.length > 0 ? selectionLength = calculateSelectionLaength() : selectionLength = $("[%length%]", fb.GetNowPlaying());

		if (selectionLength == "0:00")
			selectionLength = totalLength;

		window.RepaintRect(0, 0, ww, 24);
	}

}

function on_item_focus_change(playlistId, from, to) {
	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	if (CtrlKeyPressed || ShiftKeyPressed) repaintList();
	if (!ShiftKeyPressed) tempFocusItemIndex = undefined;

	if (!CtrlKeyPressed && !ShiftKeyPressed && plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count > 1) repaintList();

	focusGroupNr = -1;

	if (!onMouseLbtnDown && plman.ActivePlaylist == plman.PlayingPlaylist) displayFocusItem(to);

	for (var i = 0; i != maxRows; i++) {

		var ID = playlist[i + listStep[activeList]];
		try {

			var groupNr = ID.groupNr;
			if (isCollapsed[groupNr] && ID.isGroupHeader) {
				for (var item = firstItem[groupNr]; item <= lastItem[groupNr]; item++) {
					if (to == item) {
						focusGroupNr = groupNr;
						window.Repaint();
						return;
					}
				}
			}

		} catch (e) {
			console.log("playlist ")
		}

	}

}

function on_key_down(vkey) {

	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	var focusItemIndex = plman.GetPlaylistFocusItemIndex(activeList);

	if (!ShiftKeyPressed || tempFocusItemIndex == undefined) tempFocusItemIndex = focusItemIndex;

	keyPressed = true;

	switch (vkey) {
		case VK_UP:
			if (focusItemIndex == 0 && !listIsScrolledUp) displayFocusItem(0);
			if (focusItemIndex == 0) return;

			if (ShiftKeyPressed) {

				if (tempFocusItemIndex == focusItemIndex) {
					plman.ClearPlaylistSelection(activeList);
					plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, true);
				}

				if (tempFocusItemIndex < focusItemIndex) {
					plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, false);
				}

				plman.SetPlaylistSelectionSingle(activeList, focusItemIndex - 1, true);

			}

			if (!CtrlKeyPressed && !ShiftKeyPressed) {
				plman.ClearPlaylistSelection(activeList);
				plman.SetPlaylistSelectionSingle(activeList, focusItemIndex - 1, true);
			}

			plman.SetPlaylistFocusItem(activeList, focusItemIndex - 1);
			break;
		case VK_DOWN:
			if (focusItemIndex == (playlistItemCount - 1) && !listIsScrolledDown) displayFocusItem(focusItemIndex);
			if (focusItemIndex == (playlistItemCount - 1)) return;

			if (ShiftKeyPressed) {

				if (tempFocusItemIndex == focusItemIndex) {
					plman.ClearPlaylistSelection(activeList);
					plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, true);
				}

				if (tempFocusItemIndex > focusItemIndex) {
					plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, false);
				}

				plman.SetPlaylistSelectionSingle(activeList, focusItemIndex + 1, true);

			}

			if (!CtrlKeyPressed && !ShiftKeyPressed) {
				plman.ClearPlaylistSelection(activeList);
				plman.SetPlaylistSelectionSingle(activeList, focusItemIndex + 1, true);
			}
			plman.SetPlaylistFocusItem(activeList, focusItemIndex + 1);
			break;
		case VK_PGUP:	// VK_PRIOR
			var IDnr = 0;	// go to first item unless there's a scroll bar

			if (needsScrollbar) {
				var currID = playlist[Math.floor(maxRows / 2) + listStep[activeList]];
				fastScrollActive = true;
				onScrollStep(1, maxRows); // PAGE UP
				var ID = playlist[Math.floor(maxRows / 2) + listStep[activeList]];
				if (currID !== ID) {	// did the page change?
					ID.isGroupHeader ? IDnr = firstItem[ID.groupNr] : IDnr = ID.nr;
				}
			}

			plman.ClearPlaylistSelection(activeList);
			plman.SetPlaylistSelectionSingle(activeList, IDnr, true);
			plman.SetPlaylistFocusItem(activeList, IDnr);
			break
		case VK_PGDN:	// VK_NEXT
			var IDnr = (playlistItemCount - 1);	// go to last item unless there's a scrollbar

			if (needsScrollbar) {
				var currID = playlist[Math.floor(maxRows / 2) + listStep[activeList]];
				fastScrollActive = true;
				onScrollStep(-1, maxRows); // PAGE DOWN
				var ID = playlist[Math.floor(maxRows / 2) + listStep[activeList]];
				if (currID !== ID) {	// did the page change?
					ID.isGroupHeader ? IDnr = firstItem[ID.groupNr] : IDnr = ID.nr;
				}
			}

			plman.ClearPlaylistSelection(activeList);
			plman.SetPlaylistSelectionSingle(activeList, IDnr, true);
			plman.SetPlaylistFocusItem(activeList, IDnr);
			break;
		case VK_DELETE:
			plman.RemovePlaylistSelection(activeList, crop = false);
			break;
		case VK_KEY_A:
			CtrlKeyPressed && selectAll();
			break;
		case VK_KEY_F:
			CtrlKeyPressed && fb.RunMainMenuCommand("Edit/Search");
			ShiftKeyPressed && !CtrlKeyPressed && fb.RunMainMenuCommand("Library/Search");
			break;
		case VK_RETURN:

			plman.ExecutePlaylistDefaultAction(activeList, focusItemIndex);
			newTrackByClick = true;

			break;

		case VK_HOME:

			plman.ClearPlaylistSelection(activeList);
			plman.SetPlaylistSelectionSingle(activeList, 0, true);
			plman.SetPlaylistFocusItem(activeList, 0);

			break;
		case VK_END:

			plman.ClearPlaylistSelection(activeList);
			plman.SetPlaylistSelectionSingle(activeList, (playlistItemCount - 1), true);
			plman.SetPlaylistFocusItem(activeList, (playlistItemCount - 1));

			break;
		case VK_KEY_N:
			if (CtrlKeyPressed) {

				plman.CreatePlaylist(plman.PlaylistCount, '');
				plman.ActivePlaylist = plman.PlaylistCount - 1;

			}
			break;
		case VK_KEY_O:
			if (ShiftKeyPressed) {
				fb.RunContextCommandWithMetadb("Open Containing Folder", fb.GetFocusItem());
			}
			break;
		case VK_KEY_P:
			if (CtrlKeyPressed) {
				fb.RunMainMenuCommand("File/Preferences");
			}
			break;
		case VK_KEY_M:
			if (CtrlKeyPressed) {
				fb.RunMainMenuCommand("View/Playlist Manager");
			}
			break;
		case VK_KEY_Q:
			if (CtrlKeyPressed && ShiftKeyPressed) {
				plman.FlushPlaybackQueue();
				return;
			}

			if (CtrlKeyPressed) {
				console.log(activeList, focusItemIndex);
				plman.AddPlaylistItemToPlaybackQueue(activeList, focusItemIndex);
			} else if (ShiftKeyPressed) {
				var index = plman.FindPlaybackQueueItemIndex(fb.GetFocusItem(), activeList, focusItemIndex)
				plman.RemoveItemFromPlaybackQueue(index);
			}
			break;
		case VK_KEY_M:
			break;
		case 0x6B:		// VK_ADD ??
		case 0x6D:		// VK_SUBTRACT ??
			if (CtrlKeyPressed && ShiftKeyPressed) {
				var action = vkey === 0x6B ? '+' : '-';
				if (fb.IsPlaying || fb.IsPaused) {
					var metadb = fb.GetNowPlaying();
					fb.RunContextCommandWithMetadb('Rating/' + action, metadb);
				} else if (!metadb && displayPlaylist) {
					var metadbList = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
					if (metadbList.Count === 1) {
						fb.RunContextCommandWithMetadb('Rating/' + action, metadbList.Item(0));
					} else {
						console.log('Won\'t change rating with more than one selected item');
					}
				}
			}
			break;
		default:
			// console.log('unhandled key: ' + vkey)
			break;
	}

}
// =================================================== //

function on_playback_queue_changed(origin) {
	// only listen for added/removed
	if (origin === 0 || origin === 1) {
		repaintList();
	}
}

function on_key_up(vkey) {
	if (vkey == VK_PRIOR || vkey == VK_NEXT) {
		fastScrollActive = false;
		getAlbumArt();
	}
}

function on_playback_pause(state) {
	if (pref.show_transport) {
		createButtonObjects(ww, wh);
		window.RepaintRect(btns[2].x, btns[2].y, btns[2].w, btns[2].h);	// redraw play/pause button
	}
	if (pref.pause_blink) {
		if (state) {
			debugLog("on_playback_pause: creating pause_blink_timer() interval with delay = " + 750);
			pauseTimer = window.SetInterval(function() {
				pause_blink_timer();
				}, 750);
		}
	}
	if (state) {	// pausing
		if (timer) window.ClearInterval(timer);
		timer = 0;
		// fadeAlpha = 255;	// make text visible again on pause
		window.RepaintRect(0.015*ww, 0.12*wh, Math.max(albumart_size.x-0.015*ww,0.015*ww), wh-geo.lower_bar_h-0.12*wh);
	} else {		// unpausing
		if (pauseTimer > 0) window.ClearInterval(pauseTimer);
		showTimeElapsed = true;
		if (timer > 0) window.ClearInterval(timer);	// clear to avoid multiple timers which can happen depending on the playback state when theme is loaded
		debugLog("on_playback_pause: creating refresh_seekbar() interval with delay = " + t_interval);
		timer = window.SetInterval(function() {
			refresh_seekbar();
		}, t_interval);
	}

	// Draws grey pause button on album art
	if (albumart) {
		debugLog("Repainting on_playback_pause");
		if (!displayLyrics)		// if we are displaying lyrics we need to refresh all the lyrics to avoid tearing at the edges of the pause button
			window.RepaintRect(albumart_size.x+0.5*(albumart_size.w-geo.pause_size), albumart_size.y+0.5*(albumart_size.h-geo.pause_size),geo.pause_size+1,geo.pause_size+1);
		else
			window.RepaintRect(albumart_size.x+(albumart_size.w-lyricsWidth)/2, albumart_size.y+H_PADDING, lyricsWidth, albumart_size.h-H_PADDING*2);
		}
	else {
		debugLog("Repainting on_playback_pause no albumart");
		window.RepaintRect(0.5*(ww-geo.pause_size), 0.5*(wh-geo.pause_size),geo.pause_size+1,geo.pause_size+1);
	}
	repaintList();
}

function on_playback_stop(reason) {
	if (reason != 2) { // 2 = starting_another
		// clear all variables and repaint
		str = clearUIVariables()
		debugLog("Repainting on_playback_stop");
		RepaintWindow();
		last_path = '';
		lastDiscNumber = "0";
		while (recordLabels.length > 0) {
			disposeImg(recordLabels.pop());
		}
		if (metadb_handle) {
			metadb_handle = null;
		}
		repaintList();
		createButtonObjects(ww, wh);	// switch pause button to play
	}
	timer && window.ClearInterval(timer);
	if (globTimer)
		window.ClearTimeout(globTimer);
	if (albumart && ((pref.aa_glob && aa_list.length != 1) || (!pref.cache_images || last_path == ''))) {
		debugLog("disposing artwork");
		albumart = disposeImg(albumart);
		albumart_scaled = disposeImg(albumart_scaled);
	}
	if (cdart && (!pref.cache_images || last_path == '')) {
		console.log("Disposing cdart");
		cdart = disposeCDImg(cdart);
	}
	bandLogo = disposeImg(bandLogo);
	mediaTypeImg = disposeImg(mediaTypeImg);
	while (flagImgs.length > 0)
		disposeImg(flagImgs.pop());
	rotatedCD = disposeImg(rotatedCD);
	globTimer = 0;

	g_playtimer && window.ClearInterval(g_playtimer);
	g_playtimer = null;
	if (reason==0) {
		// Stop
		window.Repaint();
	}
	ClearOldCachedFiles(fb.ProfilePath + themeBaseName + '\\imgcache');
}

function on_playback_starting(cmd, is_paused) {
	if (pref.hide_cursor) {
		window.SetCursor(-1);	// hide cursor
	}
	createButtonObjects(ww, wh);	// play button to pause
	repaintList();
}

function on_playback_edited(metadb) {
	repaintList();
}

function on_drag_enter(action, x, y, mask) {
	dropped = false;

	if (listLength && (y > (r[maxRows - 1].y + rowH)) && !linkToLastItem && ((needsScrollbar && listIsScrolledDown) || !needsScrollbar)) {
		linkToLastItem = true;
		r[maxRows - 1].repaint();

	} else linkToLastItem = false;
}
// =================================================== //

function on_drag_drop(action, x, y, mask) {

	var idx;

	if (!plman.PlaylistCount) {
		idx = plman.CreatePlaylist(0, "Default");
		plman.ActivePlaylist = 0;
	} else {
		plman.ClearPlaylistSelection(activeList);
		idx = activeList;
	}

	if (idx !== undefined) {
		action.ToPlaylist();
		action.Playlist = idx;
		action.ToSelect = true;
	}

	dropped = true;
	fileDrag = false;
	repaintList();
}
// =================================================== //

function on_drag_over(action, x, y, mask) {

	rowMouseEventHandler(x, y);

}
// =================================================== //

function on_drag_leave() {

	dragOverID = undefined;
	fileDrag = linkToLastItem = dropped = false;

	repaintList();

	if (scrollStepRepeatTimerStarted) {
		stopScrollRepeat();
	}

}
// =================================================== //

function clearUIVariables() {
	return {
		artist: '',
		title: '',
		year: '',
		lower_bar1: stoppedStr1,
		lower_bar2: stoppedStr2,
		grid: [],
		time: ''
	}
}

function ClearOldCachedFiles(path) {
	clearCache = fb.CreateProfiler("ClearOldCachedFiles");
	var totalSize = 0;
	var fileList = [];
	pref.max_cache_size = Math.abs(Math.min(250, pref.max_cache_size));	// don't allow cache size to be > 250 MB
	dir = fso.GetFolder(path);
	if (dir.size > pref.max_cache_size*1024*1024) {
		var files = utils.Glob(path + "\\*.*").toArray();
		for (i=0; i<files.length; i++) {	// create temp array to speed up sorting by reducing amount of GetFile calls in .sort
			fileList.push({ name: files[i], date: fso.GetFile(files[i]).DateCreated })
		}
		fileList.sort(function (a, b) {
			return b.date - a.date;	// sort descending
		});
		for (i=0; i<fileList.length; i++) {
			f = fso.GetFile(fileList[i].name);
			totalSize += f.size;
			if (totalSize < pref.max_cache_size*1024*1024) {
				console.log(fileList[i].date + " - " + fileList[i].name.substring(62));
			} else {
				// delete files
				try {
					console.log('Deleting: ' + fileList[i].date + " - " + fileList[i].name.substring(62));
					f = fso.GetFile(fileList[i].name);
					f.Delete(true);
				} catch (e) {
					console.log("unable to delete " + fileList[i].name);
				}
			}
		}
	}
	clearCache.Print();
}

function getAlbumArt() {	// only used for playlist
	console.log("in getAlbumArt()");
	if (!displayPlaylist || !showAlbumArt || fastScrollActive) return;
	for (var i = 0; i != maxRows; i++) {
		var ID = playlist[i + listStep[activeList]];
		var groupNr = ID.groupNr;
		if (ID.isGroupHeader) {
			if (groupNr != tempGroupNrOnGetAlbumArt) {
				g_image_cache.hit(ID.metadb);
				repaintList();
			}
			tempGroupNrOnGetAlbumArt = groupNr;
		}
	}
}

function AttemptToLoadCachedImage(path, copy) {
	var image = null,
		compare = false;

	if (pref.cache_images) {
		cacheAttempt = fb.CreateProfiler("AttemptToLoadCachedImage");
		/* this function returns null if the cached file cannot be found, or if the file is found but the file size is different on host machine */
		console.log("AttemptToLoadCachedImage: path = " + path + ", copy=" + copy);
		var parsedName = path.replace(/ /g,'').replace(/:/g,'').replace(/\//g,'').replace(/\*/g,'').replace(/\\/g,'');
		var fixedFullPath = fb.ProfilePath + "georgia\\imgcache\\" + parsedName;

		if (!cachedImageCompare.hasOwnProperty(path)) {	// we only want to compare cache file sizes once per restart
			cachedImageCompare[path] = true;			// save key/value and then force a comparison
			compare = true;
		}
		if (fso.FileExists(fixedFullPath) && (!compare || fso.FileExists(path))) {
			if (compare) {
				console.log('Comparing image file sizes.');
				f = fso.GetFile(path);
			}
			c = fso.GetFile(fixedFullPath);
			if (!compare || f.Size == c.Size) {
				if (showDebugOutput) {
					console.log(" - cache hit for " + fixedFullPath);
				}
				image = gdi.Image(fixedFullPath);
			} else if (copy === true) {
				if (compare) {
					console.log("File sizes changed from " + c.Size + " (cached) to " + f.Size + " (disk)");
				}
				try {
					c.Close;
					c.Delete(true);
					f.copy(fixedFullPath);	// file size has changed, so attempt to copy it again
					image = gdi.Image(fixedFullPath);
				} catch(e) {
					image = null;
				}
			}
		}
		else if (fso.FileExists(path) && copy === true) {
			try {
				f = fso.GetFile(path);
				f.copy(fixedFullPath);
				image = gdi.Image(fixedFullPath);
			} catch(e) {
				image = null; // not sure we can get here, but just in case
			}
		}
		cacheAttempt.Print();
	}
	return image;
}

var artSize = rowsInGroup * rowH - 8;	// for fastest performance artSize here needs to correspond to groupH - padding * 2 in on_paint

/* this can only be used to load front cover images for the playlist */
function GetAlbumArtAsync(id, metadb, imageType, groupNum) {
	if (pref.cache_images) {
		var path = $("$replace(%path%,%filename_ext%,)folder.jpg", metadb);
		var image = AttemptToLoadCachedImage(path, true);
		if (image === null) {
			console.log("cache miss in GetAlbumArtAsync");
			utils.GetAlbumArtAsync(id, metadb, AlbumArtId.front);
		} else {
			if (image && image.Height > artSize)
				image = image.Resize(artSize, artSize, 0);
			g_image_cache.store(metadb, image);
			repaintList();
		}
	}
	else
		utils.GetAlbumArtAsync(id, metadb, AlbumArtId.front);
}

// album art retrieved from GetAlbumArtAsync
function on_get_album_art_done(metadb, art_id, image, path) {
	if (metadb_handle && metadb_handle.Path == metadb.Path) {
		albumart_scaled = disposeImg(albumart_scaled);
		ResizeArtwork(true); // recalculate image positions and recreate shadow image
		CreateRotatedCDImage();
		lastLeftEdge = 0;	// recalc label location
		RepaintWindow(); // calls on_paint()
	}

	var tempGroupNr = -1;

	for (var i = 0; i != maxRows; i++) {
		var ID = playlist[i + listStep[activeList]];
		var groupNr = ID.groupNr;
		if (ID.isGroupHeader && groupNr != tempGroupNr && ID.metadb.Compare(metadb)) {
			g_image_cache.getit(metadb, 1, image);
			tempGroupNr = groupNr;
			repaintList();
			break;
		}
	}
}

// returned from LoadImageAsync
function on_load_image_done(cookie, image) {
	if (showDebugOutput)
		console.log("on_load_image_done returned")
	if (cookie == disc_art_loading) {
		disposeCDImg(cdart);	// delay disposal so we don't get flashing
		cdart = image;
		ResizeArtwork(true);
		CreateRotatedCDImage();
		lastLeftEdge = 0;	// recalc label location
	}
	else if (cookie == album_art_loading) {
		disposeImg(albumart);	// delay disposal so we don't get flashing
		albumart = image;
		if (retrieveThemeColorsWhenLoaded && newTrackFetchingArtwork) {
			getThemeColors(albumart);
			retrieveThemeColorsWhenLoaded = false;
			newTrackFetchingArtwork = false;
		}
		ResizeArtwork(true);
		cdart && CreateRotatedCDImage();
		lastLeftEdge = 0;	// recalc label location
		displayLyrics && updateLyricsPositionOnScreen();
	}
	RepaintWindow();
}

function on_script_unload() {
	console.log("Unloading Script");
	// it appears we don't need to dispose the images which we loaded using gdi.Image in their declaration for some reason. Attempting to dispose them causes a script error.
}

// Timed events

function on_playback_time(){
	// Refresh playback time
	if (showTimeElapsed)
		str.time = $('%playback_time%');
	else
		str.time = '';

	// at each new second, hundredth is reset to 0 (Increment on timer every 100ms)
	hundredth = 0;
	if(displayLyrics && g_lyrics_status==0 && lyricsWidth>0 && albumart_size.w>0) {
		if(elap_seconds.Eval()==3) {
			refresh_lyrics();
		}
		window.RepaintRect(albumart_size.x+(albumart_size.w-lyricsWidth)/2, albumart_size.y+H_PADDING, lyricsWidth, albumart_size.h-H_PADDING*2);
	}
}

function refresh_seekbar() {
	//debugLog("in refresh_seekbar()");
	window.RepaintRect(0.025*ww,wh-geo.lower_bar_h,0.95*ww,geo.lower_bar_h, true);
}


// TIMER Callback functions
function pause_blink_timer() {
	showTimeElapsed = !showTimeElapsed;
	on_playback_time();
	refresh_seekbar();
}

function doRotateImage() {
	console.log("doRotateImate: " + albumArtIndex);
	albumArtIndex = (albumArtIndex + 1) % aa_list.length;
	glob_image(albumArtIndex);
	lastLeftEdge = 0;
	debugLog("Repainting in doRotateImage");
	RepaintWindow();
	globTimer = window.SetTimeout(function() {
		doRotateImage();
	}, pref.t_aa_glob*1000);
}

function timerTick(id) {
	if (displayLyrics) {
		var t1 = elap_seconds.Eval() * 100 + hundredth;
		var t2 = len_seconds.Eval() * 100;
		var p1, p2;

		if(t1>t2-200) {
			// stop scrolling in final 2 seconds to make sure we clear interval
			console.log('clearing g_playtimer because t1 > t2-200 - t1 = ' + t1 + ', t2 = ' + t2);
			g_playtimer && window.clearInterval(g_playtimer);
			g_playtimer = null;
		}

		if(g_playtimer) {
			if(!g_is_scrolling && t1>=g_tab[focus_next].timer) {
				p1 = g_tab[focus].ante_lines*LINE_HEIGHT;
				p2 = g_tab[focus_next].ante_lines*LINE_HEIGHT;
				g_scroll = (p2 - p1);
				console.log("about to scroll " + g_scroll + " pixels");
				change_focus();
				g_is_scrolling = true;
			}
			g_timer_abs--;
			if (g_scroll>0) {
				lyrPos -= g_scroll<SCROLL_STEP?g_scroll:SCROLL_STEP;
				g_scroll -= g_scroll<SCROLL_STEP?g_scroll:SCROLL_STEP;
				if(g_timer_abs<=1) {
					g_timer_abs = 4;
					window.RepaintRect(albumart_size.x+(albumart_size.w-lyricsWidth)/2, albumart_size.y+H_PADDING, lyricsWidth, albumart_size.h-H_PADDING*2);
				}
			} else {
				g_timer_abs = 4;
				g_is_scrolling = false;
			}
		}
	}
	hundredth = (hundredth+1) % 100;
}

function createShadowRect(width, height) {
	shadow = gdi.CreateImage(width + 2*geo.aa_shadow, height + 2*geo.aa_shadow);
	shimg = shadow.GetGraphics();
	shimg.FillRoundRect(geo.aa_shadow, geo.aa_shadow, width, height, 0.5*geo.aa_shadow, 0.5*geo.aa_shadow, col.aa_shadow);
	shadow.ReleaseGraphics(shimg);
	shadow.StackBlur(geo.aa_shadow);

	return shadow;
}

// HELPER FUNCTIONS
function createDropShadow() {
	if (showDebugTiming) shadow = fb.CreateProfiler("createDropShadow");
	if (albumart && albumart_size.w > 0) {
		disposeImg(shadow_image);
		if (cdart && !displayPlaylist && pref.display_cdart)
			shadow_image = gdi.CreateImage(cdart_size.x+cdart_size.w+2*geo.aa_shadow, albumart_size.h+2*geo.aa_shadow);
		else
			shadow_image = gdi.CreateImage(albumart_size.x + albumart_size.w + 2*geo.aa_shadow, albumart_size.h + 2*geo.aa_shadow);
		if (shadow_image) {
			shimg = shadow_image.GetGraphics();
			shimg.FillRoundRect(geo.aa_shadow, geo.aa_shadow, albumart_size.x + albumart_size.w, albumart_size.h,
				0.5*geo.aa_shadow, 0.5*geo.aa_shadow, col.aa_shadow);

			if (cdart && pref.display_cdart && !displayPlaylist) {
				var offset = cdart_size.w * 0.40;	// don't change this value
				var xVal = cdart_size.x;
				var shadowOffset = geo.aa_shadow*2;
				shimg.DrawEllipse(xVal+shadowOffset, shadowOffset+1, cdart_size.w-shadowOffset, cdart_size.w-shadowOffset, geo.aa_shadow, col.aa_shadow);	// outer shadow
				shimg.DrawEllipse(xVal+geo.aa_shadow+offset-2, offset+geo.aa_shadow+1, cdart_size.w-offset*2, cdart_size.h-offset*2, 60, col.aa_shadow);	// inner shadow
			}
			shadow_image.ReleaseGraphics(shimg);
			shadow_image.StackBlur(geo.aa_shadow);
		}
	}

	try {
		playlist_shadow = gdi.CreateImage(Math.floor(ww*0.5+40), wh - (btns[30].y + btns[30].h) - geo.lower_bar_h + 20);
		if (playlist_shadow) {
			shimg = playlist_shadow.GetGraphics();
			shimg.FillRoundRect(15, 15, playlist_shadow.width-20, playlist_shadow.height-50, 10, 10, col.aa_shadow);
			playlist_shadow.ReleaseGraphics(shimg);
			playlist_shadow.StackBlur(geo.aa_shadow);
		}
	} catch(e) {}

	if (showDebugTiming) shadow.Print();
}

function SetProgressBarRefresh()
{
	debugLog("SetProgressBarRefresh()");
	if (fb.PlaybackLength > 0) {
		if (pref.freq_update) {
			t_interval = Math.abs(Math.ceil(1000/((0.95*ww)/fb.PlaybackLength)));	// we want to update the progress bar for every pixel so divide total time by number of pixels in progress bar
			while (t_interval>500)														// we want even multiples of the base t_interval, so that the progress bar always updates as smoothly as possible
				t_interval = Math.floor(t_interval/2);
			while (t_interval<35)
				t_interval*=2;
		} else {
			t_interval = 1000;	// for slow computers, only update once a second
		}

		if (showDebugTiming)
			console.log("Progress bar will update every " + t_interval + "ms or " + 1000/t_interval + " times per second.");

		timer && window.ClearInterval(timer);
		timer = null;
		if (!fb.IsPaused) {	// only create timer if actually playing
			timer = window.SetInterval(function() {
				refresh_seekbar();
			}, t_interval);
		}
	}
}

function parseJson(json, label) {
	var parsed = [];
	try {
		console.log(label + json);
		parsed = JSON.parse(json);
	} catch (e) {
		console.log('<<< ERROR IN parseJson >>>');
		console.log(json);
	}
	return parsed;
}

function calcAgeRatio(num, divisor) {
	return toFixed(1.0 - (calcAge(num, false)/divisor), 3);
}

function calcDateRatios(dontUpdateLastPlayed, currentLastPlayed) {
	dontUpdateLastPlayed = dontUpdateLastPlayed || false;

	playedTimesRatios = [];
	lfmPlayedTimesRatios = [];
	var added = 	    toDatetime($('%added%'));
    var first_played =  toDatetime($('[%first_played%]'));
    var last_played	=   toDatetime($('[%last_played%]'));
    console.log('%last_played%:', $('[%last_played%]'));
    if (dontUpdateLastPlayed) {
        last_played = new Date(toDatetime(currentLastPlayed)).getTime();
        console.log('currentLastPlayed: ', currentLastPlayed, ' => ', last_played);
    }

    var lfmPlayedTimes = [];
	if (componentEnhancedPlaycount) {
		var raw = $('[%played_times_js%]', fb.GetNowPlaying());
		var lastfm = $('[%lastfm_played_times_js%]', fb.GetNowPlaying());
        lfmPlayedTimes = parseJson(lastfm, 'lastfm: ');
	}

	playedTimes = parseJson(raw, 'foobar: ');
	added = new Date(added);
	added = added.getTime();
	if (lfmPlayedTimes.length && lfmPlayedTimes[0] < added) {
		added = lfmPlayedTimes[0];
		console.log('plays before added, so moving added');
	}

    if (playedTimes.length) {
		if (lfmPlayedTimes.length) {
            first_played = Math.min(playedTimes[0], lfmPlayedTimes[0]);
            if (!dontUpdateLastPlayed) {
                last_played = Math.max(playedTimes.slice(-1)[0], lfmPlayedTimes.slice(-1)[0]);
                console.log('updating last played:', last_played, playedTimes.slice(-1), lfmPlayedTimes.slice(-1));
            }
		} else {
			first_played = playedTimes[0];
			if (!dontUpdateLastPlayed) {
                last_played = playedTimes.slice(-1)[0];
            }
        }
        console.log('last_played:', last_played);   // TODO: remove
	}
	if (added && (first_played || lfmPlayedTimes.length)) {
        age = calcAge(added, false);
        console.log('added:', added, first_played);
        if (lfmPlayedTimes.length && lfmPlayedTimes[0] < new Date(first_played).getTime()) {
            first_played = lfmPlayedTimes[0];
        }

        console.log(' fp >>>', playedTimes[0], calcAgeRatio(playedTimes[0], age), lfmPlayedTimes[0],  calcAgeRatio(lfmPlayedTimes[0], age));
		tl_firstPlayedRatio = calcAgeRatio(first_played, age);
        tl_lastPlayedRatio = calcAgeRatio(last_played, age);
        console.log('fp (' + first_played + ') ratio: ', tl_firstPlayedRatio, 'lp (' + last_played + ') ratio:', tl_lastPlayedRatio);
        if (tl_lastPlayedRatio < tl_firstPlayedRatio) {
            // due to daylight savings time, if there's a single play before the time changed lastPlayed could be < firstPlayed
            tl_lastPlayedRatio = tl_firstPlayedRatio;
            console.log('>>>>>>> - lp < fp')
        }
        console.log(' LP >>>>', last_played)

        if (playedTimes.length) {
			for (i=0; i < playedTimes.length; i++) {
				var ratio = calcAgeRatio(playedTimes[i], age);
                playedTimesRatios.push(ratio);
                // console.log('ratio', i + ':', ratio);
			}
		} else {
			playedTimesRatios = [tl_firstPlayedRatio, tl_lastPlayedRatio];
		}

		var j = 0;
		var tempPlayedTimesRatios = playedTimesRatios.slice();
		tempPlayedTimesRatios.push(1.0001);	// pick up every last.fm time after last_played fb knows about
		for (i=0; i < tempPlayedTimesRatios.length; i++) {
			while(j < lfmPlayedTimes.length &&
 				(ratio = calcAgeRatio(lfmPlayedTimes[j], age)) < tempPlayedTimesRatios[i]) {
				playedTimesRatios.push(ratio);
				// console.log(ratio);
				j++;
			}
			if (ratio === tempPlayedTimesRatios[i]) {	// skip one instance
				console.log('skipped -->', ratio);
				j++;
			}
		}

	} else {
		tl_firstPlayedRatio = 0.33;
		tl_lastPlayedRatio = 0.66;
	}
}

function glob_image(index) {
	var temp_albumart = AttemptToLoadCachedImage(aa_list[index], true);
	if (temp_albumart) {
		albumart = disposeImg(albumart);
		albumart = temp_albumart;
		if (cdart) {
			ResizeArtwork(false);
			CreateRotatedCDImage();
		}
		if (index === 0 && newTrackFetchingArtwork) {
			newTrackFetchingArtwork = false;
			getThemeColors(albumart);
		}
	} else {
		album_art_loading = gdi.LoadImageAsync(window.ID, aa_list[index]);
		if (index === 0) {
			retrieveThemeColorsWhenLoaded = true;
		}
	}
	ResizeArtwork(false); // recalculate image positions
	displayLyrics && updateLyricsPositionOnScreen();
}

function fisherYates ( myArray ) {
	var i = myArray.length;
	if ( i == 0 ) return false;
	while ( --i ) {
		var j = Math.floor( Math.random() * ( i + 1 ) );
		var tempi = myArray[i];
		var tempj = myArray[j];
		myArray[i] = tempj;
		myArray[j] = tempi;
	}
}

function eliminateDuplicates(imgPathArray) {
	var i,
	out=[],
	obj={};
	pattern = /(cd|vinyl)([0-9]*|[a-h])\.png/i;

	for (i=0;i<imgPathArray.length;i++) {
		obj[imgPathArray[i]]=0;
	}
	for (i in obj) {
		if (!pattern.test(i))	// we don't want to display cd/vinyl pngs in the album art area because they are probably transparent
			out.push(i);
	}
	return out;
}

/* I use the debugLog function instead of console.log so that I can easily hide messages that I don't want cluttering the console constantly */
function debugLog(str) {
	if (showDebugOutput) console.log(str);
}

function disposeImg(oldImage) {
	if (oldImage)
		oldImage.Dispose();
	return null;
}

function disposeCDImg(cdImage) {
	cdart_size = new ImageSize(0,0,0,0);
	disposeImg(cdImage);
	return null;
}

function CreateRotatedCDImage() {
	rotatedCD = disposeImg(rotatedCD);
	if (pref.display_cdart) {	// drawing cdArt rotated is slow, so first draw it rotated into the rotatedCD image, and then draw rotatedCD image unrotated in on_paint
		if (cdart && cdart_size.w > 0) {	// cdart must be square so just use cdart_size.w (width)
			rotatedCD = gdi.CreateImage(cdart_size.w,cdart_size.w);
			rotCDimg = rotatedCD.GetGraphics();
			trackNum = parseInt(fb.TitleFormat("$num($if(" + tf.vinyl_tracknum + ",$sub($mul(" + tf.vinyl_tracknum + ",2),1),$if2(%tracknumber%,1)),1)").Eval())-1;
			if (!pref.rotate_cdart || trackNum != trackNum) trackNum = 0;	// avoid NaN issues when changing tracks rapidly
			rotCDimg.DrawImage(cdart, 0, 0, cdart_size.w, cdart_size.w, 0, 0, 1000, 1000, trackNum*pref.rotation_amt, 255);
			rotatedCD.ReleaseGraphics(rotCDimg);
		}
	}
}

function CreateScaledBGImage() {
	if (ww && wh) {
		scaled_bg_img = gdi.CreateImage(ww,wh-geo.lower_bar_h-1);
		bg_graphics = scaled_bg_img.GetGraphics();
		bg_graphics.DrawImage(image_bg, 0, 0, ww, wh-geo.lower_bar_h-1, 0, 0, image_bg.Width, image_bg.Height-geo.lower_bar_h);
		bg_graphics.FillGradRect(0, wh-geo.lower_bar_h-geo.lower_bar_h+2, ww, geo.lower_bar_h, 90, RGBA(0,0,0,0), RGBA(0,0,0,255),0.99);// for some reason focus can't be 1.0 otherwise we get a dark line at the top
		scaled_bg_img.ReleaseGraphics(bg_graphics);
	}
}

function CreateAlbumArtScaledImage() {
	albumart_scaled = disposeImg(albumart_scaled);
	if (albumart_size.w > 0 && albumart_size.h > 0) {
		albumart_scaled = gdi.CreateImage(albumart_size.w, albumart_size.h);
		aa_graphics = albumart_scaled.GetGraphics();
		aa_graphics.DrawImage(albumart, 0,0,albumart_size.w,albumart_size.h, 0,0,albumart.Width,albumart.Height);
		albumart_scaled.ReleaseGraphics(aa_graphics);
	}
}

function ResizeArtwork(resetCDPosition) {
	if (albumart) {
		// Size for big albumart
		// var album_scale = Math.min((displayPlaylist ? 0.47*ww : 0.95*ww) / albumart.Width, 0.935*(wh-geo.lower_bar_h-32) / albumart.Height);
		var album_scale = Math.min((displayPlaylist ? 0.47*ww : 0.75*ww) / albumart.Width, (wh - 96 - geo.lower_bar_h - 32) / albumart.Height);
		// album_scale = Math.min(album_scale, 2);
		if (displayPlaylist)
			xCenter = 0.25*ww;
		else if (ww/wh < 1.40)		 // when using a roughly 4:3 display the album art crowds, so move it slightly off center
			xCenter = 0.56*ww;
		else
			xCenter = 0.5*ww;
		albumart_size.w = Math.floor(albumart.Width * album_scale);											// width
		albumart_size.h = Math.floor(albumart.Height * album_scale);										// height
        albumart_size.x = Math.floor(xCenter-0.5 * albumart_size.w);										// left
        if (album_scale !== (wh - 96 - geo.lower_bar_h - 32) / albumart.Height) {
            // restricted by width

        }
		albumart_size.y = 32 + 32 + 32;		// height of menu bar + spacing + height of Artist text         // top
		if (btns[34] && albumart_size.x+albumart_size.w > btns[34].x-50) {
            albumart_size.y += 16 - pref.show_transport*6;
        }

		CreateAlbumArtScaledImage();

		if (resetCDPosition) {
			if (ww - (albumart_size.x + albumart_size.w) < albumart_size.h*pref.cdart_amount+5)
				cdart_size.x = Math.floor(0.99*ww - albumart_size.h);
			else
				cdart_size.x = Math.floor(albumart_size.x + albumart_size.w - (albumart_size.h-4)*(1-pref.cdart_amount));
			cdart_size.y = albumart_size.y+2;
			cdart_size.w = albumart_size.h-4;		// cdart must be square so use the height of album art for width of cdart
			cdart_size.h = cdart_size.w;
		} else {	// when CDArt moves because folder images are different sizes we want to push it outwards, but not move it back in so it jumps around less
			cdart_size.x = Math.max(cdart_size.x, Math.floor(Math.min(0.99*ww - albumart_size.h, albumart_size.x + albumart_size.w - (albumart_size.h-4)*(1-pref.cdart_amount))));
			cdart_size.y = cdart_size.y > 0 ? Math.min(cdart_size.y, albumart_size.y+2) : albumart_size.y+2;
			cdart_size.w = Math.max(cdart_size.w, albumart_size.h-4);
			cdart_size.h = cdart_size.w;
		}
		createDropShadow();
	} else {
		albumart_size = new ImageSize(0,0,0,0);
		cdart_size = new ImageSize(0,0,0,0);		// TODO: Should probably display disc if we can't show album art
	}
}

function LoadCountryFlags() {
	while (flagImgs.length) {
		disposeImg(flagImgs.pop());
	}
	for (i=0; i<$('$meta_num('+tf.artist_country+')'); i++) {
			path = $(pref.flags_base) + $('$meta(' + tf.artist_country + ',' + i +')').replace(/ /g,'-') + '.png';
			var fImg = gdi.Image(path);
			fImg && flagImgs.push(fImg);
	}
}

function LoadLabelImage(publisherString) {
	recordLabel = null;
	d = new Date();
	labelStr = $(publisherString.replace(']','').replace('[','').replace(':',''));
	if (labelStr) {
		/* First check for record label folder */
		lastSrchYear = d.getFullYear();
		dir = pref.label_base;	// also used below
		if (utils.FileTest(dir+labelStr, 'd') ||
				utils.FileTest(dir + (labelStr = labelStr.replace(/ Records$/,'')
														.replace(/ Recordings$/,'')
														.replace(/ Music$/,'')
														.replace(/\.$/,''))
				,'d')) {
			year = parseInt($('$year(%date%)'));
			for (; year <= lastSrchYear; year++) {
				yearFolder = dir + labelStr + '\\' + year;
				if (utils.FileTest(yearFolder, 'd')) {
					console.log('Found folder for ' + labelStr + ' for year ' + year + '.');
					dir += labelStr+'\\'+ year + '\\';
					break;
				}
			}
			if (year > lastSrchYear) {
				dir += labelStr + '\\'; 	/* we didn't find a year folder so use the "default" logo in the root */
			}
		}
		/* actually load the label from either the directory we found above, or the base record label folder */
		labelStr = $(publisherString.replace(']','').replace('[','').replace(':',''));	// we need to start over with the original string when searching for the file, just to be safe
		label = dir + labelStr + '.png';
		if (utils.FileTest(label, 'e')) {
			recordLabel = gdi.Image(label);
		} else {
			labelStr = labelStr.replace(/ Records$/,'').replace(/ Recordings$/,'').replace(/ Music$/,'');
			label = dir+labelStr + '.png';
			if (utils.FileTest(label, 'e')) {
				recordLabel = gdi.Image(label);
			} else {
				label = dir+labelStr + ' Records.png';
				if (utils.FileTest(label, 'e')) {
					recordLabel = gdi.Image(label);
				}
			}
		}
	}
	return recordLabel;
}

function fetchNewArtwork(metadb) {
	if (showDebugTiming) artworkTime = fb.CreateProfiler('fetchNewArtwork');
	console.log('Fetching new art');	// can remove this soon
	aa_list = [];
	var disc_art_exists = true;

	if (pref.display_cdart) {			// we must attempt to load CD/vinyl art first so that the shadow is drawn correctly
		cdartPath = $(pref.vinylside_path);					// try vinyl%vinyl disc%.png first
		if (!utils.FileTest(cdartPath, 'e')) {
			cdartPath = $(pref.vinyl_path);					// try vinyl.png
			if (!utils.FileTest(cdartPath, 'e')) {
				cdartPath = $(pref.cdartdisc_path);			// try cd%discnumber%.png
				if (!utils.FileTest(cdartPath, 'e')) {
					cdartPath = $(pref.cdart_path);			// cd%discnumber%.png didn't exist so try cd.png.
					if (!utils.FileTest(cdartPath, 'e'))
						disc_art_exists = false;			// didn't find anything
				}
			}
		}
		if (disc_art_exists) {
			var temp_cdart = AttemptToLoadCachedImage(cdartPath, true);
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
	if (showDebugTiming) artworkTime.Print();

	for (k = 0; k < tf.glob_paths.length; k++) {
		aa_list = aa_list.concat(utils.Glob($(tf.glob_paths[k])).toArray());
	}
	aa_list = eliminateDuplicates(aa_list); // remove duplicates
	if (aa_list.length) {
		noArtwork = false;
		if (aa_list.length > 1 && pref.aa_glob) {
			globTimer = window.SetTimeout(function() {
				doRotateImage();
			}, pref.t_aa_glob * 1000);
		}
		albumArtIndex = 0;
		glob_image(albumArtIndex); // display first image
	} else {
		noArtwork = true;
		albumart = null;
		ResizeArtwork(true);
		debugLog("Repainting on_playback_new_track due to no cover image");
		RepaintWindow();
	}
	if (showDebugTiming) artworkTime.Print();
}


function RepaintWindow() {
	debugLog("Repainting from RepaintWindow()");
	window.Repaint();
}

function LoadMediaTypeImage() {
	mediaTypeImg = disposeImg(mediaTypeImg);
	if (pref.show_codec_img) {
		codec = fb.TitleFormat("[%codec%]").Eval();
		switch (codec) {
			case "DTS":
				mediaTypeImg = gdi.Image(pref.codec_base+"DTS.png");
				break;
			case "ATSC A/52":
				mediaTypeImg = gdi.Image(pref.codec_base+"Dolby Digital.png");
				break;
			case "FLAC":
				mediaTypeImg = gdi.Image(pref.codec_base+"FLAC.png");
				break;
			case "Vorbis":
				mediaTypeImg = gdi.Image(pref.codec_base+"Ogg.png");
				break;
			case "MP3":
				if (pref.show_mp3_codec)
					mediaTypeImg = gdi.Image(pref.codec_base+"mp3.png");
				else
					mediaTypeImg = null;
				break;
			case "default":
				console.log("Unknown codec: "+codec);
				break;
			}
		}
	return;
}

function CheckForMultiChannelVersion() {
	var folder_list = [];
	for(k = 0;k<tf.MultiCh_paths.length; k++) {
		folder_list = folder_list.concat(utils.Glob(fb.TitleFormat(tf.MultiCh_paths[k]).Eval()).toArray());
	}
	if (folder_list.length > 0)
		multiChannelAvailable = true;
	else
		multiChannelAvailable = false;
	window.RepaintRect(0.5*ww, settingsY+settingsImg.height+10, 0.5*ww, 60);
}

function createHyperlinks() {
    hyperlinks = [];
    // hyperlinks.push(new Hyperlink($('%artist%'), ft.album_sml, col.grid_key, 'artist', Math.round(ww/2), 44));
}

function createButtonObjects(ww, wh) {

	btns = [];

	if (typeof btnImg === 'undefined')
		createButtonImages();
	else if (ww <= 0 || wh <= 0)
		return;

	//---> Transport buttons
	if (pref.show_transport) {
		var add = 0;
		var count = 4;
		if (showRandomButton) count++;
		if (showOpenExplorerButton) count++;

		var y = 5; //barY + 5;
		var w = 32;
		var h = w;
		var p = 5;	// space between buttons
		var x = (ww - w * count - p * (count-1)) / 2;

		var count = 0;

		btns[0] = new Button(x, y, w, h, "Stop", btnImg.Stop, "Stop");
		btns[++count] = new Button(x + (w + p) * count, y, w, h, "Previous", btnImg.Previous, '');
		btns[++count] = new Button(x + (w + p) * count, y, w, h, "Play/Pause", (fb.IsPlaying ? (fb.IsPaused ? btnImg.Play : btnImg.Pause) : btnImg.Play));
		btns[++count] = new Button(x + (w + p) * count, y, w, h, "Next", btnImg.Next);
		if(showRandomButton){
			btns[++count] = new Button(x + (w + p) * count, y, w, h, "Playback/Random", btnImg.PlaybackRandom, "Play Random Song");
		}
	}

	//---> Caption buttons
	if (uiHacks && UIHacks.FrameStyle) {

		(UIHacks.FrameStyle == FrameStyle.SmallCaption && UIHacks.FullScreen != true) ? hideClose = true : hideClose = false;

		var y = 5;
		var w = 22;
		var h = w;
		var p = 3;
		var x = ww - w * (hideClose ? 2 : 3) - p * (hideClose ? 1 : 2) - 8;

		btns[10] = new Button(x, y, w, h, "Minimize", btnImg.Minimize);
		btns[11] = new Button(x + w + p, y, w, h, "Maximize", btnImg.Maximize);
		if (!hideClose)
			btns[12] = new Button(x + (w + p) * 2, y, w, h, "Close", btnImg.Close);

	}
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
	var x = ww-settingsImg.width*2;
	var y =	15;
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
	var img = btnImg.Playlist;
	var w = img[0].width;
	x -= (w + 10);
	btns[34] = new Button(x, y, w, h, 'Playlist', img, 'Show Playlist');
	/* if a new image button is added to the left of playlist we need to update the ResizeArtwork code */
}

// =================================================== //

function createButtonImages() {
	if (showExtraDrawTiming) createButtonTime = fb.CreateProfiler('createButtonImages');

	try {
		var btn = {

			Stop: {
				ico: Guifx.Stop,
				font: ft.guifx,
			   	type: "playback",
				w: 30,
				h: 30
			},
			Previous: {
				ico: Guifx.Previous,
				font: ft.guifx,
				type: "playback",
				w: 30,
				h: 30
			},
			Play: {
				ico: Guifx.Play,
				font: ft.guifx,
				type: "playback",
				w: 30,
				h: 30
			},
			Pause: {
				ico: Guifx.Pause,
				font: ft.guifx,
				type: "playback",
				w: 30,
				h: 30
			},
			Next: {
				ico: Guifx.Next,
				font: ft.guifx,
				type: "playback",
				w: 30,
				h: 30
			},
			PlaybackRandom: {
				ico: Guifx.SlowForward,
				font: ft.guifx,
				type: "playback",
				w: 30,
				h: 30
			},
			ColorTheme: {
				ico: Guifx.Guifx,
				font: ft.guifx,
				type: "playback",
				w: 30,
				h: 30
			},
			Minimize: {
				ico: "0",
				font: fontMarlett,
				type: "caption",
				w: 22,
				h: 22
			},
			Maximize: {
				ico: "2",
				font: fontMarlett,
				type: "caption",
				w: 22,
				h: 22
			},
			Close: {
				ico: "r",
				font: fontMarlett,
				type: "caption",
				w: 22,
				h: 22
			},
			File: {
				ico: "File",
				font: fontSegoeUi,
				type: "menu"
			},
			Edit: {
				ico: "Edit",
				font: fontSegoeUi,
				type: "menu"
			},
			View: {
				ico: "View",
				font: fontSegoeUi,
				type: "menu"
			},
			Playback: {
				ico: "Playback",
				font: fontSegoeUi,
				type: "menu"
			},
			Library: {
				ico: "Library",
				font: fontSegoeUi,
				type: "menu"
			},
			Help: {
				ico: "Help",
				font: fontSegoeUi,
				type: "menu"
			},
			Playlists: {
				ico: "Playlists",
				font: fontSegoeUi,
				type: "menu"
			},
			Options: {
				ico: "Options",
				font: fontSegoeUi,
				type: "menu"
			},


			Playlist: {
				/*ico: "Playlist",
				font: fontSegoeUi,
				type: "menu"*/
				ico: playlistImg,
				type: "image",
				w: playlistImg.width,
				h: playlistImg.height
			},
			Lyrics: {
				ico: lyricsImg,
				type: "image",
				w: lyricsImg.width,
				h: lyricsImg.height
			},
			Rating: {
				ico: ratingsImg,
				type: "image",
				w: ratingsImg.width,
				h: ratingsImg.height
			},
			Properties: {
				ico: propertiesImg,
				type: "image",
				w: propertiesImg.width,
				h: propertiesImg.height
			},
			Settings: {
				ico: settingsImg,
				type: "image",
				id: "settings",
				w: settingsImg.width,
				h: settingsImg.height
			},
		};
	} catch (e) {
		var str = pref.lyrics_img;
		console.log("**********************************");
		console.log("ATTENTION: Buttons could not be created, most likely because the images were not found in \"" + str.substring(0, str.lastIndexOf("/")) + '\"');//.Eval().substring(0, str.lastIndexOf("/")));
		console.log("Make sure you installed the theme correctly to your configuration folder.")
		console.log("**********************************");
	}


	btnImg = [];

	for (var i in btn) {

		if (btn[i].type == "menu") {
			var img = gdi.CreateImage(100, 100);
			g = img.GetGraphics();

			btn[i].w = Math.ceil(g.MeasureString(btn[i].ico, btn[i].font, 0, 0, 0, 0).Width) + 17;
			img.ReleaseGraphics(g);
			img.Dispose();
			btn[i].h = 21;
		}

		var w = btn[i].w,
			h = btn[i].h,
			lw = 2;

		var stateImages = []; //0=normal, 1=hover, 2=down;

		for (var s = 0; s <= 2; s++) {

			var img = gdi.CreateImage(w, h);
			g = img.GetGraphics();
            g.SetSmoothingMode(SmoothingMode.AntiAlias);
			if (btn[i].type !== 'playback') {
				g.SetTextRenderingHint(TextRenderingHint.AntiAlias);    // positions playback icons weirdly
			}

			var menuTextColor = RGB(140, 142, 144);
			var menuRectColor = RGB(120, 122, 124);
			var captionIcoColor = RGB(140, 142, 144);
			var playbackIcoColor = RGB(150, 152, 154);
			var playbackEllypseColor = RGB(80, 80, 80);
			if (btn[i].id == "settings")
				var iconAlpha = 150;
			else if (btn[i].id == "NextBtn" || btn[i].id == "PrevBtn")
				var iconAlpha = 0;
			else
				var iconAlpha = 140;

			if (s == 1) {
				menuTextColor = RGB(180, 182, 184);
				menuRectColor = RGB(160, 162, 164);
				captionIcoColor = RGB(190, 192, 194);
				playbackIcoColor = RGB(190, 192, 194);
				playbackEllypseColor = RGB(190, 195, 200);
				if (btn[i].id == "settings")
					iconAlpha = 230;
				else if (btn[i].id == "NextBtn" || btn[i].id == "PrevBtn")
					iconAlpha = 255;
				else
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
			} else if (btn[i].type == 'playback') {
                g.DrawEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, lw, playbackEllypseColor);
                g.DrawString(btn[i].ico, btn[i].font, playbackIcoColor, (i == 'Stop' || i == 'OpenExplorer') ? 0 : 1, 0, w, h, StringFormat(1, 1));
			} else if (btn[i].type == 'image') {
				g.DrawImage(btn[i].ico, Math.round((w-btn[i].ico.width)/2),Math.round((h-btn[i].ico.height)/2),btn[i].ico.width,btn[i].ico.height, 0,0,btn[i].ico.width,btn[i].ico.height, 0,iconAlpha);
			}
			//--->

			img.ReleaseGraphics(g);
			stateImages[s] = img;

		}

		btnImg[i] = stateImages;

	}
	if (showExtraDrawTiming) createButtonTime.Print();
}
// =================================================== //



// =================================================== //

function selectAll() {

	for (var i = 0; i != playlistItemCount; i++) {
		selectedIndexes[i] = i;
	}

	plman.SetPlaylistSelection(plman.ActivePlaylist, selectedIndexes, true);

}
// =================================================== //

function resizeDone() {
	// console.log("resizeDone()");
	// to speed up draw times, we scale the bg image once, and then draw it without scaling in on_paint which is up to 3-4x faster
	scaled_bg_img = disposeImg(scaled_bg_img);
	CreateScaledBGImage();

	progressMoved = true;
	SetProgressBarRefresh();
	window.Repaint();
	if (displayPlaylist && listLength) {
		getAlbumArt();
	}
}
// =================================================== //

function calculateSelectionLaength() {

	var selectionLengthInSeconds = 0;
	var a = selectedIndexes[0];
	var b = selectedIndexes[selectedIndexes.length - 1];

	for (var item = a; item <= b; item++) {

		selectionLengthInSeconds += parseFloat(fb.TitleFormat("%length_seconds_fp%").EvalWithMetadb(getPlaylistItems.Item(item)));
	}

	return timeFormat(selectionLengthInSeconds);

}
// =================================================== //

function calculateGroupLength(a, b) {

	var groupLengthInSeconds = 0;

	for (var item = a; item <= b; item++) {
		groupLengthInSeconds += parseFloat(fb.TitleFormat("%length_seconds_fp%").EvalWithMetadb(getPlaylistItems.Item(item)));
	}
	return timeFormat(groupLengthInSeconds);

}
// =================================================== //

function calculateDiscLength(a, b) {

	var discLengthInSeconds = 0;
	var disc = parseInt(fb.TitleFormat("%discnumber%").EvalWithMetadb(getPlaylistItems.Item(a)));

	for (var item = a; item <= b; item++) {
		if (disc == parseInt(fb.TitleFormat("%discnumber%").EvalWithMetadb(getPlaylistItems.Item(item))))
			discLengthInSeconds += parseFloat(fb.TitleFormat("%length_seconds_fp%").EvalWithMetadb(getPlaylistItems.Item(item)));
		else
			break;	// on a different disc, so stop
	}

	return timeFormat(discLengthInSeconds);

}
// =================================================== //

function repaintList() {
	if (displayPlaylist) {
		// var ex = 10;
		listW && window.RepaintRect(listX - listLeft, listY - 10, listW + listLeft + listRight, listH + 20);
	}
}
// =================================================== //


function collapseExpand(arg, nowPlaying) {

	if (!playlistItemCount) return;
	var playingID = plman.GetPlayingItemLocation().PlaylistItemIndex;
	if (typeof (arg) == "number") {
		var thisGroupNr = arg;

		if (isCollapsed[thisGroupNr]) {
			for (var j = lastItemID[thisGroupNr]; j >= firstItemID[thisGroupNr]; j--) {
				playlist.splice(_firstItemID[thisGroupNr], 0, $playlist[j]);
			}

			isCollapsed[thisGroupNr] = false;
		} else {
			playlist.splice(_firstItemID[thisGroupNr], itemCount[thisGroupNr]);
			isCollapsed[thisGroupNr] = true;
		}
	} else {
		for (var i = groupNr; i >= 0; i--) {
			if (arg == "collapse") {
				if (isCollapsed[i] && i == nowPlaying) {
					var thisGroupNr = nowPlaying;

					for (var j = lastItemID[thisGroupNr]; j >= firstItemID[thisGroupNr]; j--) {
						playlist.splice(_firstItemID[thisGroupNr], 0, $playlist[j]);
					}

					isCollapsed[thisGroupNr] = false;
				}

				if (i == nowPlaying) continue;

				if (!isCollapsed[i]) {
					playlist.splice(_firstItemID[i], itemCount[i]);
					isCollapsed[i] = true;
				}

			} else if (arg == "expand") {
				playlist = $playlist.slice(0);
				for (var i = groupNr; i >= 0; i--) {
					isCollapsed = [];
				}
			}
		} //eol
	}

	//---> update _firstItemID
	for (var i = 0; playlist[i]; i++) {
		var ID = playlist[i];

		if (ID.isGroupHeader && ID.rowNr == rowsInGroup) {
			_firstItemID[ID.groupNr] = i + 1;
		}
	} //eol

	listLength = playlist.length;
	listOnSize();
	window.Repaint();

	if (nowPlaying != undefined) {

		//when outo or collapse all but now playing is selected scrolls now playing album to the top

		for (var j = 0; j < listLength; j++) {
			var ID = playlist[j];

			if (ID.isGroupHeader && ID.groupNr == nowPlaying) {
				var step = j;

				if (step < 0) step = 0;
				listStep[activeList] = Math.min(listLength - maxRows, step);
				window.SetProperty("system.List Step", listStep.toString());
				break;
			}
		} // eol
	}

	listOnSize();
	onScrollStep(0); //check and fix false scrolled up or down var if needed
	window.Repaint();
}
// =================================================== //

function getPlayingGroupCollapseExpand() {

	if (!fb.IsPlaying || plman.ActivePlaylist != fb.PlayingPlaylist) return;

	var playingItemLocation = plman.GetPlayingItemLocation();
	var isValid;

	if (playingItemLocation.IsValid) {
		collapseExpand("collapse", getPlayingGroupNr());
	}

	var counter = 0;

	if (!playingItemLocation.IsValid) {
		var timer = window.SetInterval(function () { // timer for getting delayed item location info when skip track selected
			isValid = plman.GetPlayingItemLocation().IsValid;
			counter++;

			if (isValid || counter == 100 || !fb.IsPlaying) {
				window.ClearInterval(timer);

				if (fb.IsPlaying) {
					collapseExpand("collapse", getPlayingGroupNr());
				}
			}
		}, 100);
	}

	function getPlayingGroupNr() {

		var playingIndex = -1;

		if (plman.PlayingPlaylist == activeList) {
			playingIndex = plman.GetPlayingItemLocation().PlaylistItemIndex;
		}

		for (var g = 0; g <= groupNr; g++) {
			for (var i = firstItem[g]; i <= lastItem[g]; i++) {
				if (playingIndex == i) {
					return g;
				}
			}
		}
	}

}
// =================================================== //

function isGroupSelected(groupNr, playingID) {

	// searches only currently visible groups
	var selectedCount = 0;
	nowPlayingGroupNr = -1;

	for (var item = firstItem[groupNr]; item <= lastItem[groupNr]; item++) {
		if (plman.IsPlaylistItemSelected(activeList, item)) selectedCount++;
		if (playingID == item) nowPlayingGroupNr = groupNr;
	}

	if (selectedCount == (lastItem[groupNr] + 1 - firstItem[groupNr])) return true;
	else return false;

}
// =================================================== //

function displayFocusItem(focusID) {
	if (listLength <= maxRows) return;

	var visibleGroupRows = [];
	var tempGroupNr = 0;
	var groupRowCount = 0;

	for (var i = 0; i != maxRows; i++) {
		var ID = playlist[i + listStep[activeList]];

		if (isCollapsed.length && ID.isGroupHeader) {
			var groupNr = ID.groupNr;

			(groupNr == tempGroupNr) ? groupRowCount++ : groupRowCount = 1;
			visibleGroupRows[groupNr] = groupRowCount;
		}

		tempGroupNr = groupNr;
	}

	for (var i = 0; i != maxRows; i++) {
		var ID = playlist[i + listStep[activeList]];
		var groupNr = ID.groupNr;

		if (isCollapsed[groupNr] && ID.isGroupHeader) {
			for (var item = firstItem[groupNr]; item <= lastItem[groupNr]; item++) {
				if (focusID == item && visibleGroupRows[groupNr] == rowsInGroup) {
					return;
				}
			}

		} else if (ID && focusID == ID.nr) return;

	}

	var IDnr;
	for (var i = 0; i < listLength; i++) {
		var ID = playlist[i];
		var groupNr = ID.groupNr;

		if (isCollapsed.length && ID.isGroupHeader && ID.rowNr == rowsInGroup) {
			for (var item = firstItem[groupNr]; item <= lastItem[groupNr]; item++) {
				if (focusID == item && isCollapsed[groupNr]) {
					IDnr = firstItem[groupNr];
				}
			}
		}

		if (IDnr != undefined || ID.nr == focusID) {
			var step = i - Math.floor(maxRows / 2);

			if (step < 0) step = 0;

			listStep[activeList] = step;

			window.SetProperty("system.List Step", listStep.toString());
			listOnSize();

			window.Repaint();

			listIsScrolledUp = (listStep[activeList] == 0);
			listIsScrolledDown = ((playlist[maxRows - 1 + listStep[activeList]]) == playlist[listLength - 1]);

			return;

		}

	} // eol

}
// =================================================== //

function showNowPlaying() {

	if (!fb.Isplaying) return;

	var getPlayingItemLocation = plman.GetPlayingItemLocation()
	if (!getPlayingItemLocation.IsValid) return;

	if (plman.ActivePlaylist != plman.PlayingPlaylist) {
		plman.ActivePlaylist = plman.PlayingPlaylist;
		initList();
	}

	if (autoExpandCollapseGroups && autoCollapseOnPlaylistSwitch) collapseExpand("collapse");

	var playingID = getPlayingItemLocation.PlaylistItemIndex;
	plman.ClearPlaylistSelection(activeList);
	plman.SetPlaylistSelectionSingle(activeList, playingID, true);
	plman.SetPlaylistFocusItem(activeList, playingID);

	for (var i = 0; i < listLength; i++) {
		var ID = playlist[i];
		var groupNr = ID.groupNr;

		if (isCollapsed.length && ID.isGroupHeader && ID.rowNr == rowsInGroup) {
			for (var item = firstItem[groupNr]; item <= lastItem[groupNr]; item++) {
				if (playingID == item && isCollapsed[groupNr]) collapseExpand(groupNr);
			}
		}

		if (ID.nr == playingID) {
			var step = i - Math.floor(maxRows / 2);

			if (step < 0) step = 0;

			listStep[activeList] = step;

			window.SetProperty("system.List Step", listStep.toString());

			on_size();
			window.Repaint();

			break;
		}
	} // eol

	if (plman.ActivePlaylist != plman.PlayingPlaylist)
		showNowPlayingCalled = true;

}
// =================================================== //
function initList() {
	tempAlbumOnPlaybackNewTrack = undefined;
	tempGroupNrOnGetAlbumArt = -1;

	activeList = plman.ActivePlaylist;
	playlistCount = plman.PlaylistCount;
	playlistItemCount = plman.PlaylistItemCount(activeList);
	getPlaylistItems = plman.GetPlaylistItems(activeList);
	selectedItemCount = plman.GetPlaylistSelectedItems(activeList).Count;

	listIsScrolledUp = listIsScrolledDown = false;
	playlist = [];
	$playlist = [];
	firstItem = [];
	firstItemID = [];
	_firstItemID = [];
	lastItem = [];
	lastItemID = [];
	itemCount = [];
	isCollapsed = [];
	selectedIndexes = [];
	queueIndexes = [];
	groupNr = 0;
	totalGroups = 0;
	var a, b, metadb, d, dOld;
	var id = 0;
	var from = to = 0;

	var initTest = 0;
	if (initTest) from = new Date();

	for (var i = 0; i != playlistItemCount; i++) {

		metadb = getPlaylistItems.Item(i);
		a = fb.TitleFormat(groupFormat).EvalWithMetadb(metadb);
		if (a != b) {

			for (var groupHeaderRow = 1; groupHeaderRow <= rowsInGroup; groupHeaderRow++) {

				group = {
					groupNr: groupNr, // first group nr = 0
					metadb: metadb,
					isGroupHeader: true,
					rowNr: groupHeaderRow,
					// artist: new Hyperlink($("$if($greater($len(%album artist%),0),%album artist%,%artist%)", metadb),
					// 	artistFont, artistColorNormal, 'artist', -1000, -1000)
				};

				firstItem[groupNr] = i;
				$playlist[id++] = group;

				if (groupHeaderRow == rowsInGroup) {
					firstItemID[groupNr] = id;
				}
			}

			if (groupNr > 0) {
				var lastGroupNr = groupNr - 1;
				lastItem[lastGroupNr] = i - 1;
				lastItemID[lastGroupNr] = id - rowsInGroup - 1;
				itemCount[lastGroupNr] = lastItem[lastGroupNr] - firstItem[lastGroupNr] + 1;
			}

			groupNr++;
			b = a;
			oddItem = i % 2;
		}

		needsDiscHeader = fb.TitleFormat("$ifgreater(%totaldiscs%,1,true,false)["+ tf.disc_subtitle +"]").EvalWithMetadb(metadb);
		if (needsDiscHeader !== "false") {
			d = fb.TitleFormat(groupFormat + "%discnumber%").EvalWithMetadb(metadb);
			if (d != dOld) {
				//console.log("needsDiscHeader = " + needsDiscHeader);
				discHeader = {
					isDiscHeader: true,
					metadb: metadb,
					nr: i,
					isOdd: i % 2 == oddItem
				}
				$playlist[id++] = discHeader;
			}
			dOld = d;
		}

		var item = {

			metadb: metadb,
			nr: i,
			isOdd: i % 2 == oddItem

		};

		$playlist[id] = item;

		id++;


		if (selectedItemCount && plman.IsPlaylistItemSelected(activeList, i)) {
			selectedIndexes.push(i);
		}

	} //eol

	if (initTest) {
		to = new Date();
		print("Initialized: " + (to - from) + " ms");
	}

	groupNr--;
	totalGroups = groupNr;

	lastItem[groupNr] = playlistItemCount - 1;
	lastItemID[groupNr] = id - 1;
	itemCount[groupNr] = lastItem[groupNr] - firstItem[groupNr] + 1;

	playlist = $playlist.slice(0);
	_firstItemID = firstItemID.slice(0);
	listLength = playlist.length;

	(listOnSize = function () {

		if (ww <= 0 || wh <= 0) return;

		isResizingDone(ww, wh);

		listX = Math.round(ww *.5) + listLeft;
		listY = btns[30].y + btns[30].h + 10 + listTop + (showPlaylistInfo ? listInfoHeight : 0);
		listH = Math.max(0, window.Height - geo.lower_bar_h - 10 - listY - listBottom);
		listW = Math.max(100, window.Width - listX - listRight);

		maxRows = Math.abs(Math.min(listLength, Math.floor(listH / rowH)));
		listH = Math.floor(listH / rowH) * rowH;	// we calculate the max height the list can be, then we make it conform to the max number of rows

		if (listStep[activeList] + maxRows > listLength && listLength >= maxRows) {
			listStep[activeList] += listLength - (listStep[activeList] + maxRows);
			window.SetProperty("system.List Step", listStep.toString());
		}

		needsScrollbar = listLength > maxRows;

		if (needsScrollbar && showScrollbar) {
			listW = listW - scrollbarWidth - scrollbarRight;
		}
		//---> Row Object
		r = [];
		b = [];

		ratingBtnW = 14;
		ratingBtnX = listX + listW - ratingBtnW * 5 - 50;

		if (listLength) {
			for (var i = 0; i != maxRows; i++) {
				var rowY = listY + i * rowH;
				r[i] = new Row(listX, rowY, listW, rowH);
			}

            // create Rating RowButtons
            ratingBtnRightPad = 5;
            for (var i = 0; i != maxRows; i++) {

                r[i].b = [];

                for (var j = 0; j < 5; j++) {

                    var x = ratingBtnX + j * ratingBtnW - ratingBtnRightPad;
                    var y = r[i].y + rowH / 2 - ratingBtnW / 2 - 1;

                    r[i].b[j] = new RowButton(x, y, ratingBtnW, rowH - 1);
                }
            }
		}

		//---> Scrollbar

		scrollbarX = window.Width - scrollbarWidth - scrollbarRight;
		scrollbarY = btns[30].y + btns[30].h + 10 + listTop + (showPlaylistInfo ? listInfoHeight : 0);
		scrollbarBottom = listBottom;
		scrollbarHeight = listH;

		refreshScrollbar();

		//--->

		if (needsScrollbar) {
			createScrollbarThumbImages();
		}

	})();

	//---> init list step
	listStep = [];

	var step = [];
	var s = window.GetProperty("system.List Step", '');
	s.indexOf(",") != -1 ? step = s.split(",") : step[0] = Math.max(0, s);

	for (var i = 0; i < playlistCount; i++) {

		listStep[i] = (step[i] == undefined ? 0 : (isNaN(step[i]) ? 0 : Math.max(0, step[i])));

	}
	window.SetProperty("system.List Step", listStep.toString());
	//--->

	window.Repaint();
	if (needsScrollbar) {
		repaintScrollbar();
	}

	plman.SetActivePlaylistContext();

	if (showPlaylistInfo) {
		totalLength = calculateGroupLength(0, playlistItemCount - 1);
		if (selectedIndexes)
			selectionLength = calculateSelectionLaength();
	}

}

// nitList

// =================================================== //
var rowDrag = fileDrag = linkToLastItem = doubleClicked = mouseOverList = newTrackByClick = actionNotAllowed = clickedOnSelectedItem = selectWithDrag = false;
var oldRowBtn, oldRowNr, oldRow, oldID, selectedIndex, dragOverID;

function rowMouseEventHandler(x, y, m) {

	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	if (thumbDown || !listLength || !displayPlaylist) return;

	var c = caller();

	var thisID, thisRow, thisRowNr, thisRowBtn;
	var thisRowBtnNr = 0;

	mouseOverList = false;
	mouseInRatingBtn = false;

	for (var i = 0; r[i]; i++) {

		if (r[i].mouseInThisRow(x, y)) {
			mouseOverList = true;
			thisRow = r[i];
			thisID = playlist[i + listStep[activeList]];
			thisRowNr = i;
			//->
			if (showRating && !thisID.isGroupHeader) {

				var b = r[i].b;

				for (var j = 0; j < 5; j++) {
					if (b[j].mouseInThisRowButton(x, y)) {
						thisRowBtn = b[j];
						thisRowBtnNr = j;
						mouseInRatingBtn = true;
					}

				}

			}

		}

	}

	if (c == "on_drag_over") {

		fileDrag = true;

		if (thisID) {

			dragOverID = thisID;

		}

		c = "on_mouse_move";

	}

	switch (c) {

	case "on_mouse_move":

		if (thisRow !== undefined) {

			mouseOverList = true;
			linkToLastItem = false;

		}

		if (selectedIndexes.length && !doubleClicked && m == 1 && (oldRow && thisRow != oldRow)) {

			if (plman.IsAutoPlaylist(activeList) && !actionNotAllowed) {

				window.SetCursor(IDC_NO);
				actionNotAllowed = true;

			}
			dropped = false;
			if (!actionNotAllowed && clickedOnSelectedItem) rowDrag = true;
			if (!clickedOnSelectedItem) selectWithDrag = true;
		}


		if ((fileDrag || rowDrag || makeSelectionDrag) && thisID && thisID.isGroupHeader && isCollapsed[thisID.groupNr]) {
			collapseExpand(thisID.groupNr);
		}

		//->
		if (oldRow && oldRow != thisRow) {

			if (!clickedOnSelectedItem && m == 1 && thisID && thisID.isGroupHeader) {

				var firstIDnr = firstItem[thisID.groupNr];

				if ((oldID.nr < firstIDnr && selectedIndex > oldID.nr) || (oldID.nr == firstIDnr && selectedIndex < oldID.nr)) {

					plman.SetPlaylistSelectionSingle(activeList, oldID.nr, false);

				}

			}

			oldRow.changeState(0);

		}

		if (thisRow && thisRow != oldRow) {
			thisRow.changeState(1);

			if (rowDrag || fileDrag || makeSelectionDrag) {

				if (thisRowNr == 0 && !listIsScrolledUp) {

					startScrollRepeat("dragUp");

				}

				if ((thisRowNr == (maxRows - 1)) && !listIsScrolledDown) {

					startScrollRepeat("dragDown");

				}

			}

			if (!clickedOnSelectedItem && m == 1) {

				makeSelectionDrag = true;

				selectedIndexes = [];

				if (thisID && !thisID.isGroupHeader) {

					for (var i = selectedIndex; i <= thisID.nr; i++) {
						selectedIndexes.push(i);
					}
					for (var i = selectedIndex; i >= thisID.nr; i--) {
						selectedIndexes.push(i);
						selectedIndexes.sort(numericAscending);
					}
					if (selectedIndexes[0] == selectedIndexes[1]) selectedIndexes.length = 1;

					if (selectedIndexes[0] != undefined && !thisID.isGroupHeader) {
						plman.ClearPlaylistSelection(activeList);
						plman.SetPlaylistSelection(plman.ActivePlaylist, selectedIndexes, true);
					}
				}
			}
		}

		//->

		if ((rowDrag || fileDrag) && listLength && (y > (r[maxRows - 1].y + rowH)) && !linkToLastItem && ((needsScrollbar && listIsScrolledDown) || !needsScrollbar)) {

			linkToLastItem = true;
			r[maxRows - 1].repaint();

		}

		if ((rowDrag || fileDrag || makeSelectionDrag) && thisID && (thisRowNr != 0 && thisRowNr != (maxRows - 1))) {

			stopScrollRepeat();

		}

		oldID = thisID;
		oldRow = thisRow;
		//->

		break;

	case ("on_mouse_lbtn_down"):

		if (doubleClicked) return;

		if (!thisID) {
			if (!mouseInScrollbar) {
				selectedIndexes = [];
				plman.ClearPlaylistSelection(activeList);
			}
			return;
		}

		var thisIndex = thisID.nr;

		if (thisID.isGroupHeader) {

			if (!CtrlKeyPressed) selectedIndexes = [];

			var thisGroupNr = thisID.groupNr;

			for (var id = firstItem[thisGroupNr]; id <= lastItem[thisGroupNr]; id++) {

				selectedIndexes.push(id);

			}

			plman.ClearPlaylistSelection(activeList);
			plman.SetPlaylistSelection(plman.ActivePlaylist, selectedIndexes, true);
			plman.SetPlaylistFocusItem(activeList, firstItem[thisID.groupNr]);

			clickedOnSelectedItem = true;

		} else {

			IDIsSelected = plman.IsPlaylistItemSelected(activeList, thisIndex);

			IDIsSelected ? clickedOnSelectedItem = true : clickedOnSelectedItem = false;

			if (!CtrlKeyPressed && !ShiftKeyPressed && !IDIsSelected) {

				selectedIndexes = [];
				plman.ClearPlaylistSelection(activeList);

			}

			if (ShiftKeyPressed) {

				selectedIndexes = [];

				var a = b = 0;

				if (selectedIndex == undefined) selectedIndex = plman.GetPlaylistFocusItemIndex(activeList);

				if (selectedIndex < thisIndex) {
					a = selectedIndex;
					b = thisIndex;
				} else {
					a = thisIndex;
					b = selectedIndex;
				}

				for (var id = a; id <= b; id++) {

					selectedIndexes.push(id);

				}

				plman.ClearPlaylistSelection(activeList);
				plman.SetPlaylistSelection(activeList, selectedIndexes, true);

			} else {

				plman.SetPlaylistSelectionSingle(activeList, thisIndex, true);

				if (utils.IsKeyPressed(VK_KEY_Q))
					plman.AddPlaylistItemToPlaybackQueue(activeList, thisIndex);
				else if (utils.IsKeyPressed(VK_KEY_Z)) {
					var index = plman.FindPlaybackQueueItemIndex(thisID.metadb, activeList, thisIndex)
					plman.RemoveItemFromPlaybackQueue(index);
				}

			}

			if (!IDIsSelected && !CtrlKeyPressed && !ShiftKeyPressed) {

				selectedIndexes = [];

				selectedIndexes[0] = thisIndex;

			}

			if (CtrlKeyPressed) {

				if (!IDIsSelected) selectedIndexes.push(thisIndex);

				plman.SetPlaylistSelectionSingle(activeList, thisIndex, IDIsSelected ? false : true);

				if (IDIsSelected) {

					for (var i = 0; i < selectedIndexes.length; i++) {

						if (selectedIndexes[i] == thisIndex) selectedIndexes.splice(i, 1);

					}

				}

			}

			plman.SetPlaylistFocusItem(activeList, thisIndex);

			if (selectedIndex == undefined) selectedIndex = thisIndex;

			if (selectedIndexes.length > 1) selectedIndexes.sort(numericAscending);

		} //eof isGroup else

		break;

	case 'on_mouse_rbtn_down':

		if (!thisID) {
			if (!mouseInScrollbar) {
				selectedIndexes = [];
				plman.ClearPlaylistSelection(activeList);
			}
			return;
		}

		var thisIndex = thisID.nr;

		if (thisID.isGroupHeader) {

			if (isGroupSelected(thisID.groupNr)) return;

			selectedIndexes = [];

			var thisGroupNr = thisID.groupNr;

			for (var id = firstItem[thisGroupNr]; id <= lastItem[thisGroupNr]; id++) {

				selectedIndexes.push(id);

			}

			plman.ClearPlaylistSelection(activeList);
			plman.SetPlaylistSelection(plman.ActivePlaylist, selectedIndexes, true);
			plman.SetPlaylistFocusItem(activeList, firstItem[thisID.groupNr]);

		} else {

			var IDIsSelected = plman.IsPlaylistItemSelected(activeList, thisIndex);

			if (IDIsSelected) {

				plman.SetPlaylistFocusItem(activeList, thisIndex);
				repaintList();

			} else {

				selectedIndexes = [];
				plman.ClearPlaylistSelection(activeList);
				selectedIndexes[0] = thisIndex;
				plman.SetPlaylistFocusItem(activeList, thisIndex);
				plman.SetPlaylistSelectionSingle(activeList, thisIndex, true);

			}

		}

		break;

	case 'on_mouse_lbtn_dblclk':

		if (!thisID) return;
		doubleClicked = true;

		//---> Set rating
		if (mouseInRatingBtn) {
			var metadb = thisID.metadb;

			if (useTagRating) {
				var fileInfo = metadb.GetFileInfo();
				var currentRating = fileInfo.MetaValue(fileInfo.MetaFind("rating"), 0);
			} else {
				var currentRating = $("%rating%", metadb);
			}

			var rate = thisRowBtnNr + 1;

			if (useTagRating) {
				if (!metadb.RawPath.indexOf("http://") == 0) {
					(currentRating == 1 && rate == 1) ? metadb.UpdateFileInfoSimple("RATING", undefined) : metadb.UpdateFileInfoSimple("RATING", rate);
				}
			} else {
				(currentRating == 1 && rate == 1) ? fb.RunContextCommandWithMetadb("<not set>", metadb) : fb.RunContextCommandWithMetadb("Rating/" + rate, metadb);
			}
			repaintList();
			return;

		}

		if (thisID.isGroupHeader) {

			collapseExpand(thisID.groupNr);

		} else if (!utils.IsKeyPressed(VK_KEY_Q) && !utils.IsKeyPressed(VK_KEY_Z)) {

			plman.ExecutePlaylistDefaultAction(activeList, thisID.nr);
			newTrackByClick = true;

		}

		break;

	case "on_mouse_lbtn_up":

		if (doubleClicked) {
			doubleClicked = false;
			return;
		}

		if (thisRow) {
			thisRow.changeState(0);
		}

		if (thisID && thisID.nr !== undefined) {

			if (rowDrag && thisID) {

				var selectedItems = plman.GetPlaylistSelectedItems(activeList);
				var selectedItemCount = selectedItems.Count;
				var focusIndex = plman.GetPlaylistFocusItemIndex(activeList);
				var thisIndex = thisID.nr;
				var add = 0;

				if (selectedItemCount > 1) {

					//--->
					var temp;
					var odd = false;
					for (var i = 0; i < playlistItemCount; i++) {
						if (plman.IsPlaylistItemSelected(activeList, i)) {
							if (temp != undefined && ((i - 1) != temp)) {
								odd = true;
								break;
							}
							temp = i;
						}
					}
					//--->

					if (odd) {

						for (var i = 0; i < selectedIndexes.length; i++) {

							if (selectedIndexes[i] < thisIndex) {
								add = i + 1;

							}

						}

						plman.MovePlaylistSelection(activeList, -listLength);

					} else {

						for (var i = 0; i < selectedIndexes.length; i++) {

							if (selectedIndexes[i] == focusIndex) {
								add = i;
								break;
							}

						}

					}

				}

				if (focusIndex > thisIndex) {
					(selectedItemCount > 1) ? (odd ? delta = thisIndex - add : delta = -(focusIndex - thisIndex - add)) : delta = -(focusIndex - thisIndex);
				} else {
					(selectedItemCount > 1) ? (odd ? delta = thisIndex - add : delta = (thisIndex - focusIndex - (selectedItemCount - add))) : delta = (thisIndex - 1 - focusIndex);
				}

				if (!odd && plman.IsPlaylistItemSelected(plman.ActivePlaylist, thisIndex)) delta = 0;
				plman.MovePlaylistSelection(activeList, delta);

			} //row drag end


			if (!CtrlKeyPressed && !ShiftKeyPressed && !rowDrag && !selectWithDrag) {

				if (plman.GetPlaylistSelectedItems(activeList).Count > 1) {

					selectedIndexes = [];
					selectedIndexes[0] = thisID.nr;
					plman.ClearPlaylistSelection(activeList);
					plman.SetPlaylistSelectionSingle(activeList, thisID.nr, true);

				}

			}

		}

		if (linkToLastItem) {

			plman.MovePlaylistSelection(activeList, listLength - plman.GetPlaylistSelectedItems(activeList).Count);

			r[maxRows - 1].repaint();

		}

		if (!ShiftKeyPressed) selectedIndex = undefined;

		rowDrag = fileDrag = makeSelectionDrag = linkToLastItem = selectWithDrag = false;

		//--->

		plman.SetActivePlaylistContext();

		if (actionNotAllowed) {
			window.SetCursor(IDC_ARROW);
			actionNotAllowed = false;
		}

		break;

	case 'on_mouse_leave':

		for (var i = 0; r[i]; i++) {

			if (r[i].state != 0) {

				if (r[i].b) {
					for (var j = 0; r[i].b[j]; j++) {

						r[i].b[j].changeState(0);

					}
				}

				r[i].changeState(0);

			}

		}

		selectedIndex = oldRow = thisRow = undefined;

		break;

	}

}
// =================================================== //

function Row(x, y, w, h, b) {

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.b = b;
	this.state = 0;

}
// =================================================== //
Row.prototype.mouseInThisRow = function (x, y) {

	return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);

}
// =================================================== //
Row.prototype.repaint = function () {

	window.RepaintRect(this.x - listLeft, this.y - 5, this.w + listLeft + listRight, this.h + 10);

}
// =================================================== //
Row.prototype.changeState = function (state) {

	this.state = state;
	if (rowDrag || fileDrag) {
		this.repaint();
	}
	//this.state == 0 ? window.SetCursor(IDC_ARROW) : window.SetCursor(IDC_HAND);

}
// =================================================== //

function RowButton(x, y, w, h) {

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.state = 0;

}
// =================================================== //
RowButton.prototype.mouseInThisRowButton = function (x, y) {
	return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);

}
// =================================================== //
RowButton.prototype.repaint = function () {
	window.RepaintRect(this.x, this.y, this.w, this.h);
}
// =================================================== //
RowButton.prototype.changeState = function (state) {

	this.state = state;
	this.repaint();
	//this.state == 0 ? window.SetCursor(IDC_ARROW) : window.SetCursor(IDC_HAND);
}
// =============================================== //

function on_mouse_rbtn_up(x, y) {
	var playlistX = Math.floor(ww*.5);
	var playlistY = btns[30].y + btns[30].h + 10;

	if (!displayPlaylist || x < playlistX || y < playlistY) {
		return;
	}

	if (mouseInScrollbar) {
		scrollbarMouseEventHandler(x, y);
		return true;
	}

	menu_down = true;

	var metadb = utils.IsKeyPressed(VK_CONTROL) ? (fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem()) : fb.GetFocusItem();

	var windowsVisualStyleEnabled = window.CreateThemeManager("WINDOW");
	var selected = plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count;
	var selection = (selected > 1);
	var queueActive = plman.GetPlaybackQueueHandles().Count;
	var isAutoPlaylist = plman.IsAutoPlaylist(activeList);
	var playlistCount = plman.PlaylistCount;

	var cpm = window.CreatePopupMenu();
	var web = window.CreatePopupMenu();
	var ce = window.CreatePopupMenu();
	var ccmm = fb.CreateContextMenuManager();
	var appear = window.CreatePopupMenu();
	var sort = window.CreatePopupMenu();
	var lists = window.CreatePopupMenu();
	var send = window.CreatePopupMenu();
	var skip = window.CreatePopupMenu();

	if (utils.IsKeyPressed(VK_SHIFT)) {

		cpm.AppendMenuItem(MF_STRING, 1, "Restart");
		cpm.AppendMenuSeparator();
//		cpm.AppendMenuItem(safeMode ? MF_GRAYED : MF_STRING, 2, "Configure script...");
	}
	cpm.AppendMenuItem(MF_STRING, 3, "Configure...");
	cpm.AppendMenuItem(MF_STRING, 4, "Playlist Properties...");
	cpm.AppendMenuSeparator();


	plman.SetActivePlaylistContext();

	fb.Isplaying && cpm.AppendMenuItem(MF_STRING, 5, "Show now playing");

	if (plman.PlaylistItemCount(plman.ActivePlaylist)) {

		cpm.AppendMenuItem(MF_STRING, 6, "Refresh all");
		cpm.AppendMenuItem(MF_STRING, 7, "Select all (Ctrl+A)");
		if (selected) cpm.AppendMenuItem(isAutoPlaylist ? MF_GRAYED : MF_STRING, 8, "Remove from list (Delete)");
		if (queueActive) cpm.AppendMenuItem(MF_STRING, 9, "Flush playback queue");
		cpm.AppendMenuSeparator();
		// -------------------------------------------------------------- //
		//---> Collapse/Expand
		if (rowsInGroup) {
			ce.AppendMenuItem(MF_STRING, 20, "Collapse all");
			if (plman.ActivePlaylist == plman.PlayingPlaylist) ce.AppendMenuItem(MF_STRING, 21, "Collapse all but now playing");
			ce.AppendMenuItem(MF_STRING, 22, "Expand all");
			ce.AppendMenuSeparator();
			ce.AppendMenuItem(MF_STRING, 23, "Auto");
			ce.CheckMenuItem(23, autoExpandCollapseGroups);
			ce.AppendTo(cpm, MF_STRING | MF_POPUP, "Collapse/Expand");
		}
		// -------------------------------------------------------------- //
		//---> Skip trak
		skip.AppendMenuItem(MF_STRING, 24, "Enable");
		skip.CheckMenuItem(24, enableSkip);
		skip.AppendMenuSeparator();
		skip.AppendMenuItem(enableSkip ? MF_STRING : MF_GRAYED, 25, "Rated less than 2");
		skip.AppendMenuItem(enableSkip ? MF_STRING : MF_GRAYED, 26, "Rated less than 3");
		skip.AppendMenuItem(enableSkip ? MF_STRING : MF_GRAYED, 27, "Rated less than 4");
		skip.AppendMenuItem(enableSkip ? MF_STRING : MF_GRAYED, 28, "Rated less than 5");
		skip.AppendTo(cpm, MF_STRING | MF_POPUP, "Skip");
		skip.CheckMenuRadioItem(25, 28, 23 + skipLessThan);
		// -------------------------------------------------------------- //
		//---> Appearance
		appear.AppendMenuItem(MF_STRING, 30, "Show album art");
		appear.CheckMenuItem(30, showAlbumArt);
		appear.AppendMenuItem(MF_STRING, 31, "Show group info");
		appear.CheckMenuItem(31, showGroupInfo);
		appear.AppendMenuItem(componentPlayCount ? MF_STRING : MF_GRAYED, 32, "Show play count");
		appear.CheckMenuItem(32, showPlayCount);
		appear.AppendMenuItem(componentPlayCount ? MF_STRING : MF_GRAYED, 33, "Show rating");
		appear.CheckMenuItem(33, showRating);
		appear.AppendMenuItem(MF_STRING, 35, "Show queue item");
		appear.CheckMenuItem(35, showQueueItem);
		appear.AppendMenuItem(MF_STRING, 36, "Alternate row color");
		appear.CheckMenuItem(36, alternateRowColor);
		appear.AppendMenuItem(MF_STRING, 37, "Show scrollbar");
		appear.CheckMenuItem(37, showScrollbar);
		if (showScrollbar && windowsVisualStyleEnabled) {
			appear.AppendMenuItem(MF_STRING, 38, "Scrollbar use windows style");
			appear.CheckMenuItem(38, scrollbarUseWindowsVisualStyle);
		}
		appear.AppendMenuItem(MF_STRING, 39, "Show playlist info");
		appear.CheckMenuItem(39, showPlaylistInfo);
		appear.AppendTo(cpm, MF_STRING | MF_POPUP, "Appearance");
		// -------------------------------------------------------------- //
		//---> Sort
		sort.AppendMenuItem(MF_STRING, 40, "Sort by...");
		sort.AppendMenuItem(MF_STRING, 41, "Randomize");
		sort.AppendMenuItem(MF_STRING, 42, "Reverse");
		sort.AppendMenuItem(MF_STRING, 43, "Sort by album");
		sort.AppendMenuItem(MF_STRING, 44, "Sort by artist");
		sort.AppendMenuItem(MF_STRING, 45, "Sort by file path");
		sort.AppendMenuItem(MF_STRING, 46, "Sort by title");
		sort.AppendMenuItem(MF_STRING, 47, "Sort by track number");
		sort.AppendMenuItem(MF_STRING, 48, "Sort by album sort order");
		sort.AppendMenuItem(MF_STRING, 49, "Sort by date");
		sort.AppendTo(cpm, isAutoPlaylist ? MF_GRAYED : MF_STRING | MF_POPUP, selection ? "Sort selection" : "Sort");
		// -------------------------------------------------------------- //
		//---> Weblinks
		web.AppendMenuItem(MF_STRING, 50, "Google");
		web.AppendMenuItem(MF_STRING, 51, "Google Images");
		web.AppendMenuItem(MF_STRING, 52, "eCover");
		web.AppendMenuItem(MF_STRING, 53, "Wikipedia");
		web.AppendMenuItem(MF_STRING, 54, "YouTube");
		web.AppendMenuItem(MF_STRING, 55, "Last FM");
		web.AppendMenuItem(MF_STRING, 56, "Discogs");
		web.AppendTo(cpm, safeMode ? MF_GRAYED : MF_STRING | MF_POPUP, "Weblinks");

	}
	// -------------------------------------------------------------- //
	//---> Playlists
	var playlistId = 102;
	lists.AppendMenuItem(MF_STRING, 100, "Playlist manager... (Ctrl+M)");
	lists.AppendMenuSeparator();
	lists.AppendMenuItem(MF_STRING, 101, "Create New Playlist");
	lists.AppendMenuSeparator();
	for (var i = 0; i != playlistCount; i++) {
		lists.AppendMenuItem(MF_STRING, playlistId + i, plman.GetPlaylistName(i).replace(/\&/g, "&&") + " [" + plman.PlaylistItemCount(i) + "]" + (plman.IsAutoPlaylist(i) ? " (Auto)" : '') + (i == plman.PlayingPlaylist ? " (Now Playing)" : ''));
	}
	lists.AppendTo(cpm, MF_STRING | MF_POPUP, "Playlists");
	// -------------------------------------------------------------- //
	if (selected) {
		var sendToPlaylistId = playlistId + playlistCount + 1;
		send.AppendMenuItem(MF_STRING, sendToPlaylistId - 1, "Create New Playlist");
		send.AppendMenuSeparator();
		for (var i = 0; i != playlistCount; i++) {
			send.AppendMenuItem((plman.IsAutoPlaylist(i) || i == activeList) ? MF_GRAYED : MF_STRING, sendToPlaylistId + i, plman.GetPlaylistName(i) + " [" + plman.PlaylistItemCount(i) + "]" + (plman.IsAutoPlaylist(i) ? " (Auto)" : '') + (i == plman.PlayingPlaylist ? " (Now Playing)" : ''));
		}
		send.AppendTo(cpm, MF_STRING | MF_POPUP, "Send selection");
	}
	// -------------------------------------------------------------- //
	//---> Context Menu Manager
	var contextId = playlistId + sendToPlaylistId + playlistCount;
	if (selected) {
		cpm.AppendMenuSeparator();
		ccmm.InitContext(plman.GetPlaylistSelectedItems(activeList));
		ccmm.BuildMenu(cpm, contextId, -1);
	}

	id = cpm.TrackPopupMenu(x, y);

	if (selected) ccmm.ExecuteByID(id - contextId);
	// -------------------------------------------------------------- //
	switch (id) {

	case 1:
		fb.RunMainMenuCommand("File/Restart");
		break;
	case 2:
		break;
	case 3:
		window.ShowConfigure();
		break;
	case 4:
		window.ShowProperties();
		break;
	case 5:
		showNowPlaying();
		break;
	case 6: 	/* refresh All */
		initList();
		break;
	case 7:
		selectAll();
		break;
	case 8:
		plman.RemovePlaylistSelection(activeList);
		repaintList();
		break;
	case 9:
		plman.FlushPlaybackQueue();
		repaintList();
		break;
	case 10:

		break;
		// -------------------------------------------------------------- //
	case 20:
		//---> Collapse/Expand
		collapseExpand("collapse");
		displayFocusItem(plman.GetPlaylistFocusItemIndex(activeList));
		break;
	case 21:
		getPlayingGroupCollapseExpand();
		break;
	case 22:
		collapseExpand("expand");
		displayFocusItem(plman.GetPlaylistFocusItemIndex(activeList));
		break;
	case 23:
		autoExpandCollapseGroups = !autoExpandCollapseGroups;
		window.SetProperty("Playlist: Auto expand/collapse groups", autoExpandCollapseGroups);
		autoExpandCollapseGroups && getPlayingGroupCollapseExpand();
		break;
		// -------------------------------------------------------------- //
	case 24:
		enableSkip = !enableSkip;
		window.SetProperty("Playlist: Skip Enable", enableSkip);
		break;
	case 25:
	case 26:
	case 27:
	case 28:
		skipLessThan = id - 23;
		window.SetProperty("Playlist: Skip songs rated less than", skipLessThan);
		break;
		// -------------------------------------------------------------- //
	case 30:
		//---> Appearance
		showAlbumArt = !showAlbumArt;
		window.SetProperty("Playlist: Show Album Art", showAlbumArt);
		showAlbumArt && getAlbumArt();
		repaintList();
		break;
	case 31:
		showGroupInfo = !showGroupInfo;
		window.SetProperty("Playlist: Show Group Info", showGroupInfo);
		repaintList();
		break;
	case 32:
		showPlayCount = !showPlayCount;
		window.SetProperty("Playlist: Show Play Count", showPlayCount);
		repaintList();
		break;
	case 33:
		showRating = !showRating;
		window.SetProperty("Playlist: Show Rating", showRating);
		repaintList();
		break;
	case 35:
		showQueueItem = !showQueueItem;
		window.SetProperty("Playlist: Show Queue Item", showQueueItem);
		repaintList();
		break;
	case 36:
		alternateRowColor = !alternateRowColor;
		window.SetProperty("Playlist: Alternate row color", alternateRowColor);
		repaintList();
		break;
	case 37:
		showScrollbar = !showScrollbar;
		window.SetProperty("Playlist: Show scrollbar", showScrollbar);
		on_size();
		window.Repaint();
		break;
	case 38:
		scrollbarUseWindowsVisualStyle = !scrollbarUseWindowsVisualStyle;
		window.SetProperty("Playlist: Scrollbar Use windows style", scrollbarUseWindowsVisualStyle);
		refreshScrollbarStyle();
		break;
	case 39:
		showPlaylistInfo = !showPlaylistInfo;
		window.SetProperty("Playlist: Show Playlist Info", showPlaylistInfo);
		if (showPlaylistInfo) initList();
		on_size();
		window.Repaint();
		break;
		// -------------------------------------------------------------- //
	case 40:
		//---> Sort
		selection ? fb.RunMainMenuCommand("Edit/Selection/Sort/Sort by...") : fb.RunMainMenuCommand("Edit/Sort/Sort by...");
		break;
	case 41:
		plman.SortByFormat(activeList, '', selection ? true : false);
		break;
	case 42:
		selection ? fb.RunMainMenuCommand("Edit/Selection/Sort/Reverse") : fb.RunMainMenuCommand("Edit/Sort/Reverse");
		break;
	case 43:
		plman.SortByFormat(activeList, "%album%", selection ? true : false);
		break;
	case 44:
		plman.SortByFormat(activeList, "%artist%", selection ? true : false);
		break;
	case 45:
		plman.SortByFormat(activeList, "%path%%subsong%", selection ? true : false);
		break;
	case 46:
		plman.SortByFormat(activeList, "%title%", selection ? true : false);
		break;
	case 47:
		plman.SortByFormat(activeList, "%tracknumber%", selection ? true : false);
		break;
	case 48:
		plman.SortByFormat(activeList, "%albumsortorder%", selection ? true : false);
		break;
	case 49:
		plman.SortByFormat(activeList, "%date%", selection ? true : false);
		break;
		// -------------------------------------------------------------- //
	case 50:
		link("google", metadb);
		break;
	case 51:
		link("googleImages", metadb);
		break;
	case 52:
		link("eCover", metadb);
		break;
	case 53:
		link("wikipedia", metadb);
		break;
	case 54:
		link("youTube", metadb);
		break;
	case 55:
		link("lastFM", metadb);
		break;
	case 56:
		link("discogs", metadb);
		break;
		// -------------------------------------------------------------- //
	case 100:
		fb.RunMainMenuCommand("View/Playlist Manager");
		break;
	case 101:
		plman.CreatePlaylist(playlistCount, '');
		plman.ActivePlaylist = plman.PlaylistCount;
		break;
	case (sendToPlaylistId - 1):
		plman.CreatePlaylist(playlistCount, '');
		plman.InsertPlaylistItems(playlistCount, 0, plman.GetPlaylistSelectedItems(activeList), select = true);
		break;
	case 221: 		// add/remove to playback queue
	case 222:
	case 223:		// sometimes 223/224 is used for add/remove
	case 224:
	case 225:
	case 226:
		repaintList();
		break;
	case 228:
		// Properties
		break;
	default:
		id < 228 && console.log("Unknown Menu Item: " + id);
		break;
	}

	for (var i = 0; i != playlistCount; i++) {
		if (id == (playlistId + i)) plman.ActivePlaylist = i; // playlist switch
	}

	for (var i = 0; i < plman.PlaylistCount; i++) {
		if (id == (sendToPlaylistId + i)) {
			plman.ClearPlaylistSelection(i);
			plman.InsertPlaylistItems(i, plman.PlaylistItemCount(i), plman.GetPlaylistSelectedItems(activeList), select = true);
		}
	}

	cpm.Dispose();
	ccmm.Dispose();
	web.Dispose();
	ce.Dispose();
	appear.Dispose();
	sort.Dispose();
	lists.Dispose();
	send.Dispose();

	menu_down = false;

	return true;
}

if (collapseOnStart) {
	collapseExpand("collapse");
}
