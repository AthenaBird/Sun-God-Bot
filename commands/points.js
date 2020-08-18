module.exports = {
	name: 'points',
	description: 'Displays the user\'s points. Check the leaderboard with `sg!leaderboard`. You can purchase equippable badges (`sg!shop`, `sg!badges`). ',
  category: "Points",
  args: false,
  usage: '',
	execute(message, args, score) {
		message.reply(`**You currently have ${score.points} points and are level ${score.level}!**`);
	}
};


