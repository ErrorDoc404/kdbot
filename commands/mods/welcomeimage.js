const { MessageAttachment } = require("discord.js");
const WelcomeImage = require("../../mongoose/database/schemas/WelcomeImage");
const empty = require('is-empty');

module.exports = {
  name: "welcomeimage",
  description: "set Welcome custom Image to you welcome screen",
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
         name: "png",
         description: "Select Png url for welcome",
         value: "level",
         type: 3,
         required: false,
       },
       {
         name: "gif",
         description: "Select gif url for welcome",
         value: "role",
         type: 3,
         required: false,
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
       }

       else if (args.name == 'png'){
         if(isImage(`${args.value}`)){
           const findWelcomeImage = await WelcomeImage.findOne({guildId: GuildDB.guildId });
           if(findWelcomeImage){
             await WelcomeImage.findOneAndUpdate({guildId: GuildDB.guildId },{
               png: args.value
             },{new: true});
           } else {
             const newGuildConfig = await WelcomeImage.create({
               guildId: GuildDB.guildId,
               png: args.value
             });
           }
         }else {
           return interaction.reply(`Not a valid url`).catch((err) => {client.error(err)});
         }
         return interaction.reply(`Successfully Set png in welcome`).catch((err) => {client.error(err)});
       }
       else if (args.name == 'gif'){
         if(isGif(`${args.value}`)){
           const findWelcomeImage = await WelcomeImage.findOne({guildId: GuildDB.guildId });
           if(findWelcomeImage){
             await WelcomeImage.findOneAndUpdate({guildId: GuildDB.guildId },{
               gif: args.value
             },{new: true});
           } else {
             const newGuildConfig = await WelcomeImage.create({
               guildId: GuildDB.guildId,
               gif: args.value
             });
           }
         }else {
           return interaction.reply(`Not a valid url`).catch((err) => {client.error(err)});
         }

         return interaction.reply(`Successfully Set gif in welcome`).catch((err) => {client.error(err)});
       }

     }
   }
}


function isImage(url) {
  return /\.(jpg|jpeg|png)$/.test(url);
}

function isGif(url) {
  return /\.(gif)$/.test(url);
}
