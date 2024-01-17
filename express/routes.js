const api = require("express").Router();
const { Collection } = require("discord.js");
const { join } = require("path");
const fs = require("fs");
const { Auth, Administrator } = require("./Middlewares");

api.get("/", (req, res) => {
    res.sendFile(join(__dirname, "..", "webview", "index.html"));
});

api.get("/admin", Auth, (req, res) => {
    res.sendFile(join(__dirname, "..", "webview", "dashboard.html"));
});

api.get("/server/:id", Auth, (req, res) => {
    res.sendFile(join(__dirname, "..", "webview", "server.html"));
})

module.exports = api;