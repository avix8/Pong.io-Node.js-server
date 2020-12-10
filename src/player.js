const Vector = require("./Vector");
const Wall = require("./Wall");

class Player extends Wall {
  constructor(socket) {
    super(0,0,0,0);
    this.speed = 0.5;

    this.id = socket.id;
    this.name = "Игрок";
    this.color = "#f00";
    this.ready = false;
    this.score = 0;
    

    this.control = {
      right: false,
      left: false,
    };
    socket.on("keydown", (key) => {
      if (key === "ArrowRight") this.control.right = true;
      if (key === "ArrowLeft") this.control.left = true;
    });
    socket.on("keyup", (key) => {
      if (key === "ArrowRight") this.control.right = false;
      if (key === "ArrowLeft") this.control.left = false;
    });
  }

  setPaddle(size, a, d, r) {
    let x1 = r*Math.cos(a);
    let y1 = r*Math.sin(a);
    let x2 = r*Math.cos(a+d);
    let y2 = r*Math.sin(a+d);

    super.start = new Vector(x1,y1)
    super.end = new Vector(x2,y2)
    super.pos = new Vector((x1+x2)/2, (y1+y2)/2)
    this.unitFromCenter = this.pos.unit()
    super.size = size/2
    this.speed = this.size / 8
    super.reposition()
  }

  move(limit) {
    super.vel = new Vector(0,0)
    if (this.control.left && this.start.mag() < limit) {
      super.vel = this.unit().mult(-this.speed)
    }
    if (this.control.right && this.end.mag() < limit) {
      super.vel = this.unit().mult(this.speed)
    }
    super.reposition()
  }

  set(data) {
    let keys = Object.keys(data);
    let successfully = 0
    keys.forEach(key => {
      if (["name", "color", "ready"].includes(key)) {
        this[key] = data[key];
        successfully++
      }
    })
    return successfully;
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
