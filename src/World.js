const Ball  = require( "./Ball");
const Vector = require("./Vector");
const Wall = require("./Wall");

class World{
  constructor(){
    this.BALLZ = [];
    this.WALLZ = [];
    this.ballsN = 0;
    this.playersN = 0;
    this.r = 10;
  }

  setPlayers(players) {
    this.BALLZ = [];
    this.WALLZ = [];
    this.playersN = Object.keys(players).length;
    this.ballsN = Math.ceil(this.playersN/2);
    
    let d = Math.PI*2 / this.playersN
    this.paddleSize = 2*Math.sin(d/2)*this.r/3

    for (let a = 0; a < Math.PI*2; a+=d) {
      let x1 = this.r*Math.cos(a);
      let y1 = this.r*Math.sin(a);
      let x2 = this.r*Math.cos(a+d);
      let y2 = this.r*Math.sin(a+d);

      let wall = new Wall(x1,y1,x2,y2);
      this.WALLZ.push(wall);
    }
    for (let i = 0; i < this.ballsN; i++) {
      let ball = new Ball(0,0,this.paddleSize/9);
      ball.vel.x = random(0,0.1);
      ball.vel.y = random(0,0.1);
      this.BALLZ.push(ball);  
    }
  }

  getInfo() {
    return {'walls': this.WALLZ, 'balls': this.BALLZ}
  }

  update() {
    let serializedData = {
      balls: [],
      walls: [],
    };
    this.BALLZ.forEach((b, index) => {
      b.vel = b.vel.mult(1.001)
      for (let i = index + 1; i < this.BALLZ.length; i++) {
        if (collDetBB(b, this.BALLZ[i])) {
          collResBB(b, this.BALLZ[i]);
          penResBB(b, this.BALLZ[i]);    
        }
      }

      this.WALLZ.forEach((w) => {
        if (collDetBW(b, w)) {
          collResBW(b, w);
          penResBW(b, w);
        }
      });
      
      serializedData.balls.push(b)
      b.reposition();
    });
  
    this.WALLZ.forEach((w) => {
      serializedData.walls.push(w)
    });
    return serializedData;
  }
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function closestPointBW(b, w) {
  let wallEndToBall = b.pos.subtr(w.end);
  if (Vector.dot(w.unit(), wallEndToBall) > 0) {
    return w.end;
  }
  let ballToWallStart = w.start.subtr(b.pos);
  let closestDist = Vector.dot(w.unit(), ballToWallStart);
  if (closestDist > 0) {
    return w.start;
  }
  let closestVect = w.unit().mult(closestDist);
  return w.start.subtr(closestVect);
}

function collDetBB(b1, b2) {
  if (b1.r + b2.r >= b1.pos.subtr(b2.pos).mag()) {
    return true;
  }
  return false;
}

function collDetBW(b, w) {
  let ballToClosest = closestPointBW(b, w).subtr(b.pos);
  if (ballToClosest.mag() < b.r) {
    return true;
  }
  return false;
}

function penResBB(b1, b2) {
  let distVec = b1.pos.subtr(b2.pos);
  let penDepth = b1.r + b2.r - distVec.mag();
  let penRes = distVec.unit().mult(penDepth / 2);
  b1.pos = b1.pos.add(penRes);
  b2.pos = b2.pos.add(penRes.mult(-1));
}

function penResBW(b, w) {
  let penVect = b.pos.subtr(closestPointBW(b, w));
  b.pos = b.pos.add(penVect.unit().mult(b.r - penVect.mag()));
}

function collResBB(b1, b2) {
  let normal = b1.pos.subtr(b2.pos).unit();
  let relVel = b1.vel.subtr(b2.vel);
  let sepVel = Vector.dot(relVel, normal);
  let newSepVel = -sepVel;
  let sepVelVec = normal.mult(newSepVel);

  b1.vel = b1.vel.add(sepVelVec);
  b2.vel = b2.vel.add(sepVelVec.mult(-1));
}

function collResBW(b, w) {
  let normal = b.pos.subtr(closestPointBW(b, w)).unit();
  let sepVel = Vector.dot(b.vel, normal);
  let newSepVel = -sepVel;
  let vsepDiff = sepVel - newSepVel;
  b.vel = b.vel.add(normal.mult(-vsepDiff));
}

module.exports = World