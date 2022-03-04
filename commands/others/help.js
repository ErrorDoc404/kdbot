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
      utilities: '🧪',
      image: '🖼️',
      activity: '🎮'
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
        categoryEmbed.addField(`${GuildDB ? GuildDB.prefix : '!' }${cmd.name}`, `\`${cmd.description}\``, true);
      });

      interaction.update({embeds: [categoryEmbed]});
    });

    collector.on('end', () => {
      initialMessage.edit({components: components(true)});
    });

  },
  SlashCommand: {
    options: [
      {
        name: "command",
        description: "Get information on a specific command",
        value: "command",
        type: 3,
        required: false,
      },
      {
        name: "category",
        description: "Get information on a specific Category",
        value: "category",
        type: 3,
        required: false,
        choices: [
          {
            name: 'Economy',
            value: 'economy',
          },
          {
            name: 'Moderation',
            value: 'moderation',
          },
          {
            name: 'Info',
            value: 'info',
          },
          {
            name: 'Level',
            value: 'level',
          },
          {
            name: 'Utility',
            value: 'utilities',
          },
          {
            name: 'Image',
            value: 'image',
          },
          {
            name: 'Activity',
            value: 'activity',
          }
        ],
      }
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      if(!args){
        return interaction.reply(`Select either category or commnad`).catch((err) => {client.error(err)});
      }else if (args.name == 'category'){
        const embed = new MessageEmbed();
        const cat = args.value;
        const commands = client.commands;
        const catCommands = [];
        commands.forEach((cmd) => {
          if(cmd.category != cat) return;
          catCommands.push(cmd);
        });
        embed.setTitle(`Commands for ${args.value} category`);
        catCommands.forEach((catCmd) => {
          embed.addFields({name: `${GuildDB ? GuildDB.prefix : '!' }${catCmd.name}`,value: `\`${catCmd.description}\``,inline: true});
        });
        return interaction.reply({embeds: [embed]}).catch((err) => {client.error(err)});
      } else if(args.name == 'command') {
        let cmd = client.commands.get(args.value) || client.commands.find((x) => x.aliases && x.aliases.includes(args.value));

        if(!cmd){
          let notFound = new MessageEmbed();
          notFound.setColor(`RED`);
          notFound.setDescription(`❌ | Unable to find that command.`);

          return interaction.reply({embeds: [notFound]}).catch((err) => {client.error(err)});
        };
        
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
        );

        return interaction.reply({embeds: [embed]}).catch((err) => {client.error(err)});
      }
    }
  }
};