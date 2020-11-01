const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql_events = new SQLite("./databases/calendar.sqlite");

module.exports = {
	name: 'createevent',
	description: 'Create a discord event that will be posted to #events-giveaways. *Note: remember to list times in HH:MM AM|PM format with proper spacing, ie. 09:00 PM or 11:00 AM.*',
  category: "Event/Calendar",
  args: true,
  usage: '<event title>',
	execute(message, args) {
    
    const client = message.client;
    const msg_url = "https://discordapp.com/channels/425866519650631680/589715402490118154/"

    //ADD EVENT
    //Includes sending a message with all the information to a channel. 
    function addEvent(name, host, description, month, day, year, s_hour, s_minute, e_hour, e_minute, location, notify) {
      var s_readable_time = `20${year}-${month}-${day} ${s_hour}:${s_minute}:00.000`;
      var e_readable_time = `20${year}-${month}-${day} ${e_hour}:${e_minute}:00.000`;
      
      var s_unix_timestamp = Math.round(new Date(s_readable_time).getTime());
      var e_unix_timestamp = Math.round(new Date(e_readable_time).getTime());
            
      //----------CREATE EMBED and INJECT in SQL------------//
      var message_id = "";
      var category = "general"
      
      //thumbnail is a picture of sun god for now
      const event_embed = new Discord.MessageEmbed()
      .setColor("ff4c4c")
      .setTitle(`${name}`)
      .setThumbnail('https://i.imgur.com/husEkJI.jpg')
      .setDescription(`${description}`)
      .addField("__**HOST**__", `${host}`, true)
      .addField("__**TIME**__", `${month}/${day}/${year} at ${s_hour}:${s_minute} to ${e_hour}:${e_minute}`, false)
      .addField("__**LOCATION**__", `${location}`, true)
      .setFooter("Event id: " + message_id);
      
      client.channels.cache.get("589715402490118154").send(event_embed).then(sent => {
        
        message_id = sent.id;
        console.log(sent.id);
        console.log(notify);
        var notif_stat = "";
        if (notify === 1) {
          notif_stat = "ON";
        } else {
          notif_stat = "OFF";
        }
        
        //some spaghetti code to convert back to am pm time
        var s_ampm = `${s_hour}:${s_minute}`;
        s_ampm = ampm(s_ampm);
        var e_ampm = `${e_hour}:${e_minute}`;
        e_ampm = ampm(e_ampm);
        
        //literally just editing the message id, not sure how to actually fix without sending an entirely new embed
        const event_embed2 = new Discord.MessageEmbed()
          .setColor("ff4c4c")
          .setTitle(`**EVENT**: ${name}`)
          .setThumbnail('https://i.imgur.com/husEkJI.jpg')
          .setDescription(`${description}`)
          .addField("__**HOST**__", `> ${host}`, false)
          .addField("__**TIME**__", `> ${month}/${day}/${year} at ${s_ampm} to ${e_ampm}`, false)
          .addField("__**LOCATION**__", `> ${location}`, false)
          .addField("__**RSVP**__", `Choose ☑️ for **going**, 🔵 for **interested**. Notifs are: *${notif_stat}*, you will be notified before the event.` , false)
          .setFooter("Event id: " + message_id);

        setTimeout(() => {  console.log("Event created!"); }, 2000);
        sent.edit(event_embed2);
        message.channel.send(`***Event successfully created! (${msg_url}${message_id}) ***`);
        
        const rsvp_badges = ["☑️", "🔵"]
        
        //add RSVP Emotes
        for (let i = 0, p = Promise.resolve(); i < rsvp_badges.length; i++) {
          p = p.then(
            _ =>
              new Promise(resolve =>
                setTimeout(function() {
                  sent.react(rsvp_badges[i]);
                  resolve();
                }, 1000)
              )
          );
        }
        
        //edit the timestamp to reflect pst: 28800000 miliseconds  
        
        //INJECT into SQL
        var event = {
          id: `${message_id}`,
          name: `${name}`,
          host: `${host}`,
          category: `${category}`,
          priority: 1,
          description: `${description}`,
          start_time: s_unix_timestamp,
          end_time: e_unix_timestamp,
          location: `${location}`,
          notify: notify
        };
        
        client.setCalendar.run(event);
        
      })
      
      //-----------//
      
    }
    
    //AMPM()
    //CONVERT MILITARY TO READABLE AM PM TIME
    function ampm (time) {
      
      var split_time = time.split(":");
      var ampm_time = "";
      
      if (Number(split_time[0]) <= 11) {
        ampm_time = `${split_time[0]}:${split_time[1]} AM}`;
      } else if (Number(split_time[0]) == 12) {
        ampm_time = `${split_time[0]}:${split_time[1]} PM}`;
      } else {
        var pm_time = Number(split_time[0])-12;
        ampm_time = `${pm_time}:${split_time[1]} PM`;
      }
      
      return ampm_time;
      
    }
    
    function rev_ampm(time) {
      
      //split to get AM or PM first
      var ampm = time.split(" ");
      
      //split again to get the times
      var split_time = ampm[0].split(":");
      
      var mt_time = "";
      
      if (ampm[1].toLowerCase() === "am") {
        mt_time = `${split_time[0]}:${split_time[1]}`;
        
      } else {
        if (split_time[0] === 12) {
          mt_time = `${split_time[0]}:${split_time[1]}`;
          
        } else {
          var pm = (Number(split_time[0]) + 12).toString();
          mt_time = `${pm}:${split_time[1]}`;
        }
      }
      
      return mt_time;
    }
    
    //if missing permissions
    /* if(!(message.member.roles.cache.find(r => r.name === "Kages 👑") || message.member.roles.cache.find(r => r.name === "Moderators 🛡️"))) {
      message.channel.send("You are not authorized to use this command!");
      return;
    } */
    
    let event_name = "";
    
    //check names arg 
    if(!args.length) {
      message.channel.send("The proper usage for this command is: `sg!createEvent <name>`");
      return;

    } else {
      for(let i = 0; i < args.length; i++) {
        event_name += " " + args[i];
        
      }
      event_name = event_name.substring(1, event_name.length);
    }
    
    //---COLLECTOR GROUPS---//
    
    //Create a COLLECTOR for the TIME
    const filter_log = m => m.author.id === message.author.id;
    const collec_log = message.channel.createMessageCollector(filter_log, {
      max: 5,
      time: 120000
    });
   
    let completed_time = true;
    message.channel.send("> **You are creating the event: __" + event_name + "__** \n>>>__Please enter the following in seperated messages__:<<<\n\n  **Description** (text + links only, no images) \n  **MM/DD/YY** \n  **HH:MM AM/PM** (__start__ time) \n  **HH:MM AM/PM** (__end__ time) \n  **Location** \n *Type `cancel` to cancel the command.*");
    
    collec_log.on("collect", m => {
      if (m.content === "cancel") {
        completed_time = false;
        message.channel.send("Action cancelled by user.");
        collec_log.stop();
      } else {
        m.react("\u2705");
        console.log(`Collected ${m.content}`);
      }
    });
    
    let description = "";
    let month = "";
    let day = "";
    let year = "";
    let s_hour = 0;
    let s_minute = 0;
    let e_hour = 0;
    let e_minute = 0;
    let location = "";
    
    collec_log.on("end", collected => {
      //TODO: Check whether or not this what they gave is correct. If so, store it into a var. 
      
      //split the collected to check
      let arr_collec = collec_log.collected.array();
      
      description = arr_collec[0].toString();
      
      let arr_day = arr_collec[1].toString().split("/");
      month = arr_day[0];
      day = arr_day[1];
      year = arr_day[2];
      
      let arr_stime = rev_ampm(arr_collec[2].toString());
      arr_stime = arr_stime.split(":");
      s_hour = arr_stime[0];
      s_minute = arr_stime[1];
      
      let arr_etime = rev_ampm(arr_collec[3].toString());
      arr_etime = arr_etime.split(":");
      e_hour = arr_etime[0];
      e_minute = arr_etime[1];
      
      //TODO location assumed to be one word? crashed earlier on more than one word
      let location = arr_collec[4].toString();
      
      console.log(month + day + year);
      
      //check for validity
      if(Number(month) < 1 || Number(month) > 12) {
        message.channel.send("Invalid month. Command exiting...")
        return;
      } else if (Number(day) < 1 || Number(day) > 31) {
        message.channel.send("Invalid day. Command exiting...");
        return;
      } else if (Number(year) < 20 || Number(year) > 22) {
        message.channel.send("Invalid year. Command exiting...");
        return;
      } else if (Number(s_hour) < 0 || Number(s_hour) > 23 || Number(e_hour) < 0 || Number(e_hour) > 23) {
        message.channel.send("Invalid hour. Command exiting...");
        return;
      } else if (Number(s_minute) < 0 || Number(s_minute) > 59 || Number(e_hour) < 0 || Number(e_hour) > 23) {
        message.channel.send("Invalid minute. Command exiting...");
        return;
      } else if (Number(s_hour) > Number(e_hour)) {
        message.channel.send("Invalid start or end time (check bounds). Command exiting...");
        return;
      } 
      
      message.channel.send("To confirm, __" + event_name + "__ will be: \n at: **" + location + "** \n at **" +
                           month + "/" + day + "/" + year + "** starting at **" + s_hour + ":" + s_minute + "** to **" 
                           + e_hour + ":" + e_minute + "**");
      
      //confirm message
      message.channel.send("\n **Is this correct? Select ✅ or ❌**").then(sent => {
        var arr_confirm = ["✅", "❌"];
        var collected_confirm; 

        for (let i = 0, p = Promise.resolve(); i < 2; i++) {
            p = p.then(
              _ =>
                new Promise(resolve =>
                  setTimeout(function() {
                    sent.react(arr_confirm[i]);
                    resolve();
                  }, 1000)
                )
            );
          }

        const filter_confirm = (reaction, user) => {
            return (
              (arr_confirm.includes(reaction.emoji.name) &&
              user.id === message.author.id
              ));
          };

        const collector_confirm = sent.createReactionCollector(filter_confirm, {
            maxEmojis: 1,
            time: 45000
          });

        collector_confirm.on("collect", (reaction, reactionCollector) => {
            collected_confirm = reaction.emoji.name;
          });

        collector_confirm.on("end", collected => {
          
          if (collected_confirm === "✅") {
            
             //ASK for NOTIFY or not
            message.channel.send("\n **Should users be notified an hour before? Select ✅ or ❌**").then(sent => {
            
              var arr_notify = ["✅", "❌"];
              var collected_notif; 

              for (let i = 0, p = Promise.resolve(); i < 2; i++) {
                p = p.then(
                  _ =>
                    new Promise(resolve =>
                      setTimeout(function() {
                        sent.react(arr_notify[i]);
                        resolve();
                      }, 1000)
                    )
                );
              }

              const filter_notif = (reaction, user) => {
                return (
                  (arr_notify.includes(reaction.emoji.name) &&
                  user.id === message.author.id
                  ));
              };

              const collector_notif = sent.createReactionCollector(filter_notif, {
                maxEmojis: 1,
                time: 45000
              });

              collector_notif.on("collect", (reaction, reactionCollector) => {
                collected_notif = reaction.emoji.name;
              });
              
              collector_notif.on("end", collected => {
                var nickname = message.member.nickname;
                var nickname_length = message.member.nickname.length;
                var adjusted_nickname = "";
                for (var i = 0; i < nickname_length; i++) {
                  if (nickname.charCodeAt(i) < 1000 || nickname.charAt(i) === " ") {
                    //message.channel.send(nickname.charAt(i) + " " + nickname.charCodeAt(i));
                    adjusted_nickname += nickname.charAt(i);
                  }
                }
                
                //call add event function
                if (collected_notif === "✅") {
                  addEvent(event_name, adjusted_nickname, description, month, day, year, s_hour, s_minute, e_hour, e_minute, location, 1);
                } else {
                  addEvent(event_name, adjusted_nickname, description, month, day, year, s_hour, s_minute, e_hour, e_minute, location, 0)
                }
              });
              
            });
              
          } else if (collected_confirm === "❌") {
            message.channel.send("User cancelled command. Exiting...");
            return;
          }
        });      
        
      });
      
    
      
    });
    
    
    
      
    
    /* //Create a collector for the LOCATION
    const filter_loc = m => m.author.id === message.author.id;
    const collector_loc = message.channel.createMessageCollector(filter_loc, {
      maxMatches: 1,
      time: 30000
    });
   
    let completed_loc = true;
    message.channel.send("Please enter the location of the event.");
    
    collector_loc.on("collect", m => {
      if (m.content === "cancel") {
        completed_loc = false;
        message.channel.send("Action cancelled by user.");
        collector_time.stop();
      } else {
        m.react("\u2705");
        console.log(`Collected ${m.content}`);
      }
    });
    
    collector_loc.on("end", collected => {
      //TODO: Check whether or not this what they gave is correct. If so, store it into a var. 
    });*/
  
    
	}
};


