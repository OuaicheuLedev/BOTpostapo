const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Group = require('../models/Group');
const checkPermissions = require('../utils/checkPermissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addresources')
        .setDescription('Ajoute des ressources à un groupe')
        .addStringOption(option =>
            option.setName('group')
                .setDescription('Nom du groupe')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('food')
                .setDescription('Quantité de nourriture à ajouter')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('water')
                .setDescription('Quantité d\'eau à ajouter')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('fuel')
                .setDescription('Quantité de carburant à ajouter')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('materials')
                .setDescription('Quantité de matériaux à ajouter')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.Administrator)) return;

        const groupName = interaction.options.getString('group');
        const food = interaction.options.getInteger('food');
        const water = interaction.options.getInteger('water');
        const fuel = interaction.options.getInteger('fuel');
        const materials = interaction.options.getInteger('materials');

        const group = await Group.findOne({ nom: groupName });
        if (!group) {
            return interaction.reply({ content: 'Groupe introuvable.', ephemeral: true });
        }

        const ressources = group.ressources;
        const types = [
            { key: 'food', value: food },
            { key: 'water', value: water },
            { key: 'fuel', value: fuel },
            { key: 'materials', value: materials }
        ];
        for (const { key, value } of types) {
            const res = ressources.find(r => r.type === key);
            if (res) res.quantite += value;
        }
        await group.save();

        return interaction.reply({ content: `Ressources ajoutées au groupe ${groupName}.`, ephemeral: true });
    }
};
