let canvas;
let world;
let startScreen;
let isFlipping = false;
/** True when all images are requested (their loading is shown by the loading bar). */
let isPreloaded = false;
/** Every timer of the game, so stopGame can stop them all. */
let intervalIds = [];
let keyboard = new Keyboard();
let soundManager = new SoundManager();
let isMuted = loadMuted();

/** The short sounds that are needed right at the start; the long ones follow when the game starts. */
const START_SOUNDS = ['jump', 'landing', 'footsteps', 'getCoin1', 'getCoin2', 'ouch1', 'ouch2', 'throwBottle', 'bottleHit', 'chickenCluck'];

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


/** Called when the page is loaded: shows the start screen and preloads the images after its first picture. */
function init() {
  canvas = document.getElementById('canvas');
  applyLanguage();
  updateMuteButton();
  bindTouchButtons();
  setupFullscreen();
  startScreen = new StartScreen();
  drawStartScreen(startScreen);
  setTimeout(preloadAssets, 0);
}


/**
 * Loads all images and the first sounds while the start screen is shown, so the game starts quickly.
 * The objects are only created to load their images (the browser keeps them), their intervals are stopped at once.
 */
function preloadAssets() {
  initLevel();
  [new Character(), new Hud(5), new GameOverScreen(), new WinScreen(), new ThrowableObject(0, 0, 1)];
  clearGameIntervals();
  soundManager.preload(START_SOUNDS);
  isPreloaded = true;
}


/** @returns {boolean} true when all images are loaded and decoded, so the game can start without gaps */
function areAssetsReady() {
  return isPreloaded && DrawableObject.loadProgress() >= 1;
}


/**
 * Starts an interval of the game; stopGame stops it.
 * @param {Function} callback
 * @param {number} delay - in milliseconds
 * @returns {number} the interval id
 */
function setGameInterval(callback, delay) {
  let id = setInterval(callback, delay);
  intervalIds.push(id);
  return id;
}


/** Stops all intervals (and timeouts) of the game. */
function clearGameIntervals() {
  intervalIds.forEach((id) => clearInterval(id));
  intervalIds = [];
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
  releaseFocus(document.getElementById('fullscreenButton'));
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
  releaseFocus(document.getElementById('muteButton'));
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
  if (areAssetsReady()) DrawableObject.loadLazyImages();
  if (!isFlipping && startScreen.isLoadingDone()) flipCanvas(beginGame);
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startScreen.render(ctx);
  requestAnimationFrame(() => drawStartScreen(startScreen));
}


/**
 * The click on Start: the loading bar fills, then the canvas turns around and the game begins.
 * The music is started right here, because the browsers only allow it directly after a click.
 * Start, info and story are only for before the game, so they are hidden.
 */
function startGame() {
  if (world || startScreen.isLoading || isFlipping) return;
  document.getElementById('menuButtons').hidden = true;
  document.getElementById('languageSwitch').hidden = true;
  startScreen.startLoading();
  soundManager.startMusic();
}


/** Creates the level and the world and shows the buttons of the running game; the long sounds load while Pepe runs. */
function beginGame() {
  DrawableObject.loadLazyImages();
  document.getElementById('abortButton').hidden = false;
  document.getElementById('endButtons').hidden = true;
  document.getElementById('touchControls').hidden = false;
  initLevel();
  world = new World(canvas, keyboard, showEndButtons);
  soundManager.preload();
}


/** Shows the buttons for restart and leaving after the game is won or lost. */
function showEndButtons() {
  document.getElementById('abortButton').hidden = true;
  document.getElementById('endButtons').hidden = false;
}


/** Stops the running game completely: drawing loop, all intervals and all sounds. */
function stopGame() {
  world.stop();
  clearGameIntervals();
  world = null;
  soundManager.stopAll();
}


/** Starts a new game without reloading the page. */
function restartGame() {
  stopGame();
  soundManager.startMusic();
  beginGame();
}


/** Back to the start screen. */
function leaveGame() {
  stopGame();
  document.getElementById('abortButton').hidden = true;
  document.getElementById('endButtons').hidden = true;
  document.getElementById('touchControls').hidden = true;
  document.getElementById('menuButtons').hidden = false;
  startScreen = new StartScreen();
  document.getElementById('storyButton').dataset.i18n = 'story';
  document.getElementById('languageSwitch').hidden = false;
  applyLanguage();
  drawStartScreen(startScreen);
}


/** Turns the canvas around to show the story on its back, or back to the start image. */
function toggleStory() {
  releaseFocus(document.getElementById('storyButton'));
  if (isFlipping) return;
  flipCanvas(() => {
    startScreen.showsStory = !startScreen.showsStory;
    document.getElementById('storyButton').dataset.i18n = startScreen.showsStory ? 'back' : 'story';
    applyLanguage();
  });
}


/**
 * Turns the canvas and the language buttons by 90 degrees, calls the function while they stand edge-on,
 * and turns them on to the front. All turn around the middle of the canvas, so they look like one card.
 * @param {Function} onHalfway - changes what is drawn on the canvas
 */
async function flipCanvas(onHalfway) {
  isFlipping = true;
  let elements = [canvas, document.getElementById('languageSwitch')];
  let origins = elements.map(getFlipOrigin);
  let first = elements.map((element, i) => turn(element, origins[i], 0, 90, 'forwards'));
  await first[0].finished;
  onHalfway();
  await Promise.all(elements.map((element, i) => turn(element, origins[i], -90, 0, 'none').finished));
  first.forEach((animation) => animation.cancel());
  isFlipping = false;
}


/**
 * The middle of the canvas, measured from the top left corner of the element.
 * @param {HTMLElement} element
 * @returns {string} a transform-origin value
 */
function getFlipOrigin(element) {
  let canvasBox = canvas.getBoundingClientRect();
  let box = element.getBoundingClientRect();
  return `${canvasBox.left + canvasBox.width / 2 - box.left}px ${canvasBox.top + canvasBox.height / 2 - box.top}px`;
}


/**
 * Starts a turn around the vertical axis.
 * @param {HTMLElement} element
 * @param {string} origin - the point it turns around
 * @param {number} from - start angle in degrees
 * @param {number} to - end angle in degrees
 * @param {string} fill - 'forwards' keeps the end angle after the turn
 * @returns {Animation}
 */
function turn(element, origin, from, to, fill) {
  let frames = [from, to].map((deg) => ({ transform: `perspective(900px) rotateY(${deg}deg)`, transformOrigin: origin }));
  return element.animate(frames, { duration: 250, easing: 'ease-in-out', fill });
}


/**
 * Takes the focus off an element after a click; otherwise the space bar (jump) would press the button again.
 * @param {HTMLElement} element
 */
function releaseFocus(element) {
  element.blur();
}


/** Opens the info dialog with the controls. */
function openInfo() {
  document.getElementById('infoDialog').showModal();
}


/** Closes the info dialog. */
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
