/** A thrown bottle: flies in an arc and rotates until it hits an enemy or the ground. */
class ThrowableObject extends MovableObject {
  width = 60;
  height = 70;
  groundY = 360;
  landed = false;
  hasHit = false;
  canHitThrower = false; // true as soon as the bottle has left Pepe, so it does not hit him at the throw

  IMAGES_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];


  /**
   * @param {number} x - start position
   * @param {number} y - start position
   * @param {number} direction - 1 flies to the right, -1 to the left
   */
  constructor(x, y, direction) {
    super().loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = 10;
    this.throw();
  }


  /** Flies in an arc until the ground is reached; the rotation runs in its own interval. */
  throw() {
    this.speedY = 25;
    this.flightInterval = setInterval(() => this.fly(), 1000 / 25);
    this.rotationInterval = setInterval(() => this.playAnimation(this.IMAGES_ROTATION), 100);
  }


  /** One step of the flight; lands on the ground. */
  fly() {
    this.x += this.speed * this.direction;
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.land();
    }
  }


  land() {
    this.landed = true;
    this.stop();
  }


  hitEnemy() {
    this.hasHit = true;
    this.stop();
  }


  /** Stops the flight and the rotation. */
  stop() {
    clearInterval(this.flightInterval);
    clearInterval(this.rotationInterval);
  }
}
