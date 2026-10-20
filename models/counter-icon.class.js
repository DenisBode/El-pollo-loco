class CounterIcon extends DrawableObject {
  count = 0;

  constructor(imagePath, x, y, count = 0) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.count = count;
  }

  setCount(count) {
    this.count = count;
  }

  /** Draws the icon and the count ("x 5") next to it. */
  draw(ctx) {
    super.draw(ctx);
    ctx.font = '28px Boogaloo, Arial, sans-serif';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.textBaseline = 'middle';
    let text = 'x ' + this.count;
    ctx.strokeText(text, this.x + this.width, this.y + this.height / 2);
    ctx.fillText(text, this.x + this.width, this.y + this.height / 2);
  }
}
