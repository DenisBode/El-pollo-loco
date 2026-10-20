class WinScreen extends DrawableObject {
  constructor() {
    super().loadImage('img/You won, you lost/You Won B.png');
    this.width = 500;
    this.height = 104; // image is about 4.8:1
    this.x = 110;
    this.y = 188;
  }
}
