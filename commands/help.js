const Discord = require("discord.js");
const { prefix } = require("../config.json");

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
  category: "Utility",
  args: false,
	usage: '<command name>',
	execute(message, args) {
    const data = [];
    const { commands } = message.client;
    
    const help_embed = new Discord.MessageEmbed()
      .setColor('ff4c4c')
      .setTitle("__**SUN GOD Command List and Help**__")
      .setThumbnail('https://i.imgur.com/husEkJI.jpg')
    
		if (!args.length) {
      help_embed.setDescription('UCSD22\'s best resident bot, at your service. I handle most server utilities (like *badges*) while my sister Moon God handles all other functions. **My command prefix is:** `sg!`');
      help_embed.addField("List of all my commands (note that some of them are *admin only* commands, or have aliases):", "> " + commands.map(command => command.name).join('\n> '), false);
      help_embed.addField("Need more help?", `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
      help_embed.setFooter("For badges help, type `sg!badges`.")
      help_embed.addField('*Need Help Getting Verified?*', 'Please read <#718652189865672785>', false)
      help_embed.addField('*Where Can I Get Roles?*', 'Please scroll through: <#656320898655191071>', false)
      

      return message.channel.send(help_embed)
        .then(() => {

        })
        .catch(error => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
          message.reply('there was an error executing this command!');
        });
    }
    
    //----- specific commands -----//
    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply('that\'s not a valid command!');
    }
  
    const command_embed = new Discord.MessageEmbed()
      .setColor('ff4c4c')
      .setTitle('**__' + command.name.toUpperCase() + '__**')
      .setThumbnail('https://i.imgur.com/husEkJI.jpg')
    if (command.description) command_embed.setDescription(`${command.description}`);
    if (command.category) command_embed.addField("**Category:**", `${command.category}`, false);
    if (command.aliases) command_embed.addField("**Aliases:**", `${command.aliases.join(', ')}`, false);
    if (command.usage) command_embed.addField("**Usage:**", `${prefix}${command.name} ${command.usage}`);
      

    message.channel.send(command_embed);

    
//     const help_embed = new Discord.MessageEmbed()
//       .setColor('ff4c4c')
//       .setTitle('**Sun God Bot Help**')
//       .setDescription('UCSD22\'s best resident bot, at your service. I handle most server utilities (like *badges*) while my sister Moon God handles all other functions. **My command prefix is:** `sg!`')
//       .setThumbnail('https://i.imgur.com/husEkJI.jpg')
//       .addField('*Need Help Getting Verified?*', 'Please read <#425872398366146570>', false)
//       .addField('*Where Can I Get Roles?*', 'Please scroll through: <#576901699411640330>', false)
//       .addField('__**General Commands**__', '(Don\'t forget to add my command prefix)', false)
//       .addField('>>`ping`<<', 'Ping me and I will pong you back', false)
//       .addField('>>`shop`<<', 'View the *UCSD22 Merch Shop*', false)
//       .addField('>>`badges`<<', 'View the badges help menu', false)
//       .addField('>>`stream` [NOT IMPEMENTED YET]<<', 'View the official streaming list/signups menu', false)
//       .addField('*Thank you to all contributors!*', 'I am constantly improving; please report all bugs or suggested features in <#576325812861534219>', false);
    
//     message.channel.send(help_embed);
	},
};

