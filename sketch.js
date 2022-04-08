// Global variables
var marioRunning, bgImage, coinRotating, coinGroup, score=0, jump=false;
var gameState = "PLAY";

// function for loading images 
function preload()
    {
        marioRunning = loadAnimation("images/mar1.png", "images/mar2.png","images/mar3.png","images/mar4.png","images/mar5.png","images/mar6.png","images/mar7.png");
        bgImage = loadImage("images/bgnew.jpg");
        brickImage=loadImage('images/brick.png');
        coinRotating = loadAnimation("images/con1.png", "images/con2.png","images/con3.png","images/con4.png","images/con5.png","images/con6.png",);
        coinSound = loadSound("sounds/coinSound.mp3");
        mushObstacleImage = loadAnimation("images/mush1.png", "images/mush2.png","images/mush3.png","images/mush4.png", "images/mush5.png", "images/mush6.png");
        turtleObstacleImage = loadAnimation("images/tur1.png","images/tur2.png","images/tur3.png","images/tur4.png","images/tur5.png",);
        dieSound  = loadSound("sounds/dieSound.mp3");
        mario_collided = loadAnimation("images/dead.png");
        restartImg = loadImage("images/restart.png");
    }

// creating the character 
function setup()
    {
        createCanvas(1366,633);

        // creating background sprite
        bg= createSprite(680,327,1000,600)
        mario=createSprite(100,430, 50,120)
        mario.addAnimation("Running",marioRunning);
        mario.addAnimation("collided", mario_collided);
        mario.scale=0.2

        // creating ground sprites 
        ground=createSprite(683,430,1366,10)
        ground.visible=false 

        // creating groups 
        bricksGroup=new Group()
        coinGroup = new Group()
        obstacleGroup = new Group()
        restart = createSprite(1366/2,300); 
        restart.addImage(restartImg);
        restart.visible = false;
    }

// creating function for adding all the properties of the characters     
function draw() 
    {
        if (gameState == "PLAY")
        {      
        mario.scale = 0.2;

        bg.addImage(bgImage)

        // giving velocity to the background 
        bg.velocityX=-12
        if(bg.x<-580)
        bg.x=660

        // jump mario by pressing space bar 
        if(keyDown(' '))
        {
            mario.velocityY=-15
        }

        // preventing mario to move out of canvas
        if(mario.y<95)
        {
            mario.y=95
        }
        if(mario.x<100)
        {
            mario.x=100
        }
        if(mario.y>430)
        {
            mario.y=430
        }

        // adding gravity
        mario.velocityY=mario.velocityY+0.8

        // collide on ground 
        mario.collide(ground)

        // calling the function for generating bricks 
        createBricks();
        for(let i=0; i < bricksGroup.length; i++)
        {
            mario.collide(bricksGroup[i])
        }

        // calling the function for generating coins 
        createCoins();
        for(let i=0; i < coinGroup.length; i++)
        {
            if (mario.isTouching(coinGroup[i]))
            {
                coinSound.play();
                score++;
                coinGroup[i].destroy()
                    
            }
        }

        // calling the function for generating obstacles 
        generateObstacle();
        
        if(mario.isTouching(obstacleGroup))
        {
            dieSound.play();
            gameState = "END";
        }
    }  //ending playstate

        else if(gameState == "END")
        {
            bg.velocityX = 0;
            mario.velocityX = 0;
            mario.velocityY = 0;
            obstacleGroup.setVelocityXEach(0);
            coinGroup.setVelocityXEach(0);
            bricksGroup.setVelocityXEach(0);
            obstacleGroup.setLifetimeEach(-1);
            coinGroup.setLifetimeEach(-1);
            bricksGroup.setLifetimeEach(-1);
            mario.changeAnimation("collided", mario_collided);
            mario.scale = 0.3;
            mario.y = 400;
            restart.visible = true;
            
            for(let i=0; i < coinGroup.length; i++)
            {
                if (restart.isTouching(coinGroup[i]))
                {
                    coinGroup[i].destroy()
                        
                }
            }
            for(let i=0; i < bricksGroup.length; i++)
        {
            if (restart.isTouching(bricksGroup[i]))
                {
                    bricksGroup[i].destroy()
                        
                }
        }

            if(mousePressedOver(restart))
            {
                restartGame();
            }
        }
        drawSprites();
        textSize(50)
        fill('black')
        text("Score: " + score, 100,100)
    }

function createCoins()
{
    if(frameCount%40==0)
    {
        coin=createSprite(2000, 200, 20, 20)
        coin.y=random(200,400);
        coin.addAnimation("Rotating",coinRotating)
        coin.scale=0.1
        coin.velocityX=-7
        coin.lifetime=500
        coinGroup.add(coin)
      
    }
}

function createBricks()
{
    if(frameCount%60==0)
    {
        brick=createSprite(2000, 200, 40, 10)
        brick.y=random(200,400);
        brick.addImage(brickImage)
        brick.scale=0.5
        brick.velocityX=-7
        brick.lifetime=500
        bricksGroup.add(brick)
    }
    
}
function generateObstacle()
{
    if(frameCount%100==0)
    {
        var obstacle= createSprite(2000,400,18,5)
        obstacle.velocityX=-8
        obstacle.scale=0.15
        var rand= Math.round(random(1,2))
        switch(rand)
        {
            case 1:
                obstacle.addAnimation("mush", mushObstacleImage)
                break
            case 2:
                obstacle.addAnimation("turtle", turtleObstacleImage)
                break
            default:
                break 

        }
        obstacle.lifetime = 300
        obstacleGroup.add(obstacle);
    }
    
}

function restartGame()
    {
        gameState = "PLAY";
        obstacleGroup.destroyEach();
        bricksGroup.destroyEach();
        coinGroup.destroyEach();
        score = 0;
        restart.visible = false;
        mario.changeAnimation("Running", marioRunning);

    }