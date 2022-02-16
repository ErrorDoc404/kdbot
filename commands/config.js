const { MessageEmbed, MessageReaction } = require("discord.js");
const GuildConfig = require("../mongoose/database/schemas/GuildConfig");

module.exports = {
  name: "config",
  description: "Edit the bot settings",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: ["conf"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Config = new MessageEmbed()
      .setColor(client.config.EmbedColor)
      .setDescription(`
What would you like to edit?

:one:   - Server Prefix
:two:   - Moderator Role
:three: - Member join Role
`);

    let ConfigMessage = await message.channel.send({embeds: [Config]});
    await ConfigMessage.react("1️⃣");
    await ConfigMessage.react("2️⃣");
    await ConfigMessage.react("3️⃣");
    // await ConfigMessage.react("4️⃣");

    const filter = (reaction, user) => {
        return user.id === message.author.id && ["1️⃣", "2️⃣","3️⃣"].includes(reaction.emoji.name);
    };

    let emoji = await ConfigMessage.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
    .catch(() => {
      ConfigMessage.reactions.removeAll();
      client.sendTime(
        message.channel,
        "❌ | **You took too long to respond. If you want to edit the settings, run the command again!**"
      );
      ConfigMessage.delete(Config);
    });
    let isOk = false;
    try {
      emoji = emoji.first();
    } catch {
      isOk = true;
    }
    if (isOk) return; //im idiot sry ;-;
    /**@type {MessageReaction} */
    let em = emoji;
    ConfigMessage.reactions.removeAll();
    if (em._emoji.name === "1️⃣") {
      await client.sendTime(
        message.channel,
        "What do you want to change the prefix to?"
      );

      const prefixFilter = (msg) => {
          return msg.author.id === message.author.id
      }
      await message.channel.awaitMessages({ filter: prefixFilter, max: 1, time: 30000, errors: ["time"] })
        .then(async prefixMsg => {
          if(!prefixMsg.first()){
            return client.sendTime(message.channel, "You took too long to respond");
          }

          prefixMsg = prefixMsg.first();
          prefixMsg = prefixMsg.content;

          try{
            const findGuildConfig = await GuildConfig.findOneAndUpdate({guildId: message.guild.id },{
              prefix: prefixMsg,
              modRole: GuildDB.modRole,
            },{new: true});
          }catch (err){
            console.log(err);
          }
          client.sendTime(
            message.channel,
            `Successfully saved guild prefix as \`${prefixMsg}\``
          );
        })
        .catch(collected => {
          return client.sendTime(message.channel, "You took too long to respond");
        });
    } else if(em._emoji.name === "2️⃣") {
      await client.sendTime(
        message.channel,
        "Please mention the role you want `Moderators's` to have."
      );
      const roleFilter = (msg) => {
        return msg.author.id === message.author.id
      }
      let role = await message.channel.awaitMessages({ roleFilter, max: 1, time: 30000, errors: ["time"] });
      if (!role.first())
        return client.sendTime(
          message.channel,
          "You took too long to respond."
        );
      role = role.first();
      if (!role.mentions.roles.first())
        return client.sendTime(
          message.channel,
          "Please mention the role that you want for Moderators's only."
        );
      role = role.mentions.roles.first();

      try{
        const findGuildConfig = await GuildConfig.findOneAndUpdate({guildId: message.guild.id },{
          prefix: GuildDB.prefix,
          modRole: role.id,
        },{new: true});
      }catch (err){
        console.log(err);
      }

      client.sendTime(
        message.channel,
        "Successfully saved Moderators role as <@&" + role.id + ">"
      );
    } else if(em._emoji.name === "3️⃣"){
      await client.sendTime(
        message.channel, "Please mention the role you want `Default Member's Join` to have."
      );
      const roleFilter = (msg) => {
        return msg.author.id === message.author.id
      }
      let role = await message.channel.awaitMessages({ roleFilter, max: 1, time: 30000, errors: ["time"] });
      if (!role.first())
        return client.sendTime(message.channel, "You took too long to respond.");
      role = role.first();
      if (!role.mentions.roles.first())
        return client.sendTime(
          message.channel, "Please mention the role that you want for Default Member's Join only."
        );
      role = role.mentions.roles.first();

      try{
        const findGuildConfig = await GuildConfig.findOneAndUpdate({guildId: message.guild.id },{
          prefix: GuildDB.prefix,
          defaultRole: role.id,
        },{new: true});
      }catch (err){
        console.log(err);
        client.sendTime(
          message.channel, "❌ | Something went Wrong"
        );
      }

      client.sendTime(
        message.channel, "Successfully saved Default Member's Join role as <@&" + role.id + ">"
      );
    }
  },
};
