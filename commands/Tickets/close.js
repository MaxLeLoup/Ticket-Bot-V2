const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v9');
const discordTranscripts = require('discord-html-transcripts');


module.exports.run = async(bot, message, args) => {
    const { channel, guild } = message;
    const topic = channel.topic?.split('User: ')[1];
    if (!topic) {return await message.reply({ embeds: [{description: 'Vous n\'avez pas de ticket ouvert.', color: [255, 0, 0]}]});}
    if(!channel.name.startsWith(`ticket-${topic}`)) {return await message.reply({ embeds: [{description: 'Vous n\'êtes pas dans le bon channel.', color: [255, 0, 0]}]});}

    const c = await guild.channels.cache.get(channel.id);
    if(!c) {return await message.reply({ embeds: [{description: 'Le ticket n\'a pas été trouvé.', color: [255, 0, 0]}]});}

    const permissionOverwrites = c.permissionOverwrites.cache.filter(p => p.type === 'member').map(p => p);
    for (let i = 0; i < permissionOverwrites.length; i++) {
        const perm = permissionOverwrites[i];
        if (perm.type == 'member') {
            c.permissionOverwrites.delete(perm.id);
        }
    }

    await c.edit({name: `closed-${topic}`});
    const attachment = await discordTranscripts.createTranscript(message.channel);
    bot.logs({embeds: {title: 'Ticket fermé', description: `Le ticket ${c.name} (${c.id}) a été fermé par ${message.author.tag} (${message.author.id})\n\nOuvert par <@${topic}>`, color: 'ORANGE', timestamp: new Date()}, files: {attachment: attachment}});
    await message.reply({ embeds: [{color: [0, 153, 255], description: `${bot.config.ticket.messageOptions.messageClose}`}], components: [new ActionRowBuilder({components: [new ButtonBuilder({ type: ComponentType.Button, label: 'Supprimer', style: ButtonStyle.Danger, emoji: '🗑', customId: 'deleteTicket'})]}).toJSON()], files: [attachment]});

};

module.exports.help = {
    name: 'close',
    aliases: [],
    category: 'tickets',
    description: 'Ferme le ticket.',
    cooldown: 5,
    usage: '',
    userPermissions: ['ADMINISTRATOR', 'MANAGE_GUILD', 'MANAGE_CHANNELS'],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
    maintenance: false,
    onlyOwner: false
}