const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const ConfigFetcher = require('../config.js');
const Express = require("express");
const Logger = require("./Logger");
const logger = new Logger();
const https = require("https");
const http = require("http");
const fs = require('fs');
const path = require("path");
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const GuildConfig = require("../mongoose/database/schemas/GuildConfig");

class DiscordModerationBot extends Client {

    constructor(
        props = {
            partials: [
                Partials.Channel, // for text channel
                Partials.GuildMember, // for guild member
                Partials.User, // for discord user
            ],
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        }

    ) {
        super(props);

        this.config = ConfigFetcher;

        this.commands = new Collection();
        this.CommandRan = 0;

        //loading componenets
        this.LoadEvents();
        this.LoadCommands();

        //creating web poartal
        this.server = Express();
        this.http = http.createServer(this.server);
        this.server.use('/', require('../Express'));
        // this.io = new Server(this.http);
    }

    LoadEvents() {
        fs.readdir('./events/', async (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith('.js')) return;
                const evt = require(`../events/${file}`);
                let evtName = file.split('.')[0];
                this.on(evtName, evt.bind(null, this));
                logger.events(`Loaded event '${evtName}'`);
            });
        });
    }

    LoadCommands() {
        const categories = fs.readdirSync(__dirname + '/../commands/');
        categories.filter((cat) => !cat.endsWith('.js')).forEach((cat) => {
            const files = fs.readdirSync(__dirname + `/../commands/${cat}/`).filter((f) =>
                f.endsWith('.js')
            );
            files.forEach((file) => {
                let cmd = require(__dirname + `/../commands/${cat}/` + file);
                if (!cmd.name || !cmd.description || !cmd.run) {
                    return this.warn(`unable to load command: ${file.split(".")[0]}, Reason: File doesn't had run/name/desciption`);
                }
                let cmdName = cmd.name.toLowerCase();
                this.commands.set(cmdName, cmd);
                logger.commands(`Loaded command '${cmdName}'`);
            })
        });
    }

    log(Text) {
        logger.log(Text);
    }

    warn(Text) {
        logger.warn(Text);
    }

    error(Text) {
        logger.error(Text);
    }

    build(token) {
        if (token == 'youshallnotpass') {
            this.warn('Server is starting');
            this.login(this.config.Token);
            this.log('Server started...');
            if (this.config.ExpressServer) {
                this.http.listen(this.config.httpPort, () =>
                    this.log(`Web HTTP Server has been started at ${this.config.httpPort}`)
                );
            }
        } else this.error('Invalid Build Token');
    }

    async GetGuild(GuildID) {
        return new Promise(async (res, rej) => {
            const findGuildConfig = await GuildConfig.findOne({ guildId: GuildID });
            res(findGuildConfig);
        });
    }

    async MongooseConnect() {
        mongoose.set('strictQuery', true);
        await mongoose.connect(this.config.mongooseURL)
            .then(data => {
                this.warn(`Connected to ${data.connection.host}:${data.connection.port} database: ${data.connection.name}`);
            })
            .catch(err => { this.warn(err) });
    }

    RegisterSlashCommands() {
        require("./SlashCommand")(this);
    }
}

module.exports = DiscordModerationBot;