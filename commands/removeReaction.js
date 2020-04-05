module.exports = {
	name: 'removeReaction',
	description: 'Pong!',
	execute(message, args, client, sql_calendar) {
    
  function kms() {
    const userReactions = message.reactions.cache.get("471374617337135134").users.cache;
    for (var user of userReactions) {
      console.log(user[1].id);
    }
    /*try {
      for (const reaction of userReactions) {
       reaction.users.cache.remove("270415554995552256");
      }
    } catch (error) {
      console.error(error);
    }*/

  }
    
    setTimeout(kms, 5000);
    /*function hi () {
      const reaction = message.reactions.cache.get('hypers:471374617337135134');
    try {
	      for (const user of reaction.users.values()) {
	  	    console.log(user.ID);
      }
    } catch (error) {
	    console.error('Failed to remove reactions.');
    }
      console.log("hi")
    }
    setTimeout(hi, 5000); */
    //setTimeout(time => console.log(message.reactions.filter(a => a.emoji.name == 'birb:636686833002217492').map(m => m.users)[0]), 5000);
   // console.log(console.log(message.reactions.filter(a => a.emoji.name == 'birb:636686833002217492').map(m => m.users)[0]));
  //let channel = client.channels.get("589715402490118154");
    
  //var msg = channel.fetchMessage("684938001557618711").then(message => {
          //check for the reax\
    //console.log(message.reactions);
          //console.log(message.reactions.filter(a => a.emoji.name == '☑️').map(m => m.users)[0]);
          //console.log(message);
          //const reaction = message.get
          //const message.reactions.array()[1].users;
    
  
          //console.log(reaction);
      //    //console.log(reaction);
          //const userReactions = message.reactions.filter(reaction => reaction.users.has("433774411682938890"));
     // console.log(reaction.users.values())
	      /*for (const user of reaction.users.values()) {
          console.log("hi");
          console.log(reaction);
		       console.log(user);
	      } */

    //}); 
	}
};






