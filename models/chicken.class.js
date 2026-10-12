class Chicken extends MovableObject {
  y = 350;
  height = 80;

  constructor() {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

    this.x = 200 + Math.random() * 500; // Random x position between 200 and 700
    this.animate();
  }
  animate() {
    setInterval(() => {
      this.x -= 0.15; // Move the chicken to the left
    }, 1000 / 60); // 60 frames per second
  }
}
