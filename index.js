const http = require("http");
const express = require("express");
const app = express();
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const SQLite = require("better-sqlite3");
const sql = new SQLite("./rps.sqlite");
const fs = require('fs');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

var bToggle = false;

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.once("ready", () => {
  console.log("Ready!");
  const table = sql
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'rps';"
    )
    .get();
  if (!table["count(*)"]) {
    // If the table isn't there, create it and setup the database correctly.
    sql
      .prepare(
        "CREATE TABLE rps (id TEXT PRIMARY KEY, user TEXT, guild TEXT, score INTEGER);"
      )
      .run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_rps_id ON rps (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }

  // And then we have two prepared statements to get and set the score data.
  client.getScore = sql.prepare(
    "SELECT * FROM rps WHERE user = ? AND guild = ?"
  );
  client.setScore = sql.prepare(
    "INSERT OR REPLACE INTO rps (id, user, guild, score) VALUES (@id, @user, @guild, @score);"
  );

  client.user.setActivity("the demise of Sun God Bot", { type: "WATCHING" });
});

client.on("message", message => {
  //format the command and the arguments
  //!message.content.startsWith(config.prefix) ||
  if (message.author.bot) return;

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (message.content.toLowerCase() === "69") {
    message.channel.send("nice");
  }

  if (message.content.toLowerCase() === "wtf") {
    const cursecat = client.emojis.find(emoji => emoji.name === "cursecat");
    message.channel.send(`${cursecat}`);
  }

  if (message.content.toLowerCase() === "420") {
    message.channel.send("**blaze it**");
  }

  if (
    message.content.toLowerCase().includes("fuck you moon") ||
    message.content.toLowerCase().includes("stupid moon")
  ) {
    message.channel.send("fuck you too 🖕");
  }

  if (
    (message.content.toLowerCase().includes("vore") ||
      message.content.toLowerCase().includes("v o r e")) &&
    message.content.indexOf(config.prefix) !== 0
  ) {
    if (message.content.toLowerCase().includes("vore")) {
      

      /* let extra = Math.floor(Math.random() * Math.floor(100));
      if (message.author.id === "175792267590762496") {
        message.channel.send("I\'m starting to think that you're saying vore on purpose...");
      } else if (5 <= extra && extra < 10) {
        message.channel.send("*sigh* here we go again");
      } */
    }
    /* if (message.content.toLowerCase().includes("v o r e"))
      message.channel.send(
        "*you thought you could get away with that vore mention, didja?'*"
      );*/
    /* var last_vore = config.last_vore;
    var current_vore = Math.round(new Date().getTime() / 1000);

    var difference = current_vore - last_vore;
    var time_difference = Math.round(difference / 60);
    config.last_vore = current_vore;

    message.channel.send(
      "The last mention had been " + time_difference + " minutes ago." 
    ); */
  }
  //for later       .setThumbnail('https://i.imgur.com/hEg8Pkn.png')

  //press E to pay respects
  if (
    message.content.toLowerCase() === "press f to pay respects" ||
    message.content.toLowerCase() === "f in chat"
  ) {
    message.channel.send("E");
  }

  //goodnight
  if (message.content.toLowerCase() === "goodnight") {
    message.channel.send("nobody cares that you're going to sleep lol");
  }

  

  /*if (command === "vorecount") {
    //ideally want to store this in a json but global var is good for now
    var last_vore = config.last_vore;
    var current_vore = Math.round(new Date().getTime() / 1000);

    var difference = current_vore - last_vore;
    var hour_difference = Math.round(difference);
    config.last_vore = current_vore;

    message.channel.send(
      "It had been **" +
        hour_difference +
        "** seconds since the last vore mention...but thanks to you, it's at 0 now."
    );
  } else if (command === "updaterps") {
    /* const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, {
      maxMatches: 1,
      time: 15000
    });
    message.channel.send(
      "Please enter your rice purity score. Keep in mind that this can be checked by any member publically so only input if you feel comfortable. Type cancel to cancel the action."
    );

    var score;

    collector.on("collect", m => {
     if (m.content === "cancel") {
        message.channel.send("Action cancelled by user.");
        collector.stop();
        //exception likely
      } 
    if (
        !m.content.isNaN() ||
        m.content.parseInt() < 0 ||
        m.content.parseInt() > 100
      ) {
        message.channel.send("Input a valid rice purity score please.");
        collector.stop();
      } else {
        message.channel.send("hi");
        score = m.content.parseInt();
      }
    }); 8? */

  /*if (!args.length) {
      message.channel.send("The proper way to use this command is `mg!updateRPS <your_score>`");
    } else if (!isNaN(args[0].toString()) || args[0] < 0 || args[0] > 100) {
      message.channel.send("I seriously doubt your rice purity score is " + args[0].toString() + "...");
    } else if (args[0] === "help") {
      message.channel.send("Update your rice purity score by running `mg!updateRPS <your_score>`. Keep in mind that this will be public and can be accessed by other people.");
    } else {
      message.channel.send("yay you have passed");
    }*/

  //============WRITE CODE BELOW================//
  //"aight" == "imma head out"
  if (message.content.toLowerCase() === "aight") {
    message.channel.send("imma head out");
  }
  
  
  
  // TEST BOT HELPER BM
  if(message.isMentioned('637806606775615498')){
    console.log("mentioned a role");
    var statements = [
      "Have you tried putting it in rice?",
      "Maybe turn it off and turn it back on again?",
      "You know the TAs have an email for a reason...",
      "check semicolons dumbass",
      "well look who didnt attend their discussion section",
      "you can retake a class but you cant retake a party"
    ];
    message.channel.send(
      statements[Math.floor(Math.random() * statements.length)]
    );
  }
  
  //ENG HELPER BM
  if(message.isMentioned('585683246055161863')){
    console.log("mentioned a role");
    var statements = [
      "KNOW YOUR FORMULAS",
      "CHECK YOUR SIG FIGS",
      "DROP THE MAJOR",
      "This answer is trivial",
      "TF YOU DONT KNOW HOW TO SOLVE A PARTIAL DIFF EQ with 3 boundry conditions?",
      "matlab it",
      "Clearly not top 10 public engineering school material"
    ];
    message.channel.send(
      statements[Math.floor(Math.random() * statements.length)]
    );
  }
  
  //CS HELPER BM
  if(message.isMentioned('585681474779349024')){
    console.log("mentioned a role");
    var statements = [
      "DID YOU FORGET *ANOTHER* SEMICOLON? ",
      "CHECK YOUR SIG FIGS",
      "DROP THE MAJOR",
      "This answer is trivial",
      "you should have been taught this in the intro class",
      "You belong in the dungeon"
    ];
    message.channel.send(
      statements[Math.floor(Math.random() * statements.length)]
    );
  }
  
  //MATH HELPER BM
  if(message.isMentioned('585681297645764627')){
    console.log("mentioned a role");
    var statements = [
      "you can't count ",
      "switch your degrees and radians dummy",
      "https://www.wolframalpha.com/",
      "just add lol",
      "you should have been taught this in the intro class",
      "matlab it"
    ];
    message.channel.send(
      statements[Math.floor(Math.random() * statements.length)]
    );
  }
  
  //BIO HELPER BM
  if(message.isMentioned('585681666312241162')){
    console.log("mentioned a role");
    var statements = [
      "mitochondria is the powerhouse of the cell ",
      "you're missing brain cells",
      "maybe don't apply to med school",
      "",
      "you should have been taught this in the intro class",
      "matlab it"
    ];
    message.channel.send(
      statements[Math.floor(Math.random() * statements.length)]
    );
  }
  
  //CHEM HELPER BM
  if(message.isMentioned('585681519054422016')){
    console.log("mentioned a role");
    var statements = [
      "just add HCl",
      "switch your degrees and radians dummy",
      "YOU'RE STUPID",
      "This answer is trivial",
      "you should have been taught this in the intro class",
      "matlab it"
    ];
    message.channel.send(
      statements[Math.floor(Math.random() * statements.length)]
    );
  }
  
  //PHYSICS HELPER BM
  if(message.isMentioned('585681575740571650')){
    console.log("mentioned a role");
    var statements = [
      "PHYSUCKS ",
      "Did you remember air resistance?",
      "are you metric or imperial smh",
      "Just Taylor expand it lmao",
      "did you try F=ma",
      "gravity isnt always earth"
    ];
    message.channel.send(
      statements[Math.floor(Math.random() * statements.length)]
    );
  }
  
  
  if (message.content.indexOf(config.prefix) !== 0) return;

  if (command === "ping") {
    client.commands.get("ping").execute(message, args);
  } else if (command === "b") {
    client.commands.get("b").execute(message, args);
  } else if (command === "speak") {
    client.commands.get("speak").execute(message, args, client);
  } else if (command === "snap") {
    client.commands.get("snap").execute(message, args);
  } else if (command === "unsnap") {
    client.commands.get("unsnap").execute(message, args);
  } else if (command === "poll") {
    client.commands.get("poll").execute(message, args, client);
  } else {
    message.channel.send("I don't know what you're trying to tell me, but that is not a valid commnad.");
  }

});

client.login(config.token);
