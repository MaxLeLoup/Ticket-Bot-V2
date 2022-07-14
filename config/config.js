module.exports = {
    TOKEN: 'OTc2NTM0MzUwNTc5NTMxODA3.G1UnZV.CekuL6CemYWCZ3FmXFYB-Kdab8wRjgTwS4--fY',
    PREFIX: '!',

    status: {
        type: 'STREAMING', //STREAMING, LISTENING, WATCHING, PLAYING
        url: 'https://twitch.tv/Etinou_', //url du stream seulement si type = STREAMING
        stateList: [
            '{user} utilisateurs',
            '{PREFIX}help',
            'discord.gg/VnYjQTqXuy'
        ]    
    },

    ticket: {
        category: '926874862784499714',
        messageOptions: {
            messageOpen: 'Bienvenue sur le panel de ticket de {guildName}, pour ouvrir un ticket, cliquez sur le bouton ci-dessous.',
            messageOpened: 'Votre ticket a été ouvert, vous pouvez le fermer en cliquant sur le bouton ci-dessous.',
            messageClose: 'Votre ticket a été fermé, vous pouvez le supprimer en cliquant sur le bouton ci-dessous.',
            messageError: 'Vous avez déjà un ticket ouvert.'
        },
        btnOptions: {
            text: 'Ouvrir un ticket',
            emoji: '🎫'
        },
        roleAccess: [
            '855089098729455616'
        ]
    },

    logs: {
        enabled: true,
        channel: '855087492603838483',
    },

    owner: ['855087492603838474']
}