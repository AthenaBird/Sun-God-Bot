const Discord = require("discord.js");
const badges_json = require("./badges.json");
const config = require("./config.json");
const Enmap = require("enmap");
const fs = require("fs");
const SQLite = require("better-sqlite3");
const sql_score = new SQLite("./databases/scores.sqlite");
const sql = new SQLite("./databases/badges.sqlite");
const sql_emblems = new SQLite("./databases/emblems.sqlite");
const sql_calendar = new SQLite("./databases/calendar.sqlite");
const sql_todo = new SQLite("./databases/todo.sqlite");
const http = require("http");
const express = require("express");
const app = express();

const POINT_SUBTRACT = 1;
const POINT_BASE = 10;
const POINT_MIN = 1;
const STREAK_MAX = 3;

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands/")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

//Ping thyself
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);

  //---EVENT CHECKER---//
  //Checks every hour and accesses the database
  //TODO: this is in the messages section so it only checks if a message has been sent....
  var c_time = new Date();
  
  var minutes_time = c_time.getMinutes().toString();
  var seconds_time = c_time.getSeconds().toString();
  
  //setTimeout(s=> {console.log("Time check" + minutes_time + " " + seconds_time)}, 1000);
  //&& (Number(seconds_time) > 0 && Number(seconds_time) <= 10)
  
  //if (minutes_time === "40" && (Number(seconds_time) % 10 === 0)) 
     console.log("Checking calendar for event notifications...")
     setTimeout(s => {client.commands.get("checkCalendar").execute(client, sql_calendar)}, 10000);  
 
});

app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.on("ready", () => {
  //set activity
  client.user.setActivity("sg!help", { type: "LISTENING" });

  //prepare the badges table
  const table = sql
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'badges';"
    )
    .get();
  if (!table["count(*)"]) {
    // If the table isn't there, create it and setup the database correctly.
    sql
      .prepare(
        "CREATE TABLE badges (id TEXT PRIMARY KEY, user TEXT, guild TEXT);"
      )
      .run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_badges_id ON badges (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }

  //Auto adds the badges as columns
  const keys = Object.keys(badges_json);
  for (var i = 0; i < keys.length; ++i) {
    try {
      var sql_badge_add = `ALTER TABLE badges ADD COLUMN ${keys[i]} INT;`;
      sql.prepare(sql_badge_add).run();
    } catch (err) {}
  }

  // And then we have two prepared statements to get and set the score data
  let statement = "SELECT * FROM badges WHERE user = ? AND guild = ?";
  client.getBadge = sql.prepare(statement);
  client.setBadge = sql.prepare(
    "INSERT OR REPLACE INTO badges (id, user, guild) VALUES (@id, @user, @guild);"
  );

  //prepare the scores table
  const score_table = sql_score
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';"
    )
    .get();
  if (!score_table["count(*)"]) {
    // If the table isn't there, create it and setup the database correctly.
    sql_score
      .prepare(
        "CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER, last_msg BIGINT, streak INTEGER, prev_points INTEGER);"
      )
      .run();
    // Ensure that the "id" row is always unique and indexed.
    sql_score
      .prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);")
      .run();
    sql_score.pragma("synchronous = 1");
    sql_score.pragma("journal_mode = wal");
  }

  // And then we have two prepared statements to get and set the score data.
  client.getScore = sql_score.prepare(
    "SELECT * FROM scores WHERE user = ? AND guild = ?"
  );
  client.setScore = sql_score.prepare(
    "INSERT OR REPLACE INTO scores (id, user, guild, points, level, last_msg, streak, prev_points) VALUES (@id, @user, @guild, @points, @level, @last_msg, @streak, @prev_points);"
  );

  //----EVENTS TABLE----//
  const events_table = sql_calendar
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'calendar';"
    )
    .get();
  if (!events_table["count(*)"]) {
    // If the table isn't there, create it and setup the database correctly.
    sql_calendar
      .prepare(
        "CREATE TABLE calendar (id TEXT PRIMARY KEY, name TEXT, host TEXT, category TEXT, priority INT, description TEXT, start_time BIGINT, end_time BIGINT, location TEXT, notify INT);"
      )
      .run();
    // Ensure that the "id" row is always unique and indexed.
    sql_calendar.prepare("CREATE UNIQUE INDEX idx_calendar_id ON calendar (id);").run();
    sql_calendar.pragma("synchronous = 1");
    sql_calendar.pragma("journal_mode = wal");
  }

  client.setCalendar = sql_calendar.prepare(
    "INSERT OR REPLACE INTO calendar (id, name, host, category, priority, description, start_time, end_time, location, notify) VALUES (@id, @name, @host, @category, @priority, @description, @start_time, @end_time, @location, @notify);"
  );
  client.getCalendar = sql_calendar.prepare(
    "SELECT * FROM calendar ORDER BY start_time ASC");
  
  //-----TODO TABLE-----//
  const todo_table = sql_todo
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'todo';"
    )
    .get();
  if (!todo_table["count(*)"]) {
    // If the table isn't there, create it and setup the database correctly.
    sql_todo
      .prepare(
        "CREATE TABLE todo (id TEXT PRIMARY KEY, priority INT, description TEXT, start_time BIGINT, end_time BIGINT, location TEXT, notify INT);"
      )
      .run();
    // Ensure that the "id" row is always unique and indexed.
    sql_todo.prepare("CREATE UNIQUE INDEX idx_todo_id ON todo (id);").run();
    sql_todo.pragma("synchronous = 1");
    sql_todo.pragma("journal_mode = wal");
  }

});

//EVENT HANDLER FOR MESSAGE
client.on("message", message => {
  //prevents reply to itself for now

  //---FUNCTION TO CALCULATE POINTS----//
  function add_points(last_msg, streak, prev_points) {
    //First test to see if it is within the next 24 hour period

    var points = 0.0;
    var current_time = new Date().getTime();

    // it has been! 24 hours!
    if (last_msg + 86400000 < current_time) {
      //streak available 172800
      if (current_time - last_msg < 129600000) {

        if (streak >= STREAK_MAX) {
          last_msg = new Date().getTime();
          streak = streak;
          prev_points = POINT_BASE + streak;
          points = POINT_BASE + streak;
        } else {
          last_msg = new Date().getTime();
          streak = streak + 1;
          prev_points = POINT_BASE + streak;
          points = POINT_BASE + streak;
        }

        //missed streak = back to 10
      } else {

        last_msg = new Date().getTime();
        streak = 0;
        prev_points = POINT_BASE;
        points = POINT_BASE;
        //ADD Base points
      }

      //it has not been 24 hours
    } else {
      //make sure it doesnt go below min
      points = prev_points - POINT_SUBTRACT;
      if (points < POINT_MIN) {
        points = 0;
        prev_points = 0;
      } else {
        prev_points = points;
      }
    }

    var changes = [last_msg, streak, prev_points, points];
    return changes;
  }

  
  //---COMMANDS AND MESSAGES---//

  if (message.author.bot) return;

  //press f to pay respects
  if (
    message.content.toLowerCase() === "press f to pay respects" ||
    message.content.toLowerCase() === "f in chat" ||
    message.content.toLowerCase() === "f"
  ) {
    message.channel.send("F");
  }
  if (message.content.toLowerCase() === "goodnight") {
    message.channel.send("Goodnight!! Don't let the bed bugs bite :)");
  }

  //!message.content.startsWith(config.prefix) ||
  if (message.author.bot) return;

  //increment score per message
  let score;
  if (message.guild) {
    score = client.getScore.get(message.author.id, message.guild.id);
    var time = new Date().getTime();
    if (!score) {
      score = {
        id: `${message.guild.id}-${message.author.id}`,
        user: message.author.id,
        guild: message.guild.id,
        points: 0.0,
        level: 1,
        last_msg: time,
        streak: 0,
        prev_points: 10.0
      };
    }
    //add score time!
    if (message.channel.id !== "457046533716574210") {
      var changes = add_points(score.last_msg, score.streak, score.prev_points);
      score.last_msg = changes[0];
      score.streak = changes[1];
      score.prev_points = changes[2];
      score.points += changes[3];
    }

    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
    if (score.level < curLevel) {
      score.level++;
      message.reply(`You've leveled up to level **${curLevel}**! For more info or shop, type <sg!help points>.`);
    }
    client.setScore.run(score);
  }

  //-----badges-----//
  let user;
  if (message.guild) {
    user = client.getBadge.get(message.author.id, message.guild.id);
    if (!user) {
      user = {
        id: `${message.guild.id}-${message.author.id}`,
        user: message.author.id,
        guild: message.guild.id
      };
      client.setBadge.run(user);
    }
  }

  //-----ARGUMENT AND COMMAND HANDLING------//
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const commandName = args.shift().toLowerCase();
  
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) {
    message.reply("that is not a valid command! Use `sg!help` for a list of commands.")
    return;
  };
  if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}! `;
    
    if(command.usage) {
      let prefix = config.prefix;
      reply += `\n> **The proper usage should be**: \`${prefix}${command.name} ${command.usage}\`\n`
    }
    return message.channel.send(reply);
	}

  try {
    if(commandName === "points" || commandName === "pointsinfo") {
      command.execute(message, args, score)
    } else if (commandName === "checkCalendar") {
      command.execute(client, sql_calendar)
      
    } else {
      command.execute(message, args);
    }
    
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command! Please notify any admin/mod for help.');
  }


  // //now for the commands
  // if (command === "help") {
  //   client.commands.get("help").execute(message, args);
  // } else if (command === "points") {
  //   client.commands.get("points").execute(message, args, score);
  // } else if (command === "pointsinfo") {
  //   client.commands.get("pointsInfo").execute(message, args, score);
  // } else if (command === "changepoints") {
  //   client.commands
  //     .get("changePoints")
  //     .execute(message, args);
  // } else if (command === "leaderboard") {
  //   client.commands
  //     .get("leaderboard")
  //     .execute(message, args, sql_score);
  // } else if (command === "roll") {
  //   client.commands
  //     .get("roll")
  //     .execute(message, args, score);
  // } else if (command === "ping") {
  //   client.commands.get("ping").execute(message, args);
  // } else if (command === "speak") {
  //   client.commands.get("speak").execute(message, args);
  // } else if (command === "convo") {
  //   client.commands.get("convo").execute(message, args);
  // } else if (command === "nmcount") {
  //   client.commands.get("nmCount").execute(message, args);
  // } else if (command === "nmchange") {
  //   client.commands.get("nmChange").execute(message, args);
  // } else if (command === "verify") {
  //   client.commands.get("verify").execute(message, args);
  // } else if (command === "viewbadges") {
  //   client.commands.get("viewBadges").execute(message, args);
  // } else if (command === "allbadges") {
  //   client.commands.get("allBadges").execute(message, args);
  // } else if (
  //   command === "equipbadges" ||
  //   command === "equipBadge" ||
  //   command === "equip"
  // ) {
  //   client.commands.get("equipBadges").execute(message, args);
  // } else if (command === "addbadges" || command === "addbadge") {
  //   client.commands.get("addBadges").execute(message, args);
  // } else if (command === "removebadges" || command === "removebadge") {
  //   client.commands.get("removeBadges").execute(message, args);
  // } else if (command === "clearbadges") {
  //   client.commands.get("clearBadges").execute(message, args);
  // } else if (command === "retrievebadges") {
  //   client.commands.get("retrieveBadges").execute(message, args);
  // } else if (command === "findbadges") {
  //   client.commands.get("findBadges").execute(message, args);
  // } else if (
  //   command === "badges" ||
  //   command === "badge" ||
  //   command === "badgeshelp" ||
  //   command === "badgehelp"
  // ) {
  //   client.commands.get("badges").execute(message, args);
  // } else if (command === "merch") {
  //   client.commands.get("merch").execute(message, args);
  // } else if (command === "shop") {
  //   client.commands.get("shop").execute(message, args);
  // } else if (command === "zoom") {
  //   client.commands.get("aprilFools").execute(message, args);
  // } else if (command === "events" || command === "calendar") {
  //   client.commands.get("calendar").execute(message, args);
  // } else if (command === "createevent") {
  //   client.commands.get("createEvent").execute(message, args);
  // } else if (command === "removeevent") {
  //   client.commands.get("removeEvent").execute(message, args);
  // } else if (command == "checkcalendar") {
  //   client.commands.get("checkCalendar").execute(client, sql_calendar);
  // } else if (command === "promote") {
  //   client.commands.get("promote").execute(message, args);
  // } else if (command === "changelog") {
  //   client.commands.get("changelog").execute(message, args);
  // } else if (command === "anon") {
  //   client.commands.get("anon").execute(message, args);
  // } else if (command === "givetech") {
  //   client.commands.get("givetech").execute(message,args);
  // } else if (command === "topic") {
  //   client.commands.get("topic").execute(message, args);  
  // } else if (command === "bulletin") {
  //   client.commands.get("bulletin").execute(message, args);
  // } else {
  //   message.channel.send("That is not a valid command!");
  //   return;
  //   // You might as well have an array that runs a for loop through everything smh
  // }
});

client.login(process.env.TOKEN);
