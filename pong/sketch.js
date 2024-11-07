let canvasWidth = 700;
let canvasHeight = 700;

let player1Score = 0;
let player2Score = 0;

let player1Y = 70;
let player2Y = 0;

let playerWidth = 10;
let playerHeight = 100;

let player1X = 10;
let player2X = canvasWidth - 10 - playerWidth;

let speed = 3;

let lowerBound = 0;
let upperBound = canvasHeight - playerHeight;

let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;

let ballSize = 20;

let ballSpeedX = -3;
let ballSpeedY = 2;

let pad1Speed = 0;
let pad2Speed = 0;

draw = function() {
    background(30);
    stroke(255);
    strokeWeight(11);
    fill(255);
    textSize(45);

    line(canvasWidth / 2, 70, canvasWidth / 2, canvasHeight - 20);
    noStroke();
    rect(ballX, ballY, ballSize, ballSize);
    rect(player1X, player1Y, playerWidth, playerHeight);
    rect(player2X, player2Y, playerWidth, playerHeight);
    fill("#9F4646");
    text(player1Score + "|" + player2Score, 320,40)

    if (isKeyPressed("w") && player1Y > lowerBound) {
        player1Y -= speed;
    } else if (isKeyPressed("s") && player1Y < upperBound) {
        player1Y += speed;
    }
    
    if (isKeyPressed("ArrowUp") && player2Y > lowerBound) {
        player2Y -= speed;
    } else if (isKeyPressed("ArrowDown") && player2Y < upperBound) {
        player2Y += speed;
    }

    if (rectCollission(ballX, ballY, ballSize, ballSize, 
         player1X, player1Y, playerWidth, playerHeight)
         ||
         rectCollission(ballX, ballY, ballSize, ballSize, 
         player2X, player2Y, playerWidth, playerHeight)
        ) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballY < 0 || ballY + ballSize > canvasHeight) {
        ballSpeedY = -ballSpeedY;
    }
    ballX += ballSpeedX;
    ballY -= ballSpeedY;

    if (ballX > canvasWidth) {
        ballX = canvasWidth / 2;
        ballY = canvasHeight / 2; 
        player1Score++;
    } else if(ballX + ballSize < 0) {
        ballX = canvasWidth / 2;
        ballY = canvasHeight / 2;
        player2Score++;
    }
    
    player1Y += pad1Speed;
    player2Y += pad2Speed;

    if (ballY < player2Y) {
        pad2Speed = -speed;
    } else if (ballY > player2Y) {
        pad2Speed = speed;
    } else {
        pad2Speed = 0;
    }

    if (ballY < player1Y) {
        pad1Speed = -speed;
    } else if (ballY > player1Y) {
        pad1Speed = speed;
    } else {
        pad1Speed = 0;
    }
}


function rectCollission(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1 + w1 > x2 && x1 < x2 + w2 &&
            y1 + h1 > y2 && y1 < y2 + h2);
}
