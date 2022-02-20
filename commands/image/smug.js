const random = require("karta-dharta").Random;
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "smug",
    description: "Get a random Smug Image",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: [],
    category: "image",
    run: async (client, message, args) => {
        let data = await random.getAnimeImgURL('smug');
        const embed = new MessageEmbed();
        embed.setTitle(`Random smug image`);
        embed.setImage(data);
        // embed.setFooter({text: `if you want to slap someone then tage user`});
        message.channel.send({embeds: [embed]});
    },
    SlashCommand:{
        run: async (client, interaction, args) => {
            let data = await random.getAnimeImgURL('smug');
            const embed = new MessageEmbed();
            embed.setTitle(`Random smug image`);
            embed.setImage(data);
            // embed.setFooter({text: `if you want to slap someone then tage user`});

            return interaction.reply({embeds: [embed]}).catch((err) => {client.error(err)});
        }
    }
};