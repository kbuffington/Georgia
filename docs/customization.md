---
layout: default
title: Customizing Georgia
has_children: true
nav_order: 4
---
# Customizing Georgia's Look and Feel

Georgia has a ton of different ways you can customize the theme so that it looks and acts the precise way you want it to. Many of the customization options here are available entirely from the Options menu or various right click context menus, but some of them may require editing the [configuration file](configuration.html).

## Artwork

See the [artwork documentation](artwork.html) for more information on configuring how artwork is displayed within Georgia.

## Button Icons

![function icons](https://user-images.githubusercontent.com/2282004/109260676-30be3800-77c4-11eb-8590-3973183132ae.png)

The 2.0 release introduced a new function button icon set, and added the ability to switch sets, as well as automatically recognizes new sets. You can switch back to the original function icons through the options menu:

![Options menu](https://user-images.githubusercontent.com/2282004/109263599-23f01300-77c9-11eb-88a8-1e67364f7b79.png)

If you don't like either of the icon sets, you can easily create your own by adding a new folder to the `\georgia\images\icons` [folder](https://user-images.githubusercontent.com/2282004/109261126-f6a16600-77c4-11eb-89b6-b36c0ab94ff0.png). Each set contains a `32` and `64` folder which will contain 32x32 and 64x64 icons respectively. Each folder will need to contain a [playlist.png, library.png, lyrics.png, star.png, properties.png, and settings.png](https://user-images.githubusercontent.com/2282004/109261216-20f32380-77c5-11eb-8985-da3b2dc4f189.png). Once all of those conditions are satisfied, the theme will be able to find the new set, and it will automatically be populated in the "Function icons set" menu.

## Customizing other areas of Georgia

- [Transport Controls](customization-transport.html)
- [Playlist](customization-playlist.html)
- [Library](customization-library.html)