const Discord = require("discord.js");

module.exports = {
	name: 'bulletin',
	description: 'Check what is on the bulletin! WIP',
  category: "Events/Calendar",
  args: false,
  usage: '',
	execute(message, args) {

	const client = message.client;
	const guild = client.guilds.cache.get("425866519650631680");
	const member = guild.member(message.author.id);

	const author_id = message.author.id;

	var id = message.id;
    var type = "";
    var ping = 0;

    async function addReactions(message) {
      await message.react("🗓️")
      await message.react("💸");
      await message.react("📣");
      await message.react("🚨");
      await message.react("📩");
      await message.react("❌");
    }

    function check_char(limit, item) {

    	if (item.length > limit) {
    		message.channel.send("**Your message is over the permitted character limit *(" + limit + " characters)*, please check and try again!** Exiting command...")
    		return false;
    	} else {
    		return true;
    	}

    }

    function notify_mods(member, type, id, posting) {

    	const mod_embed = new Discord.MessageEmbed()
    		.setTitle("**📌 NEW BULLETIN POST REQUEST 📌 **")
    		.setColor("ff4c4c")
    		.setDescription("A member has submitted a bulletin post request. Please review and choose to **ACCEPT** or **DECLINE**.")
    		.addField("Info", "Bulletin type: " + type, false)
    		.addField("**ACCEPT**", "Type `sg!bulletinAccept " + id + "`", false)
    		.addField("**DECLINE**", "Type `sg!bulletinDecline " + id + "`", false)

    	client.channels.cache.get("574453676513558528").send(mod_embed).then(sent => {
    		sent.channel.send("**__REQUEST FROM: <@" + author_id +  ">__**")
    		posting.setFooter("ID: " + id);
    		sent.channel.send(posting);

    	});

    }

    function event(sent) {

    	var title = "";
      	var desc = "";
      	var date = "";
      	var time = "";
      	var location = "";

      	const event_embed_desc = new Discord.MessageEmbed()
        	.setTitle("**🗓️ · EVENT SETUP 1/5 · 🗓️**")
        	.setDescription("In the following message, enter your **EVENT TITLE** in the next message.")
      
      	const filter = m => m.author.id === message.author.id;
      	message.channel.send(event_embed_desc).then(() => {
      	message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
        .then(collected => {
          	title = collected.first().content;
          	
          	//send day description info
          	const event_embed_info = new Discord.MessageEmbed()
          	.setTitle("**🗓️ · EVENT SETUP 2/5 · 🗓️**")
          	.setDescription("Enter your **EVENT DESCRIPTION** within one message (discord formatting is permitted, but watch out for the 2000 character limit).")

       		message.channel.send(event_embed_info).then(() => {
       		message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
       			.then(collected => { 

       			desc = collected.first().content;
       			if (!check_char(2000, desc)) return;
       			// send time info
       			const event_embed_time = new Discord.MessageEmbed()
       				.setTitle("**🗓️ · EVENT SETUP 3/5 · 🗓️**")
       			    .setDescription("Enter the **DATE**, **TIME**, and **LOCATION** in three seperate messages following the specific format: \n\n \
          				> MM/DD/YY \n > HH:MM AM/PM - HH:MM AM/PM (end time optional) \n > LOCATION/LINK(S) \n\n *For single digit hours, make sure to include the 0 (like 09:00 AM instead of 9:00 AM)*");

	       			message.channel.send(event_embed_time).then(() => {
	       			message.channel.awaitMessages(filter, { max: 3, time: 300000, errors: ['time'] })
	       				.then(collected => {

	       				date = collected.array()[0].content;
	       				time = collected.array()[1].content;
	       				location = collected.array()[2].content

	       				// send confirmation
	       				const event_embed_confirm = new Discord.MessageEmbed()
	       					.setTitle("**🗓️ · EVENT SETUP 4/5 · 🗓️**")
	       					.setDescription("This is how your event will look on the bulletin board. \n\n ***Is this correct?*** Select ✅ or ❌");

	       				message.channel.send(event_embed_confirm).then(confirm_msg => {
	       					const event_embed_example = new Discord.MessageEmbed()
	       						.setTitle("🗓️ · **EVENT:**  __" + title + "__ · 🗓️ ")
	       						.setColor(member.displayHexColor)
	       						.setThumbnail(message.author.displayAvatarURL())
	       						.setDescription(desc)
	       						.addField("**DATE**", "> " + date, false)
	       						.addField("**TIME**", "> " + time, false)
	       						.addField("**LOCATION / LINK(S)**", "> " + location, false)

							const event_embed_user = new Discord.MessageEmbed()
							       					.setTitle("*From **" + member.nickname  + "**:*")
							       					.setColor(member.displayHexColor)

	       					message.channel.send(event_embed_user)
	       					message.channel.send(event_embed_example);

	       						
	       					confirm_msg.react("✅");
	       					confirm_msg.react("❌");

	       					const filter = (reaction, user) => {
						        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
						      };

						      confirm_msg.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).then(collected => {
						        const reaction = collected.first();
						        if (reaction.emoji.name == "✅") {

						        	// confirm notification or not. 
						        	const event_embed_notif = new Discord.MessageEmbed()
						        		.setTitle("**🗓️ · EVENT SETUP 5/5 · 🗓️**")
						        		.setDescription("Would you like the <@&763635199719505931> role to be pinged? **Please note that this is a self-assigned role (<#656320898655191071>), and __if you do not have it yourself \
						        			you will not be able to use this ping in your bulletin post__.** \n\n Select ✅ or ❌")

						        	message.channel.send(event_embed_notif).then(notif_msg => {

						        		notif_msg.react("✅");
	       								notif_msg.react("❌");

	       								const filter = (reaction, user) => {
						        			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
						      			};

						      			notif_msg.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).then(collected => {
						      				const reaction = collected.first();

						      				if (reaction.emoji.name == "✅") {
						      					//check to see if user has the bulletin role
						      					if(!(message.member.roles.cache.find(r => r.name === "Bulletin"))) {
												    message.channel.send("**Because you do not have the <@&763635199719505931> role, the ping will not be enabled on your message.**");
												    ping = 0;
												} else {
													message.channel.send("**Your request has been submitted! Please wait for a mod to approve.**")
													ping = 1;
												}

												//send to SQL database for approval, and then notify mods 
												//TODO send to SQL message
												notify_mods(message.author, type, id, event_embed_example);


						      				} else {
						      					//cancels command
						      					message.channel.send("Exiting command...");
						      					return;
						      				}


						      			}).catch(collected => {
						      				 message.channel.send('No response collected, exiting...');
	          								 return;
						      		    })


						        	}).catch(collected => {
						        		message.channel.send('No response collected, exiting...');
	          							return;
						        	})

						        } else {
						        	message.channel.send("Exiting command...")
						        	return;
						        }

						      }).catch(collected => {
						      	message.channel.send('No response collected, exiting...');
	          					return;
						      })
	       					

	       				})

	       				}).catch(collected => {
	       					message.channel.send('No response collected, exiting...');
	          				return;
	       				})

	       			})

       			}).catch(collected => { 
       				message.channel.send('No response collected, exiting...');
          			return;

       			})

       		}).catch(collected => {
       			message.channel.send('No response collected, exiting...');
          		return;
       		});


      		}).catch(collected => {
         	 	message.channel.send('No response collected, exiting...');
          		return;
      		});
    	});

    }

    function listing(sent) {

    	var title = "";
    	var desc = "";
    	var links = "";

    	const listing_embed_title = new Discord.MessageEmbed()
        	.setTitle("**💸 · LISTING SETUP 1/5 · 💸**")
        	.setDescription("In the following message, enter your **LISTING TITLE** in the next message.")

        const filter = m => m.author.id === message.author.id;
      	message.channel.send(listing_embed_title).then(() => {
      	message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] }).then(collected => {
      		title = collected.first().content;

      		const listing_embed_desc = new Discord.MessageEmbed()
      			.setTitle("**💸 · LISTING SETUP 2/5 · 💸**")
      			.setDescription("In the following message, enter your **LISTING DESCRIPTION** within one message (discord formatting is permitted, but watch out for the 2000 character limit). \
      				Save important links for the last step of the setup.")

      		message.channel.send(listing_embed_desc).then(() => {
      		message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] }).then(collected => {
      			desc = collected.first().content;

      			const listing_embed_link = new Discord.MessageEmbed()
      				.setTitle("**💸 · LISTING SETUP 3/5 · 💸**")
      				.setDescription("In the following message, enter your **LISTING LINKS** in the next message, including any `imgur` images. Check to make sure that the link(s) is under 1024 characters, \
      					and seperate links with a newline within ONE message.")

      			message.channel.send(listing_embed_link).then(() => {
      			message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] }).then(collected => {
      				links = collected.first().content;

      				const listing_embed_confirm = new Discord.MessageEmbed()
	       				.setTitle("**💸 · LISTING SETUP 4/5 · 💸**")
	       				.setDescription("This is how your listing will look on the bulletin board. \n\n ***Is this correct?*** Select ✅ or ❌");

	       			message.channel.send(listing_embed_confirm).then(confirm_msg => {
						const listing_embed_example = new Discord.MessageEmbed()
	       						.setTitle("💸 · **LISTING:**  __" + title + "__ · 💸 ")
	       						.setColor(member.displayHexColor)
	       						.setThumbnail(message.author.displayAvatarURL())
	       						.setDescription(desc)
	       						.addField("**LINKS**", "> " + links, false)
	       						.addField("*Any questions?*", "> Please message <@" + author_id + ">", false)

	       					message.channel.send(listing_embed_example);
	       						
	       					confirm_msg.react("✅");
	       					confirm_msg.react("❌");

	       					const filter = (reaction, user) => {
						        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
						      };

						    confirm_msg.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).then(collected => {
						        const reaction = collected.first();
						        if (reaction.emoji.name == "✅") {
						        	const listing_embed_notif = new Discord.MessageEmbed()
						        		.setTitle("**💸 · LISTING SETUP 5/5 · 💸**")
						        		.setDescription("Would you like the <@&763635199719505931> role to be pinged? **Please note that this is a self-assigned role (<#656320898655191071>), and __if you do not have it yourself \
						        			you will not be able to use this ping in your bulletin post__.** \n\n Select ✅ or ❌")

						        	message.channel.send(listing_embed_notif).then(notif_msg => {

						        		notif_msg.react("✅");
	       								notif_msg.react("❌");

	       								const filter = (reaction, user) => {
						        			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
						      			};

						      			notif_msg.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).then(reactions => {
						      				if (reaction.emoji.name == "✅") {
						      					//check to see if user has the bulletin role
						      					if(!(message.member.roles.cache.find(r => r.name === "Bulletin"))) {
												    message.channel.send("**Because you do not have the <@&763635199719505931> role, the ping will not be enabled on your message.**");
												    ping = 0;
												} else {
													message.channel.send("**Your request has been submitted! Please wait for a mod to approve.**")
													ping = 1;
												}

												//send to SQL database for approval, and then notify mods 
												//TODO send to SQL message
												notify_mods(message.author, type, id, listing_embed_example);


						      				} else {
						      					//cancels command
						      					message.channel.send("Exiting command...");
						      					return;
						      				}

						      			}).catch(collected => {
						      				message.channel.send("No response collected. Exiting command...");
						        			return;
						      			})

						        	})


						        } else {
						        	message.channel.send("Exiting command...");
						        	return;
						        }

						    }).catch(collected => {
						    	message.channel.send("No response collected. Exiting command...");
      							return;
						    })
	       			})


      			}).catch(collected => {
      				message.channel.send("No response collected. Exiting command...");
      				return;
      			})

      			})

      		}).catch(collected => {
      			message.channel.send("No response collected. Exiting command...");
      			return;
      		})

      		})

      	}).catch(collected => {
      		message.channel.send("No response collected. Exiting command...");
      		return;
      	})

      	})
    
    }

	function promotion(sent) {

    	var title = "";
    	var desc = "";
    	var links = "";

    	const promotion_embed_title = new Discord.MessageEmbed()
        	.setTitle("**📣 · PROMOTION SETUP 1/5 · 📣**")
        	.setDescription("In the following message, enter your **PROMOTION TITLE** in the next message.")

        const filter = m => m.author.id === message.author.id;
      	message.channel.send(promotion_embed_title).then(() => {
      	message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] }).then(collected => {
      		title = collected.first().content;

      		const promotion_embed_desc = new Discord.MessageEmbed()
      			.setTitle("**📣 · PROMOTION SETUP 2/5 · 📣**")
      			.setDescription("In the following message, enter your **PROMOTION DESCRIPTION** within one message (discord formatting is permitted, but watch out for the 2000 character limit). \
      				You can save important links for the last step of the setup.")

      		message.channel.send(promotion_embed_desc).then(() => {
      		message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] }).then(collected => {
      			desc = collected.first().content;

      			const promotion_embed_link = new Discord.MessageEmbed()
      				.setTitle("**📣 · PROMOTION SETUP 3/5 · 📣**")
      				.setDescription("In the following message, enter your **PROMOTION LINKS** in the next message, including any `imgur` images. Check to make sure that the link(s) is under 1024 characters, \
      					and seperate links with a newline within ONE message.")

      			message.channel.send(promotion_embed_link).then(() => {
      			message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] }).then(collected => {
      				links = collected.first().content;

      				const promotion_embed_confirm = new Discord.MessageEmbed()
	       				.setTitle("**📣 · PROMOTION SETUP 4/5 · 📣**")
	       				.setDescription("This is how your promotion will look on the bulletin board. \n\n ***Is this correct?*** Select ✅ or ❌");

	       			message.channel.send(promotion_embed_confirm).then(confirm_msg => {
						const promotion_embed_example = new Discord.MessageEmbed()
	       						.setTitle("📣 · **PROMOTION:**  __" + title + "__ · 📣 ")
	       						.setColor(member.displayHexColor)
	       						.setThumbnail(message.author.displayAvatarURL())
	       						.setDescription(desc)
	       						.addField("**LINKS**", "> " + links, false)
	       						.addField("*Any questions?*", "> Please message <@" + author_id + ">", false)

	       					message.channel.send(promotion_embed_example);
	       						
	       					confirm_msg.react("✅");
	       					confirm_msg.react("❌");

	       					const filter = (reaction, user) => {
						        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
						      };

						    confirm_msg.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).then(collected => {
						        const reaction = collected.first();
						        if (reaction.emoji.name == "✅") {
						        	const promotion_embed_notif = new Discord.MessageEmbed()
						        		.setTitle("**📣 · PROMOTION SETUP 5/5 · 📣**")
						        		.setDescription("Would you like the <@&763635199719505931> role to be pinged? **Please note that this is a self-assigned role (<#656320898655191071>), and __if you do not have it yourself \
						        			you will not be able to use this ping in your bulletin post__.** \n\n Select ✅ or ❌")

						        	message.channel.send(promotion_embed_notif).then(notif_msg => {

						        		notif_msg.react("✅");
	       								notif_msg.react("❌");

	       								const filter = (reaction, user) => {
						        			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
						      			};

						      			notif_msg.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).then(reactions => {
						      				if (reaction.emoji.name == "✅") {
						      					//check to see if user has the bulletin role
						      					if(!(message.member.roles.cache.find(r => r.name === "Bulletin"))) {
												    message.channel.send("**Because you do not have the <@&763635199719505931> role, the ping will not be enabled on your message.**");
												    ping = 0;
												} else {
													message.channel.send("**Your request has been submitted! Please wait for a mod to approve.**")
													ping = 1;
												}

												//send to SQL database for approval, and then notify mods 
												//TODO send to SQL message
												notify_mods(message.author, type, id, promotion_embed_example);


						      				} else {
						      					//cancels command
						      					message.channel.send("Exiting command...");
						      					return;
						      				}

						      			}).catch(collected => {
						      				message.channel.send("No response collected. Exiting command...");
						        			return;
						      			})

						        	})


						        } else {
						        	message.channel.send("Exiting command...");
						        	return;
						        }

						    }).catch(collected => {
						    	message.channel.send("No response collected. Exiting command...");
      							return;
						    })
	       			})


      			}).catch(collected => {
      				message.channel.send("No response collected. Exiting command...");
      				return;
      			})

      			})

      		}).catch(collected => {
      			message.channel.send("No response collected. Exiting command...");
      			return;
      		})

      		})

      	}).catch(collected => {
      		message.channel.send("No response collected. Exiting command...");
      		return;
      	})

      	})
    
    }

    function alert(sent) {

    	var title = "";
    	var desc = "";
    	var links = "";

    	const alert_embed_title = new Discord.MessageEmbed()
        	.setTitle("**🚨 · ALERT SETUP 1/5 · 🚨**")
        	.setDescription("In the following message, enter your **ALERT TITLE** in the next message.")

        const filter = m => m.author.id === message.author.id;
      	message.channel.send(alert_embed_title).then(() => {
      	message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] }).then(collected => {
      		title = collected.first().content;

      		const alert_embed_desc = new Discord.MessageEmbed()
      			.setTitle("**🚨 · ALERT SETUP 2/5 · 🚨**")
      			.setDescription("In the following message, enter your **ALERT DESCRIPTION** within one message (discord formatting is permitted, but watch out for the 2000 character limit). \
      				You can save important links for the last step of the setup.")

      		message.channel.send(alert_embed_desc).then(() => {
      		message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] }).then(collected => {
      			desc = collected.first().content;

      			const alert_embed_link = new Discord.MessageEmbed()
      				.setTitle("**🚨 · ALERT SETUP 3/5 · 🚨**")
      				.setDescription("In the following message, enter your **ALERT LINKS** in the next message, including any `imgur` images. Check to make sure that the link(s) is under 1024 characters, \
      					and seperate links with a newline within ONE message.")

      			message.channel.send(alert_embed_link).then(() => {
      			message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] }).then(collected => {
      				links = collected.first().content;

      				const alert_embed_confirm = new Discord.MessageEmbed()
	       				.setTitle("**🚨 · ALERT SETUP 4/5 · 🚨**")
	       				.setDescription("This is how your alert will look on the bulletin board. \n\n ***Is this correct?*** Select ✅ or ❌");

	       			message.channel.send(alert_embed_confirm).then(confirm_msg => {
						const alert_embed_example = new Discord.MessageEmbed()
	       						.setTitle("🚨 · **ALERT:**  __" + title + "__ · 🚨 ")
	       						.setColor(member.displayHexColor)
	       						.setThumbnail(message.author.displayAvatarURL())
	       						.setDescription(desc)
	       						.addField("**LINKS**", "> " + links, false)
	       						.addField("*Any questions?*", "> Please message <@" + author_id + ">", false)

	       					message.channel.send(alert_embed_example);
	       						
	       					confirm_msg.react("✅");
	       					confirm_msg.react("❌");

	       					const filter = (reaction, user) => {
						        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
						      };

						    confirm_msg.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).then(collected => {
						        const reaction = collected.first();
						        if (reaction.emoji.name == "✅") {
						        	const alert_embed_notif = new Discord.MessageEmbed()
						        		.setTitle("**🚨 · ALERT SETUP 5/5 · 🚨**")
						        		.setDescription("Would you like the <@&763635199719505931> role to be pinged? **Please note that this is a self-assigned role (<#656320898655191071>), and __if you do not have it yourself \
						        			you will not be able to use this ping in your bulletin post__.** \n\n Select ✅ or ❌")

						        	message.channel.send(alert_embed_notif).then(notif_msg => {

						        		notif_msg.react("✅");
	       								notif_msg.react("❌");

	       								const filter = (reaction, user) => {
						        			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
						      			};

						      			notif_msg.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).then(reactions => {
						      				if (reaction.emoji.name == "✅") {
						      					//check to see if user has the bulletin role
						      					if(!(message.member.roles.cache.find(r => r.name === "Bulletin"))) {
												    message.channel.send("**Because you do not have the <@&763635199719505931> role, the ping will not be enabled on your message.**");
												    ping = 0;
												} else {
													message.channel.send("**Your request has been submitted! Please wait for a mod to approve.**")
													ping = 1;
												}

												//send to SQL database for approval, and then notify mods 
												//TODO send to SQL message
												notify_mods(message.author, type, id, alert_embed_example);


						      				} else {
						      					//cancels command
						      					message.channel.send("Exiting command...");
						      					return;
						      				}

						      			}).catch(collected => {
						      				message.channel.send("No response collected. Exiting command...");
						        			return;
						      			})

						        	})


						        } else {
						        	message.channel.send("Exiting command...");
						        	return;
						        }

						    }).catch(collected => {
						    	message.channel.send("No response collected. Exiting command...");
      							return;
						    })
	       			})


      			}).catch(collected => {
      				message.channel.send("No response collected. Exiting command...");
      				return;
      			})

      			})

      		}).catch(collected => {
      			message.channel.send("No response collected. Exiting command...");
      			return;
      		})

      		})

      	}).catch(collected => {
      		message.channel.send("No response collected. Exiting command...");
      		return;
      	})

      	})
    
    }

    function other(sent) {

    	const other_embed = new Discord.MessageEmbed()
    		.setTitle("**📩 · OTHER REQUEST · 📩**")
    		.setDescription("If you would like to make a specific request to the mods, ***please DM any of them***! We would be happy to manually put up an announcement if you have pictures, if your \
    			posting exceeds 2k characters, or any other unique circumstances.")

    	message.channel.send(other_embed);

    }

    id = message.id;

    const menu_embed = new Discord.MessageEmbed()
      .setColor("ff4c4c")
      .setTitle("**📌 · __DISCORD BULLETIN BOARD__ · 📌**")
      .setDescription("⚠️ *Please read the pinned message in <#763620963744219176> if it is your first time using the command.*⚠️ When using this command, your posting will be \
      	processed by a mod, and if approved, will be posted in the bulletin channel by Sun God. You also have the option to ping the <@&763635199719505931> role through this command. \n \n *__A few tips:__* \n \
        **-->** Discord has a maximum of 2000 character limits per message, so check as you write. \n **-->** Shorten links using `bit.ly` or `tinyurl`. \
         \n **-->** For image links, upload to `imgur` and link it. (If you can't figure this out a mod can help you post an image) \n \n ")
      .setFooter("Any questions? Ask a mod. For discord events use 'sg!createEvent'");

    menu_embed.addField('**Select a reaction to create a bulletin post under that category.**', '\u200b')
    menu_embed.addField("**🗓️ __EVENT__**", "> Club/org related event (Requires date, time, and location) ", true);
    menu_embed.addField("**💸 __LISTING__**", "> Marketplace listing, buy or sell items (Can be links to FB or standalone posts) ");
    menu_embed.addField("**📣 __PROMOTION__**", "> Self or friend promotions/shoutouts of twitch streams, online shops etc. ");
    menu_embed.addField("**🚨 __ALERT/PSA__**", "> Alerts about relavent information to server members (such as campus warnings, etc)");
    menu_embed.addField("**📩 __OTHER__**", "> Anything that you feel does not fit under any categories, or if you have a specific request to make (such as pictures)");
    menu_embed.addField("**❌ __CANCEL FUNCTION__**", "> Exit menu", true);
    
    message.channel.send(menu_embed).then(sent => {
      addReactions(sent); // add reactions

      //----reaction collector-----
      const filter = (reaction, user) => {
        return ['🗓️', '💸', '📣', '🚨', '📩', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      sent.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();

        switch(reaction.emoji.name) {
          case "🗓️":
            type = "EVENT";
            event(sent);
            break;
          case "💸":
            type = "LISTING";
            listing(sent);
            break;
          case "📣":
            type = "PROMOTION";
            promotion(sent);
            break;
          case "🚨":
            type = "ALERT";
            alert(sent);
            break;
          case "📩":
            type = "OTHER";
            other(sent);
            break;
          default:
            message.channel.send("Cancelling bulletin item creation.");
            return;
        }

      })
      .catch(collected => {
        message.reply('You did not make a selection, exiting command.');
        return;
      });

    })
  

	}
};


