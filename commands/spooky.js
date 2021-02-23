const SQLite = require("better-sqlite3");
const sql = new SQLite("./databases/badges.sqlite");

module.exports = {
  name: "spooky",
  description: "Happy Halloween!",
  execute(message, args) {
    const client = message.client;
    
    function addBadges(id) {
      var statement =
        "UPDATE badges SET halloween = 1 WHERE id = '" + id + "';";
      console.log(statement);
      client.addBadge = sql.prepare(statement);
      client.addBadge.run();
    }

    //Does that user have the badge already?
    let user = client.getBadge.get(message.author.id, message.guild.id);
    if (!user) {
      user = {
        id: `${message.guild.id}-${message.author.id}`,
        user: message.author.id,
        guild: message.guild.id
      };
      client.setBadge.run(user);
    }

    let user_id = `${message.guild.id}-${message.author.id}`;
    let holiday_badge = user["halloween"];

    if (holiday_badge >= 1) {
      message.channel.send(
        "I'd love to give you more badges, but you've already gotten this one! 🎃"
      );
      return;
    } else {
      message.channel.send(
        "**Happy (late) Halloween! 🎃 Thanks for being a part of our server! <@" + message.author.id + ">! Use `sg!equip` to wear this badge.**"
      );
      addBadges(user_id);
      return;
    }
  }
};
