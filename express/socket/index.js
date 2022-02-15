const { Server } = require("socket.io");
const Client = require("../index");

/**
 * @param {Server} io
 */

 module.exports = (io) => {
    io.on("connection", (socket) => {
      //Bot's Main Page
      socket.on("dashboard", () => {
        if (socket.Dashboard) clearInterval(socket.Dashboard);
        socket.Dashboard = setInterval(() => {
          if (!Client.Ready) return;
          socket.emit("dashboard", {
            commands: Client.CommandsRan,
            users: Client.users.cache.size,
            guilds: Client.guilds.cache.size,
            songs: Client.SongsPlayed,
          });
        }, 1000);
      });
  
      socket.on("GuildDB", (ServerID) => {
        //
      });
    });
  };
  