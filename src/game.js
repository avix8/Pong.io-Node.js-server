const Player = require("./Player");
const World = require("./World");

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.world = new World();
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
      return;
    }
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(socket);
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
      return;
      // socket.emit("msg", "Не удалось выполнить операцию")
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
    let serializedData = this.world.update();
    this.emitAllSockets("worldUpdate", serializedData);
  }

  start() {
    this.world.setPlayers(this.players);
    this.emitAllSockets("gameStart", {
      worldInfo: this.world.getInfo(),
      playersInfo: "asdas",
    });
    setTimeout(() => {
      this.intervalId = setInterval(() => {
        this.tick();
      }, 20);
    }, 5000);
  }

  finish() {
    Object.keys(this.players).forEach(
      (playerID) => (this.players[playerID].ready = false)
    );
    this.lobbyUpdate();
    //pass

    this.emitAllSockets("gameFinish", { someData: "asd" });
    clearInterval(this.intervalId);
  }
}

module.exports = Game;
