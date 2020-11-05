const Vector = require("./Vector");

class Wall {
  constructor(x1, y1, x2, y2) {
    this.start = new Vector(x1, y1);
    this.end = new Vector(x2, y2);
  }

  unit() {
    return this.end.subtr(this.start).unit();
  }
}

module.exports = Wall;
