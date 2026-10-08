class BackgroundObject extends MovableObject {

    constructor(imagePath){
        super().loadImage(imagePath);
    }

    x = 0;
    y = canvas.height - 270; // Position the background object at the bottom of the canvas
    width = 720;
    height = 250;
}