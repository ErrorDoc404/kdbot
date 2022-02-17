const { MessageEmbed } = require("discord.js");
const Economy = require("../mongoose/database/schemas/Economy");
const empty = require('is-empty');

module.exports = {
    name: "balance",
    description: "Check Balance of your Passbook",
    usage: "[user]",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["bal"],
    run: async (client, message, args, { GuildDB }) => {
        if(!empty(args)){ 
            member = message.mentions.members.first();
            member = member.user;
        }
        else member = message.author;
        try{
            const findEconomy = await Economy.findOne({guildId: message.guild.id, userId: member.id });
            if(findEconomy){
                const msg = new MessageEmbed()
                    .setColor("#FFFFFF")
                    .setDescription(`**${member.username}'s Balance**\n\nPocket: \`⌘ ${findEconomy.cash} coins\`\nBank: \`⌘ ${findEconomy.bank} coins\``);

                message.channel.send({embeds: [msg]});
            } else {
              const newEconomy = await Economy.create({
                guildId: message.guild.id,
                userId: message.author.id,
              });

              if(newEconomy){
                const msg = new MessageEmbed()
                    .setColor("#FFFFFF")
                    .setDescription(`**${member.username}'s Balance**\n\nPocket: \`⌘ ${newEconomy.cash} coins\`\nBank: \`⌘ ${newEconomy.bank} coins\``);

                message.channel.send({embeds: [msg]});
              };
            }
          }catch (err){
            console.log(err);
          }
    },
};