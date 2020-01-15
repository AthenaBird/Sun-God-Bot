const Discord = require("discord.js");
const emblems_animals = require("../emblems_animals.json");

module.exports = {
	name: 'shop',
	description: 'Shop!',
	execute(message, args, client, sql, sql_score) {
  
    const main_menu = new Discord.RichEmbed()
      .setTitle("__**Emblem Shop**__ ")
      .setDescription("Purchase emblems here using your points! For emblems help, do `sg!emblems`. For points help, do `sg!pointsHelp`.")
      .setColor(0x00AE86);
    
    main_menu.addField("**ANIMALS**", "Select 🐕 ", true);
    main_menu.addField("**NATURE**", "Select 🌲", true)
    message.channel.send(main_menu).then(async function (message) {
		  await message.react("🐕");
      await message.react("🌲");
	  });    
    
  }
};


