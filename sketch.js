var spaceship;
var ground;
var score = 0;
var restartImg;
var obstacleGroup;
var obstacleSpeed =5;

var gameState = 'story';

var bullet;

function preload(){
  restartImg = loadImage('restart2.png');
  
  spaceshipImg = loadImage('images/spaceship.png');
  laserImg = loadImage('images/laser.png');
  e1Img = loadImage('images/e1.png');
  e2Img = loadImage('images/e2.png');
  e3Img = loadImage('images/e3.png');
  e4Img = loadImage('images/e4.png');

  voidImg = loadImage('images/void.png');

  storyImg = loadImage('images/storyPage.png');

  laserSound = loadSound('sounds/laser.mp3');
  blastSound = loadSound('sounds/blast3.wav');
  gameOverSound = loadSound('sounds/gameOver.wav')
  clickSound = loadSound('sounds/click.mp3');
  bgSound = loadSound('sounds/bg.mp3');

}

function setup() {
  createCanvas(600,400);

  spaceship = createSprite(100, 230,20, 50);
  spaceship.velocityY = 0;
  spaceship.scale=0.2;
  spaceship.addImage(spaceshipImg);
  spaceship.debug=false;
  spaceship.setCollider('rectangle',0,0,60,100);

  bullet = createSprite(spaceship.x,spaceship.y,10,10);
  bullet.scale=0.3;
  bullet.addImage(laserImg);
  bullet.visible = false;

  restart = createSprite(300,230,30,30);
  restart.addImage(restartImg);
  restart.scale = 0.2;
  restart.visible = false;

  start = createSprite(300,320,100,50);
  start.visible = false;

  obstacleGroup = new Group();

  blastSound.setVolume(0.4);
  bgSound.play();
  bgSound.loop();
  bgSound.setVolume(0.1);
  
}



function draw() {
  background(voidImg);

  console.log(obstacleSpeed);

  fill(255,255,255);
  textSize(16);

  if(gameState === 'play'){

    if(frameCount%8===0){
      score+=1;
    }

    movements();

    spawnObstacles();
  }

  if(gameState === 'end'){
    push();
    textSize(30);
    stroke('white');
    text('Game Over',225,200);
    pop();
    restart.visible = true;
    spaceship.velocityY=0;

    if(mousePressedOver(restart)){
      gameState = 'play';
      score=0;
      restart.visible = false;
      obstacleSpeed = 5;
      clickSound.play();
    }
  }

  if(score%50===0){
    obstacleSpeed += 0.2;
  }


  text('Score:'+score,500,50);
  
  drawSprites();

  if(gameState ==='story'){
    image(storyImg,30,30,550,350);
    text('Hello Fighter!',60,100);
    text('Today is the worst day of Earth!. We are being attacked by alien',60,130);
    text('ships and all are forces have been destroyed by them.',60,160);
    text('You are Our last hope to protect the Earth.',60,190);
    text('Your mission is to destroy as many as alien ships and remember not',60,220);
    text('let any ship to pass or your mission will fail!',60,250);
    text('Best of luck blasting alien ships :) ',60,280);

    push();
    textSize(30);
    stroke('white');
    text('START',250,340);
    pop();

    if(mousePressedOver(start)){
      gameState = 'play';
      obstacleSpeed=5;
      clickSound.play();
    }
  }
  
}




function spawnObstacles(){
  var spawnYpos = Math.round(random(100,300));
  
  if(frameCount%50===30){
    var obstacle = createSprite(850,spawnYpos,20,20);
    obstacle.velocityX = -obstacleSpeed;
    obstacle.scale = 0.2;

    var rand = Math.round(random(1,4))
    switch(rand){
      case 1:obstacle.addImage(e1Img);
      break;
      case 2:obstacle.addImage(e2Img);
      break;
      case 3:obstacle.addImage(e3Img);
      break;
      case 4:obstacle.addImage(e4Img);
      default:break;
    }

    obstacleGroup.add(obstacle);
  }

  if(spaceship.isTouching(obstacleGroup)){
    gameState = 'end';
    obstacleGroup.destroyEach();
    gameOverSound.play();
  }
  
  for(var i=0; i<obstacleGroup.length;i++){
    if(obstacleGroup[i].x<-10){
      gameState = 'end';
      obstacleGroup.destroyEach();
      gameOverSound.play();
    } 
  }

  for(var i=0; i<obstacleGroup.length;i++){
    if(bullet.isTouching(obstacleGroup[i])){
      obstacleGroup[i].destroy();
      bullet.visible = false;
      bullet.x = spaceship.x;
      bullet.velocityX = 0;
      blastSound.play();
    }
  }

}



function movements(){
  
  console.log(spaceship.y);
    if(keyDown('w')){
      spaceship.y-=10;
    }
    if(keyDown('s')){
      spaceship.y+=10;
    }

  if(spaceship.y<0){
    spaceship.velocityY=10;
  }
  if(spaceship.y>400){
    spaceship.velocityY = -10;
  }
  if(spaceship.y>0&&spaceship.y<400){
    spaceship.velocityY=0;
  }
  

  if(bullet.x === spaceship.x){
    bullet.y = spaceship.y;
    bullet.setCollider('rectangle',0,0,5,5);
  }
  else{
    text('Reloading.....',60,spaceship.y+50);
    bullet.setCollider('rectangle',0,0,80,20);
  }

  if(bullet.x>600){
    bullet.visible = false;
    bullet.x = spaceship.x;
    bullet.velocityX = 0;
  }

  if(keyWentDown('space')){
    bullet.visible = true;
    bullet.velocityX = 15;
    laserSound.play();
  }
}