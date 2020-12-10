const Vector = require('./Vector')

class Wall {
    constructor(x1, y1, x2, y2) {
        this.start = new Vector(x1, y1)
        this.end = new Vector(x2, y2)
        this.pos = new Vector((x1 + x2) / 2, (y1 + y2) / 2)
        this.size = this.mag() / 2
        this.vel = new Vector(0, 0)
    }

    reposition() {
        this.pos = this.pos.add(this.vel)
        this.start = this.pos.add(this.unit().mult(-this.size))
        this.end = this.pos.add(this.unit().mult(this.size))
    }

    mag() {
        return this.end.subtr(this.start).mag()
    }

    unit() {
        return this.end.subtr(this.start).unit()
    }
}

module.exports = Wall
