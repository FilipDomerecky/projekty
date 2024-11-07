const words = ["programátor", "javascript", "internet", "sachy", "html", "css", "framework", "kreativita"];
let chosenWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
let maxWrongGuesses = 6;

// Prvotní nastavení hry
function initializeGame() {
    chosenWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongGuesses = 0;
    document.getElementById("attempts").textContent = wrongGuesses;
    document.getElementById("message").textContent = "";
    updateWordDisplay();
    drawHangman();
    document.getElementById("guessInput").disabled = false;
    document.getElementById("guessButton").disabled = false;
    document.getElementById("resetButton").style.display = "none";
}

// Funkce pro zobrazení aktuálního stavu slova
function updateWordDisplay() {
    let displayWord = "";
    for (let letter of chosenWord) {
        if (guessedLetters.includes(letter)) {
            displayWord += letter + " ";
        } else {
            displayWord += "_ ";
        }
    }
    document.getElementById("wordDisplay").textContent = displayWord.trim();
}

// Funkce pro vykreslení šibenice
// Funkce pro vykreslení šibenice
function drawHangman() {
    const canvas = document.getElementById("hangmanCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Vyčistit plátno

    // Kreslíme šibenici
    ctx.beginPath();
    ctx.moveTo(20, 170);  // Spodní část
    ctx.lineTo(120, 170); // Šikmá část
    ctx.moveTo(60, 10);   // Svislý sloup
    ctx.lineTo(60, 140);
    ctx.moveTo(20, 10);   // Horní část
    ctx.lineTo(100, 10);  // Příčka
    ctx.stroke();
    
    

    // Vykreslení provázku (s malým posunem, aby nezasahoval do hlavy)
    if (wrongGuesses >= 1) {
        ctx.beginPath();
        ctx.moveTo(100, 10); // Posunutý začátek provázku (vyšší)
        ctx.lineTo(100, 45); // Končí na hlavě
        ctx.stroke();
    }

    if (wrongGuesses >= 1) {
        // Hlavička
        ctx.beginPath();
        ctx.arc(100, 60, 15, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (wrongGuesses >= 2) {
        // Tělo
        ctx.beginPath();
        ctx.moveTo(100, 75);
        ctx.lineTo(100, 110);
        ctx.stroke();
    }
    if (wrongGuesses >= 3) {
        // Levá ruka
        ctx.beginPath();
        ctx.moveTo(100, 85);
        ctx.lineTo(80, 95);
        ctx.stroke();
    }
    if (wrongGuesses >= 4) {
        // Pravá ruka
        ctx.beginPath();
        ctx.moveTo(100, 85);
        ctx.lineTo(120, 95);
        ctx.stroke();
    }
    if (wrongGuesses >= 5) {
        // Levá noha
        ctx.beginPath();
        ctx.moveTo(100, 110);
        ctx.lineTo(80, 130);
        ctx.stroke();
    }
    if (wrongGuesses >= 6) {
        // Pravá noha
        ctx.beginPath();
        ctx.moveTo(100, 110);
        ctx.lineTo(120, 130);
        ctx.stroke();
    }
}


// Funkce pro zpracování hádání
function handleGuess() {
    const guessInput = document.getElementById("guessInput");
    const guess = guessInput.value.toLowerCase();

    if (!guess || guessedLetters.includes(guess) || guess.length !== 1) {
        document.getElementById("message").textContent = "Zadejte jedno písmeno, které ještě neexistuje.";
        return;
    }

    guessedLetters.push(guess);
    if (chosenWord.includes(guess)) {
        updateWordDisplay();
    } else {
        wrongGuesses++;
        document.getElementById("attempts").textContent = wrongGuesses;
        drawHangman();
    }

    if (wrongGuesses >= maxWrongGuesses) {
        document.getElementById("message").textContent = "Prohrál(a) jsi! Slovo bylo: " + chosenWord;
        document.getElementById("guessInput").disabled = true;
        document.getElementById("guessButton").disabled = true;
        document.getElementById("resetButton").style.display = "inline-block";
    } else if (!document.getElementById("wordDisplay").textContent.includes("_")) {
        document.getElementById("message").textContent = "Gratuluji, vyhrál(a) jsi!";
        document.getElementById("guessInput").disabled = true;
        document.getElementById("guessButton").disabled = true;
        document.getElementById("resetButton").style.display = "inline-block";
    }

    guessInput.value = "";
    guessInput.focus();
}

// Zpracování kliknutí na tlačítko
document.getElementById("guessButton").addEventListener("click", handleGuess);

// Počet pokusů - zajištění, že hráč může začít novou hru
document.getElementById("guessInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        handleGuess();
    }
});

// Inicializace nové hry po prohře nebo výhře
document.getElementById("resetButton").addEventListener("click", initializeGame);

// Inicializace první hry
initializeGame();
