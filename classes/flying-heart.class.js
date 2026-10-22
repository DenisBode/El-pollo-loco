/** A heart that floats from the full coin bar to the lives counter; when it arrives, the counter goes up by one. */
class FlyingHeart extends DrawableObject {
  /** How long the flight takes, in milliseconds (ms). */
  static DURATION = 1100;
  /** The size of the heart at the start and at the end of the flight (px); on the way it grows by up to 30 px. */
  static SIZE = 50;
  hasArrived = false;


  /**
   * Creates a heart that starts to fly at once.
   * @param {{x: number, y: number}} from - the middle of the heart at the start
   * @param {{x: number, y: number}} to - the middle of the heart at the end
   * @param {Function} onArrive - called once when the heart has arrived
   */
  constructor(from, to, onArrive) {
    super().loadImage('img/7_statusbars/3_icons/icon_health.webp');
    this.from = from;
    this.to = to;
    this.onArrive = onArrive;
    this.startedAt = gameNow();
  }


  /**
   * Tells how far the heart has come on its way; a pause of the game does not count.
   * @returns {number} how much of the flight is done, from 0 to 1
   */
  progress() {
    return Math.min(1, (gameNow() - this.startedAt) / FlyingHeart.DURATION);
  }


  /**
   * Moves the heart along its way: it starts slowly, flies in a high arc and grows in the middle of the flight.
   * Calls onArrive at the end.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    let progress = this.progress();
    let eased = progress * progress * (3 - 2 * progress);
    let swing = Math.sin(Math.PI * progress);
    this.width = this.height = FlyingHeart.SIZE + 30 * swing;
    this.x = this.from.x + (this.to.x - this.from.x) * eased - this.width / 2;
    this.y = this.from.y + (this.to.y - this.from.y) * eased - 25 * swing - this.height / 2;
    super.render(ctx);
    if (progress >= 1 && !this.hasArrived) this.arrive();
  }


  /** Tells the HUD that the life has arrived at the counter. */
  arrive() {
    this.hasArrived = true;
    this.onArrive();
  }
}
