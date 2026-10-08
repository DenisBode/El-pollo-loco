class Cloud extends MovableObject {
    y = 50;
width = 450;
height = 250;   


    constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png');

    this.x = 0 + Math.random() * 500; // Random x position between 200 and 700

}

}