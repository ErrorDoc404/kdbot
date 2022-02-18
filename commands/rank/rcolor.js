const { MessageEmbed } = require("discord.js");
const Level = require("../../mongoose/database/schemas/Level");

module.exports = {
    name: "rcolor",
    description: "Edit the rank color settings",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [""],
    },
    aliases: ["rankcolor"],
    category: "level",
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        let Rank = new MessageEmbed()
            .setTitle('Rank Profile')
            .setColor(client.config.EmbedColor)
            .setDescription(`React the color you want to set in your rank banner.`);

        const RankMessage = await message.channel.send({embeds: [Rank]});
        await RankMessage.react("⚪");
        await RankMessage.react("🔵");
        await RankMessage.react("🟤");
        await RankMessage.react("🟢");
        await RankMessage.react("🟠");
        await RankMessage.react("🟣");
        await RankMessage.react("🔴");
        await RankMessage.react("🟡");
        await RankMessage.react("⚫");

        const filter = (reaction, user) => {
            return user.id === message.author.id && ["⚪", "🔵","🟤", "🟢","🟠","🟣","🔴","🟡","⚫"].includes(reaction.emoji.name);
        };

        let emoji = await RankMessage.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
        .catch(() => {
            RankMessage.reactions.removeAll();
            client.sendTime(
              message.channel,
              "❌ | **You took too long to respond. If you want to edit the settings, run the command again!**"
            );
            RankMessage.delete(Rank);
          });

        let isOk = false;

        try {
            emoji = emoji.first();
        } catch {
            isOk = true;
        }

        if (isOk) return;

        /**@type {MessageReaction} */

        let em = emoji;
        RankMessage.reactions.removeAll();
        if (em._emoji.name === "⚪") color = 'white';
        else if (em._emoji.name === "🔵") color = 'blue';
        else if (em._emoji.name === "🟤") color = 'brown';
        else if (em._emoji.name === "🟢") color = 'green';
        else if (em._emoji.name === "🟠") color = 'orange';
        else if (em._emoji.name === "🟣") color = 'purple';
        else if (em._emoji.name === "🔴") color = 'red';
        else if (em._emoji.name === "🟡") color = 'yellow';
        else if (em._emoji.name === "⚫") color = 'black';

        let user_data = await Level.findOneAndUpdate({guildId: message.guild.id, userID: message.author.id }, {
            color: color
        });

        client.sendTime(
            message.channel,
            `Successfully saved rank banner color as \`${color}\``
        );
    }
};