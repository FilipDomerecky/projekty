let canvasWidth = 1200;
let canvasHeight = 700;
let bird = getImage("bird.png");
let gameBackground = getImage("background.png");
let birdX = canvasWidth /4;
let birdY = canvasHeight /2;

let birdSpeed = 0;

let spacePressed = 0;

let wallSpeed = -3;

let score = 0;

let lastCol = 0;

let wallX = 1200;
let wallY = 0;
let wallWidth = 210;
let gapY = canvasHeight /2;
let gapHeight = 100;

function drawWall () {
    fill(0, 255, 0);
    rect(wallX, wallY, wallWidth, gapY - gapHeight);
    rect(wallX, gapY + gapHeight, wallWidth, canvasHeight - gapY - gapHeight);
}

draw = function() {
    image(gameBackground, 0, 0, canvasWidth, canvasHeight);
    
    rotatedImage(bird, birdX, birdY, birdSpeed * 15);
    drawWall();
    fill(0);
    textSize(47);
    centeredText(score, canvasWidth / 2, 70);
   

    if (isKeyPressed(" ")) {
        if (spacePressed < 21) {
            birdSpeed = -3;
        }
        spacePressed++;
    } else {
        spacePressed = 0;
    }

    birdSpeed += 0.1;
    birdY += birdSpeed;
    wallX += wallSpeed;

    if (birdSpeed > 3) {
        birdSpeed = 3;
    }

    if (wallX + wallWidth < 0) {
        resetwall();
    }    
    
    if (birdY > canvasHeight) {
        resetBird();
        resetwall();
        score = 0;
    } 
    if (upperWallCollision() || lowerWallCollision()) {
        resetBird();
        resetwall();
    }
    if (gapcollision()) {
        if (!lastCol) {
            score++;
            lastCol = true;
        }
    } else {
        lastCol = false;
    }
}

function resetwall() {
    wallX = canvasWidth;
    wallWidth = random(170, 270);
    gapY = random(canvasHeight / 2 - 200, canvasHeight / 2 + 200);
    gapHeight = random(70, 210);
}

function resetBird() {
    birdY = canvasHeight /2;
}

function rectCollission(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 + w1 > x2 && x2 + w2 > x1 && y1 + h1 > y2 && y2 + h2 > y1;
}

function upperWallCollision() {
    return rectCollission(wallX, wallY, wallWidth, gapY - gapHeight,
        birdX, birdY, bird.width, bird.height);
}

function lowerWallCollision() {
    return rectCollission(wallX, gapY + gapHeight, wallWidth, canvasWidth - gapY - gapHeight,
        birdX, birdY, bird.width, bird.height);
}

function gapcollision() {
    return rectCollission(
        wallX, gapY - gapHeight, wallWidth, gapHeight * 2,
        birdX, birdY, bird.width, bird.height);
}