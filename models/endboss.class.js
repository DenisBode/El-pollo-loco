class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  bottleDamage = 20; // five bottles kill the endboss
  deadFrame = 0;

  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2400;
    this.speed = 0.15 + Math.random() * 0.3;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isDead()) {
        this.playDeathAnimation();
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 1000 / 5);

    setInterval(() => {
      if (!this.isDead()) this.moveLeft();
    }, 1000 / 60);
  }

  /** Plays the dead images once and keeps the last frame. */
  playDeathAnimation() {
    let index = Math.min(this.deadFrame, this.IMAGES_DEAD.length - 1);
    this.img = this.imageCache[this.IMAGES_DEAD[index]];
    this.deadFrame++;
  }
}
