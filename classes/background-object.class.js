/** One layer of a background tile (720 x 480). */
class BackgroundObject extends DrawableObject {
  width = 720;
  height = 480;


  /**
   * Creates one layer of the background.
   * @param {string} imagePath
   * @param {number} x - left edge of the tile
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
