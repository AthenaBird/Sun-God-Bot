const Discord = require("discord.js");

module.exports = {
	name: 'help',
	description: 'Gives help on commands',
	execute(message, args) {
		const help_embed = new Discord.RichEmbed()
      .setColor('ff4c4c')
      .setTitle('**Sun God Bot Help**')
      .setDescription('UCSD22\'s best resident bot, at your service. I handle most server utilities (like *badges*) while my sister Moon God handles all other functions. **My command prefix is:** `sg!`')
      .setThumbnail('https://i.imgur.com/husEkJI.jpg')
      .addField('*Need Help Getting Verified?*', 'Please read <#425872398366146570>', false)
      .addField('*Where Can I Get Roles?*', 'Please scroll through: <#576901699411640330>', false)
      .addBlankField()
      .addField('__**General Commands**__', '(Don\'t forget to add my command prefix)', false)
      .addField('>>`ping`<<', 'Ping me and I will pong you back', false)
      .addField('>>`shop`<<', 'View the *UCSD22 Merch Shop*', false)
      .addField('>>`badges`<<', 'View the badges help menu', false)
      .addField('>>`stream` [NOT IMPEMENTED YET]<<', 'View the official streaming list/signups menu', false)
      .addBlankField()
      .addField('*Thank you to all contributors!*', 'I am constantly improving; please report all bugs or suggested features in <#576325812861534219>', false);
    
    message.channel.send(help_embed);
	},
};

