const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');
const { DiscordTogether } = require('discord-together');


module.exports = {
    name: "spellcast",
    description: "Starts a spellcast Together session",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "activity",
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {require("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        client.discordTogether = new DiscordTogether(client);
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **You must be in a voice channel to play something!**");
        if(!message.member.voice.channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE"))return client.sendTime(message.channel, "❌ | **Bot doesn't have Create Invite Permission**");

        client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'spellcast').then(async invite => {
            let embed = new MessageEmbed()
                .setAuthor({name: "spellcast"})
                .setColor("#FF0000")
                .setDescription(`
                    You can Play spellcast with your friends in a Voice Channel. Click *Join spellcast* to join in!
                    __**[Join spellcast](${invite.code})**__
                    ⚠ **Note:** This only works in Desktop
                    `)
            message.channel.send({embeds: [embed]})
        });
    },
    SlashCommand: {
        options: [
        ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
        run: async (client, interaction, args, { GuildDB }) => {
            client.discordTogether = new DiscordTogether(client);
            const guild = client.guilds.cache.get(interaction.guildId);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return interaction.reply("❌ | You must be in a voice channel to use this command.").catch((err)=> {client.warn(err)});
            if(!member.voice.channel.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE")) return interaction.reply("❌ | **Bot doesn't have Create Invite Permission**").catch((err)=> {client.warn(err)});

            client.discordTogether.createTogetherCode(member.voice.channel.id, 'spellcast').then(async invite => {
                let embed = new MessageEmbed()
                    .setAuthor({name: "spellcast"})
                    .setColor("#FF0000")
                    .setDescription(`
                        You can Play spellcast with your friends in a Voice Channel. Click *Join spellcast* to join in!
                        __**[Join spellcast](${invite.code})**__
                        ⚠ **Note:** This only works in Desktop & Server booster level 1
                        `)
                return interaction.reply({embeds: [embed]}).catch((err)=> {client.warn(err)});
            });


        },
    },
};