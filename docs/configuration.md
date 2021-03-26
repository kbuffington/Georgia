---
layout: default
title: Configuration File
has_children: true
nav_order: 5
---
## Configuration File
{: .no_toc }
Since version 2.0, Georgia has included a configuration file named `georgia-config.jsonc`. This file contains various configuration settings for the theme which can be edited to change the appearance and functionality.

## Table of contents
{: .no_toc .text-delta }

* TOC
{:toc}

### Editing

The configuration file format is [JSONC](https://code.visualstudio.com/docs/languages/json#_json-with-comments), JSON with comments. This file can be edited in any text editor, but I recommend VS Code since it handles these files natively. `georgia-config.jsonc` is stored in the root of the `\georgia` folder. To edit the file, you can browse to files location (typically `%appdata%\foobar2000\georgia` if following the standard instructions), or you can open the config file directly from the Options menu:

![Edit config file menu](https://user-images.githubusercontent.com/2282004/108946374-e736e700-7623-11eb-8194-eac839896c58.png)

By default Windows will not know how to handle `.jsonc` files, so you will need to specify a default editor. You can choose VS Code if you have it installed, or select any other text editor you prefer, including notepad.exe.

Because the config file is in the JSONC format, comments are interspersed throughout the file to further explain what the various settings/properties mean. Comments are ignored by Georgia's JSON parser, so you can also ignore or edit them as needed (however if the theme updates the config file, the comments will be added back in).

### Configuration Sections

- `"configVersion"` - Do not edit this unless you are testing certain upgrade scenarios. When the theme loads it will always update this value to the version of Georgia which created the file.
- `"settings"` - Various theme settings. Many of these will be discussed elsewhere in the documentation.
- `"title_format_strings"` - Title formatting strings which the theme uses instead of hardcoding. You can use this to change how certain fields appear, or to get metadata values to show up if you tag your files using different fields than I do (e.g. you can update the value of `title_format_strings.artist_country` if you write these values to `%artist country%` instead of the default value).
- `"metadataGrid"` - This is an array containing all the potential label/value pairs of metadata which will be displayed in the left hand information panel when neither the Playlist or Library views are open. Every entry in the array must contain both a `"label"`, and `"value"` property. Optionally, you can add the `"age": true` property to date metadata values to [append a string showing how long ago that date was from the current date](https://user-images.githubusercontent.com/2282004/108948026-477b5800-7627-11eb-88ee-688f2d18139a.png). If the `value` property evaluates to an empty string, the entire row will be removed from the metadataGrid, meaning you can add rows that only apply to some of the files in your collection and it won't always clutter up the display.
- `"imgPaths"` - An array containing the paths which will be searched to find images to display. If the "Cycle through all artwork" option is disabled, only the first matched image will be shown. If the "Cycle through all artwork" option is enabled, then all images found will rotate through in that order. As configured by default, images matching the `folder.*` pattern will be displayed first, and then the rest of your images will cycle in alphabetical order.
- `"lyricFilenamePatterns"` - An array containing all the possible title formatting strings to match when searching for lyrics files. Do not include paths! These file patterns will be searched for in various locations which are currently not configurable. See the lyrics section for more details.

### Upgrades

Whenever you reload Georgia, the theme will check its hardcoded version with the `configVersion` saved in `georgia-config.jsonc`. If `georgia-config.jsonc` is an older version, the configuration file will be upgraded, and any new or updated properties will be added to the configuration file. This *might* mean that in some rare occasions, a value you have edited might be overwritten with a new default. This will be done sparingly and I will attempt to notify users when it happens. 99% of the time, any existing properties will be left completely untouched.

During upgrades, the old version of the configuration file will be backed up to a new file containing the version of georgia which wrote it. For example, upgrading from 2.0.0 to 2.1.0 will create a `georgia-config-2.0.0.jsonc`. You can use these backups in case something goes wrong and you need to downgrade the version of Georgia, or so that you have a copy of your setting for any properties that might get reset to new defaults during the upgrade.

### Help, I've screwed something up!

So you've edited the config file and now the theme won't load. Just delete the file and reload Georgia and a new one will be written for you. If you have a backup containing changes you've made, just rename the file (e.g. `georgia-config-2.0.0.json` => `georgia-config.jsonc`) and then reload the theme. It will be upgraded for you.

If the theme loads properly but you've borked some of the title format fields you can always reset your config file back to it's default by using the ["Reset config file" menu item](https://user-images.githubusercontent.com/2282004/108946374-e736e700-7623-11eb-8194-eac839896c58.png) in the Options menu.
