/** A normal chicken: walks to the left and dies from one bottle. */
class Chicken extends Enemy {
  y = 350;
  height = 80;
  hasFrame = true;

  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';


  /**
   * @param {number} minX - leftmost spawn position
   * @param {number} maxX - rightmost spawn position
   */
  constructor(minX = 720, maxX = 6200) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages([this.IMAGE_DEAD]);
    this.x = minX + Math.random() * (maxX - minX);
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }


  /** Walking images while alive, the flat chicken when dead. */
  updateImage() {
    if (this.isDead()) {
      this.img = this.imageCache[this.IMAGE_DEAD];
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }


  playHitSound() {
    soundManager.play('chickenDead');
  }


  /**
   * A dead chicken stays visible for one second, then it is removed.
   * @returns {boolean}
   */
  isRemovable() {
    return this.isDead() && Date.now() - this.lastHit > 1000;
  }
}
