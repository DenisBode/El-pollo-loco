/** Base class for objects that move, fall and can get hurt. */
class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 2;
  energy = 100;
  lastHit = 0;
  deathFrame = 0;
  /** The upward speed at the start of a jump. */
  jumpSpeed = 30;
  /** The height at which a falling object comes to rest. */
  groundLevel = 140;


  /** Lets the object fall until it stands on the ground; a jump (speedY > 0) lifts it first. */
  applyGravity() {
    setGameInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        this.stopAtGround();
      }
    }, 1000 / 25);
  }


  /** A fast fall (e.g. from the sky) must not sink into the ground. */
  stopAtGround() {
    if (this.y > this.groundLevel) {
      this.y = this.groundLevel;
      this.speedY = 0;
    }
  }


  /**
   * Removes energy as long as the object is alive.
   * @param {number} damage
   */
  hit(damage = 5) {
    if (this.energy > 0) {
      this.energy = Math.max(0, this.energy - damage);
      this.lastHit = Date.now();
    }
  }


  /**
   * True for one second after the last hit (used for the hurt animation).
   * @returns {boolean}
   */
  isHurt() {
    return Date.now() - this.lastHit < 1000;
  }


  /** @returns {boolean} */
  isDead() {
    return this.energy <= 0;
  }


  /**
   * Dead objects that should vanish from the level override this.
   * @returns {boolean}
   */
  isRemovable() {
    return false;
  }


  /** @returns {boolean} */
  isAboveGround() {
    return this.y < 130;
  }


  /**
   * Plays the dead images once and keeps the last one.
   * @param {string[]} images - image paths from the cache
   */
  playDeathAnimation(images) {
    let index = Math.min(this.deathFrame, images.length - 1);
    this.img = this.imageCache[images[index]];
    this.deathFrame++;
  }


  /**
   * True as soon as all dead images were shown.
   * @param {string[]} images
   * @returns {boolean}
   */
  hasFinishedDeathAnimation(images) {
    return this.deathFrame >= images.length;
  }


  /** @param {number} frameFactor - 1 is one step of 1/60 s; the step is longer if a frame took longer */
  moveRight(frameFactor = 1) {
    this.otherDirection = false;
    this.x += this.speed * frameFactor;
  }


  /** @param {number} frameFactor - see moveRight */
  moveLeft(frameFactor = 1) {
    this.x -= this.speed * frameFactor;
  }


  /** Starts a jump: the object moves up with the jump speed and the gravity pulls it down again. */
  jump() {
    this.speedY = this.jumpSpeed;
    this.currentImage = 0;
  }
}
