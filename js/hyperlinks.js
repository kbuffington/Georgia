HyperlinkStates = {
    Normal: 0,
    Hovered: 1
}

var measureStringScratchImg = gdi.CreateImage(1000, 200);
var hyperlinksCount = 0;

function Hyperlink(text, font, type, x_offset, y_offset, container_w) {
	hyperlinksCount++;
    this.text = text;
	this.font = font;
	this.hoverFont = gdi.font(font.Name, font.Size, font.Style | g_font_style.underline);
    this.type = type;
	this.x_offset = x_offset;
	if (x_offset < 0) {
		this.x = container_w + x_offset;	// right justified links
	} else {
		this.x = x_offset;
	}
	this.y_offset = y_offset;
	this.y = y_offset;
	this.container_w = container_w;
    this.state = HyperlinkStates.Normal;

	var gr = measureStringScratchImg.GetGraphics();
	var link_dimensions = gr.MeasureString(text, font, 0, 0, 0, 0);
    this.h = Math.ceil(link_dimensions.Height) + 1;
    this.w = Math.min(Math.ceil(link_dimensions.Width) + 1, container_w);
	measureStringScratchImg.ReleaseGraphics(gr);

    this.get_w = function () {
        // console.log('Width of ', this.text, ': ', link_dimensions.Width);
        return link_dimensions.Width;
    }

	this.set_y = function (y) {
		this.y = y + this.y_offset - 2;
	}

	this.set_w = function (w) {
		if (this.x_offset < 0) {
			this.x = w + this.x_offset;	// add because offset is negative
		}
		this.container_w = w;
		this.w = Math.ceil(Math.min(this.container_w, link_dimensions.Width + 1));
	}
}

Hyperlink.prototype.trace = function (x, y) {
	// console.log('(', x, ',', y, ')', this.x, this.y, this.x + this.w, this.y + this.h);
	return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
}

Hyperlink.prototype.draw = function (gr, color) {
	var font = this.state === HyperlinkStates.Hovered ? this.hoverFont : this.font;
	gr.DrawString(this.text, font, color, this.x, this.y_offset, this.w, this.h);
}

Hyperlink.prototype.repaint = function() {
    try {
        window.RepaintRect(this.x, this.y, this.w, this.h);
    } catch (e) {
        // probably already redrawing
    }
}

Hyperlink.prototype.click = function() {
    var handle_list = fb.GetQueryItems(fb.GetLibraryItems(), this.type + ' IS ' + this.text);
    if (handle_list.Count) {
        var pl = plman.FindOrCreatePlaylist('Search', true);
        plman.ClearPlaylist(pl);
        plman.InsertPlaylistItems(pl, 0, handle_list);
        plman.SortByFormat(pl, '$if2(%ArtistSortOrder%,%album artist%) $if2(%AlbumSortOrder%,%date%) %album% %discnumber% %tracknumber%');
        plman.ActivePlaylist = pl;
    }
}
