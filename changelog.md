### v1.1.9 - 2020-??-??
 - Fix library panel not showing tracks with foo_jscript_panel 2.4.x
 - Allow specifying a custom cdart filename

### v1.1.8 - 2020-05-09
 - Random now actually randomizes playlist
 - Fixed volume control issues
 - Improved tooltip handling for buttons
 - Fixed issues with expanded volume bar disappearing and it's appearance in 4k mode
 - Fixed crash when deleting last playlist
 - CD Rotation values were bogus
 - Refactored all menus using new `Menu` helper class, which cut menu code length in half and made adding new options much easier
 - Fixed crash when using weblinks
 - Playlist row and header fonts are scalable through Options >> Playlist settings
 - Option to move transport controls below artwork
 - Visual improvements in 4k mode (ensuring spacing between elements is scaled correctly)
 - Adding Georgia entries to "Help" menu to quickly debug if the theme is installed correctly
 - Added tooltips on hovering over timeline
 - Adjust menu font sizes through options menu
 - Adjust transport button sizes through options menu

### v1.1.7 - 2020-04-11
 - Invert logos when theme primary color is dark (requires foo_jscript_panel v2.3.6)
 - Fixed crash when clicking the hyperlink to upgrade. Sorry!
 - Fixed crash when managing grouping presets
 - Added volume control
 - Album labels in playlist are now hyperlinks
 - Fixed some date timezone issues
 - Improved playlist look when tags don't have a genre

### v1.1.6 - 2019-11-13
 - Fixed startup crashes when creating buttons
 - Drag & Drop issues
 - Simplified date and timezone handling
 - Cleaned up georgia.txt
 - Improved support for foo_youtube

### v1.1.5 - 2019-10-22
 - Fixes for foo_jscript_panel 2.3.x
 - Removed unneeded files
 - Updating fonts

### v1.1.4 - 2019-08-29
 - Add check for updates

### v1.1.3 - 2019-08-28
 - Fixed broken dates
 - Fixed anti-aliasing on elapsed time when playlist is shown

### v1.1.2 - 2019-08-27
 - Playlist should always draw correctly now
 - Dates should never show as "0000"
 - Year now uses $if3(%original release date%,%originaldate%,%date%)
 - ArtCaching was using the wrong values to scale. Corrected
 - Ticks on the timeline should never show overlap the album art

### v1.1.1 - 2019-08-11
 - Crash on startup when display playlist on startup set

### v1.1.0 - 2019-08-10
 - Dark mode (new default)! Switch between the two in the options menu
 - A ton more 4k fixes
 - reiniting playlist when 4k mode switches to avoid scrollbar issues
 - accurate date difference code based on human accepted norms of what a date difference is (i.e. 1 month ago)
 - correctly handling forbidden characters when attempting to find artwork/files
 - better sorting of results when clicking on hyperlinks
 - searching dates by year only
 - Fixed a bunch of issues with Multi-channel display
 - Highlight colors in library/playlist should still allow text to be legible
 - Drastically reduced console spam

### v1.0.1 - 2019-01-23
 - Fix some 4k scaling issues
 - auto load library 10s after startup for better response time
 - fix crash in jscript 2.2.0+
 - variable font sizing for artist string

### v1.0.0 - First official release