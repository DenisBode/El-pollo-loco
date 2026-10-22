/** A status bar that shows a percentage with one of six images (0, 20, 40, 60, 80, 100 %). */
class StatusBar extends DrawableObject {
  images = [];
  percentage = 100;
  /** The bar flashes (blinks dim) until this time of the game clock. */
  flashUntil = 0;


  /**
   * Builds the six image paths of a bar: folder + prefix + 0/20/40/60/80/100 + .webp
   * @param {string} folder
   * @param {string} prefix
   * @returns {string[]}
   */
  static imagePaths(folder, prefix = '') {
    return [0, 20, 40, 60, 80, 100].map((percent) => `${folder}${prefix}${percent}.webp`);
  }


  /**
   * Creates a bar; its size keeps the ratio of the images, which is 4 : 1.
   * @param {string[]} images - the six images of the bar
   * @param {number} x
   * @param {number} y
   * @param {number} percentage - start value
   */
  constructor(images, x, y, percentage = 100) {
    super();
    this.images = images;
    this.loadImages(this.images);
    this.x = x;
    this.y = y;
    this.width = 160;
    this.height = 40;
    this.setPercentage(percentage);
  }


  /** Makes the bar blink for a moment, e.g. when a throw was not possible. */
  flash() {
    this.flashUntil = gameNow() + 300;
  }


  /**
   * Draws the bar; while it flashes it is dim every other moment.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.globalAlpha = gameNow() < this.flashUntil && Math.floor(gameNow() / 70) % 2 === 0 ? 0.25 : 1;
    super.draw(ctx);
    ctx.globalAlpha = 1;
  }


  /**
   * Sets the percentage of the bar and shows the matching image.
   * @param {number} percentage - 0 to 100
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }


  /**
   * Maps the percentage (0-100) to the index of the matching image.
   * @returns {number}
   */
  resolveImageIndex() {
    if (this.percentage <= 0) return 0;
    return Math.min(5, Math.ceil(this.percentage / 20));
  }
}


/** The health bar of Pepe (starts full). */
class HealthStatusBar extends StatusBar {
  /** Creates the green health bar at the top left. */
  constructor() {
    super(StatusBar.imagePaths('img/7_statusbars/1_statusbar/2_statusbar_health/green/'), 20, 0, 100);
  }
}


/** The coin bar (starts empty). */
class CoinStatusBar extends StatusBar {
  /** Creates the orange coin bar under the health bar. */
  constructor() {
    super(StatusBar.imagePaths('img/7_statusbars/1_statusbar/1_statusbar_coin/orange/'), 20, 45, 0);
  }
}


/** The bottle bar (starts empty). */
class BottleStatusBar extends StatusBar {
  /** Creates the blue bottle bar under the coin bar. */
  constructor() {
    super(StatusBar.imagePaths('img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/'), 20, 90, 0);
  }
}


/** The endboss bar: bigger, at the bottom in the middle (the touch buttons sit in the corners), and blinking when he is almost defeated. */
class EndbossStatusBar extends StatusBar {
  /** Creates the endboss bar; it is bigger than the other bars, but has the same 4 : 1 ratio. */
  constructor() {
    super(StatusBar.imagePaths('img/7_statusbars/2_statusbar_endboss/orange/', 'orange'), 240, 410, 100);
    this.width = 240;
    this.height = 60;
  }


  /**
   * At 20 % or less the bar blinks to show that the endboss is almost defeated.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    let blinkOff = this.percentage <= 20 && this.percentage > 0 && Math.floor(Date.now() / 300) % 2 === 1;
    if (!blinkOff) {
      super.draw(ctx);
    }
  }
}
