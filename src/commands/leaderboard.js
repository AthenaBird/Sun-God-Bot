const Discord = require("discord.js");

module.exports = {
	name: 'leaderboard',
	description: 'Display point leaderboard',
	execute(message, args, sql_score, client) {
		const top10 = sql_score.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);

    // Now shake it and show it! (as a nice embed, too!)
    const embed = new Discord.RichEmbed()
      .setTitle("__**Leaderboard**__ (as of 11/10/19 [BETA])")
      .setAuthor(client.user.username, client.user.avatarURL)
      .setDescription("Our top 10 points leaders!")
      .setColor(0x00AE86);
    
    var counter = 1;
    for(const data of top10) {
      embed.addField("**" + counter + ") " + client.users.get(data.user).tag + "**", `${data.points} points (level ${data.level})`);
      counter++;
    }
    return message.channel.send({embed});
	}
};
