const Game = require("./game");

exports = module.exports = function (io) {
  const nsp = io.of("/");

  nsp.on("connection", (socket) => {
    console.log(`online: ${Object.keys(nsp.sockets).length}, ${socket.id} connected from ${socket.request.connection.remoteAddress}`);
    socket.emit("id", socket.id);
    
    socket.on("joinRoom", joinRoom);
    
    socket.on("setPlayerData", setPlayerData);

    socket.on("disconnect", disconnect);

    function joinRoom(roomName) {
      if (!roomName) return console.log("Нет комнаты");

      socket.join(roomName);
      // socket.roomName = roomName;
      if (nsp.adapter.rooms[roomName].length === 1) {
        nsp.adapter.rooms[roomName].game = new Game()
      }
      socket.game = nsp.adapter.rooms[roomName].game;
      socket.game.addPlayer(socket)
    }

    function setPlayerData(data) {
      if (socket.game) {
        socket.game.setPlayerData(socket, data);
      }
    }

    function disconnect() {
      console.log(
        `online: ${Object.keys(nsp.sockets).length}, ${socket.id} disconnected`
      );
      if (socket.game) {
        socket.game.removePlayer(socket)
      }
    }
  });
};
