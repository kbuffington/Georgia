---
layout: default
title: Lyrics
nav_order: 9
---
## Displaying Lyrics

*Note:* Georgia can only display lyrics. It _cannot_ retrieve or save them in any way. If you need a component to download lyrics I recommend the [Lyric Show Panel 3 (foo_uie_lyrics3)](https://www.foobar2000.org/components/view/foo_uie_lyrics3) component.

Georgia can display lyrics that have been saved to your disk, or that have been written to tag fields in your files. The entire lyrics display engine was re-written from scratch in v2.0. It is faster than the 1.x version, has more features, requires half the lines of code as the old version and is considerably less buggy.

To enable lyrics display, click on the lyrics icon in the upper right.

![lyrics icon](https://user-images.githubusercontent.com/2282004/109089826-85d05000-76d7-11eb-8dac-e7973999720f.png)

### Lyrics File types

Georgia can handle both `.lrc` or `.txt` files containing lyrics. `.lrc` files typically contain time-stamped lyrics and `.txt` files typically do not, but the theme doesn't care. It will read in the first lyrics file it finds, and process it the same regardless of file type. Be aware that if a file is matched but does not contain valid lyrics Georgia will also not care and will just display whatever contents it finds.

### Synced Lyrics

Synced lyrics (whether in a .lrc file or not) will display with current line highlighting, similar to something you might see when doing karaoke. Seeking through the file will cause the "active" line to instantly update. If the .lrc file is out of sync with the actual song being played (i.e. lines appear a second or two before or after the line is sung) there's is _currently_ no way to adjust this, although it's on my Todo list.

![Rainbow - Stargazer lyrics](https://user-images.githubusercontent.com/2282004/109073568-2b75c600-76bc-11eb-9d08-cbc013f5c7e6.png)

### Where does Georgia look for Lyrics?

Georgia will first look for lyrics stored in the file itself. By default, the following metadata fields will be searched in order:

1. %synced lyrics%
2. %syncedlyrics%
3. %lyrics%
4. %lyric%
5. %unsyncedlyrics%
6. %unsynced lyrics%

If your files have lyrics saved to a different tag, just edit the value of `title_format_strings.lyrics` in the [configuration file](configuration.html).

If no lyrics tags are found, Georgia will then look for files saved on disk using the patterns specified in the `lyricFilenamePatterns` array in `georgia-config.json`. These are patterns are title-formatting strings of various common lyric naming patterns. Everyone file pattern will be tested in the following (currently) non-configurable locations:

1. local folder the currently playing song is in.
2. a folder called `\lyrics` inside fb.ProfilePath. This typically evaluates to `%appdata%\local\roaming\foobar2000\lyrics`.
3. a folder called `\lyrics` inside fb.FoobarPath. This typically evaluates to `C:\Program Files (x86)\foobar2000\lyrics`.

If a file matching one of the patterns is found, all further file tests will stop.

#### Example

You are listening to Enter Sandman by Metallica. The file contains no lyrics tags. The folder the song is in will first be searched for a file matching one of the `lyricFilenamePatterns`. If none are found it will moves to `%appdata%\local\roaming\foobar2000\lyrics`. This folder contains a file called `Metallica - Enter Sandman.txt`. This file will be loaded by Georgia and it's contents are displayed and searching will stop. If you have a file called `Metallica - Enter Sandman.lrc` inside `C:\Program Files (x86)\foobar2000\lyrics` it will not be found.