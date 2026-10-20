/** A cloud that drifts slowly to the left. */
class Cloud extends MovableObject {
  y = 50;
  width = 450;
  height = 250;


  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    this.animate();
  }


  animate() {
    setInterval(() => this.moveLeft(), 1000 / 60);
  }
}
