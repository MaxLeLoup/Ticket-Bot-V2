const { Permissions } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v9');

module.exports = {
	name: 'openTicket',
	async execute(bot, interaction) {
		const { channel, user, guild } = interaction;
		await interaction.deferReply({ ephemeral: true });
		if(!channel.permissionsFor(bot.user).has(Permissions.FLAGS.MANAGE_CHANNELS)) {return await interaction.editReply({ embeds: [{description: 'Je n\'ai pas les permissions nécessaires pour ouvrir un ticket.', color: [255, 0, 0]}] });}
        if(guild.channels.cache.find(c => c.name === `ticket-${user.id}`)) {return await interaction.editReply({ embeds: [{description: 'Vous avez déjà un ticket ouvert.', color: [255, 0, 0]}] });}

		const roleConfig = bot.config.ticket.roleAccess;
		const rolePermissions = new Array();
		for (let i = 0; i < roleConfig.length; i++) {
			let role = guild.roles.cache.get(roleConfig[i]);
			if (role) {
				await rolePermissions.push({id: roleConfig[i], allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']});
			}
		}
		rolePermissions.push({id: guild.id, deny: [Object.keys(Permissions.FLAGS)]}, {id: user.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']});
		
		guild.channels.create(`ticket-${user.id}`, {type: 'GUILD_TEXT', parent: bot.config.ticket.category, reason: `${user.tag} a ouvert un ticket`, permissionOverwrites: rolePermissions, topic: `User: ${user.id}`}).then(async c => {
            bot.logs({title: 'Ticket ouvert', description: `Le ticket ${c.name} (${c.id}) a été ouvert par ${user.tag} (${user.id})`, timestamp: new Date(), color: 'GREEN'});
            await c.send({ content: `<@${user.id}>`, embeds: [{title: 'Ticket', description: `${bot.config.ticket.messageOptions.messageOpened}`, color: [0, 153, 255], footer: {text: `${user.tag}`}}], components: [new ActionRowBuilder().addComponents([new ButtonBuilder({type: ComponentType.Button, label: 'Fermer le ticket', style: ButtonStyle.Danger, emoji: '865272379176648725', customId: 'closeTicket'})]).toJSON()]})
			await interaction.editReply({ embeds: [{description: `Votre ticket a été ouvert <#${c.id}>`, color: [0, 153, 255],}], ephemeral: true});
		}).catch(async(err) => {
            console.log(err);
			await interaction.editReply({ embeds: [{description: `Une erreur est survenue lors de l'ouverture du ticket.`,color: [255, 0, 0] }], ephemeral: true });
		});
		
	},
};