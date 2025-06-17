const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    // Handle message creation event
});

client.on('guildMemberAdd', (member) => {
    // Handle new member joining the guild
});

module.exports = { client };