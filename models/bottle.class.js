class Bottle extends DrawableObject {
  y = 360;
  width = 60;
  height = 70;

  IMAGES_GROUND = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  constructor() {
    super().loadImage(this.IMAGES_GROUND[Math.floor(Math.random() * this.IMAGES_GROUND.length)]);
    this.x = 200 + Math.random() * 2000; // Random x position along the level
  }
}
