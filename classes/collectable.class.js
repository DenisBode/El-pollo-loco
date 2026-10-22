/** Base class for everything Pepe can pick up: it appears at a random spot along the level. */
class Collectable extends DrawableObject {
  hasFrame = true;

  /**
   * Creates a collectable object at a random place along the level.
   * @param {string} imagePath
   * @param {number} minX - leftmost possible position
   * @param {number} maxX - rightmost possible position
   */
  constructor(imagePath, minX = 200, maxX = 6400) {
    super().loadImage(imagePath);
    this.x = minX + Math.random() * (maxX - minX);
  }
}
