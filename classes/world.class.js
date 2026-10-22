/** The game world: draws everything, throws bottles and checks all collisions. */
class World {
  character = new Character();
  level = level1;
  hud = new Hud(this.character.lives);
  gameOverScreen = new GameOverScreen();
  winScreen = new WinScreen();
  throwableObjects = [];
  throwKeyPressed = false;
  gameWon = false;
  gameEnded = false;
  stopped = false;
  cameraX = 0;
  ctx;
  canvas;
  keyboard;
  onGameEnd;


  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Keyboard} keyboard
   * @param {Function} onGameEnd - called once when the game is won or lost
   */
  constructor(canvas, keyboard, onGameEnd) {
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.onGameEnd = onGameEnd;
    this.ctx = canvas.getContext('2d');
    this.character.world = this;
    this.level.start();
    this.draw();
    this.run();
  }


  /** Starts the loops for throwing, collisions and new bottles. */
  run() {
    setGameInterval(() => this.runFastChecks(), 1000 / 60);
    setGameInterval(() => this.runChecks(), 200);
    setGameInterval(() => this.spawnBottle(), 5000);
  }


  /** Stops the drawing loop; the intervals are cleared by the caller. */
  stop() {
    this.stopped = true;
  }


  /** Checks that must be quick: Pepe falls and runs fast, so a stomp or a coin would be missed at five checks a second. */
  runFastChecks() {
    this.checkThrowObjects();
    this.checkStomp();
    this.checkSelfHit();
    this.checkBottleCollisions();
    this.checkCoinCollisions();
  }


  /** A bottle that is still flying hurts Pepe if he runs into it; one lying on the ground is harmless. */
  checkSelfHit() {
    this.throwableObjects.forEach((thrown) => {
      if (thrown.landed || thrown.hasHit) return;
      if (!this.character.isColliding(thrown)) {
        thrown.canHitThrower = true;
      } else if (thrown.canHitThrower) {
        this.hitByOwnBottle(thrown);
      }
    });
  }


  /**
   * Pepe takes damage (unless he is dead or invulnerable) and the bottle breaks.
   * @param {ThrowableObject} thrown
   */
  hitByOwnBottle(thrown) {
    if (this.character.isDead() || this.character.isInvulnerable()) return;
    this.character.hit();
    this.hud.updateHealth(this.character.energy);
    thrown.hitEnemy();
    soundManager.play('bottleHit');
  }


  /** Pepe jumping onto a stompable enemy from above defeats it and bounces off. */
  checkStomp() {
    if (this.character.isDead() || this.gameWon) return;
    let enemy = this.level.enemies.find((e) => this.canStomp(e));
    if (!enemy) return;
    enemy.hit(enemy.stompDamage);
    this.character.bounce();
  }


  /**
   * @param {Enemy} enemy
   * @returns {boolean} true when the enemy can be stomped, is alive and Pepe falls onto it
   */
  canStomp(enemy) {
    return enemy.canBeStomped && !enemy.isDead() && this.character.isColliding(enemy) && this.character.isStomping(enemy);
  }


  /** All checks that need to run only five times a second. */
  runChecks() {
    this.checkEnemyCollisions();
    this.checkEndboss();
    this.checkChickensInView();
    this.checkGameEnd();
  }


  /** The endboss of the level (undefined if there is none). */
  get endboss() {
    return this.level.enemies.find((enemy) => enemy instanceof Endboss);
  }


  /** Tells the page once that the game is over (won, or Pepe's death animation is finished). */
  checkGameEnd() {
    if (!this.gameEnded && (this.gameWon || this.character.isLost())) {
      this.gameEnded = true;
      this.onGameEnd();
    }
  }


  /** Every 5 seconds a new bottle appears at a random spot, as long as fewer than 5 lie on the ground. */
  spawnBottle() {
    if (this.level.bottles.length < this.character.maxBottles) {
      this.level.bottles.push(new Bottle());
    }
  }


  /** One key press throws exactly one bottle; the key must be released before the next throw. */
  checkThrowObjects() {
    let pressed = this.keyboard.D;
    if (pressed && !this.throwKeyPressed && this.canThrow()) {
      this.throwBottle();
    }
    this.throwKeyPressed = pressed;
    this.updateThrownBottles();
  }


  /** @returns {boolean} true when Pepe has a bottle and the game is still running */
  canThrow() {
    return this.character.bottles > 0 && !this.character.isDead() && !this.gameWon;
  }


  /** Throws a bottle in the direction Pepe looks, plays the sound and updates the bottle bar. */
  throwBottle() {
    let direction = this.character.otherDirection ? -1 : 1;
    let x = direction === 1 ? this.character.x + 60 : this.character.x - 20;
    this.throwableObjects.push(new ThrowableObject(x, this.character.y + 100, direction));
    soundManager.play('throwBottle');
    this.character.bottles--;
    this.hud.updateBottles(this.character.bottles, this.character.maxBottles);
  }


  /** A hit bottle splashes and then disappears, a missed bottle stays lying on the ground where it landed. */
  updateThrownBottles() {
    this.throwableObjects.forEach((thrown) => {
      if (!thrown.landed && !thrown.hasHit) this.checkBottleHit(thrown);
      if (thrown.landed) this.dropBottle(thrown.x);
    });
    this.throwableObjects = this.throwableObjects.filter((thrown) => !thrown.isFinished());
    this.level.enemies = this.level.enemies.filter((enemy) => !enemy.isRemovable());
  }


  /**
   * A flying bottle damages the first living enemy it touches and is used up.
   * @param {ThrowableObject} thrown
   */
  checkBottleHit(thrown) {
    let enemy = this.level.enemies.find((e) => !e.isDead() && thrown.isColliding(e));
    if (!enemy) return;
    enemy.hit(enemy.bottleDamage);
    thrown.hitEnemy();
    soundManager.play('bottleHit');
    if (enemy instanceof Endboss) this.hud.updateEndboss(enemy.energy);
  }


  /**
   * Lays a bottle on the ground where a thrown bottle missed.
   * @param {number} x
   */
  dropBottle(x) {
    let bottle = new Bottle();
    bottle.x = x;
    this.level.bottles.push(bottle);
  }


  /** Every living enemy that touches Pepe hurts him. */
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.canHurtPepe(enemy)) {
        this.character.hit();
        this.hud.updateHealth(this.character.energy);
      }
    });
  }


  /**
   * An enemy hurts Pepe when both are alive, the game is not won and they touch each other.
   * Not while Pepe is stomping it: the stomp check runs more often, so it wins.
   * @param {Enemy} enemy
   * @returns {boolean}
   */
  canHurtPepe(enemy) {
    let isGameOn = !this.gameWon && !this.character.isDead();
    let isStomped = enemy.canBeStomped && this.character.isStomping(enemy);
    return isGameOn && !enemy.isDead() && this.character.isColliding(enemy) && !isStomped;
  }


  /**
   * Removes the items Pepe touches (if he may collect them) and returns the remaining ones.
   * @param {DrawableObject[]} items
   * @param {Function} canCollect - asked for every item, returns true if Pepe may collect it now
   * @param {Function} onCollect - called for every collected item
   * @returns {DrawableObject[]}
   */
  collectItems(items, canCollect, onCollect) {
    return items.filter((item) => {
      if (!canCollect() || !this.character.isColliding(item)) return true;
      onCollect();
      return false;
    });
  }


  /** Collects bottles as long as Pepe can carry more. */
  checkBottleCollisions() {
    let canCollect = () => !this.character.isDead() && this.character.bottles < this.character.maxBottles;
    this.level.bottles = this.collectItems(this.level.bottles, canCollect, () => {
      this.character.collectBottle();
      this.hud.updateBottles(this.character.bottles, this.character.maxBottles);
    });
  }


  /** Collects coins; a full coin bar gives Pepe a life and full health and starts again. */
  checkCoinCollisions() {
    this.level.coins = this.collectItems(this.level.coins, () => !this.character.isDead(), () => {
      soundManager.playRandomOverlapping(['getCoin1', 'getCoin2']);
      let isFull = this.character.collectCoin();
      this.hud.updateCoins(this.character.coins, this.character.maxCoins);
      if (isFull) this.rewardFullCoinBar();
    });
  }


  /** Gives Pepe an extra life and full health and empties the coin bar after a short moment. */
  rewardFullCoinBar() {
    this.character.energy = 100;
    this.character.lives++;
    this.hud.updateHealth(100);
    this.hud.updateLives(this.character.lives);
    this.character.coins = 0;
    intervalIds.push(setTimeout(() => this.hud.updateCoins(0, this.character.maxCoins), 500));
  }


  /** The endboss bar and the alert start when he comes into view; the attack when Pepe is close. */
  checkEndboss() {
    let boss = this.endboss;
    if (!boss) return;
    if (boss.hasComeIntoView(this.character)) {
      this.hud.showEndbossBar();
      boss.startAlert();
    }
    boss.updateAttack(this.character);
    if (boss.isDead() && boss.isDeathAnimationFinished()) this.gameWon = true;
  }


  /** One shared cluck sound plays as long as at least one living chicken is in view. */
  checkChickensInView() {
    let isChickenInView = this.level.enemies.some(
      (enemy) => enemy instanceof Chicken && !enemy.isDead() && enemy.isNear(this.character, enemy.viewDistance),
    );
    if (isChickenInView) {
      soundManager.loop('chickenCluck');
    } else {
      soundManager.stop('chickenCluck');
    }
  }


  /**
   * Moves Pepe, places the camera and draws one frame; asks for the next frame until the world is stopped.
   * A frame that was requested before the stop must not move Pepe or play sounds any more.
   * @param {number} time - time stamp of the frame (given by requestAnimationFrame)
   */
  draw(time = performance.now()) {
    if (this.stopped) return;
    this.character.handleMovement(this.frameFactor(time));
    this.cameraX = -this.character.x + 100;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawWorldObjects();
    this.drawOverlays();
    requestAnimationFrame((nextTime) => this.draw(nextTime));
  }


  /**
   * How long the last frame took, in units of 1/60 s (limited to 3, so a lag does not make Pepe jump).
   * @param {number} time - time stamp of the current frame
   * @returns {number}
   */
  frameFactor(time) {
    let factor = this.lastFrameTime ? Math.min(3, (time - this.lastFrameTime) / (1000 / 60)) : 1;
    this.lastFrameTime = time;
    return factor;
  }


  /** Draws everything that moves with the camera. */
  drawWorldObjects() {
    this.ctx.translate(this.cameraX, 0);
    [this.level.backgroundObjects, this.level.clouds, this.level.bottles, this.level.coins].forEach((objects) =>
      this.addObjectsToMap(objects),
    );
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    if (!this.character.isLost()) this.character.render(this.ctx);
    this.ctx.translate(-this.cameraX, 0);
  }


  /** Draws everything that stays on the screen: end screens and the hud. */
  drawOverlays() {
    if (this.character.isLost()) this.gameOverScreen.render(this.ctx);
    if (this.gameWon) this.winScreen.render(this.ctx);
    this.hud.render(this.ctx);
  }


  /**
   * Draws the objects that are (nearly) inside the screen; the others would only cost time.
   * @param {DrawableObject[]} objects
   */
  addObjectsToMap(objects) {
    objects
      .filter((object) => object.isOnScreen(this.cameraX, this.canvas.width))
      .forEach((object) => object.render(this.ctx));
  }
}
