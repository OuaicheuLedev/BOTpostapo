const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Group = require('../models/Group');
const checkPermissions = require('../utils/checkPermissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suppgroupe')
        .setDescription('Supprime un groupe existant')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Nom du groupe à supprimer')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.Administrator)) return;

        const groupName = interaction.options.getString('nom');
        const group = await Group.findOneAndDelete({ nom: groupName }); // ✅
        if (!group) {
            return interaction.reply({ content: "❌ Aucun groupe avec ce nom trouvé.", ephemeral: true });
        }
        interaction.reply({ content: `✅ Le groupe ${groupName} a été supprimé.`, ephemeral: true });
    }
};
