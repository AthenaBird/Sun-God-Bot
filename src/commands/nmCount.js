module.exports = {
	name: 'nmCount',
	description: 'Counts the number of characters in your nickname.',
	execute(message, args) {
		var nickname_length = message.member.nickname.length;
    message.channel.send(
      "Your nickname is currently: **" + nickname_length + "** characters long."
    );
    if (nickname_length > 29) {
      message.channel.send(
        "Your nickname is too long for badges! Ask an admin to shorten it for you."
      );
    } else {
      message.channel.send("Your nickname is short enough to add badges!");
    }
	},
};