const DiscordModerationBot = require('./library/DiscordModerationBot');

const client = new DiscordModerationBot();

client.MongooseConnect();

client.build(client.config.buildToken);

module.exports = client;