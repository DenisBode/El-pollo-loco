/** A salsa bottle lying on the ground. */
class Bottle extends Collectable {
  static IMAGES_GROUND = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  y = 360;
  width = 60;
  height = 70;


  /** One of the two ground images is chosen at random. */
  constructor() {
    let images = Bottle.IMAGES_GROUND;
    super(images[Math.floor(Math.random() * images.length)]);
  }
}
