const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Group = require('../models/Group');
const checkPermissions = require('../utils/checkPermissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suppressource')
        .setDescription('Supprime une quantité spécifique de ressources d’un groupe')
        .addStringOption(option =>
            option.setName('groupe')
                .setDescription('Nom du groupe')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type de ressource')
                .setRequired(true)
                .addChoices(
                    { name: 'Nourriture', value: 'food' },
                    { name: 'Eau', value: 'water' },
                    { name: 'Carburant', value: 'fuel' },
                    { name: 'Matériaux', value: 'materials' }
                ))
        .addIntegerOption(option =>
            option.setName('quantite')
                .setDescription('Quantité à supprimer')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.Administrator)) return;

        const groupName = interaction.options.getString('groupe');
        const resource = interaction.options.getString('type');
        const amount = interaction.options.getInteger('quantite');

        if (amount <= 0) {
            return await interaction.reply({ content: '❌ La quantité doit être positive.', ephemeral: true });
        }

        const group = await Group.findOne({ nom: groupName });
        if (!group) {
            return await interaction.reply({ content: '❌ Ce groupe n\'existe pas.', ephemeral: true });
        }

        if (!group.ressources || !Array.isArray(group.ressources)) {
            return await interaction.reply({ content: '❌ Les ressources du groupe sont mal configurées.', ephemeral: true });
        }

        // Trouver la ressource à modifier
        const ressource = group.ressources.find(r => r.type === resource);
        if (!ressource) {
            return await interaction.reply({ content: '❌ Ce type de ressource n\'existe pas pour ce groupe.', ephemeral: true });
        }

        ressource.quantite = Math.max(0, ressource.quantite - amount);
        await group.save();

        await interaction.reply({ content: `✅ ${amount} ${resource} ont été retirés du groupe ${groupName}.`, ephemeral: true });
    }
};