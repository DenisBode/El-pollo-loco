class ThrowableObject extends MovableObject {
  width = 60;
  height = 70;
  groundY = 360;
  landed = false;
  hasHit = false;

  IMAGES_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  /** @param {number} direction - 1 flies to the right, -1 to the left. */
  constructor(x, y, direction) {
    super().loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = 10;
    this.throw();
  }

  /** Flies in an arc until the ground is reached, then stops all intervals. */
  throw() {
    this.speedY = 25;
    this.flightInterval = setInterval(() => {
      this.x += this.speed * this.direction;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.land();
      }
    }, 1000 / 25);
    this.rotationInterval = setInterval(() => this.playAnimation(this.IMAGES_ROTATION), 100);
  }

  land() {
    this.landed = true;
    this.stop();
  }

  hitEnemy() {
    this.hasHit = true;
    this.stop();
  }

  stop() {
    clearInterval(this.flightInterval);
    clearInterval(this.rotationInterval);
  }
}
