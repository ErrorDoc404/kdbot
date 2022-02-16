const { MessageEmbed, MessageReaction } = require("discord.js");
const Module = require("../mongoose/database/schemas/Module");
const Moderation = require("../mongoose/database/schemas/Moderation");

module.exports = {
  name: "welcome",
  description: "Can set welcome and goodbye in channel",
  usage: "",
  category: "moderation",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: ["wsetting"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message) => {
    try{
      const findWelcomeModule = await Module.findOne({guildId: message.guild.id });
      if(findWelcomeModule.guildMemberAdd == true){
        let EditWelcome = new MessageEmbed()
              .setColor(client.config.EmbedColor)
              .setDescription(`
        What can I do for you?

        🔧   - Add/Edit Welcome Log Channel
        💌   - Add/Edit Welcome Message
        :x:   - Stop welcome post
        `);
        let EditWelcomePost = await message.channel.send({embeds: [EditWelcome]});
        await EditWelcomePost.react("🔧");
        await EditWelcomePost.react("💌");
        await EditWelcomePost.react("❌");

        const filter = (reaction, user) => {
            return user.id === message.author.id && ["🔧", "❌","💌"].includes(reaction.emoji.name);
        };

        let emoji = await EditWelcomePost.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
        .catch(() => {
          EditWelcomePost.reactions.removeAll();
          client.sendTime(
            message.channel,
            "❌ | **You took too long to respond. If you want to edit the settings, run the command again!**"
          );
          EditWelcomePost.delete(EditWelcome);
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
        EditWelcomePost.reactions.removeAll();
        if (em._emoji.name === "🔧") {
            await client.sendTime(
              message.channel,
              "Which channel do you want to set the welcome message to?"
            );
            const msgFilter = (msg) => {
                return msg.author.id === message.author.id
            }
            await message.channel.awaitMessages({ msgFilter, max: 1, time: 30000, errors: ["time"] })
            .then(async welcomeMsg => {
              if (!welcomeMsg.first())
                return client.sendTime(
                  message.channel,
                  "You took too long to respond."
                );
              welcomeMsg = welcomeMsg.first();
              welcomeMsg = welcomeMsg.content;
              welcomeMsg = welcomeMsg.replace(/[^0-9]/g, "");

              try{
                const SetModeration = await Moderation.findOneAndUpdate({guildId: message.guild.id },{
                  welcomeChannel: welcomeMsg,
                },{new: true});
              }catch (err){
                console.log(err);
              }

              client.sendTime(
                message.channel,
                `Successfully saved welcome channel as <#${welcomeMsg}>`
              );
            })
            .catch(collected => {
              return client.sendTime(message.channel, "You took too long to respond");
            });
        } else if(em._emoji.name === "💌"){
          await client.sendTime(
            message.channel,
            "What welcome message do you want to set? `use $user to replace the user with there name`"
          );
          const msgFilter = (msg) => {
            return msg.author.id === message.author.id
          }
          await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 30000, errors: ["time"] })
          .then(async welcomeMsg => {
            if (!welcomeMsg.first())
              return client.sendTime(
                message.channel,
                "You took too long to respond."
              );
            welcomeMsg = welcomeMsg.first();
            welcomeMsg = welcomeMsg.content;

            try{
              const SetModeration = await Moderation.findOneAndUpdate({guildId: message.guild.id },{
                welcomeChannelMessage: welcomeMsg,
              },{new: true});
            }catch (err){
              console.log(err);
            }

            client.sendTime(
              message.channel,
              `Successfully saved your welcome message`
            );
          })
          .catch(collected => {
            return client.sendTime(message.channel, "You took too long to respond");
          });
        } else if(em._emoji.name === "❌") {
          try{
            const SetModule = await Module.findOneAndUpdate({guildId: message.guild.id },{
              guildMemberAdd: false,
            },{new: true});
          }catch (err){
            console.log(err);
          }

          client.sendTime(
            message.channel,
            `Successfully stop welcome post`
          );
        }
      } else {
        let EditWelcome = new MessageEmbed()
              .setAuthor("Welcome Config", client.config.IconURL)
              .setColor(client.config.EmbedColor)
              .setDescription(`
        What can I do for you?

        🔧   - Activate Welcome Log Channel
        :x:   - Do Nothing
        `);
        let EditWelcomePost = await message.channel.send({embeds: [EditWelcome]});
        await EditWelcomePost.react("🔧");
        await EditWelcomePost.react("❌");

        const filter = (reaction, user) => {
            return user.id === message.author.id && ["🔧", "❌"].includes(reaction.emoji.name);
        };

        let emoji = await EditWelcomePost.awaitReactions({ filter: filter, max: 1, time: 30000, errors: ['time'] })
        .catch(() => {
          EditWelcomePost.reactions.removeAll();
          client.sendTime(
            message.channel,
            "❌ | **You took too long to respond. Try Again!**"
          );
          EditWelcomePost.delete(EditWelcome);
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
        EditWelcomePost.reactions.removeAll();
        if (em._emoji.name === "🔧") {
            await client.sendTime(
              message.channel,
              "What channel would you like the welcome post to appear in?"
            );
            const msgFilter = (msg) => {
                return msg.author.id === message.author.id
            }
            await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 30000, errors: ["time"] })
            .then(async welcomeMsg => {
              if (!welcomeMsg.first())
                return client.sendTime(
                  message.channel,
                  "You took too long to respond."
                );
              welcomeMsg = welcomeMsg.first();
              welcomeMsg = welcomeMsg.content;
              welcomeMsg = welcomeMsg.replace(/[^0-9]/g, "");

              try{
                const SetModule = await Module.findOneAndUpdate({guildId: message.guild.id },{
                  guildMemberAdd: true,
                },{new: true});
              }catch (err){
                console.log(err);
              }

              try{
                const SetModeration = await Moderation.findOneAndUpdate({guildId: message.guild.id },{
                  welcomeChannel: welcomeMsg,
                },{new: true});
                if(SetModeration){
                  console.log('Module found');
                } else {
                  const newModeration = await Moderation.create({
                    guildId: message.guild.id,
                    welcomeChannel: welcomeMsg,
                  });
                }
              }catch (err){
                console.log(err);
              }

              client.sendTime(
                message.channel,
                `Successfully saved welcome channel as <#${welcomeMsg}>`
              );
            })
            .catch(collected => {
              return client.sendTime(message.channel, "You took too long to respond");
            });            
        }
      }
    }catch (err){
      console.log(err);
    }
  }
};
