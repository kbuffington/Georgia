
var oldButton, downButton;
var buttonTimer = null;
var mainMenuOpen = false;

var tooltipTimeout = null;
var lastOverButton = null;

var activatedBtns = [];

var tt = new _.tt_handler;

function buttonEventHandler(x, y, m) {

	// var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	// var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	var c = caller();

	var thisButton = null;

	for (var i in btns) {
		if (typeof btns[i] === 'object' && btns[i].mouseInThis(x, y)) {
			thisButton = btns[i];
			break;
		}
	}
	if (lastOverButton != thisButton) {
		tt.stop();
	}
	lastOverButton = thisButton;

	switch (c) {

		case 'on_mouse_move':
			if (downButton) return;

			if (oldButton && oldButton != thisButton) {
				oldButton.changeState(0);
			}
			if (thisButton && thisButton != oldButton) {
				thisButton.changeState(1);
			}

			if (lastOverButton) {
				if (lastOverButton.tooltip) {
					tt.showDelayed(lastOverButton.tooltip);
				} else if (lastOverButton.id === 'Volume') {
					tt.showDelayed(fb.Volume.toFixed(2) + ' dB');
				}
			} 

			oldButton = thisButton;
			break;
		case 'on_mouse_lbtn_dblclk':
			if (thisButton) {
				thisButton.changeState(2);
				downButton = thisButton;
				downButton.onDblClick();
			}
			break;
		case 'on_mouse_lbtn_down':
			if (thisButton) {
				thisButton.changeState(2);
				downButton = thisButton;
			}

			break;

		case 'on_mouse_lbtn_up':
			if (downButton) {
				downButton.onClick();

				if (mainMenuOpen) {
					thisButton = undefined;
					mainMenuOpen = false;
				}
				thisButton ? thisButton.changeState(1) : downButton.changeState(0);

				downButton = undefined;
			}
			break;
		case 'on_mouse_leave':
			oldButton = undefined;
			if (downButton) return; // for menu buttons

			for (var i in btns) {
				if (btns[i].state != 0) {
					btns[i].changeState(0);
				}
			}

			break;
	}
}

// =================================================== //
WindowState = {
	Normal: 0,
	Minimized: 1,
	Maximized: 2
}

function Button(x, y, w, h, id, img, tip) {

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.id = id;
	this.img = img;
	this.tooltip = typeof tip !== 'undefined' ? tip : '';
	this.state = 0;
	this.hoverAlpha = 0;
	this.downAlpha = 0;

}
// =================================================== //
Button.prototype.mouseInThis = function (x, y) {
	return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
}
// =================================================== //
Button.prototype.repaint = function () {
	window.RepaintRect(this.x, this.y, this.w, this.h);
}
// =================================================== //
Button.prototype.changeState = function (state) {
	this.state = state;
	activatedBtns.push(this);
	buttonAlphaTimer();
}
// =================================================== //
Button.prototype.onClick = function () {

	switch (this.id) {

		case 'Stop':
			fb.Stop();
			break;
		case 'Previous':
			fb.Prev();
			break;
		case 'Play/Pause':
			fb.PlayOrPause();
			break;
		case 'Next':
			fb.Next();
			break;
		case 'Playback/Random':
			fb.RunMainMenuCommand('Edit/Sort/Randomize');
			if (fb.IsPlaying) {
				var playing_location = plman.GetPlayingItemLocation();
				if (playing_location.IsValid) {
					var pl = playing_location.PlaylistIndex;
					var handles = plman.GetPlaylistItems(pl);
					handles.RemoveById(playing_location.PlaylistItemIndex);
					plman.ClearPlaylistSelection(pl);
					plman.SetPlaylistSelection(pl, [playing_location.PlaylistItemIndex], true);
			
					plman.RemovePlaylistSelection(pl, true);
					plman.InsertPlaylistItems(pl, 1, handles);
					plman.EnsurePlaylistItemVisible(pl, 0);
					if (displayPlaylist) {
						playlist.on_playback_new_track(fb.GetNowPlaying());	// used to scroll item into view
					}
				}
			} else {
				var pl = plman.ActivePlaylist;
				plman.ClearPlaylistSelection(pl);
				plman.SetPlaylistSelection(pl, [0], true);
				plman.AddPlaylistItemToPlaybackQueue(pl, 0);
				fb.RunMainMenuCommand('Playback/Play');
			}
			break;
		case 'Volume':
			volume_btn.showVolumeBar(true);
			break;
		case 'Reload':
			art_cache.clear();
			window.Reload();
			break;
		case 'Console':
			fb.RunMainMenuCommand("View/Console");
			break;
		case 'OpenExplorer':
			if (!safeMode) {
				try {
					WshShell.Run("explorer.exe /e,::{20D04FE0-3AEA-1069-A2D8-08002B30309D}");
				} catch (e) {
					console.log(e);
				};
			}
			break;
		case 'Minimize':
			fb.RunMainMenuCommand("View/Hide");
			break;
		case 'Maximize':
			try {
				if (maximizeToFullScreen ? !utils.IsKeyPressed(VK_CONTROL) : utils.IsKeyPressed(VK_CONTROL)) {
					UIHacks.FullScreen = !UIHacks.FullScreen;
				} else {
					if (UIHacks.MainWindowState == WindowState.Maximized) UIHacks.MainWindowState = WindowState.Normal;
					else UIHacks.MainWindowState = WindowState.Maximized;
				}
			} catch (e) {
				console.log(e + " Disable WSH safe mode");
			}
			break;
		case 'Close':
			fb.Exit();
			break;
		case 'File':
		case 'Edit':
		case 'View':
		case 'Playback':
		case 'Library':
		case 'Help':
			onMainMenu(this.x, this.y + this.h, this.id);
			break;
		case 'Playlists':
			onPlaylistsMenu(this.x, this.y + this.h);
			break;
		case 'Options':
			onOptionsMenu(this.x, this.y + this.h);
			break;
		case 'Repeat':
			var pbo = fb.PlaybackOrder;
			if (pbo == playbackOrder.Default) fb.PlaybackOrder = playbackOrder.RepeatPlaylist;
			else if (pbo == playbackOrder.RepeatPlaylist) fb.PlaybackOrder = playbackOrder.RepeatTrack;
			else if (pbo == playbackOrder.RepeatTrack) fb.PlaybackOrder = playbackOrder.Default;
			else fb.PlaybackOrder = playbackOrder.RepeatPlaylist;
			break;
		case 'Shuffle':
			var pbo = fb.PlaybackOrder;
			if (pbo != playbackOrder.ShuffleTracks) fb.PlaybackOrder = playbackOrder.ShuffleTracks;
			else fb.PlaybackOrder = playbackOrder.Default;
			break;
		case 'Mute':
			fb.VolumeMute();
			break;
		case 'Front':
			coverSwitch(0);
			break;
		case 'Back':
			coverSwitch(1);
			break;
		case 'CD':
			coverSwitch(2);
			break;
		case 'Artist':
			coverSwitch(3);
			break;
		case 'Settings':
			fb.ShowPreferences();
			break;
		case 'Properties':
			fb.RunContextCommand("Properties");
			break;
		case 'Rating':
			onRatingMenu(this.x, this.y + this.h);
			break;
		case 'Lyrics':
			displayLyrics = !displayLyrics;
			if ((fb.IsPlaying || fb.IsPaused) && albumart_scaled) {
				if (displayLyrics) {
					refresh_lyrics();
				}
				window.RepaintRect(albumart_size.x - 1, albumart_size.y - 1, albumart_scaled.width + 2, albumart_scaled.height + 2);
			}
			break;
		case 'ShowLibrary':
			displayLibrary = !displayLibrary;
			if (displayLibrary) {
				initLibraryPanel();
				setLibrarySize();
			}
			if (displayPlaylist) {
				displayPlaylist = false;
			} else {
				ResizeArtwork(false);
			}
			window.Repaint();
			break;
		case 'Playlist':
			// we appear to be getting album art way too frequently here -- delete this comment and others when verified this is cool
			displayPlaylist = !displayPlaylist;
			if (displayPlaylist) {
				playlist.on_size(ww, wh);
			}
			if (displayLibrary) {
				displayLibrary = false;
			} else {
				ResizeArtwork(false);
			}
			window.Repaint();
			break;
	}
}
// =================================================== //

Button.prototype.onDblClick = function () {
	// we don't do anything with dblClick currently
}
// =================================================== //

function getPlaybackOrder() {

	var order;

	for (var i in playbackOrder) {

		if (fb.PlaybackOrder == playbackOrder[i]) {
			order = i;
			break;
		}
	}

	return order;
}
// =================================================== //

function onPlaylistsMenu(x, y) {

	mainMenuOpen = true;
	menu_down = true;
	var lists = window.CreatePopupMenu();
	var playlistCount = plman.PlaylistCount;
	var playlistId = 3;
	lists.AppendMenuItem(MF_STRING, 1, "Playlist manager...");
	lists.AppendMenuSeparator();
	lists.AppendMenuItem(MF_STRING, 2, "Create New Playlist");
	lists.AppendMenuSeparator();
	for (var i = 0; i != playlistCount; i++) {
		lists.AppendMenuItem(MF_STRING, playlistId + i, plman.GetPlaylistName(i).replace(/\&/g, '&&') + ' [' + plman.PlaylistItemCount(i) + ']' + (plman.IsAutoPlaylist(i) ? ' (Auto)' : '') + (i === plman.PlayingPlaylist ? ' (Now Playing)' : ''));
	}

	var id = lists.TrackPopupMenu(x, y);

	switch (id) {
		case 1:
			fb.RunMainMenuCommand("View/Playlist Manager");
			break;
		case 2:
			plman.CreatePlaylist(playlistCount, "");
			plman.ActivePlaylist = plman.PlaylistCount - 1;
			break;
	}
	for (var i = 0; i != playlistCount; i++) {
		if (id == (playlistId + i)) plman.ActivePlaylist = i; // playlist switch
	}
	lists.Dispose();
	menu_down = false;
	return true;
}
// =================================================== //

function onMainMenu(x, y, name) {

	mainMenuOpen = true;
	menu_down = true;

	if (name) {
		var menu = new Menu();
		
		if (name === 'Help') {
			var statusMenu = new Menu('Georgia Theme Status');

			statusMenu.addItem('All fonts installed', fontsInstalled, undefined, true);
			statusMenu.addItem('Artist logos found', IsFile(pref.logo_hq + 'Metallica.png'), undefined, true);
			statusMenu.addItem('Record label logos found', IsFile(pref.label_base + 'Republic.png'), undefined, true);
			statusMenu.addItem('Flag images found', IsFile(pref.flags_base + (is_4k ? '64\\' : '32\\') + 'United-States.png'), undefined, true);
			statusMenu.addItem('foo_enhanced_playcount installed', componentEnhancedPlaycount, function() { _.runCmd('https://www.foobar2000.org/components/view/foo_enhanced_playcount') });

			statusMenu.appendTo(menu);
			
			menu.addItem('Georgia releases', false, function() { _.runCmd('https://github.com/kbuffington/Georgia/releases') });
			menu.addItem('Georgia Changelog', false, function() { _.runCmd('https://github.com/kbuffington/Georgia/blob/master/changelog.md') });
			menu.addItem('Check for updated version of Georgia', false, function() { checkForUpdates(true); });
			menu.addItem('Report an issue with Georgia', false, function() { _.runCmd('https://github.com/kbuffington/Georgia/issues') });
		}
		menu.initFoobarMenu(name);

		var ret = menu.trackPopupMenu(x, y);
		menu.doCallback(ret);
	}

	menu_down = false;

}
// =================================================== //

function refreshPlayButton() {

	btns[2].img = (fb.IsPlaying ? (fb.IsPaused ? btnImg.Play : btnImg.Pause) : btnImg.Play);
	btns[2].repaint();

}
// =================================================== //

function caller() {
	var caller = /^function\s+([^(]+)/.exec(arguments.callee.caller.caller);
	if (caller) return caller[1];
	else return 0;
}

// =================================================== //
function buttonAlphaTimer() {

	var trace = false;

	var buttonHoverInStep = 40,
		buttonHoverOutStep = 15,
		buttonDownInStep = 100,
		buttonDownOutStep = 50,
		buttonTimerDelay = 25;

	if (!buttonTimer) {

		buttonTimer = window.SetInterval(function () {

			for (var i in activatedBtns) {
				switch (activatedBtns[i].state) {
					case 0:
						activatedBtns[i].hoverAlpha = Math.max(0, activatedBtns[i].hoverAlpha -= buttonHoverOutStep);
						activatedBtns[i].downAlpha = Math.max(0, activatedBtns[i].downAlpha -= Math.max(0, buttonDownOutStep));
						activatedBtns[i].repaint();
						break;
					case 1:
						activatedBtns[i].hoverAlpha = Math.min(255, activatedBtns[i].hoverAlpha += buttonHoverInStep);
						activatedBtns[i].downAlpha = Math.max(0, activatedBtns[i].downAlpha -= buttonDownOutStep);
						activatedBtns[i].repaint();
						break;
					case 2:
						activatedBtns[i].downAlpha = Math.min(255, activatedBtns[i].downAlpha += buttonDownInStep);
						activatedBtns[i].hoverAlpha = Math.max(0, activatedBtns[i].hoverAlpha -= buttonDownInStep);
						activatedBtns[i].repaint();
						break;
				}
			}

			//---> Test button alpha values and turn button timer off when it's not required;
			for (i = activatedBtns.length - 1; i >= 0; i--) {
				if ((!activatedBtns[i].hoverAlpha && !activatedBtns[i].downAlpha) ||
					activatedBtns[i].hoverAlpha === 255 || activatedBtns[i].downAlpha === 255) {
					activatedBtns.splice(i, 1);
				}
			}

			if (!activatedBtns.length) {
				window.ClearInterval(buttonTimer);
				buttonTimer = null;
				trace && console.log("buttonTimerStarted = false");
			}

		}, buttonTimerDelay);

		trace && console.log("buttonTimerStarted = true");
	}
}
