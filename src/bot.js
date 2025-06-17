require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { updateGroupResources } = require('./utils/resourceManager');
const Group = require('./models/Group');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

client.once('ready', () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);

    setInterval(async () => {
        // Charge la config des salons
        const configPath = path.join(__dirname, 'config/channels.json');
        let channelsConfig = {};
        if (fs.existsSync(configPath)) {
            channelsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        const groups = await Group.find();
        for (const group of groups) {
            await updateGroupResources(group._id);

            // Cherche le salon "updates" pour la guilde du groupe
            const guildId = group.guildId || client.guilds.cache.first()?.id; // adapte si tu stockes guildId dans Group
            const channelId = channelsConfig[guildId]?.updates;
            if (channelId) {
                const channel = await client.channels.fetch(channelId).catch(() => null);
                if (channel) {
                    channel.send(`🔔 Mise à jour automatique du groupe **${group.nom}** : ressources et moral ajustés.`);
                }
            }
        }
        console.log('⏳ Mise à jour automatique des ressources et du moral des groupes.');
    }, 1000 * 60 * 60); // toutes les heures
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '❌ Une erreur est survenue lors de l’exécution de la commande.', ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ Une erreur est survenue lors de l’exécution de la commande.', ephemeral: true });
        }
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connecté à MongoDB');
        client.login(process.env.BOT_TOKEN);
    })
    .catch(err => {
        console.error('❌ Erreur de connexion MongoDB :', err);
    });
