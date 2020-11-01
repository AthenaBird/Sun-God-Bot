module.exports = {
	name: 'ping',
	description: 'Pong!',
  category: "Utility",
  args: false,
  usage: '',
	execute(message, args) {
		message.channel.send("Pong!!");
	}
};


