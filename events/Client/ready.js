const moment = require('moment')
module.exports = {
	name: 'ready',
	async execute(bot) {
		const times = (`[${moment().format('LTS')}]/`);
		console.log(times + `\x1b[33m%s\x1b[0m`, '[WARN]', '\x1b[0m', 'Connexion en cours...');
		console.log(times + `\x1b[36m%s\x1b[0m`, '[API]', '\x1b[0m', 'Connecté sur ' + bot.user.tag);

		const stateList = bot.config.status.stateList;
		let i = 0
		setInterval(() => {
			bot.user.setActivity(stateList[i].replace(/{user}/g, bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString()).replace(/{PREFIX}/g, bot.config.PREFIX), { type: bot.config.status.type, url: bot.config.status.url })
			i = ++i % stateList.length
		}, 5000)

	},
};