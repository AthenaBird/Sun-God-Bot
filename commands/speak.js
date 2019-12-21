module.exports = {
	name: 'speak',
	description: 'Speaks!',
	execute(message, args, client) {
		if (message.author.id !== "433774411682938890") return;
    var words = " ";
    for(var i = 0; i < args.length; i++) {
      words += args[i] + " ";
    }
    client.channels.get("425873171431030786").send(words);
	},
};