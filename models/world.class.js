class World {
  character = new Character();
  level = level1;
  statusBar = new StatusBar();
  gameOverScreen = new GameOverScreen();
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
  }

  setWorld() {
    this.character.world = this;
  }

  checkcollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (!this.character.isDead() && this.character.isColliding(enemy)) {
          console.log('Collision with Character', enemy);
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
          console.log('Collission with Character, energy', this.character.energy);
        }
      });
    }, 200);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);

    if (!this.character.deathAnimationFinished) {
      this.addToMap(this.character);
    }

    this.ctx.translate(-this.camera_x, 0);

    if (this.character.deathAnimationFinished) {
      this.addToMap(this.gameOverScreen);
    }
    this.addToMap(this.statusBar);

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
