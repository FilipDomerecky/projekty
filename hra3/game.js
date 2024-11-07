const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
 
const scoreDisplay = document.getElementById("scoreDisplay");
 
const player = {
  x: 200,
  y: 500,
  width: 30,
  height: 30,
  color: "red",
  dx: 0, // Rychlost pohybu hráče
  dy: 0,
  jumpStrength: -15, // Standardní výška skoku
  highJumpStrength: -30, // Výška skoku při stisknutí "J"
  isJumping: false,
  onGround: false,
  isSpacePressed: false, // Pro detekci držení mezerníku
  spacePressedTime: 0, // Čas, jak dlouho je mezerník stisknutý
  isDoubleJumping: false, // Flag pro dvojitý skok
};
 
const gravity = 0.5;
let score = 0;
let platformWidth = 100; // Počáteční šířka platforem
let platformGap = 150; // Minimální vzdálenost mezi platformami
let maxPlatforms = 15; // Maximální počet platforem na obrazovce
 
// Funkce pro generování platforem
function generatePlatform(lastPlatform) {
  const distance = Math.random() * platformGap + 100; // Platformy budou ve vzdálenosti mezi 100 a platformGap
  const x = Math.random() * (canvas.width - platformWidth);
  const y = lastPlatform ? lastPlatform.y - distance : canvas.height; // Pokud poslední platforma existuje, nová bude pod ní
  const newWidth = platformWidth * (1 - (score * 0.02)); // Platformy se zúží s postupem skóre (pomalu)
 
  return { x, y, width: newWidth, height: 10, color: getRandomColor() };
}
 
// Funkce pro získání náhodné barvy pro platformy
function getRandomColor() {
  const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];
  return colors[Math.floor(Math.random() * colors.length)];
}
 
// Generování počátečních platforem
let platforms = [
  { x: 150, y: 550, width: 100, height: 10, color: "#e74c3c" },
  { x: 250, y: 400, width: 100, height: 10, color: "#3498db" },
  { x: 50, y: 300, width: 100, height: 10, color: "#2ecc71" },
  { x: 200, y: 150, width: 100, height: 10, color: "#f1c40f" },
];
 
// Funkce pro vykreslení hráče
function drawPlayer() {
  if (!player.gradient) {
    player.gradient = ctx.createLinearGradient(player.x, player.y, player.x, player.y + player.height);
    player.gradient.addColorStop(0, "#ff7e5f");
    player.gradient.addColorStop(1, "#feb47b");
  }
  ctx.fillStyle = player.gradient;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}
 
// Funkce pro vykreslení platforem
function drawPlatforms() {
  platforms.forEach(platform => {
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}
 
// Funkce pro aplikaci gravitace
function applyGravity() {
  if (!player.onGround) {
    player.dy += gravity;
    player.y += player.dy;
  }
}
 
// Funkce pro detekci kolizí
function checkCollisions() {
  player.onGround = false;
  platforms.forEach(platform => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height > platform.y &&
      player.y + player.height < platform.y + platform.height &&
      player.dy >= 0
    ) {
      player.onGround = true;
      player.dy = 0;
      player.y = platform.y - player.height; // Ujistíme se, že hráč zůstane na platformě
    }
  });
}
 
// Funkce pro skákání
function jump() {
  let jumpStrength = player.jumpStrength;
 
  // Pokud je stisknuta klávesa "J", skok bude dvojnásobný
  if (player.isSpacePressed && player.spacePressedTime >= 3) {
    jumpStrength = player.highJumpStrength; // Skok o 2x výš
  }
 
  if (player.onGround || !player.isDoubleJumping) {
    player.dy = jumpStrength;
    player.onGround = false;
    player.isDoubleJumping = !player.onGround; // Pokud už není na zemi, povolí druhý skok
    score++;
    scoreDisplay.textContent = "Skóre: " + score;
 
    // Generování nové platformy při každém skoku
    if (score % 5 === 0 && platforms.length < maxPlatforms) {
      const lastPlatform = platforms[platforms.length - 1];
      platforms.push(generatePlatform(lastPlatform)); // Vygenerování nové platformy na základě poslední
    }
  }
}
 
// Funkce pro pohyb doleva a doprava
function movePlayer() {
  player.x += player.dx;
 
  // Zajištění, aby hráč nevyšel z plátna
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}
 
// Funkce pro posun obrazu (scrollování) při dosažení určité výšky
function scrollScene() {
  const scrollThreshold = 200; // Když hráč vyskočí nad tuto hodnotu, scéna se posune
  if (player.y < scrollThreshold) {
    const scrollAmount = scrollThreshold - player.y; // Kolik se scéna posune
    platforms.forEach(platform => platform.y += scrollAmount); // Posuneme všechny platformy nahoru
    player.y = scrollThreshold; // Nastavíme hráče na pozici, kde začne pohyb scény
 
    // Generování nových platforem
    if (Math.random() < 0.05 && platforms.length < maxPlatforms) { // 5% šance na generování nové platformy
      const lastPlatform = platforms[platforms.length - 1];
      platforms.push(generatePlatform(lastPlatform));
    }
  }
}
 
// Funkce pro resetování hry
function resetGame() {
  player.x = 200;
  player.y = 500;
  player.dy = 0;
  player.dx = 0; // Reset pohybu
  score = 0;
  platformWidth = 100; // Reset šířky platforem
  platforms = [
    { x: 150, y: 550, width: 100, height: 10, color: "#e74c3c" },
    { x: 250, y: 400, width: 100, height: 10, color: "#3498db" },
    { x: 50, y: 300, width: 100, height: 10, color: "#2ecc71" },
    { x: 200, y: 150, width: 100, height: 10, color: "#f1c40f" },
  ];
  scoreDisplay.textContent = "Skóre: " + score;
}
 
// Funkce pro aktualizaci hry
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 
  applyGravity();
  movePlayer(); // Pohyb hráče
  checkCollisions();
  scrollScene(); // Posuneme obraz, pokud je potřeba
  drawPlayer();
  drawPlatforms();
 
  if (player.y > canvas.height) {
    resetGame();
  }
 
  requestAnimationFrame(updateGame);
}
 
// Posluchače pro pohyb hráče
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") {
    player.dx = -5; // Pohyb doleva
  } else if (e.code === "ArrowRight") {
    player.dx = 5; // Pohyb doprava
  } else if (e.code === "Space" && !player.isSpacePressed) {
    player.isSpacePressed = true;
    player.spacePressedTime = 0;
    jump(); // Skok při stisknutí mezerníku
  } else if (e.code === "KeyJ") {
    jump(); // Dvojitý skok při stisknutí "J"
  }
});
 
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
    player.dx = 0;
  } else if (e.code === "Space" || e.code === "KeyJ") {
    player.isSpacePressed = false;
  }
});
 
// Začátek hry
updateGame();