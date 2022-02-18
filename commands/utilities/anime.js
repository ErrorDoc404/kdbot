const random = require("karta-dharta").Random;
const { MessageEmbed } = require('discord.js');
const { Server } = require("socket.io");

module.exports = {
    name: "anime",
    description: "Get a random Anime Image",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ['animeimageurl','animeimg'],
    category: "utilities",
    run: async (client, message, args) => {
        if(!args[0]) return;
        if(!['pat','hug','waifu','cry','kiss','slap','smug','punch'].includes(args[0])){
            const notInclude = new MessageEmbed();
            notInclude.setDescription(`Must use \`pat\` \`hug\` \`waifu\` \`cry\` \`kiss\` \`slap\` \`smug\` \`punch\` `);
            return message.channel.send({embeds: [notInclude]});
        };
        let data = await random.getAnimeImgURL(args[0]);
        // return console.log(data);
        // const embed = new MessageEmbed(data);
        message.channel.send({content: data});
    },
    // SlashCommand: {
    //   /**
    //  *
    //  * @param {import("../library/DiscordModerationBot")} client
    //  * @param {import("discord.js").Message} message
    //  * @param {string[]} args
    //  * @param {*} param3
    //  */
    //   run: async (client, interaction) => {
    //     let data = await random.getRandomJoke();
    //     return console.log(data);
    //     data = data.embed;
    //     const embed = new MessageEmbed(data);

    //     return interaction.reply({ embeds: [embed] });
    //   }
    // }
};