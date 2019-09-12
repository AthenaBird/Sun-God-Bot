//require the discord.js module
const Discord = require("discord.js");

//require the config file
const {prefix, token} = require('./config.json');

//creates a new Discord client 
const client = new Discord.Client();


//second argument is a call back function
//it doesn't happen until the first one is called in the first place
client.on("ready", () => {
  console.log("I am ready!");
  client.user.setActivity('\&help', { type: 'LISTENING' });
});

//command listener 
client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    //splices the arguments of the command and args
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    //help command
    if (command === 'help') {
        message.channel.send("My prefix is \& but I am still a work in progress \:poop:");
        console.log(message.author.username.toString());
    //arg check command
    } else if (command === 'argcheck') {
        if(!args.length) {
            return message.channel.send(`You didn't provide any argumnents, ${message.author}!`);
        }
        message.channel.send(`Arguments sent: ${args}`);
    //kick (fake) commanmd
    } else if (command === 'kick') {
        if(!args.length) {
            return message.channel.send(`Try again but with a user mention, ${message.author}.`);
        }
        const taggedUser = message.mentions.users.first();
        message.channel.send(`Sike, you thought you could kick ${taggedUser} but I'm currently a powerless bot...`);
    }
});


 
client.login(token);