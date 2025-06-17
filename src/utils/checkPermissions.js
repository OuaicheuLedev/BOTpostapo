const { PermissionFlagsBits } = require('discord.js');

module.exports = function checkPermissions(interaction, requiredPermission) {
    if (!interaction.memberPermissions.has(requiredPermission)) {
        interaction.reply({ content: '❌ Vous n\'avez pas les permissions nécessaires.', ephemeral: true });
        return false;
    }
    return true;
};