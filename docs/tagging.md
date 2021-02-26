---
layout: default
title: Tagging Files
has_children: false
nav_order: 8
---
## Tagging Your Files

Georgia looks and functions best when you tag your files liberally with lots of metadata. I have very strict standards in my library about tag field names, but I understand that no one else will follow the same standards, so this page will document some best practices and also discuss how to adjust the theme to use your own personal field names.

### Taggers to Use

I personally recommend the [foo_musicbrainz](https://www.foobar2000.org/components/view/foo_musicbrainz) tagger component as it is integrated with foobar2000, and the default tag field names are the same ones this theme has configured by default. Also, I'm the maintainer of foo_musicbrainz, and future updates to that component will be reflected in Georgia as well. Synergy!

There are plenty of other great taggers out there, but all of them will differ from the field names used in Georgia in minor/major ways. Fortunately you don't need to give up your favorite tagger or alter your workflow as you can easily edit the fields used throughout Georgia in the [config file](configuration.html).

### Georgia Uses a Different Field Name than My Files Do!

No problem! Don't update all your tags (unless you really want to)! Because of the amount of information and metadata displayed, Georgia was designed to make it easy for users to be able to change the field names that it looks up. You'll need to [open up](https://user-images.githubusercontent.com/2282004/109262772-bf808400-77c7-11eb-897f-5abfcb09e897.png) the [config file](configuration.html), and go to the `title_format_strings` section. Find the property you want to update, and just change the value.

##### Example
Let's say you tag your vinyl files using `%vinylside%`, `%vinyltrack%` and so Georgia never displays vinyl-style track notations. In the config file find this section:

![vinyl_side](https://user-images.githubusercontent.com/2282004/109263183-70871e80-77c8-11eb-8f4a-a79035ef2eab.png)

...and then edit those strings to reflect the fields tagged in your files:

![vinyl updated](https://user-images.githubusercontent.com/2282004/109263247-91e80a80-77c8-11eb-9b9f-f7133e49ceb6.png)

Save `georgia-config.jsonc` and then reload the theme (right-click on the panel background). You should now see your corrected fields showing up. Georgia only reads the config file once at startup, so any changes made in the file are not reflected until a reload occurs.

See the [Title-Formatting fields](configuration-titleformatting.html) page for a detailed list of every Title-formatting string property that Georgia uses, what that property is used for or means, and when and where in the UI that property can be seen.