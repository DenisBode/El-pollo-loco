class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];

  clouds = [new Cloud()];
  backgroundObjects = [
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png'),
  ];

  ctx;
  canvas;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.addToMap(this.character);

    this.enemies.forEach((enemy) => {
      this.addToMap(enemy);
    });
    this.clouds.forEach((cloud) => {
      this.addToMap(cloud);
    });
    this.backgroundObjects.forEach((backgroundObject) => {
      this.addToMap(backgroundObject);
    });

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addToMap(movableObject) {
    this.ctx.drawImage(
      movableObject.img,
      movableObject.x,
      movableObject.y,
      movableObject.width,
      movableObject.height
    );
  }
}
