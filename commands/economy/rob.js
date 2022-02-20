const {MessageEmbed} = require('discord.js');
const Economy = require("../../mongoose/database/schemas/Economy");
const ms = require("parse-ms");

module.exports = {
    name: "rob",
    description: "rob someone in your guild",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["robbed"],
    category: "economy",
    run: () => {

    },
    SlashCommand: {
        options: [
            {
                name: "user",
                description: "mention user",
                type: 6,
                required: true,
            },
        ],
        run: async (client, interaction, args, { GuildDB }) => {
            const target = args.user;
            const member = interaction.user;
            const guild = GuildDB;

            const timer = 300000;

            const targetBank = await Economy.findOne({guildId: guild.guildId ,userId: target.id});
            const memberBank = await Economy.findOne({guildId: guild.guildId ,userId: member.id});

            if(!targetBank || !memberBank){
                const embed = new MessageEmbed();
                embed.setDescription(`${target.username} dose not have anything to rob`);

                return interaction.reply({embeds: [embed]}).catch((err) => {client.error(err)});
            } if(memberBank){
                if(memberBank.cash < 200){
                    const embed = new MessageEmbed();
                    embed.setDescription(`You need atleast \`⌘ 500 coins\` in your pocket to rob someone`);

                    return interaction.reply({embeds: [embed]}).catch((err) => {client.error(err)});
                }
                else if(targetBank.cash == 0){
                    const embed = new MessageEmbed();
                    embed.setDescription(`${target.username} does not have anything you can rob`);

                    return interaction.reply({embeds: [embed]}).catch((err) => {client.error(err)});
                } else if(timer - (Date.now() - memberBank.robTime) > 0){
                    let time = ms(timer - (Date.now() - memberBank.robTime));
            
                    let timeEmbed = new MessageEmbed()
                        .setColor("#FFFFFF")
                        .setDescription(`You've already Robbed Somone\n\nRob someone again in ${time.minutes}m ${time.seconds}s `);

                    return interaction.reply({embeds: [timeEmbed]}).catch((err) => {client.error(err)});
                }else {
                    const cash = parseInt(targetBank.cash);
                    const amount = Math.floor(Math.random() * cash);
                    console.log(amount);

                    await Economy.findOneAndUpdate({guildId: targetBank.guildId, userId: targetBank.userId},{
                        cash: parseInt(targetBank.cash) - amount
                    });

                    await Economy.findOneAndUpdate({guildId: memberBank.guildId, userId: memberBank.userId},{
                        cash: parseInt(memberBank.cash) + amount,
                        robTime: Date.now()
                    });

                    const embed = new MessageEmbed();
                    embed.setDescription(`You robbed ${target.username} and got away with \`⌘ ${amount} coins\``);

                    return interaction.reply({embeds: [embed]}).catch((err) => {client.error(err)});
                }
            }

            return interaction.reply('rob command');
        }
    }
}