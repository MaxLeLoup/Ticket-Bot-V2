module.exports = {
	name: 'interactionCreate',
	async execute(bot, interaction) {
        if (interaction.isButton()) {
            const button = bot.button.get(interaction.customId);
            if (!button) return;
            try {
                await button.execute(bot, interaction);
            } catch (error) {
                console.error(error);
                try {
                    await interaction.reply({ content: `Une erreur est survenue lors de l'exécution du bouton \`${interaction.customId}\``});
                } catch(error) { null }
            }
        }
	},
};