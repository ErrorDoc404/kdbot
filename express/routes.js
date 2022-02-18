const api = require("express").Router();
const { Collection } = require("discord.js");
const { join } = require("path");
const config = require("../config");
const Auth = require("./Middlewares/Auth");
const fs = require("fs");

let EconomyDir = join(__dirname, "..", "commands", "economy");
let ModDir = join(__dirname, "..", "commands", "mods");
let RankDir = join(__dirname, "..", "commands", "rank");
let OtherDir = join(__dirname, "..", "commands", "others");
let UtilDir = join(__dirname, "..", "commands", "utilities");
let Commands = [];

fs.readdir(EconomyDir, (err, files) => {
  if (err) console.log(err);
  else
    files.forEach((file) => {
      let cmd = require(EconomyDir + "/" + file);
      if (!cmd.name || !cmd.description || !cmd.run) return;
      Commands.push({
        name: cmd.name,
        aliases: cmd.aliases,
        usage: cmd.usage,
        description: cmd.description,
      });
    });
});

fs.readdir(ModDir, (err, files) => {
  if (err) console.log(err);
  else
    files.forEach((file) => {
      let cmd = require(ModDir + "/" + file);
      if (!cmd.name || !cmd.description || !cmd.run) return;
      Commands.push({
        name: cmd.name,
        aliases: cmd.aliases,
        usage: cmd.usage,
        description: cmd.description,
      });
    });
});

fs.readdir(RankDir, (err, files) => {
  if (err) console.log(err);
  else
    files.forEach((file) => {
      let cmd = require(RankDir + "/" + file);
      if (!cmd.name || !cmd.description || !cmd.run) return;
      Commands.push({
        name: cmd.name,
        aliases: cmd.aliases,
        usage: cmd.usage,
        description: cmd.description,
      });
    });
});

fs.readdir(OtherDir, (err, files) => {
  if (err) console.log(err);
  else
    files.forEach((file) => {
      let cmd = require(OtherDir + "/" + file);
      if (!cmd.name || !cmd.description || !cmd.run) return;
      Commands.push({
        name: cmd.name,
        aliases: cmd.aliases,
        usage: cmd.usage,
        description: cmd.description,
      });
    });
});

fs.readdir(UtilDir, (err, files) => {
  if (err) console.log(err);
  else
    files.forEach((file) => {
      let cmd = require(UtilDir + "/" + file);
      if (!cmd.name || !cmd.description || !cmd.run) return;
      Commands.push({
        name: cmd.name,
        aliases: cmd.aliases,
        usage: cmd.usage,
        description: cmd.description,
      });
    });
});

api.get("/", (req, res) => {
  res.sendFile(join(__dirname, "..", "webview", "index.html"));
});

api.get("/dashboard", Auth, (req, res) => {
  res.sendFile(join(__dirname, "..", "webview", "dashboard.html"));
});

api.get("/servers", Auth, (req, res) => {
  res.sendFile(join(__dirname, "..", "views", "servers.html"));
});

api.get("/server/:id", Auth, (req, res) => {
  if (!req.user.guilds.find((x) => x.id == req.params.id))
    return res.redirect("/servers");
  res.sendFile(join(__dirname, "..", "views", "server.html"));
});

api.get("/server/:id/music", Auth, (req, res) => {
  if (!req.user.guilds.find((x) => x.id == req.params.id))
    return res.redirect("/servers");
  res.sendFile(join(__dirname, "..", "views", "music.html"));
});

api.get("/api/info", (req, res) => {
  res.send({
    ClientID: config.ClientID,
    Permissions: config.Permissions,
    Scopes: config.Scopes,
    Website: config.Website,
    CallbackURL: config.CallbackURL,
  });
});

api.get("/api/commands", (req, res) => {
  res.send({ commands: Commands });
});

api.get("/logout", (req, res) => {
  if (req.user) req.logout();
  res.redirect("/");
});

module.exports = api;
