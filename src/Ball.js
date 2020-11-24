const Vector = require("./Vector");

class Ball {
  constructor(x, y, r) {
    this.pos = new Vector(x, y);
    this.r = r;
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
  }

  reposition() {
    this.acc = this.acc.unit();
    this.vel = this.vel.add(this.acc);
    this.pos = this.pos.add(this.vel);
  }

  serialized() {
    return { pos: this.pos }
  }
}
module.exports = Ball;
