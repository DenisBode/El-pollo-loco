/** The start screen; the 16:9 image is squeezed to the 3:2 canvas, so the whole image stays visible. */
class StartScreen extends DrawableObject {
  /** How long the loading bar takes at least, in milliseconds (ms), so it is always visible, even when everything is loaded at once. */
  static MIN_LOADING_TIME = 1500;

  /** true = the back side of the canvas (the story) is shown instead of the start image. */
  showsStory = false;
  /** True from the click on Start until the canvas turns around to the game. */
  isLoading = false;
  loadingSince = 0;


  /** Creates the start screen: the start image fills the whole canvas. */
  constructor() {
    super().loadImage('img/9_intro_outro_screens/start/startscreen_1.webp');
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
    else if (this.isLoading) this.drawLoadingBar(ctx);
  }


  /** Shows the loading bar; the game starts when it is full. */
  startLoading() {
    this.showsStory = false;
    this.isLoading = true;
    this.loadingSince = Date.now();
  }


  /**
   * Calculates the progress that the loading bar shows.
   * @returns {number} the progress shown in the bar: the real progress, but not faster than the minimum time allows
   */
  shownProgress() {
    return Math.min(loadProgress(), (Date.now() - this.loadingSince) / StartScreen.MIN_LOADING_TIME);
  }


  /**
   * Checks if the game can start now.
   * @returns {boolean} true when the bar is full and all images are ready
   */
  isLoadingDone() {
    return this.isLoading && areAssetsReady() && this.shownProgress() >= 1;
  }


  /**
   * A small, soft bar with the percentage at the bottom of the start image, as long as the images are loading.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawLoadingBar(ctx) {
    let progress = this.shownProgress();
    this.fillRounded(ctx, 190, 412, 340, 52, 14, 'rgba(40, 14, 4, 0.6)');
    this.drawLoadingText(ctx, progress);
    this.fillRounded(ctx, 210, 447, 300, 8, 4, 'rgba(255, 255, 255, 0.2)');
    this.fillRounded(ctx, 210, 447, Math.max(8, 300 * progress), 8, 4, '#ffd500');
  }


  /**
   * Writes the percentage above the loading bar.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} progress - from 0 to 1
   */
  drawLoadingText(ctx, progress) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd500';
    ctx.font = '20px Zabars, Arial, sans-serif';
    ctx.fillText(`${t('loading')} ${Math.round(progress * 100)} %`, 360, 435);
    ctx.textAlign = 'start';
  }


  /**
   * Fills a rectangle with rounded corners.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} radius
   * @param {string} color
   */
  fillRounded(ctx, x, y, width, height, radius, color) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fillStyle = color;
    ctx.fill();
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
