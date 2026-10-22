/** The display on top of the game: status bars and the counters for lives and bottles. */
class Hud {
  healthBar = new HealthStatusBar();
  coinBar = new CoinStatusBar();
  bottleBar = new BottleStatusBar();
  endbossBar = new EndbossStatusBar();
  livesIcon;
  bottlesIcon = new CounterIcon('img/7_statusbars/3_icons/icon_salsa_bottle.webp', 375, 0, 0);
  endbossBarVisible = false;
  /** The hearts that are on their way from the coin bar to the lives counter. */
  hearts = [];


  /**
   * Creates the HUD with its bars and icons.
   * @param {number} lives - the start value of the lives counter
   */
  constructor(lives) {
    this.livesIcon = new CounterIcon('img/7_statusbars/3_icons/icon_health.webp', 255, 0, lives);
  }


  /**
   * A heart floats from the full coin bar to the lives counter, so the player sees where the life comes from.
   * @param {Function} onArrive - called when the heart has arrived, the counter should go up then
   */
  sendHeart(onArrive) {
    let from = { x: this.coinBar.x + this.coinBar.width, y: this.coinBar.y + this.coinBar.height / 2 };
    let to = { x: this.livesIcon.x + this.livesIcon.width / 2, y: this.livesIcon.y + this.livesIcon.height / 2 };
    this.hearts.push(new FlyingHeart(from, to, onArrive));
  }


  /**
   * Shows the number of lives Pepe has left.
   * @param {number} lives - the lives Pepe has left
   */
  updateLives(lives) {
    this.livesIcon.setCount(lives);
  }


  /**
   * Fills the health bar to the energy of Pepe.
   * @param {number} energy - 0 to 100
   */
  updateHealth(energy) {
    this.healthBar.setPercentage(energy);
  }


  /**
   * Fills the coin bar and shows how many coins Pepe has.
   * @param {number} coins - collected coins
   * @param {number} maxCoins
   */
  updateCoins(coins, maxCoins) {
    this.coinBar.setPercentage((coins / maxCoins) * 100);
  }


  /**
   * Fills the bottle bar and shows how many bottles Pepe carries.
   * @param {number} bottles - carried bottles
   * @param {number} maxBottles
   */
  updateBottles(bottles, maxBottles) {
    this.bottlesIcon.setCount(bottles);
    this.bottleBar.setPercentage((bottles / maxBottles) * 100);
  }


  /** Makes the bottle bar blink: a throw was not possible. */
  flashBottles() {
    this.bottleBar.flash();
  }


  /**
   * Fills the bar of the endboss to his energy.
   * @param {number} energy - the energy of the endboss, 0 to 100
   */
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
    this.hearts.forEach((heart) => heart.render(ctx));
    this.hearts = this.hearts.filter((heart) => !heart.hasArrived);
  }
}
