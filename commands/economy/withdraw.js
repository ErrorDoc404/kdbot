const { MessageEmbed } = require("discord.js");
const Economy = require("../../mongoose/database/schemas/Economy");
const empty = require('is-empty');
const ms = require("parse-ms");

module.exports = {
    name: "withdraw",
    description: "Withdraw Money to Bank",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["wd"],
    category: "economy",
    run: async (client, message, args, { GuildDB }) => {
        let member = message.author;
        var amount = args[0];
        const findEconomy = await Economy.findOne({guildId: message.guild.id, userId: member.id});
        if(findEconomy.bank == 0){
            let embedbank = new MessageEmbed()
                .setColor('#FFFFFF')
                .setDescription("You don't have any money to withdraw");
            
            message.channel.send({embeds: [embedbank]});
        }
        else if(amount == 'all'){
            let cash = findEconomy.bank + findEconomy.cash;
            let bank = 0;

            await Economy.findOneAndUpdate({guildId: message.guild.id, userId: member.id},{
                cash: cash,
                bank: bank
            });
                
            let wdall = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You have withdraw \`⌘ ${findEconomy.bank} coins\` from your bank`);
            message.channel.send({embeds: [wdall]});
        } else if(amount <= findEconomy.bank && amount > 0){
            let bank = findEconomy.bank - amount;
            let cash = parseInt(findEconomy.cash) + parseInt(amount);

            await Economy.findOneAndUpdate({guildId: message.guild.id, userId: member.id},{
                cash: cash,
                bank: bank
            });

            let depamt = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You have withdraw \`⌘ ${amount} coins\` from your bank`);

            message.channel.send({embeds: [depamt]});
        } else if(amount > findEconomy.cash){
            let insuf = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You don't have sufficient balance to transfer`);

            message.channel.send({embeds: [insuf]});
        } else if(amount < 0 ){
            let neg = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`You can't withdraw negative money`);

            message.channel.send({embeds: [neg]});
        } else {
            let argument = new MessageEmbed()
                .setColor("#FFFFFF")
                .setDescription(`Specify an amount to deposit`);

            message.channel.send({embeds: [argument]});
        }
    },
    // SlashCommand: {
    //     options: [
    //         {
    //             name: "amount",
    //             description: "how much you want to deposit",
    //             value: "amount",
    //             type: 4,
    //             required: false,
    //         },
    //     ],
    //     run : async (client, interaction, args, {GuildDB}) => {
            
    //     }
    // }
};