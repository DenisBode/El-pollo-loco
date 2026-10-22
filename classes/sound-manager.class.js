/** Plays the background music and all sound effects; mute switches everything off at once. */
class SoundManager {
  music = new Audio('audio/background_music.mp3');

  effects = {
    throwBottle: new Audio('audio/throwing_bottle.mp3'),
    bottleHit: new Audio('audio/hit_bottle.mp3'),
    chickenDead: new Audio('audio/glucking_chicken.mp3'),
    bossHurt: new Audio('audio/angry_chicken.mp3'),
    snoring: new Audio('audio/snoring_character.mp3'),
    ouch1: new Audio('audio/ouch1_character.mp3'),
    ouch2: new Audio('audio/outch2_charcter.mp3'),
    chickenCluck: new Audio('audio/glucking1_chicken.mp3'),
    gameOver: new Audio('audio/game_over.mp3'),
    getCoin1: new Audio('audio/getcoin1.mp3'),
    getCoin2: new Audio('audio/getcoin2.mp3'),
    getBottle: new Audio('audio/get_bottle.wav'),
    footsteps: new Audio('audio/foodsteps_character.mp3'),
    jump: new Audio('audio/jump_charcter.mp3'),
    landing: new Audio('audio/landing_character.mp3'),
    characterDead: new Audio('audio/dead_character.mp3'),
  };

  isMuted = false;
  /** The sounds that were playing when the game was paused. */
  pausedSounds = [];


  /**
   * Sets loops and volumes: the cluck is quiet, the game over jingle is loud.
   * The sounds are created with preload "none", so the page does not wait for them.
   */
  constructor() {
    this.music.loop = true;
    this.music.volume = 0.3;
    this.effects.snoring.loop = true;
    this.effects.chickenCluck.loop = true;
    this.effects.footsteps.loop = true;
    Object.values(this.effects).forEach((sound) => (sound.volume = 0.5));
    this.effects.chickenCluck.volume = 0.2;
    this.effects.gameOver.volume = 1;
    [this.music, ...Object.values(this.effects)].forEach((sound) => (sound.preload = 'none'));
  }


  /**
   * Starts loading sounds in the background, so they are ready when they are needed.
   * @param {string[]} names - keys in effects; without names all effects are loaded (the music always)
   */
  preload(names = Object.keys(this.effects)) {
    [this.music, ...names.map((name) => this.effects[name])].forEach((sound) => {
      if (sound.preload === 'auto') return;
      sound.preload = 'auto';
      sound.load();
    });
  }


  /** Starts the background music; must be called after a user action (e.g. the start button). */
  startMusic() {
    this.music.play().catch(() => {});
  }


  /** Stops the background music and rewinds it. */
  stopMusic() {
    this.music.pause();
    this.music.currentTime = 0;
  }


  /**
   * Plays an effect once from the beginning.
   * @param {string} name - key in effects
   */
  play(name) {
    let sound = this.effects[name];
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }


  /**
   * Plays one random effect of the list.
   * With waitForEnd it is skipped while one of them is still playing (no sound pile-up).
   * @param {string[]} names - keys in effects
   * @param {boolean} waitForEnd
   */
  playRandom(names, waitForEnd = true) {
    let isPlaying = names.some((name) => !this.effects[name].paused);
    if (waitForEnd && isPlaying) return;
    this.play(names[Math.floor(Math.random() * names.length)]);
  }


  /**
   * Plays one random effect of the list on a copy, so quick repeats do not cut each other off
   * (e.g. coins collected one after the other).
   * @param {string[]} names - keys in effects
   */
  playRandomOverlapping(names) {
    this.playOverlapping(names[Math.floor(Math.random() * names.length)]);
  }


  /**
   * Plays an effect on a copy, so quick repeats do not cut each other off.
   * @param {string} name - key in effects
   */
  playOverlapping(name) {
    let original = this.effects[name];
    let copy = original.cloneNode();
    copy.volume = original.volume;
    copy.muted = this.isMuted;
    copy.play().catch(() => {});
  }


  /**
   * Starts a looping effect (e.g. snoring) if it is not already running.
   * @param {string} name - key in effects
   */
  loop(name) {
    let sound = this.effects[name];
    if (sound.paused) sound.play().catch(() => {});
  }


  /**
   * Stops an effect and rewinds it.
   * @param {string} name - key in effects
   */
  stop(name) {
    let sound = this.effects[name];
    if (sound.paused) return;
    sound.pause();
    sound.currentTime = 0;
  }


  /** Pauses everything that is playing, the music and the effects; resumeAll goes on at the same place. */
  pauseAll() {
    this.pausedSounds = [this.music, ...Object.values(this.effects)].filter((sound) => !sound.paused);
    this.pausedSounds.forEach((sound) => sound.pause());
  }


  /** Goes on with the sounds that pauseAll paused. */
  resumeAll() {
    this.pausedSounds.forEach((sound) => sound.play().catch(() => {}));
    this.pausedSounds = [];
  }


  /** Stops the music and every effect; the next start begins from the beginning. */
  stopAll() {
    this.pausedSounds = [];
    this.stopMusic();
    Object.keys(this.effects).forEach((name) => this.stop(name));
  }


  /**
   * Mutes or unmutes all sounds without stopping them.
   * @param {boolean} isMuted
   */
  setMuted(isMuted) {
    this.isMuted = isMuted;
    this.music.muted = isMuted;
    Object.values(this.effects).forEach((sound) => (sound.muted = isMuted));
  }
}
