const { MessageAttachment } = require('discord.js');
const { DiscordProfile } = require('kdprod');
const canvas = new DiscordProfile();
const Level = require("../../mongoose/database/schemas/Level");
const empty = require('is-empty');
const fs = require('fs');
const { red } = require("colors");

module.exports = {
    name: "rank",
    description: "Get information about the bot",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "profile",
    run: async (client, message, args, { GuildDB }) => {
        if (message.author.bot) return;
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

                    var image = images[Math.floor((Math.random() * images.length)) % images.length];

                    const data = await canvas.rankcard({
                        member: message.author,
                        currentXP: user_data.xp,
                        fullXP: 5 * (user_data.level ^ 2) + (50 * user_data.level) + 100,
                        level: user_data.level,
                        rank: user_data.rank,
                        link: `./image/${image}`
                    });

                    message.channel.send({ files: [data] });
                });
            }
        } catch (e) {
            console.log(e);
        }
    },
}