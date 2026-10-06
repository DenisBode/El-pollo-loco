class MovableObject {
    x = 200;
    y = 200;
    img;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight(){
        console.log('moving right');
        
    }

    moveLeft(){
        console.log('moving left');
    }

}
    