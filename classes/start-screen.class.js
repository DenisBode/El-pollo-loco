/** The start screen with the blinking "press start" text. */
class StartScreen extends DrawableObject {
  constructor() {
    super().loadImage('img/9_intro_outro_screens/start/startscreen_1.png');
    this.x = 0;
    this.y = 0;
    this.width = 720;
    this.height = 480;
  }


  /**
   * The 16:9 image is squeezed to the 3:2 canvas, so the whole image stays visible.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    super.draw(ctx);
    if (Math.floor(Date.now() / 600) % 2 === 0) {
      this.drawStartText(ctx);
    }
  }


  /**
   * Yellow text with a brown outline, matching the title colors.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawStartText(ctx) {
    let text = 'PRESS START TO PLAY';
    ctx.font = 'bold 34px Zabars, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#a0300a';
    ctx.fillStyle = '#ffd500';
    ctx.strokeText(text, 360, 460);
    ctx.fillText(text, 360, 460);
    ctx.textAlign = 'start';
  }
}
