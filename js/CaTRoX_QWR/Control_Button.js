
/** @type {Button} */
let oldButton;
/** @type {Button} */
let downButton;
let buttonTimer = null;
let mainMenuOpen = false;

/** @type {Button} */
let lastOverButton = null;

/** @type {Button[]} */
let activatedBtns = [];

const ButtonState = {
	Default: 0,
	Hovered: 1,
	Down: 2,	// happens on click
	Enabled: 3,
}

function buttonEventHandler(x, y, m) {

	// var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	// var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	var c = qwr_utils.caller();

	/** @type {Button} */
	let thisButton = null;

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
				oldButton.changeState(oldButton.enabled ? ButtonState.Enabled : ButtonState.Default);
			}
			if (thisButton && thisButton != oldButton) {
				thisButton.changeState(ButtonState.Hovered);
			}

			if (lastOverButton) {
				if (lastOverButton.tooltip) {
					tt.showDelayed(lastOverButton.tooltip);
				} else if (lastOverButton.id === 'Volume' && !volume_btn.show_volume_bar) {
					tt.showDelayed(fb.Volume.toFixed(2) + ' dB');
				}
			}

			oldButton = thisButton;
			break;

		case 'on_mouse_lbtn_dblclk':
			if (thisButton) {
				thisButton.changeState(ButtonState.Down);
				downButton = thisButton;
				downButton.onDblClick();
			}
			break;

		case 'on_mouse_lbtn_down':
			if (thisButton) {
				thisButton.changeState(ButtonState.Down);
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
				if (thisButton) {
					thisButton.changeState(thisButton.enabled ? ButtonState.Enabled : ButtonState.Hovered);
				} else {
					downButton.changeState(downButton.enabled ? ButtonState.Enabled : ButtonState.Default);
				}
				// thisButton ? thisButton.changeState(ButtonState.Hovered) : downButton.changeState(ButtonState.Default);

				downButton = undefined;
			}
			break;

		case 'on_mouse_leave':
			oldButton = undefined;
			if (downButton) return; // for menu buttons

			for (var i in btns) {
				if (btns[i].state != 0) {
					btns[i].changeState(ButtonState.Default);
				}
			}
			break;
	}
	return thisButton !== null;
}

// =================================================== //
const WindowState = {
	Normal: 0,
	Minimized: 1,
	Maximized: 2
}

class Button {
	constructor(x, y, w, h, id, img, tip = undefined, isEnabled = undefined) {
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
		this.isEnabled = isEnabled; // callback
		this.enabled = false;
	}

	mouseInThis(x, y) {
		return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
	}

	set enable(val) {
		this.enabled = val;
		if (!val) {
			this.changeState(ButtonState.Default);
		} else {
			this.changeState(ButtonState.Enabled);
		}
	}

	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	changeState(state) {
		this.state = state;
		activatedBtns.push(this);
		buttonAlphaTimer();
	}

	onClick() {
		btnActionHandler(this);
	}

	onDblClick() {
		// we don't do anything with dblClick currently
	}
}

/**
 * @param {Button} btn
 */
function btnActionHandler(btn) {
	switch (btn.id) {
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
						playlist.on_playback_new_track(fb.GetNowPlaying()); // used to scroll item into view
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
			volume_btn.toggleVolumeBar();
			break;
		case 'Reload':
			window.Reload();
			break;
		case 'Console':
			fb.RunMainMenuCommand("View/Console");
			break;
		case 'Minimize':
			fb.RunMainMenuCommand("View/Hide");
			break;
		case 'Maximize':
			const maximizeToFullScreen = false; // TODO to clear the error. Test this stuff eventually
			if (maximizeToFullScreen ? !utils.IsKeyPressed(VK_CONTROL) : utils.IsKeyPressed(VK_CONTROL)) {
				UIHacks.FullScreen = !UIHacks.FullScreen;
			} else {
				if (UIHacks.MainWindowState == WindowState.Maximized)
					UIHacks.MainWindowState = WindowState.Normal;
				else
					UIHacks.MainWindowState = WindowState.Maximized;
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
			onMainMenu(btn.x, btn.y + btn.h, btn.id);
			break;
		case 'Playlists':
			onPlaylistsMenu(btn.x, btn.y + btn.h);
			break;
		case 'Options':
			onOptionsMenu(btn.x, btn.y + btn.h);
			break;
		case 'Repeat':
			var pbo = fb.PlaybackOrder;
			if (pbo == PlaybackOrder.Default) {
				fb.PlaybackOrder = PlaybackOrder.RepeatPlaylist;
			} else if (pbo == PlaybackOrder.RepeatPlaylist) {
				fb.PlaybackOrder = PlaybackOrder.RepeatTrack;
			} else if (pbo == PlaybackOrder.RepeatTrack) {
				fb.PlaybackOrder = PlaybackOrder.Default;
			} else {
				fb.PlaybackOrder = PlaybackOrder.RepeatPlaylist;
			}
			break;
		case 'Shuffle':
			var pbo = fb.PlaybackOrder;
			if (pbo != PlaybackOrder.ShuffleTracks) {
				fb.PlaybackOrder = PlaybackOrder.ShuffleTracks;
			} else {
				fb.PlaybackOrder = PlaybackOrder.Default;
			}
			break;
		case 'Mute':
			fb.VolumeMute();
			break;
		case 'Settings':
			fb.ShowPreferences();
			break;
		case 'Properties':
			fb.RunContextCommand("Properties");
			break;
		case 'Rating':
			onRatingMenu(btn.x, btn.y + btn.h);
			break;
		case 'Lyrics':
			pref.displayLyrics = !pref.displayLyrics;
			btn.enable = pref.displayLyrics;
			if ((fb.IsPlaying || fb.IsPaused) && albumart_scaled) {
				if (pref.displayLyrics) {
					initLyrics();
				}
				window.RepaintRect(albumart_size.x, albumart_size.y, albumart_size.w, albumart_size.h);
			}
			btn.repaint();
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
			setupRotationTimer();	// clear or start cdRotation if required
			btn.enable = displayLibrary;
			btns.playlist.enable = false;
			window.Repaint();
			break;
		case 'Playlist':
			displayPlaylist = !displayPlaylist;
			if (displayPlaylist) {
				playlist.on_size(ww, wh);
			}
			if (displayLibrary) {
				displayLibrary = false;
			} else {
				ResizeArtwork(false);
			}
			setupRotationTimer();	// clear or start cdRotation if required
			btn.enable = displayPlaylist;
			btns.library.enable = false;
			window.Repaint();
			break;
		case 'PlaybackTime':
			pref.showTimeRemaining = !pref.showTimeRemaining;
			on_playback_time();
			break;
		case 'Back':
		case 'Forward':
			if (btn.isEnabled && btn.isEnabled()) {
				if (btn.id === 'Back') {
					playlistHistory.back();
				} else {
					playlistHistory.forward();
				}
			}
			break;
	}
}

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
	menu_down = false;
	return true;
}
// =================================================== //

function onMainMenu(x, y, name) {

	mainMenuOpen = true;
	menu_down = true;

	if (name) {
		var menu = new Menu(name);

		if (name === 'Help') {
			var statusMenu = new Menu('Georgia Theme Status');

			statusMenu.addItem('All fonts installed', fontsInstalled, undefined, true);
			statusMenu.addItem('Artist logos found', IsFile(paths.artistlogos + 'Metallica.png'), undefined, true);
			statusMenu.addItem('Record label logos found', IsFile(paths.labelsBase + 'Republic.png'), undefined, true);
			statusMenu.addItem('Flag images found', IsFile(paths.flagsBase + (is_4k ? '64\\' : '32\\') + 'United-States.png'), undefined, true);
			statusMenu.addItem('foo_enhanced_playcount installed', componentEnhancedPlaycount, function() { _.runCmd('https://www.foobar2000.org/components/view/foo_enhanced_playcount') });

			statusMenu.appendTo(menu);

			menu.addItem('Georgia releases', false, function() { _.runCmd('https://github.com/kbuffington/Georgia/releases') });
			menu.addItem('Georgia changelog', false, function() { _.runCmd('https://github.com/kbuffington/Georgia/blob/master/changelog.md') });
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
	if (transport.enableTransportControls) {
		btns.play.img = !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause;
		btns.play.repaint();
	}
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

		buttonTimer = setInterval(() => {

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
			for (let i = activatedBtns.length - 1; i >= 0; i--) {
				if ((!activatedBtns[i].hoverAlpha && !activatedBtns[i].downAlpha) ||
					activatedBtns[i].hoverAlpha === 255 || activatedBtns[i].downAlpha === 255) {
					activatedBtns.splice(i, 1);
				}
			}

			if (!activatedBtns.length) {
				clearInterval(buttonTimer);
				buttonTimer = null;
				trace && console.log("buttonTimerStarted = false");
			}

		}, buttonTimerDelay);

		trace && console.log("buttonTimerStarted = true");
	}
}
