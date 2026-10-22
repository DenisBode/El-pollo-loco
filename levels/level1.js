let level1;

/** Tile width 720, minus 1 px overlap against gaps. */
const BACKGROUND_WIDTH = 719;
const FIRST_TILE_INDEX = -1;
/** The background reaches past the endboss at x 6800. */
const LAST_TILE_INDEX = 10;


/**
 * Creates the four background layers of one tile; the layer images alternate between 1 and 2.
 * @param {number} index - position of the tile
 * @returns {BackgroundObject[]}
 */
function createBackgroundTile(index) {
  let x = index * BACKGROUND_WIDTH;
  let variant = index % 2 === 0 ? '1' : '2';
  return [
    new BackgroundObject('img/5_background/layers/air.webp', x),
    new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.webp`, x),
    new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.webp`, x),
    new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.webp`, x),
  ];
}


/** @returns {BackgroundObject[]} all background tiles of the level, side by side */
function createBackgroundObjects() {
  let objects = [];
  for (let i = FIRST_TILE_INDEX; i <= LAST_TILE_INDEX; i++) {
    objects.push(...createBackgroundTile(i));
  }
  return objects;
}


/** @returns {Chicken[]} 7 chickens and 5 small chicks, spread randomly from the end of the first screen (x 720) to shortly before the endboss */
function createChickens() {
  let chickens = Array.from({ length: 7 }, () => new Chicken(720, 6200));
  let chicks = Array.from({ length: 5 }, () => new SmallChicken(720, 6200));
  return [...chickens, ...chicks];
}


/** Creates the level at game start, so enemies and clouds don't move while the start screen is shown. */
function initLevel() {
  level1 = new Level(
    [...createChickens(), new Endboss()],
    [new Cloud()],
    createBackgroundObjects(),
    Array.from({ length: 8 }, () => new Bottle()),
    Array.from({ length: 8 }, () => new Coin()),
  );
}
