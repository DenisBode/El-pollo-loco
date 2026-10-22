/** The timers of the game, the clock of the game and the pause. */

/** Every timer of the game, so stopGame can stop them all. */
let intervalIds = [];
let isPaused = false;
let pausedSince = 0;
/** All the time the game was paused, in ms, so the game clock can leave it out. */
let pausedTotal = 0;


/**
 * The clock of the game in ms: like Date.now(), but the time of a pause does not count.
 * So everything that waits for a time (an attack of the endboss, a hurt Pepe) goes on where it stopped.
 * @returns {number}
 */
function gameNow() {
  return (isPaused ? pausedSince : Date.now()) - pausedTotal;
}


/** Pauses the running game or goes on: the timers stand still, the picture freezes and the sounds are paused. */
function togglePause() {
  if (!world || world.gameEnded) return;
  isPaused = !isPaused;
  if (isPaused) {
    pausedSince = Date.now();
    soundManager.pauseAll();
  } else {
    pausedTotal += Date.now() - pausedSince;
    soundManager.resumeAll();
  }
  updatePauseButton();
  releaseFocus(document.getElementById('pauseButton'));
}


/** Ends a pause without a sound (the game is stopped or restarted). */
function resetPause() {
  if (isPaused) pausedTotal += Date.now() - pausedSince;
  isPaused = false;
  updatePauseButton();
}


/** Shows the pause or the play symbol on the pause button. */
function updatePauseButton() {
  let button = document.getElementById('pauseButton');
  button.classList.toggle('paused', isPaused);
  button.setAttribute('aria-pressed', isPaused);
}


/**
 * Starts an interval of the game; stopGame stops it. It does nothing while the game is paused.
 * @param {Function} callback
 * @param {number} delay - in milliseconds
 * @returns {number} the interval id
 */
function setGameInterval(callback, delay) {
  let id = setInterval(() => {
    if (!isPaused) callback();
  }, delay);
  intervalIds.push(id);
  return id;
}


/** Stops all intervals (and timeouts) of the game. */
function clearGameIntervals() {
  intervalIds.forEach((id) => clearInterval(id));
  intervalIds = [];
}

