/** The blinking "You won" text. */
class WinScreen extends DrawableObject {
  /** Creates the text in the middle of the canvas; the image is about 4.8 : 1 and loads late. */
  constructor() {
    super().loadImage('img/You won, you lost/You Won B.webp', false);
    this.width = 500;
    this.height = 104;
    this.x = 110;
    this.y = 188;
  }


  /**
   * Draws the text every second half second, so it blinks.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      super.draw(ctx);
    }
  }
}
