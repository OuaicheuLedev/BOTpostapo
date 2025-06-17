const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const PNJ = require('../models/PNJ');
const Groupe = require('../models/Group');
const handleError = require('../utils/handleError');
const checkPermissions = require('../utils/checkPermissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletepnj')
        .setDescription('Supprime un PNJ par son nom ou son ID')
        .addStringOption(option =>
            option.setName('identifiant')
                .setDescription('Nom ou ID du PNJ à supprimer')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.Administrator)) return;

        const identifiant = interaction.options.getString('identifiant');
        try {
            // Recherche par ID ou nom
            let pnj = await PNJ.findOne({ _id: identifiant }).catch(() => null);
            if (!pnj) {
                pnj = await PNJ.findOne({ nom: identifiant });
            }
            if (!pnj) {
                return interaction.reply({ content: '❌ PNJ introuvable.', ephemeral: true });
            }

            // Supprime la référence dans le groupe
            if (pnj.groupe) {
                await Groupe.findByIdAndUpdate(
                    pnj.groupe,
                    { $pull: { pnjs: pnj._id } }
                );
            }

            // Supprime le PNJ
            await PNJ.deleteOne({ _id: pnj._id });

            interaction.reply({ content: `✅ PNJ \`${pnj.nom}\` supprimé avec succès.`, ephemeral: true });
        } catch (err) {
            handleError(interaction, err, 'Erreur lors de la suppression du PNJ.');
        }
    }
};