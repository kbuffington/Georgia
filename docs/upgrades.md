---
layout: default
title: Upgrading
nav_order: 10
---
# Upgrading Georgia

Georgia is updated frequently. While I welcome people cloning the github repo and getting the most up to date code, if it's not in an official release there may be bugs/crashes and other bad behavior. If don't know what you're doing, stick to the official releases.
### Checking for upgrades

Once every 24 hours, Georgia will check to determine if there is a new version of the theme available. If no song is playing and an update is available, the theme will notify you:

![image](https://user-images.githubusercontent.com/2282004/112570504-26d42880-8db4-11eb-913f-e6c9484b90a8.png){: width="400px"}


That "Update Available" text is a hyperlink, and clicking on it will open your default browser and take you to the Georgia releases page.

Alternatively if you want to check if there's a new version while a song is playing you can use the option in the Help Menu:

![image](https://user-images.githubusercontent.com/2282004/112570802-bbd72180-8db4-11eb-971b-8b7ff4ce60bf.png){: width="300px"}

### Upgrading to the latest version

IF there's a new version on the releases page, just click on the Source Code .zip from the assets section to download the new version:
![image](https://user-images.githubusercontent.com/2282004/112569622-88939300-8db2-11eb-9e86-def360cb65b9.png){: width="250px"}

Inside that zip will be a folder with the name "Georgia-2.x.x" (version will change each time). Go inside that folder and then extract its contents to the `georgia` folder you initially installed the theme to [in step #3 of the install instructions](https://kbuffington.github.io/Georgia/docs/installation.html#step-by-step-guide-please-follow-closely).

If foobar is still running, you can right-click on the background of the theme and select "Reload", or just start foobar and you will be on the latest version.

### Config file upgrades

After upgrading and reloading the theme, the configuration file will be upgraded, and any new or updated properties from the new version will be added to the configuration file. This *might* mean that in some rare occasions, a value you have edited might be overwritten with a new default. This will be done sparingly and I will attempt to notify users when it happens. 99% of the time, any existing properties will be left completely untouched.

The old version of the configuration file will be backed up to a new file containing the version of georgia which wrote it. For example, upgrading from 2.0.0 to 2.1.0 will create a `georgia-config-2.0.0.jsonc`. You can use these backups in case something goes wrong and you need to downgrade the version of Georgia, or so that you have a copy of your setting for any properties that might get reset to new defaults during the upgrade.