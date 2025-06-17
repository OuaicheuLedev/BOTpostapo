const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Group = require('../models/Group');
const checkPermissions = require('../utils/checkPermissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addpnj')
        .setDescription('Ajoute un PNJ à un groupe')
        .addStringOption(option =>
            option.setName('groupe')
                .setDescription('Nom du groupe')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('prenom')
                .setDescription('Prénom du PNJ')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Nom du PNJ')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.Administrator)) return;

        const groupName = interaction.options.getString('groupe');
        const firstName = interaction.options.getString('prenom');
        const lastName = interaction.options.getString('nom');

        const group = await Group.findOne({ nom: groupName }); // ✅
        if (!group) {
            return interaction.reply({ content: '❌ Ce groupe n\'existe pas.', ephemeral: true });
        }

        // Pour ajouter un PNJ, il faut créer un PNJ dans la collection PNJ, puis push son _id dans group.pnjs

        interaction.reply({ content: `✅ Le PNJ **${firstName} ${lastName}** a été ajouté au groupe **${groupName}**.`, ephemeral: true });
    }
};