const Discord = require("discord.js");
const badges_json = require("../badges.json");

module.exports = {
	name: 'promote',
	description: 'Promote an event or anything you would like thru our special #bulletin channel! WIP',
  category: "Events/Calendar",
  args: false,
  usage: '',
	execute(message, args) {
    
		const promote_1 = new Discord.MessageEmbed()
      .setColor("ff4c4c")
      .setTitle("**Welcome to the Promotion Menu!**")
      .setThumbnail(message.author.avatarURL)
      .setDescription(
        "Promote events and other non-discord related things through this function. Your event will be added to the calendar and posted to our official events channel."
      )
      .addField("GENERAL EVENT", "For general events: Choose ", false)
      .addField("FOOD", "For food related events: Choose ", false)
      .addField("FUNDRAISER", "For fundraiser related events: Choose ", false);
    
    message.channel.send(promote_1);
      
	}
};


