const Discord = require("discord.js");
const config = require("../config.json");
const badges_json = require("../badges.json");

module.exports = {
  name: "retrieveBadges",
  description: "Retrieve all users who own this badge",
  execute(message, args, client, sql) {
    
    //function I'll need later
    function getUserID(mention) {
      if (!mention) return;

      if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention = mention.slice(2, -1);
      }
      if (mention.startsWith("!")) {
        mention = mention.slice(1);
      }

      let guild = client.guilds.cache.get("425866519650631680");

      return guild.member(mention);
    }
    
    
    //Variables and constants
    const keys = Object.keys(badges_json);
    var matched = false;
    var badge_to_add;
    

    //Conditions for command to work
    if (message.author.id !== config.ownerID) {
      message.channel.send("You are not authorized to use this command.");
      return;
    } else if (!args.length) {
      message.channel.send("Provide the badge name--please use <Badge ID>");
      return;
    } else if (args[1] === null) {
      message.channel.send("Provide a user's ID please");
      return;
    }
    // Comment is here for no reason

    //matching the written key with the actual key
    for (var i = 0; i < keys.length; ++i) {
      if (args[0].toLowerCase() === keys[i]) {
        matched = true;
        badge_to_add = keys[i];
        break;
      }
    }

    //Couldn't find the key.
    if (!matched) {
      message.channel.send("Check your spelling. Is that a valid badge ID?");
      return;
    }
    
    //create list
    const embed = new Discord.MessageEmbed()
      .setColor('ffffff')
      .setTitle("**" + badges_json[badge_to_add].name + "**")
      .setDescription(badges_json[badge_to_add].emoji);
    
    var sql_query = "SELECT * FROM badges WHERE guild = ? AND " + badge_to_add + " >0 ORDER BY " + badge_to_add + " DESC";
    var owners = "";
    
    const badge_owners = sql.prepare(sql_query).all(message.guild.id);
    
    for(const data of badge_owners) {
      let id_user = getUserID(data.user);
      if (!id_user) {
        continue;
      }
      
      owners += id_user.nickname;
      owners += " -- (" + data[badge_to_add] + ")";
      owners += "\n"; 
      
    }
    
    //embed.addField("Badge Owners", owners, true);
    
    //replace with embed if you can figure it out later
    message.channel.send(owners);
    
  }
};
