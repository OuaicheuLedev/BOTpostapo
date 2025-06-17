const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Group = require('../models/Group');
const checkPermissions = require('../utils/checkPermissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listgroupes')
        .setDescription('Affiche la liste de tous les groupes (admin seulement)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!checkPermissions(interaction, PermissionFlagsBits.Administrator)) return;

        const groups = await Group.find();
        if (groups.length === 0) {
            return await interaction.reply({ content: '⚠️ Aucun groupe n\'a été créé.', ephemeral: true });
        }

        let response = '📋 **Liste des groupes créés :**\n\n';
        for (const group of groups) {
            const leaderMention = `<@${group.chef}>`;
            const memberCount = group.membres.length;
            const pnjCount = group.pnjs.length;
            const ressources = group.ressources || [];
            const ressourcesStr = ressources.map(r => `${r.nom}: ${r.quantite}`).join(', ') || 'Aucune';

            response += `📛 **Nom du groupe :** ${group.nom}\n` +
                        `👑 **Chef :** ${leaderMention}\n` +
                        `👥 **Membres :** ${memberCount}\n` +
                        `🤖 **PNJ :** ${pnjCount}\n` +
                        `📦 **Ressources :** ${ressourcesStr}\n\n`;
        }

        await interaction.reply({ content: response, ephemeral: true });
    }
};