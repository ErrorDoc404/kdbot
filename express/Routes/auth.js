const client = require("../../");
const api = require("express").Router();
const Economy = require("../../mongoose/database/schemas/Economy");

api.get('/', async (req, res ) => {
    if(req.user)
        return res.send(req.user);
    else return res.send(false);
});

api.get('/guilds', async (req, res ) => {
    if(req.user)
        return res.send(req.user.guilds);
    else return res.send(false);
});

api.get('/passbook', async (req, res ) => {
    if(req.user){
        var userBank = await Economy.find({userId: req.user.discordId});
        userBank.map((bank) => {
            bank.name = 'pikachu';
            console.log(bank);
            return bank;
        });
        return await res.send(userBank);
    }
    else return res.send(false);
});

module.exports = api;