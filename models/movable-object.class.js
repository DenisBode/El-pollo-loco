class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 2;
  energy = 100;
  lastHit = 0;

  otherDirection = false;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isColliding(movabaleObject) {
    let a = this.getHitbox();
    let b = movabaleObject.getHitbox();
    return (
      a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height
    );
  }

  /** Removes 5 energy as long as energy is above 0. */
  hit() {
    if (this.energy > 0) {
      this.energy -= 5;
      this.lastHit = new Date().getTime();
    }
  }

  /** True for 1000 ms after the last hit (only used for the hurt animation). */
  isHurt() {
    return new Date().getTime() - this.lastHit < 1000;
  }

  isDead() {
    return this.energy <= 0;
  }

  isAboveGround() {
    return this.y < 130;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.otherDirection = false;
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
    this.currentImage = 0;
  }
}
