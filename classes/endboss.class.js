/**
 * The endboss: waits until he is seen and shows an alert. Then he fights: he walks up to Pepe, charges at him,
 * backs off, rests, and sometimes jumps. The less energy he has, the faster and angrier he gets.
 * After his death he tumbles and comes to rest on the ground.
 */
class Endboss extends Enemy {
  hasFrame = true;
  height = 390;
  width = 244;
  y = 65;
  /** Five bottles kill the endboss. */
  bottleDamage = 20;
  /** Waiting -> alert -> fighting. */
  state = 'waiting';
  alertFrame = 0;
  /** True while he charges or jumps: the attack images are shown. */
  attacking = false;
  /** The character he fights (set by the world). */
  target;
  /** The current move of the fight: one of the keys of Endboss.ACTIONS. */
  action = 'walk';
  actionSince = 0;
  /** The ground height; a jump lifts him from here. */
  baseY = 65;
  /**
   * The most he moves to the left and to the right (px): the last screen, where the camera stops (see Level.cameraEndX).
   * On the right he stays fully inside the screen.
   */
  arenaLeft = 6350;
  arenaRight = 6826;
  /** Distance to Pepe under which he starts an attack (px). */
  attackDistance = 500;
  /** Pepe must be further than this from his middle (px) before he turns around or moves towards him. */
  turnZone = 40;
  /**
   * How high a jump lifts him (px). It has to be high enough that his feet are above Pepe's head
   * (the top of Pepe's hitbox is 110 px below the top of his image), so Pepe can run underneath.
   */
  jumpHeight = 170;
  /** In the air the hitbox ends higher, at his body: the dangling feet do not hurt Pepe (offset at the bottom, px). */
  airBottomOffset = 60;
  tumbleStart = null;
  /** Ms. */
  tumbleDuration = 1800;
  /** Two full turns plus 290 degrees. */
  lyingAngle = 1010;
  /** He shrinks a bit while falling. */
  lyingScale = 0.8;
  /** The image box ends below the visible body, so this is deeper than Pepe's lower edge. */
  groundY = 500;

  /**
   * The moves of the fight: speed in px per step (60 steps a second) and duration in ms.
   * Charging is slower than Pepe (10 px per step), so he can always run away.
   */
  static ACTIONS = {
    walk: { speed: 2.5, duration: 1600 },
    charge: { speed: 6, duration: 900 },
    retreat: { speed: 3, duration: 1100 },
    rest: { speed: 0, duration: 700 },
    jump: { speed: 3.5, duration: 1500 },
  };

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
    this.setOffset(45, 10, 14, 22);
    this.x = 6800;
  }


  /** One step of the fight, 60 times a second: he does his current move until its time is over. */
  move() {
    if (this.isDead() || this.state !== 'fighting' || !this.target) return;
    let config = Endboss.ACTIONS[this.action];
    let elapsed = Date.now() - this.actionSince;
    if (elapsed >= this.durationOf(config)) return this.chooseNextAction();
    this.faceTarget();
    this.x += this.directionOfAction() * config.speed * this.rage();
    this.x = Math.min(this.arenaRight, Math.max(this.arenaLeft, this.x));
    this.y = this.baseY - this.jumpLift(elapsed / config.duration);
  }


  /**
   * How angry he is: 1 with full energy, up to 1.5 when he is almost defeated.
   * @returns {number}
   */
  rage() {
    return 1 + (1 - this.energy / 100) * 0.5;
  }


  /**
   * The angrier he is, the shorter he rests.
   * @param {{speed: number, duration: number}} config
   * @returns {number} the duration of the move in ms
   */
  durationOf(config) {
    return this.action === 'rest' ? config.duration / this.rage() : config.duration;
  }


  /** @returns {number} how far Pepe's middle is from the middle of the endboss in px; positive when Pepe is on the right */
  offsetToPepe() {
    return this.target.x + this.target.width / 2 - (this.x + this.width / 2);
  }


  /** He looks at Pepe. Only when Pepe is clearly on the other side, so he does not flicker while Pepe runs through him. */
  faceTarget() {
    let offset = this.offsetToPepe();
    if (Math.abs(offset) > this.turnZone) this.otherDirection = offset > 0;
  }


  /**
   * @returns {number} 1 to the right, -1 to the left: towards Pepe, or away from him while he backs off;
   * 0 while Pepe is in the middle of him, so he does not shake from side to side
   */
  directionOfAction() {
    let offset = this.offsetToPepe();
    let towardsPepe = Math.abs(offset) > this.turnZone ? Math.sign(offset) : 0;
    return this.action === 'retreat' ? -towardsPepe : towardsPepe;
  }


  /**
   * @param {number} progress - how much of the move is done, from 0 to 1
   * @returns {number} the height of the jump in px; 0 for every move except the jump
   */
  jumpLift(progress) {
    return this.action === 'jump' ? this.jumpHeight * Math.sin(Math.PI * progress) : 0;
  }


  /** Charge and jump are followed by a retreat or a rest; after that he picks a new attack. */
  chooseNextAction() {
    let next = { charge: 'retreat', retreat: 'rest', jump: 'rest' }[this.action];
    this.startAction(next || this.pickAttack(Math.abs(this.target.x - this.x)));
  }


  /**
   * He walks up to Pepe first; when close, he charges or (in two of five cases) jumps.
   * @param {number} distance - to Pepe in px
   * @returns {string} the name of the move
   */
  pickAttack(distance) {
    if (distance > this.attackDistance) return 'walk';
    return Math.random() < 0.4 ? 'jump' : 'charge';
  }


  /**
   * @param {string} name - one of the keys of Endboss.ACTIONS
   */
  startAction(name) {
    this.action = name;
    this.actionSince = Date.now();
    this.attacking = name === 'charge' || name === 'jump';
    this.y = this.baseY;
    this.setOffset(45, 10, name === 'jump' ? this.airBottomOffset : 14, 22);
  }


  /** Dead, alert or walking images; while he is waiting the image stays as it is. */
  updateImage() {
    if (this.isDead()) {
      this.playDeathAnimation(this.IMAGES_DEAD);
    } else if (this.state === 'alert') {
      this.playAlertAnimation();
    } else if (this.state === 'fighting') {
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


  /** Plays the alert images once, then the fight begins. */
  playAlertAnimation() {
    if (this.alertFrame < this.IMAGES_ALERT.length) {
      this.img = this.imageCache[this.IMAGES_ALERT[this.alertFrame]];
      this.alertFrame++;
    } else {
      this.state = 'fighting';
      this.startAction('walk');
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
