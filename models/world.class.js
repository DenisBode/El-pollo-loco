class World {
  character = new Character();
  level = level1;
  statusBar = new HealthStatusBar();
  coinBar = new CoinStatusBar();
  bottleBar = new BottleStatusBar();
  endbossBar = new EndbossStatusBar();
  livesIcon = new CounterIcon('img/7_statusbars/3_icons/icon_health.png', 255, 0, this.character.lives);
  bottlesIcon = new CounterIcon('img/7_statusbars/3_icons/icon_salsa_bottle.png', 375, 0, 0);
  gameOverScreen = new GameOverScreen();
  winScreen = new WinScreen();
  gameWon = false;
  throwableObjects = [];
  throwKeyPressed = false;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ctx = canvas.getContext('2d');
    this.draw();
    this.setWorld();
    this.checkcollisions();
    this.run();
  }

  run() {
    setInterval(() => this.checkThrowObjects(), 1000 / 60);
    setInterval(() => this.spawnBottle(), 5000);
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
    if (pressed && !this.throwKeyPressed && this.character.bottles > 0 && !this.character.isDead() && !this.gameWon) {
      this.throwBottle();
    }
    this.throwKeyPressed = pressed;
    this.updateThrownBottles();
  }

  /** A hit bottle disappears, a missed bottle stays lying on the ground where it landed. */
  updateThrownBottles() {
    this.throwableObjects.forEach((thrown) => {
      if (!thrown.landed && !thrown.hasHit) {
        this.checkBottleHit(thrown);
      }
      if (thrown.landed) {
        this.dropBottle(thrown.x);
      }
    });
    this.throwableObjects = this.throwableObjects.filter((thrown) => !thrown.landed && !thrown.hasHit);
    this.level.enemies = this.level.enemies.filter((enemy) => !enemy.isRemovable());
  }

  /** A flying bottle damages the first living enemy it touches and is used up. */
  checkBottleHit(thrown) {
    let enemy = this.level.enemies.find((e) => !e.isDead() && thrown.isColliding(e));
    if (!enemy) return;
    enemy.hit(enemy.bottleDamage);
    thrown.hitEnemy();
    if (enemy instanceof Endboss) {
      this.endbossBar.setPercentage(enemy.energy);
    }
  }

  dropBottle(x) {
    let bottle = new Bottle();
    bottle.x = x;
    this.level.bottles.push(bottle);
  }

  throwBottle() {
    let direction = this.character.otherDirection ? -1 : 1;
    let x = direction === 1 ? this.character.x + 60 : this.character.x - 20;
    this.throwableObjects.push(new ThrowableObject(x, this.character.y + 100, direction));
    this.character.bottles--;
    this.updateBottleDisplay();
  }

  updateBottleDisplay() {
    this.bottlesIcon.setCount(this.character.bottles);
    this.bottleBar.setPercentage((this.character.bottles / this.character.maxBottles) * 100);
  }

  setWorld() {
    this.character.world = this;
  }

  checkcollisions() {
    setInterval(() => {
      this.checkEnemyCollisions();
      this.checkBottleCollisions();
      this.checkCoinCollisions();
      this.checkWin();
    }, 200);
  }

  /** The game is won as soon as the endboss has finished his death animation. */
  checkWin() {
    let boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (boss && boss.isDead() && boss.deadFrame >= boss.IMAGES_DEAD.length) {
      this.gameWon = true;
    }
  }

  /** Collects coins; a full coin bar refills the health and starts again. */
  checkCoinCollisions() {
    this.level.coins = this.level.coins.filter((coin) => {
      if (!this.character.isDead() && this.character.isColliding(coin)) {
        this.character.coins++;
        this.coinBar.setPercentage((this.character.coins / this.character.maxCoins) * 100);
        if (this.character.coins >= this.character.maxCoins) {
          this.refillHealth();
        }
        return false;
      }
      return true;
    });
  }

  refillHealth() {
    this.character.energy = 100;
    this.statusBar.setPercentage(100);
    this.character.coins = 0;
    setTimeout(() => this.coinBar.setPercentage(0), 500); // show the full bar briefly
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!this.gameWon && !this.character.isDead() && !enemy.isDead() && this.character.isColliding(enemy)) {
        console.log('Collision with Character', enemy);
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        console.log('Collission with Character, energy', this.character.energy);
      }
    });
  }

  /** Collects bottles the character touches, as long as the character can carry more. */
  checkBottleCollisions() {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      let canCollect = !this.character.isDead() && this.character.bottles < this.character.maxBottles;
      if (canCollect && this.character.isColliding(bottle)) {
        this.character.collectBottle();
        this.updateBottleDisplay();
        return false;
      }
      return true;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);

    if (!this.character.deathAnimationFinished) {
      this.addToMap(this.character);
    }

    this.ctx.translate(-this.camera_x, 0);

    if (this.character.deathAnimationFinished) {
      this.addToMap(this.gameOverScreen);
    }
    if (this.gameWon) {
      this.addToMap(this.winScreen);
    }
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.endbossBar);
    this.addToMap(this.livesIcon);
    this.addToMap(this.bottlesIcon);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }

    movableObject.draw(this.ctx);
    movableObject.drawFrame(this.ctx);

    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }
  }

  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }
}
