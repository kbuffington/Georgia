---
layout: default
title: Title-Formatting Strings
parent: Configuration File
nav_order: 1
---
## Title-Formatting Strings

This following table contains every property in the `title_format_strings` config object, what it's used for, and where it appears in the UI

|Property   |Description   |Location   |
|---|---|---|
|album_subtitle|Usually an un-official name for the album; [Weezer's "Blue Album"](https://user-images.githubusercontent.com/2282004/109090486-9fbe6280-76d8-11eb-99ff-2c091fe2a81b.png)|In brackets and italics next to the album name at the top of the metadata grid and in the playlist header|
|album_translation|A translated title for the album|[Wrapped in brackets next to the album's name](https://user-images.githubusercontent.com/2282004/109090630-e4e29480-76d8-11eb-9fa4-b1975af38658.png) in the metadata grid|
|artist_country|The name or [2-letter abbreviation](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) of the artist's country used for showing flags images. Can be multi-value.|[Beside the artist's name](https://user-images.githubusercontent.com/2282004/109066344-8dc9c900-76b2-11eb-84a8-57c2dc6e5d7f.png)|
|artist|How the artist's name should be formatted|Anywhere the artist is shown|
|date|The full date listed for the album. Shows YYYY-MM-DD if possible.|In the [Playlist header](https://user-images.githubusercontent.com/2282004/109103412-78738f80-76f0-11eb-9c3d-5f7514bcaf9c.png) if ["show full date" is enabled](https://user-images.githubusercontent.com/2282004/109103324-4bbf7800-76f0-11eb-85e6-7a45a424e298.png)|
|disc_subtitle|The subtitle for the current disc, or group of tracks if you wish to separate groups of tracks in the playlist|In the [metadata grid](https://user-images.githubusercontent.com/2282004/109103756-051e4d80-76f1-11eb-90b3-30b4ba467b69.png), and [in the playlist](https://user-images.githubusercontent.com/2282004/109104549-cccb3f00-76f1-11eb-9702-04a67ea14328.png)|
|disc|The disc being played -- by default only shows if more than one disc exists|[Above the progress bar](https://user-images.githubusercontent.com/2282004/109104768-38ada780-76f2-11eb-9edb-c8aebf09ab41.png) and in the playlist [disc row headers](https://user-images.githubusercontent.com/2282004/109104549-cccb3f00-76f1-11eb-9702-04a67ea14328.png)|
|edition|The edition of the album. Typically only used if different than the standard release.|Shown in the playlist [group header](https://user-images.githubusercontent.com/2282004/109104909-84605100-76f2-11eb-9115-5ae27ad60cce.png)|
|last_played|The last time the current song was played|Used to calculate the [right edge of the played section](https://user-images.githubusercontent.com/2282004/109105407-79f28700-76f3-11eb-95be-a744b037d903.png) of the timeline|
|lyrics|Used for the embedded lyrics check|If evaluates to text, will be shown when the lyrics button is pressed|
|original_artist|The original artist that either wrote or performed the song|Shown in the italics next to the title [above the progress bar](https://user-images.githubusercontent.com/2282004/109105622-ebcad080-76f3-11eb-9314-faa5ff319aef.png) and [in the playlist](https://user-images.githubusercontent.com/2282004/109105765-2e8ca880-76f4-11eb-9467-b2321ae24877.png).|
|releaseCountry|The country where this edition was released. Can be the full country name or a [2-letter country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).|Only used to display the flag image in the [metadata grid](https://user-images.githubusercontent.com/2282004/109106157-dc985280-76f4-11eb-9adf-c3d5828e4c1c.png)
|title|The title of the currently playing track. By default includes song title translation|[Above the progress bar](https://user-images.githubusercontent.com/2282004/109106427-5f211200-76f5-11eb-93b0-560f42de01fd.png), and anywhere else the song title is shown, but not in the library or playlist|
|tracknum|How the tracknumber should be shown|Above the progress bar and [to the left of the song title](https://user-images.githubusercontent.com/2282004/109106427-5f211200-76f5-11eb-93b0-560f42de01fd.png)|
|vinyl_side|The vinyl side if it exists. "A", "B", etc. Analogous to %discnumber% for non-vinyl albums, but will always be shown if it exists and "Use vinyl style numbering" is enabled|[Above the progress bar](https://user-images.githubusercontent.com/2282004/109106864-49601c80-76f6-11eb-8777-6ad1f384bc03.png) and [in the playlist](https://user-images.githubusercontent.com/2282004/109106924-6ac10880-76f6-11eb-94bd-f4b2841d3cee.png)|
|vinyl_tracknum|The track number on the vinyl side|[Above the progress bar](https://user-images.githubusercontent.com/2282004/109106864-49601c80-76f6-11eb-8777-6ad1f384bc03.png) and [in the playlist](https://user-images.githubusercontent.com/2282004/109106924-6ac10880-76f6-11eb-94bd-f4b2841d3cee.png)|
|year|Only the four-digit year, regardless if %date% contains a YYYY-MM-DD value|In the [upper right corner](https://user-images.githubusercontent.com/2282004/109107085-b83d7580-76f6-11eb-8490-8f0fa317d24d.png) when playing a song and [in the playlist header](https://user-images.githubusercontent.com/2282004/109107150-d4d9ad80-76f6-11eb-8616-7450d9395a9f.png) if ["show full date" is disabled](https://user-images.githubusercontent.com/2282004/109103324-4bbf7800-76f0-11eb-85e6-7a45a424e298.png)|