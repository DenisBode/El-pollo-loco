class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  bottleDamage = 20; // five bottles kill the endboss
  deadFrame = 0;

  state = 'waiting'; // waiting -> alert -> walking
  alertFrame = 0;
  attacking = false;
  attackSpeedFactor = 3; // while attacking he runs 3 times faster
  attackDistance = 350; // attack starts when Pepe is closer than this (px)

  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_ALERT = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  IMAGES_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
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
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 6800;
    this.speed = 0.15 + Math.random() * 0.3;
    this.animate();
  }

  animate() {
    setInterval(() => this.playCurrentAnimation(), 1000 / 5);

    setInterval(() => {
      if (!this.isDead() && this.state === 'walking') this.move();
    }, 1000 / 60);
  }

  /** Waits until he is seen, shows the alert once, then walks; near Pepe he attacks. */
  playCurrentAnimation() {
    if (this.isDead()) {
      this.playDeathAnimation();
    } else if (this.state === 'alert') {
      this.playAlertAnimation();
    } else if (this.state === 'waiting') {
      return;
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.attacking) {
      this.playAnimation(this.IMAGES_ATTACK);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  move() {
    if (this.attacking) {
      this.x -= this.speed * this.attackSpeedFactor;
    } else {
      this.moveLeft();
    }
  }

  /** Called by the world when the endboss comes into view for the first time. */
  startAlert() {
    if (this.state === 'waiting') {
      this.state = 'alert';
    }
  }

  /** Plays the alert images once, then the endboss starts walking. */
  playAlertAnimation() {
    if (this.alertFrame < this.IMAGES_ALERT.length) {
      this.img = this.imageCache[this.IMAGES_ALERT[this.alertFrame]];
      this.alertFrame++;
    } else {
      this.state = 'walking';
    }
  }

  /** Plays the dead images once and keeps the last frame. */
  playDeathAnimation() {
    let index = Math.min(this.deadFrame, this.IMAGES_DEAD.length - 1);
    this.img = this.imageCache[this.IMAGES_DEAD[index]];
    this.deadFrame++;
  }
}
