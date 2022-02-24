const { Server } = require("socket.io");
const Client = require("../index");
const Economy = require("../../mongoose/database/schemas/Economy");
const formatMessage = require('./message');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./user');
const botName = 'kartadharta';

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
  
      socket.on("passport", (id) => {
        if(socket.Passport) clearInterval(socket.Passport);
        socket.Passport = setInterval(async () => {
          const Client = require("../../build");
          if (!Client.Ready) return console.log(`no client`);
          if(!id.userId) return console.log(`no auth user`);
          const userBank = await Economy.find({userId: id.userId});
          let totalAmount = 0;
          let totalPocket = 0;
          let totalBank = 0;
          userBank.forEach((data) => {
            totalAmount = data.cash + totalAmount;
            totalPocket = data.cash + totalPocket;
            totalAmount = data.bank + totalAmount;
            totalBank = data.bank + totalBank;
          })
          socket.emit("passport", {
            total: totalAmount,
            pocket: totalPocket,
            bank: totalBank
          });
        }, 1000);
      });

      socket.on('joinRoom',({ username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to Random Chat!'));

        // Broadcast when a user connects
        socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} has joined the chat`)
        );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });

      });

      // Listen for chatMessage
      socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
      });

    });
  };
  