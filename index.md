---
layout: default
title: Home
nav_order: 1
---

# Georgia
{: .no_toc }
[![donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9LW4ABRYXG2DY&source=url)

Georgia is a theme for foobar2000 designed to change dynamically based on album art. It's original purpose was to be used on a HTPC so it has large album artwork, plenty of logos and other eye candy. Over time it evolved to add a playlist, library view, and other features which make it perfectly suitable for using on a desktop as well. It can be run in a window and it resizes pretty well, but it usually looks best when run maximized to show off all your big beautiful artwork. My hope is that Georgia provides a modern take on the joy of holding a vinyl sleeve or looking through a CD booklet while the music plays.

Dark Mode:
![Lights](https://i.imgur.com/Eu9Q1Mv.jpg)
Light Mode:
![BladeRunner 2049](https://i.imgur.com/pspQQeb.png)
Gallery of images [here](https://imgur.com/a/TtjUS) with explanation of some of the features.

## Table of contents
{: .no_toc .text-delta }

* TOC
{:toc}

### Key Features

- Dynamic theme colors based on your album artwork
- Suitable for use on TVs as the centerpiece of your home theater listening experience... but also works great on desktop PCs as well
- Support for 4K resolutions
- Dark and light modes
- Georgia is a "fanart" based theme and can display artist logos, label logos and country flags for appropriately tagged files
- Displays cd disc art if available
- Vinyl friendly! Georgia can handle vinyl tracknumber style displays (A1, B3, etc.) and show vinyl disc art as well
- Visual representation of a tracks lifetime in your library and when exactly you've played it
- "Hyperlinks" which can create playlists based on an Artist, Album, Genre, Record Label, or Year
- Automatic upgrade checks so your install of Georgia is never out of date
- Show downloaded and embedded lyrics
- Endlessly customizable so you aren't stuck with how **_I_** think things should look
- And tons more...

### History and Design Philosophy

I began working on the precursor to Georgia back in 2012. It was based on a HTPC theme written for WSH Panel. I forked that code base (some vestigial remnants still remain to this day) and began the work of turning it into a piece of eye-candy. It was probably the first "fanart" style theme around. I had added a lot of features and fancy logos, but ultimately it just wasn't that pretty or fun to use. In 2017 I began doing a bunch of research into different music apps/players and then sat down with Photoshop and sketched out what I thought a more current "fanart" style theme could look like.

My goal was to create a modern, minimalist theme that rewarded heavily tagged libraries. When I started development, I created around 10 different color "themes" which were mostly unsatisfying due to the inability to accurately select one that matched the current artwork. After looking at my favorite music apps I realized I needed a way to get better information about the colors contained in the artwork. I was able to write an implementation of a color selecting algorithm ([K-Means clustering](https://en.wikipedia.org/wiki/K-means_clustering) for the nerds) for foo_jscript_panel, and then spent even more time creating a javascript algorithm that would take a JSON blob of colors and how frequently they appeared and attempt to pick that one perfect color. It ended up working pretty well and I realized that Georgia could become a thing that people were going to want to use.

I demoed it to the masses, got a ton of encouragement and feedback and began adding features and options that people wanted. What had started out as a pretty way to display artwork on my TV while I listened to music had become a full featured theme suitable for most any use case.

### Help

The official discussion thread for this theme is located at [Hydrogen Audio](https://hydrogenaud.io/index.php/topic,116190.0.html), and that's a great place to go for questions and other support issues. Support can also commonly be found in the [foobar subreddit](https://reddit.com/r/foobar2000). If you discover a bug, please open an issue on github if you can. That makes things easier to track and ensures that I can't forget about something.

### Thanks

Thanks goes to Peter for fb2k. Also massive thanks to [Marc2k3](https://github.com/marc2k3) for foo_jscript_panel which made the 1.0 versions of Georgia possible. [TheQwertiest](https://github.com/TheQwertiest) did incredible work with [foo_spider_monkey_panel](https://github.com/TheQwertiest/foo_spider_monkey_panel), which helped bring this code-base into something resembling the present and has made maintenance possible. Also, 90% of the playlist is ripped directly from his amazing "CaTRoX (QWR)" theme. Thanks to him for all of his hard work, putting up with my stupid ideas, and letting me use it here. The LibraryTree is all WilB's work, I just modified it to fit the theme and stripped out a few of the more advanced features that would be hard to support.

Also, I want to thank the Hydrogen Audio and Reddit communities for enthusiastically supporting this theme from the get-go, providing valuable feedback, testing, the occasional beer, and making tons of requests. It's all very much appreciated.