var globals = PanelProperties.get_instance();
var pref = PanelProperties.get_instance(); // preferences
var tf = PanelProperties.get_instance(); // titleformating strings

var currentVersion = '1.1.7';
var updateAvailable = false;
var updateHyperlink;

// these used to be initialized in js_marc2003/js/helpers.js
var doc = new ActiveXObject('htmlfile');
var app = new ActiveXObject('Shell.Application');
var WshShell = new ActiveXObject('WScript.Shell');
var fso = new ActiveXObject('Scripting.FileSystemObject');
var vb = new ActiveXObject('ScriptControl');

globals.add_properties({
	version: ['_theme_version (do not hand edit!)', 'NONE']
});

// THEME PREFERENCES/PROPERTIES EXPLANATIONS - After initial run, these values are changed in Options Menu or by Right Click >> Properties and not here!
pref.add_properties({
	locked: ['Lock theme', false], // true: prevent changing theme with right click
	rotation_amt: ['Art: Degrees to rotate CDart', 3], // # of degrees to rotate per track change.
	aa_glob: ['Art: Cycle through all images', true], // true: use glob, false: use albumart reader (front only)
	display_cdart: ['Art: Display CD art', true], // true: show CD artwork behind album artwork. This artwork is expected to be named cd.png and have transparent backgrounds (can be found at fanart.tv)
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
	show_transport: ['Show transport controls', true], // true: show the play/pause/next/prev/random buttons at the top of the screen
	show_random_button: ['Show Random Button', true], // true: show random button in transport controls, ignored if transport not shown
	show_volume_button: ['Show Volume Button', false], // true: show volume button in transport controls, ignored if transport is not shown
	show_reload_button: ['Show Reload Button', false], // true: show a button that reloads the theme when clicked. Useful for debugging only
	freq_update: ['Frequent progress bar updates', true], // true: update progress bar multiple times a second. Smoother, but uses more CPU
	time_zone: ['Time-zone (formatted +/-HH:MM, e.g. -06:00)', '+00:00'], // used to create accurate timezone offsets. "Z", "-06:00", "+06:00", etc. are all valid values
    hyperlinks_ctrl: ['Playlist: Hyperlinks require CTRL Key', false], // true: clicking on hyperlinks only works if CTRL key is held down
    darkMode: ['Use Dark Theme', true], // true: use a darker background
	use_4k: ['Detect 4k', 'auto'], // auto: switch to 4k mode when window width wide enough, never: never use 4k mode, always: always use 4k mode
	checkForUpdates: ['Check for Updates', true], // true: check github repo to determine if updates exist

	lyrics_line_height: ['Lyrics: Line height', 32],
	lyrics_normal_color: ['Lyrics: Text Color', 'RGBA(255, 255, 255, 255);'],
	lyrics_focus_color: ['Lyrics: Text Highlite Color', 'RGBA(255, 241, 150, 255);'],
	lyrics_h_padding: ['Lyrics: Padding Between Lines', 24],
	lyrics_glow: ['Lyrics: Glow enabled', true],
	lyrics_text_shadow: ['Lyrics: Text Shadow', true],
	
	font_size_playlist: ['Font Size: Playlist', 12],
	font_size_playlist_header: ['Font Size: Playlist Header', 15],
	lyrics_font_size: ['Font Size: Lyrics', 20],
});

if (pref.art_rotate_delay < 5) {
	pref.art_rotate_delay = 5;
}

// Lyrics variables
// lyrics color definitions
var g_txt_normalcolour = eval(pref.lyrics_normal_color);
var g_txt_highlightcolour = eval(pref.lyrics_focus_color);
var g_txt_shadowcolor = RGBA(000, 000, 000, 255);

//Tag Properties
tf.add_properties({
	// added:          ['Tag Fields: Added', '$ifgreater($if(%lastfm_added%,$replace($date(%lastfm_added%),-,),999999999),$replace($date(%added%),-,),[%added%],[%lastfm_added%])'],
	added: ['Tag Fields: Added', '[$if2(%added_enhanced%,%added%)]'],
	album_subtitle: ['Tag Fields: Album Subtitle', '%albumsubtitle%'],
	artist: ['Tag Fields: Artist String', '$if3(%artist%,%composer%,%performer%,%album artist%)'],
	artist_country: ['Tag Fields: Country', '%artistcountry%'], // we call meta_num(artistcountry) so don't wrap this in % signs
	disc: ['Tag Fields: Disc String', '$ifgreater(%totaldiscs%,1,CD %discnumber%/%totaldiscs%,)'],
	disc_subtitle: ['Tag Fields: Disc Subtitle', '%discsubtitle%'],
	year: ['Tag Fields: Year', '$if3(%original release date%,%originaldate%,%date%,%fy_upload_date%)'],
	date: ['Tag Fields: Date', '$if3(%original release date%,%originaldate%,%date%,%fy_upload_date%)'],
	last_played: ['Tag Fields: Last Played', '[$if2(%last_played_enhanced%,%last_played%)]'],
	title: ['Tag Fields: Song Title String', "%title%[ '['%translation%']']"],
	vinyl_side: ['Tag Fields: Vinyl Side', '%vinyl side%'], // the tag used for determining what side a song appears on for vinyl releases - i.e. song A1 has a %vinyl side% of "A"
	vinyl_tracknum: ['Tag Fields: Vinyl Track#', '%vinyl tracknumber%'], // the tag used for determining the track number on vinyl releases i.e. song A1 has %vinyl tracknumber% set to "1"
	translation: ['Tag Fields: Translated song title', '%translation%'],
	album_trans: ['Tag Fields: Translated album title', '%albumtranslation%'],
	edition: ['Tag Fields: Edition', '[$if(%original release date%,$ifequal($year(%original release date%),$year(%date%),,$year(%date%) ))$if2(%edition%,\'release\')]'],
	original_artist: ['Tag Fields: Original Artist', "[ '('%original artist%' cover)']"],
})

// Playlist TF strings, not currently saved in globals:
// %album%[ — '['$if(%original release date%,$ifequal($year(%original release date%),$year(%date%),,$year(%date%) ))%edition%']']

var componentEnhancedPlaycount = utils.CheckComponent('foo_enhanced_playcount');
if (!componentEnhancedPlaycount) {
	console.log('foo_enhanced_playcount not loaded');
	tf.played_times = '';
	tf.last_fm_plays = '';
} else {
	tf.add_properties({
		played_times: ['Tag Fields: All Played Times', "$if($strcmp(%played_times%,'[]'),,%played_times%)"],
		last_fm_plays: ['Tag Fields: All Last.Fm Played Times', "$if($strcmp(%lastfm_played_times_js%,'[]'),,%lastfm_played_times_js%)"],
	})
}

// TEXT FIELDS
var stoppedStr1 = 'foobar2000';
var stoppedStr2 = 'plays music';
var stoppedTime = 'Georgia v' + currentVersion;
tf.tracknum = '[%tracknumber%.]';
tf.title_trans = "%title%[ '['" + tf.translation + "']']";
tf.vinyl_track = '$if2(' + tf.vinyl_side + '[' + tf.vinyl_tracknum + ']. ,[%tracknumber%. ])';
tf.vinyl_title = tf.vinyl_track + "%title%[ '['" + tf.translation + "']']";
tf.artist_country = tf.artist_country.replace('%', ''); // need to strip %'s because we use meta_num on this field

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
tf.grid = [
	{ label: 'Disc',         val: '$if('+ tf.disc_subtitle +',[Disc %discnumber% - ]'+ tf.disc_subtitle +')' },
	{ label: 'Release Type', val: '$if($strstr(%releasetype%,Album),,[%releasetype%])' },
	{ label: 'Year',         val: '$puts(d,'+tf.year+')$if($strcmp($year($get(d)),$get(d)),$get(d),)' },            // tf.year is used if the date is YYYY
	{ label: 'Release Date', val: '$puts(d,'+tf.date+')$if($strcmp($year($get(d)),$get(d)),,$get(d))', age: true }, // tf.date is used if the date is YYYY-MM-DD
	{ label: 'Edition',      val: tf.edition },
	{ label: 'Label',        val: '[$replace(%label%,\', \',\' • \')]' },
	{ label: 'Catalog #',    val: '[%catalognumber%]' },
	{ label: 'Track',        val: '$if(%tracknumber%,$num(%tracknumber%,1)$if(%totaltracks%,/$num(%totaltracks%,1))$ifgreater(%totaldiscs%,1,   CD %discnumber%/$num(%totaldiscs%,1),)' },
	{ label: 'Genre',        val: '[$replace(%genre%,\', \',\' • \')]' },
	{ label: 'Style',        val: '[$replace(%style%,\', \',\' • \')]' },
	{ label: 'Release',      val: '[%release%]' },
	{ label: 'Codec',   	 val: "[$if($not($strstr(%codec%,'MP3')),$replace($if2(%codec_profile%,%codec%),ATSC A/52,Dolby Digital)[ $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0))])]" },
	{ label: 'Added',        val: '[' + tf.added + ']', age: true },
	{ label: 'Last Played',  val: '[' + tf.last_played + ']', age: true },
	{ label: 'Hotness',	     val: "$puts(X,5)$puts(Y,$div(%_dynamic_rating%,400))$repeat($repeat(I,$get(X))   ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))$ifgreater(%_dynamic_rating%,0,   $replace($div(%_dynamic_rating%,1000)'.'$mod($div(%_dynamic_rating%,100),10),0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9),)" },
	{ label: 'View Count',   val: '[%fy_view_count%]' },
	{ label: 'Likes',        val: "[$if(%fy_like_count%,%fy_like_count% ▲ / %fy_dislike_count% ▼,)]" },
	// { label: 'Play Count',   val: '$if($or(%play_count%,%lastfm_play_count%),$puts(X,5)$puts(Y,$max(%play_count%,%lastfm_play_count%))$repeat($repeat(I,$get(X)) ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))   $get(Y))' },
	{ label: 'Play Count',   val: '$if($or(%play_count%,%lastfm_play_count%),$puts(X,5)$puts(Y,$max(%play_count%,%lastfm_play_count%))$ifgreater($get(Y),30,,$repeat($repeat(I,$get(X)) ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))   )$get(Y))' },
	{ label: 'Rating', 	     val: '$if(%rating%,$repeat(\u2605 ,%rating%))' },
	{ label: 'Mood',         val: '$if(%mood%,$puts(X,5)$puts(Y,$mul(5,%mood%))$repeat($repeat(I,$get(X))   ,$div($get(Y),$get(X)))$repeat(I,$mod($get(Y),$get(X)))$replace(%mood%,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9))' },
];
tf.lyrics = '[$if3(%LYRICS%,%LYRIC%,%UNSYNCED LYRICS%,%UNSYNCED LYRIC%)]';

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
	fb.ProfilePath + "lyrics\\",
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
pref.vinylside_path = "$replace(%path%,%filename_ext%,)vinyl$if2(" + tf.vinyl_side + ",).png" // vinyl cdart named vinylA.png, vinylB.png, etc.
pref.vinyl_path = "$replace(%path%,%filename_ext%,)vinyl.png" // vinyl cdart named vinylA.png, vinylB.png, etc.
pref.cdartdisc_path = "$replace(%path%,%filename_ext%,)cd$ifgreater(%totaldiscs%,1,%discnumber%,).png"; // cdart named cd1.png, cd2.png, etc.
pref.cdart_path = "$replace(%path%,%filename_ext%,)cd.png"; // cdart named cd.png  (the far more common single disc albums)
pref.cdart_amount = 0.48; // show 48% of the CD image if it will fit on the screen

function migrateCheck(version, storedVersion) {
	if (version !== storedVersion) {
		// this function clears default values which have changed
		switch (storedVersion) {
			case '0.9.5':
			case '0.9.5.1':
			case '0.9.6':
			case 'NONE':
				pref.lyrics_line_height = null;
				pref.lyrics_font_size = null;
				window.SetProperty('user.list.pad.bottom', null);
				window.SetProperty('user.list.pad.left', null);
				window.SetProperty('user.list.pad.right', null);
				window.SetProperty('user.list.pad.top', null);
			case '0.9.9':
				tf.title = null;

			case '1.0.0':
				window.SetProperty('Library: Font Size', null);
				window.SetProperty('SYSTEM.Font Size', null);
				window.SetProperty('user.row.height', null);

			case '1.1.0':
			case '1.1.1':
				tf.edition = null;

			case '1.1.2':
			case '1.1.3':
			case '1.1.4':
			case '1.1.5':
				tf.date = null;
				tf.year = null;
				pref.time_zone = null;

			case '1.1.6':
			case '1.1.7':
				window.SetProperty('Lyrics: Font Size', null);
				window.SetProperty('user.header.original_date.show', null);

			case '1.1.8':

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

if (pref.checkForUpdates) {
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
			}
		} catch (e) {
			console.log('Could not check latest version');
		}
	});
}