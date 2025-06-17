const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas'); // Importer Canvas

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            // Charger la configuration du rôle depuis le fichier JSON
            const configPath = path.join(__dirname, '../config/autorole.json');
            if (!fs.existsSync(configPath)) {
                console.error('❌ Aucun rôle configuré pour l\'autorole. Utilisez la commande !setautorole pour configurer un rôle.');
                return;
            }

            const { roleId } = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

            // Vérifiez si le rôle existe
            const role = member.guild.roles.cache.get(roleId);
            if (!role) {
                console.error(`❌ Le rôle avec l'ID ${roleId} est introuvable dans le serveur.`);
                return;
            }

            // Attribuer le rôle à l'utilisateur
            await member.roles.add(role);
            console.log(`✅ Rôle attribué à ${member.user.tag}.`);

            // Générer une image personnalisée
            const canvas = createCanvas(700, 250);
            const ctx = canvas.getContext('2d');

            // Charger une image de fond
            const background = await loadImage('https://i.imgur.com/GQrYjZZ.jpeg'); // Exemple d'image valide
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            // Ajouter un texte de bienvenue
            ctx.font = 'bold 30px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Bienvenue, ${member.user.username}!`, 250, 125);

            // Convertir le canvas en pièce jointe
            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-image.png' });

            // Envoyer un message de bienvenue dans le salon spécifique
            const welcomeChannelId = '1364784513049428059'; // Remplacez par l'ID du salon de bienvenue
            const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
            if (welcomeChannel) {
                const embed = new EmbedBuilder()
                    .setColor('#00FF00') // Couleur verte pour indiquer un message positif
                    .setTitle('🎉 Bienvenue !')
                    .setDescription(
                        `Bienvenue <@${member.id}> dans **${member.guild.name}** !\n` +
                        `Nous sommes ravis de t'accueillir parmi nous. Profite bien de ton séjour !`
                    )
                    .setFooter({ text: 'Nous sommes ravis de t\'accueillir !', iconURL: member.guild.iconURL() });

                // Envoyer l'embed avec l'image personnalisée
                welcomeChannel.send({ embeds: [embed], files: [attachment] });
                console.log('✅ Image générée avec succès.');
                console.log('✅ Message envoyé dans le salon de bienvenue.');
            } else {
                console.error(`❌ Le salon avec l'ID ${welcomeChannelId} est introuvable.`);
            }
        } catch (err) {
            console.error(`❌ Une erreur est survenue lors de l'attribution du rôle ou de l'envoi du message de bienvenue :`, err);
        }
    }
};