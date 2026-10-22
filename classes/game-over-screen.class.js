/** The "Oh no you lost" screen. */
class GameOverScreen extends DrawableObject {
  /** Creates the screen: the image fills the whole canvas and loads late. */
  constructor() {
    super().loadImage('img/9_intro_outro_screens/game_over/oh no you lost!.webp', false);
    this.x = 0;
    this.y = 0;
    this.width = 720;
    this.height = 480;
  }
}
