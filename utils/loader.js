const { readdirSync } = require("fs");
const { Client } = require("discord.js");

/**
 * @param {Client} bot
 * @param {String} dir
 * @returns {null}
*/
const loadCommands = async (bot, dir = "./commands/") => {
    readdirSync(dir).forEach(dirs => {
        const commandFiles = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`../${dir}/${dirs}/${file}`);
            bot.commands.set(command.help.name, command);
        };
    });
    const commands = [];
    await bot.commands.map(x => commands.push({ commandes: x.help.name }));
    console.table(commands);
};

/**
 * @param {Client} bot
 * @param {String} dir
 * @returns {null}
*/
const loadEvents = (bot, dir = "./events/") => {
    const events = [];
    readdirSync(dir).forEach(dirs => {
        const eventDirs = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
        for (const file of eventDirs) {
            const event = require(`../${dir}/${dirs}/${file}`);
            bot.on(event.name, (...args) => event.execute(bot, ...args))
            events.push({ events: event.name});
        };
    });
    console.table(events);
};

/**
 * @param {Client} bot
 * @param {String} dir
 * @returns {null}
*/
const loadButtons = async (bot, dir = "./interactions/buttons/") => {
    readdirSync(dir).forEach(dirs => {
        const buttonsFiles = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
        for (const file of buttonsFiles) {
            const button = require(`../${dir}/${dirs}/${file}`);
            bot.button.set(button.name, button);
        };
    });
    const buttons = [];
    await bot.button.map(x => buttons.push({ buttons: x.name }));
    console.table(buttons);
};

module.exports = {
    loadCommands,
    loadEvents,
    loadButtons
};