const { MessageEmbed } = require("discord.js");
const Economy = require("../../mongoose/database/schemas/Economy");
const empty = require('is-empty');
const ms = require("parse-ms");

module.exports = {
    name: "deposit",
    description: "Deposit Money to Bank",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["dep"],
    category: "economy",
    run: async (client, message, args, { GuildDB }) => {
        let member = message.author;
        var amount = args[0];
        const findEconomy = await Economy.findOne({guildId: message.guild.id, userId: member.id});
        if(findEconomy.cash == 0){
            let embedbank = new MessageEmbed()
                .setColor('#FFFFFF')
                .setDescription("You don't have any money to deposit");
            
            message.channel.send({embeds: [embedbank]});
        }
        else if(amount == 'all'){
            let cash = 0;
            let bank = findEconomy.bank + findEconomy.cash;

            await Economy.findOneAndUpdate({guildId: message.guild.id, userId: member.id},{
                cash: cash,
                bank: bank
            });
                
            let depall = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You have deposited \`⌘ ${findEconomy.cash} coins\` into your bank`);
            message.channel.send({embeds: [depall]});
        } else if(amount <= findEconomy.cash && amount > 0){
            let cash = findEconomy.cash - amount;
            let bank = parseInt(findEconomy.bank) + parseInt(amount);

            await Economy.findOneAndUpdate({guildId: message.guild.id, userId: member.id},{
                cash: cash,
                bank: bank
            });

            let depamt = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You have deposited \`⌘ ${amount} coins\` into your bank`);

            message.channel.send({embeds: [depamt]});
        } else if(amount > findEconomy.cash){
            let insuf = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You don't have sufficient balance to transfer`);

            message.channel.send({embeds: [insuf]});
        } else if(amount < 0 ){
            let neg = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You can't deposit negative money`);

            message.channel.send({embeds: [neg]});
        } else {
            let argument = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`Specify an amount to deposit`);

            message.channel.send({embeds: [argument]});
        }
    },
};