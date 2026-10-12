class MovableObject {
  x = 200;
  y = 300;
  img;
  height = 150;
  width = 100;

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

  moveRight() {
    console.log('moving right');
  }

  moveLeft() {
    console.log('moving left');
  }
}
