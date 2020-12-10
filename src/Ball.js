const Vector = require('./Vector')

class Ball {
    constructor(x, y, r) {
        this.pos = new Vector(x, y)
        this.r = r
        this.vel = new Vector(0, 0)
    }

    reposition() {
        this.pos = this.pos.add(this.vel)
    }
}
module.exports = Ball
