const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql_calendar = new SQLite("./databases/calendar.sqlite");

module.exports = {
	name: 'events',
  aliases: ["calendar"],
	description: 'Retrieves all upcoming discord events with clickable hyperlinks.',
  category: "Events/Calendars",
  args: false,
  usage: '',
	execute(message, args) {
    
    const client = message.client;
    //HELPER FUNCTION to convert times from military to readable
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
    
    const msg_url = "https://discordapp.com/channels/425866519650631680/589715402490118154/"
    
		//retrieve events databases
    var calendar = client.getCalendar.all();
    
    //iterate thru database and create embeds for each event
    var events_list = ""
    
    const item_embed = new Discord.MessageEmbed()
      .setColor("ff4c4c")
      .setTitle("**📅 · Discord Event Calendar ·📅**")
      .setDescription("Click on the hyperlinks to direct to the event message (for more details and **RSVPing**). For more details refer to the actual event or item message.")
      .setFooter("To check/add non-discord events, use the command `sg!bulletin`. To host your own event, use 'sg!createEvent'");
    
    for (var item of calendar) {
      
      //formatting for each event
      //convert a standard mon/day/year format into unix?
      var s_time_f = new Date(item.start_time)
      var e_time_f = new Date(item.end_time)

      var s_min = s_time_f.getMinutes();
      var e_min = e_time_f.getMinutes();
      
      var s_mon = s_time_f.getMonth() + 1;
      var e_mon = e_time_f.getMonth() + 1;
      
      //check to see if the event has passed
      var c_time = new Date()
      //console.log(c_time.getTime() + " " + s_time_f)
      if (c_time.getTime() - 28800000 > s_time_f) {
        console.log("Event passed... or did it? " + item.name);
        continue;
      }
            
      if(s_min < 10) {
        s_min = `0${s_min}`
      }
      if(e_min < 10) {
        e_min = `0${e_min}`
      }
      
      //format to AM PM time using helper function
      var s_string = `${s_time_f.getHours()}:${s_min}`
      var s_ampm = ampm(s_string);
      
      var e_string = `${e_time_f.getHours()}:${e_min}`
      var e_ampm = ampm(e_string);
      
      //display info
      var s_time = `${s_mon}/${s_time_f.getDate()} ${s_ampm}`;
      var e_time = `${e_mon}/${e_time_f.getDate()} ${e_ampm}`;
      
      item_embed.addField("\u200b", `> **__[${item.name}](${msg_url}${item.id})__**: **~${s_time}** to **${e_time}** at **${item.location}~** >>> ${item.description} \n`, true) 
      //console.log(`${msg_url}${item.id}`);
    
    }
    
   
    
    message.channel.send(item_embed);

	  }
  
};


