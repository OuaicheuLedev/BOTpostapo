const Groupe = require('../models/Group');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                interaction.reply({ content: '❌ Erreur lors de l\'exécution de la commande.', ephemeral: true });
            }
        }
    }
};