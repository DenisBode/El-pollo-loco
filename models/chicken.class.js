class Chicken extends MovableObject {
  y = 350;
  height = 80;
  bottleDamage = 100; // one bottle kills a chicken

  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

  /** @param {number} minX - leftmost spawn position; @param {number} maxX - rightmost spawn position */
  constructor(minX = 720, maxX = 6200) {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages([this.IMAGE_DEAD]);

    this.x = minX + Math.random() * (maxX - minX); // Random x position between minX and maxX
    this.speed = 0.15 + Math.random() * 0.5; // Random speed between 0.15 and 0.35
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (!this.isDead()) this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.img = this.imageCache[this.IMAGE_DEAD];
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 1000 / 5); // 5 frames per second
  }

  /** A dead chicken stays visible for 1 second, then it is removed. */
  isRemovable() {
    return this.isDead() && new Date().getTime() - this.lastHit > 1000;
  }
}
