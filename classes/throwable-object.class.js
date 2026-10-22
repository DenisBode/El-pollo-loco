/** A thrown bottle: flies in an arc and rotates until it hits an enemy (then it splashes) or the ground. */
class ThrowableObject extends MovableObject {
  width = 60;
  height = 70;
  groundY = 360;
  landed = false;
  hasHit = false;
  /** True as soon as the bottle has left Pepe, so it does not hit him at the throw. */
  canHitThrower = false;
  /** Size of the splash; the images are wider than the bottle (about 4 : 3). */
  splashWidth = 100;
  splashHeight = 76;
  splashFrame = 0;
  splashDone = false;

  IMAGES_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.webp',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.webp',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.webp',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.webp',
  ];

  IMAGES_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.webp',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.webp',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.webp',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.webp',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.webp',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.webp',
  ];


  /**
   * @param {number} x - start position
   * @param {number} y - start position
   * @param {number} direction - 1 flies to the right, -1 to the left
   */
  constructor(x, y, direction) {
    super().loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = 10;
    this.throw();
  }


  /** Flies in an arc until the ground is reached; the rotation runs in its own interval. */
  throw() {
    this.speedY = 25;
    this.flightInterval = setGameInterval(() => this.fly(), 1000 / 25);
    this.rotationInterval = setGameInterval(() => this.playAnimation(this.IMAGES_ROTATION), 100);
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


  /** The bottle has reached the ground: it stays lying there. */
  land() {
    this.landed = true;
    this.stop();
  }


  /** The bottle has hit something: it stops in the air and splashes. */
  hitEnemy() {
    this.hasHit = true;
    this.stop();
    this.startSplash();
  }


  /** Makes the bottle bigger around its middle and plays the splash images one after the other. */
  startSplash() {
    this.x -= (this.splashWidth - this.width) / 2;
    this.y -= (this.splashHeight - this.height) / 2;
    this.width = this.splashWidth;
    this.height = this.splashHeight;
    this.splashInterval = setGameInterval(() => this.playSplashFrame(), 70);
  }


  /** Shows the next splash image; after the last one the splash is done. */
  playSplashFrame() {
    if (this.splashFrame >= this.IMAGES_SPLASH.length) {
      this.stopInterval(this.splashInterval);
      this.splashDone = true;
      return;
    }
    this.img = this.imageCache[this.IMAGES_SPLASH[this.splashFrame]];
    this.splashFrame++;
  }


  /** @returns {boolean} true when the bottle can be removed: it lay down or its splash is over */
  isFinished() {
    return this.landed || this.splashDone;
  }


  /** Stops the flight and the rotation. */
  stop() {
    this.stopInterval(this.flightInterval);
    this.stopInterval(this.rotationInterval);
  }


  /**
   * Stops an interval and takes it off the list of the game's intervals.
   * @param {number} id
   */
  stopInterval(id) {
    clearInterval(id);
    intervalIds = intervalIds.filter((intervalId) => intervalId !== id);
  }
}
