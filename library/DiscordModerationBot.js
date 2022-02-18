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
        var https_options = {
            key: fs.readFileSync('./cert/private.key', 'utf8'),
            cert: fs.readFileSync('./cert/certificate.crt', 'utf8')
        };
        this.server = Express();
        this.http = http.createServer(function (req, res) {
            res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
            res.end();
        });
        this.https = https.createServer(https_options, this.server);
        this.server.use('/', require('../express'));
        this.io = new Server(this.https);
        require('../express/socket')(this.io);

        this.LoadEvents();
        this.LoadCommands();

        let client = this;

        // this.ws.on("INTERACTION_CREATE", async (interaction) => {
        //   let GuildDB = await this.GetGuild(interaction.guild_id);
    
        //   //Initialize GuildDB
        //   if (!GuildDB) {
        //     await this.database.guild.set(interaction.guild_id, {
        //       prefix: this.botconfig.DefaultPrefix,
        //       DJ: null,
        //     });
        //     GuildDB = await this.GetGuild(interaction.guild_id);
        //   }
    
        //   const command = interaction.data.name.toLowerCase();
        //   const args = interaction.data.options;
    
        //   //Easy to send respnose so ;)
        //   interaction.guild = await this.guilds.fetch(interaction.guild_id);
        //   interaction.send = async (message) => {
        //     return await this.api
        //       .interactions(interaction.id, interaction.token)
        //       .callback.post({
        //         data: {
        //           type: 4,
        //           data:
        //             typeof message == "string"
        //               ? { content: message }
        //               : message.type && message.type === "rich"
        //               ? { embeds: [message] }
        //               : message,
        //         },
        //       });
        //   };
    
        //   let cmd = client.commands.get(command);
        //   if (cmd.SlashCommand && cmd.SlashCommand.run)
        //     cmd.SlashCommand.run(this, interaction, args, { GuildDB });
        // });

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
      //economy
      let EconomyDir = path.join(__dirname, "..", "commands", "economy");
      fs.readdir(EconomyDir, (err, files) => {
        if(err) this.error(err);
        files.forEach((file) => {
          let cmd = require(EconomyDir + "/" + file);
          if (!cmd.name || !cmd.description || !cmd.run){
            return this.warn(`unable to load command: ${file.split(".")[0]}, Reason: File doesn't had run/name/desciption`);
          }
          let cmdName = file.split('.')[0].toLowerCase();
          this.commands.set(cmdName, cmd);
          logger.commands(`Loaded command '${cmdName}'`);
        });
      });

      //mod
      let ModDir = path.join(__dirname, "..", "commands", "mods");
      fs.readdir(ModDir, (err, files) => {
        if(err) this.error(err);
        files.forEach((file) => {
          let cmd = require(ModDir + "/" + file);
          if (!cmd.name || !cmd.description || !cmd.run){
            return this.warn(`unable to load command: ${file.split(".")[0]}, Reason: File doesn't had run/name/desciption`);
          }
          let cmdName = file.split('.')[0].toLowerCase();
          this.commands.set(cmdName, cmd);
          logger.commands(`Loaded command '${cmdName}'`);
        });
      });

      //Rank
      let RankDir = path.join(__dirname, "..", "commands", "rank");
      fs.readdir(RankDir, (err, files) => {
        if(err) this.error(err);
        files.forEach((file) => {
          let cmd = require(RankDir + "/" + file);
          if (!cmd.name || !cmd.description || !cmd.run){
            return this.warn(`unable to load command: ${file.split(".")[0]}, Reason: File doesn't had run/name/desciption`);
          }
          let cmdName = file.split('.')[0].toLowerCase();
          this.commands.set(cmdName, cmd);
          logger.commands(`Loaded command '${cmdName}'`);
        });
      });

      //Other
      let OtherDir = path.join(__dirname, "..", "commands", "others");
      fs.readdir(OtherDir, (err, files) => {
        if(err) this.error(err);
        files.forEach((file) => {
          let cmd = require(OtherDir + "/" + file);
          if (!cmd.name || !cmd.description || !cmd.run){
            return this.warn(`unable to load command: ${file.split(".")[0]}, Reason: File doesn't had run/name/desciption`);
          }
          let cmdName = file.split('.')[0].toLowerCase();
          this.commands.set(cmdName, cmd);
          logger.commands(`Loaded command '${cmdName}'`);
        });
      });

      //Utilities
      let UtilDir = path.join(__dirname, "..", "commands", "utilities");
      fs.readdir(UtilDir, (err, files) => {
        if(err) this.error(err);
        files.forEach((file) => {
          let cmd = require(UtilDir + "/" + file);
          if (!cmd.name || !cmd.description || !cmd.run){
            return this.warn(`unable to load command: ${file.split(".")[0]}, Reason: File doesn't had run/name/desciption`);
          }
          let cmdName = file.split('.')[0].toLowerCase();
          this.commands.set(cmdName, cmd);
          logger.commands(`Loaded command '${cmdName}'`);
        });
      });
    }

    build(token){
        if(token == 'youshallnotpass'){
            this.warn('Server is starting');
            this.login(this.config.Token);
            this.log('Server started...');
            if (this.config.ExpressServer) {
            this.https.listen(this.config.httpsPort, (data) =>
                this.log(`Web HTTPS Server has been started at ${this.config.httpsPort}`)
            );
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
      this.guilds.cache.forEach((guild) => {
        require("./SlashCommand")(this, guild.id);
      });
    }

}

module.exports = DiscordModerationBot;