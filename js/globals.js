/** @type {*} */
var globals = new PanelProperties();
/** @type {*} */
var pref = new PanelProperties(); // preferences
/** @type {*} */
let settings = {};

const currentVersion = '1.1.9';
let updateAvailable = false;
let updateHyperlink;

const g_component_playcount = utils.CheckComponent('foo_playcount');
const g_component_utils = utils.CheckComponent('foo_utils');
const componentEnhancedPlaycount = utils.CheckComponent('foo_enhanced_playcount');

/** @type {*} */
const doc = new ActiveXObject('htmlfile');
const app = new ActiveXObject('Shell.Application');
/** @type {*} */
const WshShell = new ActiveXObject('WScript.Shell');
/** @type {*} */
const fso = new ActiveXObject('Scripting.FileSystemObject');
/** @type {*} */
const vb = new ActiveXObject('ScriptControl');

globals.add_properties({
	version: ['_theme_version (do not hand edit!)', 'NONE']
});

// THEME PREFERENCES/PROPERTIES EXPLANATIONS - After initial run, these values are changed in Options Menu or by Right Click >> Properties and not here!
pref.add_properties({
	// locked: ['Lock theme', false], // true: prevent changing theme with right click
	rotation_amt: ['Art: Degrees to rotate CDart', 3], // # of degrees to rotate per track change.
	aa_glob: ['Art: Cycle through all images', true], // true: use glob, false: use albumart reader (front only)
	display_cdart: ['Art: Display CD art', true], // true: show CD artwork behind album artwork. This artwork is expected to be named cd.png and have transparent backgrounds (can be found at fanart.tv)
	// artwork_cdart_filename: ['Art: CD art filename (without file extension)', 'cd'], // string: example "discart" if metadata consumer uses that name for cdart and you want those filtered from showing as albumart
	art_rotate_delay: ['Art: Seconds to display each art', 30], // seconds per image
	rotate_cdart: ['Art: Rotate CD art on new track', true], // true: rotate cdArt based on track number. i.e. rotationAmt = %tracknum% * x degrees
	cdart_ontop: ['Art: Show CD art above front cover', false], // true: display cdArt above front cover
	show_debug_log: ['Debug: Show Debug Output', false], // true: show debug output in console
	show_theme_log: ['Debug: Show Theme Logging', false], // true: show theme logging in console
	hide_cursor: ['Hide Cursor when stationary', false], // true: hide cursor when not moving, false: don't
	show_flags: ['Show country flags', true], // true: show the artist country flags
	// check_multich:		['Check for MultiChannel version', false],	// true: search paths in tf.MultiCh_paths to see if there is a multichannel version of the current album available
	use_vinyl_nums: ['Use vinyl style numbering (e.g. A1)', true], // true: if the tags specified in tf.vinyl_side and tf.vinyl_tracknum are set, then we'll show vinyl style track numbers (i.e. "B2." instead of "04.")
	start_Playlist: ['Display playlist on startup', false], // true: show the playlist window when the theme starts up
	show_progress_bar: ['Show Progress Bar', true], // true: show progress bar, otherwise hide it (useful is using another panel for this)
	show_transport: ['Transport: Show transport controls', true], // true: show the play/pause/next/prev/random buttons at the top of the screen
	show_transport_below: ['Transport: Show transport below art', false],
	show_random_button: ['Transport: Show Random Button', true], // true: show random button in transport controls, ignored if transport not shown
	show_volume_button: ['Transport: Show Volume Button', false], // true: show volume button in transport controls, ignored if transport is not shown
	show_reload_button: ['Transport: Show Reload Button', false], // true: show a button that reloads the theme when clicked. Useful for debugging only
	transport_buttons_size: ['Transport: Button size', 32], // size in pixels of the buttons

	show_timeline_tooltips: ['Show timeline tooltips', true], // true: show tooltips when hovering over the timeline that show information on plays

	menu_font_size: ['Menu font size', 12],

	freq_update: ['Frequent progress bar updates', true], // true: update progress bar multiple times a second. Smoother, but uses more CPU
	hyperlinks_ctrl: ['Playlist: Hyperlinks require CTRL Key', false], // true: clicking on hyperlinks only works if CTRL key is held down
    darkMode: ['Use Dark Theme', true], // true: use a darker background
	use_4k: ['Detect 4k', 'auto'], // auto: switch to 4k mode when window width wide enough, never: never use 4k mode, always: always use 4k mode
	checkForUpdates: ['Check for Updates', true], // true: check github repo to determine if updates exist
	loadAsync: ['Load Theme Asynchronously', true],	// loads individual theme files asynchronously at startup to reduce risk of FSM throwing slow script error on startup

	lyrics_normal_color: ['Lyrics: Text Color', 'RGBA(255, 255, 255, 255);'],
	lyrics_focus_color: ['Lyrics: Text Highlite Color', 'RGBA(255, 241, 150, 255);'],

	show_weblinks: ['Playlist: Show weblinks', true],

	font_size_playlist: ['Font Size: Playlist', 12],
	font_size_playlist_header: ['Font Size: Playlist Header', 15],
	lyrics_font_size: ['Font Size: Lyrics', 20],
});

// safety checks
if (pref.art_rotate_delay < 5) {
	pref.art_rotate_delay = 5;
}

// Lyrics variables
// lyrics color definitions
var g_txt_normalcolour = eval(pref.lyrics_normal_color);
var g_txt_highlightcolour = eval(pref.lyrics_focus_color);
var g_txt_shadowcolor = RGBA(0, 0, 0, 255);

//Tag Properties
// tf.add_properties({
// 	// added:          ['Tag Fields: Added', '$ifgreater($if(%lastfm_added%,$replace($date(%lastfm_added%),-,),999999999),$replace($date(%added%),-,),[%added%],[%lastfm_added%])'],
// 	album_subtitle: ['Tag Fields: Album Subtitle', '%albumsubtitle%'],
// 	artist: ['Tag Fields: Artist String', '$if3(%artist%,%composer%,%performer%,%album artist%)'],
// 	artist_country: ['Tag Fields: Country', '%artistcountry%'], // we call meta_num(artistcountry) so don't wrap this in % signs
// 	disc: ['Tag Fields: Disc String', '$ifgreater(%totaldiscs%,1,CD %discnumber%/%totaldiscs%,)'],
// 	disc_subtitle: ['Tag Fields: Disc Subtitle', '%discsubtitle%'],
// 	year: ['Tag Fields: Year', '$if3(%original release date%,%originaldate%,%date%,%fy_upload_date%)'],
// 	date: ['Tag Fields: Date', '$if3(%original release date%,%originaldate%,%date%,%fy_upload_date%)'],
// 	last_played: ['Tag Fields: Last Played', '[$if2(%last_played_enhanced%,%last_played%)]'],
// 	title: ['Tag Fields: Song Title String', "%title%[ '['%translation%']']"],
// 	vinyl_side: ['Tag Fields: Vinyl Side', '%vinyl side%'], // the tag used for determining what side a song appears on for vinyl releases - i.e. song A1 has a %vinyl side% of "A"
// 	vinyl_tracknum: ['Tag Fields: Vinyl Track#', '%vinyl tracknumber%'], // the tag used for determining the track number on vinyl releases i.e. song A1 has %vinyl tracknumber% set to "1"
// 	translation: ['Tag Fields: Translated song title', '%translation%'],
// 	album_translation: ['Tag Fields: Translated album title', '%albumtranslation%'],
// 	edition: ['Tag Fields: Edition', '[$if(%original release date%,$ifequal($year(%original release date%),$year(%date%),,$year(%date%) ))$if2(%edition%,\'release\')]'],
// 	original_artist: ['Tag Fields: Original Artist', "[ '('%original artist%' cover)']"],
// });

/** @type {*} */
let tf = {};	// title formatting strings - defining each entry separately for auto-complete purposes
tf.album_subtitle = '%albumsubtitle%';
tf.album_translation = '%albumtranslation%';
tf.artist_country = '%artistcountry%';
tf.artist = '$if3(%artist%,%composer%,%performer%,%album artist%)';
tf.date = '$if3(%original release date%,%originaldate%,%date%,%fy_upload_date%)';
tf.disc_subtitle = '%discsubtitle%';
tf.disc = '$ifgreater(%totaldiscs%,1,CD %discnumber%/%totaldiscs%,)';
tf.edition = '[$if(%original release date%,$ifequal($year(%original release date%),$year(%date%),,$year(%date%) ))$if2(%edition%,\'release\')]';
tf.last_played = '[$if2(%last_played_enhanced%,%last_played%)]';
tf.lyrics = '[$if3(%lyrics%,%lyric%,%unsyncedlyrics%,%unsynced lyrics%)]';
tf.original_artist = '[ \'(\'%original artist%\' cover)\']';
tf.title = '%title%[ \'[\'%translation%\']\']';
tf.tracknum = '[%tracknumber%.]';
tf.vinyl_side = '%vinyl side%';
tf.vinyl_tracknum = '%vinyl tracknumber%';
tf.year = '[$year($if3(%original release date%,%originaldate%,%date%,%fy_upload_date%))]';

const titleFormatComments = {
	artist_country: 'Only used for displaying artist flags.',
	date: 'The full date stored for the track',
	lyrics: 'Lyrics.js will check these fields in order if no local lyrics file is found.',
	title: 'Track title shown above the progress bar',
	vinyl_side: 'Used for determining what side a song appears on for vinyl releases - i.e. song A1 has a %vinyl side% of "A"',
	vinyl_tracknum: 'Used for determining the track number on vinyl releases - i.e. song A1 has %vinyl tracknumber% set to "1"',
	year: 'Just the year portion of any stored date.',
}
const titleFormatSchema = new ConfigurationObjectSchema('title_format_strings', ConfigurationObjectType.Object, undefined,
		'Title formatting fields, used throughout the display. Do NOT change the key names.');

// TEXT FIELDS
var stoppedStr1 = 'foobar2000';
var stoppedStr2 = 'plays music';
var stoppedTime = 'Georgia v' + currentVersion;

/* My ridiculous artist string:
$ifgreater($meta_num(ArtistFilter),1,$puts(mArtist,$meta(ArtistFilter,0))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$get(mArtist)\
$if($stricmp($get(mArtist),%artist%),$puts(feat,1),)\
$puts(mArtist,$meta(ArtistFilter,1))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$if($get(feat), feat. ,', ')$get(mArtist)\
$puts(mArtist,$meta(ArtistFilter,2))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),3,' & ',', ')$get(mArtist)\
$puts(mArtist,$meta(ArtistFilter,3))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),4,' & ',', ')$get(mArtist)\
$puts(mArtist,$meta(ArtistFilter,4))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)\
$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),5,' & ',', ')$get(mArtist)\
)))))))))),%artist%);

In one line for adding to properties:
$ifgreater($meta_num(ArtistFilter),1,$puts(mArtist,$meta(ArtistFilter,0))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$get(mArtist)$if($stricmp($get(mArtist),%artist%),$puts(feat,1),)$puts(mArtist,$meta(ArtistFilter,1))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$if($get(feat), feat. ,', ')$get(mArtist)$puts(mArtist,$meta(ArtistFilter,2))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),3,' & ',', ')$get(mArtist)$puts(mArtist,$meta(ArtistFilter,3))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),4,' & ',', ')$get(mArtist)$puts(mArtist,$meta(ArtistFilter,4))$if($put(comma,$sub($strstr($get(mArtist),', '),1)),$puts(mArtist,$substr($get(mArtist),$add($get(comma),3),$len($get(mArtist))) $substr($get(mArtist),0,$get(comma))),)$if($get(mArtist),$if($or($stricmp($get(mArtist),'Soundtrack'),$stricmp($get(mArtist),'Various Artists')),,$ifequal($meta_num(ArtistFilter),5,' & ',', ')$get(mArtist))))))))))),%artist%)
*/

// Info grid. Simply add, change, reorder, or remove entries to change grid layout
const grid = [
	{ label: 'Disc',         val: '$if('+ tf.disc_subtitle +',[Disc %discnumber% - ]'+ tf.disc_subtitle +')' },
	{ label: 'Release Type', val: '$if($strstr(%releasetype%,Album),,[%releasetype%])' },
	{ label: 'Year',         val: '$puts(d,'+tf.date+')$if($strcmp($year($get(d)),$get(d)),$get(d),)', comment: 'Year is shown if the date format is YYYY' },
	{ label: 'Release Date', val: '$puts(d,'+tf.date+')$if($strcmp($year($get(d)),$get(d)),,$get(d))', age: true, comment: 'is used if the date is YYYY-MM-DD' },
	{ label: 'Edition',      val: tf.edition },
	{ label: 'Label',        val: '[$meta_sep(label, \u2022 )]' },
	{ label: 'Catalog #',    val: '[%catalognumber%]' },
	{ label: 'Track',        val: '$if(%tracknumber%,$num(%tracknumber%,1)$if(%totaltracks%,/$num(%totaltracks%,1))$ifgreater(%totaldiscs%,1,   CD %discnumber%/$num(%totaldiscs%,1),)' },
	{ label: 'Genre',        val: '[$meta_sep(genre, \u2022 )]' },
	{ label: 'Style',        val: '[$meta_sep(style, \u2022 )]' },
	{ label: 'Release',      val: '[%release%]' },
	{ label: 'Codec',   	 val: "[$if($not($strstr(%codec%,'MP3')),$replace($if2(%codec_profile%,%codec%),ATSC A/52,Dolby Digital)[ $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0))])]" },
	{ label: 'Added',        val: '[$if2(%added_enhanced%,%added%)]', age: true },
	{ label: 'Last Played',  val: '[' + tf.last_played + ']', age: true },
	{ label: 'Hotness',	     val: "$puts(X,5)$puts(Y,$div(%_dynamic_rating%,400))$repeat($repeat(I,$get(X))   ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))$ifgreater(%_dynamic_rating%,0,   $replace($div(%_dynamic_rating%,1000)'.'$mod($div(%_dynamic_rating%,100),10),0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9),)" },
	{ label: 'View Count',   val: '[%fy_view_count%]' },
	{ label: 'Likes',        val: "[$if(%fy_like_count%,%fy_like_count% \u25B2 / %fy_dislike_count% \u25BC,)]" },
	{ label: 'Play Count',   val: '$if($or(%play_count%,%lastfm_play_count%),$puts(X,5)$puts(Y,$max(%play_count%,%lastfm_play_count%))$ifgreater($get(Y),30,,$repeat($repeat(I,$get(X)) ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))   )$get(Y))' },
	{ label: 'Rating', 	     val: '$if(%rating%,$repeat(\u2605 ,%rating%))' },
	{ label: 'Mood',         val: '$if(%mood%,$puts(X,5)$puts(Y,$mul(5,%mood%))$repeat($repeat(I,$get(X))   ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))$replace(%mood%,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9))' },
];
const gridSchema = new ConfigurationObjectSchema('metadata_grid', ConfigurationObjectType.Array, [
	{ name: 'label' },
	{ name: 'val' },	// todo: change this to 'value'?
	{ name: 'age', optional: true },
], '*NOTE* Entries that evaluate to an empty string will not be shown in the grid');

const settingsPref = {
	cdart_basename: 'cd',
	hide_cursor: false,
	locked: false,
}
const settingsComments = {
	cdart_basename: 'Do not include extension. Example: "discart", if metadata consumer uses that name for cdart and you want those filtered from showing as albumart',
	hide_cursor: 'Hides cursor when song is playing after 10 seconds of no mouse activity',
	locked: 'Locks theme by preventing right-clicking on the background from bringing up a menu.',
}
const settingsSchema = new ConfigurationObjectSchema('settings', ConfigurationObjectType.Object,
		// will display as key/val pairs with comments attached
		undefined, 'General settings for the theme.');

const configPath = fb.ProfilePath + '\\georgia\\georgia-config.jsonc';
const config = new Configuration(configPath);
let titleformat = {};
if (!config.fileExists || true) {
	settings = config.addConfigurationObject(settingsSchema, settingsPref, settingsComments);
	tf = config.addConfigurationObject(titleFormatSchema, tf, titleFormatComments);
	config.addConfigurationObject(gridSchema, grid);
	config.writeConfiguration();
	tf.grid = grid;	// these aren't key/value pairs so can't be updated using ThemeSettings
}
if (config.fileExists) {
	const prefs = config.readConfiguration();
	settings = config.addConfigurationObject(settingsSchema, prefs.settings, settingsComments);
	tf = config.addConfigurationObject(titleFormatSchema, prefs.title_format_strings, titleFormatComments);
	config.addConfigurationObject(gridSchema, prefs.metadata_grid, titleFormatComments);
	tf.grid = prefs.metadata_grid;	// these aren't key/value pairs so can't be updated using ThemeSettings for now
}

/* Safety checks. Fix up potentially bad vals from config */
settings.cdart_basename = settings.cdart_basename.trim().length ? settings.cdart_basename.trim() : 'cd';


/* All tf values from here below will NOT be writting to the Config file */
tf.vinyl_track = '$if2(' + tf.vinyl_side + '[' + tf.vinyl_tracknum + ']. ,[%tracknumber%. ])';
// GLOB PICTURES
tf.glob_paths = [ // simply add, change or re-order entries as needed
	'$replace(%path%,%filename_ext%,)folder*',
	'$replace(%path%,%filename_ext%,)cover*',
	'$replace(%path%,%filename_ext%,)*.jpg',
	'$replace(%path%,%filename_ext%,)*.png',
	'$replace(%path%,%directoryname%\\%filename_ext%,)folder*' // all folder images in parent directory
];

tf.lyr_path = [ // simply add, change or re-order entries as needed
	'$replace($replace(%path%,%filename_ext%,),\,\\)',
	fb.ProfilePath + 'lyrics\\',
	fb.FoobarPath + 'lyrics\\',
];
tf.lyr_artist = "$replace(%artist%,'/','_',':','_','\"','_')"; // we need to strip some special characters so we can't use just use tf.artist
tf.lyr_title = "$replace(%title%,'/','_',':','_','\"','_')"; // we need to strip special characters so we can't just use tf.title
tf.lyr_filename = [ // filenames to look for lyrics files. Both .lrc and .txt will be searched for each entry in this list
	tf.lyr_artist + ' - ' + tf.lyr_title,
	tf.lyr_artist + ' -' + tf.lyr_title,
	tf.tracknum.replace('.','') + ' - ' + tf.lyr_title,
	tf.tracknum.replace('.','') + ' - ' + tf.lyr_artist + ' - ' + tf.lyr_title,
];

tf.labels = [ // Array of fields to test for publisher. Add, change or re-order as needed.
	'label', // DO NOT put %s around the field names because we are using $meta() calls
	'publisher'
];

// CD-ART SETTINGS
// we expect cd-art will be in .png with transparent background, best found at fanart.tv.
pref.vinylside_path = '$replace(%path%,%filename_ext%,)vinyl$if2(' + tf.vinyl_side + ',).png' // vinyl cdart named vinylA.png, vinylB.png, etc.
pref.vinyl_path = '$replace(%path%,%filename_ext%,)vinyl.png' // vinyl cdart named vinylA.png, vinylB.png, etc.
pref.cdartdisc_path = '$replace(%path%,%filename_ext%,)' + settings.cdart_basename + '$ifgreater(%totaldiscs%,1,%discnumber%,).png'; // cdart named cd1.png, cd2.png, etc.
pref.cdart_path = '$replace(%path%,%filename_ext%,)' + settings.cdart_basename + '.png'; // cdart named cd.png (or whatever custom value was specified). This is the most common single disc case.
pref.cdart_amount = 0.48; // show 48% of the CD image if it will fit on the screen

function migrateCheck(version, storedVersion) {
	if (version !== storedVersion) {
		// this function clears default values which have changed
		switch (storedVersion) {

			case '1.1.9':
				// after all previous versions have fallen through
				console.log('Upgrading Georgia Theme settings');
                globals.version = currentVersion;
				window.Reload();

            default:
                globals.version = currentVersion;
				break;

		}
	}
}

migrateCheck(currentVersion, globals.version);
function checkForUpdates(openUrl) {
	var url = 'https://api.github.com/repos/kbuffington/Georgia/tags';
	makeHttpRequest('GET', url, function (resp) {
		try {
			var respObj = JSON.parse(resp);
			updateAvailable = isNewerVersion(currentVersion, respObj[0].name);
			console.log('Current released version of Georgia: v' + respObj[0].name);
			if (updateAvailable) {
				stoppedTime += ' - ';
				console.log('>>> Georgia update available. Download it here: https://github.com/kbuffington/Georgia/releases')
				if (!fb.IsPlaying) {
					str.time = stoppedTime;
					RepaintWindow();
				}
				updateHyperlink = new Hyperlink('Update Available', ft.lower_bar, 'update', 0, 0, window.Width);
				if (openUrl) {
					updateHyperlink.click();
				}
			} else {
				console.log('You are on the most current version of Georgia');
			}
		} catch (e) {
			console.log('Could not check latest version');
		}
	});
}

if (pref.checkForUpdates) {
	checkForUpdates(false);
}