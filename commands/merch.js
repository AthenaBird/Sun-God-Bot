const Discord = require("discord.js");

module.exports = {
  name: "merch",
  description: "Find out about our merchandise!",
  execute(message, args) {
    const shop_embed = new Discord.RichEmbed()
      .setColor("ff4c4c")
      .setTitle('UCSD 22 "Merch" Shop')
      .setDescription(
        "If you are interested in buying anything, please venmo @AthenaBird and then in the description write your real name, discord name, and the item number. No money is pocketed; extra money is used for giveaways and prizes. When I receive the payment I will then DM you to set up a time and location for you to pick it up. For non-venmo payments: https://forms.gle/5ShPcEQXejw9jyes6 Thanks for supporting the discord!"
      )
      .addField(
        "1) UCSD 22 3'' Circle Sticker: ",
        "$1",
        true
      )
      .addField(
        "2) WhoPingMe Die Cut Sticker:",
        "$2 [LIMITED SUPPLIES (10)]",
        true
      )
      .addField("3) UCSD 22 Circle Pins: ", "$2", true)
      .addField("4) UCSD 22 Logo: ", "$2 [LIMITED SUPPLIES (10)]", true)
      .addField("5) Discord Emotes Sticker Sheet: ", "$4 [LIMITED SUPPIES (10)]", true)
      .setImage("https://i.imgur.com/Wchhq9D.png");

    message.channel.send(shop_embed);
  }
};
