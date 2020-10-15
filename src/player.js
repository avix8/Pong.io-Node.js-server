class Player {
  constructor(id, name, color) {
    this.id = id;
    this.name = name || "Player";
    this.color = color || "#fff";
    this.ready = false;
    this.pos = 0;
  }

  set(data) {
    let key = Object.keys(data)[0];
    if (["name", "color", "ready"].includes(key)) {
      this[key] = data[key];
      return true;
    }
    return false;
  }

  serializeForLobbyUpdate() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      ready: this.ready,
    };
  }
}

module.exports = Player;