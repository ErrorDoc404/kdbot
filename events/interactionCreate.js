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
    const args = interaction.options;

    let cmd = client.commands.get(command);
    if(!cmd) return;
    if (cmd.SlashCommand && cmd.SlashCommand.run)
        cmd.SlashCommand.run(client, interaction, args, { GuildDB });

    client.CommandsRan++;
};