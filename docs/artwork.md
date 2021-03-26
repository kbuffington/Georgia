---
layout: default
title: Artwork
has_children: false
nav_order: 3
---
# Artwork
{: .no_toc }

Georgia was designed from the ground up to display big/beautiful artwork front and center. It also makes copious use of "fanart" wherever possible including the display of cd/vinyl art, band logos, label/publisher logos, country flags, and more. Because of this, there are numerous options governing the display of the various kinds of artwork and images available.

## Table of contents
{: .no_toc .text-delta }

* TOC
{:toc}

#### A note on Caching

All album art, cd/vinylArt and band logos are cached by Georgia so that it does not need to continually read from disk. Images are loaded by the theme, scaled down to a manageable size (to increase speed and lower disk usage) and then the handle to the original image is free'd at which point you could overwrite/replace/delete the original file. This means that external changes to displayed images will not be reflected in the theme without reloading it through the right click menu, or by double-clicking anywhere on the panel background (not a button, image or either the playlist or library).

## Album Art

Album art is searched based on the file patterns specified in the `imgPaths` section of the [config file](configuration.html#configuration-sections). The first matched image will be the one displayed. If the "Cycle through all artwork" entry in the options menu is selected, every 30 seconds (by default) the artwork will change to the next file matched.

The primary theme color is calculated from the first artwork found and does not update as the artwork cycles as I found it too distracting. 99% of the time, this theme color will complement the artwork well, but on occasion you might find that the color is poorly choosen or doesn't perfectly match the album art (the algorithm in foo_spider_monkey_panel which reads the image bins the various colors with rounding so colors returned may not be _exactly_ what are found in the image). If this bugs you, the theme color can be manually set by adding a `THEMECOLOR` field to files in an album and specifying the color like **rgb(153, 24, 75)**. You can get the RGB values from an image editor, or by turning on *Theme debug output* in Options >> Debug settings and seeing what other colors were extracted from the image.

If you have Cycle Through All Artwork enabled, it will first show folder.jpg and then every 30 seconds switch to the next artwork in the folder. It can also display cdArt and vinylArt as well. These images are NOT automatically downloaded,

## cdArt

![Plains of the Purple Buffalo](https://user-images.githubusercontent.com/2282004/109050573-28b8a800-769f-11eb-9346-7ee484d4eb27.png)

Georgia can display cdArt if it is found in the same or parent folder as the currently playing file. Currently Georgia only supports .png files as transparency is required to make things look correctly. By default, cdArt is expected to be titled either `cd.png` or `cd1.png`, `cd2.png`, etc., if you have individual artwork to display for each disc in the album. If your cdArt is named differently (e.g. "disc.png") you can change `settings.cdArtBasename` in the [config file](configuration.html). Any cdArt found will be removed from the list of Album Art cycled through.

In v2.0.2 a new [experimental option to spin cdArt](https://user-images.githubusercontent.com/2282004/112576303-0316df80-8dc0-11eb-822d-398bba2603d0.png) was added. This will increase CPU usage, and depending on your monitor resolution can increase foobar's memory footprint up to 1GB or more. Use at your own risk.

Be aware that cdArt is *NOT* downloaded automatically for you. They can be obtained from [fanart.tv](https://fanart.tv), and this theme follows the standards that site uses. I recommend using [AlbumArtDownloader](https://sourceforge.net/projects/album-art/) for saving this artwork.

## vinylArt

![Palms](https://user-images.githubusercontent.com/2282004/109051524-3de20680-76a0-11eb-9ad1-2f4df93a0980.png)

vinylArt functions exactly the same as cdArt above, and you can easily save any of your vinylArt as `cd.png` if you want and the theme doesn't care. The only benefit is if you have enabled the "Use vinyl style numbering if available" setting in the Options menu. If that is enabled and your songs are tagged with a %vinyl side% value then you can use `vinylA.png`, `vinylB.png`, etc., to specify which image to show for each song.

## Image Packs

Image packs enable the display of artist logos, label/publisher logos, and country flags for both artists and releases. Display of these images is of course contigent on having already downloaded the image packs, as well as having the appropriate tags in your tracks which match a logo.

Image packs can be found in [this repo](https://github.com/kbuffington/georgia-image-packs) or directly downloaded from the links below. All image packs will need to be extracted to a folder called `images` which you will need to create inside your foobar profile folder:

![image packs](https://user-images.githubusercontent.com/2282004/109053092-f492b680-76a1-11eb-807f-8cb973df24a7.png)

As you can see, the `\images` folder is next to the `\georgia` folder, and _**NOT**_ inside it.

##### NOTE: If installing to a portable install the images folder should be put at the root level. i.e. if foobar is at `c:\foobar\` then install the image packs to `c:\foobar\images`.
{: .no_toc }

You can download each of the individual packs below, or you can star the [georgia-image-packs](https://github.com/kbuffington/georgia-image-packs) repo, and only download the update packs. I try and release updated images every 2-3 months. When installing an update pack just overwrite any duplicate images as they are new or improved logos.

### Artist Logos
{: .no_toc }

* **[Artist Logos](https://github.com/kbuffington/georgia-image-packs/raw/master/artistlogos.zip)**: Extract to `%appdata%\Roaming\foobar2000\images\`

Artist logos are searched for using the %album artist% of the currently playing song. Since %album artist% is a meta field that typically evaluates to `$if2(%album artist%,%artist%)` it will usually use the `ARTIST` field. If `ARTIST` or `ALBUM ARTIST` are multi-value fields, the logo displayed will be the first logo found. So if you have a track where `ARTIST` is "Jessie J; Nicki Minaj; Ariana Grande;", and no `Jessie J.png` is found, then the `Nicki Minaj.png` logo will be displayed, even if `Ariana Grande.png` exists.

### Label/Publisher Logos
{: .no_toc }

* **[Record Labels](https://github.com/kbuffington/georgia-image-packs/raw/master/recordlabel.zip)**: Extract to `%appdata%\Roaming\foobar2000\images\`

Due to id3v2.3 standards, most music players will write "Publisher" fields to a TPUB frame which is not a multi-value frame. Because of this foo_musicbrainz and many other taggers will write these values to a `TXXX:LABEL` frame which does allow multiple values. Georgia typically assumes that `%label%` will be used whenever we wish to list the labels for a song. However, when showing Label logos the theme queries both `%publisher%` and `%label%` values, removes all duplicates, and then displays any it can find images for:

![labels](https://user-images.githubusercontent.com/2282004/109057481-66b9ca00-76a7-11eb-8e31-80afa42ef4bf.png){: width="500px"}

In the `\images\recordlabel` folder, the images are almost always stripped of " Records, " Music", and " Recordings" from the end of their file names. So the image "Atlantic.png" will match files tagged with either "Atlantic", or "Atlantic Records".

For some record labels (130 and counting!), date based logos are available. For those labels, a different logo is shown based upon when the album was released. For an album released by Roadrunner Records back in 1983, the logo will be different than one released in 1999 or today.

![Roadrunner 1983](https://user-images.githubusercontent.com/2282004/109065840-cb7a2200-76b1-11eb-8590-1e5750a9c3a2.png){: width="330px"}
![Roadrunner 1999](https://user-images.githubusercontent.com/2282004/109065874-daf96b00-76b1-11eb-868b-4d312c0f9453.png){: width="320px"}
![Roadrunner 2020](https://user-images.githubusercontent.com/2282004/109066049-198f2580-76b2-11eb-8b8b-64deef1552f6.png){: width="320px"}

### Artist Country and Release Country flags
{: .no_toc }

* **[Flags](https://github.com/kbuffington/georgia-image-packs/raw/master/flags.zip)**: Extract to `%appdata%\Roaming\foobar2000\images\`

By default, country flags will be displayed for files tagged with `%artistcountry%` and/or `%releasecountry%`. These tags can be updated by changing the values of `title_format_strings.artist_country` and `title_format_strings.releaseCountry` in the config file. If you have set artistcountry to be a multi-value field in foobar, multiple flags can be displayed:

![Slice the Cake flags](https://user-images.githubusercontent.com/2282004/109066344-8dc9c900-76b2-11eb-84a8-57c2dc6e5d7f.png){: width="403px"}

Countries can be specified using either a full string ("United States", "United Kingdom") or with the [ISO-3166 Alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 2-digit character code ("US", "UK"). Some less common countries might be difficult for users to get the exact string match for (e.g. "Saint Kitts and Nevis") and the Alpha-2 code might be preferable ("KN"), especially if it is not being displayed in the theme.