const Player = require("./player");

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.balls = [];
    this.running = false;
  }

  emitAllSockets(event, data) {
    Object.keys(this.sockets).forEach((playerID) => {
      const socket = this.sockets[playerID];
      socket.emit(event, data);
    });
  }

  lobbyUpdate() {
    let serializedData = Object.values(this.players).map((p) =>
      p.serializeForLobbyUpdate()
    );
    this.emitAllSockets("lobbyUpdate", serializedData);
  }

  addPlayer(socket) {
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(socket.id);
    this.lobbyUpdate();
  }

  removePlayer(socket) {
    if (this.running) {
      console.log("pass");
      //hz
    } else {
      delete this.sockets[socket.id];
      delete this.players[socket.id];
      this.lobbyUpdate();
    }
  }

  setPlayerData(socket, data) {
    if (!this.players[socket.id].set(data)) {
      return
      // socket.emit("msg", "Не удалось выполнить операцию")
    }

    this.lobbyUpdate();
    if (Object.keys(this.players).every(playerID => this.players[playerID].ready)){
      this.start();
    }
  }

  start() {
    //pass
    this.emitAllSockets("gameStart", {'someData': 'asd'})
  }

  finish() {
    Object.keys(this.players).forEach(playerID => this.players[playerID].ready = false)
    this.lobbyUpdate();
    //pass
    this.emitAllSockets("gameFinish", {'someData': 'asd'})
  } 
}

module.exports = Game;
