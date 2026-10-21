/** The start screen; the 16:9 image is squeezed to the 3:2 canvas, so the whole image stays visible. */
class StartScreen extends DrawableObject {
  /** true = the back side of the canvas (the story) is shown instead of the start image. */
  showsStory = false;


  constructor() {
    super().loadImage('img/9_intro_outro_screens/start/startscreen_1.png');
    this.x = 0;
    this.y = 0;
    this.width = 720;
    this.height = 480;
  }


  /**
   * Draws the start image, or the story on a dark panel if the canvas is turned around.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    super.draw(ctx);
    if (this.showsStory) this.drawStory(ctx);
    else if (!areAssetsReady()) this.drawLoadingBar(ctx);
  }


  /**
   * A bar with the percentage at the bottom of the start image, as long as the images are loading.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawLoadingBar(ctx) {
    let progress = DrawableObject.loadProgress();
    ctx.fillStyle = 'rgba(40, 14, 4, 0.85)';
    ctx.fillRect(150, 396, 420, 64);
    this.drawLoadingText(ctx, progress);
    ctx.strokeStyle = '#ffd500';
    ctx.lineWidth = 3;
    ctx.strokeRect(170, 438, 380, 14);
    ctx.fillRect(170, 438, 380 * progress, 14);
  }


  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} progress - from 0 to 1
   */
  drawLoadingText(ctx, progress) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd500';
    ctx.font = '24px Zabars, Arial, sans-serif';
    ctx.fillText(`${t('loading')} ${Math.round(progress * 100)} %`, 360, 428);
    ctx.textAlign = 'start';
  }


  /**
   * Yellow title and cream text on a brown panel, matching the colors of the game.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawStory(ctx) {
    ctx.fillStyle = 'rgba(40, 14, 4, 0.94)';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd500';
    ctx.font = '48px Zabars, Arial, sans-serif';
    ctx.fillText(t('storyTitle'), 360, 90);
    ctx.fillStyle = '#f5e6c8';
    ctx.font = '24px Arial, sans-serif';
    this.wrapText(ctx, t('storyText'), 600).forEach((line, i) => ctx.fillText(line, 360, 160 + i * 36));
    ctx.textAlign = 'start';
  }


  /**
   * Splits a text into lines that are not wider than the given width.
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} text
   * @param {number} maxWidth - in pixels
   * @returns {string[]}
   */
  wrapText(ctx, text, maxWidth) {
    let lines = [''];
    text.split(' ').forEach((word) => {
      let line = lines[lines.length - 1];
      let extended = line ? line + ' ' + word : word;
      if (line && ctx.measureText(extended).width > maxWidth) lines.push(word);
      else lines[lines.length - 1] = extended;
    });
    return lines;
  }
}
