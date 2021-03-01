---
layout: default
title: Installation
nav_order: 2
---
# Installation Instructions
{: .no_toc }

Unlike most themes I don't include an .fcl with mine. This makes getting setup *slightly* more work for you, but ensures that you can use it however you want. It works with both DUI and CUI, and all it really requires is a single [Spider Monkey Panel](https://github.com/TheQwertiest/foo_spider_monkey_panel/releases) version 1.4.1 or greater.

## Table of contents
{: .no_toc .text-delta }

* TOC
{:toc}

### Step-by-step guide (please follow closely)

1. Close foobar
2. Download this theme from the [releases page](https://github.com/kbuffington/Georgia/releases).
3. Extract it into a folder named `georgia` to your foobar profile folder. On a non-portable installation this will typically be `C:\Users\<USERNAME>\AppData\Roaming\foobar2000`.
4. Open up the `\georgia\fonts` folder and install all fonts located there. If you miss this step things will look terrible. **Note**: If you are using Windows XP or Vista, also install the fonts from `\georgia\fonts\windows-system-fonts` otherwise skip these.
5. *(Optional Step)*  Download any of the image packs you like and place them in a folder called `images` in your foobar profile folder (**Not** in the `\georgia` folder). See below for image pack locations.
6. If you don't have a version of foo_spider_monkey_panel 1.4 or greater installed already, grab the latest version [here](https://github.com/TheQwertiest/foo_spider_monkey_panel/releases).
7. *(Optional Step)* This theme also makes heavy use of [the foo_enhanced_playcount](https://www.foobar2000.org/components/view/foo_enhanced_playcount) component. I recommend installing that as well, otherwise the timeline will not be as interesting. You'll probably also want [foo_playcount](https://www.foobar2000.org/components/view/foo_playcount) if you don't have that installed yet.
8. Now add a Spider Monkey Panel to a new theme. If you're using Columns UI I recommend the simplest possible layout with just a [single FSM panel](https://user-images.githubusercontent.com/2282004/109398664-d2986e80-7903-11eb-8d90-4bc7eaf91420.png)
, but you can obviously get a little [fancier](https://user-images.githubusercontent.com/2282004/109398568-4a19ce00-7903-11eb-93f0-ce1b03043d7c.png) if you want. Typically it will look best if the panel takes up the majority of foobar. Close foobar's properties.
9. Now right click on the Spider Monkey panel and select Configure. In the dialog that opens up select "File" under Script Source and then click the three dots and browse and select the `georgia-theme.js` file. It should look something like [this](https://i.imgur.com/qzq5AAF.png). Hit OK and if you followed the instructions, the theme should have loaded working properly. If it didn't, check the console for more information.
10. If the theme loaded, the last step is to verify that all optional items are installed correctly. Go to the Help => Georgia Theme Status submenu.

If everything is loaded correctly, that menu should look like this:
![theme status menu](https://user-images.githubusercontent.com/2282004/80932111-8a5ffc80-8d83-11ea-80f2-8951069b1638.png)

If something is unchecked, either you chose not to install it, or it's probably in the wrong location.

### Installation Walkthrough

<iframe width="560" height="315"
    src="https://www.youtube.com/embed/i7B1mT4iTUw"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
</iframe>

### Image Packs

These packs will all need to be extracted to a folder called `images` which you will need to create in your foobar profile folder.

* **[Record Labels](https://github.com/kbuffington/georgia-image-packs/raw/master/recordlabel.zip)**: Extract to `.../AppData/Roaming/foobar2000/images/`
* **[Artist Logos](https://github.com/kbuffington/georgia-image-packs/raw/master/artistlogos.zip)**: Extract to `.../AppData/Roaming/foobar2000/images/`
* **[Flags](https://github.com/kbuffington/georgia-image-packs/raw/master/flags.zip)**: Extract to `.../AppData/Roaming/foobar2000/images/`

##### NOTE: If installing to a portable install the images folder should be put at the root level. i.e. if foobar is at `c:\foobar\` then install the image packs to `c:\foobar\images`.
