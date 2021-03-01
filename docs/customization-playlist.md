---
layout: default
title: Playlist
parent: Customizing Georgia
nav_order: 2
---
# Customizing the Playlist
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

* TOC
{:toc}

## Playlist Settings Menu

There is an extensive list of options that can be enabled and disabled in the Options >> Playlist Settings menu:

![Playlist settings menu](https://user-images.githubusercontent.com/2282004/109109623-3f8ce800-76fb-11eb-9745-1e7e4608f3dd.png){: width="614px"}

Sizes for the playlist can be adjusted if headers/rows are too big or too small, if you prefer compact headers, and more.

## Playlist Context Menu

While most of the visual aspects of the playlist can be controlled by the Playlist Settings menu, many options related to functionality of the Playlist are only available within the right-click context menu.

![right-click context menu](https://user-images.githubusercontent.com/2282004/109110187-3fd9b300-76fc-11eb-9254-64ac167b86d2.png){: width="700px"}

### Playlist Grouping

The playlist grouping and group headers can be changed by choosing a different selection from the Right-click >> Playlist Grouping menu. Six presets are pre-defined for you, and more can be added, or defaults set by selecting "Manage Presets". This will open up a new dialog:

![Manage Presets Dialog](https://user-images.githubusercontent.com/2282004/109113416-da88c080-7701-11eb-85fd-5941488e827d.png){: width="700px"}

From this dialog, grouping presets can be added, removed, or rearranged. If you find a preset you want to always use, click "Set as Default".

When editing a grouping preset there are 7 different values that can be set:

- Preset Name - The name shown only in the list box to the left
- Grouping Query - How adjacent tracks in the playlist will be separated into groups. This does no sorting and will not change the order of tracks in the playlist, just adds group headers in between them. If the Grouping query is "%album artist% %album% %discnumber%" and "Show Disc Header" is enabled, a new group will be created for each track that does not have the same value for "%album artist% %album%" (when show CD# is checked %discnumber% and %discsubtitle% are deleted from the grouping query as disc headers will be added).
    - Example 1: Grouping query of "%album artist% %album% %discnumber%" and [multiple releases are combined under one group header](https://user-images.githubusercontent.com/2282004/109112491-63066180-7700-11eb-8b27-b8078f0b20b0.png).
    - Example 2: Disabling "Show Disc Header" so that %discnumber% is evaluated in the grouping query. Creates multiple group headers, [one for each disc]((https://user-images.githubusercontent.com/2282004/109112800-d27c5100-7700-11eb-908f-59f99ce0b78b.png)).
    - Example 3: Grouping query of "%album artist% %album% %discnumber% %edition% %codec%". Each version of the release gets [a single group header](https://user-images.githubusercontent.com/2282004/109112918-05264980-7701-11eb-823a-a9a3c3096210.png) and discs within a release get individual disc headers.
- Title Query - The first line of the Group Header. By default the album artist. "Metallica" [in this example](https://user-images.githubusercontent.com/2282004/109113116-52a2b680-7701-11eb-8a79-eb6371eedad2.png).
- Sub-title Query - The second line of the Group Header. "Master of Puppets [DCC 24k Gold Disc Remaster]" [in this example](https://user-images.githubusercontent.com/2282004/109113116-52a2b680-7701-11eb-8a79-eb6371eedad2.png).
- Description - What text to show in the Group Header context menu
- Show Date - Show the year/date in the right of the group header?
- Show Disc Headers - Whether to create [disc headers](https://user-images.githubusercontent.com/2282004/109113541-09069b80-7702-11eb-8497-221ac342a101.png) and filter out %discnumber% from the grouping query or not

### Playlist Sorting

Many methods of creating playlists or sending files to existing playlist, including some ways this theme creates playlists, will result in files that are not sorted properly. You can use the right-click context >> Sort menu to choose a method to sort the existing playlist. This is **not** a default sort, and may need to be done every time a new playlist is created.

### Weblinks

These menu entries allow you to automatically search Google, Wikipedia and other sites for information about the currently selected song's artist or album. If you don't use these links, the entire weblinks sub-menu can be hidden from the Playlist Settings menu.