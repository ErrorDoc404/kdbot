const DiscordModerationBot = require('./library/DiscordModerationBot');

const client = new DiscordModerationBot();

client.build(client.config.buildToken);

module.exports = client;