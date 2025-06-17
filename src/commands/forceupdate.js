const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Group = require('../models/Group');
const { updateGroupResources } = require('../utils/resourceManager');
const checkPermissions = require('../utils/checkPermissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forceupdate')
        .setDescription('Force la mise à jour des ressources pour tous les groupes (admin seulement)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.Administrator)) return;

        const groups = await Group.find();
        if (groups.length === 0) {
            return interaction.reply({ content: '⚠️ Aucun groupe trouvé pour mettre à jour les ressources.', ephemeral: true });
        }

        for (const group of groups) {
            await updateGroupResources(group._id, interaction.client);
        }

        interaction.reply({ content: '✅ Les ressources de tous les groupes ont été mises à jour avec succès.', ephemeral: true });
    }
};