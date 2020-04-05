module.exports = {
  name: "aprilFools",
  description: "Happy April Fools!",
  execute(message, args, client, sql) {
    function addBadges(id) {
      var statement =
        "UPDATE badges SET april_fools = 1 WHERE id = '" + id + "';";
      console.log(statement);
      client.addBadge = sql.prepare(statement);
      client.addBadge.run();
    }

    message.channel.send(
      "***ｚｏｏｍ ｉｓ ｌｏｖｅ． ｚｏｏｍ ｉｓ ｌｉｆｅ．Don't you agree, <@" + message.author.id + ">? ***"
    );

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
    let holiday_badge = user["april_fools"];

    if (holiday_badge >= 1) {
      message.channel.send(
        "I'd love to give you more badges, but you've already gotten this one! 🃏"
      );
      return;
    } else {
      message.channel.send(
        "🃏 **Welcome to Zoom University: 🃏**. (Do `sg!equip` and select the emoji to wear it in your nickname) *April Fools!*"
      );
      addBadges(user_id);
      return;
    }
  }
};
