/** Lets Pepe pick up the bottles and the coins he touches and gives the rewards for them. */
class ItemCollector {
  /**
   * Creates the collector of a world.
   * @param {World} world - the world with the character, the level and the HUD
   */
  constructor(world) {
    this.world = world;
  }


  /**
   * Removes the items Pepe touches (if he may collect them) and returns the remaining ones.
   * @param {DrawableObject[]} items
   * @param {Function} canCollect - asked for every item, returns true if Pepe may collect it now
   * @param {Function} onCollect - called for every collected item
   * @returns {DrawableObject[]}
   */
  collectItems(items, canCollect, onCollect) {
    return items.filter((item) => {
      if (!canCollect() || !this.world.character.isColliding(item)) return true;
      onCollect();
      return false;
    });
  }


  /** Collects bottles as long as Pepe can carry more. */
  checkBottles() {
    let { character, level, hud } = this.world;
    let canCollect = () => !character.isDead() && character.bottles < character.maxBottles;
    level.bottles = this.collectItems(level.bottles, canCollect, () => {
      character.collectBottle();
      soundManager.playOverlapping('getBottle');
      hud.updateBottles(character.bottles, character.maxBottles);
    });
  }


  /** Collects coins; a full coin bar gives Pepe a life and full health and starts again. */
  checkCoins() {
    let { character, level, hud } = this.world;
    level.coins = this.collectItems(level.coins, () => !character.isDead(), () => {
      soundManager.playRandomOverlapping(['getCoin1', 'getCoin2']);
      let isFull = character.collectCoin();
      hud.updateCoins(character.coins, character.maxCoins);
      if (isFull) this.rewardFullCoinBar();
    });
  }


  /**
   * Gives Pepe an extra life and full health. A heart floats from the coin bar to the lives counter, so the player
   * sees what the full bar is worth; the bar is emptied after a short moment.
   */
  rewardFullCoinBar() {
    let { character, hud } = this.world;
    character.energy = 100;
    character.lives++;
    hud.updateHealth(100);
    hud.sendHeart(() => hud.updateLives(character.lives));
    character.coins = 0;
    intervalIds.push(setTimeout(() => hud.updateCoins(0, character.maxCoins), 500));
  }
}
