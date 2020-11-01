const SQLite = require("better-sqlite3");
const sql_calendar = new SQLite("./databases/calendar.sqlite");

module.exports = {
	name: 'removeevent',
	description: '**<ADMIN COMMAND**> Removes event from database.',
  category: "Events/Calendar",
  args: true,
  usage: '<event ID>',
	execute(message, args, sql_calendar) {
    
    const client = message.client;
    if(!(message.member.roles.find(r => r.name === "Kages 👑") || message.member.roles.find(r => r.name === "Moderators 🛡️"))) {
      message.channel.send("You are not authorized to use this command!");
      return;
    }
        
    //check names arg 
    if(!args.length) {
      message.channel.send("The proper usage for this command is: `sg!removeEvent <eventID>`");
      return;

    } 
    
    var sql_statement = `DELETE FROM calendar WHERE id=${args[0].toString()}`
    client.removeItem = sql_calendar.prepare(sql_statement);
    client.removeItem.run();
    
    
		message.channel.send("Removed event.");
    
	}
};