var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg, restartImg;
var jumpSound , checkPointSound, dieSound;

function preload(){
 trex_running = loadAnimation("images/trex1.png","images/trex2.png","images/trex3.png");
 trex_collided = loadAnimation("images/trex_collided.png");
  
 groundImage = loadImage("images/ground.png");

 cloudImage = loadImage("images/cloud.png");
  
 obstacle1 = loadImage("images/obstacle1.png");
 obstacle2 = loadImage("images/obstacle2.png");
 obstacle3 = loadImage("images/obstacle3.png");
 obstacle4 = loadImage("images/obstacle4.png");
 obstacle5 = loadImage("images/obstacle5.png");
 obstacle6 = loadImage("images/obstacle6.png");
  
 restartImg = loadImage("images/restart.png")
 gameOverImg = loadImage("images/gameOver.png")
  
 jumpSound = loadSound("sounds/jump.mp3")
 dieSound = loadSound("sounds/die.mp3")
 checkPointSound = loadSound("sounds/checkPoint.mp3")
}

function setup(){
 createCanvas(displayWidth, displayHeight);

 var message = "This is a message";
 console.log(message)
  
 trex = createSprite(40,displayHeight-375,20,50);
 trex.addAnimation("running",trex_running);
 trex.addAnimation("collided",trex_collided);

 trex.scale = 0.6;
  
 ground = createSprite(200,displayHeight-400,400,20);
 ground.addImage("ground",groundImage);
 ground.x = ground.width/2;
  
 gameOver = createSprite(800,300);
 gameOver.addImage(gameOverImg);
  
 restart = createSprite(830,400);
 restart.addImage(restartImg);
   
 gameOver.scale = 1.0;
 restart.scale = 1.0;
  
 invisibleGround = createSprite(200,displayHeight-375,400,10);
 invisibleGround.visible = false;

 obstaclesGroup = createGroup();
 cloudsGroup = createGroup();
  
 trex.setCollider("circle",0,0,40);

 score = 0;  
}

function draw(){
 background(180);
 textSize(30);
 text("Score: "+ score,800,200);
  
 if(gameState===PLAY){
  gameOver.visible = false;
  restart.visible = false;
    
  ground.velocityX = -(4+3*score/100);

  score = score + Math.round(getFrameRate()/60);
    
  if(score>0 && score%100===0){
   checkPointSound.play() 
  }
    
  if(ground.x<0){
   ground.x = ground.width/2;
  }
    
  if(keyDown("space")&& trex.y>=350){
   trex.velocityY = -12;
   jumpSound.play();
  }

  trex.velocityY = trex.velocityY + 0.8;

  spawnClouds();
  
  spawnObstacles();
    
  if(obstaclesGroup.isTouching(trex)){
   gameState = END;
   dieSound.play()
  }
 }
 else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;

  trex.changeAnimation("collided",trex_collided);
     
  ground.velocityX = 0;
  trex.velocityY = 0;

  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
     
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0); 
     
  if(mousePressedOver(restart)){
   reset();
  }
 }
  
 trex.collide(invisibleGround);
 drawSprites();
}

function reset(){
 gameState=PLAY;
 restart.visible = false;
 gameOver.visible = false;
 obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach();
 trex.changeAnimation("running",trex_running);
 score = 0;
}

function spawnObstacles(){
 if (frameCount%60===0){
  var obstacle = createSprite(displayWidth-1000,displayHeight-400,10,280);
  obstacle.velocityX = -(6+score/100);
   
  var rand = Math.round(random(1,6));
  switch(rand){
   case 1 : obstacle.addImage(obstacle1);
    break;
   case 2 : obstacle.addImage(obstacle2);
    break;
   case 3 : obstacle.addImage(obstacle3);
    break;
   case 4 : obstacle.addImage(obstacle4);
    break;
   case 5 : obstacle.addImage(obstacle5);
    break;
   case 6 : obstacle.addImage(obstacle6);
    break;
   default : break;
  }
         
  obstacle.scale = 0.6;
  obstacle.lifetime = 300;  
  obstaclesGroup.add(obstacle);
 }
}

function spawnClouds(){
 if (frameCount%60===0){
  var cloud = createSprite(600,120,40,10);
  cloud.y = Math.round(random(80,120));
  cloud.addImage(cloudImage);
  cloud.scale = 0.85;
  cloud.velocityX = -3;
    
  cloud.lifetime = 200;

  cloud.depth = trex.depth;
  trex.depth = trex.depth+1;
    
  cloudsGroup.add(cloud);
 }
}