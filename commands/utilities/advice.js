const random = require("karta-dharta").Random;
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "advice",
  description: "Get a random advice",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  category: "utilities",
  run: async (client, message) => {
    let data = await random.getAdvice();
    data = data.embed;
    const embed = new MessageEmbed(data);
    message.channel.send({embeds: [embed]});
  },
  SlashCommand: {
    /**
   *
   * @param {import("../library/DiscordModerationBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
    run: async (client, interaction) => {
      let data = await random.getAdvice();
      data = data.embed;
      const embed = new MessageEmbed(data);

      return interaction.reply({ embeds: [embed] }).catch((err) => client.error(err));
    }
  }
};