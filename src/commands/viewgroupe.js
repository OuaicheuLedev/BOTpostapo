const { SlashCommandBuilder } = require('discord.js');
const Group = require('../models/Group');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewgroupe')
        .setDescription('Affiche toutes les informations d’un groupe.')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Nom du groupe')
                .setRequired(true)),
    async execute(interaction) {
        const groupName = interaction.options.getString('nom');
        const group = await Group.findOne({ nom: groupName });

        if (!group) {
            return interaction.reply({ content: '❌ Aucun groupe trouvé avec ce nom.', ephemeral: true });
        }

        const memberMentions = group.membres.length > 0
            ? group.membres.map(id => `<@${id}>`).join(', ')
            : 'Aucun membre';

        const pnjList = group.pnjs.length > 0
            ? group.pnjs.map(pnj => pnj.nom).join(', ')
            : 'Aucun PNJ';

        const leaderMention = `<@${group.chef}>`;
        const nourriture = group.ressources.find(r => r.type === 'food')?.quantite || 0;
        const eau = group.ressources.find(r => r.type === 'water')?.quantite || 0;
        const carburant = group.ressources.find(r => r.type === 'fuel')?.quantite || 0;
        const materiaux = group.ressources.find(r => r.type === 'materials')?.quantite || 0;
        const lastUpdate = group.lastUpdate ? new Date(group.lastUpdate).toLocaleString('fr-FR') : 'N/A';
        const moral = group.moral !== undefined ? group.moral : 100;

        return interaction.reply({
            content:
                `📛 **Nom du groupe :** ${group.nom}\n` +
                `👑 **Chef :** ${leaderMention}\n` +
                `👥 **Membres :** ${memberMentions}\n` +
                `🤖 **PNJ :** ${pnjList}\n\n` +
                `📦 **Ressources :**\n` +
                `   🥫 Nourriture : ${nourriture}\n` +
                `   💧 Eau : ${eau}\n` +
                `   🛢️ Carburant : ${carburant}\n` +
                `   🧱 Matériaux : ${materiaux}\n\n` +
                `❤️ **Moral :** ${moral}%\n\n` +
                `🕒 **Dernière mise à jour :** ${lastUpdate}`,
            ephemeral: true
        });
    }
};