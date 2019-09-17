HyperlinkStates = {
	Normal: 0,
	Hovered: 1
}

var measureStringScratchImg = gdi.CreateImage(1000, 200);

function Hyperlink(text, font, type, x_offset, y_offset, container_w) {
	this.text = text;
	this.type = type;
	this.x_offset = x_offset;
	if (x_offset < 0) {
		this.x = container_w + x_offset; // right justified links
	} else {
		this.x = x_offset;
	}
	this.y_offset = y_offset;
	this.y = y_offset;
	this.container_w = container_w;
	this.state = HyperlinkStates.Normal;
	
	var link_dimensions;

	this.get_w = function () {
		return Math.ceil(link_dimensions.Width);
	}

	this.set_y = function (y) {
		this.y = y + this.y_offset - 2;
	}

	this.set_xOffset = function (x_offset) {
		if (x_offset < 0) {
			this.x = this.container_w + x_offset; // right justified links
		} else {
			this.x = x_offset;
		}
	}

	this.set_w = function (w) {
		if (this.x_offset < 0) {
			this.x = w + this.x_offset; // add because offset is negative
		}
		this.container_w = w;
		this.w = Math.ceil(Math.min(this.container_w, link_dimensions.Width + 1));
	}

	this.updateDimensions = function () {
		var gr = measureStringScratchImg.GetGraphics();
		var dimensions = gr.MeasureString(text, this.font, 0, 0, 0, 0);
		this.h = Math.ceil(dimensions.Height) + 1;
		this.w = Math.min(Math.ceil(dimensions.Width) + 1, container_w);
		measureStringScratchImg.ReleaseGraphics(gr);
		return dimensions;
	}

	this.setFont = function(font) {
		this.font = font;
		this.hoverFont = gdi.font(font.Name, font.Size, font.Style | g_font_style.underline);
		link_dimensions = this.updateDimensions();
	}
	
	this.setFont(font);
}

Hyperlink.prototype.trace = function (x, y) {
	// console.log('(', x, ',', y, ')', this.x, this.y, this.x + this.w, this.y + this.h);
	return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
}

// When drawing in a playlist, we have to draw from the y-offset instead of y, because the playlist scrolls
Hyperlink.prototype.draw_playlist = function (gr, color) {
	var font = this.state === HyperlinkStates.Hovered ? this.hoverFont : this.font;
	gr.DrawString(this.text, font, color, this.x, this.y_offset, this.w, this.h);
}

Hyperlink.prototype.draw = function (gr, color) {
	var font = this.state === HyperlinkStates.Hovered ? this.hoverFont : this.font;
	gr.DrawString(this.text, font, color, this.x, this.y, this.w, this.h);
}

Hyperlink.prototype.repaint = function () {
	try {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	} catch (e) {
		// probably already redrawing
	}
}

Hyperlink.prototype.click = function () {
    var query = this.type + ' IS ' + this.text;

	if (this.type === 'update') {
		// get update
		_.runCmd('https://github.com/kbuffington/Georgia/releases');
	} else {
		if (this.type === 'date') {
			query = '"$year(%date%)" IS ' + this.text;
		}
		var handle_list = fb.GetQueryItems(fb.GetLibraryItems(), query);
		if (handle_list.Count) {
			var pl = plman.FindOrCreatePlaylist('Search', true);
			plman.ClearPlaylist(pl);
			plman.InsertPlaylistItems(pl, 0, handle_list);
			plman.SortByFormat(pl, '$if2(%artist sort order%,%album artist%) $if3(%album sort order%,%original release date%,%date%) %album% %edition% %codec% %discnumber% %tracknumber%');
			plman.ActivePlaylist = pl;
		}
	}
}

// for every Hyperlink not created in playlist
function Hyperlinks_on_mouse_move (hyperlink, x, y) {
	var handled = false;
	if (hyperlink.trace(x, y)) {
		if (hyperlink.state !== HyperlinkStates.Hovered) {
			hyperlink.state = HyperlinkStates.Hovered;
			window.RepaintRect(hyperlink.x, hyperlink.y, hyperlink.w, hyperlink.h);
		}
		handled = true;
	} else {
		if (hyperlink.state !== HyperlinkStates.Normal) {
			hyperlink.state = HyperlinkStates.Normal;
			window.RepaintRect(hyperlink.x, hyperlink.y, hyperlink.w, hyperlink.h);
		}
	}
	return handled;
}
