/**
 * @param {import("../library/DiscordBot")} client
 */
 const Discord = require('discord.js');
 const {DiscordCanvas} = require('karta-dharta');
 const empty = require('is-empty');
 const canvas = new DiscordCanvas();
 const fs = require('fs');
 const Module = require("../mongoose/database/schemas/Module");
 const Moderation = require("../mongoose/database/schemas/Moderation");
 const GuildConfig = require("../mongoose/database/schemas/GuildConfig");
 
 
 module.exports = async (client, member) => {
   try{
        const findMemberAddModule = await Module.findOne({guildId: member.guild.id });
        if(findMemberAddModule.guildMemberAdd){
          const findMemberAddModeration = await Moderation.findOne({guildId: member.guild.id});
          var welcome_channel = member.guild.channels.cache.get(findMemberAddModeration.welcomeChannel);
          var image = empty(member.user.avatarURL()) ? member.user.defaultAvatarURL : member.user.avatarURL() ;    
    
          var images = [];
    
          fs.readdir('./image/', async (err, files) => {
            if (err) return client.warn(err);
            files.forEach(function(item) {
              images.push(item);
            });
    
            var image = images[Math.floor((Math.random() * images.length)) % images.length];
            let data = await canvas.welcome(member, { link: `./image/${image}`, blur: false });
    
            const attachment = new Discord.MessageAttachment(
              data
            );
    
            if(findMemberAddModeration.welcomeChannelMessage){
              welcomeMsg = findMemberAddModeration.welcomeChannelMessage;
              welcomeMsg = welcomeMsg.replace('$user', `<@${member.user.id}>`)
    
              welcome_channel.send({content: welcomeMsg, files: [attachment]});
            }else {
              welcome_channel.send({content: `Welcome to the server, ${member.user.username}!`, files: [attachment]});
            }
          });
        }

        const findGuildConfig = await GuildConfig.findOne({guildId: member.guild.id});
  
        if(findGuildConfig.defaultRole){
          member.roles.add(findGuildConfig.defaultRole).catch((err) => {
            client.error(`Missing Access: ${err}`);

            if(findGuildConfig.memberLogChannel){
              const logChannel = member.guild.channels.cache.get(findGuildConfig.memberLogChannel);
              logChannel.send(`Missing Access -> Can't grant join member role. Make sure my role is above granting role`);
            }
          });
        }
   } catch(error){
     return console.error(error);
   }
 };
 