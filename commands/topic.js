const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
	name: 'topic',
	description: 'See what the topic in #rotating-topic is!',
  category: "Utility",
  args: false,
  usage: '',
	execute(message, args) {

    var topic_text = '';

    fs.readFile('topic.txt', (err, data) => {
      if (err) throw err;
      
      topic_text = data.toString();
      
    })

    const embed = new Discord.MessageEmbed()
      .setColor('ff4c4c')
      .setTitle('`TOPIC:` 》 **TBA** 《')
      .setDescription('**STARTING TBA and ENDING whenever**\n')
      .addField("Hold Tight!", "A new topic is coming. Please hold")
      .addField("TOPIC NAME", topic_text)
      //.addField("\u200b", "For this topic, take a moment (or many moments!) to write about anything you could be grateful for: whether this be the weather, your friend, your current housing situation, the existence of watermelons, etc. Anything counts!")
      //.addField("\u200b", "Inspired by the Kurzgesagt Video: [An Antidote to Dissatisfaction](https://www.youtube.com/watch?v=WPPPFqsECz0) *(highly recommend you watch!)*")
      .setFooter('Got ideas for this channel? Put them in #meta, we\'d love to hear from you!');
		message.channel.send(embed);
    
	}
};


