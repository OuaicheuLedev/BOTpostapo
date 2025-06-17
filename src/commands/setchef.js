const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Group = require('../models/Group');
const checkPermissions = require('../utils/checkPermissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchef')
        .setDescription('Définit un nouveau chef pour un groupe')
        .addStringOption(option =>
            option.setName('groupe')
                .setDescription('Nom du groupe')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Nouveau chef')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.Administrator)) return;

        const groupName = interaction.options.getString('groupe');
        const user = interaction.options.getUser('utilisateur');
        const group = await Group.findOne({ nom: groupName }); // ✅

        if (!group) {
            return interaction.reply({ content: '❌ Groupe introuvable.', ephemeral: true });
        }

        group.chef = user.id; // ✅
        await group.save();

        interaction.reply({ content: `✅ <@${user.id}> est maintenant le chef du groupe **${groupName}**.`, ephemeral: true });
    }
};