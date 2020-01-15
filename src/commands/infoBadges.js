const badges = require("../badges.json");
const Discord = require("discord.js");

module.exports = {
	name: 'infoBadges',
	description: 'Gives a more detailed view of a badge',
	execute(message, args) {
		if (!args.length) {
      message.channel.send("Command usage: `sg!infoBadges <emoji of badge>`");
      return;
    } else {
      message.channel.send("No implementation yet. Bye bye!");
    }
	}
};


