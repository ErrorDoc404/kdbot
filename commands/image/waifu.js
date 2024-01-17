// const random = require("karta-dharta").Random;
const { MessageEmbed } = require('discord.js');
const { Server } = require("socket.io");

module.exports = {
    name: "waifu",
    description: "Get a random Waifu Image",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "image",
    run: async (client, message, args) => {
        let data = await random.getAnimeImgURL('waifu');
        const embed = new MessageEmbed();
        embed.setTitle(`Random waifu image`);
        embed.setImage(data);
        // embed.setFooter({text: `if you want to slap someone then tage user`});
        message.channel.send({ embeds: [embed] });
    },
    SlashCommand: {
        run: async (client, interaction, args) => {
            let data = await random.getAnimeImgURL('waifu');
            const embed = new MessageEmbed();
            embed.setTitle(`Random waifu image`);
            embed.setImage(data);
            // embed.setFooter({text: `if you want to slap someone then tage user`});

            return interaction.reply({ embeds: [embed] }).catch((err) => { client.error(err) });
        }
    }
};