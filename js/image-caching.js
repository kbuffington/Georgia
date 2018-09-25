function ArtCache(maxCacheSize) {
    var art_cache_max_size = maxCacheSize;
    var art_cache = {};
    var art_cache_indexes = [];
    var max_width = 1200;
    var max_height = 1600;

    this.encache = function(img, path) {
        try {
            var h = img.Height;
            var w = img.Width;
            if (h > max_width || w > max_height) {
                var scale_factor = w / max_width;
                if (scale_factor < w / max_height) {
                    scale_factor = w / max_height;
                }
                h = Math.min(h / scale_factor);
                w = Math.min(w / scale_factor);
            }
            art_cache[path] = img.Resize(w, h);
            img.Dispose();
            var pathIdx = art_cache_indexes.indexOf(path);
            if (pathIdx !== -1) {
                // remove from middle of cache and put on end
                art_cache_indexes.splice(pathIdx, 1);
            }
            art_cache_indexes.push(path);
            if (art_cache_indexes.length > art_cache_max_size) {
                var remove = art_cache_indexes.shift();
                debugLog('deleting cached img:', remove)
                disposeImg(art_cache[remove]);
                delete art_cache[remove];
            }
        } catch (e) {
            console.log('<Error: Image could not be properly parsed: ' + path + '>');
        }
        return art_cache[path] || img;
    }

    this.getImage = function(path) {
        var image = null;

        if (art_cache[path]) {
            debugLog('cache hit: ' + path);
            return art_cache[path];
        }
        return null;
    }
}
