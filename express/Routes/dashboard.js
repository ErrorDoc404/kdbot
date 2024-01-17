const client = require("../../");
const api = require("express").Router();
const { Auth } = require("../Middlewares");

// Get user information
api.get('/', Auth, async (req, res) => {
    try {
        if (req.user) {
            return res.send(req.user);
        } else {
            return res.send(false);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

// Get guild information
api.get('/guilds', async (req, res) => {
    try {
        if (req.user) {
            return res.send(req.user.guilds);
        } else {
            return res.send(false);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

// Get bot information
api.get('/bot', async (req, res) => {
    try {
        client.ping = client.ws.ping;
        return res.send(client);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = api;