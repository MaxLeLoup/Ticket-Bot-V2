const { Client, Intents, Collection } = require('discord.js');
const { loadCommands, loadEvents, loadButtons } = require('./utils/loader')
const bot = new Client ({intents: Object.keys(Intents.FLAGS)});
require('moment').locale('FR');
['commands', 'cooldowns', 'button'].forEach(x => bot[x] = new Collection());

bot.config = require('./config/config')
bot.util = require('./utils/util')
bot.logs = (embed) => {
    if(bot.config.logs.enabled) {
        const channel = bot.channels.cache.get(bot.config.logs.channel);
        if(channel) {
            if(embed.files) {
                channel.send({ embeds: [embed.embeds], files: [embed.files.attachment] });
            } else {
                channel.send({ embeds: [embed.embeds] });
            }
        } else {
            console.log(`[\x1b[31m%s\x1b`, 'LOGS', `\x1b[0m]`, 'Le salon de logs n\'existe pas.')
        }
    }
}

loadCommands(bot), loadEvents(bot), loadButtons(bot);

bot.login(require('./config/config').TOKEN)