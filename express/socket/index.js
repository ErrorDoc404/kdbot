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
          const Client = require("../../build");
          if (!Client.Ready) return;
          socket.emit("dashboard", {
            commands: Client.CommandsRan,
            users: Client.users.cache.size,
            guilds: Client.guilds.cache.size,
            ping: Client.ws.ping,
          });
        }, 1000);
      });
  
      socket.on("GuildDB", (ServerID) => {
        //
      });
    });
  };
  