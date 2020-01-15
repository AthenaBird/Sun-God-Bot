module.exports = {
	name: 'points',
	description: 'Displays the user\'s points',
	execute(message, args, score) {
		message.reply(`You currently have ${score.points} points and are level ${score.level}!`);
	}
};


