const { Permissions } = require("discord.js");
const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v9');

module.exports = {
	name: 'deleteTicket',
	async execute(bot, interaction) {
		const { channel, user, guild } = interaction;	
		await interaction.deferReply();
        if(!channel.permissionsFor(user).has(Permissions.FLAGS.MANAGE_CHANNELS)) {return await interaction.editReply({ embeds: [{description: 'Vous n\'avez pas les permissions nécessaires pour fermer un ticket.', color: [255, 0, 0]}]});}
		const topic = channel.topic?.split('User: ')[1];
		if (!topic) {return await interaction.editReply({ embeds: [{description: 'Vous n\'avez pas de ticket ouvert.', color: [255, 0, 0]}]});}
		if(!channel.name.startsWith(`closed-${topic}`)) {return await interaction.editReply({ embeds: [{description: 'Vous n\'avez pas le droit de supprimer ce ticket.', color: [255, 0, 0]}]});}

        interaction.editReply({ embeds: [{description: 'Suppression du ticket dans quelques secondes...', color: [0, 153, 255]}]});
        bot.logs({title: 'Ticket supprimé', description: `Le ticket ${channel.name} (${channel.id}) a été supprimé par ${user.tag} (${user.id})\n\nOuvert par <@${topic}>`, timestamp: new Date(), color: 'RED'})
        setTimeout(async () => {
            channel.delete().catch(err => {
                console.log(err);
                interaction.editReply({ embeds: [{description: 'Une erreur est survenue lors de la suppression du ticket.', color: [255, 0, 0]}]});
            });
        }, 5000);
	},
};