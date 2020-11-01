const Discord = require("discord.js");
const emblems_animals = require("../emblems.json");
const SQLite = require("better-sqlite3");
const sql = new SQLite("./databases/badges.sqlite");
const sql_score = new SQLite("./databases/badges.sqlite");

module.exports = {
	name: 'shop',
	description: 'Purchase badges (`sg!badges`) using points (`sg!points`).',
  category: "Badges",
  args: false,
  usage: '',
	execute(message, args, score) {
    
    const client = message.client;
    // extract score
    
    // extract badges
    
    const main_menu = new Discord.MessageEmbed()
      .setTitle("__**Badges Shop**__ ")
      .setDescription("Purchase badges here using your points! For badges help, do `sg!badges`. For points help, do `sg!help points`.")
      .setColor(0x00AE86);
    
    main_menu.addField("**🐕: Dog**", "**Cost:**: ", true);
    main_menu.addField("**🐈: Cat*", "**Cost:", true)
    message.channel.send(main_menu).then(async function (message) {
		  await message.react("🐕");
      await message.react("🌲");
	  });    
    
    
    // update score
    var statement1 = "UPDATE scores SET points = ";
    var statement2 = " WHERE user = \"";
    var id = score.user;
    var points = score.points;   
    client.updatePoints = sql_score.prepare(statement1 + points + statement2 + id + "\";");
    client.updatePoints.run();
  }
};


