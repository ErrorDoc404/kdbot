const { MessageEmbed } = require("discord.js");
const Level = require("../../mongoose/database/schemas/Level");

module.exports = {
  name: "leaderboard",
  description: "Information about the Leaderboard",
  usage: "",
  category: "level",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["lb", "ranklb"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {

    let Embed = new MessageEmbed()
      .setTitle(
        `Leaderboard of ${message.guild.name}`,
      )
      .setColor(client.config.EmbedColor)

    const leaderboards = Level.find({guildId: message.guild.id}).sort({totalXp: -1});
    var i = 1;

    (await leaderboards).forEach(lb => {
        if(i<=9){
            var member = message.guild.members.cache.get(lb.userID);
            if(!member) {return true;}
            else member = member.user;
            Embed.addField(`${i}. ${member.username}`, `┕\`Xp: ${lb.totalXp}\``, true);
            i++;
        }
    });



    // let Commands = client.commands.map(
    //   (cmd) =>
    //   Embed.addField(`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${cmd.name}`, `${cmd.description}`, true)
    //     // `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
    //     //   cmd.name
    //     // }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    // );

    Embed.addField(`Version`, ` v${require("../../package.json").version}`, false);


    message.channel.send({embeds: [Embed]});
  }
};