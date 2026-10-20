let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById('canvas');
  drawStartScreen(new StartScreen());
  canvas.addEventListener('click', startGame);
}

/** Redraws the start screen until the game has started. */
function drawStartScreen(startScreen) {
  if (world) return;
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startScreen.draw(ctx);
  requestAnimationFrame(() => drawStartScreen(startScreen));
}

function startGame() {
  if (world) return;
  initLevel();
  world = new World(canvas, keyboard);
}

window.addEventListener('keydown', (e) => {
  startGame();
  if (e.key === 'ArrowRight') keyboard.RIGHT = true;
  if (e.key === 'ArrowLeft') keyboard.LEFT = true;
  if (e.key === ' ') keyboard.SPACE = true;
  if (e.key === 'ArrowDown') keyboard.DOWN = true;
  if (e.key === 'ArrowUp') keyboard.UP = true;
  if (e.key.toLowerCase() === 'd') keyboard.D = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') keyboard.RIGHT = false;
  if (e.key === 'ArrowLeft') keyboard.LEFT = false;
  if (e.key === ' ') keyboard.SPACE = false;
  if (e.key === 'ArrowDown') keyboard.DOWN = false;
  if (e.key === 'ArrowUp') keyboard.UP = false;
  if (e.key.toLowerCase() === 'd') keyboard.D = false;
});
