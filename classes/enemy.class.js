/**
 * Base class for all enemies (chickens and the endboss).
 * An enemy walks to the left; the subclasses decide how it looks and sounds.
 */
class Enemy extends MovableObject {
  bottleDamage = 100;
  stompDamage = 100; // damage when Pepe jumps onto the enemy from above
  canBeStomped = false; // only small enemies can be defeated by a jump
  viewDistance = 620; // Pepe stands 100 px from the left edge, so an enemy enters the screen at 620 px
  animationInterval = 200;


  /** Starts the movement loop and the image loop. */
  animate() {
    setInterval(() => this.move(), 1000 / 60);
    setInterval(() => this.updateImage(), this.animationInterval);
  }


  /** Walks to the left as long as the enemy is alive. */
  move() {
    if (!this.isDead()) this.moveLeft();
  }


  /** Chooses the next image; every enemy type has its own images. */
  updateImage() {}


  /**
   * Removes energy and plays the hit sound of the enemy type.
   * @param {number} damage
   */
  hit(damage) {
    super.hit(damage);
    this.playHitSound();
  }


  /** Every enemy type has its own hit sound. */
  playHitSound() {}
}
