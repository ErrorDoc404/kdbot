const { Message, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
  name: "help",
  description: "Information about the bot",
  usage: "[command]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd"],
  category: "info",
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {

    if(args[0]){
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

      return message.channel.send({embeds: [embed]});
    }

    const emojis = {
      economy: '💸',
      moderation: '🛠️',
      info: 'ℹ️',
      level: '📈',
      utilities: '🧪'
    }

    const directories = [...new Set(client.commands.map(cmd => cmd.category))];
    
    const formatString = (srt) => `${srt[0].toUpperCase()}${srt.slice(1).toLowerCase()}`;

    const categories = directories.map((dir) => {
      const getCommands = client.commands.filter((cmd) => cmd.category === dir);

      return {
        directory: formatString(dir),
        commands: getCommands,
      }
    });

    const embed = new MessageEmbed();
    embed.setDescription('Please Choose a Category in the dropdown menu');

    const components = (state) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder('Please Select A Category')
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Commands from ${cmd.directory} Category`,
                emoji: emojis[cmd.directory.toLowerCase()] || null,
              }
            })
          )
      )
    ];

    const initialMessage = await message.channel.send({
      embeds: [embed],
      components: components(false),
    });

    const filter = (interaction) => interaction.user.id === message.author.id;
    
    const collector = message.channel.createMessageComponentCollector({filter: filter, componentType: 'SELECT_MENU', time: 10000})

    collector.on('collect', (interaction) => {
      const [ directory ] = interaction.values;
      const category = categories.find(x => x.directory.toLowerCase() === directory);

      let categoryEmbed = new MessageEmbed();
      categoryEmbed.setTitle(`${category.directory} Commands`);
      categoryEmbed.setDescription(`Here are the list of commands`);
      category.commands.map((cmd) => { 
        categoryEmbed.addField(cmd.name, `\`${cmd.description}\``, true);
      });

      interaction.update({embeds: [categoryEmbed]});
    });

    collector.on('end', () => {
      initialMessage.edit({components: components(true)});
    });

  },
  
  // run: async (client, message, args, { GuildDB }) => {

  //   let Embed = new MessageEmbed()
  //     .setTitle(
  //       `Commands of ${client.user.username}`,
  //     )
  //     .setColor(client.config.EmbedColor)


  //   let Commands = client.commands.map(
  //     (cmd) =>
  //     Embed.addField(`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${cmd.name}`, `${cmd.description}`, true)
  //       // `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
  //       //   cmd.name
  //       // }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
  //   );

  //   Embed.addField(`Version`, ` v${require("../package.json").version}`, false);


  //   if (!args[0]) message.channel.send({embeds: [Embed]});
  //   else {
  //     let cmd =
  //       client.commands.get(args[0]) ||
  //       client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
  //     if (!cmd)
  //       return client.sendTime(
  //         message.channel,
  //         `❌ | Unable to find that command.`
  //       );

  //     let embed = new MessageEmbed()
  //       .setTitle(`Command: ${cmd.name}`)
  //       .setDescription(cmd.description)
  //       .setColor("GREEN")
  //       //.addField("Name", cmd.name, true)
  //       .addField("Aliases", `\`${cmd.aliases.join(", ")}\``, true)
  //       .addField(
  //         "Usage",
  //         `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
  //           cmd.name
  //         }${cmd.usage ? " " + cmd.usage : ""}\``,
  //         true
  //       )
  //       .addField(
  //         "Permissions",
  //         "Member: " +
  //           cmd.permissions.member.join(", ") +
  //           "\nBot: " +
  //           cmd.permissions.channel.join(", "),
  //         true
  //       )

  //     message.channel.send({embeds: [embed]});
  //   }
  // }
};