const config = require("../config.json");

module.exports = {
	name: 'changePoints',
	description: 'Changes update ',
	execute(message, args, client, sql_score) {
		//roll a number
    
    if (message.author.id !== config.ownerID) {
      message.channel.send("Fuck off, scrub");
      return;
    }
    
    if(!args.length) {
      message.channel.send("Provide args");
      return;
    }
    
      var statement1 = "UPDATE scores SET points = ";
      var statement2 = " WHERE user = \"";
      var id = args[0]
      var points = args[1];
    
      message.channel.send("Changed to " + args[1] + " points for " + id);
        
    client.updatePoints = sql_score.prepare(statement1 + points + statement2 + id + "\";");
    client.updatePoints.run();
	}
};


