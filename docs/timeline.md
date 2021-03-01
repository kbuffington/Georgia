---
layout: default
title: Timeline
has_children: false
nav_order: 4
---
# The Timeline

![Timeline](https://user-images.githubusercontent.com/2282004/109264415-931a3700-77ca-11eb-97eb-a4fd35b28857.png){: width="473px"}

The Timeline is the 12px high, three-tone bar that appears between the song and album title. It is intended to be a visual representation of a song's lifecycle in your library. Its exact appearance will be different for every song, and whether you have the [foo_enhanced_playcount](https://www.foobar2000.org/components/view/foo_enhanced_playcount) component installed. I built the timeline component (and wrote foo_enhanced_playcount to supply it with data) because for me, music is often indelibly linked with the time and place in which I listened to it. I wanted a way to go back and be able to say that "yes, I really did listen to that song seven times on that road trip," or "I don't think I've listened to that song since we got home from the hospital."

The Timeline allows you to get a quick visual representation of when you've listened to a song, but also lets you dive deeper and extract interesting historical information about your listening habits.

## What it means

When you've never played a song before, and there are no last.fm scrobbles of it, the bar will look like this:

![image](https://user-images.githubusercontent.com/2282004/109265545-55b6a900-77cc-11eb-9147-246009e59879.png)

Each of the three colored sections corresponds to a different point in the song's lifecycle. The very left edge of the timeline is when the song was added to your library, and so the darkest color block is the time before the song was first played. The middle section is the time between first played and last played. And the final section is the time between last played and the today's date.

Every play that the component knows about will be drawn with a white semi-transparent vertical line. If you don't have foo_enhanced_playcount installed, you will never see more than two lines; one for first played, and one for last played:

![foo_enhanced_playcount disabled](https://user-images.githubusercontent.com/2282004/109266022-1046ab80-77cd-11eb-8ca1-71faf6b3e13f.png)

But if foo_enhanced_playcount is installed you will be able to see more, particularly if you can retrieve last.fm scrobbles for the song:

![foo_enhanced_playcount enabled](https://user-images.githubusercontent.com/2282004/109266237-63b8f980-77cd-11eb-9805-14c279331f49.png)

Because the play markers are transparent and have some thickness the lines will get brighter (and possibly look thicker) if you've played a song a lot over a short period of time:

![image](https://user-images.githubusercontent.com/2282004/109266850-3a4c9d80-77ce-11eb-97fb-e5cdbce45806.png)

![image](https://user-images.githubusercontent.com/2282004/109266982-767ffe00-77ce-11eb-9f01-b865e5d68cb0.png)

You can mouse over the bars, and the time-played marks to see information about how long a song was unplayed in your library, or when exactly that tick mark corresponds to. Here you can see that my daughter and I were listening to a lot of AC/DC before she went to bed in 2020:

![mouseover](https://user-images.githubusercontent.com/2282004/109267446-34a38780-77cf-11eb-8f0a-d2d108cbfe5b.png)