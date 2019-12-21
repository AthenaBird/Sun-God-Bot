module.exports = {
	name: 'unsnap',
	description: 'Unsnaps a user!',
	execute(message, args) {
		message.channel.send("Attempting to unsnap...");
		if(message.member.roles.find(r => r.name === "Kages 👑") || message.member.roles.find(r => r.name === "Moderators 🛡️")) {
      if(!args.length) {
        message.channel.send("@ whoever you want me to unsnap after the command...");
        return;
      } else if (!message.mentions.members.first()) {
        message.channel.send("I didn't see a mention; try again");
        return;
      } else {
        let snapped = message.guild.roles.find(
          role => role.name === "SNAPPED");
        let verified = message.guild.roles.find(
          role => role.name === "Verified");
        let member = message.mentions.members.first();
        console.log(member.id);
        member.removeRole(snapped).catch(console.error);
        member.addRole(verified).catch(console.error);
        
        message.channel.send("Enjoy your trip back, " + message.mentions.members.first());
      }
    } else {
      message.channel.send("You used the stones to destroy the stones, now you can't unsnap.");
      return;
    }
	},
};