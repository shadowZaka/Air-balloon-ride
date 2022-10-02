//variables
var background, bg, obs, coin, coinImg, CoinGroup;
var balloon, balloonImage1, balloonImage2;
var database, height, balloonPosition;
var score, over, song;
var gameState ="play";

function preload(){
// load images & sound 
  bg =loadImage("bg.jpg");
   coinImg = loadImage("coin.png");
   GO = loadImage("Gameo.png");
   balloonImage1=loadImage("hotairballoon1.png");
   balloonImage2=loadImage("hotairballoon1.png","hotairballoon1.png",
   "hotairballoon1.png", "hotairballoon1.png","hotairballoon2.png","hotairballoon2.png","hotairballoon2.png",
   "hotairballoon2.png","hotairballoon3.png","hotairballoon3.png","hotairballoon3.png");
   song = loadSound("mood.mp3");
  }

//Function to set initial environment
function setup() {
  //add var databae to firebase
  database=firebase.database();

  createCanvas(1200,700);

  //create required sprites 
  bground = createSprite(600, 350);
  bground.addImage(bg);
  bground.x = bground.width/3;
  bground.scale = 2.1;

  OBSGroup = new Group();
  CoinGroup = new Group();

  balloon=createSprite(135, 480,150,150);
  balloon.addImage(balloonImage2);
  balloon.scale=0.6;

  balloonPosition = database.ref('balloon/height');
  balloonPosition.on("value", readPosition, showError);

  over = createSprite(600, 350);
  over.addImage(GO);
  over.scale = 1.8
  over.visible = false;

  //initial score = 0
  score = 0;
}

// function to display UI
function draw() {
  background("#76D6FE"); 

  //bg sound loop
  song.loop();

  //PLAY STATE
    if (gameState === "play"){

      //call functions
      spawnObs();
      spawnCoins();
      
      //movement of the balloon
      if (height !== undefined){

        if(keyDown(LEFT_ARROW)){
          balloon.x = balloon.x - 10;
        } 
        else if(keyDown(RIGHT_ARROW)){
          balloon.x = balloon.x + 10;
        } 
        else if(keyDown(UP_ARROW)){
          balloon.y = balloon.y - 10;
          balloon.scale = balloon.scale -0.0045;
        }
        else if(keyDown(DOWN_ARROW)){
          balloon.y = balloon.y + 10;
          balloon.scale = balloon.scale +0.0045;
        }
    }
    // bg velovityX
    bground.velocityX = -3;

    //movement of the BG
    if(bground.x < -100){
      bground.x = 1200;
    }

    //score ++
    if(CoinGroup.collide(balloon)){
      score += 5;
      CoinGroup.destroyEach();
    }

    //end
    if (OBSGroup.collide(balloon)){
      gameState = "end";
    }
  }
  //END STATE
  else if (gameState === "end"){
    bground.velocityX = 0; 
    balloon.addImage(balloonImage1);
    over.visible = true;
  }

  //draw sprites and text display
  drawSprites();
  fill(0);
  noStroke();
  textSize(25);
  text("Collect Coins and Save the Balloon From the Yellow Obstacles and Enjoy the Ride",40,40);

  textFont("broadway");
  textSize(30);
  text("SCORE: " + score, 40, 690);
}

//function Wirte Position
function writePosition(x,y){
  database.ref('balloon/height').set({
    'x' : height.x + x,
    'y' : height.y + y
  })
}

//reading position of the balloon
function readPosition(data){
  height = data.val();
  balloon.x = height.x ;
  balloon.y = height.y ;
}

//message for error
function showError(){
  console.log("Error");
}


//obstacles
function spawnObs(){
  if (frameCount % 100 === 0) {
    obs = createSprite(100, 0, 10, 30);
    obs.velocityY = 3;
    obs.x = Math.round(random(50, 1100));
    obs.lifetime = 700;
    obs.shapeColor = "yellow";
    OBSGroup.add(obs);
    obs.debug;
    
    obs.depth = bground.depth;
    obs.depth += 1;    

    balloon.depth = bground.depth;
    balloon.depth += 1;
  }
}

//Coins
function spawnCoins(){
  if (frameCount % 80 === 0) {
    coin = createSprite(100, 0, 10, 10);
    coin.velocityY = 3;
    coin.x = Math.round(random(50, 1100));
    coin.addImage(coinImg);
    coin.scale = 0.25;
    coin.lifetime = 700;
    CoinGroup.add(coin);
    coin.debug;
    
    coin.depth = bground.depth;
    coin.depth += 1;    

    balloon.depth = bground.depth;
    balloon.depth += 1;
  }
}

/*
#DhRiTiD
#DD
*/