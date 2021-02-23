module.exports = {
	name: 'anon',
	description: '***DM SUN GOD WITH THIS COMMAND***. Write anon messages, which are assigned an ID and then posted in #serious.',
  category: "Utility",
  args: true,
  usage: '<your message>',
	execute(message, args) {

    if (message.author.id === "252670263848599563") {
      return;
    }

    const client = message.client;
    
    var id_multiplier = 531;
    var id = parseFloat(message.author.id);
    var anon_id = (id_multiplier * id).toString().substring(12, 15);
    var words = "> `User " + anon_id+ "` : ";
    for(var i = 0; i < args.length; i++) {
      words += args[i] + " ";
    }
    //TODO: print out into a log so people dont abuse this lol
    console.log("ID: " + message.author.id + " | ANON ID: " + anon_id + " | USER: " + message.author.username + " | MESSAGE: " + words);
    client.channels.cache.get("656357040406396958").send(words);
	}
};


