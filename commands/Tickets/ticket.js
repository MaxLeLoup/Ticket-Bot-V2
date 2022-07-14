const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v9');

module.exports.run = async(bot, message, args) => {
    const channel = message.channel || message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    const actionRow = new ActionRowBuilder().addComponents([new ButtonBuilder({
        type: ComponentType.Button,
        label: bot.config.ticket.btnOptions.text,
        style: ButtonStyle.Primary,
        emoji: bot.config.ticket.btnOptions.emoji,
        customId: 'openTicket'
    })])

    channel.send({ embeds: [{
        title: 'Ticket',
        description: `${bot.config.ticket.messageOptions.messageOpen.replace(`{guildName}`, message.guild.name)}`,
        color: [0, 153, 255],
    }], components: [actionRow.toJSON()] }).catch(err => {
        message.reply({ embeds: [{description: 'Impossible de créer le système de ticket.', color: [255, 0, 0] }], ephermal: true });
        console.log(err);
    });
};

module.exports.help = {
    name: 'ticket',
    aliases: [],
    category: 'tickets',
    description: 'Envoie le menu de création de ticket.',
    cooldown: 5,
    usage: '<salon>',
    userPermissions: ['ADMINISTRATOR', 'MANAGE_GUILD'],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    maintenance: false,
    onlyOwner: false
}