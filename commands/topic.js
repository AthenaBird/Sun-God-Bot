const Discord = require("discord.js");

module.exports = {
	name: 'topic',
	description: 'Pong!',
	execute(message, args) {
    
    const embed = new Discord.MessageEmbed()
      .setColor('ff4c4c')
      .setTitle('**TOPIC: Dream Journal**')
      .setDescription('**STARTING 4/5/20 >>>>> ENDING 4/19/20**. Idea courtesy of Nina!')
      .addField('Dream Journaling', 'Use this channel to talk about the dreams you have every night. You can share as much or as little as you would like.', true)
      .setFooter('Have ideas for this channel? Use #meta to tell us about it.');
    
		message.channel.send(embed);
    
	}
};


