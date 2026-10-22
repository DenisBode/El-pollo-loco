/** The screen while the game is paused: the picture is darkened and says "Pause". */
class PauseScreen extends DrawableObject {
  /** Creates the screen: it covers the whole canvas and needs no image. */
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = 720;
    this.height = 480;
  }


  /**
   * Draws the dark layer with the big word and the hint how to go on.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.fillStyle = 'rgba(20, 8, 2, 0.6)';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd500';
    ctx.font = '72px Zabars, Arial, sans-serif';
    ctx.fillText(t('pause'), 360, 235);
    ctx.fillStyle = '#f5e6c8';
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText(t('pauseHint'), 360, 285);
    ctx.textAlign = 'start';
  }
}
