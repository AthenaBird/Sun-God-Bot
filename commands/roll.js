module.exports = {
	name: 'roll',
	description: 'Spend one point to possibly earn 5!',
	execute(message, args, client, sql_score, score) {
    
    if (true) {
      message.channel.send("Removed due to spam issues >:(");
      return;
    }
		if(!args.length) {
      message.channel.send("Provide a number between 1 and 20 after the command");
      return;
    } else if (isNaN(args[0])) {
      message.channel.send("Provide a number between 1 and 20 after the command");
      return;
    } else if (parseInt(args[0]) > 20 || parseInt(args[0]) <= 0) {
      message.channel.send("Provide a number between 1 and 20 after the command");
      return;
    }
    
    //roll a number
    var num = Math.floor((Math.random() * 20) + 1);
    var statement1 = "UPDATE scores SET points = ";
    var statement2 = " WHERE user = \"";
    var id = score.user
    var points = score.points;
    message.reply("**I rolled a " + num + "!**");
    if (num === parseInt(args[0])){
      message.channel.send("Congrats! You win twelve points!");
      points = points + 12;
    } else if (num === parseInt(args[0]) + 1 || num === parseInt(args[0]) - 1) {
      message.channel.send("Good job, you won four points.");
      points = points + 4;
    } else {
      message.channel.send("Sorry, you lost a point. Thanks for playing!");
      points = points - 1;
    }
        
    client.updatePoints = sql_score.prepare(statement1 + points + statement2 + id + "\";");
    client.updatePoints.run();
    
	}
};


