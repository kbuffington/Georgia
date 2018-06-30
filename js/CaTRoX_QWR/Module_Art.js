// ==PREPROCESSOR==
// @name 'Art Module'
// @author 'TheQwertiest & eXtremeHunter'
// ==/PREPROCESSOR==

g_script_list.push('Module_Art.js');

g_properties.add_properties(
    {
        track_mode:         ['user.art.track_mode', 3],
        group_format_query: ['user.art.group_format', '%album artist%%album%%discnumber%'],
        use_disc_mask:      ['user.art.use_disc_mask', true]
    }
);

// Fixup properties
(function() {
    g_properties.track_mode = Math.max(1, Math.min(3, g_properties.track_mode));
})();

/**
 * @param{object=} [optional_args={}]
 * @param{boolean=} [optional_args.border=false]
 * @param{boolean=} [optional_args.thumbs=false]
 * @param{boolean=} [optional_args.auto_cycle=false]
 * @constructor
 */
function ArtModule(optional_args) {//(Most of the art handling code was done by eXtremeHunter)
//public:

    //<editor-fold desc="Callback Implementation">
    this.paint = function (g) {
        var SF = g_string_format.align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
        var art = art_arr[cur_art_id];

        g.FillSolidRect(this.x, this.y, this.w, this.h, g_theme.colors.panel_back);
        g.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

        if (art) {
            var x = this.x + art_x;
            var y = this.y + art_y;
            var w = art_w;
            var h = art_h;

            var art_img_w = art.img.Width;
            var art_img_h = art.img.Height;

            var p = border_size;
            if (cur_art_id === artType.cd) {
                g.DrawImage(art.img, x + p, y + p, w - 2 * p, h - 2 * p, 0, 0, art_img_w, art_img_h);

                if (g_properties.use_disc_mask) {
                    g.SetSmoothingMode(SmoothingMode.HighQuality);
                    g.DrawEllipse(x, y, w - 1, h - 1, 1, frame_color);
                }
            }
            else {
                if (feature_border) {
                    g.DrawImage(art.img, x + p, y + p, w - 2 * p, h - 2 * p, 0, 0, art_img_w, art_img_h);
                    g.DrawRect(x, y, w - 1, h - 1, 1, frame_color);
                }
                else {
                    g.DrawImage(art.img, x, y, w, h, 0, 0, art_img_w, art_img_h);
                }
            }
        }
        else if (art === null) {
            var metadb = get_current_metadb();
            if (metadb && (_.startsWith(metadb.RawPath, 'http://')) && utils.CheckFont('Webdings')) {
                g.DrawString('\uF0BB', gdi.font('Webdings', 130), _.RGB(70, 70, 70), this.x, this.y, this.w, this.h, SF);
            }
            else if (!fb.IsPlaying) {
                g.DrawString('Album Art Panel', gdi.font('Segoe Ui Semibold', 24), _.RGB(70, 70, 70), this.x, this.y, this.w, this.h, g_string_format.align_center);
            }
            else {
                g.DrawString('No album image', gdi.font('Segoe Ui Semibold', 24), _.RGB(70, 70, 70), this.x, this.y, this.w, this.h, g_string_format.align_center);
            }
        }
        else {
            g.DrawString('LOADING', gdi.font('Segoe Ui Semibold', 24), _.RGB(70, 70, 70), this.x, this.y, this.w, this.h, g_string_format.align_center);
        }

        if (g_properties.show_thumbs) {
            thumbs.on_paint(g);
        }
    };

    var throttled_repaint = _.throttle(_.bind(function () {
        window.RepaintRect(this.x, this.y, this.w, this.h);
    }, this), 1000 / 60);
    this.repaint = function () {
        throttled_repaint();
    };

    this.on_size = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        was_on_size_called = true;

        if (thumbs) {
            thumbs.reposition(this.x, this.y, this.w, this.h);
        }
        reposition_art();
    };

    this.get_album_art_done = function (metadb, art_id, image, image_path) {
        if (!get_current_metadb()) {
            return;
        }

        if (art_id === g_album_art_id.artist) {
            art_id = artType.artist;
        }

        if (!image) {
            art_arr[art_id] = null;
            if (art_id === cur_art_id) {
                this.repaint();
            }
        }
        else {
            var art_img_w = image.Width,
                art_img_h = image.Height;

            if (art_id === artType.cd && art_img_w !== art_img_h) {
                image = image.Resize(art_img_w, art_img_w, 0);
            }

            if (!currentAlbum.length || currentAlbum === _.tf(g_properties.group_format_query, metadb)) {
                var is_embedded = image_path.slice(image_path.lastIndexOf('.') + 1) === _.tf('$ext(%path%)', metadb);

                art_arr[art_id] = {};
                art_arr[art_id].img = image;
                art_arr[art_id].path = image_path;
                art_arr[art_id].is_embedded = is_embedded;
                if (thumbs) {
                    thumbs.on_art_get(art_id, image);
                }
            }

            if (g_properties.use_disc_mask && art_id === artType.cd) {
                var artWidth = image.Width,
                    artHeight = image.Height,
                    discMask = gdi.CreateImage(artWidth, artHeight),
                    g = discMask.GetGraphics();
                g.FillSolidRect(0, 0, artWidth, artHeight, 0xffffffff);
                g.SetSmoothingMode(SmoothingMode.HighQuality);
                g.FillEllipse(1, 1, artWidth - 2, artHeight - 2, 0xff000000);
                discMask.ReleaseGraphics(g);
                art_arr[art_id].img.ApplyMask(discMask);
                discMask.Dispose();
            }

            if (art_id === cur_art_id) {
                reposition_art(art_arr[cur_art_id]);
                this.repaint();
            }
        }

        if (g_properties.show_thumbs) {
            this.repaint();
        }
    };
    this.playlist_switch = function () {
        if (!fb.IsPlaying || g_properties.track_mode === track_modes.selected) {
            this.get_album_art();
        }
    };
    this.item_focus_change = function () {
        if (!fb.IsPlaying || g_properties.track_mode === track_modes.selected) {
            this.get_album_art();
        }
    };
    this.playback_new_track = function (metadb) {
        if (g_properties.track_mode !== track_modes.selected) {
            this.get_album_art();
        }
    };
    this.playback_stop = function (reason) {
        if (reason !== 2 && g_properties.track_mode !== track_modes.selected) {
            this.get_album_art();
        }
    };
    this.mouse_move = function (x, y, m) {
        if (thumbs && g_properties.show_thumbs) {
            thumbs.btns.move(x, y);
        }
    };
    this.mouse_lbtn_down = function (x, y, m) {
        if (thumbs && g_properties.show_thumbs) {
            thumbs.btns.lbtn_down(x, y);
        }
    };
    this.mouse_lbtn_dblclk = function () {
        if (!art_arr[cur_art_id]) {
            return;
        }

        _.run(art_arr[cur_art_id].path);
    };
    this.mouse_lbtn_up = function (x, y, m) {
        if (thumbs && g_properties.show_thumbs) {
            thumbs.btns.lbtn_up(x, y);
        }
    };
    this.mouse_wheel = function (delta) {
        if (feature_cycle) {
            var prev_art_id = cur_art_id;

            do {
                if (delta === -1) {
                    cur_art_id === artType.lastVal ? cur_art_id = artType.firstVal : ++cur_art_id;
                }
                else if (delta === 1) {
                    cur_art_id === artType.firstVal ? cur_art_id = artType.lastVal : --cur_art_id;
                }
            } while (prev_art_id !== cur_art_id && !art_arr[cur_art_id]);

            if (prev_art_id !== cur_art_id) {
                reposition_art();
                this.repaint();
            }
        }
    };
    this.mouse_leave = function () {
        if (thumbs && g_properties.show_thumbs) {
            thumbs.btns.leave();
        }
    };
    //</editor-fold>

    // End of Callback methods implementation
    /////////////////////////////////////

    this.get_album_art = function () {
        if (!was_on_size_called) {
            return;
        }

        var metadb = get_current_metadb();
        if (!metadb) {
            this.clear_art();
            return;
        }

        // Separate case when we don't have any info from others
        if (_.tf('[' + g_properties.group_format_query + ']', metadb) === '') {
            currentAlbum = '';
        }
        else {
            currentAlbum = _.tf(g_properties.group_format_query, metadb);
        }

        if (currentAlbum.length > 0 && oldAlbum === currentAlbum) {
            if (art_arr[cur_art_id] === null) {
                this.repaint();
            }
            return;
        }

        cur_art_id = artType.defaultVal; // TODO: consider not changing art type when using reload

        art_arr.forEach(function (item, i) {
            art_arr[i] = undefined;
        });

        if (thumbs) {
            thumbs.clear_thumb_images();
        }
        this.repaint();

        if (albumTimer) {
            clearInterval(albumTimer);
            albumTimer = null;
        }

        var artID = artType.firstVal;

        albumTimer = setInterval(function () {
            utils.GetAlbumArtAsync(window.ID, metadb, (artID === artType.artist) ? artID = g_album_art_id.artist : artID);

            if (artID >= artType.lastVal) {
                clearInterval(albumTimer);
                albumTimer = null;
            }
            else {
                ++artID;
            }
        }, 200);

        oldAlbum = currentAlbum;
    };

    this.reload_art = function () {
        oldAlbum = currentAlbum = undefined;

        this.get_album_art();
    };

    this.clear_art = function () {
        art_arr.forEach(function (item, i) {
            art_arr[i] = null;
        });
        if (thumbs) {
            thumbs.clear_thumb_images();
        }

        oldAlbum = currentAlbum = undefined;
        reposition_art();

        this.repaint();
    };

    this.set_track_mode = function(mode) {
        g_properties.track_mode = mode;
    };

    this.append_menu_to = function (parent_menu) {
        var metadb = get_current_metadb();

        if (thumbs) {
            var thumb_cm = new Context.Menu('Thumbs');
            parent_menu.append(thumb_cm);

            thumb_cm.append_item(
                'Thumbs show',
                _.bind(function () {
                    g_properties.show_thumbs = !g_properties.show_thumbs;
                    on_thumb_position_change();
                }, this),
                {is_checked: g_properties.show_thumbs}
            );

            thumb_cm.append_separator();

            var options = {is_grayed_out: !g_properties.show_thumbs};
            thumb_cm.append_item(
                'Thumbs left',
                _.bind(function () {
                    thumbs.change_position(this.x, this.y, this.w, this.h, pos.left);
                    on_thumb_position_change();
                }, this),
                options
            );

            thumb_cm.append_item(
                'Thumbs top',
                _.bind(function () {
                    thumbs.change_position(this.x, this.y, this.w, this.h, pos.top);
                    on_thumb_position_change();
                }, this),
                options
            );

            thumb_cm.append_item(
                'Thumbs right',
                _.bind(function () {
                    thumbs.change_position(this.x, this.y, this.w, this.h, pos.right);
                    on_thumb_position_change();
                }, this),
                options
            );

            thumb_cm.append_item(
                'Thumbs bottom',
                _.bind(function () {
                    thumbs.change_position(this.x, this.y, this.w, this.h, pos.bottom);
                    on_thumb_position_change();
                }, this),
                options
            );

            thumb_cm.radio_check(2, g_properties.thumb_position - 1);
        }

        var track = new Context.Menu('Displayed track');
        parent_menu.append(track);

        track.append_item(
            'Automatic (current selection/playing item)',
            _.bind(function () {
                g_properties.track_mode = track_modes.auto;
                this.get_album_art();
            }, this)
        );
        track.append_item(
            'Playing item',
            _.bind(function () {
                g_properties.track_mode = track_modes.playing;
                this.get_album_art();
            }, this)
        );
        track.append_item(
            'Current selection',
            _.bind(function () {
                g_properties.track_mode = track_modes.selected;
                this.get_album_art();
            }, this)
        );

        track.radio_check(0, g_properties.track_mode - 1);

        if (feature_cycle) {
            var cycle = new Context.Menu('Cycle covers');
            parent_menu.append(cycle);

            cycle.append_item(
                'Enable cycle',
                function () {
                    g_properties.enable_cycle = !g_properties.enable_cycle;
                    trigger_cycle_timer(g_properties.enable_cycle, art_arr.length);
                },
                {is_checked: g_properties.enable_cycle}
            );

            cycle.append_separator();

            var cycle_intervals = [
                ['5 sec', 5000],
                ['10 sec', 10000],
                ['20 sec', 20000],
                ['30 sec', 30000],
                ['40 sec', 40000],
                ['50 sec', 50000],
                ['1 min', 60000],
                ['2 min', 120000],
                ['3 min', 180000],
                ['4 min', 240000],
                ['5 min', 300000]
            ];

            cycle_intervals.forEach(function (item) {
                var options = {is_grayed_out: !g_properties.enable_cycle};
                if (g_properties.cycle_interval === item[1]) {
                    options.is_radio_checked = true;
                }

                cycle.append_item(
                    item[0],
                    function (interval) {
                        g_properties.cycle_interval = interval;
                        trigger_cycle_timer(g_properties.enable_cycle, art_arr.length, true);
                    }.bind(null, item[1]),
                    options
                );
            });
        }

        parent_menu.append_separator();

        parent_menu.append_item(
            'Use disc mask',
            _.bind(function () {
                g_properties.use_disc_mask = !g_properties.use_disc_mask;
                this.reload_art();
            }, this),
            {is_checked: g_properties.use_disc_mask}
        );

        if (art_arr[cur_art_id]) {
            parent_menu.append_item(
                'Open image',
                function () {
                    _.run(art_arr[cur_art_id].path);
                },
                {is_grayed_out: art_arr[cur_art_id].is_embedded}
            );

            if (has_photoshop) {
                parent_menu.append_item(
                    'Open image with Photoshop',
                    function () {
                        _.runCmd('Photoshop ' + '\"' + art_arr[cur_art_id].path + '\"');
                    },
                    {is_grayed_out: art_arr[cur_art_id].is_embedded}
                );
            }

            parent_menu.append_item(
                'Open image folder',
                function () {
                    _.explorer(art_arr[cur_art_id].path);
                },
                {is_grayed_out: !_.isFile(art_arr[cur_art_id].is_embedded)}
            );
        }

        parent_menu.append_separator();

        parent_menu.append_item(
            'Reload \tF5',
            _.bind(function () {
                this.reload_art();
            }, this)
        );

        //---> Weblinks
        parent_menu.append_separator();

        var web = new Context.Menu('Weblinks', {is_grayed_out: !metadb});
        parent_menu.append(web);

        var web_links = [
            ['Google', 'google'],
            ['Google Images', 'googleImages'],
            ['eCover', 'eCover'],
            ['Wikipedia', 'wikipedia'],
            ['YouTube', 'youTube'],
            ['Last FM', 'lastFM'],
            ['Discogs', 'discogs']
        ];

        web_links.forEach(function (item) {
            web.append_item(
                item[0],
                function (url) {
                    qwr_utils.link(url, metadb);
                }.bind(null, item[1])
            );
        });
    };

//private:
    function reposition_art() {
        var art = art_arr[cur_art_id];
        if (!art) {
            return;
        }

        var art_left_margin = 0;
        var art_top_margin = 0;
        var art_right_margin = 0;
        var art_bottom_margin = 0;

        if (thumbs && g_properties.show_thumbs) {
            var thumbsMargin = thumbs.size + g_properties.thumb_margin;

            art_left_margin = g_properties.thumb_position === pos.left ? thumbsMargin : 0;
            art_top_margin = g_properties.thumb_position === pos.top ? thumbsMargin : 0;
            art_right_margin = g_properties.thumb_position === pos.right ? thumbsMargin : 0;
            art_bottom_margin = g_properties.thumb_position === pos.bottom ? thumbsMargin : 0;
        }

        var art_img_w = art.img.Width,
            art_img_h = art.img.Height;

        var scale_x = 0,
            scale_y = 0,
            scale_w = ( that.w - art_left_margin - art_right_margin ) / art_img_w,
            scale_h = ( that.h - art_top_margin - art_bottom_margin ) / art_img_h,
            scale = Math.min(scale_w, scale_h);

        if (scale_w < scale_h) {
            scale_y = Math.floor((( that.h - art_top_margin - art_bottom_margin ) - (art_img_h * scale) ) / 2);
        }
        else if (scale_w > scale_h) {
            scale_x = Math.floor((( that.w - art_left_margin - art_right_margin ) - (art_img_w * scale) ) / 2);
        }

        art_w = Math.max(0, Math.floor(art_img_w * scale));
        art_h = Math.max(0, Math.floor(art_img_h * scale));
        art_x = scale_x + art_left_margin;
        art_y = scale_y + art_top_margin;
    }

    function get_current_metadb() {
        var metadb = null;
        switch (g_properties.track_mode) {
            case track_modes.auto: {
                if (fb.IsPlaying) {
                    metadb = fb.GetNowPlaying();
                }
                else {
                    metadb = fb.GetFocusItem();
                }
                break;
            }
            case track_modes.selected: {
                metadb = fb.GetFocusItem();
                break;
            }
            case track_modes.playing: {
                if (fb.IsPlaying) {
                    metadb = fb.GetNowPlaying();
                }
                break;
            }
        }

        return metadb;
    }

    function trigger_cycle_timer(enable_cycle, artLength, restartCycle) {
        if (cycle_timer && (!enable_cycle || !art_arr[cur_art_id] || artLength <= 1 || restartCycle)) {
            clearInterval(cycle_timer);
            cycle_timer = null;
        }

        if (enable_cycle && !cycle_timer && artLength > 1) {
            cycle_timer = setInterval(function () {
                that.mouse_wheel(-1);
            }, g_properties.cycle_interval);
        }
    }

    function coverSwitch(id) {
        if (!art_arr[id]) {
            return;
        }

        cur_art_id = id;

        reposition_art();
        that.repaint();
    }

    function on_thumb_position_change() {
        reposition_art();
        that.repaint();
    }

//public:
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

//private:
    var that = this;

    var pos = Thumbs.pos;

    var artType =
        {
            front:  0,
            back:   1,
            cd:     2,
            artist: 3,

            defaultVal: 0,
            firstVal:   0,
            lastVal:    3
        };

    var track_modes =
        {
            auto:     1,
            playing:  2,
            selected: 3
        };

    var border_size = 2;

    var feature_border = optional_args && optional_args.border;
    var feature_thumbs = optional_args && optional_args.thumbs;
    var feature_cycle = optional_args && optional_args.auto_cycle;

    var frame_color = g_theme.colors.panel_line;

    /** @type {?string} */
    var oldAlbum = undefined;
    /** @type {?string} */
    var currentAlbum = undefined;
    var albumTimer = null;

    var art_x = 0;
    var art_y = 0;
    var art_w = 0;
    var art_h = 0;

    var cur_art_id = artType.defaultVal;
    var art_arr = (function(){
        var arr = [];
        for (var i = artType.firstVal; i < artType.lastVal; ++i) {
            arr[i] = null;
        }
        return arr;
    })();

    var has_photoshop;
    var was_on_size_called = false;

    var cycle_timer = null;

    if (feature_thumbs) {
        g_properties.add_properties(
            {
                show_thumbs:    ['user.art.thumbs.show', false],
                thumb_margin:   ['user.art.thumbs.margin', 15],
                thumb_size:     ['user.art.thumbs.size', 50],
                thumb_padding:  ['user.art.thumbs.padding', 10],
                thumb_position: ['user.art.thumbs.position', 4]
            }
        );
        g_properties.thumb_position = Math.max(1, Math.min(4, g_properties.thumb_position));
    }
    else if (g_properties.show_thumbs === true) {
        g_properties.show_thumbs = false;
    }

    if (feature_cycle) {
        g_properties.add_properties({
                enable_cycle:   ['user.art.cycle.enable', false],
                cycle_interval: ['user.art.cycle.interval', 10000]
            }
        );
    }

    // objects
    var thumbs = feature_thumbs ? new Thumbs(coverSwitch) : null;

    (function () {
        try {
            WshShell.RegRead("HKEY_CURRENT_USER\\Software\\Adobe\\Photoshop\\");
            has_photoshop = true;
        } catch (e) {
            has_photoshop = false;
        }
    })();
}

function Thumbs(cover_switch_callback_arg) {
    this.on_paint = function (gr) {
        this.btns.paint(gr);
    };

    this.reposition = function (wx, wy, ww, wh) {
        var old_w = this.w;
        var old_h = this.h;

        this.size = Math.min(/** @type{number} */ g_properties.thumb_size, Math.floor(((is_vertical ? wh : ww) - g_properties.thumb_padding * 3) / 4));

        if (is_vertical) {
            this.w = this.size;
            this.h = Math.min(this.size * 4 + g_properties.thumb_padding * 3, wh);
        }
        else {
            this.w = Math.min(this.size * 4 + g_properties.thumb_padding * 3, ww);
            this.h = this.size;
        }

        if (old_w !== this.w || old_h !== this.h) {
            this.create_default_thumb_images();
            this.create_thumbs_from_imgs();
        }

        this.x = wx;
        this.y = wy;
        switch (g_properties.thumb_position) {
            case pos.left:
                this.y += Math.round((wh - this.h) / 2);
                break;
            case pos.right:
                this.x += ww - this.w;
                this.y += Math.round((wh - this.h) / 2);
                break;
            case pos.top:
                this.x += Math.round((ww - this.w) / 2);
                break;
            case pos.bottom:
                this.x += Math.round((ww - this.w) / 2);
                this.y += wh - this.h;
                break;
        }

        this.create_thumb_objects();
        this.refill_thumb_images();
    };

    var throttled_repaint = _.throttle(_.bind(function () {
        window.RepaintRect(this.x, this.y, this.w, this.h);
    }, this), 1000 / 60);
    this.repaint = function () {
        throttled_repaint();
    };

    this.create_thumb_objects = function () {
        if (this.btns) {
            this.btns.reset();
        }

        this.btns = new _.buttons();

        var p = g_properties.thumb_padding;

        var x = this.x,
            y = this.y;
        var w = Math.min(/** @type{number} */ g_properties.thumb_size, Math.max(Math.floor(((is_vertical ? this.h : this.w) - 3 * p) / 4), 0));
        var h = w;

        this.btns.buttons.front = new _.button(x, y, w, h, default_thumb_imgs.front, function () {cover_switch_callback(0);}, 'Front');

        x += (is_vertical ? 0 : (w + p));
        y += (is_vertical ? (w + p) : 0);
        this.btns.buttons.back = new _.button(x, y, w, h, default_thumb_imgs.back, function () {cover_switch_callback(1);}, 'Back');

        x += (is_vertical ? 0 : (w + p));
        y += (is_vertical ? (w + p) : 0);
        this.btns.buttons.cd = new _.button(x, y, w, h, default_thumb_imgs.cd, function () {cover_switch_callback(2);}, 'CD');

        x += (is_vertical ? 0 : (w + p));
        y += (is_vertical ? (w + p) : 0);
        this.btns.buttons.artist = new _.button(x, y, w, h, default_thumb_imgs.artist, function () {cover_switch_callback(3);}, 'Artist');
    };

    this.on_art_get = function (art_id, original_art_img) {
        original_art_imgs[art_id] = original_art_img;
        thumb_imgs[art_id] = this.create_thumb_from_img(original_art_img);
        this.fill_thumb_image_by_id(0, thumb_imgs[art_id]);
    };

    this.create_thumbs_from_imgs = function () {
        original_art_imgs.forEach(_.bind(function (item, i) {
            thumb_imgs[i] = this.create_thumb_from_img(item);
        }, this));
    };

    this.create_thumb_from_img = function (image) {
        var ratio = image.Height / image.Width;
        var art_h = this.size - 2 * border_size;
        var art_w = this.size - 2 * border_size;
        if (image.Height > image.Width) {
            art_w = Math.round(art_h / ratio);
        }
        else {
            art_h = Math.round(art_w * ratio);
        }

        return image.Resize(art_w, art_h);
    };

    this.clear_thumb_images = function () {
        if (!this.btns) {
            return;
        }

        original_art_imgs = [];
        thumb_imgs = [];
        this.refill_thumb_images();
    };

    this.refill_thumb_images = function () {
        this.fill_thumb_image_by_id(0, thumb_imgs[0]);
        this.fill_thumb_image_by_id(1, thumb_imgs[1]);
        this.fill_thumb_image_by_id(2, thumb_imgs[2]);
        this.fill_thumb_image_by_id(3, thumb_imgs[3]);
    };

    this.fill_thumb_image_by_id = function (art_id, art_img) {
        var btnName;
        switch (art_id) {
            case 0: {
                btnName = 'front';
                break;
            }
            case 1: {
                btnName = 'back';
                break;
            }
            case 2: {
                btnName = 'cd';
                break;
            }
            case 3: {
                btnName = 'artist';
                break;
            }
        }

        var img_arr = default_thumb_imgs[btnName];
        var btn = this.btns.buttons[btnName];
        if (art_img) {
            img_arr =
                {
                    normal:  this.create_thumb_image(btn.w, btn.h, art_img, 0, btn.tiptext),
                    hover:   this.create_thumb_image(btn.w, btn.h, art_img, 1, btn.tiptext),
                    pressed: this.create_thumb_image(btn.w, btn.h, art_img, 2, btn.tiptext)
                };
        }
        btn.set_image(img_arr);
    };

    this.create_default_thumb_images = function () {
        var btn =
            {
                front:  {
                    text: 'Front'
                },
                back:   {
                    text: 'Back'
                },
                cd:     {
                    text: 'CD'
                },
                artist: {
                    text: 'Artist'
                }
            };

        default_thumb_imgs = [];
        _.forEach(btn, _.bind(function (item, i) {
            var stateImages = []; //0=normal, 1=hover, 2=down;

            for (var s = 0; s <= 2; s++) {
                stateImages[s] = this.create_thumb_image(this.size, this.size, 0, s, item.text);
            }

            default_thumb_imgs[i] =
                {
                    normal:  stateImages[0],
                    hover:   stateImages[1],
                    pressed: stateImages[2]
                };
        }, this));
    };

    this.create_thumb_image = function (bw, bh, art_img, state, btnText) {
        var img = gdi.CreateImage(bw, bh);
        var g = img.GetGraphics();
        g.SetSmoothingMode(SmoothingMode.HighQuality);
        g.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

        var p = border_size;
        var x = 0;
        var y = 0;
        var w = bw;
        var h = bh;

        if (art_img) {
            x = Math.round((bw - (art_img.Width + 2 * border_size)) / 2);
            y = Math.round((bh - (art_img.Height + 2 * border_size)) / 2);
            w = art_img.Width + 2 * border_size;
            h = art_img.Height + 2 * border_size;
        }

        if (art_img) {
            g.DrawImage(art_img, x + p, y + p, art_img.Width, art_img.Height, 0, 0, art_img.Width, art_img.Height, 0, 230);
        }
        else {
            g.FillSolidRect(x + p, y + p, w - x - 2 * p, h - y - 2 * p, g_theme.colors.panel_back); // Cleartype is borked, if drawn without background
            var btn_text_format = g_string_format.align_center | g_string_format.trim_ellipsis_char | g_string_format.no_wrap;
            g.DrawString(btnText, gdi.font('Segoe Ui', 14), _.RGB(70, 70, 70), 0, 0, w, h, btn_text_format);
        }

        switch (state) {//0=normal, 1=hover, 2=down;
            case 0:
                g.DrawRect(x, y, w - 1, h - 1, 1, frame_color);
                break;
            case 1:
                g.DrawRect(x, y, w - 1, h - 1, 1, _.RGB(170, 172, 174));
                break;
            case 2:
                g.DrawRect(x, y, w - 1, h - 1, 1, _.RGB(70, 70, 70));
                break;
        }

        img.ReleaseGraphics(g);
        return img;
    };

    this.change_position = function (wx, wy, ww, wh, new_pos) {
        is_vertical = (new_pos === pos.left || new_pos === pos.right);
        g_properties.thumb_position = new_pos;

        this.reposition(wx, wy, ww, wh);
    };

    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    this.btns = new _.buttons();
    this.size = g_properties.thumb_size;

    var that = this;

    var border_size = 2;
    var frame_color = g_theme.colors.panel_line;
    var pos = Thumbs.pos;

    var original_art_imgs = [];
    var thumb_imgs = [];
    var default_thumb_imgs = [];

    var cover_switch_callback = cover_switch_callback_arg;

    var is_vertical = (g_properties.thumb_position === pos.left || g_properties.thumb_position === pos.right);

    this.create_default_thumb_images();
}

Thumbs.pos = {
    left:   1,
    top:    2,
    right:  3,
    bottom: 4
};
