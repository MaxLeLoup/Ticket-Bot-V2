const { PREFIX } = require('./../../config/config');
const { readdirSync } = require("fs");
const categoryList = readdirSync('./commands');

module.exports.run = async(bot, message, args) => {
  if (!args.length) {
    const embed = {title: "Liste des commandes", description: `Une liste de toutes les sous-catégories disponibles et de leurs commandes. \n\nPour plus d'informations sur une commande, tapez ${PREFIX}help <nom_de_la_commande>.`, color: 0x0099ff, fields: [], footer: {text: `🚀・Développé par ${await bot.users.fetch('393807140013342722').then(user => `${user.username}#${user.discriminator}`)}`}};

    for(const category of categoryList) {
        embed.fields.push({
            name: category,
            value: `${bot.commands.filter(cat => cat.help.category === category.toLowerCase()).map(cmd => `\`${cmd.help.name}\``).join(', ')}`,
        })
    };
    return message.reply({embeds:[embed]});
  } else {
    const command = bot.commands.get(args[0]) || bot.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0]));
    if (!command) return message.reply("Cette commande n'existe pas !");

    const embed = {
      title: `${command.help.name}`,
      description: `${command.help.description}`,
      fields: [
        {name: "Usage", value: `${command.help.usage ? `${PREFIX}${command.help.name} ${command.help.usage}` : `${PREFIX}${command.help.name}`}`, inline: true}, 
        {name: "Cooldown", value: `${command.help.cooldown} seconde${command.help.cooldown > 1 ? 's' : ''}`, inline: true}, 
        {name: "Categorie", value: `${command.help.category}`, inline: true}, 
        {name: "Aliases", value: `${command.help.aliases ? command.help.aliases.join(', ') : 'Aucun'}`, inline: true}, 
        {name: "Seulement pour les owners", value: `${command.help.onlyOwner ? 'Oui' : 'Non'}`, inline: true}, 
        {name: "\u200b", value: `\u200b`, inline: true}, 
        {name: "Permission utilisateur", value: `${command.help.permission ? command.help.userPermissions.map(perm => `\`${bot.util.Permissions[perm]}\``).join(', ') : 'Aucune'}`, inline: true}, 
        {name: "Permission bot", value: `${command.help.permission ? command.help.botPermissions.map(perm => `\`${bot.util.Permissions[perm]}\``).join(', ') : 'Aucune'}`, inline: true}
      ],
    }

    return message.reply({embeds:[embed]});
  }
};

module.exports.help = {
  name: 'help',
  aliases: ["helps"],
  category: "help",
  description: "Renvoie une liste de commandes ou les informations d'une commande.",
  cooldown: 5,
  usage: "<nom_de_la_commande>",
  userPermissions: [],
  botPermissions: [],
  maintenance: false,
  onlyOwner: false,
}
