const config = require("../config.json");

module.exports = {
	name: 'nmchange',
	description: 'Changes the nickname of the user',
	execute(message, args) {
    //currently only allows me 
		if (message.author.id === config.ownerID) {
      message.member.setNickname(message.member.nickname + "💩");

      console.log(message.member.nickname.toString().charCodeAt(3));
    } else {
      message.channel.send("Sorry, I can't do that.");
    }
	},
};

