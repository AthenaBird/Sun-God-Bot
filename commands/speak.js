module.exports = {
	name: 'speak',
	description: '**<ADMIN COMMAND>** Speak in triton talk!',
  category: "Utility",
  args: true,
  usage: '<your message>',
	execute(message, args) {
    const client = message.client;
		if (message.author.id !== "433774411682938890") return;
    var words = " ";
    for(var i = 0; i < args.length; i++) {
      words += args[i] + " ";
    }
    client.channels.cache.get("425873171431030786").send(words);
	}
};

