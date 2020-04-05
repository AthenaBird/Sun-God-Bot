module.exports = {
	name: 'anon',
	description: 'Write anon messages!',
	execute(message, args, client) {
    
    var id_multiplier = 320.69;
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


