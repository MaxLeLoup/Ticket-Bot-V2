const { Permissions } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v9');
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
	name: 'closeTicket',
	async execute(bot, interaction) {
		const { channel, user, guild } = interaction;	
		await interaction.deferReply();
        if(!channel.permissionsFor(user).has(Permissions.FLAGS.MANAGE_CHANNELS)) {return await interaction.editReply({ embeds: [{description: 'Vous n\'avez pas les permissions nécessaires pour fermer un ticket.', color: [255, 0, 0]}]});}
		const topic = channel.topic?.split('User: ')[1];
		if (!topic) {return await interaction.editReply({ embeds: [{description: 'Vous n\'avez pas de ticket ouvert.', color: [255, 0, 0]}]});}
		if(!channel.name.startsWith(`ticket-${topic}`)) {return await interaction.editReply({ embeds: [{description: 'Vous n\'avez pas le droit de fermer ce ticket.', color: [255, 0, 0]}]});}

        const c = await guild.channels.cache.get(channel.id);
        if(!c) {return await interaction.editReply({ embeds: [{description: 'Le ticket n\'a pas été trouvé.', color: [255, 0, 0]}]});}
        if(!c.permissionsFor(bot.user).has(Permissions.FLAGS.MANAGE_CHANNELS)) {return await interaction.editReply({ embeds: [{description: 'Je n\'ai pas les permissions nécessaires pour fermer ce ticket.', color: [255, 0, 0]}] });}

        const permissionOverwrites = c.permissionOverwrites.cache.filter(p => p.type === 'member').map(p => p);
        for (let i = 0; i < permissionOverwrites.length; i++) {
            const perm = permissionOverwrites[i];
            if (perm.type == 'member') {
                c.permissionOverwrites.delete(perm.id);
            }
        }

        await c.edit({name: `closed-${topic}`});
        const attachment = await discordTranscripts.createTranscript(interaction.channel);
        bot.logs({embeds: {title: 'Ticket fermé', description: `Le ticket ${channel.name} (${channel.id}) a été fermé par ${user.tag} (${user.id})\n\nOuvert par <@${topic}>`, timestamp: new Date(), color: 'ORANGE'}, files: {attachment: attachment}});
        await interaction.message.edit({components: [new ActionRowBuilder({components: [new ButtonBuilder({type: ComponentType.Button, label: 'Fermer le ticket', style: ButtonStyle.Danger, emoji: '865272379176648725', customId: 'closeTicket', disabled: true})]}).toJSON()]});

        await interaction.editReply({ embeds: [{color: [0, 153, 255], description: `${bot.config.ticket.messageOptions.messageClose}`}], components: [new ActionRowBuilder({components: [new ButtonBuilder({ type: ComponentType.Button, label: 'Supprimer', style: ButtonStyle.Danger, emoji: '🗑', customId: 'deleteTicket'})]}).toJSON()], files: [attachment]});
	},
};