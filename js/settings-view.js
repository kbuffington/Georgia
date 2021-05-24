// Globals needed by this view
let controlList = [];
/** @type {TextBoxControl} */
let activeControl = undefined;
/** @type {TextBoxControl} */
let hoveredControl = undefined; // should i do something with this?

// crap that can be stripped out once integrated into main theme
ft = {};
function on_init() {
    const labelFont = 'HelveticaNeueLT Pro 55 Roman';
    const textFont = 'HelveticaNeueLT Pro 65 Md';
    function font(name, size, style) {
		var font;
		try {
			font = gdi.Font(name, Math.round(scaleForDisplay(size)), style);
		} catch (e) {
			console.log('Failed to load font >>>', name, size, style);
		}
		return font;
	}

    ft.label = font(labelFont, 26, 0);
    ft.value = font(textFont, 26, 0);
    initSettingsView();
    window.Repaint();
}

// callbacks

/**
 * @param {GdiGraphics} gr
 */
function on_paint(gr) {
    drawSettingsView(gr);
}

state = {};
function on_mouse_move(x, y) {
    if (x != state.mouse_x || y != state.mouse_y) {
		state.mouse_x = x;
		state.mouse_y = y;

        let control;
        for (let i in controlList) {
            if (controlList[i].mouseInThis(x, y)) {
                control = controlList[i];
                break;
            }
        }
    }
}

function on_mouse_lbtn_up(x, y, m) {
    let found = false;
    for (let i in controlList) {
        if (controlList[i].mouseInThis(x, y)) {
            if (activeControl) activeControl.focus = false;
            activeControl = controlList[i];
            activeControl.clicked(x, y);
            found = true;
            break;
        }
    }
    if (!found) {
        activeControl.focus = false;
        activeControl = undefined;
    }
}

function on_mouse_wheel(delta) {
}

function on_char(code) {
    if (activeControl) {
        activeControl.onChar(code);
    }
}

function on_key_down(vkey) {
    if (activeControl) {
        activeControl.onKey(vkey);
    }
}


// Methods
function drawSettingsView(gr) {
    gr.FillSolidRect(0, 0, window.Width, window.Height, rgb(220,222,224));
    controlList.forEach(c => c.draw(gr));
}

const ControlType = {
    TextBox: 1,
    Toggle: 2,
    ColorPicker: 3,
    DropDown: 4,
};

function initSettingsView() {
    const test = new TextBoxControl('Text Input:', '', 20, 60, 150, 400, ft.value);
    controlList.push(test);
}

function calcTextHeight(font) {
    const img = gdi.CreateImage(100, 100);
    const g = img.GetGraphics();

    const measurements = g.MeasureString('ABC', font, 0, 0, 0, 0);
    return measurements.Height;
}

// Classes
class BaseControl {
    constructor(x, y, label) {
        /** @protected */ this.x = x;
        /** @protected */ this.y = y;
        this.focus = false;
        this.hovered = false;
        /** @protected @private */ this.i = gdi.CreateImage(1, 1);
        /** @protected */ this.g = this.i.GetGraphics();   // GdiBitmap used for MeasureString and other functions
    }

    destructor() {
        this.i.ReleaseGraphics(this.g);
    }
}

class TextBoxControl extends BaseControl {
    constructor(label, value, x, y, labelWidth, inputWidth, font) {
        super(x, y, label);
        /** @private */ this.labelW = labelWidth;
        /** @private */ this.inputX = this.x + this.labelW;
        /** @private */ this.padding = scaleForDisplay(3);
        /** @private */ this.inputW = inputWidth - this.padding * 2;    // subtract out padding
        /** @private */ this.font = font;
        /** @private */ this.h = calcTextHeight(font);
        /** @private */ this.label = label;
        /** @private */ this.value = value;
        /** @private */ this.lineThickness = scaleForDisplay(1);
        /** @constant @private */ this.cursorRefreshInterval = 350; // ms
        /** @private */ this.timerId = undefined;
        /** @private */ this.showCursor = false;
        /** @private */ this.selEnd = -1;
        /** @private */ this.selAnchor = -1;
        /** @private */ this.cursorPos = 0;
        /** @private */ this.offsetChars = 0; // number of chars that are not visible in the textbox (scrolled to the left)
    }

    /**
     * Is a selection active on the text control
     * @returns {boolean}
     */
    get hasSelection() {
        return this.selAnchor !== -1;
    }

    /**
     * @param {GdiGraphics} gr
     */
    draw(gr) {
        gr.GdiDrawText(this.label, ft.label, rgb(0,0,0), this.x, this.y, this.labelW, this.h);
        gr.FillSolidRect(this.inputX, this.y - this.padding, this.inputW + 2 * this.padding, this.h + this.padding * 2, rgb(255,255,255));
        gr.DrawRect(this.inputX, this.y - this.padding, this.inputW + 2 * this.padding, this.h + this.padding * 2, this.lineThickness, rgb(0,0,0));
        if (this.hasSelection) {
            let start = this.inputX + this.padding + this.getCursorX(this.selAnchor);
            let end = this.inputX + this.padding + this.getCursorX(this.selEnd);
            if (start > end) {
                const tmp = start; start = end; end = tmp;
            }
            gr.FillSolidRect(start, this.y, end - start, this.h, rgb(128,128,255));
        }
        gr.GdiDrawText(this.value, ft.value, rgb(0,0,0), this.inputX + this.padding, this.y, this.inputW, this.h, DrawTextFlags.left);
        if (this.showCursor) {
            const cursorPos = this.inputX + this.padding + this.getCursorX(this.cursorPos);
            gr.DrawLine(cursorPos, this.y, cursorPos, this.y + this.h, this.lineThickness, rgb(32,32,132));
        }
    }

    /**
     * Given an index into the value string returns the x-position, used to determine where to draw the cursor
     * @private
     * @param {*} index
     * @returns {number} x-position of the cursor at that index
     */
    getCursorX(index) {
        let x = 0;
        if (index >= this.offsetChars) {
            x = this.g.CalcTextWidth(this.value.substr(this.offsetChars, index - this.offsetChars), ft.value);
        }
        return x;
    }

    /**
     * Given an x mouse position returns an index into the value string
     * @private
     * @param {number} x mouse position on x-axis
     * @returns {number} Index into the value text. 0 is before the first character, value.length is after the last character
     */
    getCursorIndex(x) {
        const inputX = x - this.inputX; // x-position inside control
        let pos = this.padding;
        for (let i = this.offsetChars; i < this.value.length; i++) {
            const charWidth = this.g.CalcTextWidth(this.value.substr(i, 1), ft.value);
            if (Math.round(pos + (charWidth / 2)) >= inputX) {
                return i;
            }
            pos += charWidth;
        }
        return this.value.length;
    }

    mouseInThis(x, y) {
        return x >= this.inputX && x <= this.inputX + this.inputW && y >= this.y - this.padding && y <= this.y + this.h + this.padding;
    }

    /**
     * Turns the cursor on and off and repaints the control
     * @private
     * @param {boolean=} showImmediate
     */
    flashCursor(showImmediate) {
        clearTimeout(this.timerId);
        this.showCursor = showImmediate ? true : !this.showCursor;
        this.repaint();
        this.timerId = setTimeout(() => {
            this.flashCursor();
        }, this.cursorRefreshInterval);
    }

    clicked(x, y) {
        if (!this.mouseInThis(x, y)) return;
        this.focus = true;
        this.cursorPos = this.getCursorIndex(x);
        this.flashCursor(true);
    }

    repaint() {
        window.RepaintRect(this.x, this.y - this.padding, this.x + this.labelW + this.inputW + this.padding * 2, this.h * this.padding * 2);
    }

    /**
     * Makes sure index is within the range of 0 - value.length
     * @private
     * @param {number} index
     * @returns {number} clamped value
     */
    strClamp(index) {
        return Math.min(Math.max(index, 0), this.value.length);
    }

    onKey(vkey) {
        const CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
        const ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
        switch (vkey) {
            case VK_LEFT:
            case VK_RIGHT:
                const dir = vkey === VK_LEFT ? -1 : 1;
                if (ShiftKeyPressed) {
                    if (this.hasSelection) { // expand or contract selection
                        this.selEnd = this.strClamp(this.selEnd + dir);
                    } else {    // start a selection
                        this.selAnchor = this.cursorPos;
                        this.selEnd = this.strClamp(this.cursorPos + dir);
                    }
                    this.cursorPos = this.strClamp(this.cursorPos + dir);
                } else {
                    if (this.hasSelection) {
                        if ((this.selAnchor > this.selEnd && dir === 1) ||
                            (this.selAnchor < this.selEnd && dir === -1)) {
                            this.cursorPos = this.selAnchor;
                        }
                        this.selAnchor = -1;
                    } else {
                        this.cursorPos = this.strClamp(this.cursorPos + dir);
                    }
                }
                break;
            case VK_UP:
            case VK_DOWN:
            case VK_HOME:
            case VK_END:
                const home = (vkey === VK_UP || vkey === VK_HOME) ? true : false;
                if (ShiftKeyPressed) {
                    if (!this.hasSelection) {
                        this.selAnchor = this.cursorPos;
                    }
                    this.selEnd = home ? 0 : this.value.length
                } else {
                    this.selAnchor = -1;
                }
                this.cursorPos = home ? 0 : this.value.length;
                break;
            case VK_DELETE:
                this.onChar(VK_DELETE);
                break;
        }
        this.flashCursor(true);
    }

    onChar(code) {
        console.log(code);
        let clearSelection = true;
        let text = String.fromCharCode(code);
        let start = this.hasSelection ? Math.min(this.cursorPos, this.selAnchor) : this.cursorPos;
        let end = this.hasSelection ?  Math.max(this.cursorPos, this.selAnchor) : this.cursorPos;

        switch (code) {
            case VK_BACKSPACE:
                if (this.hasSelection) {
                    this.value = this.value.substring(0, start) + this.value.substring(end);
                    this.cursorPos = start;
                } else {
                    this.value = this.value.substring(0, Math.max(0, start - 1)) + this.value.substring(end);
                    this.cursorPos = Math.max(0, start - 1);
                }
                break;
            case VK_CUT:
                if (!this.hasSelection) return;
                doc.parentWindow.clipboardData.setData('text', this.value.substring(start, end));
                // fall through
            case VK_DELETE:
                if (this.hasSelection) {
                    this.value = this.value.substring(0, start) + this.value.substring(end);
                    this.cursorPos = start;
                } else {
                    this.value = this.value.substring(0, start) + this.value.substring(Math.min(end + 1, this.value.length));
                }
                break;
            case VK_SELECT_ALL:
                this.selAnchor = 0; this.cursorPos = this.selEnd = this.value.length;
                clearSelection = false;
                break;
            case VK_COPY:
                if (this.hasSelection) {
                    doc.parentWindow.clipboardData.setData('text', this.value.substring(start, end));
                }
                clearSelection = false;
                break;
            case VK_PASTE:
                text = doc.parentWindow.clipboardData.getData('text');
                // fall through
            default:
                this.value = this.value.substring(0, start) + text + this.value.substring(end);
                this.cursorPos = start + text.length;
        }
        if (clearSelection) this.selAnchor = -1;    // always want to clear selection

        // const textWidth = this.g.CalcTextWidth(this.value, this.font);
        // if (textWidth > this.inputW) {
        //     this.offsetChars = textWidth - this.inputW; // make this positive so we can subtract which makes more sense logically
        //     console.log(textWidth, this.inputW, this.offsetChars);
        // } else {
        //     this.offsetChars = 0;
        // }

    }
}



on_init();