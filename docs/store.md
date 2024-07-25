---
title: Wheel of Yogg-Saron
description: Random wheels powered by the one to whom your destiny is bound. Trust was your failure. He will devour the world.
author: Teiador
image: https://raw.githubusercontent.com/telador/YoggWheel/dev/docs/Wheel.png
icon: https://raw.githubusercontent.com/telador/YoggWheel/dev/public/icon.svg
tags:
  - dice
manifest: https://yoggwheel.onrender.com/manifest.json
---

## How to use power of Master of Fate

+ Create or Import a Wheel
+ Choose a Wheel to Spin
+ ?
+ The end of days is finally upon you!


Importing, Creating or Editing - if you use name that is already used by other wheel it will replace it.

Extension has three panels:

+ Spin & Management of Wheels
+ Create Wheel
+ Spin History

### Import wheel

Wheels are saved as JSON files. As of now importing one have zero validation and even if structure of them isn't hard - I do encourage you to use this feature only on JSON files made by Create or Download features of this extension. At least in that case if something breaks - it isn't your fault, it's mine and I'll be glad to hear about it so I can fix it. 

![Import](https://raw.githubusercontent.com/telador/YoggWheel/dev/docs/Import.gif)

### Create wheel

Upper limits of how big of a wheel is possible were not tested, but I wouldn't try to bring sorcerer's wild magic surge or d100 loot tables. Maybe stick with dice for those ones. Until someone insane enough will bring cursed gift of their JSON files with promises that they will work. 20 sectors or so is more that fine in my expirience and if there is more - wheel wouldn't be really usefull in that it'll be hard to see options.

'+' button adds new sector for a wheel. Each Sector setting area consists of 
+ text: displayed on the wheel; max lenght of 20 characters; by default filled with sector's number
+ fulltext: displayed in pop-up, if this sector wins the roll
+ color: paint sector's background in that color; by default assigned random color on creation
+ reaction: one of 4 animations of grim reaper at the center of wheel which will be played if this sector wins; resting animation is active at other times
+ delete button: *Madness will consume you! < death sound >*; Oh, there is no restore button and it isn't planned. Keep it in mind, while wielding such corrupting force.

![Create](https://raw.githubusercontent.com/telador/YoggWheel/dev/docs/Create.gif)

### Edit wheel

When you choose to edit a wheel it's sectors will be placed under already created sectors in Create wheel panel and it's name will be written instead of what was there before. This actions were chosen as good compromise between usecases of 'creating a new wheel with sectors of already existing one', 'adding new sectors to change existing wheel' and 'fixing typos in a wheel'.

![Edit](https://raw.githubusercontent.com/telador/YoggWheel/dev/docs/Edit.gif)

### Delete wheel

*Hope is an illusion!*
Delete button will trigger simple confirmation section. *And it will haunt you as the lucid dream... The monster in your nightmares... The fiend of a thousand faces... And the progenitor of your demise!* Unless you sacrifice one of your wheels, trick it feeding 'None' option to it or refresh the page. Wanted to make that it'll also vanish back to it's abyss if you change selected wheel, but I like current gimmick more..

![Delete](https://raw.githubusercontent.com/telador/YoggWheel/dev/docs/Delete.gif)

### Download

Not much to say here. If you lost JSON file of a wheel when it was created you can just choose that wheel and hit download. Save important wheels somewhere, for extension purposes they are in localStorage and will be sent to the abyss from time to time and on cache clearings.
*To continue spreading the influence of Ulduar's Prisoner, until he's chained no more.*

### Spin and share

There is no option to spin just for yourself or to limit who will see the wheel. Other players in the room will see scaled down version of your spin with your name above it and some delay. Please have mercy on me and don't demant so it'll work when 2+ players rolls at ones, I can't think how to make it look good and spirit of this extension is to focus everyone attention on one players spin and it's results.

![Spin](https://raw.githubusercontent.com/telador/YoggWheel/dev/docs/Spin.gif)


### Spin with stealth

While I firmly believe that this option contradicts spirit of this extension, I can find having it somewhat useful. Works just like regular spin, but doesn't show wheel and it's results to other players.

![Stealth](https://raw.githubusercontent.com/telador/YoggWheel/dev/docs/Stealth.gif)

### Spin History

Fulltext of a spin can be long and easy to close by accident, so they will be dublicated here with timestamp and name of the player. Stealth spins are displayed only at your history. History, as wheels, saved in localStorage and mostly needed just to check some results from this or maybe last few sessions if you are lucky.  

![History](https://raw.githubusercontent.com/telador/YoggWheel/dev/docs/History.gif)


### Broadcast

Other extensions are welcome to use "com.onrender.wheel.spin" broadcast channel, which triggers viewer wheel. But it's data consists of an array of full rotation degree and stringified wheel's JSON. 
*I'll try to add broadcast channel to trigger wheel with so little as list of options for fulltext from your side in near future. And separate one for wheel results.*

## Credits

Used wheel design template: https://codepen.io/hexagoncircle/pen/bGqVyxm
And thanks to @kamejosh for his help in fixing this. 