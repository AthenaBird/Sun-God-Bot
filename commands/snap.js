module.exports = {
	name: 'snap',
	description: 'Get sent to the shadow realm!',
	execute(message, args) {
    message.channel.send("Attempting to snap...");
		if(message.member.roles.find(r => r.name === "Kages 👑") || message.member.roles.find(r => r.name === "Moderators 🛡️")) {
      if(!args.length) {
        message.channel.send("@ whoever you want me to snap after the command...");
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
        member.addRole(snapped).catch(console.error);
        member.removeRole(verified).catch(console.error);
        
        message.channel.send("Goodbye, " + message.mentions.members.first());
      }
    } else {
      message.channel.send("You do not have enough infinity stones to perform this command...");
      return;
    }
	},
};