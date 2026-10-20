/**
 * The endboss: waits until he is seen, shows an alert, then walks and attacks when Pepe is close.
 * After his death he tumbles and comes to rest on the ground.
 */
class Endboss extends Enemy {
  height = 400;
  width = 250;
  y = 55;
  bottleDamage = 20; // five bottles kill the endboss
  state = 'waiting'; // waiting -> alert -> walking
  alertFrame = 0;
  attacking = false;
  attackSpeedFactor = 3; // while attacking he runs 3 times faster
  attackDistance = 350; // the attack starts when Pepe is closer than this (px)
  tumbleStart = null;
  tumbleDuration = 1800; // ms
  lyingAngle = 1010; // two full turns plus 290 degrees
  lyingScale = 0.8; // he shrinks a bit while falling
  groundY = 500; // the image box ends below the visible body, so this is deeper than Pepe's lower edge

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


  /** Walks only after the alert; while attacking he is faster. */
  move() {
    if (this.isDead() || this.state !== 'walking') return;
    if (this.attacking) {
      this.x -= this.speed * this.attackSpeedFactor;
    } else {
      this.moveLeft();
    }
  }


  /** Dead, alert or walking images; while he is waiting the image stays as it is. */
  updateImage() {
    if (this.isDead()) {
      this.playDeathAnimation(this.IMAGES_DEAD);
    } else if (this.state === 'alert') {
      this.playAlertAnimation();
    } else if (this.state === 'walking') {
      this.playWalkingAnimation();
    }
  }


  /** Hurt images have priority over the attack, the attack over normal walking. */
  playWalkingAnimation() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.attacking) {
      this.playAnimation(this.IMAGES_ATTACK);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }


  /** Called when the endboss comes into view for the first time. */
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


  /**
   * True as soon as the endboss is to the right of Pepe but closer than the view distance.
   * @param {Character} character
   * @returns {boolean}
   */
  hasComeIntoView(character) {
    return this.x - character.x < this.viewDistance;
  }


  /**
   * Switches the attack on when Pepe is close.
   * @param {Character} character
   */
  updateAttack(character) {
    this.attacking = this.isNear(character, this.attackDistance);
  }


  /** A fatal hit ends his sound and plays the victory sound; every other hit plays his angry cluck. */
  playHitSound() {
    if (this.isDead()) {
      this.playVictorySound();
    } else {
      soundManager.play('bossHurt');
    }
  }


  /** The endboss is defeated: his sound is cut off, the music ends and the game over jingle plays. */
  playVictorySound() {
    soundManager.stop('bossHurt');
    soundManager.stopMusic();
    soundManager.play('gameOver');
  }


  /** @returns {boolean} true when the death animation is over and he starts to tumble */
  isDeathAnimationFinished() {
    return this.hasFinishedDeathAnimation(this.IMAGES_DEAD);
  }


  /**
   * Normal drawing, but after the death animation he tumbles.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.isDead() && this.isDeathAnimationFinished()) {
      this.drawTumble(ctx);
    } else {
      super.draw(ctx);
    }
  }


  /**
   * Progress of the tumble from 0 to 1: fast at first, slowing down while he comes to rest.
   * @returns {number}
   */
  tumbleProgress() {
    this.tumbleStart ??= Date.now();
    let progress = Math.min(1, (Date.now() - this.tumbleStart) / this.tumbleDuration);
    return 1 - Math.pow(1 - progress, 3);
  }


  /**
   * Draws the endboss turned, smaller and sinking to the ground.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawTumble(ctx) {
    let eased = this.tumbleProgress();
    let scale = 1 - (1 - this.lyingScale) * eased;
    let startY = this.y + this.height / 2;
    let centerY = startY + (this.lyingCenterY() - startY) * eased;
    ctx.save();
    ctx.translate(this.x + this.width / 2, centerY);
    ctx.rotate((this.lyingAngle * eased * Math.PI) / 180);
    ctx.drawImage(this.img, (-this.width * scale) / 2, (-this.height * scale) / 2, this.width * scale, this.height * scale);
    ctx.restore();
  }


  /**
   * Center height at which the lying (turned and smaller) endboss touches the ground.
   * @returns {number}
   */
  lyingCenterY() {
    let radians = (this.lyingAngle * Math.PI) / 180;
    let w = this.width * this.lyingScale;
    let h = this.height * this.lyingScale;
    let halfHeight = (w * Math.abs(Math.sin(radians)) + h * Math.abs(Math.cos(radians))) / 2;
    return this.groundY - halfHeight;
  }
}
