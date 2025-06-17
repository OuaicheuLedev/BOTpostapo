module.exports = function handleError(interaction, err, message = 'Une erreur est survenue.') {
    console.error(err);
    if (interaction.replied || interaction.deferred) {
        interaction.followUp({ content: `❌ ${message}`, ephemeral: true });
    } else {
        interaction.reply({ content: `❌ ${message}`, ephemeral: true });
    }
};