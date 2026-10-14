class MovableObject {
  x = 200;
  y = 300;
  img;
  height = 150;
  width = 100;
  speed = 0.15;
  otherDirection = false;

  imageCache = {};
  currentImage = 0;

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
    console.log('moving right');
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed; // Move the cloud to the left
    }, 1000 / 60); // 60 frames per second
  }
}