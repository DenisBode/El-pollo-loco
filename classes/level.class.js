/** Holds everything that belongs to one level. */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles;
  coins;
  /** Pepe cannot run further to the right than this (px). */
  levelEndX = 6950;
  /**
   * The camera stops here (its left edge, px): the last screen is the arena of the endboss, so he stays in view.
   * The arena reaches from this edge to 720 px further.
   */
  cameraEndX = 6350;


  /**
   * @param {Enemy[]} enemies
   * @param {Cloud[]} clouds
   * @param {BackgroundObject[]} backgroundObjects
   * @param {Bottle[]} bottles
   * @param {Coin[]} coins
   */
  constructor(enemies, clouds, backgroundObjects, bottles, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles;
    this.coins = coins;
  }


  /** Lets enemies, clouds and coins start moving; called when the world is ready, not when they are created. */
  start() {
    [...this.enemies, ...this.clouds, ...this.coins].forEach((object) => object.animate());
  }
}
