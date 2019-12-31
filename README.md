# Sun God Bot

Sun God Bot is a utility orientated Discord.js bot mostly used in the UCSD 22 Discord server to handle the badge process and the verification process. 

## Hosted by [Glitch](https://glitch.com/)

\ ゜ o ゜)ノ

# Sun God Bot Functionalities

## Main Functionality

The prefix for all commands is `sg!`. 

## Badges

Badges is a unique function to the server in which members are able to earn certain cosmetic awards for participating in events, competitions, etc.
Badges are displayed next to the nickname, and a member can have up to three badgeds at once.

-----

`badges`

Provides a list of the different badge related functions.

-----

`addBadges`

_Parent:_ `badges`

Allow **admins** to add a badge to a user's profile.

-----

`allBadges`

_Parent:_ `badges`

Displays all the badges available in the server.

**Level:** If a badge can be levelled up, then this indicates the level it is.

**Tier:** Basically rarity and comes in common, uncommon, rare, epic, and legendary.

-----

`equipBadges`

_Parent:_ `badges`

Allows the user to equip up to three badges of their choosing. This function will not work if their names are more than 29 characters long.

-----

`viewBadges`

_Parent:_ `badges`

Displays which badges a user owns. Optional parameters: \<mention> to view another user's badges.
  
-----

### Admin Commands for Badges

`addBadges`

`removeBadges`

`clearBadges`

-----
  
## Verification

`verify`

Streamlines the process of verification in the server. When called, the user is prompted to enter information about the user he or she is verifying. 
The bot automatically applies the correct roles and changes the nickname, along with welcoming the user in the general chat and sending the new user
a DM general information about the discord.