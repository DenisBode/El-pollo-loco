/**
 * Plays the background music and all sound effects; mute switches everything off at once.
 * The sounds are loaded completely into memory first (with new tries if the connection is bad) and played from there
 * with the Web Audio API, so they play at once, overlap each other and do not depend on the network any more.
 */
class SoundManager {
  /** All sound files: name -> path. */
  static FILES = {
    music: 'audio/background_music.mp3',
    throwBottle: 'audio/throwing_bottle.mp3',
    bottleHit: 'audio/hit_bottle.mp3',
    chickenDead: 'audio/glucking_chicken.mp3',
    bossHurt: 'audio/angry_chicken.mp3',
    snoring: 'audio/snoring_character.mp3',
    ouch1: 'audio/ouch1_character.mp3',
    ouch2: 'audio/outch2_charcter.mp3',
    chickenCluck: 'audio/glucking1_chicken.mp3',
    gameOver: 'audio/game_over.mp3',
    getCoin1: 'audio/getcoin1.mp3',
    getCoin2: 'audio/getcoin2.mp3',
    getBottle: 'audio/get_bottle.wav',
    noThrow: 'audio/no_throw.wav',
    footsteps: 'audio/foodsteps_character.mp3',
    jump: 'audio/jump_charcter.mp3',
    landing: 'audio/landing_character.mp3',
    characterDead: 'audio/dead_character.mp3',
  };

  /** The volume of each sound (0 to 1); a sound that is not listed plays with 0.5. */
  static VOLUMES = { music: 0.3, chickenCluck: 0.2, gameOver: 1 };

  /** The sounds that run in a loop until they are stopped. */
  static LOOPS = ['music', 'snoring', 'chickenCluck', 'footsteps'];

  /** How often a sound is loaded before it is given up, and after how many ms a new try is allowed. */
  static TRIES = 4;
  static RETRY_AFTER = 10000;

  /** The Web Audio context; empty if the browser has none (then the game is silent). */
  context = window.AudioContext || window.webkitAudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;
  isMuted = false;
  isPaused = false;
  /** True from the start of the game until the music is stopped: it starts as soon as it is loaded. */
  wantsMusic = false;
  /** The decoded sounds, ready to play: name -> AudioBuffer. */
  buffers = {};
  /** The loads that are running: name -> Promise. */
  requests = {};
  /** When the last load of a sound failed: name -> time in ms. */
  failedAt = {};
  /** The sources that are playing at the moment: name -> Set. */
  playing = {};
  gains = {};


  /** Connects a volume control for every sound to the master volume and unlocks the sound with the first touch or key. */
  constructor() {
    if (!this.context) return;
    this.master = this.context.createGain();
    this.master.connect(this.context.destination);
    Object.keys(SoundManager.FILES).forEach((name) => {
      this.gains[name] = this.context.createGain();
      this.gains[name].gain.value = SoundManager.VOLUMES[name] ?? 0.5;
      this.gains[name].connect(this.master);
    });
    ['pointerdown', 'keydown', 'touchend'].forEach((type) => window.addEventListener(type, () => this.unlock(), { once: true }));
  }


  /** Browsers keep the sound off until the player has touched the page; this switches it on (not during a pause). */
  unlock() {
    if (this.context && this.context.state === 'suspended' && !this.isPaused) this.context.resume();
  }


  /**
   * Loads a sound into memory; a load that is running or done is not started again.
   * After a failed load the next try waits a while, so a sound that is played often does not flood the network.
   * @param {string} name - key in SoundManager.FILES
   * @returns {Promise}
   */
  load(name) {
    let isLate = Date.now() - (this.failedAt[name] ?? -Infinity) >= SoundManager.RETRY_AFTER;
    if (!this.context || this.buffers[name] || !isLate) return Promise.resolve();
    this.requests[name] ??= this.fetchBuffer(SoundManager.FILES[name])
      .then((buffer) => (this.buffers[name] = buffer))
      .catch(() => (this.failedAt[name] = Date.now()))
      .finally(() => delete this.requests[name]);
    return this.requests[name];
  }


  /**
   * Downloads and decodes a file; if that fails (bad connection) it waits longer and longer and tries again.
   * @param {string} path
   * @returns {Promise<AudioBuffer>}
   */
  async fetchBuffer(path) {
    for (let attempt = 1; ; attempt++) {
      try {
        let response = await fetch(path);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return await this.context.decodeAudioData(await response.arrayBuffer());
      } catch (error) {
        if (attempt >= SoundManager.TRIES) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }


  /**
   * Starts loading sounds in the background, so they are ready when they are needed.
   * @param {string[]} names - keys in SoundManager.FILES; without names all sounds are loaded
   */
  preload(names = Object.keys(SoundManager.FILES)) {
    names.forEach((name) => this.load(name));
  }


  /**
   * Counts the sounds that are done with loading.
   * @param {string[]} names - keys in SoundManager.FILES
   * @returns {number} how many of them are done: loaded, or given up after the tries failed
   */
  settledCount(names) {
    if (!this.context) return names.length;
    return names.filter((name) => this.buffers[name] || (this.failedAt[name] && !this.requests[name])).length;
  }


  /**
   * Plays a sound from the beginning once; if it is still playing, it starts again.
   * @param {string} name - key in SoundManager.FILES
   */
  play(name) {
    this.stop(name);
    this.playOverlapping(name);
  }


  /**
   * Plays a sound on top of the same sound that is still playing (e.g. coins collected one after the other).
   * A sound that is not loaded yet is loaded now and not played this time.
   * @param {string} name - key in SoundManager.FILES
   */
  playOverlapping(name) {
    if (!this.context) return;
    if (!this.buffers[name]) return void this.load(name);
    this.unlock();
    let source = this.context.createBufferSource();
    source.buffer = this.buffers[name];
    source.loop = SoundManager.LOOPS.includes(name);
    source.connect(this.gains[name]);
    (this.playing[name] ??= new Set()).add(source);
    source.onended = () => this.playing[name].delete(source);
    source.start();
  }


  /**
   * Plays one random sound of the list.
   * With waitForEnd it is skipped while one of them is still playing (no sound pile-up).
   * @param {string[]} names - keys in SoundManager.FILES
   * @param {boolean} waitForEnd
   */
  playRandom(names, waitForEnd = true) {
    if (waitForEnd && names.some((name) => this.isPlaying(name))) return;
    this.play(names[Math.floor(Math.random() * names.length)]);
  }


  /**
   * Plays one random sound of the list on top of the ones that are still playing.
   * @param {string[]} names - keys in SoundManager.FILES
   */
  playRandomOverlapping(names) {
    this.playOverlapping(names[Math.floor(Math.random() * names.length)]);
  }


  /**
   * Starts a looping sound (e.g. snoring) if it is not already running.
   * @param {string} name - key in SoundManager.FILES
   */
  loop(name) {
    if (!this.isPlaying(name)) this.playOverlapping(name);
  }


  /**
   * Checks if a sound is playing at the moment.
   * @param {string} name - key in SoundManager.FILES
   * @returns {boolean} true while the sound is playing
   */
  isPlaying(name) {
    return !!this.playing[name] && this.playing[name].size > 0;
  }


  /**
   * Stops a sound.
   * @param {string} name - key in SoundManager.FILES
   */
  stop(name) {
    let sources = this.playing[name] ?? [];
    this.playing[name] = new Set();
    sources.forEach((source) => {
      source.onended = null;
      source.stop();
    });
  }


  /** Starts the background music; it begins as soon as it is loaded. Call it after a user action (e.g. the start button). */
  startMusic() {
    this.wantsMusic = true;
    this.unlock();
    this.load('music').then(() => this.wantsMusic && this.loop('music'));
  }


  /** Stops the background music. */
  stopMusic() {
    this.wantsMusic = false;
    this.stop('music');
  }


  /** Pauses everything that is playing; resumeAll goes on at the same place. */
  pauseAll() {
    this.isPaused = true;
    if (this.context) this.context.suspend();
  }


  /** Goes on with the sounds that pauseAll paused. */
  resumeAll() {
    this.isPaused = false;
    if (this.context) this.context.resume();
  }


  /** Stops the music and every effect; the next start begins from the beginning. */
  stopAll() {
    this.resumeAll();
    this.stopMusic();
    Object.keys(this.playing).forEach((name) => this.stop(name));
  }


  /**
   * Mutes or unmutes all sounds without stopping them.
   * @param {boolean} isMuted
   */
  setMuted(isMuted) {
    this.isMuted = isMuted;
    if (this.master) this.master.gain.value = isMuted ? 0 : 1;
  }
}
