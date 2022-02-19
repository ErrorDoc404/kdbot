const { Client } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

/**
 * Register slash commands for a guild
 * @param {require("../structures/DiscordMusicBot")} client
 * @param {string} guild
 */

module.exports = (client) => {

    const commands = [];
    const categories = fs.readdirSync(__dirname + '/../commands/');
      categories.filter((cat) => !cat.endsWith('.js')).forEach((cat) => {
        const files = fs.readdirSync(__dirname + `/../commands/${cat}/`).filter((f) =>
          f.endsWith('.js')
        );
        files.forEach(async (file) => {
            let cmd = require(__dirname + `/../commands/${cat}/` + file);
            if (!cmd.SlashCommand || !cmd.SlashCommand.run) return;

            let dataStuff = {
                name: cmd.name,
                description: cmd.description,
                options: cmd.SlashCommand.options,
            };

            commands.push(dataStuff);
        })
    });

    const rest = new REST({ version: '9' }).setToken(client.config.Token);

    (async () => {
        try {
            client.log('Started refreshing application Slash commands.');
    
            await rest.put(
                Routes.applicationCommands(client.config.Id),
                { body: commands },
            );
    
            client.log('Successfully reloaded application SLash commands.');
        } catch (error) {
            client.error(error);
        }
    })();
};