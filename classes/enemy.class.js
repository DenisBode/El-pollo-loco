/**
 * Base class for all enemies (chickens and the endboss).
 * An enemy walks to the left; the subclasses decide how it looks and sounds.
 */
class Enemy extends MovableObject {
  bottleDamage = 100;
  /** Damage when Pepe jumps onto the enemy from above. */
  stompDamage = 100;
  /** Only small enemies can be defeated by a jump. */
  canBeStomped = false;
  /** Pepe stands 100 px from the left edge, so an enemy enters the screen at 620 px. */
  viewDistance = 620;
  animationInterval = 200;


  /** Starts the movement loop and the image loop. */
  animate() {
    setGameInterval(() => this.move(), 1000 / 60);
    setGameInterval(() => this.updateImage(), this.animationInterval);
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


  /**
   * Checks if the enemy cannot be hurt at the moment; a normal enemy is never immune.
   * @returns {boolean} true while the enemy cannot be hurt; only the endboss is immune for a short time after a hit
   */
  isImmune() {
    return false;
  }


  /** Every enemy type has its own hit sound. */
  playHitSound() {}
}
