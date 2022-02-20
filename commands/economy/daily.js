const { MessageEmbed } = require("discord.js");
const Economy = require("../../mongoose/database/schemas/Economy");
const empty = require('is-empty');
const ms = require("parse-ms");

module.exports = {
    name: "daily",
    description: "Daily Reward",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["day"],
    category: "economy",
    run: async (client, message, { GuildDB }) => {
        var member = message.author;

        let timeout = 86400000;
        let amount = Math.floor(Math.random() * 100) + 200;
        try{
            const findEconomy = await Economy.findOne({guildId: message.guild.id, userId: member.id });
            if(findEconomy !== null && timeout - (Date.now() - findEconomy.dailyTime) > 0){
                let time = ms(timeout - (Date.now() - findEconomy.dailyTime));
            
                let timeEmbed = new MessageEmbed()
                    .setColor("#FFFFFF")
                    .setDescription(`You've already collected your daily reward\n\nCollect it again in ${time.hours}h ${time.minutes}m ${time.seconds}s `);
                message.channel.send({embeds: [timeEmbed]})
            }else if(findEconomy !== null && timeout - (Date.now() - findEconomy.dailyTime) < 0){
                totalAmount = findEconomy.cash + amount;
                const updateEconomy = await Economy.findOneAndUpdate({guildId: message.guild.id, userId: member.id },{
                    cash: totalAmount,
                    dailyTime: Date.now()
                });
                let moneyEmbed = new MessageEmbed()
                    .setColor("#FFFFFF")
                    .setDescription(`You've collected your daily reward of \`⌘ ${amount} coins\``);
                message.channel.send({embeds: [moneyEmbed]});
            } else {
              const newEconomy = await Economy.create({
                guildId: message.guild.id,
                userId: message.author.id,
                cash: amount,
                dailyTime: Date.now()
              });

              if(newEconomy){
                let moneyEmbed = new MessageEmbed()
                    .setColor("#FFFFFF")
                    .setDescription(`You've collected your daily reward of \`⌘ ${amount} coins\``);
                message.channel.send({embeds: [moneyEmbed]});
              };
            }
          }catch (err){
            console.log(err);
          }
    },
    // SlashCommand: {
    //   run: async () => {
        
    //   }
    // }
};