/** A small chick: smaller and much faster than a normal chicken. */
class SmallChicken extends Chicken {
  static IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.webp',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.webp',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.webp',
  ];

  static IMAGE_DEAD = 'img/3_enemies_chicken/chicken_small/2_dead/dead.webp';

  /** Smaller than a normal chicken, still standing on the same ground line (y + height = 430). */
  applyType() {
    this.width = 70;
    this.height = 50;
    this.y = 380;
    this.setOffset(5, 9, 10, 9);
  }

  /** @returns {string[]} the walking images of a chick */
  walkingImages() {
    return SmallChicken.IMAGES_WALKING;
  }

  /** @returns {string} the image of a defeated chick */
  deadImage() {
    return SmallChicken.IMAGE_DEAD;
  }

  /** @returns {number} chicks are about twice as fast as normal chickens */
  randomSpeed() {
    return 0.6 + Math.random() * 0.6;
  }
}
