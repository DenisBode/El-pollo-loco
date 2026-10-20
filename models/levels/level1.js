let level1;

const BACKGROUND_WIDTH = 719; // tile width 720, minus 1 px overlap against gaps
const FIRST_TILE_INDEX = -1;
const LAST_TILE_INDEX = 10; // background reaches past the endboss at x 6800

/** Creates the four background layers for one tile; the layer images alternate between 1 and 2. */
function createBackgroundTile(index) {
  let x = index * BACKGROUND_WIDTH;
  let variant = index % 2 === 0 ? '1' : '2';
  return [
    new BackgroundObject('img/5_background/layers/air.png', x),
    new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.png`, x),
    new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.png`, x),
    new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.png`, x),
  ];
}

function createBackgroundObjects() {
  let objects = [];
  for (let i = FIRST_TILE_INDEX; i <= LAST_TILE_INDEX; i++) {
    objects.push(...createBackgroundTile(i));
  }
  return objects;
}

/** 10 chickens, spread randomly from the end of the first screen (x 720) to shortly before the endboss. */
function createChickens() {
  return Array.from({ length: 10 }, () => new Chicken(720, 6200));
}

/** Creates the level at game start, so enemies and clouds don't move while the start screen is shown. */
function initLevel() {
  level1 = new Level(
    [...createChickens(), new Endboss()],
    [new Cloud()],
    createBackgroundObjects(),
    [new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle()],
    [new Coin(), new Coin(), new Coin(), new Coin(), new Coin()],
  );
}
