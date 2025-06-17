const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const checkPermissions = require('../utils/checkPermissions');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setautorole')
        .setDescription('Définit le rôle automatique pour les nouveaux membres')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Rôle à attribuer automatiquement')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.ManageRoles)) return;

        const role = interaction.options.getRole('role');
        const configPath = path.join(__dirname, '../config/autorole.json');
        let config = {};

        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        config[interaction.guild.id] = role.id;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        interaction.reply({ content: `✅ Le rôle automatique a été défini sur **${role.name}**.`, ephemeral: true });
    }
};