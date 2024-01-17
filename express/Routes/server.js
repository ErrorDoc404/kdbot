const client = require("../../");
const api = require("express").Router();
const { Auth } = require("../Middlewares");
const Module = require("../../mongoose/database/schemas/Module");

api.get('/:id', Auth, async (req, res) => {
    try {
        if (req.user) {

            const guildModule = await Module.findOne({ guildId: req.params.id });
            console.log(guildModule);
            return res.send(guildModule);
        } else {
            return res.send(false);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = api;