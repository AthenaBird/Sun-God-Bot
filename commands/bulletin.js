const Discord = require("discord.js");

module.exports = {
	name: 'bulletin',
	description: 'Check what is on the bulletin! WIP',
  category: "Events/Calendar",
  args: false,
  usage: '',
	execute(message, args) {

     const menu_embed = new Discord.MessageEmbed()
      .setColor("ff4c4c")
      .setTitle("**📌 · Discord Bulletin · 📌**")
      .setFooter("To check/add non-discord events, use the command `sg!bulletin`. To host your own event, use 'sg!createEvent'");
    menu_embed.addField("**EVENT**", "(Requires date, time, and location) __Select 🗓️__ ", true);
    menu_embed.addField("**NON-EVENT**", "(General shoutout, PSA, etc) __Select 📣__")
    menu_embed.addField("**CANCEL FUNCTION**", "__Select ❌__", true);
    
    message.channel.send(menu_embed).then(async function (message) {
      await message.react("🗓️")
		  await message.react("📣");
      await message.react("❌");
	  });    
	}
};


