let canvas;
let world;


function init() {
  world = new World(canvas);
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
 

  console.log('My Character is: ', world.character);
  console.log('My Chicken is: ', world.enemies[0]);
  
}
