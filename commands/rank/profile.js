const { MessageAttachment } = require("discord.js");
const Level = require("../../mongoose/database/schemas/Level");
const empty = require('is-empty');
const { DiscordProfile } = require("kdprod");
const fs = require('fs');
const { red } = require("colors");
const canva = new DiscordProfile();

module.exports = {
  name: "profile",
  description: "Check the rank of your profile and your friends profile",
  usage: "[user]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["level"],
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

          var image = `2461329.jpg`;

          let data = await canva.rankcard({
            link: `./image/${image}`,
            name: member.username,
            discriminator: member.discriminator,
            level: user_data.level,
            rank: user_data.rank,
            currentXP: user_data.xp,
            fullXP: 5 * (user_data.level ^ 2) + (50 * user_data.level) + 100,
            // fullXP: ((user_data.level * (user_data.level + 1) * 100) + ((user_data.level * (user_data.level + 1)) * 20)),
            avatar: member.displayAvatarURL({ format: "png" }),
            blur: false,
            fillStyle: user_data.color ? user_data.color : 'white'
          });



          const attachment = new MessageAttachment(data, `${image}`);

          message.channel.send({ files: [attachment] });
        });
      }
    } catch (err) {
      client.error(err);
    }
  },
  // SlashCommand: {},
};
