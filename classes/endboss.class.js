/**
 * The endboss: waits until he is seen, shows an alert, then walks and attacks when Pepe is close.
 * After his death he tumbles and comes to rest on the ground.
 */
class Endboss extends Enemy {
  hasFrame = true;
  height = 400;
  width = 250;
  y = 55;
  /** Five bottles kill the endboss. */
  bottleDamage = 20;
  /** Waiting -> alert -> walking. */
  state = 'waiting';
  alertFrame = 0;
  attacking = false;
  /** While attacking he runs 3 times faster. */
  attackSpeedFactor = 3;
  /** The attack starts when Pepe is closer than this (px). */
  attackDistance = 350;
  tumbleStart = null;
  /** Ms. */
  tumbleDuration = 1800;
  /** Two full turns plus 290 degrees. */
  lyingAngle = 1010;
  /** He shrinks a bit while falling. */
  lyingScale = 0.8;
  /** The image box ends below the visible body, so this is deeper than Pepe's lower edge. */
  groundY = 500;

  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.webp',
    'img/4_enemie_boss_chicken/1_walk/G2.webp',
    'img/4_enemie_boss_chicken/1_walk/G3.webp',
    'img/4_enemie_boss_chicken/1_walk/G4.webp',
  ];

  IMAGES_ALERT = [
    'img/4_enemie_boss_chicken/2_alert/G5.webp',
    'img/4_enemie_boss_chicken/2_alert/G6.webp',
    'img/4_enemie_boss_chicken/2_alert/G7.webp',
    'img/4_enemie_boss_chicken/2_alert/G8.webp',
    'img/4_enemie_boss_chicken/2_alert/G9.webp',
    'img/4_enemie_boss_chicken/2_alert/G10.webp',
    'img/4_enemie_boss_chicken/2_alert/G11.webp',
    'img/4_enemie_boss_chicken/2_alert/G12.webp',
  ];

  IMAGES_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.webp',
    'img/4_enemie_boss_chicken/3_attack/G14.webp',
    'img/4_enemie_boss_chicken/3_attack/G15.webp',
    'img/4_enemie_boss_chicken/3_attack/G16.webp',
    'img/4_enemie_boss_chicken/3_attack/G17.webp',
    'img/4_enemie_boss_chicken/3_attack/G18.webp',
    'img/4_enemie_boss_chicken/3_attack/G19.webp',
    'img/4_enemie_boss_chicken/3_attack/G20.webp',
  ];

  IMAGES_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.webp',
    'img/4_enemie_boss_chicken/4_hurt/G22.webp',
    'img/4_enemie_boss_chicken/4_hurt/G23.webp',
  ];

  IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.webp',
    'img/4_enemie_boss_chicken/5_dead/G25.webp',
    'img/4_enemie_boss_chicken/5_dead/G26.webp',
  ];


  /** Creates the endboss at the end of the level; he is far away, so his images load after the start images. */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0], false);
    [this.IMAGES_WALKING, this.IMAGES_ALERT, this.IMAGES_ATTACK, this.IMAGES_HURT, this.IMAGES_DEAD].forEach((images) =>
      this.loadImages(images, false),
    );
    this.x = 6800;
    this.speed = 0.15 + Math.random() * 0.3;
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
