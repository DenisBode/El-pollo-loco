/** The "Oh no you lost" screen. */
class GameOverScreen extends DrawableObject {
  constructor() {
    super().loadImage('img/9_intro_outro_screens/game_over/oh no you lost!.png');
    this.x = 0;
    this.y = 0;
    this.width = 720;
    this.height = 480;
  }
}
