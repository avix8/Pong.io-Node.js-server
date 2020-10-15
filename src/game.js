const Player = require("./player");

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.balls = [];
    this.started = false;
  }

  lobbyUpdate() {
    let serialized = Object.values(this.players).map(p => p.serializeForLobbyUpdate())
    Object.keys(this.sockets).forEach((playerID) => {
        const socket = this.sockets[playerID];
        socket.emit("setPlayers", serialized);
      });
  }

  addPlayer(socket, name, color) {
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(socket.id, name, color);
    this.lobbyUpdate()
  }

  removePlayer(socket) {
      if (this.started) {
          console.log('pass');
          //hz
      } else {
          delete this.sockets[socket.id]
          delete this.players[socket.id]
          this.lobbyUpdate()
      }
  }

  setPlayerData(socket, data) {
    if (this.players[socket.id].set(data)) {
      this.lobbyUpdate()
    }
  }

  start() {}
}

module.exports = Game;
