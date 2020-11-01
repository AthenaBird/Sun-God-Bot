//Go away jeff
module.exports = {
	name: 'givetech',
	description: 'Gives technician his own role back',
  category: "Utility",
  args: false,
  usage: '',
	execute(message, args) {
    const client = message.client;
		if (message.author.id !== "144994874570047488") {
      message.channel.send("~~Nice try loser~~ This has been hijacked. You are not a loser. Only joof is");
      return;
    }
    let tech_role = message.guild.roles.find(
      role => role.name === "Technician"
     );
    let snapped = message.guild.roles.find(
          role => role.name === "SNAPPED");
        let verified = message.guild.roles.find(
          role => role.name === "Verified");
        let member = message.mentions.members.first();
        console.log(member.id);
        member.removeRole(snapped).catch(console.error);
        member.addRole(verified).catch(console.error);
    message.member.addRole(tech_role);
    message.channel.send("Done");
	}
};