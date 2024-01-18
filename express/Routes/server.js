const client = require("../../");
const { PermissionsBitField } = require('discord.js');
const api = require("express").Router();
const { Auth } = require("../Middlewares");
const Module = require("../../mongoose/database/schemas/Module");
const GuildConfig = require("../../mongoose/database/schemas/GuildConfig");

api.get('/:id', Auth, async (req, res) => {
    try {
        if (req.user) {

            const guildModule = await Module.findOne({ guildId: req.params.id });
            return res.send(guildModule);
        } else {
            return res.send(false);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

api.get('/admins/:id', Auth, async (req, res) => {
    try {
        if (req.user) {
            const guildId = req.params.id;
            const guild = client.guilds.cache.get(guildId);

            if (guild) {
                // Fetch all members to ensure complete data
                await guild.members.fetch();

                // Filter members with ADMINISTRATOR permission and exclude the bot
                const adminMembers = guild.members.cache.filter(
                    member => member.permissions.has(PermissionsBitField.Flags.ManageGuild) && !member.user.bot
                );

                let adminUser = [];

                adminMembers.map((am) => {
                    adminUser.push({
                        user: am.user
                    });
                });

                // Convert adminMembers to an array
                const adminMembersArray = [...adminUser];

                // If there are more than 5 members, take only the first 5
                const slicedAdminMembers = adminMembersArray.slice(0, 5);

                // If there are less than 5 members, add dummy data
                const numberOfDummyMembers = 5 - slicedAdminMembers.length;
                for (let i = 0; i < numberOfDummyMembers; i++) {
                    slicedAdminMembers.push({
                        user: {
                            id: 'na',
                            bot: false,
                            system: false,
                            flags: { bitfield: 256 },
                            username: 'Unallocated',
                            discriminator: 'na',
                            avatar: 'na'
                        }
                    });
                }

                return res.send(slicedAdminMembers);
            } else {
                return res.status(404).send('Guild not found');
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

api.get('/guilds/:id', Auth, async (req, res) => {
    try {
        const guildConfig = await GuildConfig.findOne({ guildId: req.params.id });
        if (guildConfig) {
            return res.send(guildConfig);
        } else {
            return res.send(false);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});




module.exports = api;