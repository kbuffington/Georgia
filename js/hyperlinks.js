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




var show_disc_headers = true;

function DiscHeader(x, y, w, h, metadb, header) {
    List.Item.call(this, x, y, w, h);

    //public:
    this.draw = function (gr, top, bottom) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_pl_colors.background);

		if (this.is_odd && g_properties.alternate_row_color) {
            gr.FillSolidRect(this.x, this.y + 1, this.w, this.h - 1, g_pl_colors.row_alternate);
		}

		gr.DrawRect(this.x, this.y, this.w, this.h - 1, 1, rgba(100,100,100,100));

		var cur_x = this.x + 10;
		var title_font = g_pl_fonts.title_normal;
		var title_color = g_pl_colors.title_normal;

		if (this.is_selected()) {
			title_color = g_pl_colors.title_selected;
            title_font = g_pl_fonts.title_selected;
		}

		var disc_header_text_format = g_string_format.v_align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
		var disc_text = _.tf('[Disc %discnumber% $if('+ tf.disc_subtitle+', \u2014 ,) ]['+ tf.disc_subtitle +']', that.metadb);
		gr.DrawString(disc_text, title_font, title_color, cur_x, this.y, this.w, this.h, disc_header_text_format);

		var tracks_text = this.rows.length + ' Track' + (this.rows.length > 1 ? 's' : '') + ' - ' + get_duration();

		var tracks_w = Math.ceil(gr.MeasureString(tracks_text, title_font, 0, 0, 0, 0).Width + 5);
		var tracks_x = this.x + this.w - tracks_w - 8;

		gr.DrawString(tracks_text, title_font, title_color, tracks_x, this.y, tracks_w, this.h, g_string_format.v_align_center);

		if (this.is_collapsed) {
			// what to draw here?
		}
    };

	this.is_selected = function () {
		return _.every(that.rows, function (row) {
            return row.is_selected();
        });
	};

	this.toggle_collapse = function () {
		this.is_collapsed = !this.is_collapsed;

		this.header.collapse();
		this.header.expand();
	}

	function get_duration() {
        var duration_in_seconds = 0;

		for (var i = 0; i < that.rows.length; ++i) {
			duration_in_seconds += that.rows[i].metadb.Length;
		}

        if (!duration_in_seconds) {
            return '';
        }

        return utils.FormatDuration(duration_in_seconds);
    }

	this.rows = [];

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.idx = -1;
	this.metadb = metadb;	// metadb of first disc child
	this.header = header;

	this.num_in_header = 0;

	this.is_collapsed = false;
	this.is_playing = false;
	this.is_focused = false;
	this.is_odd = false;

	var that = this;
}

DiscHeader.prototype = Object.create(List.Item.prototype);
DiscHeader.prototype.constructor = Header;

