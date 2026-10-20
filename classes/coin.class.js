/** A coin floating in the air; it spins and glows. */
class Coin extends Collectable {
  width = 80;
  height = 80;
  spinOffset = Math.random() * Math.PI; // so the coins don't all spin in sync

  IMAGES_COIN = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];


  constructor() {
    super('img/8_coin/coin_1.png');
    this.loadImages(this.IMAGES_COIN);
    this.setOffset(20, 20, 20, 20);
    this.y = 150 + Math.random() * 100; // in the air, reachable with a jump
    this.animate();
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
    setInterval(() => this.playAnimation(this.IMAGES_COIN), 300);
  }
}
