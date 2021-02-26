---
layout: default
title: Troubleshooting
has_children: false
nav_order: 19
---
# Troubleshooting
{: .no_toc }
Various things can go wrong and this will attempt to address some of the more common issues that users encounter.

### Table of contents
{: .no_toc .text-delta }

* TOC
{:toc}

## When I play my songs, Georgia doesn't look anything like your screenshots

Lots of things could be going on here:
- Do your songs have lots of metadata tagged in them?
- Do you have the [recommended components](components.html) installed?
- Do you tag files using full dates instead of just the release year?
- Have you checked that the tag fields you're using match up with what the theme is looking for in the [config file](configuration-titleformatting.html)?
- Are you aware that artwork is not (currently) downloaded for you, especially not cdArt or vinylArt, so you have to supply your own?

## Artist/label/flags logos aren't showing up

First check the Georgia Theme Status under the Help Menu:

![image](https://user-images.githubusercontent.com/2282004/108980659-86be9e80-7651-11eb-89c3-640884a8c248.png)

If something is unchecked you either haven't downloaded the required image packs, or you downloaded them to the wrong location. If things are checked but images aren't showing up:

- Are your files tagged correctly?
- Have you checked that the tag fields you're using match up with what the theme is looking for in the [config file](configuration.html)?
- If images don't show when you have multiple values set for a field, check that foobar is correctly [configured for multi-value fields](https://user-images.githubusercontent.com/2282004/108981714-9db1c080-7652-11eb-8c23-c53347a47007.png) on %label%, %artistcountry%, %artist%, etc.

## I edited the config file and now things are screwed up

So you've edited the config file and now the theme won't load. You probably are violating some JSON rules. Make sure that the line you edited ends with a comma, _unless_ it's the last entry in an object or array. Make sure you spelled all the required properties correctly. Make sure you didn't inadvertently delete a `}` or `]`.

If none of that works, you can just delete the file and then reload Georgia and a shiny new config file will be written for you. If you have a backup containing changes you've made, just rename the file (e.g. `georgia-config-2.0.0.json` => `georgia-config.jsonc`) and then reload the theme. It will be upgraded for you.

If the theme loads properly but you've borked some of the title format fields you can always reset your config file back to it's default by using the ["Reset config file" menu item](https://user-images.githubusercontent.com/2282004/108946374-e736e700-7623-11eb-8194-eac839896c58.png) in the Options menu.
