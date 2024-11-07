document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
   
    const scoreElement = document.getElementById("score");
    const livesElement = document.getElementById("lives");
    const shotsElement = document.getElementById("shots");
   
    canvas.width = 400;
    canvas.height = 600;
   
    const player = {
      width: 30,
      height: 30,
      x: canvas.width / 2 - 15,
      y: canvas.height - 50,
      color: "blue",
      speed: 5,
      dx: 0,
      lives: 3,
      shots: 0
    };
   
    const obstacles = [];
    const powerUps = [];
    const lifePowerUps = [];
    const bullets = [];
   
    const obstacleWidth = 30;
    const obstacleHeight = 30;
    const bulletWidth = 5;
    const bulletHeight = 10;
    let obstacleSpeed = 3;
    let score = 0;
   
    function drawPlayer() {
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
   
    function movePlayer() {
      player.x += player.dx;
   
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    }
   
    function createObstacle() {
      const x = Math.random() * (canvas.width - obstacleWidth);
      obstacles.push({ x, y: 0, width: obstacleWidth, height: obstacleHeight });
    }
   
    function createPowerUp() {
      const x = Math.random() * (canvas.width - obstacleWidth);
      powerUps.push({ x, y: 0, width: obstacleWidth, height: obstacleHeight });
    }
   
    function createLifePowerUp() {
      const x = Math.random() * (canvas.width - obstacleWidth);
      lifePowerUps.push({ x, y: 0, width: obstacleWidth, height: obstacleHeight });
    }
   
    function drawObstacles() {
      ctx.fillStyle = "red";
      obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });
    }
   
    function drawPowerUps() {
      ctx.fillStyle = "green";
      powerUps.forEach(powerUp => {
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      });
    }
   
    function drawLifePowerUps() {
      ctx.fillStyle = "purple";
      lifePowerUps.forEach(lifePowerUp => {
        ctx.fillRect(lifePowerUp.x, lifePowerUp.y, lifePowerUp.width, lifePowerUp.height);
      });
    }
   
    function drawBullets() {
      ctx.fillStyle = "yellow";
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
      });
    }
   
    function moveObstacles() {
      obstacles.forEach(obstacle => {
        obstacle.y += obstacleSpeed;
      });
   
      obstacles.forEach((obstacle, index) => {
        if (obstacle.y > canvas.height) {
          obstacles.splice(index, 1);
          score++;
          if (score % 5 === 0) obstacleSpeed += 1;
        }
      });
    }
   
    function movePowerUps() {
      powerUps.forEach(powerUp => powerUp.y += obstacleSpeed);
      powerUps.forEach((powerUp, index) => {
        if (powerUp.y > canvas.height) powerUps.splice(index, 1);
      });
    }
   
    function moveLifePowerUps() {
      lifePowerUps.forEach(lifePowerUp => lifePowerUp.y += obstacleSpeed);
      lifePowerUps.forEach((lifePowerUp, index) => {
        if (lifePowerUp.y > canvas.height) lifePowerUps.splice(index, 1);
      });
    }
   
    function moveBullets() {
      bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
      });
    }
   
    function checkCollision() {
      obstacles.forEach((obstacle, obsIndex) => {
        if (
          player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y
        ) {
          player.lives--;
          obstacles.splice(obsIndex, 1);
          if (player.lives <= 0) resetGame();
        }
   
        bullets.forEach((bullet, bulletIndex) => {
          if (
            bullet.x < obstacle.x + obstacle.width &&
            bullet.x + bulletWidth > obstacle.x &&
            bullet.y < obstacle.y + obstacle.height &&
            bullet.y + bulletHeight > obstacle.y
          ) {
            obstacles.splice(obsIndex, 1);
            bullets.splice(bulletIndex, 1);
            score++;
          }
        });
      });
   
      powerUps.forEach((powerUp, index) => {
        if (
          player.x < powerUp.x + powerUp.width &&
          player.x + player.width > powerUp.x &&
          player.y < powerUp.y + powerUp.height &&
          player.y + player.height > powerUp.y
        ) {
          player.shots += 10;
          powerUps.splice(index, 1);
        }
      });
   
      lifePowerUps.forEach((lifePowerUp, index) => {
        if (
          player.x < lifePowerUp.x + lifePowerUp.width &&
          player.x + player.width > lifePowerUp.x &&
          player.y < lifePowerUp.y + lifePowerUp.height &&
          player.y + player.height > lifePowerUp.y
        ) {
          player.lives++;
          lifePowerUps.splice(index, 1);
        }
      });
    }
   
    function resetGame() {
      alert("Konec hry! Skóre: " + score);
      player.lives = 3;
      player.shots = 0;
      obstacleSpeed = 3;
      score = 0;
      obstacles.length = 0;
      bullets.length = 0;
      powerUps.length = 0;
      lifePowerUps.length = 0;
    }
   
    function updateGame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
   
      drawPlayer();
      drawObstacles();
      drawPowerUps();
      drawLifePowerUps();
      drawBullets();
   
      movePlayer();
      moveObstacles();
      movePowerUps();
      moveLifePowerUps();
      moveBullets();
   
      checkCollision();
   
      scoreElement.textContent = "Skóre: " + score;
      livesElement.textContent = "Životy: " + player.lives;
      shotsElement.textContent = "Střely: " + player.shots;
   
      requestAnimationFrame(updateGame);
    }
   
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") player.dx = -player.speed;
      else if (e.key === "ArrowRight") player.dx = player.speed;
      else if (e.key === " " && player.shots > 0) {
        bullets.push({ x: player.x + player.width / 2 - bulletWidth / 2, y: player.y });
        player.shots--;
      }
    });
   
    document.addEventListener("keyup", () => player.dx = 0);
   
    setInterval(createObstacle, 1000);
    setInterval(createPowerUp, 5000);
    setInterval(createLifePowerUp, 10000);
   
    updateGame();
  });
   