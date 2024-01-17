const { MessageAttachment } = require("discord.js");
const Level = require("../../mongoose/database/schemas/Level");
const empty = require('is-empty');
const { DiscordProfile } = require("kdprod");
const fs = require('fs');
const { red } = require("colors");
const canvas = new DiscordProfile();

module.exports = {
    name: "rank",
    description: "Check the rank of your profile",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "level",
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {

        try {
            var member = null;
            if (!empty(args)) {
                member = message.mentions.members.first();
                member = member.user;
            }
            else member = message.author;
            let user_data = await Level.findOne({ guildId: message.guild.id, userID: member.id });


            if (user_data) {
                var images = [];
                fs.readdir('./image/', async (err, files) => {
                    if (err) return err;
                    files.forEach(function (item) {
                        images.push(item);
                    });

                    var image = `./image/2564878.jpg`;

                    console.log(user_data.rank, user_data.totalXp);

                    let data = await canvas.profile(
                        {
                            name: member.username,
                            discriminator: member.discriminator,
                            avatar: member.displayAvatarURL({ format: "png" }),
                            rank: user_data.rank,
                            xp: user_data.totalXp,
                            blur: false,
                            background: image
                        });

                    const attachment = new MessageAttachment(data, `${image}`);

                    message.channel.send({ files: [attachment] });
                });
            }
        } catch (err) {
            console.err(err);
        }
    }
}