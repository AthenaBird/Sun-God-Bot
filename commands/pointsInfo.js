module.exports = {
  name: "pointsInfo",
  description: "Displays detailed points info!",
  execute(message, args, score) {
    var current_time = new Date().getTime();
    var last_msg = (current_time - score.last_msg) / 1000;
    message.channel.send(
      `**Points: ** ${score.points} \n **Level: ** ${score.level} \n **Streak: ** ${score.streak} \n **Recorded Reset Time: ** ${last_msg} seconds ago \n **Previous Points: ** ${score.prev_points}`
    );
  }
};
