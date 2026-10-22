const TRANSLATIONS = {
  en: {
    start: 'Start',
    info: 'Info',
    story: 'Story',
    back: 'Back',
    restart: 'Restart',
    leave: 'Leave game',
    mute: 'Mute sounds',
    runLeft: 'Run left',
    runRight: 'Run right',
    throwBottle: 'Throw bottle',
    jumpUp: 'Jump',
    close: 'Close',
    abort: 'Abort game',
    pause: 'Pause',
    pauseHint: 'Press P or the pause button to go on',
    loading: 'Loading',
    language: 'Language',
    controls: 'Controls',
    run: 'Run',
    jump: 'Jump',
    throw: 'Throw bottle',
    impressum: 'Impressum',
    rotate: 'Turn your device to play',
    storyTitle: 'The Story',
    storyText:
      'Pepe lived in peace on his hacienda, until the crazy chickens took over the village. ' +
      'Now he has had enough! Run through the desert, collect coins and bottles, and stomp or ' +
      'throw your way past the chickens. At the end waits the giant Big Chicken. ' +
      'Can Pepe win his home back?',
  },
  de: {
    start: 'Start',
    info: 'Info',
    story: 'Story',
    back: 'Zurück',
    restart: 'Neustart',
    leave: 'Spiel verlassen',
    mute: 'Ton ausschalten',
    runLeft: 'Nach links laufen',
    runRight: 'Nach rechts laufen',
    throwBottle: 'Flasche werfen',
    jumpUp: 'Springen',
    close: 'Schließen',
    abort: 'Spiel abbrechen',
    pause: 'Pause',
    pauseHint: 'Mit P oder dem Pause-Button geht es weiter',
    loading: 'Laden',
    language: 'Sprache',
    controls: 'Steuerung',
    run: 'Laufen',
    jump: 'Springen',
    throw: 'Flasche werfen',
    impressum: 'Impressum',
    rotate: 'Drehe dein Gerät, um zu spielen',
    storyTitle: 'Die Geschichte',
    storyText:
      'Pepe lebte friedlich auf seiner Hacienda, bis die verrückten Hühner das Dorf übernahmen. ' +
      'Jetzt reicht es ihm! Lauf durch die Wüste, sammle Münzen und Flaschen und springe oder ' +
      'wirf dich an den Hühnern vorbei. Am Ende wartet das riesige Big Chicken. ' +
      'Kann Pepe sein Zuhause zurückerobern?',
  },
  es: {
    start: 'Empezar',
    info: 'Info',
    story: 'Historia',
    back: 'Volver',
    restart: 'Reiniciar',
    leave: 'Salir del juego',
    mute: 'Silenciar sonidos',
    runLeft: 'Correr a la izquierda',
    runRight: 'Correr a la derecha',
    throwBottle: 'Lanzar botella',
    jumpUp: 'Saltar',
    close: 'Cerrar',
    abort: 'Abandonar partida',
    pause: 'Pausa',
    pauseHint: 'Pulsa P o el botón de pausa para continuar',
    loading: 'Cargando',
    language: 'Idioma',
    controls: 'Controles',
    run: 'Correr',
    jump: 'Saltar',
    throw: 'Lanzar botella',
    impressum: 'Impressum',
    rotate: 'Gira tu dispositivo para jugar',
    storyTitle: 'La Historia',
    storyText:
      'Pepe vivía en paz en su hacienda, hasta que las gallinas locas se apoderaron del pueblo. ' +
      '¡Ahora ya ha tenido bastante! Corre por el desierto, recoge monedas y botellas, y salta ' +
      'o lanza botellas para pasar a las gallinas. Al final espera la gigantesca Big Chicken. ' +
      '¿Podrá Pepe recuperar su hogar?',
  },
};

let currentLanguage = loadLanguage();


/**
 * Reads the saved language; English if nothing is saved or the local storage is not available.
 * @returns {string} 'en', 'de' or 'es'
 */
function loadLanguage() {
  try {
    let saved = localStorage.getItem('language');
    return saved in TRANSLATIONS ? saved : 'en';
  } catch {
    return 'en';
  }
}


/**
 * Returns a text in the current language.
 * @param {string} key - key in TRANSLATIONS
 * @returns {string}
 */
function t(key) {
  return TRANSLATIONS[currentLanguage][key];
}


/**
 * Switches the language, saves it in the local storage and updates all texts.
 * @param {string} language - 'en', 'de' or 'es'
 */
function setLanguage(language) {
  currentLanguage = language;
  try {
    localStorage.setItem('language', language);
  } catch {}
  applyLanguage();
  releaseFocus(document.activeElement);
}


/** Writes the texts of the current language into every element marked with data-i18n or data-i18n-aria. */
function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('[data-i18n]').forEach((element) => (element.textContent = t(element.dataset.i18n)));
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  });
  document.querySelectorAll('.language-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === currentLanguage);
  });
}
