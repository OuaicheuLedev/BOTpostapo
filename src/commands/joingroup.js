const { SlashCommandBuilder } = require('discord.js');
const Group = require('../models/Group');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joingroup')
        .setDescription('Rejoindre un groupe existant')
        .addStringOption(option =>
            option.setName('groupe')
                .setDescription('Nom du groupe à rejoindre')
                .setRequired(true)),
    async execute(interaction) {
        const groupName = interaction.options.getString('groupe');
        const userId = interaction.user.id;

        const group = await Group.findOne({ nom: groupName });
        if (!group) {
            return interaction.reply({ content: '❌ Groupe introuvable.', ephemeral: true });
        }
        if (group.membres.includes(userId)) {
            return interaction.reply({ content: '❌ Vous êtes déjà membre de ce groupe.', ephemeral: true });
        }
        group.membres.push(userId);
        await group.save();

        interaction.reply({ content: `✅ Vous avez rejoint le groupe **${groupName}**.`, ephemeral: true });
    }
};
