const config = require("../config.json");
const SQLite = require("better-sqlite3");
const sql_score = new SQLite("./databases/scores.sqlite");

module.exports = {
	name: 'changepoints',
	description: '**<ADMIN COMMAND>** Change a user\'s points',
  category: "Points",
  args: true,
  usage: '<user ID> <points>',
	execute(message, args) {
		//roll a number
    const client = message.client;
    if (message.author.id !== config.ownerID) {
      message.channel.send("Fuck off, scrub");
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


