class MovableObject {
  x = 200;
  y = 300;
  img;
  height = 150;
  width = 100;
  speed = 0.15;
  speedY = 0;
  acceleration = 2;

  otherDirection = false;

  imageCache = {};
  currentImage = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  isColliding(movabaleObject) {
    return (
      this.x + this.width > movabaleObject.x &&
      this.y + this.height > movabaleObject.y &&
      this.x < movabaleObject.x &&
      this.y < movabaleObject.y + movabaleObject.height
    );
  }

  isAboveGround() {
    return this.y < 130;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images into the cache.
   * @param {Array} arr - An array of image paths.
   */

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.otherDirection = false;
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
    this.currentImage = 0;
  }
}
