const Discord = require("discord.js");
const badges_json = require("../badges.json");
const SQLite = require("better-sqlite3");
const sql = new SQLite("./databases/badges.sqlite");

module.exports = {
  name: "equipbadges",
  aliases: ["equip"],
  description: "EQUIP your badges in your nickname, for up to 3 badges. To find out how to earn badges, see `sg!allbadges` or `sg!shop`. *Note: if the command crashes, please let me finish adding the reactions before selecting one.*",
  category: "Badges",
  args: false,
  usage: '',
  execute(message, args) {
    const client = message.client;
    
    const keys = Object.keys(badges_json);

    //filters out the selected "val" from the array
    function removeBadge(arr, val) {
      return arr.filter(function(ele) {
        return ele != val;
      });
    }

    //if user has too long of a nickname then do not allow swapping
    var nickname = message.member.nickname;
    var nickname_length = message.member.nickname.length;
    var adjusted_nickname = "";
    var adjusted_nickname_length = 0;
    var current_badges = "";
    for (var i = 0; i < nickname_length; i++) {
      if (nickname.charCodeAt(i) < 1000 || nickname.charAt(i) === " ") {
        //message.channel.send(nickname.charAt(i) + " " + nickname.charCodeAt(i));
        adjusted_nickname_length += 1;
        adjusted_nickname += nickname.charAt(i);
      } else {
        current_badges += nickname.charAt(i);
      }
    }

    //stop it prematurely. maybe later send a dm to me or a mod
    if (adjusted_nickname_length > 28) {
      var over_amount = adjusted_nickname_length - 28;
      message.channel.send(
        "Your nickname is too long to equip badges! One of the <@&493911763172065293> can fix that for you."
      );
      message.channel.send(
        "__" +
          nickname +
          "__ 's name is too long by: **" +
          over_amount +
          "** characters"
      );
      return;
    }

    var number_owned = 0;
    let user;
    let user_obj;
    let avail_badges = new Array();
    let avail_badges_obj = new Object();
    const guild_id = "425866519650631680";
    const guild = client.guilds.cache.get("425866519650631680");

    user_obj = guild.member(message.author.id);
    user = client.getBadge.get(message.author.id, guild_id);

    //show them what they have
    const badge_embed = new Discord.MessageEmbed()
      .setColor("ff4c4c")
      .setTitle("**YOUR UCSD 22 BADGES**")
      .setThumbnail(message.author.avatarURL)
      .setDescription(
        "View and equip your badges here. For detailed badge info, do `sg!allBadges`"
      )
      .addField(
        "**" + adjusted_nickname + "**",
        "Currently equipped badges: " + current_badges,
        true
      );

    for (var i = 0; i < keys.length; i++) {
      let num_badges = user[keys[i]];
      if (num_badges === 0 || num_badges === null || num_badges === undefined) {
        continue;
      } else {
        number_owned += num_badges;
        avail_badges_obj[badges_json[keys[i]].emoji] = num_badges;
        avail_badges.push(badges_json[keys[i]].emoji);

        badge_embed.addField(
          "__" + badges_json[keys[i]].emoji + badges_json[keys[i]].name + "__",
          "Number owned: " + user[keys[i]],
          false
        );
      }
    }
    //ADD X EMOJI
    avail_badges.push("❌");

    badge_embed.addField(
      "**Total number of badges owned:** ",
      number_owned,
      false
    );

    message.channel.send(badge_embed);

    if (number_owned > 0) {
      //now allow for selections:
      //they own at least 1
      const first_embed = new Discord.MessageEmbed()
        .setColor("ff4c4c")
        .setTitle("**FIRST SLOT**:  " + adjusted_nickname)
        .setDescription(
          "Select which badge you would like to equip in your first slot. Please wait for me to finish adding emotes to select one. If you would like to leave this slot blank (and end the equip process) select the ❌ emoji."
        );

      const second_embed = new Discord.MessageEmbed()
        .setColor("ff4c4c")
        .setTitle("**SECOND SLOT**:  " + adjusted_nickname)
        .setDescription(
          "Select which badge you would like to equip in your second slot. Please wait for me to finish adding emotes to select one. If you would like to leave this slot blank (and end the equip process) select the ❌ emoji."
        );

      const third_embed = new Discord.MessageEmbed()
        .setColor("ff4c4c")
        .setTitle("**THIRD SLOT**  " + adjusted_nickname)
        .setDescription(
          "Select which badge you would like to equip in your third (last) slot. Please wait for me to finish adding emotes to select one. If you would like to leave this slot blank (and end the equip process) select the ❌ emoji."
        );

      let first_collected;
      let second_collected;
      let third_collected;

      message.channel.send(first_embed).then(sent => {
        for (let i = 0, p = Promise.resolve(); i < avail_badges.length; i++) {
          p = p.then(
            _ =>
              new Promise(resolve =>
                setTimeout(function() {
                  sent.react(avail_badges[i]);
                  resolve();
                }, 1000)
              )
          );
        }
        const filter = (reaction, user) => {
          return (
            (avail_badges.includes(reaction.emoji.name) ||
              reaction.emoji.name === "❌") &&
            user.id === message.author.id
          );
        };

        const collector = sent.createReactionCollector(filter, {
          maxEmojis: 1,
          time: 45000
        });

        collector.on("collect", (reaction, reactionCollector) => {
          first_collected = reaction.emoji.name;
          console.log(`Collected ${reaction.emoji.name}`);
        });

        collector.on("end", collected => {
          //----REMOVE EMOTE FROM avail_obj_array IF NEEDED----//
          let num_first_badge = avail_badges_obj[first_collected];

          //-- If they selected the x badge -- //
          if (first_collected === "❌") {
            message.channel.send(
              "No badge selected for this slot. Exiting as: **" +
                adjusted_nickname +
                "**"
            );
            message.member.setNickname(adjusted_nickname);
            return;
          }

          if (num_first_badge === 1) {
            avail_badges = removeBadge(avail_badges, first_collected);
            avail_badges_obj[first_collected] =
              avail_badges_obj[first_collected] - 1;
          } else {
            //remove one from the count
            //this is so fucking badly coded but im so tired
            avail_badges_obj[first_collected] =
              avail_badges_obj[first_collected] - 1;
          }
          //----CHECK VALIDITY----
          if (!first_collected) {
            message.channel.send(
              "You did not select a badge on time. Cancelling action..."
            );
            return;
          } else if (number_owned === 1) {
            adjusted_nickname += first_collected;
            message.channel.send("You have no more badges to equip!");
            message.channel.send(
              "Your new nickname: **" + adjusted_nickname + "**"
            );
            adjusted_nickname = " " + adjusted_nickname;
            message.member.setNickname(adjusted_nickname);
            return;
          } else {
            //----CONTINUE ONTO THE SECOND BADGE SELECTION----
            adjusted_nickname += first_collected;
            message.channel.send(second_embed).then(sent => {
              //add reactions
              for (
                let i = 0, p = Promise.resolve();
                i < avail_badges.length;
                i++
              ) {
                p = p.then(
                  _ =>
                    new Promise(resolve =>
                      setTimeout(function() {
                        sent.react(avail_badges[i]);
                        resolve();
                      }, 1000)
                    )
                );
              }

              const filter = (reaction, user) => {
                return (
                  (avail_badges.includes(reaction.emoji.name) ||
                    reaction.emoji.name === "❌") &&
                  user.id === message.author.id
                );
              };

              const collector = sent.createReactionCollector(filter, {
                maxEmojis: 1,
                time: 45000
              });

              collector.on("collect", (reaction, reactionCollector) => {
                second_collected = reaction.emoji.name;
              });

              collector.on("end", collected => {
                //---CHECK VALIDITY----
                //-- If they selected the x badge -- //
                if (second_collected === "❌") {
                  message.channel.send(
                    "No badge selected for this slot. Exiting as: **" +
                      adjusted_nickname +
                      "**"
                  );
                  message.member.setNickname(adjusted_nickname);
                  return;
                }
                //adjusting the badge count
                let num_second_badge = avail_badges_obj[second_collected];
                if (num_second_badge === 1) {
                  avail_badges = removeBadge(avail_badges, second_collected);
                  avail_badges_obj[second_collected] =
                    avail_badges_obj[second_collected] - 1;
                } else {
                  //remove one from the count
                  //this is so fucking badly coded but im so tired
                  avail_badges_obj[second_collected] =
                    avail_badges_obj[second_collected] - 1;
                }
                if (!second_collected) {
                  message.channel.send(
                    "You did not select a badge on time. Cancelling action..."
                  );
                  return;
                } else if (number_owned === 2) {
                  adjusted_nickname += second_collected;
                  message.channel.send("You have no more badges to equip!");
                  message.channel.send(
                    "Your new nickname: **" + adjusted_nickname + "**"
                  );
                  adjusted_nickname = " " + adjusted_nickname;
                  message.member.setNickname(adjusted_nickname);
                  return;
                } else {
                  //---BEGIN THIRD AND LAST EMBED---
                  adjusted_nickname += second_collected;

                  message.channel.send(third_embed).then(sent => {
                    //add emoji reacts
                    for (
                      let i = 0, p = Promise.resolve();
                      i < avail_badges.length;
                      i++
                    ) {
                      p = p.then(
                        _ =>
                          new Promise(resolve =>
                            setTimeout(function() {
                              sent.react(avail_badges[i]);
                              resolve();
                            }, 1000)
                          )
                      );
                    }

                    //collector
                    const filter = (reaction, user) => {
                      return (
                        (avail_badges.includes(reaction.emoji.name) ||
                          reaction.emoji.name === "❌") &&
                        user.id === message.author.id
                      );
                    };

                    const collector = sent.createReactionCollector(filter, {
                      maxEmojis: 1,
                      time: 45000
                    });

                    collector.on("collect", (reaction, reactionCollector) => {
                      third_collected = reaction.emoji.name;
                    });

                    collector.on("end", collected => {
                      //-- If they selected the x badge -- //
                      if (third_collected === "❌") {
                        message.channel.send(
                          "No badge selected for this slot. Exiting as: **" +
                            adjusted_nickname +
                            "**"
                        );
                        message.member.setNickname(adjusted_nickname);
                        return;
                      }
                      if (!third_collected) {
                        message.channel.send(
                          "You did not select a badge on time. Cancelling action..."
                        );
                        return;
                      } else {
                        adjusted_nickname += third_collected;
                        message.channel.send(
                          "You have filled all three spots!"
                        );
                        message.channel.send(
                          "Your new nickname: **" + adjusted_nickname + "**"
                        );
                        adjusted_nickname = " " + adjusted_nickname;
                        message.member.setNickname(adjusted_nickname);
                        return;
                      }
                    });
                  });
                }
              });
            });
          }
        });
      });
    } else {
      //TODO: make this an embed
      message.channel.send(
        "**You do not own any badges! Find out how to earn them using** `sg!badges`."
      );
      return;
    }
  }
};
