const { MessageAttachment } = require("discord.js");
const RankRole = require("../../mongoose/database/schemas/RankRole");
const empty = require('is-empty');
const { CanvasSenpai } = require("canvas-senpai");
const fs = require('fs');
const { red } = require("colors");
const canvas = new CanvasSenpai();

module.exports = {
  name: "role",
  description: "Check the rank of your profile",
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
         name: "level",
         description: "Select level for role",
         value: "level",
         type: 4,
         required: true,
       },
       {
         name: "role",
         description: "Select Role for this level",
         value: "role",
         type: 8,
         required: true,
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
       args = interaction.options._hoistedOptions;

       console.log(GuildDB);
       try{
         const findRankRole = await RankRole.findOneAndUpdate({guildId: GuildDB.guildId, level: args[0].value }, {
           roleId: args[1].value,
         }, {new: true});
         if(findRankRole){
           return interaction.reply(`RankRole Updated for level ${args[0].value}`).catch((err) => {client.error(err)});
         } else {
           const newRankRole = await RankRole.create({
             guildId: GuildDB.guildId,
             level: args[0].value,
             roleId: args[1].value,
           });

           return interaction.reply(`RankRole Created`).catch((err) => {client.error(err)});
         }
       }catch (err){
         console.log(err);
         return interaction.reply(`${err}`).catch((error) => {client.error(error)});
       }

     }
   }
}
