/** A coin floating in the air; it spins and glows. */
class Coin extends Collectable {
  width = 80;
  height = 80;
  /** So the coins don't all spin in sync. */
  spinOffset = Math.random() * Math.PI;

  IMAGES_COIN = ['img/8_coin/coin_1.webp', 'img/8_coin/coin_2.webp'];

  /** Creates a coin in the air, at a height that Pepe reaches with a jump. */
  constructor() {
    super('img/8_coin/coin_1.webp');
    this.loadImages(this.IMAGES_COIN);
    this.setOffset(25, 25, 25, 25);
    this.y = 150 + Math.random() * 100;
  }

  /**
   * The coin spins: its width shrinks to a thin edge and grows back,
   * like a turn around the vertical axis.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    let scale = Math.max(0.08, Math.abs(Math.cos(Date.now() / 250 + this.spinOffset)));
    let width = this.width * scale;
    ctx.drawImage(this.img, this.x + (this.width - width) / 2, this.y, width, this.height);
  }

  /** Switches between the two coin images. */
  animate() {
    setGameInterval(() => this.playAnimation(this.IMAGES_COIN), 300);
  }
}
