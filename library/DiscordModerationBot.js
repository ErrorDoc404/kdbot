const { Client, Collection, MessageEmbed } = require('discord.js');
const ConfigFetcher = require('../config');
const Express = require("express");
const Logger = require("./Logger");
const logger = new Logger();
const https = require("https");
const http = require("http");
const fs = require('fs');
const path = require("path");
const { Server } = require("socket.io");
const GuildConfig = require("../mongoose/database/schemas/GuildConfig");

class DiscordModerationBot extends Client {

    constructor(props = {intents: [32767]}){
        super(props);

        // Load Config File
        this.config = ConfigFetcher;

        //creating sets
        this.commands = new Collection();
        /**@type {Collection<string, import("./SlashCommand")} */
        this.SlashCommands = new Collection();
        this.CommandsRan = 0;

        //Creating Web portal
        // var https_options = {
        //     key: fs.readFileSync('./cert/private.key', 'utf8'),
        //     cert: fs.readFileSync('./cert/certificate.crt', 'utf8')
        // };
        this.server = Express();
        // this.http = http.createServer(function (req, res) {
        //     res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        //     res.end();
        // });
        // this.https = https.createServer(https_options, this.server);
        this.http = http.createServer(this.server);
        this.server.use('/', require('../express'));
        this.io = new Server(this.https);
        require('../express/socket')(this.io);

        this.LoadEvents();
        this.LoadCommands();

    }

    log(Text){
        logger.log(Text);
    }

    warn(Text){
        logger.warn(Text);
    }

    error(Text){
        logger.error(Text);
    }

    LoadEvents(){
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

    LoadCommands(){
      const categories = fs.readdirSync(__dirname + '/../commands/');
      categories.filter((cat) => !cat.endsWith('.js')).forEach((cat) => {
        const files = fs.readdirSync(__dirname + `/../commands/${cat}/`).filter((f) =>
          f.endsWith('.js')
        );
        files.forEach((file) => {
          let cmd = require(__dirname + `/../commands/${cat}/` + file);
          if(!cmd.name || !cmd.description || !cmd.run){
            return this.warn(`unable to load command: ${file.split(".")[0]}, Reason: File doesn't had run/name/desciption`);
          }
          let cmdName = cmd.name.toLowerCase();
          this.commands.set(cmdName, cmd);
          logger.commands(`Loaded command '${cmdName}'`);
        })
      });
    }

    build(token){
        if(token == 'youshallnotpass'){
            this.warn('Server is starting');
            this.login(this.config.Token);
            this.log('Server started...');
            if (this.config.ExpressServer) {
            // this.https.listen(this.config.httpsPort, (data) =>
            //     this.log(`Web HTTPS Server has been started at ${this.config.httpsPort}`)
            // );
            this.http.listen(this.config.httpPort, () =>
                this.log(`Web HTTP Server has been started at ${this.config.httpPort}`)
            );
            }
        } else this.error('Invalid Build Token');
    }

    async GetGuild(GuildID) {
        return new Promise(async (res, rej) => {
            const findGuildConfig = await GuildConfig.findOne({guildId: GuildID });
            res(findGuildConfig);
        });
    }

    sendError(Channel, Error) {
        let embed = new MessageEmbed()
          .setTitle("An error occured")
          .setColor("RED")
          .setDescription(Error)
          .setFooter(
            "If you think this as a bug, please report it in the support server!"
          );

        Channel.send({embeds: [embed]});
    }

    premuimError(Channel, Error) {
        let embed = new MessageEmbed()
          .setTitle("Premuim Required")
          .setColor("RED")
          .setDescription(Error)
          .setFooter(
            "If you think this as a bug, please report it in the support server!"
          );

        Channel.send({embeds: [embed]});
    }

    sendTime(Channel, Message){
      let embed = new MessageEmbed()
          .setColor("RANDOM")
          .setDescription(Message)

        Channel.send({embeds: [embed]});
    }

    RegisterSlashCommands(){
      require("./SlashCommand")(this);
    }

}

module.exports = DiscordModerationBot;
