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
                img = FormatCover(image, pw, ph, false);
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

function FormatCover(image, w, h, rawBitmap) {
    if(!image || w<=0 || h<=0) return image;
	if(rawBitmap) {
		return image.Resize(w, h, 2).CreateRawBitmap();
	} else {
		return image.Resize(w, h, 2);
	}
};

function ClearOldCachedFiles(path) {
	clearCache = fb.CreateProfiler("ClearOldCachedFiles");
	var totalSize = 0;
	var fileList = [];
	pref.max_cache_size = Math.abs(Math.min(250, pref.max_cache_size));	// don't allow cache size to be > 250 MB
	dir = fso.GetFolder(path);
	if (dir.size > pref.max_cache_size*1024*1024) {
		var files = utils.Glob(path + "\\*.*").toArray();
		for (i=0; i<files.length; i++) {	// create temp array to speed up sorting by reducing amount of GetFile calls in .sort
			fileList.push({ name: files[i], date: fso.GetFile(files[i]).DateCreated })
		}
		fileList.sort(function (a, b) {
			return b.date - a.date;	// sort descending
		});
		for (i=0; i<fileList.length; i++) {
			f = fso.GetFile(fileList[i].name);
			totalSize += f.size;
			if (totalSize < pref.max_cache_size*1024*1024) {
				console.log(fileList[i].date + " - " + fileList[i].name.substring(62));
			} else {
				// delete files
				try {
					console.log('Deleting: ' + fileList[i].date + " - " + fileList[i].name.substring(62));
					f = fso.GetFile(fileList[i].name);
					f.Delete(true);
				} catch (e) {
					console.log("unable to delete " + fileList[i].name);
				}
			}
		}
	}
	clearCache.Print();
}

