/** A cloud that drifts slowly to the left. */
class Cloud extends MovableObject {
  y = 50;
  width = 450;
  height = 250;


  /** Creates a cloud at a random place in the first part of the level. */
  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.webp');
    this.x = Math.random() * 500;
  }


  /** Lets the cloud drift to the left. */
  animate() {
    setGameInterval(() => this.moveLeft(), 1000 / 60);
  }
}
