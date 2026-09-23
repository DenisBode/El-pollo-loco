class movableObject {
  x = 120;
  y = 140;
  img;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    console.log("moving right");
  }

  moveLeft() {}
}
