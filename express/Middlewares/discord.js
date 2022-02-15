const router = require('express').Router();
// const {getBotGuilds} = require('../utils/api');
// const User = require('../database/schemas/User');

const fetch = require('node-fetch');

const TOKEN = process.env.DASHBOARD_BOT_TOKEN;

async function getBotGuilds(){
  const response = await fetch('http://discord.com/api/v8/users/@me/guilds', {
    method: 'GET',
    header: {
      Authorization: `Bot ${TOKEN}`
    }
  });
  return response.json();
}

router.get('/guilds', async (req, res ) => {
  const guilds = await getBotGuilds();
  if(req.user){
    console.log(req.user.guilds);
    res.send(req.user.guilds);
  }
});

module.exports = router;
