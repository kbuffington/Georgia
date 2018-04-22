// ====================================== //
// @name "Button Control (04.08.2013)"
// @author "eXtremeHunter"
// ====================================== //
var oldButton, downButton;
var buttonTimer = null;
var mainMenuOpen = false;

var tooltipTimeout = null;
var lastOverButton = null;

var activatedBtns = [];

function buttonEventHandler(x, y, m) {

	var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	var c = caller();

	var thisButton = null;

	for (var i in btns) {
		if (typeof btns[i] === 'object' && btns[i].mouseInThis(x, y)) {
			thisButton = btns[i];
			break;
		}
    }
	if (lastOverButton != thisButton)
		g_tooltip.Deactivate();
	lastOverButton = thisButton;

    switch (c) {

        case "on_mouse_move":
            if (downButton) return;

            if (oldButton && oldButton != thisButton) {
                oldButton.changeState(0);
            }
            if (thisButton && thisButton != oldButton) {
                thisButton.changeState(1);
            }

            if (lastOverButton != oldButton) {
                tooltipTimeout && window.ClearInterval(tooltipTimeout);
                tooltipTimeout = window.SetTimeout(function () {
                    displayTooltip();
                }, 750);
            }

            oldButton = thisButton;
            break;
        case ("on_mouse_lbtn_dblclk"):
            if (thisButton) {
                thisButton.changeState(2);
                downButton = thisButton;
                downButton.onDblClick();
            }
            break;
        case ("on_mouse_lbtn_down"):
            if (thisButton) {
                thisButton.changeState(2);
                downButton = thisButton;
            }

            break;

        case "on_mouse_lbtn_up":
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
        case ("on_mouse_leave"):
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

var g_tooltip = window.CreateTooltip();
g_tooltip.Text = "";	// was seeing stale tooltips when reloading the theme, having another window selected and mousing over the WSHPanel

function displayTooltip() {
	if (lastOverButton && lastOverButton.tooltip !== "" && g_tooltip.Text !== lastOverButton.tooltip) {
		g_tooltip.Text = lastOverButton.tooltip;
		g_tooltip.Activate();
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
	this.tooltip = typeof tip !== 'undefined' ? tip : "";
	this.img = img;
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

	var expXY = 2,
		expWH = expXY * 2;

	if (!displayPlaylist && (this.id == "NextBtn" || this.id == "PrevBtn")) {
		try {
			window.RepaintRect(this.x + (this.w - nextImg.width)/2 - expXY, this.y + ((this.h )/2) - expXY, nextImg.width + expWH, nextImg.height + expWH);
		} catch(e) {
			// probably redrawing during a size?
		}
	}
	else {
        window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);
    }
}
// =================================================== //
Button.prototype.changeState = function (state) {

	if (!displayPlaylist || (this.id != "NextBtn" && this.id != "PrevBtn")) {
		this.state = state;
		activatedBtns.push(this);
		buttonAlphaTimer();
	}

}
// =================================================== //
Button.prototype.onClick = function () {

	switch (this.id) {

	case "Stop":
		fb.Stop();
		break;
	case "Previous":
		fb.Prev();
		break;
	case "Play/Pause":
		fb.PlayOrPause();
		break;
	case "Next":
		fb.Next();
		break;
	case "Playback/Random":
		fb.RunMainMenuCommand("Playback/Random");
		break;
	case "Reload":
		window.Reload();
		break;
	case "Console":
		fb.RunMainMenuCommand("View/Console");
		break;
	case "OpenExplorer":
		if (!safeMode) {
			try {
				WshShell.Run("explorer.exe /e,::{20D04FE0-3AEA-1069-A2D8-08002B30309D}");
			} catch (e) {
				fb.trace(e)
			};
		}
		break;
	case "Minimize":
		fb.RunMainMenuCommand("View/Hide");
		break;
	case "Maximize":
		try {
			if (maximizeToFullScreen ? !utils.IsKeyPressed(VK_CONTROL) : utils.IsKeyPressed(VK_CONTROL)) {
				UIHacks.FullScreen = !UIHacks.FullScreen;
			} else {
				if (UIHacks.MainWindowState == WindowState.Maximized) UIHacks.MainWindowState = WindowState.Normal;
				else UIHacks.MainWindowState = WindowState.Maximized;
			}
		} catch (e) {
			fb.trace(e + " Disable WSH safe mode")
		}
		break;
	case "Close":
		fb.Exit();
		break;
	case "File":
	case "Edit":
	case "View":
	case "Playback":
	case "Library":
	case "Help":
		onMainMenu(this.x, this.y + this.h, this.id);
		break;
	case "Playlists":
		onPlaylistsMenu(this.x, this.y + this.h);
		break;
	case "Options":
		onSettingsMenu(this.x, this.y + this.h);
		break;
	case "Repeat":
		var pbo = fb.PlaybackOrder;
		if (pbo == playbackOrder.Default) fb.PlaybackOrder = playbackOrder.RepeatPlaylist;
		else if (pbo == playbackOrder.RepeatPlaylist) fb.PlaybackOrder = playbackOrder.RepeatTrack;
		else if (pbo == playbackOrder.RepeatTrack) fb.PlaybackOrder = playbackOrder.Default;
		else fb.PlaybackOrder = playbackOrder.RepeatPlaylist;
		break;
	case "Shuffle":
		var pbo = fb.PlaybackOrder;
		if (pbo != playbackOrder.ShuffleTracks) fb.PlaybackOrder = playbackOrder.ShuffleTracks;
		else fb.PlaybackOrder = playbackOrder.Default;
		break;
	case "Mute":
		fb.VolumeMute();
		break;
	case "Front":
		coverSwitch(0);
		break;
	case "Back":
		coverSwitch(1);
		break;
	case "CD":
		coverSwitch(2);
		break;
	case "Artist":
		coverSwitch(3);
		break;
	case "Settings":
		fb.ShowPreferences();
		break;
	case "Properties":
		fb.RunContextCommand("Properties");
		break;
	case "Rating":
		onRatingMenu(this.x, this.y + this.h);
		break;
	case "Lyrics":
		displayLyrics = !displayLyrics;
		if ((fb.IsPlaying || fb.IsPaused) && albumart_scaled) {
			if (displayLyrics) {
				refresh_lyrics();
			}
			window.RepaintRect(albumart_size.x-1, albumart_size.y-1, albumart_scaled.width+2, albumart_scaled.height+2);
		}
		break;
	case "Playlist":
		// we appear to be getting album art way too frequently here -- delete this comment and others when verified this is cool
		displayPlaylist = !displayPlaylist;
		if (displayPlaylist) {
			playlist.on_size(ww, wh);
		} else {
			// on_playback_new_track(fb.GetNowPlaying());
		}
		ResizeArtwork(false);
		window.Repaint();
		break;
	}

}
// =================================================== //

Button.prototype.onDblClick = function () {

	switch (this.id) {

		case "PrevBtn":
			fb.Prev();
			break;
		case "NextBtn":
			fb.Next();
			break;
	}
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
		lists.AppendMenuItem(MF_STRING, playlistId + i, plman.GetPlaylistName(i).replace(/\&/g, "&&") + " [" + plman.PlaylistItemCount(i) + "]" + (plman.IsAutoPlaylist(i) ? " (Auto)" : "") + (i == plman.PlayingPlaylist ? " (Now Playing)" : ""));
	}

	var id = lists.TrackPopupMenu(x, y);

	switch (id) {
		case 1:
			fb.RunMainMenuCommand("View/Playlist Manager");
			break;
		case 2:
			plman.CreatePlaylist(playlistCount, "");
			plman.ActivePlaylist = plman.PlaylistCount;
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

	var menuManager = fb.CreateMainMenuManager();

	var menu = window.CreatePopupMenu();
	var ret;

	if (name) {

		menuManager.Init(name);
		menuManager.BuildMenu(menu, 1, 128);

		ret = menu.TrackPopupMenu(x, y);

		if (ret > 0) {
			menuManager.ExecuteByID(ret - 1);
		}
	}

	menuManager.Dispose();
	menu.Dispose();
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

	var turnButtonTimerOff = false,
		buttonHoverInStep = 40,
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
				if ((!activatedBtns[i].hoverAlpha && !activatedBtns.downAlpha) ||
					activatedBtns[i].hoverAlpha === 255 || activatedBtns[i].downAlpha === 255) {
					activatedBtns.splice(i, 1);
				}
			}

			if (!activatedBtns.length) {
				window.ClearInterval(buttonTimer);
				buttonTimer = null;
				trace && console.log("buttonTimerStarted = true");
			}

		}, buttonTimerDelay);

		trace && console.log("buttonTimerStarted = false");
	}
}