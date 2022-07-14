module.exports = {
    TOKEN: 'TOKEN', // Token de votre bot
    PREFIX: '!', // Prefix de votre bot

    status: {
        type: 'STREAMING', //STREAMING, LISTENING, WATCHING, PLAYING
        url: 'https://twitch.tv/Etinou_', //url du stream seulement si type = STREAMING
        stateList: [ // Liste des activité du bot 
            '{user} utilisateurs',
            '{PREFIX}help',
            'discord.gg/VnYjQTqXuy'
        ]    
    },

    ticket: {
        category: 'ID', // ID de la catégorie ou seront créés les tickets
        messageOptions: {
            messageOpen: 'Bienvenue sur le panel de ticket de {guildName}, pour ouvrir un ticket, cliquez sur le bouton ci-dessous.', // Message affiché pour ouvrir un ticket
            messageOpened: 'Votre ticket a été ouvert, vous pouvez le fermer en cliquant sur le bouton ci-dessous.', // Message affiché quand le ticket est ouvert
            messageClose: 'Votre ticket a été fermé, vous pouvez le supprimer en cliquant sur le bouton ci-dessous.', // Message affiché quand le ticket est fermé
            messageError: 'Vous avez déjà un ticket ouvert.' // Message affiché quand le ticket est déjà ouvert
        },
        btnOptions: {
            text: 'Ouvrir un ticket', // Texte du bouton
            emoji: '🎫' // Emoji du bouton
        },
        roleAccess: [
            'ROLE ID 1', // ID des rôles qui peuvent voir les tickets
            'ROLE ID 2',
        ]
    },

    logs: {
        enabled: false, // Activer les logs
        channel: 'ID', // ID du channel ou seront envoyés les logs
    },

    owner: ['855087492603838474'] // ID du(s) owner(s) du bot
}