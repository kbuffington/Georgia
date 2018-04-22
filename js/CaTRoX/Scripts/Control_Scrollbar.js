// ====================================== //
// @name "Scrollbar Control (14.06.2013)"
// @author "eXtremeHunter"
// ====================================== //

// SCROLLBAR
// SCROLLBARPARTS
SBP_ARROWBTN = 1;
SBP_THUMBBTNHORZ = 2;
SBP_THUMBBTNVERT = 3;
SBP_LOWERTRACKHORZ = 4;
SBP_UPPERTRACKHORZ = 5;
SBP_LOWERTRACKVERT = 6;
SBP_UPPERTRACKVERT = 7;
SBP_GRIPPERHORZ = 8;
SBP_GRIPPERVERT = 9;
SBP_SIZEBOX = 10;


// ARROWBTNSTATES
ABS_UPNORMAL = 1;
ABS_UPHOT = 2;
ABS_UPPRESSED = 3;
ABS_UPDISABLED = 4;
ABS_DOWNNORMAL = 5;
ABS_DOWNHOT = 6;
ABS_DOWNPRESSED = 7;
ABS_DOWNDISABLED = 8;
ABS_LEFTNORMAL = 9;
ABS_LEFTHOT = 10;
ABS_LEFTPRESSED = 11;
ABS_LEFTDISABLED = 12;
ABS_RIGHTNORMAL = 13;
ABS_RIGHTHOT = 14;
ABS_RIGHTPRESSED = 15;
ABS_RIGHTDISABLED = 16;
ABS_UPHOVER = 17;
ABS_DOWNHOVER = 18;
ABS_LEFTHOVER = 19;
ABS_RIGHTHOVER = 20;

// SCROLLBARSTYLESTATES
SCRBS_NORMAL = 1;
SCRBS_HOT = 2;
SCRBS_PRESSED = 3;
SCRBS_DISABLED = 4;
SCRBS_HOVER = 5;

var scrollbarClass = window.CreateThemeManager("SCROLLBAR");
var showScrollbar = window.GetProperty("Playlist: Show scrollbar", true);
var mouseInScrollbar = false;
var thumbDown = thumbDrag = false;
var thumbY;
var s = {};
var windowsVisualStyleEnabled = true;
var scrollbarUseWindowsVisualStyle = window.GetProperty("Playlist: Scrollbar use Windows style", false);
if (!scrollbarClass) {
    scrollbarUseWindowsVisualStyle = windowsVisualStyleEnabled = false;
}

var scrollbarTimerStarted = false;
var scrollbarTimer;
var scrollbarHoverAlpha = 0;
var pageBtnDown = false;
var listIsScrolledUp = false;
var listIsScrolledDown = false;
var needsScrollbar = false;

var scrollColorNormal = RGB(130, 132, 134);
var scrollColorHover = RGB(140, 142, 144);
var scrollColorHot = RGB(170, 172, 174);
var scrollColorPressed = RGB(90, 92, 94);
var scrollSymbolColorNormal = RGB(140, 142, 144);
var scrollSymbolColorHot = RGB(40, 42, 44);
var scrollSymbolColorHover = RGB(30, 32, 34);
var scrollSymbolColorPressed = RGB(30, 32, 34);
var scrollTrackColor = RGB(45, 45, 45); // must be without alpha channel when cleartype font is used



var scrollbarWidth = utils.GetSystemMetrics(2);

var scrollStep = window.GetProperty("Playlist: Scroll step", 3);
if (scrollStep < 1) {
    scrollStep = 1;
    window.SetProperty("Playlist: Scroll step", 1);
}
var scrollbarX = scrollbarY = scrollbarHeight = maxRows = 0;
var thisPanelName, scrollImg, scrollThumbImg;

// =================================================== //

function drawScrollbar(gr) {

    if (!listLength || !showScrollbar) return;

    gr.DrawImage(scrollImg.trackNormal, scrollbarX, scrollbarY, scrollbarWidth, scrollbarHeight, 0, 0, scrollbarWidth, 1, 0, 255);

    for (var i in s) {

        var x = s[i].x,
            y = s[i].y,
            w = s[i].w,
            h = s[i].h,
            state = s[i].state;
        hotAlpha = s[i].hoverAlpha;
        downAlpha = s[i].downAlpha;


        switch (i) {

        case "lineUp":

            gr.DrawImage(scrollImg.lineUpNormal, x, y, w, h, 0, 0, w, h, 0, 255);
            gr.DrawImage(scrollImg.lineUpHover, x, y, w, h, 0, 0, w, h, 0, scrollbarHoverAlpha);
            gr.DrawImage(scrollImg.lineUpHot, x, y, w, h, 0, 0, w, h, 0, hotAlpha);
            gr.DrawImage(scrollImg.lineUpPressed, x, y, w, h, 0, 0, w, h, 0, downAlpha);


            break;

        case "lineDown":

            gr.DrawImage(scrollImg.lineDownNormal, x, y, w, h, 0, 0, w, h, 0, 255);
            gr.DrawImage(scrollImg.lineDownHover, x, y, w, h, 0, 0, w, h, 0, scrollbarHoverAlpha);
            gr.DrawImage(scrollImg.lineDownHot, x, y, w, h, 0, 0, w, h, 0, hotAlpha);
            gr.DrawImage(scrollImg.lineDownPressed, x, y, w, h, 0, 0, w, h, 0, downAlpha);


            break;

        case "pageUp":

            if (state == 2) {

                var h = thumbY - thumbTrackY;

                gr.DrawImage(scrollImg.trackPressed, x, y, w, h, 0, 0, w, 1, 0, 255);

            }

            break;

        case "pageDown":

            if (state == 2) {

                var y = thumbY + thumbHeight;
                var h = (thumbTrackY + thumbTrackHeight) - (thumbY + thumbHeight);

                gr.DrawImage(scrollImg.trackPressed, x, y, w, h, 0, 0, w, 1, 0, 255);

            }

            break;

        case "thumb":
            var y = thumbY;
            gr.DrawImage(scrollThumbImg.Normal, x, y, w, h, 0, 0, w, h, 0, 255);
            gr.DrawImage(scrollThumbImg.Hot, x, y, w, h, 0, 0, w, h, 0, hotAlpha);
            gr.DrawImage(scrollThumbImg.Pressed, x, y, w, h, 0, 0, w, h, 0, scrollbarThumbDownAlpha);

            break

        }

    }

}
// =================================================== //
function createScrollbarImages() {

    if (scrollImg != undefined) return;

    var setPS = function (p, s) {

        scrollbarClass.SetPartAndStateId(p, s);
        return scrollbarClass;

    }

    var textRenderingHint = 5;
    var stringFormat = StringFormat(1, 2);
    scrollImg = {};
    var font = gdi.font("Segoe UI Symbol", 15, 0);
    var i, g;
    var m = 2;
    var w = scrollbarWidth;

    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_LOWERTRACKVERT, SCRBS_NORMAL).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w, scrollTrackColor);
    }

    i.ReleaseGraphics(g);

    scrollImg.trackNormal = i;

    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_LOWERTRACKVERT, SCRBS_PRESSED).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w, RGB(75, 80, 85));
    }
    i.ReleaseGraphics(g);
    scrollImg.trackPressed = i;

    //---> Up
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_UPNORMAL).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w - 1, scrollTrackColor);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString('\uE010', font, scrollSymbolColorNormal, 0, 0, w, w - 1, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineUpNormal = i;

    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_UPHOT).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w - 1, scrollColorHot);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString('\uE010', font, scrollSymbolColorHot, 0, 0, w, w - 1, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineUpHot = i;

    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_UPHOVER).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w - 1, scrollColorHover);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString('\uE010', font, scrollSymbolColorHover, 0, 0, w, w - 1, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineUpHover = i;

    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_UPPRESSED).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w - 1, scrollColorPressed);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString('\uE010', font, scrollSymbolColorPressed, 0, 0, w, w - 1, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineUpPressed = i;

    //---> Down
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_DOWNNORMAL).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 1, w - m * 2, w - 1, scrollTrackColor);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString('\uE011', font, scrollSymbolColorNormal, 0, 0, w, w, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineDownNormal = i;

    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_DOWNHOT).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 1, w - m * 2, w - 1, scrollColorHot);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString('\uE011', font, scrollSymbolColorHot, 0, 0, w, w, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineDownHot = i;

    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_DOWNHOVER).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 1, w - m * 2, w - 1, scrollColorHover);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString('\uE011', font, scrollSymbolColorHover, 0, 0, w, w, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineDownHover = i;

    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_DOWNPRESSED).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 1, w - m * 2, w - 1, scrollColorPressed);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString('\uE011', font, scrollSymbolColorPressed, 0, 0, w, w, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineDownPressed = i;

}
createScrollbarImages();	// initialize
// =================================================== //

function createScrollbarThumbImages() {

    var outRows = listLength - maxRows;

    var w = scrollbarWidth;
    var h = Math.max(scrollbarWidth, Math.min(scrollbarHeight, Math.ceil(scrollbarHeight - ((outRows + 1) * (window.Height / listLength)))));

    if(w <= 0 || h <= 0 || isNaN(h)) return;

    var setPS = function (p, s) {

        scrollbarClass.SetPartAndStateId(p, s);
        return scrollbarClass;

    }

    scrollThumbImg = {};

    var i, g;
    var m = 2;

    i = gdi.CreateImage(w, h);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_THUMBBTNVERT, SCRBS_NORMAL).DrawThemeBackground(g, 0, 0, w, h);
        (w != h) && setPS(SBP_GRIPPERVERT, SCRBS_NORMAL).DrawThemeBackground(g, 0, 0, w, h);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, h, scrollColorNormal);
    }
    i.ReleaseGraphics(g);
    scrollThumbImg.Normal = i;

    i = gdi.CreateImage(w, h);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_THUMBBTNVERT, SCRBS_HOT).DrawThemeBackground(g, 0, 0, w, h);
        (w != h) && setPS(SBP_GRIPPERVERT, SCRBS_HOT).DrawThemeBackground(g, 0, 0, w, h);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, h, scrollColorHot);
    }
    i.ReleaseGraphics(g);
    scrollThumbImg.Hot = i;

    i = gdi.CreateImage(w, h);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_THUMBBTNVERT, SCRBS_PRESSED).DrawThemeBackground(g, 0, 0, w, h);
        (w != h) && setPS(SBP_GRIPPERVERT, SCRBS_PRESSED).DrawThemeBackground(g, 0, 0, w, h);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, h, scrollColorPressed);
    }
    i.ReleaseGraphics(g);
    scrollThumbImg.Pressed = i;

}
// =================================================== //

function scrollbarAlphaTimer() {

    var turnTimerOff = false,
        hoverInStep = 50,
        hoverOutStep = 11,
        downInStep = 100,
        downOutStep = 50,
        timerDelay = 25,
        currentAlpha;

    if (!scrollbarTimerStarted) {

        scrollbarTimer = window.SetInterval(function () {

            for (var i in s) {

                switch (s[i].state) {

                case 0:

                    s[i].hoverAlpha = Math.max(0, s[i].hoverAlpha -= hoverOutStep);
                    s[i].downAlpha = Math.max(0, s[i].downAlpha -= Math.max(0, downOutStep));
                    s[i].repaint();

                    break;
                case 1:

                    s[i].hoverAlpha = Math.min(255, s[i].hoverAlpha += hoverInStep);
                    s[i].downAlpha = Math.max(0, s[i].downAlpha -= downOutStep);
                    s[i].repaint();

                    break;
                case 2:

                    s[i].downAlpha = Math.min(255, s[i].downAlpha += downInStep);
                    s[i].hoverAlpha = Math.max(0, s[i].hoverAlpha -= downInStep);
                    s[i].repaint();

                    break;

                }

            }

            if (mouseInScrollbar || thumbDown) scrollbarHoverAlpha = Math.min(255, scrollbarHoverAlpha += hoverInStep);
            else scrollbarHoverAlpha = Math.max(0, scrollbarHoverAlpha -= hoverOutStep);

            if (!thumbDown) {
                scrollbarThumbDownAlpha = Math.max(0, scrollbarThumbDownAlpha -= hoverOutStep);

            }

            //---> test alpha values and turn timer off when it's not required;

            var testAlpha = 0,
                currentAlphaIsFull = false,
                alphaIsZero = true;

            if (!mouseInScrollbar) currentAlpha = undefined;

            for (var i in s) {

                if ((s[i].hoverAlpha == 255 || (s[i].downAlpha == 255)) && (scrollbarHoverAlpha == 255)) {

                    currentAlpha = i;
                    currentAlphaIsFull = true;
                    continue;

                }

                if (currentAlpha && currentAlpha != i) {
                    alphaIsZero = ((testAlpha += (s[i].hoverAlpha + s[i].downAlpha + scrollbarThumbDownAlpha)) == 0);
                } else {
                    alphaIsZero = ((testAlpha += (s[i].hoverAlpha + s[i].downAlpha + scrollbarThumbDownAlpha + scrollbarHoverAlpha)) == 0);
                }

            }

            if (((!mouseInScrollbar && !currentAlphaIsFull) || currentAlphaIsFull) && alphaIsZero) {

                turnTimerOff = true;

            }

            if (turnTimerOff) {

                window.ClearInterval(scrollbarTimer);
                scrollbarTimerStarted = false;

            }

        }, timerDelay);

        scrollbarTimerStarted = true;

    }

}
// =================================================== //
var scrollbarThumbDownAlpha = thumbTrackHeight = thumbHeight = thumbTrackY = 0;

function controlScrollbar(x, y, w, h) {

	if (!displayPlaylist || listStep[activeList] == undefined) return;

	thumbTrackY = y + w;
	thumbTrackHeight = h - w * 2;

	outRows = listLength - maxRows;
	thumbHeight = Math.max(scrollbarWidth, Math.min(scrollbarHeight, Math.ceil(scrollbarHeight - ((outRows + 1) * (wh / listLength)))));

	needsScrollbar = (outRows > 0 && thumbHeight < thumbTrackHeight);

	if (needsScrollbar && showScrollbar) {

		if (!thumbDown) {
			pos = Math.floor(listStep[activeList] * (thumbTrackHeight - thumbHeight) / (listLength - maxRows)) + thumbTrackY;
			thumbY = Math.max(thumbTrackY, Math.min(thumbTrackY + thumbTrackHeight - thumbHeight, pos));
		}

		s = {

			lineUp: new ScrollbarPart(x, y, w, w),
			pageUp: new ScrollbarPart(x, thumbTrackY, w, thumbY - thumbTrackY),
			thumb: new ScrollbarPart(x, thumbY, w, thumbHeight),
			pageDown: new ScrollbarPart(x, thumbY + thumbHeight, w, (thumbTrackY + thumbTrackHeight) - (thumbY + thumbHeight)),
			lineDown: new ScrollbarPart(x, h + y - w, w, w)

		};

	}

	if (listIsScrolledUp || listIsScrolledDown) onScrollStep(0); // on_size check if still listIsScrolledUp || listIsScrolledDown
}
// =================================================== //
var oldPart;
var downPart, downPartKey;

function ScrollbarPart(x, y, w, h, onClick) {

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = 0;
    this.hoverAlpha = 0;
    this.downAlpha = 0;

}
// ====================================== //
ScrollbarPart.prototype.mouseInThisPart = function (x, y) {

    return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);

}
// ====================================== //
ScrollbarPart.prototype.repaint = function () {

    window.RepaintRect(this.x, this.y, this.w, this.h);

}
// ====================================== //
ScrollbarPart.prototype.changeState = function (state) {

    this.state = state;
    this.repaint();

    //this.state == 0 ? window.SetCursor(IDC_ARROW) : window.SetCursor(IDC_HAND);

    scrollbarAlphaTimer();

}
// ====================================== //

function scrollEvent(event) {

    switch (event) {

    case "lineUp":
        onScrollStep(1, 1);
        break;
    case "pageUp":
        onScrollStep(1, maxRows);
        break;
    case "pageDown":
        onScrollStep(-1, maxRows);
        break;
    case "lineDown":
        onScrollStep(-1, 1);
        break;
    case "dragUp":
        onScrollStep(1, 1);
        break;
    case "dragDown":
        onScrollStep(-1, 1);
        break;

    }

}
// ====================================== //

function startScrollRepeat(key) {

    if (!scrollStepRepeatTimerStarted) {

        scrollStepRepeatTimeout = window.SetTimeout(function () {

            scrollStepRepeatTimer = window.SetInterval(function () {

                if (!mouseInScrollbar && (!rowDrag && !fileDrag && !makeSelectionDrag)) return;

                if (key == "pageDown" || key == "pageUp") {

                    fastScrollActive = true;

                }

                if ((key == "pageDown") && (mouseY < thumbY + thumbHeight)) {
                    fastScrollActive = false;
                    return;
                } else if ((key == "pageUp") && (mouseY > thumbY)) {
                    fastScrollActive = false;
                    return;
                }

                scrollEvent(key);

                if (listIsScrolledUp || listIsScrolledDown) {
                    stopScrollRepeat();
                }

            }, 50);

        }, 350);

        scrollStepRepeatTimerStarted = true;

    }

}
// ====================================== //

function stopScrollRepeat() {

    if (thisPanelName == "Playlist" && listIsScrolledDown && (rowDrag || fileDrag) && !mouseOverList) {

        linkToLastItem = true;
        r[maxRows - 1].repaint();

    }

    refreshScrollbar();
    window.ClearTimeout(scrollStepRepeatTimeout);
    window.ClearTimeout(scrollStepRepeatTimer);
    scrollStepRepeatTimerStarted = false;
    scrollStepRepeatTimeout = scrollStepRepeatTimer = undefined;

}
// ====================================== //
var thumbTempY = 0;
var tempStep;
var scrollStepRepeatTimerStarted = false;
var scrollStepRepeatTimeout;
var scrollStepRepeatTimer;
var fastScrollActive = false;
var tempThumbY;
var currentPart;
var tempPos;
var mouseY = 0;
var doubleClicked2 = false;

function scrollbarMouseEventHandler(x, y) {
    if (!displayPlaylist) return;

    if (caller() == "on_mouse_wheel") {

        if (needsScrollbar && !showScrollbar) {

            if (utils.IsKeyPressed(VK_CONTROL)) {
                step = 1;
            } else if (utils.IsKeyPressed(VK_SHIFT)) {
                step = maxRows;
            } else {
                step = scrollStep;
            }

            onScrollStep(x, step);

        }
    }

    if (!needsScrollbar || !showScrollbar) return;

    var thisPart, thisKey;

    for (var i in s) {
        if (s[i].mouseInThisPart(x, y)) {
            thisPart = s[i];
            thisKey = i;
        }
    }

    switch (caller()) {

    case "on_mouse_move":

        mouseY = y;

        if (thisPart) {
            mouseInScrollbar = mouseInControl = true;
        } else {
            mouseInScrollbar = mouseInControl = false;
        }

        if (mouseInScrollbar && !downPart && !thumbDown && (thumbY != s["thumb"].y)) {

            refreshScrollbar();

        }

        if (!downPart) {
            if (oldPart && oldPart != thisPart) {
                oldPart.changeState(0);
            }
            if (thisPart && thisPart != oldPart) {
                thisPart.changeState(1);
            }
        }

        oldPart = thisPart;

        if ((thisPart == s.thumb) && !thumbDown) {
            thumbTempY = y - thumbY;
        }
        if (thumbDown) {

            thumbY = Math.max(thumbTrackY, Math.min(thumbTrackY + thumbTrackHeight - thumbHeight, y - thumbTempY));

            if (thumbY != s["thumb"].y) {
                thumbDrag = true;
            }

            if (thumbDrag) {

                scrollbarThumbDownAlpha = 255;

                repaintScrollbar();

                var step = Math.floor((thumbY - thumbTrackY) / ((thumbTrackHeight - thumbHeight) / (playlist.length - maxRows)));

                listStep[activeList] = step;

                if (tempStep != step) {

                    window.SetProperty("system.List Step", listStep.toString());
                    repaintList();

                }

                tempStep = step;

                if (!fastScrollActive) {

                    fastScrollActive = true;

                    scrollbarDragActiveTimer = window.SetInterval(function () {

                        if (tempThumbY == thumbY) {

                            window.ClearTimeout(scrollbarDragActiveTimer);
                            fastScrollActive = false;

                            listIsScrolledUp = (listStep[activeList] == 0);
                            listIsScrolledDown = ((playlist[maxRows - 1 + listStep[activeList]]) == playlist[listLength - 1]);

                            if (thisPanelName == "Playlist") getAlbumArt();

                        }

                        tempThumbY = thumbY;

                    }, 100);

                }

            }

        }

        break;
    case ("on_mouse_lbtn_dblclk"):
    case ("on_mouse_lbtn_down"):
        if (thisPart) {

            downPart = thisPart;
            downPartKey = thisKey;

            if (downPart != s.thumb) downPart.changeState(2);

            if (downPart == s.thumb) {
                thumbDown = true;
            }

        }

        if (downPartKey == "pageUp" || downPartKey == "pageDown") {

            fastScrollActive = true;

        }

        if (downPart && downPart != s.thumb) {

            startScrollRepeat(downPartKey);

            if (downPartKey == "pageUp" || downPartKey == "pageDown") {
                pageBtnDown = true;
            }

        }

        if (downPart) {

            if (!scrollStepRepeatTimer) {

                scrollEvent(downPartKey);

            }

        }

        break;

    case "on_mouse_lbtn_up":

		if (thumbDrag) {

			if (listStep[activeList] == 0) {

				thumbY = thumbTrackY;
				listIsScrolledUp = true;

			}

			tempStep = undefined;

		}

		if (downPart && thisPart != downPart) {
			downPart.changeState(0);
		} else if (downPart) {
			downPart.changeState(1);
		}

		if (scrollStepRepeatTimerStarted) {
			stopScrollRepeat();
		}

		if (downPartKey == "pageUp" || downPartKey == "pageDown") {
			fastScrollActive = false;
			//if (thisPanelName == "Playlist") getAlbumArt(); // don't think we need to call this here because it's called in onScrollStep

		}

		if (thumbDrag) {
			refreshScrollbar();
		}

		thumbDrag = thumbDown = pageBtnDown = false;
		downPart = downPartKey = undefined;

		break;
	case "on_mouse_rbtn_up":

		var cpm = window.CreatePopupMenu();

		if (utils.IsKeyPressed(VK_SHIFT)) {
			cpm.AppendMenuItem(safeMode ? MF_GRAYED : MF_STRING, 1, "Configure script...");
		}

		id = cpm.TrackPopupMenu(x, y);

		if (id == 1) {

			try {

				WshShell.Run("notepad.exe themes\\" + themeName + "\\Scripts\\Control_Scrollbar.js");

			} catch (e) {
				fb.trace(e)
			};

		}

		cpm.Dispose();
		return true;

		break;
    case "on_mouse_wheel":

        if (needsScrollbar && !downPart) {

            if (utils.IsKeyPressed(VK_CONTROL)) {
                step = 1;
            } else if (utils.IsKeyPressed(VK_SHIFT)) {
                step = maxRows;
            } else {
                step = scrollStep;
            }

            onScrollStep(x, step);

            if ((listIsScrolledUp && x == 1) || (listIsScrolledDown && x == -1)) return;
            refreshScrollbar();

        }
        break;

    case ("on_mouse_leave"):
        mouseInScrollbar = mouseInControl = false;

        if (!thumbDrag) {

            for (var i in s) {

                if (s[i].state != 0) {
                    s[i].changeState(0);
                }

            }

        }

        break;
    }

}
// =================================================== //
var getAlbumArtDelay = false;
var getAlbumArtTimer;

function onScrollStep(delta, scrollStep) {

	// are we at first or last page? if so, bail
	if ((listIsScrolledUp && delta == 1) || (listIsScrolledDown && delta == -1)) return;

	listIsScrolledUp = listIsScrolledDown = false;

	if (delta > 0 && listStep[activeList] > 0) {
		listStep[activeList] = Math.max(0, listStep[activeList] -= scrollStep);
	} else if (delta < 0 && (maxRows + listStep[activeList] < listLength)) {
		listStep[activeList] = Math.min(listLength - maxRows, listStep[activeList] += scrollStep);
	} else if (delta == "scrollToEnd") {
		listStep[activeList] = listLength - maxRows;
	}

	listIsScrolledUp = (listStep[activeList] == 0);
	listIsScrolledDown = ((playlist[maxRows - 1 + listStep[activeList]]) == playlist[listLength - 1]);
	if (listLength == maxRows) {
		listIsScrolledDown = true;
	}

	var pos = Math.floor(listStep[activeList] * (thumbTrackHeight - thumbHeight) / (listLength - maxRows)) + thumbTrackY;
	thumbY = Math.max(thumbTrackY, Math.min(thumbTrackY + thumbTrackHeight - thumbHeight, pos));

	repaintList();
	if (needsScrollbar) {
		repaintScrollbar();
	}

	window.SetProperty("system.List Step", listStep.toString());

	if ((thisPanelName == "Playlist") && !getAlbumArtDelay) {

		getAlbumArtDelay = true;

		getAlbumArtTimer = window.SetInterval(function () {

			window.ClearTimeout(getAlbumArtTimer);
			getAlbumArtDelay = false;
			getAlbumArt();

		}, 100);

	}

}
// =================================================== //

function on_selection_changed() {
    refreshScrollbar();
    refreshScrollbarStyle();
}
// =================================================== //

function refreshScrollbarStyle(style) {

    if (scrollbarUseWindowsVisualStyle != style) {
        scrollImg = undefined;
    }

    createScrollbarImages();
    createScrollbarThumbImages();
    repaintScrollbar();
}
// =================================================== //

function refreshScrollbar() {
    controlScrollbar(scrollbarX, scrollbarY, scrollbarWidth, scrollbarHeight);
}
// =================================================== //

function repaintScrollbar() {
    window.RepaintRect(scrollbarX, scrollbarY, scrollbarWidth, scrollbarHeight);
}