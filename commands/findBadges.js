const badges_json = require("../badges.json");
const config = require("../config.json");

module.exports = {
	name: 'findBadges',
	description: 'Tells admin the id of a badge',
	execute(message, args) {
		
    //Variables and constants
    const keys = Object.keys(badges_json);
    var matched = false;
    var badge_id;
    

    //Conditions for command to work
    if (message.author.id !== config.ownerID) {
      message.channel.send("You are not authorized to use this command.");
      return;
    } else if (!args.length) {
      message.channel.send("Provide the badge emote--please use <Emote>");
      return;
    }
    // Comment is here for no reason

    //matching the written key with the actual key
    for (var i = 0; i < keys.length; ++i) {
      console.log(badges_json[keys[i]].emoji);
      if (badges_json[keys[i]].emoji === args[0]) {
        matched = true;
        badge_id = keys[i];
        break;
      }
    }
    console.log(args[0]);

    //Couldn't find the key.
    if (!matched) {
      message.channel.send("Check your spelling. Is that a valid badge emote?");
      return;
    } else {
      message.channel.send("**ID: **" + badge_id);
    }
    
	}
};


