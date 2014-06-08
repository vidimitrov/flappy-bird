﻿/// <reference path="kinetic-v5.1.0.min.js" />
window.onload = function () {
    var stage,
    ninjaPosition = 0,
    stageWidth = 400,
    stageHeight = 500,
    gameSpeed = 1,
    ninjaHeight = 100,
    currentState,
    ninja, //ninja 
    obstacles = [], //pipes
    grass,
    ninjaImage,
    groundLevel = 70,
    groundLayer,
    groundImageObj,
    ninjaLayer,
    obstaclesLayer,
    currentScore,
    highScore,
    gravity = 1,
    playerJumpAcceleration = 100,
    gameStates = {
        InGame: 1,
        HighScores: 2,
        Pause: 3,
        GameOver: 4,
    },
    gapHeight,
    frames = 1,
    totalObstacleHeight,
    minObstacleHeight = 15,
    ninjaAnimation,
    obstacleAnimation,
    groundAnimation;

    initalize(stageWidth, stageHeight);

    function Ninja(x, y, img, width, height, jumpAcceleration) {
        this.x = x,
        this.y = y,
        this.jumpSize = jumpAcceleration,
        this.rotationAngle = 0,
        this.img = new Kinetic.Image({
            x: this.x,
            y: this.y,
            image: img,
            width: width,
            height: height,
            fill:'pink'
        }).rotateDeg(this.rotationAngle);

        this.jump = function () {
            this.y -= this.jumpSize;
            if (this.y < 0) {
                this.y = 0;
            }
        }
        this.update = function () {

            if (this.y + this.img.height() + groundLevel < stage.height()) {
                this.y += gravity;
            }
        }
    }

    ninjaAnimation = new Kinetic.Animation(update, ninjaLayer); //set time
    ninjaAnimation.start();

    obstacleAnimation = new Kinetic.Animation(updateObstacles, obstaclesLayer);
    obstacleAnimation.start();

    groundAnimation = new Kinetic.Animation(groundUpdate, groundLayer);
    groundAnimation.start();

    function initalize(width, height) {
        // Defining Stage
        stage = new Kinetic.Stage({
            container: 'container',
            width: width,
            height: height,
        });

        // defining obsticle sizes
        gapHeight = ninjaHeight * 1.5;
        totalObstacleHeight = stage.height() - groundLevel - gapHeight;

        // Defininf Layers
        ninjaLayer = new Kinetic.Layer();
        obstaclesLayer = new Kinetic.Layer();
        groundLayer = new Kinetic.Layer();

        // Defining Images
        ninjaImage = new Image();
        //ninjaImage.src = 'imgs/ninja.png';
        groundImageObj = new Image();

        // initiating Objects
        ninja = new Ninja(75, 150, ninjaImage, 100, ninjaHeight, playerJumpAcceleration);
        grass = new Grass(0, stageHeight - (groundLevel * 2.2) , 'imgs/grass.png', stageWidth * 2, groundLevel * 2.2, gameSpeed * 5)

        // Drawing Layers
        ninjaLayer.add(ninja.img);
        stage.add(ninjaLayer);

        groundImageObj.onload = function () {
            var grassImg = new Kinetic.Image({
                image: groundImageObj,
                x: grass.x,
                y: grass.y,
                width: grass.width,
                height: grass.height
            });
            groundLayer.add(grassImg);
            stage.add(groundLayer);
        }
        groundImageObj.src = grass.imgSrc;

      
        document.addEventListener('click', function () {
            ninja.jump();
        });
    }

    function groundUpdate() {
        //ground update
        grass.update();
        groundLayer.setX(grass.x);
    }

    function update() {
        if (hasCrashed(ninja)) {   // Refactor
            console.log('crashed');

            groundAnimation.stop();
            obstacleAnimation.stop();
            ninjaAnimation.stop();
        }
        ninja.update();
        ninja.img.setY(ninja.y); //refactor

        //Attempt to animate ninja!!!
        ninjaPosition+=0.5;
        switch (ninjaPosition) {
            //case 1:
            //case 2: 
            case 3: ninjaImage.src = 'imgs/ninja1.png'; break;
            //case 4:
            //case 5: 
            case 6: ninjaImage.src = 'imgs/ninja2.png'; break;
            //case 7:
            //case 8:
            case 9: ninjaImage.src = 'imgs/ninja3.png'; break;
            //case 10:
            //case 11:
            case 12: ninjaImage.src = 'imgs/ninja4.png'; break;
            //case 13:
            //case 14:
            case 16: ninjaImage.src = 'imgs/ninja5.png'; break;
            //case 16:
            //case 17:
            case 18: ninjaImage.src = 'imgs/ninja6.png'; break;
            default: if(ninjaPosition > 18) ninjaPosition = 0 ; break;
        }
        
    }

    function updateObstacles() {

        for (var i = 0, len = obstacles.length; i < len; i++) {
            var currentObstacle = obstacles[i];
            currentObstacle.update();
            currentObstacle.img.setX(currentObstacle.x);

            if (currentObstacle.x + currentObstacle.width < 0) {
                obstacles.splice(i, 1);
                i--;
                len--;
            }
        }

        frames++;
        if (frames === 100) { //TODO animation frame speed

            var currentObstacles = generateObstacles(totalObstacleHeight, gapHeight, minObstacleHeight);
            for (i = 0; i < currentObstacles.length; i++) {
                obstacles.push(currentObstacles[i]);
            }
            obstaclesLayer.add(currentObstacles[0].img);
            obstaclesLayer.add(currentObstacles[1].img);
            stage.add(obstaclesLayer);
            obstaclesLayer.moveToBottom();
            frames = 1;
        }
    }

    function hasCrashed(ninja) {
        if (ninja.y + ninja.img.height() >= stageHeight - groundLevel) {
            return true;
        }

        for (var i = 0; i < obstacles.length; i++) {

            var currentObstacle = obstacles[i];
            // console.log('ninja x: ' + ninja.x + ' y: ' + ninja.y + ' width: ' + ninja.img.width() + ' height: ' + ninja.img.height());

            if (ninja.x >= currentObstacle.x && ninja.x <= currentObstacle.x + currentObstacle.width || ninja.x + ninja.img.width() >= currentObstacle.x && ninja.x + ninja.img.width() <= currentObstacle.x + currentObstacle.width) {

                if (ninja.y >= currentObstacle.y && ninja.y <= currentObstacle.y + currentObstacle.height || ninja.y + ninja.img.height() >= currentObstacle.y && ninja.y + ninja.img.height() <= currentObstacle.y + currentObstacle.height) {
                    return true;
                }
            }
        }
        return false;
    }

    function generateObstacles(totalObstacleHeight, gapHeight, minObstacleHeight) { // should work properly now
        var topObstacleHeight,
            bottomObstacleHeight,
            currentObstacles = [],
            bottomObstacle,
            topObstacle;

        topObstacleHeight = (totalObstacleHeight) * Math.random() | 0;

        if (topObstacleHeight < minObstacleHeight) {
            topObstacleHeight = minObstacleHeight;
        }
        else if (topObstacleHeight > topObstacleHeight - minObstacleHeight) {
            topObstacleHeight = topObstacleHeight - minObstacleHeight;
        }

        bottomObstacleHeight = totalObstacleHeight - topObstacleHeight;

        topObstacle = new Obstacle(stage.width(), 0, 100, topObstacleHeight);
        bottomObstacle = new Obstacle(stage.width(), topObstacleHeight + gapHeight, 100, bottomObstacleHeight);

        currentObstacles.push(topObstacle);
        currentObstacles.push(bottomObstacle);

        return currentObstacles;
    }

    function Obstacle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Kinetic.Rect({ //TODO add Image
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fill: 'yellowgreen'
        });
        this.update = function () {
            this.x -= gameSpeed * 5;
        }
    }

    function Grass(x, y, imageSource, width, height, speed) {
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.speed = speed,
        this.imgSrc = imageSource;


        this.update = function () {
            if (this.x <= (-stageWidth)) {
                this.x = -1;
            }
            this.x -= this.speed;
        }
    }
}