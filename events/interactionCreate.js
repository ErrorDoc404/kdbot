const { MessageEmbed } = require('discord.js');

module.exports = async (client, interaction) => {
    let GuildDB = await client.GetGuild(interaction.guildId);
    if(!GuildDB) return console.log('Guild not Found');

    //Initialize GuildDB
    if (!GuildDB) {
        await client.database.guild.set(interaction.guildId, {
            prefix: client.config.prefix,
            modRole: null,
        });
        GuildDB = await client.GetGuild(interaction.guildId);
    }

    const command = interaction.commandName;

    let cmd = client.commands.get(command);
    if(!cmd) return;

    const args = interaction.options._hoistedOptions[0];

    let embed = new MessageEmbed()
      .setTitle("Premuim Required")
      .setColor("RED")
      .setDescription("Missing Permissions: You need the Special role to access this command. Ask Guild Admins for help")
      .setFooter(
        "If you think this as a bug, please report it in the support server!"
      );

    if(cmd.permissions.member == "ADMINISTRATOR" && !interaction.member.permissions.has('ADMINISTRATOR'))
      return interaction.reply({embeds: [embed]}).catch((err) => {client.error(err)});

    if (cmd.SlashCommand && cmd.SlashCommand.run)
        cmd.SlashCommand.run(client, interaction, args, { GuildDB });

    client.CommandsRan++;
};
