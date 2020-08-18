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
      .setTitle('`TOPIC:` 》**REREAD THE STARS** 《')
      .setDescription('**STARTING yes and ENDING no** (may be extended) \n *Idea courtesy of <@286708165612011531>, <@652073170890915864>, <@268824350826692611>!*')
      .addField("Horoscopes!", "Astrology for dummies topic where Sandy and Nina will give  a basic overview of wht astrology is and what your placements/natal chart tells about you!")
      .setFooter('Got ideas for this channel? Put them in #meta, we\'d love to hear from you!');
		message.channel.send(embed);
    
	}
};


