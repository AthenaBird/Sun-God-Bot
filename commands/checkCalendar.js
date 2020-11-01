const Discord = require("discord.js");
const fs = require('fs'); 

module.exports = {
	name: 'checkcalendar',
	description: 'Non-callable command to check calendar for any events; if so, any with rsvp',
  category: "Events/Calendar",
  args: false,
  usage: '',
	execute(client, sql_calendar) {
    
    
    const HOURS = 1;
    const DAYLIGHT = 1; // boolean for if daylight savings is active
    const EVENT_WINDOW = HOURS * 60 * 60 * 1000 + (DAYLIGHT * 3600000);
    
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
      
      if(s_minutes < 10) {
        s_minutes = `0${s_minutes}`
      }
      
      if(e_minutes < 10) {
        e_minutes = `0${e_minutes}`
      }
      
      // really should placeholder this
      if (s_hour <= 11) {
        if(s_hour == 10 || s_hour == 11) {
          s_ampm_time = `${s_hour}:${s_minutes} AM}`;
        } else {
          s_ampm_time = `0${s_hour}:${s_minutes} AM}`;
        }
      } else if (s_hour == 12) {
        s_ampm_time = `${s_hour}:${s_minutes} PM}`;
      } else {
        var s_pm_time = s_hour -12;
        s_ampm_time = `${s_pm_time}:${s_minutes} PM`;
      }
      
      if (e_hour <= 11) {
        if(e_hour == 10 || e_hour == 11) {
          e_ampm_time = `${e_hour}:${e_minutes} AM}`;
        } else {
          e_ampm_time = `0${e_hour}:${e_minutes} AM}`;
        }
      } else if (e_hour == 12) {
        e_ampm_time = `${e_hour}:${e_minutes} PM}`;
      } else {
        var e_pm_time = e_hour - 12;
        e_ampm_time = `${e_pm_time}:${e_minutes} PM`;
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
      
      var readable_td = `**${month}/${date}/${year} (${day})** from **${s_ampm_time} to ${e_ampm_time}**`;
      return readable_td;
    }
    
    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    for (var item of calendar) {
      //console.log(item);
      var s_time = new Date(item.start_time);
      var e_time = new Date(item.end_time);
            
      var c_time = new Date();
      if (c_time.getTime() - 28800000 > item.start_time) {
        //event has passed
        fs.appendFileSync('/home/ubuntu/commands/checkCalendar.txt', datetime + " Event passed: " + item.id + " " + item.name + "\n");
        continue;
      } 
      else if (item.start_time - (c_time.getTime() - 28800000) > EVENT_WINDOW){
        //greater than 24 hours
        fs.appendFile('/home/ubuntu/commands/checkCalendar.txt', datetime + " Event notification window too far: " + item.id + " " + item.name + "\n", function (err) {
          if (err) throw err;
        }); 
        continue;
      } 
      else if (item.notify !== 1) {
        fs.appendFile('/home/ubuntu/commands/checkCalendar.txt', datetime + " Event notifications are off: " + item.id + " " + item.name + " " + item.notify + "\n", function (err) {
          if (err) throw err;
        }); 
        continue;
      } 
      else {

        fs.appendFile('/home/ubuntu/commands/checkCalendar.txt', datetime + " NOTIFYING USERS: " + item.id + " " + item.name + "\n", function (err) {
          if (err) throw err;
        }); 

        console.log();
        
        let guild = client.guilds.cache.get("425866519650631680");
        let channel = client.channels.cache.get("589715402490118154");
        
        var notif_embed = new Discord.MessageEmbed()
                .setColor("ff4c4c")
                .setTitle("**RSVP Notification: **" + item.name)
                .setDescription("**This is a notification about the event occuring in approximately **" + HOURS +  "** hour(s).**")
                .addField("__EVENT DESCRIPTION__", item.description, false)
                .addField("__HOST (Direct questions to)__", item.host, false)
                .addField("__TIME__", convert_time(s_time, e_time), false)
                .addField("__LOCATION__", item.location, false);
        
        //now set notify to off
        const statement = "UPDATE calendar SET notify = 0 WHERE id = " + item.id;
        client.setNotify = sql_calendar.prepare(statement);
        client.setNotify.run();
        
        var message = channel.messages.fetch(item.id).then(msg => {
          
          //check for the reax

          var arr_going_user = [];
          //console.log(msg.reactions.cache.get('☑️').users);
          //console.log(message.reactions.cache.get('471374617337135134'));
          var going_userReactions = msg.reactions.cache.get('☑️').users.fetch().then(fetched => {
            for (var user of fetched) {
              if (user[1].id === "620850437251399681") {
                continue;
              }
              
              arr_going_user.push(user[1].id);
              
              /*var going_embed = new Discord.MessageEmbed()
                .setColor("ff4c4c")
                .setTitle("**RSVP Notification: **" + item.name)
                .setDescription("**This is a notification about the event occuring in **" + HOURS +  "** hour(s).**")
                .addField("__EVENT DESCRIPTION__", item.description, false)
                .addField("__HOST (Direct questions to)__", item.host, false)
                .addField("__TIME__", convert_time(s_time, e_time), false)
                .addField("__LOCATION__", item.location, false) */
              
              client.users.cache.get(user[1].id).send(notif_embed);
              
            }
            
            
          });
	        
          var arr_interest_user = [];
          var interest_userReactions = msg.reactions.cache.get("🔵").users.fetch().then(fetched => {
            for (var user of fetched) {
              if (user[1].id === "620850437251399681") {
                  continue;
              }
              
              arr_interest_user.push(user[1].id);
              
              /*var interested_embed = new Discord.MessageEmbed()
                .setColor("ff4c4c")
                .setTitle("**RSVP Notification: **" + item.name)
                .setDescription("**This is a notification about the event occuring in **" + HOURS +  "** hour(s).**")
                .addField("__EVENT DESCRIPTION__", item.description, false)
                .addField("__HOST (Direct questions to)__", item.host, false)
                .addField("__TIME__", convert_time(s_time, e_time), false)
                .addField("__LOCATION__", item.location, false)*/
              
              client.users.cache.get(user[1].id).send(notif_embed).then(() => {})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
				});
            }
            
          });
                   
      
        });
      }
    
    }
    
    
    //setTimeout(1000);
	}
};


