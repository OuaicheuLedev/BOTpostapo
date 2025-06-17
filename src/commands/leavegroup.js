const { SlashCommandBuilder } = require('discord.js');
const Group = require('../models/Group');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leavegroup')
        .setDescription('Quitter le groupe dont vous êtes membre'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const group = await Group.findOne({ membres: userId });

        if (!group) {
            return interaction.reply({ content: '❌ Vous n\'êtes membre d\'aucun groupe.', ephemeral: true });
        }

        group.membres = group.membres.filter(id => id !== userId);
        await group.save();

        interaction.reply({ content: `✅ Vous avez quitté le groupe **${group.nom}**.`, ephemeral: true });
    }
};
