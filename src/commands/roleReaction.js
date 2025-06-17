const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const checkPermissions = require('../utils/checkPermissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolereaction')
        .setDescription('Assigne un rôle via une réaction (admin seulement)')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rôle à assigner')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Emoji à utiliser')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.ManageRoles)) return;

        // À compléter selon ta logique de gestion des réactions/roles
        interaction.reply({ content: '✅ Fonction à compléter selon ta logique de gestion des rôles par réaction.', ephemeral: true });
    }
};