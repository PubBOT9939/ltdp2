const { Client, Discord, RichEmbed } = require('discord.js');
const client = new  Client();

var prefix = "p!";
client.on('ready', () => {
	client.user.setActivity("p!help | La table du pétou");
    console.log('Le Pétou tourne');
})

// HELP -----------------------------------------------------------------------------
client.on('message', message => {
	if(!message.guild) return

	if(message.content === prefix + "help"){

	message.delete()

		let info_embed = new RichEmbed()
		.setColor('#04c2db')
		.addField("Informations de La table du pétou", "p!help\n**Affiche les commandes du bot**\n\np!botinfo\n**Affiche les informations du bot**\n\np!serverinfo\n**Affiche les informations du serveur**\n\n``SOON``\n\np!say\n**Permet de faire dire quelque chose au bot**\n\np!annonce\n**Permet de créer une annonce sous forme d'embed**\n\np!sondage\n**Permet d'effectuer un sondage**")
		.setFooter("Bot de la table du pétou By Galessin")
		.setTimestamp()

		let mod_embed = new RichEmbed()
		.setColor('#ff0000')
		.addField("Modération du bot", "p!clear\n**Permet de clear un nombre de message définit sur le serveur**\n\np!mute\n**Permet de mute un membre du serveur**\n\np!unmute\n**Permet d'unmute un membre du serveur**\n\np!kick\n**Permet de kick un membre du serveur**\n\np!ban ``SOON``\n**Permet de bannir un membre du serveur\n\np!report\n**Permet de report un utilisateur**\n **__Requiert un salon__** ``reports``\n\n\n")
		.setFooter("Bot de la table du pétou By Galessin")
		.setTimestamp()
		message.channel.send('Commandes envoyés en MP !').then(m=>m.delete(5000))
		message.author.send(info_embed).then(ie=> {
			message.author.send(mod_embed)
		})
	}
});
// HELP -----------------------------------------------------------------------------

// MUTE - UNMUTE - REPORT - CLEAR - KICK - BAN --------------------------------------
client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    //Muted
    if (args[0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Membre introuvable")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre")
        if (member.id === message.guild.ownerID) return message.channel.send("Je ne peux pas mute ce membre")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + ' a été mute :white_check_mark:')
        }
        else {
            message.guild.createRole({name: 'Muted', permissions: 0}).then((role) => {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(channel => {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES: false
                    })
                })
                member.addRole(role)
                message.channel.send(member + ' a été mute :white_check_mark:')
            })
        }
    }

	if(args[0].toLowerCase() === prefix + "unmute"){
	    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
	    let member = message.mentions.members.first()
	    if(!member) return message.channel.send("Membre introuvable")
	    if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute ce membre.")
	    if(member.id === message.guild.ownerID) return message.channel.send("Je ne pas unmute ce membre.")
	    let muterole = message.guild.roles.find(role => role.name === 'Muted')
	    if(muterole && member.roles.has(muterole.id)) member.removeRole(muterole)
	    message.channel.send(member + ' a été unmute :white_check_mark:')
	}

	if(args[0].toLowerCase() === prefix + "report"){

		let messageArray = message.content.split(" ");
		let args = messageArray.slice(1);

		let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(!rUser) return message.channel.send("Utilisateur introuvable ou ,p, mentionné.");

		// Reason of the report
		let reason = args.join(" ").slice(22);
		if(!reason) return message.channel.send("Merci de nous dire la raison de ce report.")

		let reportEmbed = new RichEmbed()
		.setDescription("Reports")
		.setColor("#15f153")
		.addField("Utilisateur report", rUser + " avec l'ID: ``" + rUser.id + "``")
		.addField("Report par", message.author + " avec l'ID: ``" + message.author.id + "``")
		.addField("Channel", message.channel)
		.addField("A", message.createdAt)
		.addField("Raison", `${reason}`);

		let reportsChannel = message.guild.channels.find("name", "reports");
		if(!reportsChannel) return message.channel.send("Channel ``reports`` introuvable.");

		message.delete().catch(O_o=>{});
		reportsChannel.send(reportEmbed);
		message.channel.send(":warning: **Utilisateur Report !** :warning:").then(m=>m.delete(10000))


	}

	if (args[0].toLowerCase() === prefix + "clear") {
         if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
         let count = parseInt(args[1])
         if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer\n**A noter** :\nVous ne pouvez supprimer des messages datant de moins de 2 semaines.\nVous ne pouvez supprimer qu'entre 1 & 99 messages à la fois.")
         if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide")
         if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 99")
         message.channel.bulkDelete(count + 1, true)
    }

    if(args[0].toLowerCase() === prefix + "kick"){

	message.delete()

		if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("**Vous ne pouvez pas expulser quelqu'un de la table**").then(m=>m.delete(10000))
		let member = message.mentions.members.first()
		if(!member) return message.channel.send(':x: **Merci de mentionner un utilisateur à expulser** :x:').then(m2=>m2.delete(10000))
		if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id === message.guild.owner.id) return message.channel.send(':x: **Vous ne pouvez pas kick cet utilisateur** :x:')
		if(!member.kickable) return message.channel.send(':x: **Je ne peut pas expulser cet utilisateur** :x:')
		member.kick()
		message.channel.send('✅ ' + member.user.username + " **a été expulsé !** ✅")
	}

	// if(args[0].toLowerCase() === prefix + "ban"){

	// message.delete()

	// 	if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("**Vous n'avez pas la permission de bannir un utilisateur de la table**cry:").then(m=>m.delete(10000))
	// 	let member = message.mentions.members.first()
	// 	if(!member) return message.channel.send(':x: **Merci de mentionner un utilisateur à bannir de la table** :x:').then(m2=>m2.delete(10000))
	// 	if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id === message.guild.owner.id) return message.channel.send(':x: **Vous ne pouvez pas bannir cet utilisateur de la table** :x:')
	// 	if(!member.bannable) return message.channel.send(':x: **Je ne peut pas bannir cet utilisateur** :x:')
	// 	if(member.bannable || ) {}
	// }

	// if (!message.guild) return;

  // if the message content starts with "!ban"
  // if (message.content.startsWith('!ban')) {
  //   const user = message.mentions.users.first();
  //   if (user) {
  //     const member = message.guild.member(user);
  //     if (member) {
  //       member
  //         .ban({
  //           reason: 'They were bad!',
  //         })
  //         .then(() => {
  //           message.reply(`Successfully banned ${user.tag}`);
  //         })
  //         .catch(err => {
  //           message.reply('I was unable to ban the member');
  //           console.error(err);
  //         });
  //     } else {
  //       message.reply("That user isn't in this guild!");
  //     }
  //   } else {
  //     message.reply("You didn't mention the user to ban!");
  //   }
  // }

});
// MUTE - UNMUTE - REPORT - CLEAR - KICK - BAN --------------------------------------

// BOTINFO - SERVERINFO -------------------------------------------------------------
client.on('message', message => {
	if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

	if(args[0].toLowerCase() === prefix + "botinfo"){

		message.delete()

	    let botinfo_embed = new RichEmbed()
		.setColor("#15f153")
		.setTitle('Bot Info')
		.setThumbnail(client.user.displayAvatarURL)
		.setAuthor(`${client.user.username} Info`)
		.addField('**Pseudo**', client.user.username, true)
		.addField('**ID**', client.user.id, true)
		.addField('**Hashtag**', client.user.discriminator, true)
		.addField('**Status**', client.user.presence.status, true)
		.addField('**Créé par**', "Galessin", true)
		.addField('**Créé le**', client.user.createdAt, true)
		.setFooter(`Par Galessin#9939`)
		message.channel.send('BotInfo envoyés en MP !').then(m=>m.delete(5000))
		message.author.send(botinfo_embed);

    }

    if(args[0].toLowerCase() === prefix + 'serverinfo'){

    	let sEmbed = new RichEmbed()
		.setColor('#09e82b')
		.setTitle("Server Info")
		.setThumbnail(message.guild.iconURL)
		.setAuthor(`${message.guild.name}`)
		.addField("**Nom du serveur:**", `${message.guild.name}`, true)
		.addField("**Chef du serveur:**", `${message.guild.owner}`, true)
		.addField("**Nombre de membres:**", `${message.guild.memberCount}`, true)
		.addField("**Nombre de rôles:**", `${message.guild.roles.size}`, true)
		.setFooter(`Par Galessin`);
		message.channel.send('ServerInfo envoyés en MP !').then(m=>m.delete(5000))
		message.author.send(sEmbed);

	}

})
// BOTINFO - SERVERINFO -------------------------------------------------------------

// SAY - ANNONCE - SONDAGE ----------------------------------------------------------
// client.on('message', message => {

// 	//if(message.author.client) return;
// 	if(!message.guild) return;
// 	if(!message.content.startsWith(prefix)) return;

// 	const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;
// 	const args = message.content.slice(prefix.length).trim().split(/ +/g);

// 	if(args[0].toLowerCase() === prefix + 'say'){
// 		message.delete();

// 		if(args.length < 1) return message.reply(" Rien à dire?").then(m=>m.delete(5000));

// 		message.channel.send(args.join(" "));

// 	}

// 	if(args[0].toLowerCase() === prefix + 'annonce'){
// 		message.delete();
// 		if(args.length < 1) return message.reply(" Rien à dire?").then(m=>m.delete(5000))
// 		const annonce = new Discord.RichEmbed()
// 			.setColor(roleColor)
// 			.addField("Annonce", args.slice(0).join(" "))
// 			.setTimestamp()
// 		message.channel.send(annonce);
// 	}

// 	if(args[0].toLowerCase() === prefix + "sondage"){
// 			 message.delete()
// 			 if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Vous ne pouvez pas effectuer de sondages.").then(m=>m.delete(20000))

// 			 if(message.member.hasPermission("MANAGE_MESSAGES")){
// 				 let argsondage = args.join(" ").slice(9);
// 				 if(!argsondage) return message.channel.send("❌ **ERREUR** ❌\nMerci d'écrire un sondage correct !\nExemple : p;sondage Aimeriez vous passer au bûcher ?");
// 				 var embed = new Discord.RichEmbed()
// 				 .setDescription("Sondage")
// 				 .addField(argsondage, "Répondre avec ✅ | 🤔 | ❌")
// 				 .setColor("0xB40404")
// 				 .setTimestamp()
// 				message.channel.send(embed).then(function (message) {
// 					message.react("✅").then(mr=> {
// 						message.react("🤔").then(mre=> {
// 							message.react("❌")
// 						})
// 					})
// 				})

// 			 }
// 		 }

// });
// SAY - ANNONCE - SONDAGE ----------------------------------------------------------

client.login(process.env.TOKEN);
