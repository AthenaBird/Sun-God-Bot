const badges_json = require("../badges.json");
const config = require("../config.json");

module.exports = {
  name: "addBadges",
  description: "Gives users badges as admins",
  execute(message, args, client, sql) {
    //ADDBADGES function allows for the sql updating
    function addBadges(columnName, numberBadges, id) {
      const guild_id = "425866519650631680";
      var statement =
        "UPDATE badges SET " +
        columnName +
        " = " +
        numberBadges +
        ' WHERE user = ' +
        id + " AND guild = " + guild_id;
      console.log(statement);
      client.addBadges = sql.prepare(statement);
      client.addBadges.run();
    }

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
    
    //check to see if the user gets a lEVEL Up or not. If so, add the badge. 
    function levelBadges(columnName, numberBadges, id) {
      
      var original_badge = badges_json[columnName];
      var name = columnName;
      
      //---compares the current badge and the next badge---
      let has_next = true;
      while(has_next) {
        var next_badge = badges_json[name].next;
        var to_next = badges_json[name].level;
        var leveled_badge = badges_json[next_badge];
      
        //compare number of that badge to how many the user owns:
        if(numberBadges < to_next){
          return;
        } else if (numberBadges >= to_next){
          //check if they have enough for even more?
          
        
        }
      }
      
      
      
      var statement =
        "UPDATE badges SET " +
          columnName +
          " = " +
          numberBadges +
          ' WHERE id = "' +
          id +
          '";';
        console.log(statement);
        client.addBadge = sql.prepare(statement);
        client.addBadge.run();
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

    //parse the members to receive badges
    let guild = client.guilds.cache.get("425866519650631680");
    var mentioned = message.mentions.members.first();
    if (mentioned === undefined) {
      message.channel.send("None mentioned, looking for ids instead...");
      if (args[1] === undefined) {
        message.channel.send("No ids were mentioned. Exiting...");
        return;
      } else {
        //check if the IDs are valid.
        for (var i = 1; i < args.length; i++) {
          if (!guild.member(args[i])) {
            message.channel.send(
              "One of the IDs is incorrect. Please check again, now exiting."
            );
            return;
          }
        }
        //now loop thru the user ids
        for (var i = 1; i < args.length; i++) {
          //TODO: can I comebine the versions here and below for mentions and IDs?

          let id_user = getUserID(args[i]);
          if (!id_user) {
            message.channel.send(
              "Please either use IDs or mentions but not both because I'm not that smart yet. Exiting..."
            );
            return;
          }

          //grab the users and check if they are in the database--if not, add
          let user = client.getBadge.get(id_user.id, message.guild.id);
          if (!user) {
            message.channel.send("User data did not exist before. Creating...");
            user = {
              id: `${message.guild.id}-${id_user.id}`,
              user: id_user.id,
              guild: message.guild.id
            };
            client.setBadge.run(user);
          }

          let user_id = `${id_user.id}`;
          let added_amount;
          let prev_amount = user[badge_to_add];
          console.log(prev_amount);
          if (prev_amount >= 1) {
            message.channel.send("This is not their first badge");
          } else {
            
            message.channel.send(
              "This is **" + id_user.nickname + "'s** first badge of this kind."
            );
            prev_amount = 0;
          } 
          
          added_amount = prev_amount + 1;
          
          addBadges(badge_to_add, added_amount, user_id);
          
          /* if(badges_json[badge_to_add].levelable) {
             levelBadges(badge_to_add, added_amount, user_id);
          }*/
          
          message.channel.send(
            "Succesfully added a **" +
              badges_json[badge_to_add].name +
              " " +
              badges_json[badge_to_add].emoji +
              "** badge to **" +
              id_user.nickname +
              "** (" +
              id_user.id +
              ")"
          );
        }
      }

      //there were mentions
    } else {
      //add badges
      for (var i = 1; i < args.length; i++) {
        let mentioned_user = getUserID(args[i]);
        if (!mentioned_user) {
          message.channel.send(
            "Please either use IDs or mentions but not both because I'm not that smart yet. Exiting..."
          );
          return;
        }

        //grab the users and check if they are in the database--if not, add
        let user = client.getBadge.get(mentioned_user.id, message.guild.id);
        if (!user) {
          message.channel.send("User data did not exist before. Creating...");
          user = {
            id: `${message.guild.id}-${mentioned_user.id}`,
            user: mentioned_user.id,
            guild: message.guild.id
          };
          client.setBadge.run(user);
        }

        let user_id = `${mentioned_user.id}`;

        let prev_amount = user[badge_to_add];
        if (prev_amount >= 1) {
          
        } else {
          message.channel.send(
            "This is **" +
              mentioned_user.nickname +
              "**'s first badge of this kind."
          );
          prev_amount = 0;
        }
        
        //check if that badge is levelable
        if (badges_json[keys[i]].levelable) {
          let previous_lvl = badges_json[keys[i]].previous;
          
        }
        
        let added_amount = prev_amount + 1;

        addBadges(badge_to_add, added_amount, user_id);
        message.channel.send(
          "Succesfully added a **" +
            badges_json[badge_to_add].name +
            " " +
            badges_json[badge_to_add].emoji +
            "** badge to **" +
            mentioned_user.nickname +
            "** (" +
            mentioned_user.id +
            ")"
        );
      }
    }
  }
};
