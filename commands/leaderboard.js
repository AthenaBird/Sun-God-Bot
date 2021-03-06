const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql_score = new SQLite("./databases/scores.sqlite");

module.exports = {
	name: 'leaderboard',
	description: 'Display points leaderboard. Earn points by speaking in this server daily!',
  category: "Points",
  args: false,
  usage: '',
	execute(message, args) {
    const client = message.client;
		const top10 = sql_score.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 15;").all(message.guild.id);

    // Now shake it and show it! (as a nice embed, too!)
    const embed = new Discord.MessageEmbed()
      .setTitle("__**Leaderboard**__ (as of 11/10/19 [BETA])")
      .setAuthor(client.user.username, client.user.avatarURL)
      .setDescription("Our top 15 points leaders!")
      .setColor(0x00AE86);
    
    var counter = 1;
    for(const data of top10) {
      embed.addField("**" + counter + ") " + client.users.cache.get(data.user).tag + "**", `${data.points} points (level ${data.level})`);
      counter++;
    }
    return message.channel.send({embed});
	}
};
