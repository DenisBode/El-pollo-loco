let canvas;
let world;
let keyboard = new Keyboard();
let soundManager = new SoundManager();
let isMuted = loadMuted();

const compactQuery = window.matchMedia('(orientation: landscape) and (max-height: 600px)');

const KEY_MAP = {
  ArrowRight: 'RIGHT',
  ArrowLeft: 'LEFT',
  ' ': 'SPACE',
  ArrowDown: 'DOWN',
  ArrowUp: 'UP',
  d: 'D',
  D: 'D',
};


/** Called when the page is loaded: shows the start screen. */
function init() {
  canvas = document.getElementById('canvas');
  updateMuteButton();
  bindTouchButtons();
  setupFullscreen();
  drawStartScreen(new StartScreen());
}


/** Shows the fullscreen button if the browser can do fullscreen and keeps the layout up to date. */
function setupFullscreen() {
  document.getElementById('fullscreenButton').hidden = !document.fullscreenEnabled;
  compactQuery.addEventListener('change', updateLayout);
  document.addEventListener('fullscreenchange', updateLayout);
  updateLayout();
}


/** The compact layout (buttons on top of the game) is used on a rotated phone and in fullscreen. */
function updateLayout() {
  let isCompact = compactQuery.matches || !!document.fullscreenElement;
  document.documentElement.classList.toggle('compact', isCompact);
}


/** Switches the game area (canvas, buttons, touch buttons) to fullscreen or back. */
function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.querySelector('.game-area').requestFullscreen().catch(() => {});
  }
  document.getElementById('fullscreenButton').blur(); // otherwise the space bar (jump) would press the button again
}


/** Lets every touch button press and release the key named in its data-key attribute. */
function bindTouchButtons() {
  document.querySelectorAll('.touch-button').forEach((button) => {
    let key = button.dataset.key;
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      keyboard[key] = true;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((type) => {
      button.addEventListener(type, () => (keyboard[key] = false));
    });
  });
}


/**
 * Reads the saved mute state; falls back to "not muted" if the local storage is not available.
 * @returns {boolean}
 */
function loadMuted() {
  try {
    return localStorage.getItem('muted') === 'true';
  } catch {
    return false;
  }
}


/** Switches the sound on or off and saves the state in the local storage. */
function toggleMute() {
  isMuted = !isMuted;
  try {
    localStorage.setItem('muted', isMuted);
  } catch {}
  updateMuteButton();
  document.getElementById('muteButton').blur(); // otherwise the space bar (jump) would press the button again
}


/** Applies the mute state to all sounds and to the look of the mute button. */
function updateMuteButton() {
  soundManager.setMuted(isMuted);
  let button = document.getElementById('muteButton');
  button.classList.toggle('muted', isMuted);
  button.setAttribute('aria-pressed', isMuted);
}


/**
 * Redraws the start screen until the game has started.
 * @param {StartScreen} startScreen
 */
function drawStartScreen(startScreen) {
  if (world) return;
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startScreen.render(ctx);
  requestAnimationFrame(() => drawStartScreen(startScreen));
}


/** Starts the game: hides the menu buttons, creates the level and the world, starts the music. */
function startGame() {
  if (world) return;
  document.getElementById('menuButtons').hidden = true; // start and info are only for before the game
  document.getElementById('endButtons').hidden = true;
  document.getElementById('touchControls').hidden = false;
  initLevel();
  world = new World(canvas, keyboard, showEndButtons);
  soundManager.startMusic();
  enterFullscreenOnTouchDevice();
}


/** On phones and tablets the game starts in fullscreen (the start button click allows it). */
function enterFullscreenOnTouchDevice() {
  let isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice && document.fullscreenEnabled && !document.fullscreenElement) {
    document.querySelector('.game-area').requestFullscreen().catch(() => {});
  }
}


/** Shows the buttons for restart and leaving after the game is won or lost. */
function showEndButtons() {
  document.getElementById('endButtons').hidden = false;
}


/** Stops the running game completely: drawing loop, all intervals and all sounds. */
function stopGame() {
  world.stop();
  let lastId = setInterval(() => {}, 1000000);
  for (let id = 1; id <= lastId; id++) clearInterval(id);
  world = null;
  soundManager.stopAll();
}


/** Starts a new game without reloading the page. */
function restartGame() {
  stopGame();
  startGame();
}


/** Back to the start screen. */
function leaveGame() {
  stopGame();
  document.getElementById('endButtons').hidden = true;
  document.getElementById('touchControls').hidden = true;
  document.getElementById('menuButtons').hidden = false;
  drawStartScreen(new StartScreen());
}


function openInfo() {
  document.getElementById('infoDialog').showModal();
}


function closeInfo() {
  document.getElementById('infoDialog').close();
}


/**
 * A click on the dialog itself (not on its content) is a click next to it, so the dialog closes.
 * @param {MouseEvent} event
 */
function closeInfoOnBackdrop(event) {
  if (event.target === event.currentTarget) closeInfo();
}


/**
 * Remembers whether a game key is pressed or released.
 * @param {KeyboardEvent} event
 * @param {boolean} isPressed
 */
function setKey(event, isPressed) {
  let key = KEY_MAP[event.key];
  if (key) keyboard[key] = isPressed;
}


window.addEventListener('keydown', (event) => setKey(event, true));
window.addEventListener('keyup', (event) => setKey(event, false));
