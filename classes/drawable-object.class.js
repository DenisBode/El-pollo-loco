/**
 * Base class for everything that is drawn on the canvas:
 * position, size, images, mirroring and the hitbox.
 */
class DrawableObject {
  /** Switch for the collision frames (blue = image, red = hitbox). true = visible, false = hidden. */
  static showFrames = false;

  x = 200;
  y = 300;
  img;
  height = 150;
  width = 100;
  otherDirection = false;
  hasFrame = false;
  offset = { top: 0, right: 0, bottom: 0, left: 0 };
  imageCache = {};
  currentImage = 0;

  /** Every image is loaded only once and shared by path, so a new game does not load them again. */
  static imagePool = {};
  /** Only the images the game needs at the start; the loading bar waits for these. */
  static imagesTotal = 0;
  static imagesDone = 0;
  /** Images that are needed late (endboss, end screens); they load after the start images. */
  static lazyPaths = [];


  /** @returns {number} the share of the requested images that are loaded and decoded, from 0 to 1 */
  static loadProgress() {
    return DrawableObject.imagesTotal === 0 ? 0 : DrawableObject.imagesDone / DrawableObject.imagesTotal;
  }


  /**
   * Returns the shared image of a path. A needed image starts loading at once and is counted by the loading bar
   * (a broken image counts as done, so it cannot block the start for ever); a late image only waits in a list.
   * @param {string} path
   * @param {boolean} isNeeded - false for images that are needed late in the game
   * @returns {HTMLImageElement}
   */
  static getImage(path, isNeeded = true) {
    let pool = DrawableObject.imagePool;
    if (pool[path]) return pool[path];
    pool[path] = new Image();
    if (!isNeeded) {
      DrawableObject.lazyPaths.push(path);
      return pool[path];
    }
    pool[path].src = path;
    DrawableObject.imagesTotal++;
    pool[path].decode().catch(() => {}).finally(() => DrawableObject.imagesDone++);
    return pool[path];
  }


  /** Starts loading the late images; called when the start images are ready. */
  static loadLazyImages() {
    DrawableObject.lazyPaths.splice(0).forEach((path) => {
      DrawableObject.imagePool[path].src = path;
      DrawableObject.imagePool[path].decode().catch(() => {});
    });
  }


  /**
   * Draws the object (mirrored if it looks to the left) and the optional collision frames.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    if (this.otherDirection) this.flipImage(ctx);
    this.draw(ctx);
    this.drawFrame(ctx);
    if (this.otherDirection) this.flipImageBack(ctx);
  }


  /**
   * Draws the current image.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }


  /**
   * Draws the image frame (blue) and the hitbox (red) if the frames are switched on.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawFrame(ctx) {
    if (!DrawableObject.showFrames || !this.hasFrame) return;
    this.strokeRect(ctx, 'blue', 5, this);
    this.strokeRect(ctx, 'red', 3, this.getHitbox());
  }


  /**
   * Strokes a rectangle outline.
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} color
   * @param {number} lineWidth
   * @param {{x: number, y: number, width: number, height: number}} rect
   */
  strokeRect(ctx, color, lineWidth, rect) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.stroke();
  }


  /**
   * Starts mirroring; flipImageBack has to follow after drawing.
   * @param {CanvasRenderingContext2D} ctx
   */
  flipImage(ctx) {
    ctx.save();
    ctx.translate(this.width, 0);
    ctx.scale(-1, 1);
    this.x = this.x * -1;
  }


  /**
   * Ends the mirroring started by flipImage.
   * @param {CanvasRenderingContext2D} ctx
   */
  flipImageBack(ctx) {
    this.x = this.x * -1;
    ctx.restore();
  }


  /**
   * Sets how many pixels the hitbox is shrunk on each side of the image (negative values grow it).
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @param {number} left
   */
  setOffset(top = 0, right = 0, bottom = 0, left = 0) {
    this.offset = { top, right, bottom, left };
  }


  /**
   * Returns the collision rectangle with the offsets applied.
   * @returns {{x: number, y: number, width: number, height: number}}
   */
  getHitbox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
  }


  /**
   * Checks if the hitboxes of both objects overlap.
   * @param {DrawableObject} other
   * @returns {boolean}
   */
  isColliding(other) {
    let a = this.getHitbox();
    let b = other.getHitbox();
    return a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height;
  }


  /**
   * Checks if the other object is closer than the given distance (horizontally).
   * @param {DrawableObject} other
   * @param {number} distance - in pixels
   * @returns {boolean}
   */
  isNear(other, distance) {
    return Math.abs(this.x - other.x) < distance;
  }


  /**
   * True if the object is inside the visible part of the world (with a margin, for turned or big objects).
   * @param {number} cameraX - the camera offset (negative while Pepe runs to the right)
   * @param {number} screenWidth
   * @param {number} margin - extra distance in pixels
   * @returns {boolean}
   */
  isOnScreen(cameraX, screenWidth, margin = 200) {
    return this.x + this.width > -cameraX - margin && this.x < -cameraX + screenWidth + margin;
  }


  /**
   * Loads a single image.
   * @param {string} path
   * @param {boolean} isNeeded - false for an image that is needed late in the game
   */
  loadImage(path, isNeeded = true) {
    this.img = DrawableObject.getImage(path, isNeeded);
  }


  /**
   * Loads multiple images into the cache.
   * @param {string[]} paths - an array of image paths
   * @param {boolean} isNeeded - false for images that are needed late in the game
   */
  loadImages(paths, isNeeded = true) {
    paths.forEach((path) => (this.imageCache[path] = DrawableObject.getImage(path, isNeeded)));
  }


  /**
   * Shows the next image of the list; the list is played in a loop.
   * @param {string[]} images - image paths from the cache
   */
  playAnimation(images) {
    let path = images[this.currentImage % images.length];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
}
