const Discord = require("discord.js");

module.exports = {
	name: 'checkCalendar',
	description: 'Non-callable command to check calendar for any events; if so, any with rsvp',
	execute(client, sql_calendar) {
    
    const HOURS = 1;
    const EVENT_WINDOW = HOURS * 60 * 60 * 1000;
    
		//client.channels.get("637772235494522889").send("Time check complete!");
    var calendar = sql_calendar.prepare("SELECT * FROM calendar ORDER BY start_time ASC").all();
    
    function convert_time(start_time, end_time) {
      var s_ampm_time = "";
      var e_ampm_time = "";
      
      //Right now the code assumes that the start day and end day are the same
      var month = start_time.getMonth() + 1;
      var date = start_time.getDate();
      var day = start_time.getDay();
      var year = start_time.getYear();
      var s_hour = start_time.getHours();
      var s_minutes = start_time.getMinutes();
      var e_hour = end_time.getHours();
      var e_minutes = end_time.getMinutes();
      
      if (s_hour <= 11) {
        s_ampm_time = `${s_hour}:${s_minutes} AM}`;
      } else if (s_hour == 12) {
        s_ampm_time = `${s_hour}:${s_minutes} PM}`;
      } else {
        var pm_time = s_hour -12;
        s_ampm_time = `${pm_time}:${s_minutes} PM`;
      }
      
      if (e_hour <= 11) {
        e_ampm_time = `${e_hour}:${e_minutes} AM}`;
      } else if (e_hour == 12) {
        e_ampm_time = `${e_hour}:${e_minutes} PM}`;
      } else {
        var pm_time = s_hour -12;
        e_ampm_time = `${pm_time}:${e_minutes} PM`;
      }
      
      
      switch(day) {
        case 0:
          day = "Sunday";
          break;
        case 1:
          day = "Monday";
          break;
        case 2:
          day = "Tuesday";
          break;
        case 3:
          day = "Wednesday";
          break;
        case 4:
          day = "Thursday";
          break;
        case 5:
          day = "Friday";
          break;
        case 6:
          day = "Saturday";
          break;
        default:
          day = "undefined";
          break;
      }
      
      var readable_td = `${month}/${date}/${year} (${day}) from ${s_ampm_time} to ${e_ampm_time}`;
      return readable_td;
    }
    
    
    
    for (var item of calendar) {
      //console.log(item);
      var s_time = new Date(item.start_time);
      var e_time = new Date(item.end_time);
            
      var c_time = new Date();
      if (c_time.getTime() - 28800000 > item.start_time) {
        //event has passed
        console.log("Event passed");
        continue;
      } else if (item.start_time - (c_time.getTime() - 28800000) > EVENT_WINDOW){
        //greater than 24 hours
        console.log("Event notification window too far");
        continue;
      } else if (item.notify !== 1) {
        //notify is OFF
        //console.log(item.id);
        //console.log(item.notify);
        console.log("Event notifications are off");
        continue;
      } else {
        
        let guild = client.guilds.cache.get("425866519650631680");
        let channel = client.channels.cache.get("589715402490118154");
        
        var message = channel.messages.fetch(item.id).then(msg => {
        
          if(msg.partial) {
            msg.fetch().then(full_msg => {
              console.log("This is considered a partial message");
              client.users.cache.get("270415554995552256").send("Parial juice!");
            })
          } 
          
          //check for the reax
          //console.log(message.reactions.filter(a => a.emoji.name == '☑️').map(m => m.users)[0]);
          //console.log(message);
          var arr_going_user = [];
          console.log(msg.reactions.cache.get('☑️').users);
          //console.log(message.reactions.cache.get('471374617337135134'));
          const going_userReactions = msg.reactions.cache.get('☑️').users.fetch().then(fetched => {
            for (var user of fetched) {
              if (user[1].id === "620850437251399681") {
                continue;
              }
              
              arr_going_user.push(user[1].id);
              
              const going_embed = new Discord.MessageEmbed()
                .setColor("ff4c4c")
                .setTitle("**RSVP Notification: **" + item.name)
                .setDescription("**This is a notification about the event occuring in **" + HOURS +  "** hour(s).**")
                .addField("__EVENT DESCRIPTION__", item.description, false)
                .addField("__HOST (Direct questions to)__", item.host, false)
                .addField("__TIME__", convert_time(s_time, e_time), false)
                .addField("__LOCATION__", item.location, false)
              client.users.cache.get(user[1].id).send(going_embed);
            }
            
            
          });
         // console.log(going_userReactions);
	        
          var arr_interest_user = [];
          const interest_userReactions = msg.reactions.cache.get("🔵").users.fetch().then(fetched => {
            for (var user of fetched) {
              if (user[1].id === "620850437251399681") {
                  continue;
              }
              arr_interest_user.push(user[1].id);
              const interested_embed = new Discord.MessageEmbed()
                .setColor("ff4c4c")
                .setTitle("**RSVP Notification: **" + item.name)
                .setDescription("**This is a notification about the event occuring in **" + HOURS +  "** hour(s).**")
                .addField("__EVENT DESCRIPTION__", item.description, false)
                .addField("__HOST (Direct questions to)__", item.host, false)
                .addField("__TIME__", convert_time(s_time, e_time), false)
                .addField("__LOCATION__", item.location, false)
              client.users.cache.get(user[1].id).send(interested_embed);
            }
            
          });
          
          
          //now set notify to off
          const statement = "UPDATE calendar SET notify = 0 WHERE id = " + item.id;
          client.setNotify = sql_calendar.prepare(statement);
          console.log(statement);
          client.setNotify.run();
          
      
        });
      }
    
    }
    
    
    //setTimeout(1000);
	}
};


