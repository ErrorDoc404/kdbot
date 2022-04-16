const { MessageAttachment } = require("discord.js");
const WelcomeImage = require("../../mongoose/database/schemas/WelcomeImage");
const empty = require('is-empty');

module.exports = {
  name: "setgif",
  description: "set Welcome gif to true or false",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: [],
  category: "moderation",
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
   run : async (client, message, args, { GuildDB }) => {
     console.log(`ping`);
   },
   SlashCommand: {
     options: [
       {
         name: "value",
         description: "Select Png url for welcome",
         value: "level",
         type: 5,
         required: true
       },
     ],
     /**
      *
      * @param {import("../structures/DiscordMusicBot")} client
      * @param {import("discord.js").Message} message
      * @param {string[]} args
      * @param {*} param3
      */
     run: async (client, interaction, args, { GuildDB }) => {
       const findWelcomeImage = await WelcomeImage.findOne({guildId: GuildDB.guildId });
       if(findWelcomeImage){
         await WelcomeImage.findOneAndUpdate({guildId: GuildDB.guildId },{
           setGif: args.value
         },{new: true});
       } else {
         const newGuildConfig = await WelcomeImage.create({
           guildId: GuildDB.guildId,
           setGif: args.value
         });
       }

       return interaction.reply(`Successfully Set gif as **${args.value}**`).catch((err) => {client.error(err)});
     }
   }
}
