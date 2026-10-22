/** Pepe, the player: runs, jumps, throws bottles, collects things and sleeps when nothing happens. */
class Character extends MovableObject {
  height = 300;
  y = 50;
  speed = 10;
  hasFrame = true;

  IMAGES_WALKING = DrawableObject.numberedPaths('img/2_character_pepe/2_walk/', 'W-', 21, 26);

  IMAGES_JUMPING = DrawableObject.numberedPaths('img/2_character_pepe/3_jump/', 'J-', 31, 39);

  IMAGES_HURT = DrawableObject.numberedPaths('img/2_character_pepe/4_hurt/', 'H-', 41, 43);

  IMAGES_DEAD = DrawableObject.numberedPaths('img/2_character_pepe/5_dead/', 'D-', 51, 57);

  IMAGES_IDLE = DrawableObject.numberedPaths('img/2_character_pepe/1_idle/idle/', 'I-', 1, 10);

  IMAGES_LONG_IDLE = DrawableObject.numberedPaths('img/2_character_pepe/1_idle/long_idle/', 'I-', 11, 20);

  /** How long Pepe does nothing until the long idle animation starts, in milliseconds (ms). */
  longIdleAfter = 5000;
  lastAction = gameNow();
  lives = 3;
  bottles = 0;
  maxBottles = 5;
  coins = 0;
  maxCoins = 5;
  /** True from the jump until the landing, so the drop at the start has no landing sound. */
  hasJumped = false;
  isAirborne = false;
  /** After a respawn nothing can hurt Pepe until this time. */
  invulnerableUntil = 0;
  /** How long Pepe is invulnerable after a respawn, in milliseconds (ms). */
  invulnerableTime = 3000;

  /** Creates Pepe: loads his images, sets his hitbox and starts the gravity and the loops. */
  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadAllImages();
    this.setOffset(110, 30, 15, 20);
    this.applyGravity();
    this.animate();
  }

  /** Puts all images of Pepe into the cache. */
  loadAllImages() {
    [this.IMAGES_WALKING, this.IMAGES_JUMPING, this.IMAGES_HURT].forEach((images) =>
      this.loadImages(images)
    );
    [this.IMAGES_DEAD, this.IMAGES_IDLE, this.IMAGES_LONG_IDLE].forEach((images) =>
      this.loadImages(images)
    );
  }

  /** Starts the loops for control (60 times a second), images (20 a second), idle (5 a second, it runs slower) and death. */
  animate() {
    setGameInterval(() => this.handleJump(), 1000 / 60);
    setGameInterval(() => this.updateImage(), 50);
    setGameInterval(() => this.playIdleAnimation(), 200);
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
    if (this.canMoveRight()) this.moveRight(frameFactor);
    if (this.canMoveLeft()) {
      this.moveLeft(frameFactor);
      this.otherDirection = true;
    }
  }

  /**
   * Checks if Pepe may run to the right.
   * @returns {boolean} true when the right key is pressed and the end of the level is not reached
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX;
  }

  /**
   * Checks if Pepe may run to the left.
   * @returns {boolean} true when the left key is pressed and Pepe is not at the start of the level
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /** Pepe jumps and the jump sound plays; hasJumped makes the landing sound play later. */
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
    return this.isFalling() && this.isFootAboveEnemyMiddle(enemy);
  }

  /**
   * Checks if Pepe is falling; that is the first condition for a stomp.
   * @returns {boolean} true while Pepe is in the air and moving downwards
   */
  isFalling() {
    return this.isAboveGround() && this.speedY < 0;
  }

  /**
   * A fast fall moves Pepe up to 30 px in one step, so his feet can jump from above the enemy to deep inside it.
   * That is why the position before the last step counts, not the position now.
   * @param {Enemy} enemy
   * @returns {boolean} true when Pepe's feet were above the lower 40% of the enemy before the last step
   */
  isFootAboveEnemyMiddle(enemy) {
    let pepe = this.getHitbox();
    let target = enemy.getHitbox();
    let previousFeet = pepe.y + pepe.height - (this.y - this.previousY);
    return previousFeet < target.y + target.height * 0.6;
  }

  /** Pepe bounces off a defeated enemy with a small jump. */
  bounce() {
    this.speedY = 15;
  }

  /**
   * Checks if Pepe is still protected after a respawn.
   * @returns {boolean} true for a short time after a respawn
   */
  isInvulnerable() {
    return gameNow() < this.invulnerableUntil;
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

  /**
   * Counts one more coin for Pepe.
   * @returns {boolean} true when Pepe has the maximum number of coins
   */
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
    if (!this.isIdle() || this.world.keyboard.D) this.lastAction = gameNow();
  }

  /** Hurt images come first, then the jump images in the air, then the walking images while a key is pressed. */
  playMovementAnimation() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playJumpAnimation();
    } else if (this.isMoveKeyPressed()) {
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
    if (this.isMoveKeyPressed() && isOnGround) {
      soundManager.loop('footsteps');
    } else {
      soundManager.stop('footsteps');
    }
    this.playLandingSound(isOnGround);
  }

  /**
   * Plays the landing sound once after a jump, not at the start when Pepe drops to the ground.
   * The gravity needs a moment to lift him, so the flag isAirborne waits until he is really in the air.
   * @param {boolean} isOnGround
   */
  playLandingSound(isOnGround) {
    if (this.hasJumped && !isOnGround) {
      this.isAirborne = true;
    } else if (this.isAirborne && isOnGround) {
      soundManager.play('landing');
      this.hasJumped = false;
      this.isAirborne = false;
    }
  }

  /** Standing on the ground, not moving and not hurt. */
  isIdle() {
    return !this.isHurt() && !this.isAboveGround() && !this.isMoveKeyPressed();
  }

  /**
   * Checks if the player tells Pepe to run.
   * @returns {boolean} true when the left or the right key is pressed
   */
  isMoveKeyPressed() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /** Short idle right after stopping; after longIdleAfter ms without any action Pepe sleeps. */
  playIdleAnimation() {
    if (this.isFrozen() || !this.isIdle()) {
      soundManager.stop('snoring');
      return;
    }
    let isSleeping = gameNow() - this.lastAction > this.longIdleAfter;
    this.playSnoring(isSleeping);
    this.playAnimation(isSleeping ? this.IMAGES_LONG_IDLE : this.IMAGES_IDLE);
  }

  /**
   * Plays or stops the snoring sound.
   * @param {boolean} isSleeping - Pepe snores as long as he sleeps
   */
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

  /**
   * Pepe falls from the sky at the place where he died, with full health and a short time of invulnerability.
   * He starts above the top edge of the screen (the gravity pulls him down); hasJumped makes the landing sound play.
   */
  respawn() {
    this.energy = 100;
    this.deathFrame = 0;
    this.y = -this.height;
    this.speedY = 0;
    this.hasJumped = true;
    this.lastAction = gameNow();
    this.invulnerableUntil = gameNow() + this.invulnerableTime;
    this.world.hud.updateHealth(this.energy);
  }

  /**
   * Checks if the death animation of Pepe has run through.
   * @returns {boolean} true when all dead images were shown
   */
  isDeathAnimationFinished() {
    return this.hasFinishedDeathAnimation(this.IMAGES_DEAD);
  }

  /**
   * Checks if the game is lost, which is when Pepe is dead and has no life left.
   * @returns {boolean} true when Pepe is dead and has no life left: the game is lost
   */
  isLost() {
    return this.isDead() && this.lives <= 0 && this.isDeathAnimationFinished();
  }
}
