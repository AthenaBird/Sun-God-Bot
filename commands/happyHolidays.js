module.exports = {
  name: "happyHolidays",
  description: "Happy holidays!",
  execute(message, args, client, sql) {
    function addBadges(id) {
      var statement =
        "UPDATE badges SET happy_holidays = 1 WHERE id = '" + id + "';";
      console.log(statement);
      client.addBadge = sql.prepare(statement);
      client.addBadge.run();
    }

    message.channel.send(
      "***Happy Holidays to you too, <@" + message.author.id + ">!! ***"
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
    let holiday_badge = user["happy_holidays"];

    if (holiday_badge >= 1) {
      message.channel.send(
        "I'd love to give you more badges, but you've already gotten this one! 🎄"
      );
      return;
    } else {
      message.channel.send(
        "❄️ Have a fantastic winter break! **🎁 My present to you is the __Happy Holidays badge__: 🎄**. (Do `sg!equip` to wear it in your nickname)"
      );
      addBadges(user_id);
      return;
    }
  }
};
