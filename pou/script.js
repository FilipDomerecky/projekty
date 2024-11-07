document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const platform = document.createElement('img');
    platform.src = 'pou.png';
    platform.style.position = 'absolute';
    platform.style.bottom = '0';
    platform.style.left = '50%';
    platform.style.transform = 'translateX(-50%)';
    platform.style.width = '100px';
    platform.style.height = '60px';
    gameArea.appendChild(platform);

    let platformSpeed = 2; 
    let itemsCaught = 0; 

    let platformLeft = gameArea.offsetWidth / 2 - platform.offsetWidth / 2;
    let score = 0;
    let lives = 3; 

    // skóre
    const scoreDisplay = document.createElement('div');
    scoreDisplay.style.position = 'absolute';
    scoreDisplay.style.top = '10px';
    scoreDisplay.style.left = '10px';
    scoreDisplay.style.color = 'black';
    scoreDisplay.innerText = 'Skóre: 0';
    gameArea.appendChild(scoreDisplay);

    // životy
    const livesDisplay = document.createElement('div');
    livesDisplay.style.position = 'absolute';
    livesDisplay.style.top = '30px';
    livesDisplay.style.left = '10px';
    livesDisplay.style.color = 'red';
    livesDisplay.innerText = 'Životy: ' + lives;
    gameArea.appendChild(livesDisplay);

    // Pohyb plošiny
    let isMovingLeft = false;
    let isMovingRight = false;
 
    function movePlatform() {
        if (isMovingLeft && platformLeft > 60) {
            platformLeft -= platformSpeed;
        }
        if (isMovingRight && platformLeft < gameArea.offsetWidth - platform.offsetWidth + 60) {
            platformLeft += platformSpeed;
        }
        platform.style.left = platformLeft + 'px';
        requestAnimationFrame(movePlatform);
    }
 
    document.addEventListener('keydown', (e) => {
        if (e.key === 'a') {
            isMovingLeft = true;
        }
        if (e.key === 'd') {
            isMovingRight = true;
        }
    });
 
    document.addEventListener('keyup', (e) => {
        if (e.key === 'a') {
            isMovingLeft = false;
        }
        if (e.key === 'd') {
            isMovingRight = false;
        }
    });
 
    movePlatform();

    // Detekce kolize
    function checkCollision(square) {
        const platformBounds = platform.getBoundingClientRect();
        const squareBounds = square.getBoundingClientRect();

        return !(squareBounds.right < platformBounds.left ||
            squareBounds.left > platformBounds.right ||
            squareBounds.bottom < platformBounds.top ||
            squareBounds.top > platformBounds.bottom);
    }

    // Generování jidla
    function spawnSquare() {
        const square = document.createElement('div');
        square.classList.add('square');
    
        const imageOverlay = document.createElement('img');
        const randomImage = getRandomImage();
        imageOverlay.src = randomImage;
        imageOverlay.style.width = '100%';
        imageOverlay.style.height = '100%';
        square.appendChild(imageOverlay);
    
        square.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
        gameArea.appendChild(square);
    
        let position = 0;
    
        function fall() {
            if (position < gameArea.offsetHeight - square.offsetHeight) {
                position += 2 + level * 0.5;;
                square.style.top = position + 'px';
    
                if (checkCollision(square)) {
                    if (imageOverlay.src.includes('Heart.png') && lives < 3) {
                        lives++;
                        livesDisplay.innerText = 'Životy: ' + lives;
                        itemsCaught++;
                        updateLevel();
                    } else if (imageOverlay.src.includes('kamen.png') && lives > 1){
                        lives -= 2;
                        livesDisplay.innerText = 'Životy: ' + lives;
                        itemsCaught++;
                        updateLevel();
                    } else if (imageOverlay.src.includes('kamen.png') && lives === 1 || imageOverlay.src.includes('kamen.png') && lives === 0){
                        lives = 0;
                        livesDisplay.innerText = 'Životy: ' + lives;
                        alert('Prohrál jsi! Konec hry! Tvé skóre je: ' + score);
                        window.location.reload();
                    } else {
                        itemsCaught++;
                        score++;
                        scoreDisplay.innerText = 'Skóre: ' + score;
                        updateLevel();
                    }
                    square.remove();
                    updateLevel();

                } else {
                    requestAnimationFrame(fall);
                    updateLevel();
                }
            } else {
                if(imageOverlay.src.includes('Heart.png')){
                    lives
                } else if (imageOverlay.src.includes('kamen.png')){
                    lives
                } else {lives--}
                livesDisplay.innerText = 'Životy: ' + lives;
                square.remove();
                if (lives <= 0) {
                    alert('Konec hry! Vaše skóre je: ' + score);
                    window.location.reload();
                }
            }
        }
    
        fall();
    }
    

    // random obrazky
    function getRandomImage() {
        const images = ['fries.png', 'kebab.png', 'pizza.png', "Heart.png", "kamen.png"];
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }

    setInterval(spawnSquare, 1000);

    const levelDisplay = document.createElement('div');
    levelDisplay.style.position = 'absolute';
    levelDisplay.style.top = '50px';
    levelDisplay.style.left = '10px';
    levelDisplay.style.color = 'green';
    levelDisplay.innerText = 'Úroveň: 1';
    gameArea.appendChild(levelDisplay);

    let level = 1;

    function updateLevel() {
        if(level < 10){
            level = 1 + Math.floor(itemsCaught / 10); 
            levelDisplay.innerText = 'Úroveň: ' + level;
            platformSpeed = 20 + level * 5; 
        }
    }
    updateLevel();

});

