require('dotenv').config();

module.exports = {
    Id: process.env.Discord_ClientID,
    prefix: process.env.PREFIX || '!',
    Admins: ["UserID", "UserID"],
    buildToken: process.env.BUILD_TOKEN || 'build token',
    Token: process.env.TOKEN || 'bot token',
    ExpressServer: true,
    httpPort: process.env.HTTP_PORT || '80',
    httpsPort: process.env.HTTPS_PORT || '443',
    CallbackURL: process.env.CALLBACK_URL || '',

    presence: {
        status: "idle", // online, idle, and dnd(invisible too but it make people think the bot is offline)
        activities: [
            {
              name: "Server", //Status Text
              type: "WATCHING", // PLAYING, WATCHING, LISTENING, STREAMING
            },
        ],
    },
};