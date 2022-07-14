const { Collection } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	async execute(bot, message) {
    if (message.channel.type === "DM") return;
    if (message.author.bot) return;

    try {
      if (!message.content.startsWith(bot.config.PREFIX)) return;

      const args = message.content.slice(bot.config.PREFIX.length).split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
      if (!command) return;

      if(command.help.userPermissions.length > 0) { command.help.userPermissions.forEach(permission => { if(!message.member.permissions.has(permission)) return message.reply({ content: `:x: Vous n'avez pas la permission \`${permission}\` pour faire cette commande.`});})}
      if(command.help.botPermissions.length > 0) { command.help.botPermissions.forEach(permission => { if(!message.guild.me.permissions.has(permission)) return message.reply({ content: `:x: Je n'ai pas la permission \`${permission}\` pour utiliser cette commande!`});})}
      if(command.help.maintenance == true && !bot.config.dev?.includes(message.author.id)) { return message.reply({content: `:x: Désolé, cette commande est en maintenance.`}); }
      if(command.help.onlyOwner == true && !Boolean(bot.config.owner.length)) { return message.reply({ content: `:x: Désolé, cette commande est réservée aux propriétaires.` }); }
      if(!bot.cooldowns.has(command.help.name)) {bot.cooldowns.set(command.help.name, new Collection());}

      const timeNow = Date.now();
      const tStamps = bot.cooldowns.get(command.help.name);
      const cdAmount = (command.help.cooldown || 5) * 1000;

      if (tStamps.has(message.author.id)) {
        const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

        if (timeNow < cdExpirationTime) {
          timeLeft = (cdExpirationTime - timeNow) / 1000;
          return message.reply(`Merci d'attendre ${timeLeft.toFixed(0)} seconde(s) avant de ré-utiliser la commande \`${command.help.name}\``);
        }
      }

      tStamps.set(message.author.id, timeNow);
      setTimeout(() => tStamps.delete(message.author.id), cdAmount);

      command.run(bot, message, args);

    } catch (err) {
      console.log(err);
      await message.reply({ content: `Une erreur s'est produite. Si le problème persiste, veuillez contacter les développeurs du bot sur le serveur d'assistance.` });
    }
  },
}
