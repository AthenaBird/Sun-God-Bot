const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite("./databases/badges.sqlite");
const fs = require('fs');

module.exports = {
	name: 'todo',
	description: 'View your todo list. To add to it,  use `sg!addTodo` or select the + at the bottom of this message. To check something off, select the - at the bottom of the message.',
  category: "Utility",
  args: false,
  usage: '',
	execute(message, args) {
    
    // ----- ADD TODO ------ //
    function addTodo(){
      message.channel.send("> In the next message, send your item you want to add. **Make sure this is correct before you hit send!** \n*This will time out in 2 minutes.*");
      const filter = m => m.author.id === message.author.id;
      const collector = message.channel.createMessageCollector(filter, { time: 120000 });

      collector.on('collect', m => {
        console.log(`Collected ${m.content}`);
      });

      collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
      });
      
    }
    
    // ----- CHECK TODO ------ //
    function checkTodo(){
      message.channel.send("pogger")
    }
    
		const client = message.client;
    const todo_embed = new Discord.MessageEmbed()
      .setColor('ff4c4c')
      .setTitle("__**" + message.author.username +  "'s Todo List**__")
      .setThumbnail(message.author.avatarURL())
      .setDescription("To check off any, select ✅. To add items, select ↪️.")
      .setFooter("Reactions will not work after 5 minutes.")
    
    message.channel.send(todo_embed).then(sent => {
        var arr_options = ["✅", "↪️"];
        var collected_options; 

        for (let i = 0, p = Promise.resolve(); i < 2; i++) {
            p = p.then(
              _ =>
                new Promise(resolve =>
                  setTimeout(function() {
                    sent.react(arr_options[i]);
                    resolve();
                  }, 500)
                )
            );
          }

        const filter_options = (reaction, user) => {
            return (
              (arr_options.includes(reaction.emoji.name) &&
              user.id === message.author.id
              ));
          };

        const collector_options = sent.createReactionCollector(filter_options, {
            maxEmojis: 1,
            time: 300000
          });

        collector_options.on("collect", (reaction, reactionCollector) => {
            collected_options = reaction.emoji.name;
          });

        collector_options.on("end", collected => {

          if (collected_options === "✅") {
            // execute checkTodo function
            checkTodo();
          } else if (collected_options === "↪️") {
            // execute addTodo function
            addTodo();
          } else {
            return;
          }
      });        
    });
  }
};


