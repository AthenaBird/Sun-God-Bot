const badges_json = require("../badges.json");
const config = require("../config.json");

module.exports = {
  name: "removeBadges",
  description: "Removes users badges as admins",
  execute(message, args, client, sql) {
    //TODO rename this so its actually subtract lol
    //ADDBADGES function allows for the sql updating
    function removeBadges(columnName, numberBadges, id) {
      var statement =
        "UPDATE badges SET " +
        columnName +
        " = " +
        numberBadges +
        ' WHERE id = "' +
        id +
        '";';
      console.log(statement);
      client.removeBadges = sql.prepare(statement);
      client.removeBadges.run();
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

      let guild = client.guilds.get("425866519650631680");

      return guild.member(mention);
    }

    //Variables and constants
    const keys = Object.keys(badges_json);
    var matched = false;
    var badge_to_remove;

    //Conditions for command to work
    if (message.author.id !== config.ownerID) {
      message.channel.send("You are not authorized to use this command.");
      return;
    } else if (!args.length) {
      message.channel.send("Provide the badge name--please use <Badge ID>");
      return;
    } else if (args[1] === null) {
      message.channel.send("Provide a user's ID please");
    }
    // Comment is here for no reason

    //matching the written key with the actual key
    for (var i = 0; i < keys.length; ++i) {
      if (args[0].toLowerCase() === keys[i]) {
        matched = true;
        badge_to_remove = keys[i];
        break;
      }
    }

    //Couldn't find the key.
    if (!matched) {
      message.channel.send("Check your spelling. Is that a valid badge ID?");
      return;
    }
    //TODO: user has not sent a badge

    //parse the members to receive badges
    let guild = client.guilds.get("425866519650631680");
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

          let user_id = `${message.guild.id}-${id_user.id}`;

          let prev_amount = user[badge_to_remove];
          if (
            prev_amount === null ||
            prev_amount === NaN ||
            prev_amount === 0
          ) {
            message.channel.send(
              "**" +
                id_user.nickname +
                "** did not have any of **" +
                badges_json[badge_to_remove].name +
                badges_json[badge_to_remove].emoji +
                "** badge before. Skipping..."
            );
          } else {
            let removed_amount = prev_amount - 1;

            removeBadges(badge_to_remove, removed_amount, user_id);
            message.channel.send(
              "Succesfully removed a **" +
                badges_json[badge_to_remove].name + " " +
                badges_json[badge_to_remove].emoji +
                "** badge from **" +
                id_user.nickname +
                "** (" +
                id_user.id +
                ")"
            );
          }
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

        let user_id = `${message.guild.id}-${mentioned_user.id}`;

        let prev_amount = user[badge_to_remove];
        if (prev_amount === null || prev_amount === NaN || prev_amount === 0) {
          message.channel.send(
            "**" +
              mentioned_user.nickname +
              "** did not have any of **" +
              badges_json[badge_to_remove].name +
              badges_json[badge_to_remove].emoji +
              "** badge before. Skipping..."
          );
        } else {
          let removed_amount = prev_amount - 1;

          removeBadges(badge_to_remove, removed_amount, user_id);
          message.channel.send(
            "Succesfully removed a **" +
              badges_json[badge_to_remove].name + " " +
              badges_json[badge_to_remove].emoji +
              "** badge from **" +
              mentioned_user.nickname +
              "** (" +
              mentioned_user.id +
              ")"
          );
        }
      }
    }
  }
};
