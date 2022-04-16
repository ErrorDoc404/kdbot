/**
 * @param {import("../library/DiscordBot")} client
 */
 const Discord = require('discord.js');
 const {DiscordCanvas, WelcomeCanvas} = require('karta-dharta');
 const empty = require('is-empty');
 const canvas = new DiscordCanvas();
 const fs = require('fs');
 const Module = require("../mongoose/database/schemas/Module");
 const Moderation = require("../mongoose/database/schemas/Moderation");
 const WelcomeImage = require("../mongoose/database/schemas/WelcomeImage");
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

            const findWelcomeImage = await WelcomeImage.findOne({guildId: member.guild.id});

            var imageData;

            if(findWelcomeImage)
                if(findWelcomeImage.png)
                  imageData = await canvas.welcome(member, { link: `${findWelcomeImage.png}`, blur: false });
                else
                  imageData = await canvas.welcome(member, { link: `./image/${image}`, blur: false });
            else
                imageData = await canvas.welcome(member, { link: `./image/${image}`, blur: false });

            var welcomeImage;

            if(findWelcomeImage){
              if(findWelcomeImage.gif){
                welcomeImage = new WelcomeCanvas()
                 .setBackground(`${findWelcomeImage.gif}`)
                 .setGIF(true)
                 .setAvatar(member.user.displayAvatarURL({ format: "png" }))
                 .setName(member.user.username)
                 .setDiscriminator(member.user.discriminator)
                 .setBlur(2)
              } else {
                welcomeImage = new WelcomeCanvas()
                 .setBackground("https://i.pinimg.com/originals/07/28/dc/0728dc400eca09632215055ff003d8bf.gif")
                 .setGIF(true)
                 .setAvatar(member.user.displayAvatarURL({ format: "png" }))
                 .setName(member.user.username)
                 .setDiscriminator(member.user.discriminator)
                 .setBlur(2)
              }
            } else {
              welcomeImage = new WelcomeCanvas()
               .setBackground("https://i.pinimg.com/originals/07/28/dc/0728dc400eca09632215055ff003d8bf.gif")
               .setGIF(true)
               .setAvatar(member.user.displayAvatarURL({ format: "png" }))
               .setName(member.user.username)
               .setDiscriminator(member.user.discriminator)
               .setBlur(2)
            }

            const attachment = new Discord.MessageAttachment(
              imageData
            );

            if(findMemberAddModeration.welcomeChannelMessage){
              welcomeMsg = findMemberAddModeration.welcomeChannelMessage;
              welcomeMsg = welcomeMsg.replace('$user', `<@${member.user.id}>`);

              if(findWelcomeImage){
                if(findWelcomeImage.setGif){
                  welcome_channel.send({
                      files: [ new Discord.MessageAttachment(await welcomeImage.generate(), "welcome.gif") ]
                  });
                } else{
                  welcome_channel.send({content: welcomeMsg, files: [attachment]});
                }
              } else{
                welcome_channel.send({content: welcomeMsg, files: [attachment]});
              }

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
              logChannel.send(`Missing Access -> Can't grant <@${member.user.id}> join member role. Make sure my role is above granting role`);
            }

            member.user.send(`You didnt get default join role in ${member.guild.name}. Please talk to server admins for this issue`)
            .catch((err) => client.error(`${err}`));
          });
        }
   } catch(error){
     return console.error(error);
   }
 };
