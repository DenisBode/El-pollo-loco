/** Pepe, the player: runs, jumps, throws bottles, collects things and sleeps when nothing happens. */
class Character extends MovableObject {
  height = 300;
  y = 50;
  speed = 10;
  hasFrame = true;

  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];

  IMAGES_IDLE = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  IMAGES_LONG_IDLE = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  longIdleAfter = 5000; // ms of doing nothing until the long idle animation starts
  lastAction = Date.now();
  lives = 5;
  bottles = 0;
  maxBottles = 5;
  coins = 0;
  maxCoins = 5;
  hasJumped = false; // true from the jump until the landing, so the drop at the start has no landing sound
  isAirborne = false;
  invulnerableUntil = 0; // after a respawn nothing can hurt Pepe until this time
  invulnerableTime = 3000; // ms


  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadAllImages();
    this.setOffset(110, 20, 10, 20);
    this.applyGravity();
    this.animate();
  }


  /** Puts all images of Pepe into the cache. */
  loadAllImages() {
    [this.IMAGES_WALKING, this.IMAGES_JUMPING, this.IMAGES_HURT].forEach((images) => this.loadImages(images));
    [this.IMAGES_DEAD, this.IMAGES_IDLE, this.IMAGES_LONG_IDLE].forEach((images) => this.loadImages(images));
  }


  /** Starts the loops for control, images, idle and death. */
  animate() {
    setGameInterval(() => this.handleJump(), 1000 / 60);
    setGameInterval(() => this.updateImage(), 50); // 20 frames per second
    setGameInterval(() => this.playIdleAnimation(), 200); // idle runs slower
    setGameInterval(() => this.updateDeathAnimation(), 150);
  }


  /** True when Pepe is dead or the game is won: he does not react any more. */
  isFrozen() {
    return this.isDead() || this.world.gameWon;
  }


  /** Jumps when the jump key is pressed and Pepe stands on the ground. */
  handleJump() {
    if (this.isFrozen()) return;
    if (this.world.keyboard.SPACE && !this.isAboveGround()) this.jump();
  }


  /**
   * Runs to the right or to the left, but not out of the level. The world calls this once per drawn
   * frame, so the movement is smooth and does not depend on interval timing.
   * @param {number} frameFactor - 1 for a frame of 1/60 s, more if the frame took longer
   */
  handleMovement(frameFactor) {
    if (this.isFrozen()) return;
    let keyboard = this.world.keyboard;
    if (keyboard.RIGHT && this.x < this.world.level.levelEndX) this.moveRight(frameFactor);
    if (keyboard.LEFT && this.x > 0) {
      this.moveLeft(frameFactor);
      this.otherDirection = true;
    }
  }


  jump() {
    super.jump();
    this.hasJumped = true;
    soundManager.play('jump');
  }


  /**
   * Removes energy and plays one of the ouch sounds; nothing happens while Pepe is invulnerable.
   * @param {number} damage
   */
  hit(damage) {
    if (this.isInvulnerable()) return;
    super.hit(damage);
    soundManager.playRandom(['ouch1', 'ouch2']);
  }


  /**
   * True when Pepe is falling onto the upper part of the enemy (not when he only touches it from the side).
   * @param {Enemy} enemy
   * @returns {boolean}
   */
  isStomping(enemy) {
    let pepe = this.getHitbox();
    let target = enemy.getHitbox();
    let feet = pepe.y + pepe.height;
    return this.isAboveGround() && this.speedY < 0 && feet < target.y + target.height * 0.6;
  }


  /** Pepe bounces off a defeated enemy with a small jump. */
  bounce() {
    this.speedY = 15;
  }


  /** @returns {boolean} true for a short time after a respawn */
  isInvulnerable() {
    return Date.now() < this.invulnerableUntil;
  }


  /**
   * Pepe blinks while he is invulnerable.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    let isBlinkedOut = this.isInvulnerable() && Math.floor(Date.now() / 120) % 2 === 0;
    if (!isBlinkedOut) super.draw(ctx);
  }


  /** Picks up a bottle as long as Pepe can carry more. */
  collectBottle() {
    if (this.bottles < this.maxBottles) {
      this.bottles++;
    }
  }


  /** @returns {boolean} true when Pepe has the maximum number of coins */
  collectCoin() {
    this.coins++;
    return this.coins >= this.maxCoins;
  }


  /** Chooses the image for hurt, jump or run and updates the sounds and the idle timer. */
  updateImage() {
    if (this.isFrozen()) {
      soundManager.stop('footsteps');
      return;
    }
    this.playMovementSounds();
    this.playMovementAnimation();
    if (!this.isIdle() || this.world.keyboard.D) this.lastAction = Date.now();
  }


  playMovementAnimation() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playJumpAnimation();
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }


  /**
   * The jump images follow the flight: take-off, apex and landing, once each, whatever the duration.
   * The speed falls from +jumpSpeed (take-off) to -jumpSpeed (landing), which selects the image.
   */
  playJumpAnimation() {
    let progress = (this.jumpSpeed - this.speedY) / (2 * this.jumpSpeed);
    let last = this.IMAGES_JUMPING.length - 1;
    let index = Math.min(last, Math.max(0, Math.floor(progress * this.IMAGES_JUMPING.length)));
    this.img = this.imageCache[this.IMAGES_JUMPING[index]];
  }


  /** Footsteps while running on the ground; a landing sound when a jump ends. */
  playMovementSounds() {
    let isOnGround = !this.isAboveGround();
    let isRunning = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    if (isRunning && isOnGround) {
      soundManager.loop('footsteps');
    } else {
      soundManager.stop('footsteps');
    }
    this.playLandingSound(isOnGround);
  }


  /**
   * Plays the landing sound once after a jump, not at the start when Pepe drops to the ground.
   * @param {boolean} isOnGround
   */
  playLandingSound(isOnGround) {
    if (this.hasJumped && !isOnGround) {
      this.isAirborne = true; // the gravity needs a moment to lift him, so wait until he is really in the air
    } else if (this.isAirborne && isOnGround) {
      soundManager.play('landing');
      this.hasJumped = false;
      this.isAirborne = false;
    }
  }


  /** Standing on the ground, not moving and not hurt. */
  isIdle() {
    return !this.isHurt() && !this.isAboveGround() && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT;
  }


  /** Short idle right after stopping; after longIdleAfter ms without any action Pepe sleeps. */
  playIdleAnimation() {
    if (this.isFrozen() || !this.isIdle()) {
      soundManager.stop('snoring');
      return;
    }
    let isSleeping = Date.now() - this.lastAction > this.longIdleAfter;
    this.playSnoring(isSleeping);
    this.playAnimation(isSleeping ? this.IMAGES_LONG_IDLE : this.IMAGES_IDLE);
  }


  /** @param {boolean} isSleeping - Pepe snores as long as he sleeps */
  playSnoring(isSleeping) {
    if (isSleeping) {
      soundManager.loop('snoring');
    } else {
      soundManager.stop('snoring');
    }
  }


  /** Plays the dead images once; afterwards Pepe respawns if he has a life left. */
  updateDeathAnimation() {
    if (!this.isDead()) return;
    if (this.isDeathAnimationFinished()) {
      if (this.lives > 0) this.respawn();
      return;
    }
    if (this.deathFrame === 0) this.startDying();
    this.playDeathAnimation(this.IMAGES_DEAD);
  }


  /** Pepe dies: the dead sound plays and he loses a life. */
  startDying() {
    soundManager.play('characterDead');
    this.lives--;
    this.world.hud.updateLives(this.lives);
  }


  /** Pepe falls from the sky at the place where he died, with full health and a short time of invulnerability. */
  respawn() {
    this.energy = 100;
    this.deathFrame = 0;
    this.y = -this.height; // above the top edge of the screen, the gravity pulls him down
    this.speedY = 0;
    this.hasJumped = true; // so the landing sound plays when he touches the ground
    this.lastAction = Date.now();
    this.invulnerableUntil = Date.now() + this.invulnerableTime;
    this.world.hud.updateHealth(this.energy);
  }


  /** @returns {boolean} true when all dead images were shown */
  isDeathAnimationFinished() {
    return this.hasFinishedDeathAnimation(this.IMAGES_DEAD);
  }


  /** @returns {boolean} true when Pepe is dead and has no life left: the game is lost */
  isLost() {
    return this.isDead() && this.lives <= 0 && this.isDeathAnimationFinished();
  }
}
