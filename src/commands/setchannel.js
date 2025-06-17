const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const checkPermissions = require('../utils/checkPermissions');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Définit un salon pour une fonctionnalité spécifique')
        .addStringOption(option =>
            option.setName('fonction')
                .setDescription('Nom de la fonctionnalité')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Salon à utiliser')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.ManageChannels)) return;

        const fonction = interaction.options.getString('fonction');
        const channel = interaction.options.getChannel('channel');
        const configPath = path.join(__dirname, '../config/channels.json');
        let config = {};

        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        if (!config[interaction.guild.id]) config[interaction.guild.id] = {};
        config[interaction.guild.id][fonction] = channel.id;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        interaction.reply({ content: `✅ Le salon pour la fonctionnalité **${fonction}** a été défini sur <#${channel.id}>.`, ephemeral: true });
    }
};