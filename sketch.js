let pursuer;
let target;

function setup() {
  createCanvas(400, 400);

  pursuer = new Vehicle(width/2, height/2, 15);
  target = new Target(300, 200, 15);
}

function draw() {
  background(0);

  let steering = pursuer.evade(target);
  pursuer.applyForce(steering);

  pursuer.update();
  pursuer.wrap();
  pursuer.show();

  target.update();  
  target.wrap();
  target.show();
}

class Vehicle {
  constructor(x, y, size) {
    this.position = createVector(x, y);
    this.velocity = createVector(0,0);
    this.acc = createVector(0,0);
    this.maxSpeed = 10;
    this.maxForce = 0.3;
    this.size = size;
    this.mass = 1;
  }

  show() {
    fill(255);
    noStroke();
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.size, -this.size/2, -this.size, this.size/2, this.size, 0);
    pop();
  }

  update() {
    // Increment velocity based on acceleration
    this.velocity.add(this.acc);
    this.velocity.limit(this.maxSpeed);
    // Increment position based on velocity
    this.position.add(this.velocity);

    // Reset acceleration for the next frame
    this.acc = this.acc.mult(0);
  }

  wrap() {
    if (this.position.x < -this.size)  this.position.x = width + this.size;
    if (this.position.y < -this.size)  this.position.y = height + this.size;
    if (this.position.x > width + this.size) this.position.x = -this.size;
    if (this.position.y > height + this.size) this.position.y = -this.size;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass)
    this.acc.add(f);
  }

  seek(target) {
    let force = p5.Vector.sub(target, this.position);
    force.setMag(this.maxSpeed);
    force.sub(this.velocity);
    force.limit(this.maxForce);

    return(force);
  }

  flee(target) {
    let force = p5.Vector.sub(target, this.position);
    force.setMag(-this.maxSpeed);
    force.sub(this.velocity);
    force.limit(this.maxForce);

    return(force);
  }

  pursue(vehicle) {
    let target = vehicle.position.copy();
    let prediction = vehicle.velocity.copy();
    target.add(prediction.mult(10));

    fill(0, 255, 0);
    circle(target.x, target.y, 5);

    return this.seek(target);
  }

  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);

    return pursuit
  }
}

class Target extends Vehicle {
  constructor(x, y, size){
    super(x, y, size);
    this.velocity = createVector(4, 2)
  }

  show() {
    fill(255, 0, 0);
    noStroke();
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.size, -this.size/2, -this.size, this.size/2, this.size, 0);
    pop();
  }
}