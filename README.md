# Welcome to Glitch

Click `Show` in the header to see your app live. Updates to your code will instantly deploy and update live.

**Glitch** is the friendly community where you'll build the app of your dreams. Glitch lets you instantly create, remix, edit, and host an app, bot or site, and you can invite collaborators or helpers to simultaneously edit code with you.

Find out more [about Glitch](https://glitch.com/about).

## Your Project

On the front-end,

- edit `public/client.js`, `public/style.css` and `views/index.html`
- drag in `assets`, like images or music, to add them to your project

On the back-end,

- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)

## Made by [Glitch](https://glitch.com/)

\ ゜ o ゜)ノ

# Sun God Bot Functionalities

## Main Functionality

The main purpose of Sun God Bot is to be praised and provide a welcoming environment for the citizens of UCSD 22 Discord server.
The prefix for all commands is `sg!`

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
