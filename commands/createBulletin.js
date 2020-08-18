const Discord = require("discord.js");

module.exports = {
	name: 'createbulletin',
	description: 'Check what is on the bulletin! WIP',
  category: "Events/Calendar",
  args: false,
  usage: '',
	execute(message, args) {
    
     const menu_embed = new Discord.MessageEmbed()
      .setColor("ff4c4c")
      .setTitle("**📅 · Discord Bulletin Menu ·📅**")
      .setDescription("Bulletin creation menu: read closely")
      .setFootnote("For Discord events, use `sg!events` or `sg!createEvents`");
    
	}
};
