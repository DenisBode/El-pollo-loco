class Character extends MovableObject {
  height = 300;
  y = 50; // Set a fixed y position
  speed = 10;

  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  constructor() {
    super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      }

      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.otherDirection = false;
        this.x += this.speed;
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }

      // console.log('this.speetY', this.speedY);

      if (this.world.keyboard.UP) {
        this.speedY = 20;
      }

      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 50); // 10 frames per second
  }

  jump() {
    console.log('Character is jumping');
  }
}
