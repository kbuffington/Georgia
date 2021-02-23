## Georgia
[![donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9LW4ABRYXG2DY&source=url)

Georgia is a theme for foobar2000 designed to change dynamically based on album art. It's original purpose was to be used on a HTPC so it has large album artwork, plenty of logos and other eye candy. Over time it's evolved to add a playlist and other features which make it perfectly suitable for using on a desktop as well. It can be run in a window and it resizes pretty well, but it usually looks best at full screen.

Georgia supports 4k resolutions, and will adjust theme elements based on window size. It also supports both a dark mode (default) and light mode.

Dark Mode:
![Lights](https://i.imgur.com/Eu9Q1Mv.jpg)
Light Mode:
![BladeRunner 2049](https://i.imgur.com/pspQQeb.png)
Gallery of images [here](https://imgur.com/a/TtjUS) with explanation of some of the features.




### Theme Highlights and Secrets

* I think I invented the first "fanart" theme several years ago, and Georgia is the culmination of years of work on that front. It's designed to look amazing and display your artwork front and center. If you have Cycle Through All Artwork enabled, it will first show folder.jpg and then every 30 seconds switch to the next artwork in the folder. It can also display cdArt and vinylArt as well. These images are NOT automatically downloaded, but you can get them from [fanart.tv](https://fanart.tv). I recommend using AlbumArtDownloader for this. cdArt needs to be named either cd.png or cd1.png, cd2.png, etc. If you include a number, then the correct cdArt will be shown for the currently playing album.
* This theme is heavily dependent on special tags, which may be non-standard. Right clicking on the JScript Panel allows you to open the Properties page. If you scroll down to the "Tag Fields" section you can change the title-formatting strings for almost every field displayed.
* The theme is vinyl friendly! If the "Use Vinyl Style Numbering if Available" option is checked, the theme will look for `%vinyl side%` and `%vinyl tracknumber%` fields (configurable in the properties page!) and if it finds them you your track numbers will look like "A1" and "B4" instead of "01". Also sometimes fanart.tv has vinylArt available for albums. You can save those files as `vinyl.png` or `vinylA.png`, `vinylB.png` and the correct images will be used.
* Theme includes a "timeline" bar between the Title and Album Name which is a graphical representation of the songs lifetime in your library. If you're using foo_playcount and foo_enhanced_playcount the timeline bar it will look something like [this](https://imgur.com/2tChYuD). The left edge is when the song was first added to your library and the right edge is the current moment in time. The darker bar on the left is the time between added and first played, and the light bar on the right is time between last_played and today. If you have foo_enhanced_playcount, every song play in it's database will be reflected as a vertical line. If you play the song multiple times on the same day (and all plays map to the same pixel) that line will get darker.
* The playlist has Hyperlinks! Mouse over Artist, Year, Genre, or Record Label and you should see a line appear underneath. Clicking on it will search your library for all songs with those values. These hyperlinks are also multi-value aware in case you have multiple genres or record labels listed.
* Check out the options menu. It will allow you to easily change many visual settings, and configure certain theme settings. These options will be updated frequently as the theme is developed.
* Occasionally the theme might choose a sub-optimal theme color from the album art. Maybe it's just a little bit off, or it clashes, or is too bright, etc. You can force the theme to use a different color by adding a THEMECOLOR field to the files and specifying the color like **rgb(153, 24, 75)**. You can get the RGB values from an image editor, or by turning on *Theme debug output* in the debug settings and seeing what other colors were extracted from the image.
* And lots more...


### Help

The official discussion thread for this theme is located at [Hydrogen Audio](https://hydrogenaud.io/index.php/topic,116190.0.html]), and that's a great place to go for questions and other support issues. Support can also commonly be found in the [foobar subreddit](https://reddit.com/r/foobar2000). If you discover a bug, please open an issue on github if you can. That makes things easier to track.

### Thanks

Thanks goes to Peter for fb2k. Also massive thanks to Marc2003 for foo_jscript_panel. Also, 90% of the playlist is ripped directly from TheQwertiest's amazing "CaTRoX (QWR)" theme. Thanks to him for his hard work, putting up with my stupid ideas, and letting me use it here. The LibraryTree is all WilB's work, I just modified it to fit the theme and stripped out a few of the more advanced features that would be hard to support.

Also, I want to thank the Hydrogen Audio and Reddit community for supporting this theme from the get-go, providing valuable feedback, testing, the occasional beer, and making tons of requests. It's all very much appreciated.