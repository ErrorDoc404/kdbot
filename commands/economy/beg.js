const { MessageEmbed } = require("discord.js");
const Economy = require("../../mongoose/database/schemas/Economy");
const empty = require('is-empty');
const ms = require("parse-ms");

module.exports = {
  name: "beg",
  description: "Beg to get some coins",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["begging"],
  category: "economy",
  run: async (client, message, { GuildDB }) => {
    var member = message.author;

    let timeout = 60000;
    let amount = Math.floor(Math.random() * 20);
    try{
      const findEconomy = await Economy.findOne({guildId: message.guild.id, userId: member.id });
      if(findEconomy !== null && timeout - (Date.now() - findEconomy.begTime) > 0){
          let time = ms(timeout - (Date.now() - findEconomy.begTime));
      
          let timeEmbed = new MessageEmbed()
              .setColor("#FFFFFF")
              .setDescription(`You've already begged recently\n\nBeg again in ${time.minutes}m ${time.seconds}s `);
          message.channel.send({embeds: [timeEmbed]})
      }else if(findEconomy !== null && timeout - (Date.now() - findEconomy.begTime) < 0){
          totalAmount = findEconomy.cash + amount;
          const updateEconomy = await Economy.findOneAndUpdate({guildId: message.guild.id, userId: member.id },{
              cash: totalAmount,
              begTime: Date.now()
          });
          let moneyEmbed = new MessageEmbed()
              .setColor("#FFFFFF")
              .setDescription(`You've begged and received \`⌘ ${amount} coins\``);
          message.channel.send({embeds: [moneyEmbed]});
      } else {
        const newEconomy = await Economy.create({
          guildId: message.guild.id,
          userId: message.author.id,
          cash: amount,
          begTime: Date.now()
        });

        if(newEconomy){
          let moneyEmbed = new MessageEmbed()
              .setColor("#FFFFFF")
              .setDescription(`You've begged and received \`⌘ ${amount} coins\``);
          message.channel.send({embeds: [moneyEmbed]});
        };
      }
    }catch (err){
        console.log(err);
    }
  },
  SlashCommand: {
    run: async (client, interaction, args, { GuildDB }) => {
      var member = interaction.user;
      var guild = GuildDB;
  
      let timeout = 60000;
      let amount = Math.floor(Math.random() * 20);
      try{
        const findEconomy = await Economy.findOne({guildId: guild.guildId, userId: member.id });
        if(findEconomy !== null && timeout - (Date.now() - findEconomy.begTime) > 0){
            let time = ms(timeout - (Date.now() - findEconomy.begTime));
        
            let timeEmbed = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You've already begged recently\n\nBeg again in ${time.minutes}m ${time.seconds}s `);
            return interaction.reply({embeds: [timeEmbed]}).catch((err) => {client.error(err)});
        }else if(findEconomy !== null && timeout - (Date.now() - findEconomy.begTime) < 0){
            totalAmount = findEconomy.cash + amount;
            const updateEconomy = await Economy.findOneAndUpdate({guildId: guild.guildId, userId: member.id },{
                cash: totalAmount,
                begTime: Date.now()
            });
            let moneyEmbed = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You've begged and received \`⌘ ${amount} coins\``);
            return interaction.reply({embeds: [moneyEmbed]}).catch((err) => {client.error(err)});
        } else {
          const newEconomy = await Economy.create({
            guildId: guild.guildId,
            userId: interaction.user.id,
            cash: amount,
            begTime: Date.now()
          });
  
          if(newEconomy){
            let moneyEmbed = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You've begged and received \`⌘ ${amount} coins\``);
            return interaction.reply({embeds: [moneyEmbed]}).catch((err) => {client.error(err)});
          };
        }
      }catch (err){
          console.log(err);
      }
    },
  }
};