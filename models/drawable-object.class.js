class DrawableObject {
  /** Switch for the collision frames (blue = image, red = hitbox). true = visible, false = hidden. */
  static showFrames = true;

  x = 200;
  y = 300;
  img;
  height = 150;
  width = 100;

  offset = { top: 0, right: 0, bottom: 0, left: 0 };

  imageCache = {};
  currentImage = 0;

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (DrawableObject.showFrames && (this instanceof Character || this instanceof Chicken)) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
      let box = this.getHitbox();
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'red';
      ctx.rect(box.x, box.y, box.width, box.height);
      ctx.stroke();
    }
  }

  setOffset(top = 0, right = 0, bottom = 0, left = 0) {
    this.offset = { top, right, bottom, left };
  }

  getHitbox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
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
}
