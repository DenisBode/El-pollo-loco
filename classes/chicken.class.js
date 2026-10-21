/** A normal chicken: walks to the left and dies from one bottle or when Pepe jumps on it. */
class Chicken extends Enemy {
  static IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  static IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

  y = 350;
  height = 80;
  hasFrame = true;
  canBeStomped = true;


  /**
   * @param {number} minX - leftmost spawn position
   * @param {number} maxX - rightmost spawn position
   */
  constructor(minX = 720, maxX = 6200) {
    super();
    this.applyType();
    this.loadImage(this.walkingImages()[0]);
    this.loadImages(this.walkingImages());
    this.loadImages([this.deadImage()]);
    this.x = minX + Math.random() * (maxX - minX);
    this.speed = this.randomSpeed();
    this.animate();
  }


  /** Size and hitbox of this chicken type; the hitbox covers the body, not the empty corners of the image. */
  applyType() {
    this.setOffset(4, 6, 8, 6);
  }


  /** @returns {string[]} the walking images of this chicken type */
  walkingImages() {
    return Chicken.IMAGES_WALKING;
  }


  /** @returns {string} the image of the defeated chicken of this type */
  deadImage() {
    return Chicken.IMAGE_DEAD;
  }


  /** @returns {number} a random walking speed for this chicken type */
  randomSpeed() {
    return 0.15 + Math.random() * 0.5;
  }


  /** Walking images while alive, the flat chicken when dead. */
  updateImage() {
    if (this.isDead()) {
      this.img = this.imageCache[this.deadImage()];
    } else {
      this.playAnimation(this.walkingImages());
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
