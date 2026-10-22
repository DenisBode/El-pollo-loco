/** An icon with a counter next to it ("x 5"). */
class CounterIcon extends DrawableObject {
  count = 0;


  /**
   * Creates an icon with a number next to it.
   * @param {string} imagePath
   * @param {number} x
   * @param {number} y
   * @param {number} count - start value
   */
  constructor(imagePath, x, y, count = 0) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.count = count;
  }


  /**
   * Changes the number that is shown next to the icon.
   * @param {number} count
   */
  setCount(count) {
    this.count = count;
  }


  /**
   * Draws the icon and the count next to it.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    super.draw(ctx);
    ctx.font = '28px Zabars, Arial, sans-serif';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.textBaseline = 'middle';
    let text = 'x ' + this.count;
    ctx.strokeText(text, this.x + this.width, this.y + this.height / 2);
    ctx.fillText(text, this.x + this.width, this.y + this.height / 2);
  }
}
