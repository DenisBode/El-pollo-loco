class Character extends MovableObject {
  height = 300;
  y = 140; // Set a fixed y position

  constructor() {
    super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
  }

  jump() {
    console.log('Character is jumping');
  }
}
