## Installation Instructions

Unlike most themes I don't include an .fcl with mine. This makes getting setup *slightly* more work for you, but ensures that you can use it however you want. It works with both DUI and CUI, and all it really requires is a single [JScript Panel](https://github.com/kbuffington/foo_jscript_panel/releases) version 2.1.1 or greater (tested up through 2.3.5).

I run the theme in Columns UI with a super simple setup using the JScript Panel, an auto-hiding vertical splitter, and two filter panels. You can see my setup [here](https://imgur.com/nJ71Vn1). Currently there's no library search mechanism built in, so unless you use foo_http_control (which I also recommend for HTPC use!), choosing what to play will be limited to your current playlists.

### Step-by-step guide (please follow closely)

1. Close foobar
2. Download this theme from the [releases page](https://github.com/kbuffington/Georgia/releases).
3. Extract it into a folder named `georgia` to your foobar profile folder. On a non-portable installation this will typically be `C:\Users\<USERNAME>\AppData\Roaming\foobar2000`.
4. Open up the `\georgia\fonts` folder and install all fonts located there. If you miss this step things will look terrible. **Note**: If you are using Windows XP or Vista, also install the fonts from `\georgia\fonts\windows-system-fonts` otherwise skip these.
5. *(Optional Step)*  Download any of the image packs you like and place them in a folder called `images` in your foobar profile folder (**Not** in the `\georgia` folder). See below for image pack locations.
6. If you don't have a version of foo_spider_monkey_panel 1.4 or greater installed already, grab the latest version [here](https://github.com/TheQwertiest/foo_spider_monkey_panel/releases).
7. *(Optional Step)* This theme also makes heavy use of [the foo_enhanced_playcount](https://www.foobar2000.org/components/view/foo_enhanced_playcount) component. I recommend installing that as well, otherwise the timeline will not be as interesting. You'll probably also want [foo_playcount](https://www.foobar2000.org/components/view/foo_playcount) if you don't have that one yet.
8. Now add Spider Monkey Panel to a new theme. If you're using CUI I recommend the setup I'm [using](https://imgur.com/nJ71Vn1) but feel free to configure it how you want. Typically it will look best if the panel takes up the majority of foobar. Close foobar's properties.
9. Now right click on the Spider Monkey panel and select Configure. In the dialog that opens up select "File" under Script Source and then click the three dots and browse and select the `georgia-theme.js` file. It should look something like [this](https://i.imgur.com/qzq5AAF.png). Hit OK and if you followed the instructions, the theme should have loaded working properly. If it didn't, check the console for more information.
10. If the theme loaded, the last step is to verify that all optional items are installed correctly. Go to the Help => Georgia Theme Status submenu.

If everything is loaded correctly, that menu should look like this:
![theme status menu](https://user-images.githubusercontent.com/2282004/80932111-8a5ffc80-8d83-11ea-80f2-8951069b1638.png)

If something is unchecked, either you chose not to install it, or it's probably in the wrong location.

### Image Packs

These packs will all need to be extracted to a folder called `images` which you will need to create in your foobar profile folder.

* **[Record Labels](https://github.com/kbuffington/georgia-image-packs/raw/master/recordlabel.zip)**: Extract to `.../AppData/Roaming/foobar2000/images/`
* **[Artist Logos](https://github.com/kbuffington/georgia-image-packs/raw/master/artistlogos.zip)**: Extract to `.../AppData/Roaming/foobar2000/images/`
* **[Flags](https://github.com/kbuffington/georgia-image-packs/raw/master/flags.zip)**: Extract to `.../AppData/Roaming/foobar2000/images/`

##### NOTE: If installing to a portable install the images folder should be put at the root level. i.e. if foobar is at `c:\foobar\` then install the image packs to `c:\foobar\images`.
