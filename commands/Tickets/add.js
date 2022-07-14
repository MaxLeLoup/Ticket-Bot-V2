const { Permissions } = require('discord.js');

module.exports.run = async(bot, message, args) => {
    const { channel, user, guild, member } = message;
    const topic = channel.topic?.split('User: ')[1];
    if (!topic) {return await message.reply({ embeds: [{description: 'Vous n\'êtes pas dans un ticket.', color: [255, 0, 0]}]});}
    if(!channel.name.startsWith(`ticket-${topic}`)) {return await interaction.editReply({ embeds: [{description: 'Vous n\'avez pas le droit de fermer ce ticket.', color: [255, 0, 0]}]});}
    if(!member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {return await message.reply({ embeds: [{description: 'Vous n\'avez pas les permissions nécessaires pour ajouter un membre à un ticket.', color: [255, 0, 0]}]});}
    if(!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {return await message.reply({ embeds: [{description: 'Je n\'ai pas les permissions nécessaires pour ajouter un membre à un ticket.', color: [255, 0, 0]}] });}
    const u = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!u) {return await message.reply({ embeds: [{description: 'Vous devez mentionner un membre ou un ID de membre.', color: [255, 0, 0]}]});}
    if(u.id === message.author.id) {return await message.reply({ embeds: [{description: 'Vous ne pouvez pas vous ajouter vous-même.', color: [255, 0, 0]}]});}
    if(u.id === bot.user.id) {return await message.reply({ embeds: [{description: 'Je ne peux pas m\'ajouter à un ticket.', color: [255, 0, 0]}]});}
    if(channel.permissionOverwrites.cache.get(u.id)) {return await message.reply({ embeds: [{description: 'Ce membre est déjà dans ce ticket.', color: [255, 0, 0]}]});}

    channel.permissionOverwrites.create(u.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        ADD_REACTIONS: true,
        ATTACH_FILES: true,
    }).then(() => {
        bot.logs({title: 'Ajout de membre', description: `${u.user.tag} a été ajouté à ${channel.name} par ${message.author.tag}`, color: [0, 153, 255], timestamp: new Date()})
        channel.send({ embeds: [{
            description: `${u} a été ajouté au ticket.`,
            color: [0, 153, 255],
        }]}).catch(err => {
            message.reply({ embeds: [{description: 'Une erreur est survenue lors de l\'ajout du membre au ticket.', color: [255, 0, 0] }], ephermal: true });
            console.log(err);
        });
    }).catch(err => {
        message.reply({ embeds: [{description: 'Une erreur est survenue lors de l\'ajout du membre au ticket.', color: [255, 0, 0] }], ephermal: true });
        console.log(err);
    });
};

module.exports.help = {
    name: 'add',
    aliases: [],
    category: 'tickets',
    description: 'Permet d\'ajouter une personne a un ticket',
    cooldown: 5,
    usage: '<user>',
    userPermissions: ['ADMINISTRATOR', 'MANAGE_GUILD', 'MANAGE_CHANNELS'],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
    maintenance: false,
    onlyOwner: false
}