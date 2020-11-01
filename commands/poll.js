const Discord = require("discord.js");

module.exports = {
  name: "poll",
  description: "Create a poll! Read the instructions in  `mg!poll` to see how to use the command.",
  category: "Utility",
  args: true,
  usgae: "<Name of poll>",
  execute(message, args) {

    const client = message.client;
    if (!args.length) {
      message.channel.send(
        "The proper use for this command is `mg!poll <name of poll>`."
      );
      return;
    }

    let name = "";
    for (let i = 0; i < args.length; i++) {
      name += args[i] + " ";
    }

    message.channel.send(
      "Let's have ourselves a **poll named __" +
        name +
        "__**, shall we <@" +
        message.author.id +
        ">?"
    );
    message.channel.send(
      "Please list out each option you would like to add in a **new message** for every option, for a max of 10 options. You do not need to include numericals, ie. 1), 2), etc. *When you are done, type `done`. Use `cancel` to cancel the creation of the poll.*"
    );
    /*const pre_filter = p => p.author.id === message.author.id;
    const pre_collector = message.channel.createMessageCollector(pre_filter, {
      maxMatches: 1,
      time: 24000
    });
    
    message.channel.send("What is the __name__ of the poll (what are you trying to decide is best/worst...? Cancel early by typing `cancel`)");
   
    
    let pre_completed = true;
    pre_collector.on("collect", p => {
      if (p.content === "cancel") {
        message.channel.send("Poll cancelled.");
        pre_completed = false;
        pre_collector.stop();
      }
    });
    
    let name = "";
    
    pre_collector.on("end", pre_collected => {
      name = pre_collected.array()[0]
      if(pre_completed === false) {
        return;
      }
      message.channel.send("The poll will be named: ***" + name + "***");
      message.channel.send("Please list out each option you would like to add in a new message for every option, for a max of 10 options. You do not need to include numericals, ie. 1), 2), etc. *When you are done, type `done`. Use `cancel` to cancel the command.*"
    );  
      
    });
    */

    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, {
      maxMatches: 10,
      time: 90000
    });

    let completed = false;
    let cancelled = false;
    let c_arr = [];

    collector.on("collect", m => {
      c_arr.push(m.content);
      if (m.content === "cancel") {
        cancelled = true;
        message.channel.send("Poll cancelled.");
        collector.stop();
        return;
      } else if (m.content === "done") {
        completed = true;
        message.channel.send("Creating poll...");
        collector.stop();
      } else {
        m.react("\u2705");
        console.log(`Collected ${m.content}`);
      }
    });

    collector.on("end", collected => {
        //c_arr = collected.array();
        /*const embed = new Discord.RichEmbed()
          .setColor("ff4c4c")
          .setTitle("**" + name + "**")
          .setDescription(
            "Poll created by: __" + message.member.nickname + "__"
          )
          .setThumbnail(message.member.displayAvatarURL);

        for (let i = 0; i < c_arr.length - 1; i++) {
          let counter = i + 1;
          embed.addField("**Option " + counter + "**", c_arr[i], true);
        }

        let number_emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        
        client.channels.get("637772235494522889").send(embed).then(sent => {
          for (let i = 0, p = Promise.resolve(); i < c_arr.length - 1; i++) {
            p = p.then(
              _ =>
                new Promise(resolve =>
                  setTimeout(function() {
                    sent.react(number_emojis[i]);
                    resolve();
                  }, Math.random() * 2000)
                )
            );
          }
        });
        message.channel.send("Poll created!");*/
      if (!cancelled && !completed) {
        message.channel.send("You have reached the max number of options or ran out of time!");
        completed = true;
      }
      
      if (completed === true) {
      const embed = new Discord.MessageEmbed()
          .setColor("ff4c4c")
          .setTitle("**" + name + "**")
          .setDescription(
            "Poll created by: __" + message.member.nickname + "__"
          )
          .setThumbnail(message.member.displayAvatarURL);

        for (let i = 0; i < c_arr.length - 1; i++) {
          let counter = i + 1;
          embed.addField("**Option " + counter + "**", c_arr[i], true);
        }

        let number_emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        
        client.channels.cache.get("655958483442728961").send(embed).then(sent => {
          for (let i = 0, p = Promise.resolve(); i < c_arr.length - 1; i++) {
            p = p.then(
              _ =>
                new Promise(resolve =>
                  setTimeout(function() {
                    sent.react(number_emojis[i]);
                    resolve();
                  }, Math.random() * 2000)
                )
            );
          }
        });
        message.channel.send("Poll created!");
      }
      
    });
  
    
    
  }
};
