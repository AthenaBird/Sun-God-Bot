const Discord = require("discord.js");
const badges = require("../badges.json");

module.exports = {
	name: 'badges',
	description: 'Parent help command for badges commands',
  category: "Badges",
  args: false,
  usage: '',
	execute(message, args) {
		const badges_embed = new Discord.MessageEmbed()
      .setColor('ff4c4c')
      .setTitle('**BADGES HELP & COMMANDS**')
      .setDescription('All badge related commands and help. Command prefix: \`sg!\`')
      .addField('__USER COMMANDS__', '(Works for all users of this discord)', false)
      .addField('`allBadges`', 'View all avaialable badges and their details', false)
      .addField('`equipBadges`', 'Equip your badges onto your nickname for a max of three at a time', false)
      .addField('`infoBadges`', 'Look at a specific badge\'s details', false)
      .addField('`viewBadges` *opt. parameter: <user mention>*', 'View which badges you own, or provide a mention to look at someone else\'s badges', false)
      .addField('__ADMIN COMMANDS__', '(Only works for admins)', false)
      .addField('`addBadges <badgeID> <user ID or mention>...`', '*Admin command* to grant user\'s badges', false)
      .addField('`removeBadges <badgeID> <user ID or mention>..`', '*Admin command* to remove user\'s badges', false)
      .addField('`clearBadges <user ID or mention>`', '*Admin command* to clear all of a user\'s badges', false)
      .addField('`findBadges <badge emote>`', 'Admin command to lookup the badge id', false)
      .addField('`retrieveBadges <badge ID>`', 'Admin command to show who owns this badge', false);

    
    message.channel.send(badges_embed);
	}
};
