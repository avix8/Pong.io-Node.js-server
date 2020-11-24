class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtr(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  mult(n) {
    return new Vector(this.x * n, this.y * n);
  }

  normal() {
    return new Vector(-this.y, x).unit();
  }

  unit() {
    let m = this.mag();
    if (m === 0) {
      return new Vector(0, 0);
    }
    return new Vector(this.x / m, this.y / m);
  }

  static scalar(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }
}

module.exports = Vector;
