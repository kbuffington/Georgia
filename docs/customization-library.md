---
layout: default
title: Library
parent: Customizing Georgia
nav_order: 3
---
# Customizing the Library
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

* TOC
{:toc}

## Changing font/icon sizes in the Library

Font sizing in the library works differently than it does anywhere else in the UI. Thanks to WilB's amazing work, elements of the library can be independently sized by holding down CTRL+ALT and then scrolling up or down.

There are three different elements of the Library that can be independently sized:
- Text rows (also sizes the search text at the top)
- The expand/collapse icons -- to size these you must hold down CTRL+ALT and scroll while the mouse is over the icons in the first column only
- The Filter text in the upper right corner

If you have completely screwed up the zooming, you can reset things to their defaults by clicking on Options >> Library Settings menu >> Reset library zoom.

## Library Views

You can change the way the Library groups search results by changing the library view. Right click anywhere on the background of the Library panel (not on a search result) and you'll get the View menu:

![view by year](https://user-images.githubusercontent.com/2282004/109463669-091cd900-7a2b-11eb-8d43-6419182fbb8b.png){: width="600px"}

Selecting a different view will change how the results are presented to you:

![View by album](https://user-images.githubusercontent.com/2282004/109463862-5600af80-7a2b-11eb-9784-a0c0f7a5c141.png){: width="600px"}


## Library Settings menu

There is an extensive list of options which can be customized in the Options >> Library Settings menu

![library settings menu](https://user-images.githubusercontent.com/2282004/109461124-54cd8380-7a27-11eb-97b5-e92d80dc19b4.png){: width="614px"}

#### Full line clickable

This alters the selection method to not just be the bounds of the text, but the full row:

![image](https://user-images.githubusercontent.com/2282004/109461466-c9a0bd80-7a27-11eb-80c6-a88b53a6ae8d.png){: width="700px" }

#### Root node type

This can enable or disable a root node for the tree:

![root node](https://user-images.githubusercontent.com/2282004/109461681-243a1980-7a28-11eb-8939-aa50b58e2655.png){: width="400px"}

"All Music" or the name of the View by selection (i.e. "View by Album Artist") are possible options.

#### Show tracks

Whether to add child nodes for each track under an artist/album result:

![image](https://user-images.githubusercontent.com/2282004/109462109-9e6a9e00-7a28-11eb-806e-a2e0ed015548.png){: width="400px"}

#### Send files to current playlist

By default when you select an entry in the library, the selection will replace or create a playlist called "Library". If this option is checked then the Library playlist will not be created for you and instead the current playlist will receive the files.

#### Auto-collapse nodes

When this option is enabled, only one album/artist can be expanded at once. Opening another album in the same search will collapse any others that were previously opened.