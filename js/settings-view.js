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

        for (let i in controlList) {
            if (controlList[i].mouseInThis(x, y)) {
                if (hoveredControl) hoveredControl.hovered = false; // clear last hovered control
                hoveredControl = controlList[i];
                hoveredControl.hovered = true;
                break;
            }
        }
    }
}

const doubleClickTime = 200;
let lastClickTime = null;
function on_mouse_lbtn_up(x, y, m) {
    if (Date.now() - lastClickTime > doubleClickTime) {
        lastClickTime = Date.now();
        let found = false;
        for (let i in controlList) {
            if (controlList[i].mouseInThis(x, y)) {
                if (activeControl) activeControl.clearFocus();
                activeControl = controlList[i];
                activeControl.clicked(x, y);
                found = true;
                break;
            }
        }
        if (!found && activeControl) {
            activeControl.clearFocus();
            activeControl = undefined;
        }
    } else {
        lastClickTime = Date.now();
        activeControl.doubleClicked(x, y);
    }
}

// function on_mouse_lbtn_dblclk(x, y, m) {
//     if (activeControl && activeControl.mouseInThis(x, y)) {
//         doubleClicked = true;
//         activeControl.doubleClicked(x, y);
//         console.log('doublelcicked')
//         setTimeout(() => {
//             doubleClicked = false;
//             console.log('clearing doubleclick');
//         }, doubleClickTime * 2);
//     }
// }

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
    Checkbox: 3,
    ColorPicker: 4,
    DropDown: 5,
};

function initSettingsView() {
    const test = new TextBoxControl('Text Input:', 'abcdefghijklmnopqrstuvwxyz', 20, 60, 200, 400, ft.value);
    controlList.push(test);

    const toggle = new ToggleControl('Toggle Control:', false, 20, 120, 200, ft.label);
    controlList.push(toggle);
    controlList.push(new ToggleControl('Toggle Control:', true, 20, 180, 200, ft.label));
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
        /** @protected */ this.label = label;
        this.focus = false;
        this.hovered = false;
        this.controlType = undefined;
        /** @protected @private */ this.i = gdi.CreateImage(1, 1);
        /** @protected */ this.g = this.i.GetGraphics();   // GdiBitmap used for MeasureString and other functions
    }

    destructor() {
        this.i.ReleaseGraphics(this.g);
    }

    /** @virtual */
    onKey(vkey) {}
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
        /** @private */ this.value = value;
        /** @private */ this.lineThickness = scaleForDisplay(1);
        /** @constant @private */ this.cursorRefreshInterval = 350; // ms
        /** @private */ this.timerId = undefined;
        /** @private */ this.showCursor = false;
        /** @private */ this.selEnd = -1;
        /** @private */ this.selAnchor = -1;
        /** @private */ this.cursorPos = 0;
        /** @private */ this.offsetChars = 0; // number of chars that are not visible in the textbox (scrolled to the left)

        /** @constant */ this.controlType = ControlType.TextBox;
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
        gr.GdiDrawText(this.label, ft.label, rgb(0,0,0), this.x, this.y, this.labelW, this.h, DrawTextFlags.noPrefix);
        gr.FillSolidRect(this.inputX, this.y - this.padding, this.inputW + 2 * this.padding, this.h + this.padding * 2, rgb(255,255,255));
        gr.DrawRect(this.inputX, this.y - this.padding, this.inputW + 2 * this.padding, this.h + this.padding * 2, this.lineThickness, rgb(0,0,0));
        gr.GdiDrawText(this.value.substr(this.offsetChars), ft.value, rgb(0,0,0), this.inputX + this.padding, this.y, this.inputW, this.h, DrawTextFlags.left | DrawTextFlags.noPrefix);
        if (this.hasSelection) {
            let selStartIndex = this.selAnchor;
            let selEndIndex = this.selEnd;
            if (selStartIndex > selEndIndex) {
                let tmp = selStartIndex; selStartIndex = selEndIndex; selEndIndex = tmp;
            }
            selStartIndex = Math.max(this.offsetChars, selStartIndex);
            let start = this.inputX + this.padding + this.getCursorX(selStartIndex);
            let end = this.inputX + this.padding + this.getCursorX(selEndIndex);
            const maxWidth = Math.min(this.inputW, end - start)
            gr.FillSolidRect(start, this.y, maxWidth, this.h, rgb(128,128,255));
            gr.GdiDrawText(this.value.substr(selStartIndex, selEndIndex - selStartIndex), this.font, rgb(255,255,255), start, this.y, maxWidth, this.h, DrawTextFlags.noPrefix);
        }
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
            const charWidth = this.g.CalcTextWidth(this.value.substr(i, 1), this.font);
            if (Math.round(pos + (charWidth / 2)) >= inputX) {
                return i;
            }
            pos += charWidth;
        }
        return this.value.length;
    }

    /**
     * Calculte how many chars (offsetChars) to *not* draw on the left hand side of the text box
     */
    calcOffsetIndex() {
        let width = this.g.CalcTextWidth(this.value.substr(this.offsetChars, this.cursorPos - this.offsetChars), this.font);
        let j = 0;
        while (width > this.inputW && j < 999) {
            j++;
            this.offsetChars++;
            width = this.g.CalcTextWidth(this.value.substr(this.offsetChars, this.cursorPos - this.offsetChars), this.font);
        }
        if (j === 0) {
            while (width < this.inputW && this.offsetChars >= 0) {
                this.offsetChars--;
                width = this.g.CalcTextWidth(this.value.substr(this.offsetChars, this.cursorPos - this.offsetChars), this.font);
            }
            this.offsetChars++;
        }
    }

    mouseInThis(x, y) {
        return x >= this.inputX && x <= this.inputX + this.inputW && y >= this.y - this.padding && y <= this.y + this.h + this.padding;
    }

    /**
     * Remove focus from control, clear cursor, and reset offset chars, then redraw
     */
    clearFocus() {
        clearTimeout(this.timerId);
        this.focus = false;
        this.showCursor = false;
        this.offsetChars = 0;
        this.selAnchor = -1;    // I think we want to do this?
        this.repaint();
    }

    /**
     * Turns the cursor on and off and repaints the control
     * @private
     * @param {boolean=} showImmediate
     */
    flashCursor(showImmediate) {
        clearTimeout(this.timerId);
        this.showCursor = showImmediate ? true : !this.showCursor;
        this.timerId = setTimeout(() => {
            this.flashCursor();
        }, this.cursorRefreshInterval);
        this.repaint();
    }

    clicked(x, y) {
        if (!this.mouseInThis(x, y)) return;
        this.focus = true;
        const oldCursor = this.cursorPos;
        this.cursorPos = this.getCursorIndex(x);
        if (utils.IsKeyPressed(VK_SHIFT)) {
            if (this.hasSelection) {
                this.selAnchor = oldCursor;
            }
            this.selEnd = this.cursorPos;
        } else {
            this.selAnchor = -1;
        }
        this.flashCursor(true);
    }

    doubleClicked(x, y) {
        const clickPos = this.getCursorIndex(x);
        if (this.hasSelection &&
                Math.abs(this.selAnchor - this.selEnd) !== this.value.length &&
                ((clickPos >= this.selAnchor && clickPos <= this.selEnd) ||
                (clickPos <= this.selAnchor && clickPos >= this.selEnd))) {
            this.onChar(VK_SELECT_ALL);
        } else {
            this.selAnchor = Math.max(0, this.value.substr(0, clickPos).lastIndexOf(' ') + 1);
            this.selEnd = this.value.indexOf(' ', clickPos);
            if (this.selEnd === -1) this.selEnd = this.value.length;
            this.cursorPos = this.selEnd;
        }
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
                if (dir < 0 && this.cursorPos < this.offsetChars) {
                    this.offsetChars--;
                } else if (dir > 0) {
                    while (this.getCursorX(this.cursorPos) > this.inputW) {
                        this.offsetChars++;
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
                this.calcOffsetIndex();
                break;
            case VK_DELETE:
                this.onChar(VK_DELETE);
                break;
        }
        this.flashCursor(true);
    }

    onChar(code) {
        // console.log(code);
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
                if (this.cursorPos === this.value.length) {
                    // deleting text from end
                    this.calcOffsetIndex();
                } else if (this.cursorPos < this.offsetChars) {
                    this.offsetChars = this.cursorPos;
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
                this.calcOffsetIndex();
                break;
            case VK_SELECT_ALL:
                this.selAnchor = 0; this.cursorPos = this.selEnd = this.value.length;
                this.calcOffsetIndex();
                clearSelection = false;
                break;
            case VK_ESCAPE: // clears selection below
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
                if (this.cursorPos === this.value.length) { // inserting text at end
                    this.calcOffsetIndex();
                } else {
                    while (this.getCursorX(this.cursorPos) > this.inputW) { // ensure new text does not push cursor past input edge
                        this.offsetChars++;
                    }
                }
        }
        if (clearSelection) this.selAnchor = -1;    // always want to clear selection
    }
}

class ToggleControl extends BaseControl {
    constructor(labelText, value, x, y, labelWidth, labelFont) {
        super(x, y, labelText);
        /** @private */ this.font = labelFont;
        /** @private */ this.labelW = labelWidth;
        /** @private */ this.toggleX = this.x + this.labelW;
        /** @private */ this.value = !!value;
        /** @private */ this.h = Math.floor(calcTextHeight(labelFont));

        /** @private @const */ this.toggleW = 100;
        /** @private @const */ this.knobH = this.h * 1.5;
        /** @private {GdiBitmap} */ this.knobShadowImg = null;
        console.log(this.knobH);

        this.createKnobShadow();
    }

    /**
     * @param {GdiGraphics} gr
     */
    draw(gr) {
        gr.GdiDrawText(this.label, ft.label, rgb(0,0,0), this.x, this.y, this.labelW, this.h, DrawTextFlags.noPrefix);
        let fillColor = this.value ? rgb(156, 97, 239) : rgb(172, 172, 172);
        const halfHeight = Math.round(this.h / 2);
        // gr.FillRoundRect(this.toggleX, this.y, this.toggleW, this.h, halfHeight, halfHeight, rgb(128,128,128));
        gr.FillEllipse(this.toggleX + this.h * .25, this.y, this.h, this.h, fillColor);
        gr.FillEllipse(this.toggleX + this.toggleW - this.h * .75, this.y, this.h, this.h, fillColor);
        gr.FillSolidRect(this.toggleX + this.h * .75, this.y + 1, this.toggleW - this.h, this.h - 1, fillColor);
        let knobX = this.value ? this.toggleX + this.toggleW - this.h : this.toggleX;
        let knobCol = this.value ? rgb(96, 2, 238) : rgb(255,255,255);
        gr.DrawImage(this.knobShadowImg, knobX - 1, this.y - this.h * .25 + 1, this.knobShadowImg.Width, this.knobShadowImg.Height, 0, 0, this.knobShadowImg.Width, this.knobShadowImg.Height);
        gr.FillEllipse(knobX, this.y - this.h * .25, this.knobH, this.knobH, knobCol);

        // gr.DrawRect(this.x, this.y - this.h * .25 - 1, this.toggleX - this.x + this.toggleW + this.knobH - this.h, this.knobShadowImg.Height, 1, rgb(255,0,0))

    }

    repaint() {
        window.RepaintRect(this.x, this.y - this.h * .25 - 1, this.toggleX - this.x + this.toggleW + this.knobShadowImg.Height - this.h + 1, this.knobShadowImg.Height + 1)
    }

    mouseInThis(x, y) {
        return (x >= this.toggleX && x <= this.toggleX + this.toggleW - this.h + this.knobH && y >= this.y - this.h * .25 && y <= this.y + this.knobH);
    }

    clicked(x, y) {
        this.value = !this.value;
        this.repaint();
    }

    onChar(code) {
        switch (code) {
            case VK_ENTER:
            case VK_SPACE:
                this.clicked(0, 0);
                break;
        }
    }

    clearFocus() {
        this.focus = false;
    }

    /** @private */
    createKnobShadow() {
        const padding = scaleForDisplay(3);
        this.knobShadowImg = gdi.CreateImage(this.knobH + padding * 2, this.knobH + padding * 2);
        const shimg = this.knobShadowImg.GetGraphics();
        shimg.FillEllipse(padding, padding, this.knobH, this.knobH, rgba(128, 128, 128, 128));
        this.knobShadowImg.ReleaseGraphics(shimg);
        this.knobShadowImg.StackBlur(6);
    }

    destructor() {
        this.knobShadowImg = null;
        super.destructor();
    }
}

on_init();