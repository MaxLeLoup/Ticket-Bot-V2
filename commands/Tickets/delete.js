const { Permissions } = require('discord.js');

module.exports.run = async(bot, message, args) => {
    const { channel, user, guild, member } = message;
    const topic = channel.topic?.split('User: ')[1];
    if (!topic) {return await message.reply({ embeds: [{description: 'Vous n\'êtes pas dans un ticket.', color: [255, 0, 0]}]});}
    if(!channel.name.startsWith(`closed-${topic}`)) {return await message.reply({ embeds: [{description: 'Vous ne pouvez pas fermer ce ticket.', color: [255, 0, 0]}]});}
    
    message.reply({ embeds: [{description: 'Le ticket sera supprimé dans quelques secondes.', color: [0, 153, 255]}]});
    bot.logs({embeds: {title: 'Ticket supprimé', color: '#0099ff', description: `${message.author.tag} (${message.author.id}) a supprimé le ticket ${channel.name} (${channel.id})\n\nOuvert par <@${topic}>`, timestamp: new Date(), color: 'RED'}})
    setTimeout(() => {
        channel.delete().catch(err => {
            message.reply({ embeds: [{description: 'Une erreur est survenue lors de la suppression du ticket.', color: [255, 0, 0] }], ephermal: true });
            console.log(err);
        });
    }, 5000);
};

module.exports.help = {
    name: 'delete',
    aliases: [],
    category: 'tickets',
    description: 'Permet de supprimer un ticket.',
    cooldown: 5,
    usage: '',
    userPermissions: ['ADMINISTRATOR', 'MANAGE_GUILD', 'MANAGE_CHANNELS'],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
    maintenance: false,
    onlyOwner: false
}