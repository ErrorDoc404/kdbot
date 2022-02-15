const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Information about the bot",
  usage: "[command]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {

    let Embed = new MessageEmbed()
      .setTitle(
        `Commands of ${client.user.username}`,
      )
      .setColor(client.config.EmbedColor)


    let Commands = client.commands.map(
      (cmd) =>
      Embed.addField(`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${cmd.name}`, `${cmd.description}`, true)
        // `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
        //   cmd.name
        // }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    );

    Embed.addField(`Version`, ` v${require("../package.json").version}`, false);


    if (!args[0]) message.channel.send({embeds: [Embed]});
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendTime(
          message.channel,
          `❌ | Unable to find that command.`
        );

      let embed = new MessageEmbed()
        .setTitle(`Command: ${cmd.name}`)
        .setDescription(cmd.description)
        .setColor("GREEN")
        //.addField("Name", cmd.name, true)
        .addField("Aliases", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          "Usage",
          `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "Permissions",
          "Member: " +
            cmd.permissions.member.join(", ") +
            "\nBot: " +
            cmd.permissions.channel.join(", "),
          true
        )

      message.channel.send({embeds: [embed]});
    }
  }
};