const Discord = require("discord.js");

module.exports = {
	name: 'changelog',
	description: 'Pong!',
	execute(message, args, client) {
    
    if (message.author.id !== "433774411682938890") return;
    
    var type = "";
    var context = "";
    
    if(args[0] === "-cc") {
      type = "**CREATED CHANNEL**";
    } else if (args[0] === '-mc') {
      type = "**MODIFIED CHANNEL**"
    } else if(args[0] === '-dc') {
      type = "**DELETED CHANNEL**";
    } else if(args[0] === '-nc') {
      type = "**NEW COMMAND**";
    } else if(args[0] === '-nb') {
      type = "**ADDED BOT**";
    } else if(args[0] === '-mb') {
      type = "**MODIFIED BOT**";
    } else {
      type = "**Other Change**"
    }
    
    for(let i = 1; i<args.length; i++){
      context += args[i] + " ";
    }
                
		const changelog_embed = new Discord.MessageEmbed()
      .setColor("ff4c4c")
      .setTitle(type)
      .setThumbnail('https://i.imgur.com/husEkJI.jpg')
      .setDescription(context)
      .setFooter("Progenitor: " + message.author.username);
    
    client.channels.cache.get("687107287868768310").send(changelog_embed);
	}
};


