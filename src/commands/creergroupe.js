const { SlashCommandBuilder } = require('discord.js');
const Groupe = require('../models/Group');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('creergroupe')
    .setDescription('Crée un nouveau groupe')
    .addStringOption(option =>
      option.setName('nom')
        .setDescription('Nom du groupe')
        .setRequired(true)
    ),

  async execute(interaction) {
    const groupName = interaction.options.getString('nom');

    // Vérifie si un groupe avec ce nom existe déjà
    const existingGroup = await Groupe.findOne({ nom: groupName });
    if (existingGroup) {
      return interaction.reply({ content: '❌ Un groupe avec ce nom existe déjà.', ephemeral: true });
    }

    // Crée un nouveau groupe avec les ressources de base
    const nouveauGroupe = new Groupe({
      nom: groupName,
      chef: interaction.user.id,
      membres: [interaction.user.id],
      ressources: [
        { nom: 'Nourriture', type: 'food', quantite: 100 },
        { nom: 'Eau', type: 'water', quantite: 100 },
        { nom: 'Carburant', type: 'fuel', quantite: 100 },
        { nom: 'Matériaux', type: 'materials', quantite: 100 },
      ],
      pnjs: [],
    });

    try {
      await nouveauGroupe.save();
      await interaction.reply(`✅ Groupe **${groupName}** créé avec succès !`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Une erreur est survenue lors de la création du groupe.', ephemeral: true });
    }
  },
};
