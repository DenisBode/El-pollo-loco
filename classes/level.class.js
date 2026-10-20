/** Holds everything that belongs to one level. */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles;
  coins;
  levelEndX = 6600;


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
}
