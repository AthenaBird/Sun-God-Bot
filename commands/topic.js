const Discord = require("discord.js");

module.exports = {
	name: 'topic',
	description: 'See what the topic in #rotating-topic is!',
  category: "Utility",
  args: false,
  usage: '',
	execute(message, args) {

    const embed = new Discord.MessageEmbed()
      .setColor('ff4c4c')
      .setTitle('`TOPIC:` 》 **EARLY THANKSGIVING** 《')
      .setDescription('**STARTING 8/24/20 and ENDING whenever** (may be extended) \n')
      .addField("Gratitude Journaling", "Expressing gratitude is a great way to help your mental health/happiness and slow down the chaos that may be happening to you in your life right now.")
      .addField("\u200b", "For this topic, take a moment (or many moments!) to write about anything you could be grateful for: whether this be the weather, your friend, your current housing situation, the existence of watermelons, etc. Anything counts!")
      .addField("\u200b", "Inspired by the Kurzgesagt Video: [An Antidote to Dissatisfaction](https://www.youtube.com/watch?v=WPPPFqsECz0) *(highly recommend you watch!)*")
      .setFooter('Got ideas for this channel? Put them in #meta, we\'d love to hear from you!');
		message.channel.send(embed);
    
	}
};


