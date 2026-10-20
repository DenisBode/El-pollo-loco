/** The display on top of the game: status bars and the counters for lives and bottles. */
class Hud {
  healthBar = new HealthStatusBar();
  coinBar = new CoinStatusBar();
  bottleBar = new BottleStatusBar();
  endbossBar = new EndbossStatusBar();
  livesIcon;
  bottlesIcon = new CounterIcon('img/7_statusbars/3_icons/icon_salsa_bottle.png', 375, 0, 0);
  endbossBarVisible = false;


  /** @param {number} lives - the start value of the lives counter */
  constructor(lives) {
    this.livesIcon = new CounterIcon('img/7_statusbars/3_icons/icon_health.png', 255, 0, lives);
  }


  /** @param {number} lives - the lives Pepe has left */
  updateLives(lives) {
    this.livesIcon.setCount(lives);
  }


  /** @param {number} energy - 0 to 100 */
  updateHealth(energy) {
    this.healthBar.setPercentage(energy);
  }


  /**
   * @param {number} coins - collected coins
   * @param {number} maxCoins
   */
  updateCoins(coins, maxCoins) {
    this.coinBar.setPercentage((coins / maxCoins) * 100);
  }


  /**
   * @param {number} bottles - carried bottles
   * @param {number} maxBottles
   */
  updateBottles(bottles, maxBottles) {
    this.bottlesIcon.setCount(bottles);
    this.bottleBar.setPercentage((bottles / maxBottles) * 100);
  }


  /** @param {number} energy - the energy of the endboss, 0 to 100 */
  updateEndboss(energy) {
    this.endbossBar.setPercentage(energy);
  }


  /** The endboss bar appears with the endboss and stays visible from then on. */
  showEndbossBar() {
    this.endbossBarVisible = true;
  }


  /**
   * Draws all bars and counters.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    let items = [this.healthBar, this.coinBar, this.bottleBar, this.livesIcon, this.bottlesIcon];
    if (this.endbossBarVisible) items.push(this.endbossBar);
    items.forEach((item) => item.render(ctx));
  }
}
