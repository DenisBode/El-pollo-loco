class Coin extends MovableObject {
  width = 80;
  height = 80;

  IMAGES_COIN = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  constructor() {
    super().loadImage(this.IMAGES_COIN[0]);
    this.loadImages(this.IMAGES_COIN);
    this.setOffset(20, 20, 20, 20);
    this.x = 200 + Math.random() * 2000; // Random x position along the level
    this.y = 150 + Math.random() * 100; // In the air, reachable with a jump
    this.animate();
  }

  animate() {
    setInterval(() => this.playAnimation(this.IMAGES_COIN), 300);
  }
}
