/** A salsa bottle lying on the ground. */
class Bottle extends Collectable {
  static IMAGES_GROUND = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.webp',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.webp',
  ];

  /**
   * Hitbox offsets (top, right, bottom, left) for each ground image: the bottle stands on the right side of the
   * first image and on the left side of the second one, so the empty space around it differs.
   */
  static OFFSETS = [
    [12, 9, 6, 24],
    [12, 17, 6, 15],
  ];

  y = 360;
  width = 60;
  height = 70;


  /** One of the two ground images is chosen at random; the hitbox fits the bottle in that image. */
  constructor() {
    let index = Math.floor(Math.random() * Bottle.IMAGES_GROUND.length);
    super(Bottle.IMAGES_GROUND[index]);
    this.setOffset(...Bottle.OFFSETS[index]);
  }
}
