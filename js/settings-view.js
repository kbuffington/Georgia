// Globals needed by this view
let controlList = [];
/** @type {TextBoxControl} */
let activeControl = undefined;
/** @type {TextBoxControl} */
let hoveredControl = undefined; // should i do something with this?

// crap that can be stripped out once integrated into main theme
ft = {};

function font(name, size, style) {
    var font;
    try {
        font = gdi.Font(name, Math.round(scaleForDisplay(size)), style);
    } catch (e) {
        console.log('Failed to load font >>>', name, size, style);
    }
    return font;
}

function on_init() {
    const labelFont = 'HelveticaNeueLT Pro 55 Roman';
    const textFont = 'HelveticaNeueLT Pro 65 Md';

    ft.label = font(labelFont, 22, 0);
    ft.value = font(textFont, 22, 0);
    ft.fixed = font('Consolas', 22, 0);
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
        let found = false;
        for (let i in controlList) {
            if (controlList[i].mouseInThis(x, y)) {
                if (hoveredControl && hoveredControl !== controlList[i]) hoveredControl.hovered = false; // clear last hovered control
                hoveredControl = controlList[i];
                hoveredControl.hovered = true;
                found = true;
                break;
            }
        }
        if (!found && hoveredControl) {
            hoveredControl.hovered = false;
            hoveredControl = null;
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
                if (activeControl && activeControl !== controlList[i]) activeControl.clearFocus();
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
    TabGroup: 6,
    RadioGroup: 7,
};

const colors = {
    blue: rgb(65,81,181),
    black: rgb(0,0,0),
    darkGrey: rgb(96,96,96),
    lightGrey: rgb(200,200,200),
    pink: rgb(255, 64, 129),
    red: rgb(255,0,0),
    white: rgb(255,255,255),
}

function initSettingsView() {
    let top = 0;
    let controlPadding = 15;
    const tabGroup = new TabGroup(0, top, window.Width, ['Settings', '2nd tab', 'Playlist'], ft.label);
    controlList.push(tabGroup);
    top += tabGroup.h + controlPadding * 2;
    const test = new TextBoxControl('Text Input:', 'abcdefghijklmnopqrstuvwxyz', 20, top, 200, 400, ft.value);
    controlList.push(test);

    controlList.push(new TextBoxControl('Text Input:', 'You can double click this text if you want too', 20, top += controlList[controlList.length - 1].h + controlPadding, 200, 400, ft.fixed));
    const toggle = new ToggleControl('Toggle Control:', false, 20, top += controlList[controlList.length - 1].h + controlPadding, 200, ft.label);
    controlList.push(toggle);
    controlList.push(new ToggleControl('Toggle Control:', true, 20, top += controlList[controlList.length - 1].h + controlPadding, 200, ft.label));
    controlList.push(new ToggleControl('Blue Toggle', true, 20, top += controlList[controlList.length - 1].h + controlPadding, 200, ft.label, colors.blue));
    controlList.push(new CheckboxControl('Click my checkbox!', false, 20, top += controlList[controlList.length - 1].h + controlPadding, 300, ft.label));
    controlList.push(new CheckboxControl('Click my checkbox too!', true, 20, top += controlList[controlList.length - 1].h + controlPadding, 300, ft.label));
    controlList.push(new CheckboxControl('Super pink', true, 20, top += controlList[controlList.length - 1].h + controlPadding, 300, ft.label, colors.pink));
    controlList.push(new RadioGroup(20, top += controlList[controlList.length - 1].h + controlPadding, ['Option 1', 'Option 2', 'Option 3'], ft.label, false, 1, colors.blue));
    controlList.push(new RadioGroup(20, top += controlList[controlList.length - 1].h + controlPadding, ['Horizontal', 'Option 2', 'Option 3'], ft.label, true));
}

function calcTextHeight(font) {
    const img = gdi.CreateImage(100, 100);
    const g = img.GetGraphics();

    const height = g.CalcTextHeight('Ag', font);
    img.ReleaseGraphics(g);
    return height;
}

// Classes
class BaseControl {
    constructor(x, y, label) {
        /** @protected */ this.x = x;
        /** @protected */ this.y = y;
        /** @protected */ this.label = label;
        this.focus = false;
        this.disabled = false;
        this._hovered = false;
        this.controlType = undefined;
        /** @protected @private */ this.i = gdi.CreateImage(1, 1);
        /** @protected */ this.g = this.i.GetGraphics();   // GdiBitmap used for MeasureString and other functions
    }

    destructor() {
        this.i.ReleaseGraphics(this.g);
    }

    /** @virtual */
    onKey(vkey) {}

    /**
     * @param {boolean} value
     */
    set hovered(value) {
        this._hovered = value;
        // if you need to repaint on hovered value changing do override this method in child class
    }

    get hovered() {
        return this._hovered;
    }

    clearFocus() {
        this.focus = false;
    }

    /**
     * @param {string} text
     * @param {GdiFont} font
     * @returns {number}
     */
    calcTextWidth(text, font) {
        return this.g.CalcTextWidth(text, font);
    }

    /**
     * @param {string} text
     * @param {GdiFont} font
     * @returns {number}
     */
     calcTextHeight(text, font) {
        return this.g.CalcTextHeight(text, font);
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
        /** @private */ this.h = this.calcTextHeight('Ag', font);
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
        const textX = this.inputX + this.padding;
        gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
        gr.GdiDrawText(this.label, ft.label, rgb(0,0,0), this.x, this.y, this.labelW, this.h, DrawTextFlags.noPrefix);
        gr.FillSolidRect(this.inputX, this.y - this.padding, this.inputW + 2 * this.padding, this.h + this.padding * 2, rgb(255,255,255));
        gr.DrawRect(this.inputX, this.y - this.padding, this.inputW + 2 * this.padding, this.h + this.padding * 2, this.lineThickness, rgb(0,0,0));
        gr.GdiDrawText(this.value.substr(this.offsetChars), this.font, rgb(0,0,0), textX, this.y, this.inputW, this.h, DrawTextFlags.left | DrawTextFlags.noPrefix);
        if (this.hasSelection) {
            let selStartIndex = this.selAnchor;
            let selEndIndex = this.selEnd;
            if (selStartIndex > selEndIndex) {
                let tmp = selStartIndex; selStartIndex = selEndIndex; selEndIndex = tmp;
            }
            selStartIndex = Math.max(this.offsetChars, selStartIndex);
            let start = textX + this.getCursorX(selStartIndex);
            let end = textX + this.getCursorX(selEndIndex);
            const maxWidth = Math.min(this.inputW, end - start)
            gr.FillSolidRect(start, this.y, maxWidth, this.h, rgb(128,128,255));
            gr.GdiDrawText(this.value.substr(selStartIndex, selEndIndex - selStartIndex), this.font, rgb(255,255,255), start, this.y, maxWidth, this.h, DrawTextFlags.noPrefix);
        }
        if (this.showCursor) {
            const cursorPos = textX + this.getCursorX(this.cursorPos);
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
            x = this.g.CalcTextWidth(this.value.substr(this.offsetChars, index - this.offsetChars), this.font);
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
        return !this.disabled && x >= this.inputX && x <= this.inputX + this.inputW && y >= this.y - this.padding && y <= this.y + this.h + this.padding;
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
            case VK_ENTER:
                this.clearFocus();
                break;
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
    /**
     * Create a slide toggle control similar to material design's: https://material.angular.io/components/slide-toggle/overview
     * @param {*} labelText
     * @param {*} value
     * @param {*} x
     * @param {*} y
     * @param {*} labelWidth
     * @param {*} labelFont
     */
    constructor(labelText, value, x, y, labelWidth, labelFont, color) {
        super(x, y, labelText);
        /** @constant */ this.controlType = ControlType.Toggle;
        /** @private */ this.font = labelFont;
        /** @private */ this.labelW = labelWidth;
        /** @private */ this.toggleX = this.x + this.labelW;
        /** @private */ this.value = !!value;
        /** @private */ this.h = Math.ceil(this.calcTextHeight(labelText, labelFont));

        /** @private @const */ this.toggleW = 80;
        /** @private @const */ this.slideH = this.h / 2;
        /** @private @const */ this.hoveredExtPad = scaleForDisplay(7);  // extra padding when hovered
        /** @private {GdiBitmap} */ this.knobShadowImg = null;
        this.color = color ? color : rgb(96, 2, 238);

        this.createKnobShadow();
    }

    /**
     * @param {GdiGraphics} gr
     */
    draw(gr) {
        gr.SetSmoothingMode(SmoothingMode.HighQuality);
        gr.GdiDrawText(this.label, ft.label, rgb(0,0,0), this.x, this.y, this.labelW, this.h, DrawTextFlags.noPrefix);
        let fillColor = this.value ? tintColor(this.color, 35) : rgb(172, 172, 172);
        const fillWidth = this.toggleW - this.h;
        const fillY = this.y + this.slideH / 2;
        gr.FillEllipse(this.toggleX + this.slideH * .5, fillY, this.slideH, this.slideH, fillColor);
        gr.FillEllipse(this.toggleX + fillWidth + this.slideH * .5, fillY, this.slideH, this.slideH, fillColor);
        gr.FillSolidRect(this.toggleX + this.h * .5, fillY, fillWidth, this.slideH, fillColor);

        let knobX = this.value ? this.toggleX + this.toggleW - this.h : this.toggleX;
        let knobCol = this.value ? this.color : rgb(255,255,255);

        gr.DrawImage(this.knobShadowImg, knobX - 1, this.y + 1, this.knobShadowImg.Width, this.knobShadowImg.Height, 0, 0, this.knobShadowImg.Width, this.knobShadowImg.Height);
        if (this.hovered) {
            const hoverCol = this.value ? 0x20ffffff & knobCol : rgba(0,0,0,15);
            gr.FillEllipse(knobX - this.hoveredExtPad, this.y - this.hoveredExtPad, this.h + this.hoveredExtPad * 2, this.h + this.hoveredExtPad * 2, hoverCol);
        }
        gr.FillEllipse(knobX, this.y, this.h, this.h, knobCol);
    }

    set hovered(value) {
        this._hovered = value;
        this.repaint();
    }

    get hovered() {
        return this._hovered;
    }

    repaint() {
        const padding = this.hoveredExtPad;
        window.RepaintRect(this.x - padding, this.y - padding, this.toggleX - this.x + this.toggleW + padding * 2, this.h + padding * 2);
    }

    mouseInThis(x, y) {
        return !this.disabled &&
                x >= this.toggleX && x <= this.toggleX + this.toggleW && y >= this.y && y <= this.y + this.h;
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

    /** @private */
    createKnobShadow() {
        const padding = scaleForDisplay(2);
        this.knobShadowImg = gdi.CreateImage(this.h + padding * 2, this.h + padding * 2);
        const shimg = this.knobShadowImg.GetGraphics();
        shimg.FillEllipse(padding, padding, this.h, this.h, rgba(128, 128, 128, 128));
        this.knobShadowImg.ReleaseGraphics(shimg);
        this.knobShadowImg.StackBlur(6);
    }

    destructor() {
        this.knobShadowImg = null;
        super.destructor();
    }
}

class CheckboxControl extends BaseControl {
    /**
     * Create a checkbox control similar to material design's: https://material.angular.io/components/checkbox/overview
     * @param {string} labelText
     * @param {*} value
     * @param {number} x
     * @param {number} y
     * @param {number} labelWidth
     * @param {GdiFont} labelFont
     * @param {number=} color optional color for check
     */
    constructor(labelText, value, x, y, labelWidth, labelFont, color) {
        super(x, y, labelText);
        /** @constant */ this.controlType = ControlType.Checkbox;
        /** @private */ this.font = labelFont;
        /** @private */ this.labelW = labelWidth;
        /** @private */ this.value = !!value;
        /** @private */ this.h = Math.ceil(this.calcTextHeight(labelText, labelFont));
        /** @private @const */ this.lineThickness = scaleForDisplay(2);
        /** @private @const */ this.checkboxSpacing = scaleForDisplay(10);
        /** @private @const */ this.hoveredExtPad = scaleForDisplay(12);  // extra padding when hovered
        /** @private */ this.labelDrawnWidth = Math.ceil(this.calcTextWidth(labelText, labelFont));
        this.color = color ? color : colors.blue;
    }

    /**
     * @param {GdiGraphics} gr
     */
    draw(gr) {
        if (this.hovered) {
            gr.FillEllipse(this.x - this.hoveredExtPad - 1, this.y - this.hoveredExtPad - 1, this.h + this.hoveredExtPad * 2, this.h + this.hoveredExtPad * 2, rgba(0,0,0,10));
        }
        gr.SetSmoothingMode(SmoothingMode.None);
        gr.DrawRect(this.x, this.y, this.h, this.h, this.lineThickness, rgb(0,0,0));
        if (this.value) {
            gr.FillSolidRect(this.x, this.y, this.h, this.h, this.color);
            gr.SetSmoothingMode(SmoothingMode.HighQuality);
            const height = this.h - scaleForDisplay(4);
            const startX = this.x + scaleForDisplay(2);
            const startY = this.y + scaleForDisplay(2) + height * .5;
            let lineLength = height * .3;
            const endX = startX + lineLength;
            const endY = startY + lineLength;
            const checkThickness = scaleForDisplay(2);
            gr.DrawLine(startX, startY, endX, endY, checkThickness, rgb(255,255,255));
            lineLength = height * .66;
            gr.DrawLine(endX, endY, endX + lineLength, endY - lineLength, checkThickness, rgb(255,255,255));
        }
        gr.GdiDrawText(this.label, this.font, rgb(0,0,0), this.x + this.h + this.checkboxSpacing, this.y, this.labelW, this.h, DrawTextFlags.noPrefix);
        gr.SetSmoothingMode(SmoothingMode.HighQuality);
    }

    set hovered(value) {
        this._hovered = value;
        this.repaint();
    }

    get hovered() {
        return this._hovered;
    }

    repaint() {
        const padding = this.hoveredExtPad;
        window.RepaintRect(this.x - padding, this.y - padding, this.h + this.checkboxSpacing + this.labelDrawnWidth + padding * 2, this.h + padding * 2);
    }

    clicked(x, y) {
        this.value = !this.value;
        this.repaint();
    }

    mouseInThis(x, y) {
        return !this.disabled &&
                x >= this.x && x <= this.x + this.h + this.checkboxSpacing + Math.min(this.labelDrawnWidth, this.labelW) &&
                y >= this.y && y <= this.y + this.h;
    }

    onChar(code) {
        switch (code) {
            case VK_ENTER:
            case VK_SPACE:
                this.clicked(0, 0);
                break;
        }
    }
}

class RadioGroup extends BaseControl {
    /**
     * Create a checkbox control similar to material design's: https://material.angular.io/components/checkbox/overview
     * @param {number} x
     * @param {number} y
     * @param {string[]} labelArray array of labels. Determines number of radio buttons in group
     * @param {GdiFont} font
     * @param {boolean=} [horizontal=false] Are radio options horizontal, or stacked (default)
     * @param {number=} [activeIndex=-1] Index of selected radio button from 0 to labelArray.length - 1
     * @param {number=} color optional color for selected radio button
     */
    constructor(x, y, labelArray, font, horizontal, activeIndex, color) {
        super(x, y);
        /** @const */ this.controlType = ControlType.RadioGroup;
        /** @private */ this.font = font;
        /** @private */ this.labelArray = labelArray;
        /** @private */ this.horizontal = horizontal;
        this.activeRadio = activeIndex === undefined ? -1 : activeIndex;
        /** @private @const */ this.verticalPadding = horizontal ? 0 : scaleForDisplay(3);
        /** @private @const */ this.labelHeight = Math.ceil(this.calcTextHeight('Ag', font));
        /** @private @const */ this.radioSize = Math.ceil(this.labelHeight * .75);
        /** @private @const */ this.optionHeight = this.labelHeight + this.verticalPadding;
        /** @private @const */ this.lineThickness = scaleForDisplay(2);
        /** @private @const */ this.hoveredExtPad = scaleForDisplay(7);
        /** @private @const */ this.labelPadding = scaleForDisplay(10); // space between radio button and its label, also 2x this size between horizontal radio items
        this.color = color ? color : colors.black;
        this.inactiveColor = colors.darkGrey;
        this.h = horizontal ? this.optionHeight : this.optionHeight * labelArray.length - this.verticalPadding; // we don't need vertical padding after the last radio button
        /** @private {number[]} */ this.radioWidths = []; // array of labelWidths
        /** @private {number} */ this.lastMouseOver = undefined;
        this.w = this.getRadioGroupWidth();
    }

    set hovered(value) {
        this._hovered = value;
        this.repaint();
    }

    get hovered() {
        return this._hovered;
    }

    getRadioGroupWidth() {
        let width = 0;
        this.radioWidths = this.labelArray.map(text => this.radioSize + this.labelPadding + this.calcTextWidth(text, this.font));  // array of widths
        if (this.horizontal) {
            this.radioWidths.forEach((w, idx) => {
                width += w + (idx > 0 ? this.labelPadding * 2 : 0); // skip last padding essentially
            });
        } else if (this.radioWidths.length) {
            this.radioWidths.forEach(w => {
                if (w > width) {
                    width = w;
                }
            });
        }
        return width;
    }

    /**
     * @param {GdiGraphics} gr
     */
    draw(gr) {
        gr.SetSmoothingMode(SmoothingMode.HighQuality);
        let x = this.x;
        let y = this.y;
        this.labelArray.forEach((label, index) => {
            const isActive = this.activeRadio === index;
            const radioYOffset = this.labelHeight / 2 - this.radioSize / 2 - 1;
            if (this.hovered && this.lastMouseOver === index) {
                // gr.DrawEllipse(x, y + radioYOffset, this.radioSize, this.radioSize, this.lineThickness, isActive ? this.color : this.inactiveColor);
                gr.FillEllipse(x - this.hoveredExtPad, y + radioYOffset - this.hoveredExtPad, this.radioSize + this.hoveredExtPad * 2, this.radioSize + this.hoveredExtPad * 2, rgba(0,0,0,15));
            }
            gr.DrawEllipse(x, y + radioYOffset, this.radioSize, this.radioSize, this.lineThickness, isActive ? this.color : this.inactiveColor);
            if (isActive) {
                const fillSize = this.radioSize * .66;
                const fillOffset = this.radioSize / 2 - fillSize / 2;
                gr.FillEllipse(x + fillOffset, y + radioYOffset + fillOffset, fillSize, fillSize, this.color);
            }
            gr.GdiDrawText(label, this.font, colors.black, x + this.radioSize + this.labelPadding, y, this.w, this.labelHeight, colors.lightGrey);
            if (this.horizontal) {
                x += this.radioWidths[index] + this.labelPadding * 2;
            } else {
                // gr.DrawRect(this.x, this.y, this.w, this.optionHeight, 1, colors.red);
                y += this.optionHeight;
            }
        });
    }

    repaint() {
        window.RepaintRect(this.x - this.hoveredExtPad, this.y - this.hoveredExtPad, this.w, this.h + this.hoveredExtPad * 2 + 1);
    }

    mouseInIndex(x, y) {
        let index = undefined;
        if (this.horizontal) {
            let relativeX = x - this.x;
            for (let i = 0; i < this.radioWidths.length; i++) {
                if (relativeX < this.radioWidths[i]) {
                    index = i;
                    break;
                } else {
                    relativeX -= (this.radioWidths[i] + this.labelPadding * 2);
                }
            }
        } else {
            const relativeY = y - this.y;
            index = Math.floor(relativeY / this.optionHeight);
        }
        if (index >= this.labelArray.length) {
            index = undefined;
        }
        this.lastMouseOver = index;
        return index;
    }

    clicked(x, y) {
        this.activeRadio = this.mouseInIndex(x, y);
        this.repaint();
    }

    mouseInThis(x, y) {
        if (!this.disabled && x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
            this.mouseInIndex(x, y);
            return true;
        }
        return false;
    }
}

class TabGroup extends BaseControl {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width The width of the entire TabGroup.
     * @param {string[]} labelArray array of labels. Determines number of tabs
     * @param {GdiFont} labelFont
     */
    constructor(x, y, width, labelArray, labelFont) {
        super(x, y, '');
        /** @const */ this.controlType = ControlType.TabGroup;
        this.w = width;
        /** @private */ this.font = labelFont;
        /** @private */ this.activeFont = font(labelFont.Name, labelFont.Size, labelFont.Style | g_font_style.bold);
        /** @private */ this.labelArray = labelArray;
        const textHeight = Math.ceil(calcTextHeight(labelFont));
        /** @private @const */ this.padding = textHeight;
        /** @private @const */ this.lineThickness = scaleForDisplay(1);
        /** @private @const */ this.tabLabelPadding = scaleForDisplay(30);  // padding on left and right of label text
        /** @private */ this.tabWidth = 0;
        this.h = textHeight + Math.round(this.padding * 1.5);
        this.activeTab = 0;

        this.calcTabWidth();
    }

    /** @private */
    calcTabWidth() {
        let maxWidth = 0;
        this.labelArray.forEach(label => {
            const textWidth = this.calcTextWidth(label, this.font);
            if (textWidth + this.tabLabelPadding * 2 > maxWidth) {
                maxWidth = textWidth + this.tabLabelPadding * 2;
            }
        });
        if (this.w >= (maxWidth * this.labelArray.length)) {
            this.tabWidth = maxWidth;
        } else {
            this.tabWidth = this.w / this.labelArray.length;
        }
    }

    /**
     * @param {GdiGraphics} gr
     */
    draw(gr) {
        gr.SetSmoothingMode(SmoothingMode.None);
        gr.DrawLine(this.x, this.y + this.h, this.x + this.w, this.y + this.h, this.lineThickness, colors.lightGrey);
        this.labelArray.forEach((label, index) => {
            const tabX = this.x + this.tabWidth * index;
            const isActive = this.activeTab === index;
            gr.GdiDrawText(label, isActive ? this.activeFont : this.font, colors.black, tabX, this.y + this.padding, this.tabWidth, this.padding, DrawTextFlags.noPrefix | DrawTextFlags.center);
            if (isActive) {
                const thickness = scaleForDisplay(3);
                const lineY = Math.round(this.y + this.h - thickness / 2);
                gr.DrawLine(tabX, lineY, tabX + this.tabWidth, lineY, thickness, colors.blue);
            }
        });
        gr.SetSmoothingMode(SmoothingMode.HighQuality);
    }

    repaint() {
        window.RepaintRect(this.x, this.y, this.w, this.h + 1);
    }

    clicked(x, y) {
        for (let i = 0; i < this.labelArray.length; i++) {
            if (x >= this.x + this.tabWidth * i && x < this.x + this.tabWidth * (i + 1)) {
                this.activeTab = i;
                break;
            }
        }
        this.repaint();
    }

    mouseInThis(x, y) {
        return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
    }
}

on_init();