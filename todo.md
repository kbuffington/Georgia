### My unprioritized todo list

* Handle GIFs for image types?
* Color picker menu with meta_db saving of seleted color based on arist/album/disc
* Better resolution handling for intermediate sizes (scaling? DPI based?)
* Better handling of FLAC codec information in metadata panel. Should be similar to what shows in playlist.
* Allow some default theme colors to be specified in configuration file (will need to check for progress fill/volume fill issues)
* Redo button code to something a little more sane
* Add right click copy/paste on library search box
* Lyrics long-press menu with Enable/Disable, Edit, maybe adjust timestamps for lrcs?
* Auto downloading of cdArt?
* Playlist View settings should be moved to config file, creating an object with name, filter, and optional custom sort parameter See [here](https://github.com/kbuffington/Georgia/issues/85).
* Playlist check cached artwork from other art cache?
* Add ability to manually cycle through artwork using mouse wheel. Would disable art cycling.
* Add option to prefer folder art over embedded

### Items completed
* Convert to using foo_spider_monkey_panel instead of foo_jscript (implemented in 2.0.0)
* Better lyrics handling (implemented in 2.0.0)
* Move progress bar code to ui-components and turn it into a class (implemented in 2.0.0)
* Investigate using a config.json file to control grid data, codec information, etc. (implemented in 2.0.0)
* Simplify handling of labels in playlist (actually use meta values instead of splitting on ',') (implemented in 2.0.0)
* Add option to draw labels directly on background (implemented in 2.0.0)
* Add on_playback_dynamic_info_track updates for streams (implemented in 2.0.0)
* Rewrite Library search/selection code to improve contrast on partial selected text (implemented in 2.0.3)