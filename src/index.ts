import * as discord from 'discord.js';

import * as fs from 'fs';
import * as SQLite from 'better-sqlite3';
import * as http from 'http';
import * as express from 'express';

const app = express();
const sqlScore = new SQLite('./databases/scores.sqlite');
const sql = new SQLite('./databases/badges.sqlite');
const sqlEmblems = new SQLite('./databases/emblems.sqlite');

const badgesJson = require('./badges.json');
const config = require('./config.json');

interface ExecuteFunction {
  (message: discord.Message, args: string[]): void;
  (message: discord.Message, args: string[], client: discord.Client): void;
  (
    message: discord.Message,
    args: string[],
    client: discord.Client,
    db: SQLite.Database
  ): void;
  (
    message: discord.Message,
    args: string[],
    client: discord.Client,
    db: SQLite.Database,
    score?: ScoreObject
  ): void;
  (
    message: discord.Message,
    args: string[],
    client: discord.Client,
    db: SQLite.Database,
    scoreDB: SQLite.Database
  ): void;
  (
    message: discord.Message,
    args: string[],
    client: SQLite.Database,
    db: discord.Client
  ): void;
  (message: discord.Message, args: string[], score?: ScoreObject): void;
}

interface CommandModule {
  name: string;
  execute: ExecuteFunction;
}
interface Helper {
  getBadge: SQLite.Statement;
  setBadge: SQLite.Statement;
  getScore: SQLite.Statement;
  setScore: SQLite.Statement;
}

interface ScoreObject {
  id: string;
  user: string;
  guild: string;
  points: number;
  level: number;
  last_msg: number;
  streak: number;
  prev_points: number;
}

const POINT_SUBTRACT = 1;
const POINT_BASE = 10;
const POINT_MIN = 1;
const STREAK_MAX = 5;

const client = new discord.Client();
const commands = new discord.Collection<string, CommandModule>();
const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

const _helpers: Helper = {} as Helper; // FIXME: Minor typing hack here

const noopCommand = {
  execute: () => void 0,
};

function getCommand(name: string) {
  return commands.get(name) ?? noopCommand;
}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  commands.set(command.name, command);
}

// Ping thyself
app.get('/', (_request, response) => {
  console.log(Date.now() + ' Ping Received');
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.on('ready', () => {
  // set activity
  client.user.setActivity('sg!help', { type: 'LISTENING' });

  const table = sql
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'badges';"
    )
    .get();
  if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql
      .prepare(
        'CREATE TABLE badges (id TEXT PRIMARY KEY, user TEXT, guild TEXT);'
      )
      .run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare('CREATE UNIQUE INDEX idx_badges_id ON badges (id);').run();
    sql.pragma('synchronous = 1');
    sql.pragma('journal_mode = wal');
  }

  //Auto adds the badges as columns
  const keys = Object.keys(badgesJson);
  for (let i = 0; i < keys.length; ++i) {
    try {
      const sqlBadgeAdd = `ALTER TABLE badges ADD COLUMN ${keys[i]} INT;`;
      sql.prepare(sqlBadgeAdd).run();
    } catch (err) { }
  }

  // And then we have two prepared statements to get and set the score data
  const statement = 'SELECT * FROM badges WHERE user = ? AND guild = ?';
  _helpers.getBadge = sql.prepare(statement);
  _helpers.setBadge = sql.prepare(
    'INSERT OR REPLACE INTO badges (id, user, guild) VALUES (@id, @user, @guild);'
  );

  const scoreTable = sqlScore
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';"
    )
    .get();
  if (!scoreTable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sqlScore
      .prepare(
        'CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER, last_msg BIGINT, streak INTEGER, prev_points INTEGER);'
      )
      .run();
    // Ensure that the "id" row is always unique and indexed.
    sqlScore.prepare('CREATE UNIQUE INDEX idx_scores_id ON scores (id);').run();
    sqlScore.pragma('synchronous = 1');
    sqlScore.pragma('journal_mode = wal');
  }

  // And then we have two prepared statements to get and set the score data.
  _helpers.getScore = sqlScore.prepare(
    'SELECT * FROM scores WHERE user = ? AND guild = ?'
  );
  _helpers.setScore = sqlScore.prepare(
    'INSERT OR REPLACE INTO scores (id, user, guild, points, level, last_msg, streak, prev_points) VALUES (@id, @user, @guild, @points, @level, @last_msg, @streak, @prev_points);'
  );
});

//---FUNCTION TO CALCULATE POINTS----//
function addPoints(lastMsg: number, streak: number, prevPoints: number) {
  //First test to see if it is within the next 24 hour period

  let points = 0.0;
  const now = new Date().getTime();

  // it has been! 24 hours!
  if (lastMsg + 86400000 < now) {
    //streak available 172800
    if (now - lastMsg < 86400000) {
      console.log('Your 24 hour cycle has reset!');

      if (streak >= STREAK_MAX) {
        lastMsg = new Date().getTime();
        streak = streak;
        prevPoints = POINT_BASE + streak;
        points = POINT_BASE + streak;
      } else {
        lastMsg = new Date().getTime();
        console.log('Streak increased');
        streak = streak + 1;
        prevPoints = POINT_BASE + streak;
        points = POINT_BASE + streak;
      }

      //missed streak = back to 10
    } else {
      console.log('missed streak');

      lastMsg = new Date().getTime();
      streak = 0;
      prevPoints = POINT_BASE;
      points = POINT_BASE;
      //ADD Base points
    }

    //it has not been 24 hours
  } else {
    //make sure it doesnt go below min
    points = prevPoints - POINT_SUBTRACT;
    if (points < POINT_MIN) {
      points = 0;
      prevPoints = 0;
    } else {
      prevPoints = points;
    }
  }

  const changes = [lastMsg, streak, prevPoints, points];
  return changes;
}

//EVENT HANDLER FOR MESSAGE
client.on('message', message => {
  //prevents reply to itself for now

  if (message.author.bot) return;

  //press f to pay respects
  if (
    message.content.toLowerCase() === 'press f to pay respects' ||
    message.content.toLowerCase() === 'f in chat' ||
    message.content.toLowerCase() === 'f'
  ) {
    message.channel.send('F');
  }
  if (message.content.toLowerCase() === 'goodnight') {
    message.channel.send("Goodnight!! Don't let the bed bugs bite :)");
  }

  //increment score per message
  const time = new Date().getTime();
  let score: ScoreObject | undefined = undefined;
  if (message.guild) {
    score = _helpers.getScore.get(message.author.id, message.guild.id) ?? {
      id: `${message.guild.id}-${message.author.id}`,
      user: message.author.id,
      guild: message.guild.id,
      points: 0.0,
      level: 1,
      last_msg: time,
      streak: 0,
      prev_points: 10.0,
    };

    //add score time!
    if (message.channel.id !== '457046533716574210') {
      const changes = addPoints(
        score!.last_msg,
        score!.streak,
        score!.prev_points
      );
      score!.last_msg = changes[0];
      score!.streak = changes[1];
      score!.prev_points = changes[2];
      score!.points += changes[3];
    }

    const curLevel = Math.floor(0.1 * Math.sqrt(score!.points));
    if (score!.level < curLevel) {
      score!.level++;
      message.reply(`You've leveled up to level **${curLevel}**!`);
    }
    _helpers.setScore.run(score);
  }

  //badge
  let user;
  if (message.guild) {
    user = _helpers.getBadge.get(message.author.id, message.guild.id);
    if (!user) {
      user = {
        id: `${message.guild.id}-${message.author.id}`,
        user: message.author.id,
        guild: message.guild.id,
      };
      _helpers.setBadge.run(user);
    }
  }

  //format the command and the arguments
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = (args.shift() ?? '').toLowerCase();
  //now for the commands
  if (command === 'help') {
    getCommand('help').execute(message, args);
  } else if (command === 'points') {
    getCommand('points').execute(message, args, score);
  } else if (command === 'pointsinfo') {
    getCommand('pointsInfo').execute(message, args, score);
  } else if (command === 'changepoints') {
    getCommand('changePoints').execute(message, args, client, sqlScore);
  } else if (command === 'leaderboard') {
    getCommand('leaderboard').execute(message, args, sqlScore, client);
  } else if (command === 'roll') {
    getCommand('roll').execute(message, args, client, sqlScore, score);
  } else if (command === 'ping') {
    getCommand('ping').execute(message, args);
  } else if (command === 'speak') {
    getCommand('speak').execute(message, args, client);
  } else if (command === 'convo') {
    getCommand('convo').execute(message, args, client);
  } else if (command === 'nmcount') {
    getCommand('nmCount').execute(message, args);
  } else if (command === 'nmchange') {
    getCommand('nmChange').execute(message, args);
  } else if (command === 'verify') {
    getCommand('verify').execute(message, args, client);
  } else if (command === 'viewbadges') {
    getCommand('viewBadges').execute(message, args, client, sql);
  } else if (command === 'allbadges') {
    getCommand('allBadges').execute(message, args);
  } else if (
    command === 'equipbadges' ||
    command === 'equipBadge' ||
    command === 'equip'
  ) {
    getCommand('equipBadges').execute(message, args, client, sql);
  } else if (command === 'addbadges' || command === 'addbadge') {
    getCommand('addBadges').execute(message, args, client, sql);
  } else if (command === 'removebadges' || command === 'removebadge') {
    getCommand('removeBadges').execute(message, args, client, sql);
  } else if (command === 'clearbadges') {
    getCommand('clearBadges').execute(message, args, client, sql);
  } else if (command === 'retrievebadges') {
    getCommand('retrieveBadges').execute(message, args, client, sql);
  } else if (command === 'findbadges') {
    getCommand('findBadges').execute(message, args);
  } else if (
    command === 'badges' ||
    command === 'badge' ||
    command === 'badgeshelp' ||
    command === 'badgehelp'
  ) {
    getCommand('badges').execute(message, args);
  } else if (command === 'merch') {
    getCommand('merch').execute(message, args);
  } else if (command === 'shop') {
    getCommand('shop').execute(message, args, client, sql, sqlScore);
  } else if (command === 'happyholidays') {
    getCommand('happyHolidays').execute(message, args, client, sql);
  } else {
    message.channel.send('That is not a valid command!');
    return;
    // You might as well have an array that runs a for loop through everything smh
  }
});

client.login(process.env.TOKEN);
