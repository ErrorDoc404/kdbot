/**
 *
 * @param {import("../library/DiscordBot")} client
 */
 module.exports = async (client) => {
    (client.Ready = true),
    client.user.setPresence(client.config.presence);
    client.log("Successfully Logged in as " + client.user.tag);
  };
  