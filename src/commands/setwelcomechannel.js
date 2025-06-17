const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const checkPermissions = require('../utils/checkPermissions');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcomechannel')
        .setDescription('Définit le salon de bienvenue')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Salon à utiliser pour les messages de bienvenue')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.ManageChannels)) return;

        const channel = interaction.options.getChannel('channel');
        const configPath = path.join(__dirname, '../config/welcomechannel.json');
        let config = {};

        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        config[interaction.guild.id] = channel.id;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        interaction.reply({ content: `✅ Le salon de bienvenue a été défini sur <#${channel.id}>.`, ephemeral: true });
    }
};