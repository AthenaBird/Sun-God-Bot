const Discord = require("discord.js");
const badges_json = require("../badges.json");
const SQLite = require("better-sqlite3");
const sql = new SQLite("./databases/badges.sqlite");

module.exports = {
	name: 'viewbadges',
	description: 'Displays the user\'s badges (or if user mentioned)',
  category: "Badges",
  args: false,
  usage: '<optional: user mention>',
	execute(message, args) {
    
    const client = message.client;
    //GET USER function for getting ID
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
    
    const keys = Object.keys(badges_json);

    //if user has too long of a nickname then do not allow swapping
    var nickname = message.member.nickname;
    var nickname_length = message.member.nickname.length;
    var adjusted_nickname = "";
    var adjusted_nickname_length = 0; 
    var current_badges = "";
    for (var i = 0; i < nickname_length; i++) {
      if (nickname.charCodeAt(i) < 1000 || nickname.charAt(i) === " ") {
        //message.channel.send(nickname.charAt(i) + " " + nickname.charCodeAt(i));
        adjusted_nickname_length += 1;
        adjusted_nickname += nickname.charAt(i);
        
      } else {
        current_badges += nickname.charAt(i);
      }
    }
    
    //stop it prematurely. maybe later send a dm to me or a mod
    if (adjusted_nickname_length > 28) {
      var over_amount = adjusted_nickname_length - 28;
      message.channel.send(
        "Your nickname is too long to view badges! One of the <@&493911763172065293> can fix that for you."
      );
      message.channel.send("__" + nickname + "__ \'s name is too long by: **" + over_amount + "** characters");
      return;
      
    }
    
    var number_owned = 0;
    var rarity_rating = 0.00;
    let user;
    let user_obj;
    const guild_id = "425866519650631680";
    const guild = client.guilds.cache.get("425866519650631680");
    //if no one is mentioned then the user is the one who sent the message
    if (!args.length) {
      user_obj = guild.member(message.author.id);
      user = client.getBadge.get(message.author.id, guild_id);
    //mention is wrong
    } else if (!message.mentions.members.first()) {
      message.channel.send("Provide a mention for me to look up other members...");
      return;
    //mention succesful
    } else {
      user_obj = getUserID(args[0]);
      user = client.getBadge.get(user_obj.id, guild_id);
      //if user doesn't exist
      if (!user) {
        message.channel.send("User data did not exist before. Creating...");
        user = {
          id: `${message.guild.id}-${user_obj.id}`,
          user: user_obj.id,
          guild: message.guild.id
        };
        client.setBadge.run(user);
      }
      
      nickname = user_obj.nickname;
      adjusted_nickname = "";
      current_badges = "";
      for (var i = 0; i < nickname_length; i++) {
        if (nickname.charCodeAt(i) < 1000 || nickname.charAt(i) === " ") {
          //message.channel.send(nickname.charAt(i) + " " + nickname.charCodeAt(i));
          adjusted_nickname_length += 1;
          adjusted_nickname += nickname.charAt(i);

        } else {
          current_badges += nickname.charAt(i);
        }
      }
    }
    
    //show them what they have
    //TODO: message different if you call a diff user?
		const badge_embed = new Discord.MessageEmbed()
      .setColor(user_obj.displayHexColor)
      .setThumbnail(user_obj.user.displayAvatarURL)
      .setTitle('**BADGE PROFILE**')
      .setDescription('View a user\'s badge profile here. For specific badge info, do `sg!allBadges`. Note that some badges may look different on different platforms.')
      .addField("**" + adjusted_nickname + "**", "Currently equipped: " + current_badges , false);
    
    for (var i = 0; i < keys.length; i++) {
      if (user[keys[i]] === 0 || user[keys[i]] === null || user[keys[i]] === undefined) {
        continue;
      } else {
        number_owned += user[keys[i]];
        for (let j = 1; j <= user[keys[i]]; j++) {
          switch (badges_json[keys[i]].rarity.toLowerCase()) {
            case ("common"):
              rarity_rating += 1.00;
              break;
            case ("uncommon"):
              rarity_rating += 4.00;
              break;
            case ("rare"):
              rarity_rating += 9.00;
              break;
            case ("epic"):
              rarity_rating += 16.00;
              break;
            case ("legendary"):
              rarity_rating += 25.00;
              break;
            default:
              break;
          }
        }
        badge_embed.addField("__" + badges_json[keys[i]].emoji + " " + badges_json[keys[i]].name + "__", "# owned: " + user[keys[i]], true);
      }
      
    }
    rarity_rating = (rarity_rating/number_owned).toFixed(2);
    
    badge_embed.addField("**OTHER STATS:** ", "__Total # Owned:__ " + number_owned + "   |   __Rarity Rating:__ " + rarity_rating, false);
  
    message.channel.send(badge_embed);
  }
};
