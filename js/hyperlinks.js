HyperlinkStates = {
    Normal: 0,
    Hovered: 1
}

function Hyperlink(text, font, col, type, x, y) {
    this.text = text;
	this.font = font;
	this.hoverFont = gdi.font(font.Name, font.Size, font.Style | FontStyle.Underline);
    this.type = type;
    this.col = col;
    this.x = x;
    this.y = y;
    this.state = HyperlinkStates.Normal;

    var tempImg = gdi.CreateImage(ww ? ww : 200, 200);
    var gr = tempImg.GetGraphics();
    this.h = gr.CalcTextHeight(this.text, font) + 1;
    this.w = gr.CalcTextWidth(this.text, font);
    tempImg.ReleaseGraphics(gr);
}

Hyperlink.prototype.mouseInThis = function (x, y) {
	return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
}

Hyperlink.prototype.onPaint = function(gr) {
    // if (this.state === HyperlinkStates.Hovered) {
    //     gr.DrawLine(this.x, this.y + this.h - 3, this.x + this.w - 1, this.y + this.h - 3, 2, this.col);
	// }
	var font = this.state === HyperlinkStates.Hovered ? this.hoverFont : this.font;
    gr.DrawString(this.text, font, this.col, this.x, this.y, this.w, this.h);
}

Hyperlink.prototype.repaint = function() {
    try {
        window.RepaintRect(this.x, this.y, this.w, this.h);
    } catch (e) {
        // probably already redrawing
    }
}

Hyperlink.prototype.onClick = function() {
    var handle_list = fb.GetQueryItems(fb.GetLibraryItems(), this.type + ' IS ' + this.text);
    if (handle_list.Count) {
        var pl = plman.FindOrCreatePlaylist('Search', true);
        plman.ClearPlaylist(pl);
        plman.InsertPlaylistItems(pl, 0, handle_list);
        plman.SortByFormat(pl, '%artist% $if2(%AlbumSortOrder%,%date%) %album% %discnumber% %tracknumber%');
        plman.ActivePlaylist = pl;
    }
}

var lastActiveHyperlink = null;

function hyperlinkEventHandler(x, y) {
    var thisHyperlink = null;

    for (var i in hyperlinks) {
        if (typeof hyperlinks[i] === 'object' && hyperlinks[i].mouseInThis(x, y)) {
            thisHyperlink = hyperlinks[i];
            break;
        }
    }

    if (lastActiveHyperlink && lastActiveHyperlink != thisHyperlink) {
        lastActiveHyperlink.state = HyperlinkStates.Normal;
        lastActiveHyperlink.repaint();
    }
    lastActiveHyperlink = thisHyperlink;

    if (thisHyperlink) {
        var e = caller();
        switch (e) {
            case 'on_mouse_move':
                thisHyperlink.state = HyperlinkStates.Hovered;
                thisHyperlink.repaint();
                break;

            case 'on_mouse_lbtn_dblclk':
                break;

            case 'on_mouse_lbtn_down':
                thisHyperlink.onClick(x, y);
                break;

            case 'on_mouse_lbtn_up':
                break;

            case 'on_mouse_leave':
                break;

        }
    }
}
