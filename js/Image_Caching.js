//=================================================// Cover Tools
image_cache = function () {
    this._cachelist = {};

    this.hit = function (metadb) {
        var img = this._cachelist[metadb.Path];
        if (typeof img == "undefined") { // if image not in cache, we load it asynchronously
            var path = $("$replace(%path%,%filename_ext%,)folder.jpg", metadb);
            var fullSizeImg = AttemptToLoadCachedImage(path, true, false);
            if (fullSizeImg) {
                img = g_image_cache.getit(metadb, 1, fullSizeImg);
            }
            else {
                utils.GetAlbumArtAsync(window.ID, metadb, AlbumArtId.front, true, false, false);
            }
        };
        return img;
    };

    this.fetch = function (metadb) {
        return this._cachelist[metadb.Path];
    }

    this.store = function (metadb, image) {
        this._cachelist[metadb.Path] = image;
    }

    this.getit = function (metadb, track_type, image) {
        var ch=cw = rowsInGroup * rowH;
        var padding = 4
        var img;

        if(!image) {
            var pw = cw + padding * 2;
            var ph = ch + padding * 2;
        } else {
            if(image.Height>=image.Width) {
                var ratio = image.Width / image.Height;
                var pw = (cw + padding * 2) * ratio;
                var ph = ch + padding * 2;
            } else {
                var ratio = image.Height / image.Width;
                var pw = cw + padding * 2;
                var ph = (ch + padding * 2) * ratio;
            };
        };
        // cover.type : 0 = nocover, 1 = external cover, 2 = embedded cover, 3 = stream
        if(track_type!=3) {
            if(metadb) {
                img = FormatCover(image, pw, ph, showGlassReflection, false);
            };
        } else {
            img = images.stream;
            cover.type = 3;
        };
        this._cachelist[metadb.Path] = img;
        return img;
    };
};

cachedImageCompare = {};	// used for checking to see if we need to check the file size of an image in the cache to see if it has changed

function FormatCover(image, w, h, reflect, rawBitmap) {
    if(!image || w<=0 || h<=0) return image;
    if(reflect) {
        var new_img = image.Resize(w, h, 2);
        var gb = new_img.GetGraphics();
        if(h > w) {
            gb.DrawImage(glass_reflect_img, Math.floor((h-w)/2)*-1 + 1, 1, h - 2, h - 2, 0, 0, glass_reflect_img.Width, glass_reflect_img.Height, 0, 150);
        } else {
            gb.DrawImage(glass_reflect_img, 1, Math.floor((w-h)/2)*-1 + 1, w - 2, w - 2, 0, 0, glass_reflect_img.Width, glass_reflect_img.Height, 0, 150);
        };
        new_img.ReleaseGraphics(gb);
        if(rawBitmap) {
            return new_img.CreateRawBitmap();
        } else {
            return new_img;
        }
    } else {
        if(rawBitmap) {
            return image.Resize(w, h, 2).CreateRawBitmap();
        } else {
            return image.Resize(w, h, 2);
        }
    };
};

function draw_glass_reflect(w, h) {
    // Mask for glass effect
    var Mask_img = gdi.CreateImage(w, h);
    var gb = Mask_img.GetGraphics();
    gb.FillSolidRect(0,0,w,h,0xffffffff);
    gb.FillGradRect(0,0,w-20,h,0,0xaa000000,0,1.0);
    gb.SetSmoothingMode(2);
    gb.FillEllipse(-20, 25, w*2+40, h*2, 0xffffffff);
    Mask_img.ReleaseGraphics(gb);
    // drawing the white rect
    var glass_img = gdi.CreateImage(w, h);
    gb = glass_img.GetGraphics();
    gb.FillSolidRect(0, 0, w, h, 0xffffffff);
    glass_img.ReleaseGraphics(gb);
    // resizing and applying the mask
    var Mask = Mask_img.Resize(w, h);
    glass_img.ApplyMask(Mask);
    Mask.Dispose();
    return glass_img;
};
