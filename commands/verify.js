const config = require("../config.json");

module.exports = {
	name: 'verify',
	description: 'Verifies a new member by giving them the roles and the name!',
	execute(message, args, client) {
    
    //Helper function
    function getUserID(mention) {
      if (!mention) return;

      if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention = mention.slice(2, -1);
      }
      if (mention.startsWith("!")) {
        mention = mention.slice(1);
      }

      let guild = client.guilds.get("425866519650631680");

      return guild.member(mention);
      
    }
    
    
		if (message.author.id === !config.ownerID) {
      return;
    }
    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, {
      maxMatches: 5,
      time: 60000
    });
    message.channel.send(
      "Please hit enter in the following order: mention the user/the user ID, name, major, college, and class (`22`, `23`, or `older`). Type cancel to cancel the action."
    );

    let completed = true;

    collector.on("collect", m => {
      if (m.content === "cancel") {
        completed = false;
        message.channel.send("Action cancelled by user.");
        collector.stop();
      } else {
        m.react("\u2705");
        console.log(`Collected ${m.content}`);
      }
    });

    let info = [];
    let spacer = " | ";

    collector.on("end", collected => {
      console.log(`Collected ${collected.size} items`);
      console.log(collector.collected.array().toString());
      info = collector.collected.array();

      const revelle_role_name = "Revelle";
      const muir_role_name = "Muir";
      const marshall_role_name = "Marshall";
      const warren_role_name = "Warren";
      const erc_role_name = "ERC";
      const sixth_role_name = "Sixth";
      const nonUCSD_role_name = "Non UCSD";
      const class_22_role_name = "22";
      const class_23_role_name = "23";
      const class_older_role_name = "older";
      const class_other_role_name = "assumed 22";

      //THis could be better done by actually finding the role IDs but im lazy
      let revelle_role = message.guild.roles.find(
        role => role.name === "Revelle"
      );
      let muir_role = message.guild.roles.find(role => role.name === "Muir");
      let marshall_role = message.guild.roles.find(
        role => role.name === "Marshall"
      );
      let warren_role = message.guild.roles.find(
        role => role.name === "Warren"
      );
      let erc_role = message.guild.roles.find(role => role.name === "ERC");
      let sixth_role = message.guild.roles.find(role => role.name === "Sixth");
      let nonUCSD_role = message.guild.roles.find(
        role => role.name === "Non UCSD"
      );
      let class_23_role = message.guild.roles.find(
        role => role.name === "Zoomies"
      );
      let class_older_role = message.guild.roles.find(
        role => role.name === "Boomies"
      );
      let verified_role = message.guild.roles.find(
        role => role.name === "Verified"
      );

      var roles = [];
      var college_name;
      var class_name;
      
      let guild = client.guilds.get("425866519650631680");
      let user;
      var mentioned = info[0].mentions.members.first();
      
      //if no mentions
      if (mentioned === undefined) {
        message.channel.send("None mentioned, looking for ids instead...");
        //if no ids
        if (info[0].id === undefined) {
          message.channel.send("No ids were mentioned. Exiting...");
          return;
        } else {
          //check if the IDs are valid.
          for (var i = 1; i < args.length; i++) {
            if (!guild.member(args[i])) {
              message.channel.send(
                "One of the IDs is incorrect. Please check again, now exiting."
              );
              return;
            }
          }
          //retrieve the member from the guild as an object
          console.log(info[0].id);
          user = guild.member(info[0].content);

        }
        
      //set the member as the mention
      } else {

        user = info[0].mentions.members.first();
      }
      
      //begin clapping asses and adding nicknames
      if (completed) {
        var verified_name = info[1].toString().length;
        var verified_major = info[2].toString().length;
        var verified_college = info[3].toString().length;

        var count = verified_name + verified_major + verified_college + 6;

        if (count > 29) {
          message.channel.send(
            "This nickname is either too long or will not have enough slots for the badges. Please retry the verify command."
          );
        } else {
          

          //give  college roles
          switch (info[3].content.toLowerCase()) {
            case revelle_role_name.toLowerCase():
              //member.addRole(revelle_role).catch(console.error);
              college_name = revelle_role_name;
              roles.push(revelle_role);
              break;
            case muir_role_name.toLowerCase():
              //member.addRole(muir_role).catch(console.error);
              college_name = muir_role_name;
              roles.push(muir_role);
              break;
            case marshall_role_name.toLowerCase():
              //give the revelle role
              //member.addRole(marshall_role).catch(console.error);
              college_name = marshall_role_name;
              roles.push(marshall_role);
              break;
            case warren_role_name.toLowerCase():
              //member.addRole(warren_role).catch(console.error);
              college_name = warren_role_name;
              roles.push(warren_role);
              break;
            case erc_role_name.toLowerCase():
              //member.addRole(erc_role).catch(console.error);
              college_name = erc_role_name;
              roles.push(erc_role);
              break;
            case sixth_role_name.toLowerCase():
              //member.addRole(sixth_role).catch(console.error);
              college_name = sixth_role_name;
              roles.push(sixth_role);
              break;
            default:
              //member.addRole(nonUCSD_role).catch(console.error);
              college_name = nonUCSD_role_name;
              roles.push(nonUCSD_role);
              break;
          }
          //give class roles
          switch (info[4].content.toLowerCase()) {
            case class_22_role_name.toLowerCase():
              //No class role given
              class_name = class_22_role_name;
              break;
            case class_23_role_name.toLowerCase():
              //member.addRole(class_23_role).catch(console.error);
              class_name = class_23_role_name;
              roles.push(class_23_role);
              break;
            case class_older_role_name.toLowerCase():
              //member.addRole(class_older_role).catch(console.error);
              class_name = class_older_role_name;
              roles.push(class_older_role)
              break;
            default:
              // No class role given
              class_name = class_other_role_name;
              break;
          }
          
          roles.push(verified_role);

          //verify role and set nickname
          user.setRoles(roles).catch(console.error);
          user.setNickname(
            info[1].content +
              spacer +
              info[2].content +
              spacer +
              info[3].content
          );
          //A way to do confirmations would be nice
          message.channel.send(
            "Verified: **" +
              info[1] +
              spacer +
              info[2] +
              spacer +
              info[3] +
              "** under **" +
              college_name +
              "** and in the class of **" +
              class_name +
              "**"
          );
          //keeping verify clean
          for(var i =0; i< info.length; i++){
            
            
            
          }
          client.channels.get("425873171431030786").send("***🎉🎉Welcome <@" + user.id + "> to this server!🎉🎉*** Please check out #roles to get roles and create a profile in #profiles!");
          
        }
      }
    });
  }
}


