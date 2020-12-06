const Player = require("./Player");
const World = require("./World");

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.disconnected = [];
    this.world = new World(this);
    this.running = false;
    this.intervalId;
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
    if (this.running) {
      return socket.emit("msg", "Игра уже началась.")
    }
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(socket);
    this.lobbyUpdate();
  }

  removePlayer(socket) {
    this.emitAllSockets("msg", `${this.players[socket.id].name} отключился от игры.`)
    if (this.running) {
      console.log("pass");
      this.disconnected.push(socket.id)
    } else {
      delete this.sockets[socket.id];
      delete this.players[socket.id];
      this.lobbyUpdate();
    }
  }

  setPlayerData(socket, data) {
    if (!this.players[socket.id]?.set(data)) {
      return socket.emit("msg", "Не удалось выполнить операцию")
    }

    this.lobbyUpdate();
    if (
      Object.keys(this.players).every(
        (playerID) => this.players[playerID].ready
      ) &&
      Object.keys(this.players).length > 2
    ) {
      this.start();
    }
  }

  tick() {
    let data = this.world.update();
    this.emitAllSockets("worldUpdate", data.worldUpdate);
    this.emitAllSockets("scoreUpdate", data.scoreUpdate)
    Object.keys(this.players).forEach((playerID) => {
      if (this.players[playerID]?.score > 100) {
        this.finish(this.players[playerID])
      }
    });
  }

  start() {
    this.running = true
    Object.keys(this.players).forEach((playerID) => {
      this.players[playerID].score = 0
      this.players[playerID].ready = false
    });
    this.world.setPlayers(this.players);
    this.emitAllSockets("gameStart", this.world.getInfo());
    setTimeout(() => {
      this.intervalId = setInterval(() => {
        this.tick();
      }, 17);
    }, 5000);
  }

  finish(winner) {
    this.running = false
    this.disconnected.forEach(id => {
      delete this.sockets[id];
      delete this.players[id];
    })
    this.lobbyUpdate();
    this.emitAllSockets("gameFinish", { winner });
    clearInterval(this.intervalId);
  }
}

module.exports = Game;
