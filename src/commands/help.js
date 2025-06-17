const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche la liste des commandes disponibles.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('📖 Commandes Slash du Bot')
            .setColor(0x00B5E2)
            .setDescription('Voici la liste des commandes disponibles avec leur description :')
            .addFields(
                { name: '/help', value: 'Affiche cette aide', inline: true },
                { name: '/addpnj', value: 'Ajoute un PNJ à un groupe', inline: true },
                { name: '/ajouterressource', value: 'Ajoute des ressources à un groupe', inline: true },
                { name: '/creergroupe', value: 'Crée un nouveau groupe', inline: true },
                { name: '/deletepnj', value: 'Supprime un PNJ par son nom ou ID', inline: true },
                { name: '/forceupdate', value: 'Force la mise à jour des ressources de tous les groupes', inline: true },
                { name: '/joingroup', value: 'Rejoindre un groupe existant', inline: true },
                { name: '/leavegroup', value: 'Quitter le groupe dont vous êtes membre', inline: true },
                { name: '/listgroupes', value: 'Affiche la liste de tous les groupes', inline: true },
                { name: '/roleReaction', value: 'Assigne un rôle via une réaction', inline: true },
                { name: '/setautorole', value: 'Définit le rôle automatique pour les nouveaux membres', inline: true },
                { name: '/setchannel', value: 'Définit un salon pour une fonctionnalité spécifique', inline: true },
                { name: '/setchef', value: 'Définit un nouveau chef pour un groupe', inline: true },
                { name: '/setwelcomechannel', value: 'Définit le salon de bienvenue', inline: true },
                { name: '/suppgroupe', value: 'Supprime un groupe existant', inline: true },
                { name: '/suppressource', value: 'Supprime une quantité de ressources d’un groupe', inline: true },
                { name: '/viewgroupe', value: 'Affiche les informations d’un groupe', inline: true }
            )
            .setFooter({ text: 'Utilise /<commande> pour plus de détails.' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};


