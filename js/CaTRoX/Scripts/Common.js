// ====================================== //
// @name "Common (31.07.2013)"
// @author "eXtremeHunter"
// ====================================== //
//--->
//---> Common Helpers, Flags
//--->
// var themeName = "CaTRoX";
// var themeVersion = "";

// ================================================================================= //
var safeMode = uiHacks = false;
var UIHacks;
try {
    WshShell = new ActiveXObject("WScript.Shell");
} catch (e) {
    fb.trace("----------------------------------------------------------------------");
    fb.trace(e + "\nFix: Disable safe mode in Preferences > Tools > WSH Panel Mod");
    fb.trace("----------------------------------------------------------------------");
    safeMode = true;
}

if (!safeMode) {
    uiHacks = utils.CheckComponent("foo_ui_hacks");
    if (uiHacks) {
        UIHacks = new ActiveXObject("UIHacks");
    }
}
var panelsBackColor = RGB(35, 35, 35);
var panelsLineColor = RGB(55, 55, 55);
var panelsLineColorSelected = RGB(65, 65, 65);
var panelsNormalTextColor = RGB(125, 127, 129);
// ================================================================================= //
//--->

function print(msg) {
    fb.trace("---> " + msg);
}
//--->

function caller() {
    var caller = /^function\s+([^(]+)/.exec(arguments.callee.caller.caller);
    if (caller) return caller[1];
    else return 0;
}
//--->

function $(field, metadb) {
	metadb = metadb || false;
	var tf;
	try {
		if (metadb) {
			tf = fb.TitleFormat(field).EvalWithMetadb(metadb);
		} else {
			tf = fb.TitleFormat(field).Eval();
		}
	} catch (e) {
		tf = e + " (Invalid metadb!)"
	};
	return tf;
}
//--->

function timeFormat(s) {

    var weeks = Math.floor(s / 604800),
        days = Math.floor(s % 604800 / 86400),
        hours = Math.floor((s % 86400) / 3600),
        minutes = Math.floor(((s % 86400) % 3600) / 60),
        seconds = Math.round((((s % 86400) % 3600) % 60)),
        weeks = weeks > 0 ? weeks + "wk " : "",
        days = days > 0 ? days + "d " : "",
        hours = hours > 0 ? hours + ":" : "",
        seconds = seconds < 10 ? "0" + seconds : seconds;

    ((caller() == "sliderEventHandler" || (caller() == 'calculateDiscLength' && hours == "")) ? minutes = minutes + ":" : minutes = (minutes < 10 ? "0" + minutes : minutes) + ":");

    return weeks + days + hours + minutes + seconds;

}
//--->
(function () {

    var _ww,
        _resizeTimerStarted;

    isResizingDone = function (ww, wh) {

        if (!_resizeTimerStarted) {

            _resizeTimerStarted = true;
            resizingIsDone = false;

            resizeTimer = window.SetInterval(function () {

                if (_ww == window.Width) {

                    resizeDone();
                    resizingIsDone = true;
                    _resizeTimerStarted = false;
                    window.ClearInterval(resizeTimer);

                }

            }, 150);

        }
        _ww = ww;
    }
})();
//--->

function RGBA(r, g, b, a) {
    return ((a << 24) | (r << 16) | (g << 8) | (b));
}
//--->

function RGB(r, g, b) {
    return (0xff000000 | (r << 16) | (g << 8) | (b));
}
//--->

function StringFormat() {
    var h_align = 0,
        v_align = 0,
        trimming = 0,
        flags = 0;
    switch (arguments.length) {
        // fall-thru
    case 4:
        flags = arguments[3];
    case 3:
        trimming = arguments[2];
    case 2:
        v_align = arguments[1];
    case 1:
        h_align = arguments[0];
        break;
    default:
        return 0;
    }
    return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
}
//--->

function numericAscending(a, b) {

    return (a - b);

}
//--->

function numericDescending(a, b) {

    return (b - a);

}

var ONE_DAY = 86400000; // day in ms

//--->
VK_CONTROL = 0x11;
VK_SHIFT = 0x10;
VK_PAUSE = 0x13;
VK_ESCAPE = 0x1B;
VK_SPACE = 0x20;
VK_DELETE = 0x2E;
VK_PRIOR = 0x21; // PAGE UP key
VK_NEXT = 0x22; // PAGE DOWN key
VK_END = 0x23;
VK_HOME = 0x24
VK_LEFT = 0x25
VK_UP = 0x26;
VK_RIGHT = 0x27;
VK_DOWN = 0x28;
VK_RETURN = 0x0D //Enter
VK_LSHIFT = 0xA0; // Left SHIFT key
VK_RSHIFT = 0xA1; // Right SHIFT key
VK_LCONTROL = 0xA2 // Left CONTROL key
VK_RCONTROL = 0xA3 // Right CONTROL key
VK_LMENU = 0xA4 // Left MENU key (Left Alt)
VK_RMENU = 0xA5 // Right MENU key (Right Alt)
VK_KEY_0 = 0x30 //	0
VK_KEY_1 = 0x31 //	1
VK_KEY_2 = 0x32 //	2
VK_KEY_3 = 0x33 //	3
VK_KEY_4 = 0x34 //	4
VK_KEY_5 = 0x35 //	5
VK_KEY_6 = 0x36 //	6
VK_KEY_7 = 0x37 //	7
VK_KEY_8 = 0x38 //	8
VK_KEY_9 = 0x39 //	9
VK_KEY_A = 0x41 //	A
VK_KEY_B = 0x42 //	B
VK_KEY_C = 0x43 //	C
VK_KEY_D = 0x44 //	D
VK_KEY_E = 0x45 //	E
VK_KEY_F = 0x46 //	F
VK_KEY_G = 0x47 //	G
VK_KEY_H = 0x48 //	H
VK_KEY_I = 0x49 //	I
VK_KEY_J = 0x4A //	J
VK_KEY_K = 0x4B //	K
VK_KEY_L = 0x4C //	L
VK_KEY_M = 0x4D //	M
VK_KEY_N = 0x4E //	N
VK_KEY_O = 0x4F //	O
VK_KEY_P = 0x50 //	P
VK_KEY_Q = 0x51 //	Q
VK_KEY_R = 0x52 //	R
VK_KEY_S = 0x53 //	S
VK_KEY_T = 0x54 //	T
VK_KEY_U = 0x55 //	U
VK_KEY_V = 0x56 //	V
VK_KEY_W = 0x57 //	W
VK_KEY_X = 0x58 //	X
VK_KEY_Y = 0x59 //	Y
VK_KEY_Z = 0x5A //	Z
//--->
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
//--->
// Used in AppendMenuItem()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx
MF_SEPARATOR = 0x00000800;
MF_ENABLED = 0x00000000;
MF_GRAYED = 0x00000001;
MF_DISABLED = 0x00000002;
MF_UNCHECKED = 0x00000000;
MF_CHECKED = 0x00000008;
MF_STRING = 0x00000000;
MF_POPUP = 0x00000010;
MF_MENUBARBREAK = 0x00000020;
MF_MENUBREAK = 0x00000040;
//--->
// Used in window.SetCursor()
IDC_ARROW = 32512;
IDC_IBEAM = 32513;
IDC_WAIT = 32514;
IDC_CROSS = 32515;
IDC_UPARROW = 32516;
IDC_SIZE = 32640;
IDC_ICON = 32641;
IDC_SIZENWSE = 32642;
IDC_SIZENESW = 32643;
IDC_SIZEWE = 32644;
IDC_SIZENS = 32645;
IDC_SIZEALL = 32646;
IDC_NO = 32648;
IDC_APPSTARTING = 32650;
IDC_HAND = 32649;
IDC_HELP = 32651;
//--->
// Used in utils.Glob()
// For more information, see: http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx
FILE_ATTRIBUTE_READONLY = 0x00000001;
FILE_ATTRIBUTE_HIDDEN = 0x00000002;
FILE_ATTRIBUTE_SYSTEM = 0x00000004;
FILE_ATTRIBUTE_DIRECTORY = 0x00000010;
FILE_ATTRIBUTE_ARCHIVE = 0x00000020;
//FILE_ATTRIBUTE_DEVICE            = 0x00000040; // do not use
FILE_ATTRIBUTE_NORMAL = 0x00000080;
FILE_ATTRIBUTE_TEMPORARY = 0x00000100;
FILE_ATTRIBUTE_SPARSE_FILE = 0x00000200;
FILE_ATTRIBUTE_REPARSE_POINT = 0x00000400;
FILE_ATTRIBUTE_COMPRESSED = 0x00000800;
FILE_ATTRIBUTE_OFFLINE = 0x00001000;
FILE_ATTRIBUTE_NOT_CONTENT_INDEXED = 0x00002000;
FILE_ATTRIBUTE_ENCRYPTED = 0x00004000;
//FILE_ATTRIBUTE_VIRTUAL           = 0x00010000; // do not use
//--->
// With window.DlgCode, can be combined.
// If you don't know what they mean, igonre them.
DLGC_WANTARROWS = 0x0001; /* Control wants arrow keys         */
DLGC_WANTTAB = 0x0002; /* Control wants tab keys           */
DLGC_WANTALLKEYS = 0x0004; /* Control wants all keys           */
DLGC_WANTMESSAGE = 0x0004; /* Pass message to control          */
DLGC_HASSETSEL = 0x0008; /* Understands EM_SETSEL message    */
DLGC_DEFPUSHBUTTON = 0x0010; /* Default pushbutton               */
DLGC_UNDEFPUSHBUTTON = 0x0020; /* Non-default pushbutton           */
DLGC_RADIOBUTTON = 0x0040; /* Radio button                     */
DLGC_WANTCHARS = 0x0080; /* Want WM_CHAR messages            */
DLGC_STATIC = 0x0100; /* Static item: don't include       */
DLGC_BUTTON = 0x2000; /* Button item: can be checked      */
//--->
// Used in IFbTooltip.GetDelayTime() and IFbTooltip.SetDelayTime()
// For more information, see: http://msdn.microsoft.com/en-us/library/bb760404(VS.85).aspx
TTDT_AUTOMATIC = 0;
TTDT_RESHOW = 1;
TTDT_AUTOPOP = 2;
TTDT_INITIAL = 3;
//--->
// Used in gdi.Font(), can be combined
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534124(VS.85).aspx
FontStyle = {
    Regular: 0,
    Bold: 1,
    Italic: 2,
    BoldItalic: 3,
    Underline: 4,
    Strikeout: 8
};
//--->
// Used in SetTextRenderingHint()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534404(VS.85).aspx
TextRenderingHint = {
    SystemDefault: 0,
    SingleBitPerPixelGridFit: 1,
    SingleBitPerPixel: 2,
    AntiAliasGridFit: 3,
    AntiAlias: 4,
    ClearTypeGridFit: 5
};
//--->
// Used in SetSmoothingMode()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534173(VS.85).aspx
SmoothingMode = {
    Invalid: -1,
    Default: 0,
    HighSpeed: 1,
    HighQuality: 2,
    None: 3,
    AntiAlias: 4
};
//--->
// Used in SetInterpolationMode()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534141(VS.85).aspx
InterpolationMode = {
    Invalid: -1,
    Default: 0,
    LowQuality: 1,
    HighQuality: 2,
    Bilinear: 3,
    Bicubic: 4,
    NearestNeighbor: 5,
    HighQualityBilinear: 6,
    HighQualityBicubic: 7
};
//--->
StringTrimming = {
    None: 0,
    Character: 1,
    Word: 2,
    EllipsisCharacter: 3,
    EllipsisWord: 4,
    EllipsisPath: 5
};
//--->
playbackOrder = {
    Default: 0,
    RepeatPlaylist: 1,
    RepeatTrack: 2,
    Random: 3,
    ShuffleTracks: 4,
    ShuffleAlbums: 5,
    ShuffleFolders: 6
};
//--->
Guifx = {
	Play: 1,
	Pause: 2,
	Stop: 3,
	Record: 4,
	Rewind: 5,
	FastForward: 6,
	Previous: 7,
	Next: 8,
	Replay: 9,
	Refresh: 0,
	Mute: "!",
	Mute2: "@",
	VolumeDown: "#",
	VolumeUp: "$",
	ThumbsDown: "%",
	ThumbsUp: "^",
	Shuffle: "\&",
	Repeat: "*",
	Repeat1: "(",
	Zoom: ")",
	ZoomOut: "_",
	ZoomIn: "+",
	Minus: "-",
	Plus: "=",
	Up: "W",
	Down: "S",
	Left: "A",
	Right: "D",
	Up2: "w",
	Down2: "s",
	Left2: "a",
	Right2: "d",
	Start: "{",
	End: "}",
	Top: "?",
	Bottom: "/",
	JumpBackward: "[",
	JumpForward: "]",
	SlowBackward: ":",
	SlowForward: "\"",
	Eject: "\'",
	Reject: ";",
	Up3: ".",
	Down3: ",",
	Left3: "<",
	Right: ">",
	Guifx: "g",
	ScreenUp: "|",
	ScreenDown: "\\",
	Power: "q",
	Checkmark: "z",
	Close: "x",
	Hourglass: "c",
	Heart: "v",
	Star: "b",
	Fire: "i",
	Medical: "o",
	Police: "p"

}
//--->

VK_PGUP = 0x21;	// VK_PRIOR
VK_PGDN = 0x22; // VK_NEXT

Material = {
	Play: '\ue037',
	Pause: '\ue034',
	Stop: '\ue047'
}

function link(site, metadb) {

    if (!metadb) return;

    var meta_info = metadb.GetFileInfo();
    var artist = meta_info.MetaValue(meta_info.MetaFind("artist"), 0).replace(/\s+/g, "+").replace(/\&/g, "%26");
    var album = meta_info.MetaValue(meta_info.MetaFind("album"), 0).replace(/\s+/g, "+");


    switch (site) {

    case "google":
        site = (artist ? "http://images.google.com/search?q=" + artist + "&ie=utf-8" : null);
        break;
    case "googleImages":
        site = (artist ? "http://images.google.com/images?hl=en&q=" + artist + "&ie=utf-8" : null);
        break;
    case "eCover":
        site = (artist || album ? "http:ecover.to/?Module=ExtendedSearch&SearchString=" + artist + "+" + album + "&ie=utf-8" : null);
        break;
    case "wikipedia":
        site = (artist ? "http://en.wikipedia.org/wiki/" + artist.replace(/\+/g, "_") : null);
        break;
    case "youTube":
        site = (artist ? "http://www.youtube.com/results?search_type=&search_query=" + artist + "&ie=utf-8" : null);
        break;
    case "lastFM":
        site = (artist ? "http://www.last.fm/music/" + artist.replace("/", "%252F") : null);
        break;
    case "discogs":
        site = (artist || album ? "http://www.discogs.com/search?q=" + artist + "+" + album + "&ie=utf-8" : null);
        break;
    default:
        site = undefined;
    }

    if (!site || safeMode) return;

    try {
        WshShell.run(site);
    } catch (e) {
        fb.trace(e)
    };

}

// UIHacks stuff
var FrameStyle = {
    Default: 0,
    SmallCaption: 1,
    NoCaption: 2,
    NoBorder: 3
}
