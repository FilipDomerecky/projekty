// script.js
const board = document.querySelector('.board');
let selectedPiece = null;
let selectedSquare = null;
let hasMoved = {}; // Sledování, jestli figura už byla přesunuta

// Funkce pro vytvoření šachovnice s figurkami
function createBoard() {
    const initialBoard = [
        ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'], // černé figurky
        ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'], // černí pěšci
        ['', '', '', '', '', '', '', ''],           // prázdné řádky
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'], // bílí pěšci
        ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']  // bílé figurky
    ];

    // Vytvoření šachovnice
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.setAttribute('data-row', row);
            square.setAttribute('data-col', col);

            // Určujeme barvu pole na základě pozice (střídáme černé a bílé)
            if ((row + col) % 2 === 0) {
                square.classList.add('white');
            } else {
                square.classList.add('black');
            }

            // Přidáme figuru do pole podle pozice
            const piece = initialBoard[row][col];
            if (piece) {
                const pieceElement = document.createElement('span');
                pieceElement.textContent = piece;
                square.appendChild(pieceElement);

                // Přiřadíme figurce události pro kliknutí
                pieceElement.addEventListener('click', handlePieceClick);
            }

            square.addEventListener('click', handleSquareClick);
            board.appendChild(square);
        }
    }
}

// Funkce pro výběr figurky a zvýraznění platných polí
function handlePieceClick(event) {
    const piece = event.target;
    const square = piece.parentElement;
    const row = parseInt(square.getAttribute('data-row'));
    const col = parseInt(square.getAttribute('data-col'));

    if (selectedPiece) {
        selectedPiece.classList.remove('selected');
    }
    selectedPiece = piece;
    selectedSquare = square;
    selectedPiece.classList.add('selected');

    // Vypočítáme dostupná pole pro tuto figurku
    highlightValidMoves(row, col, piece.textContent);
}

// Funkce pro zvýraznění polí, kam může figura jít
function highlightValidMoves(row, col, piece) {
    // Nejprve vyčistíme předchozí zvýraznění
    clearHighlights();

    if (piece === '♙' || piece === '♟') {
        highlightPawnMoves(row, col, piece);
    } else if (piece === '♖' || piece === '♖') {
        highlightRookMoves(row, col);
    } else if (piece === '♘' || piece === '♞') {
        highlightKnightMoves(row, col);
    } else if (piece === '♗' || piece === '♝') {
        highlightBishopMoves(row, col);
    } else if (piece === '♛' || piece === '♕') {
        highlightQueenMoves(row, col);
    } else if (piece === '♔' || piece === '♚') {
        highlightKingMoves(row, col);
    }
}

function clearHighlights() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => square.classList.remove('highlight'));
}

// Funkce pro zvýraznění pohybu pěšce
function highlightPawnMoves(row, col, piece) {
    const direction = (piece === '♙') ? -1 : 1; // Bílé pěšce posunujeme nahoru, černé dolů
    const squares = document.querySelectorAll('.square');
    const forwardRow = row + direction;
    
    // Pokud je pole přímo vpřed volné, zvýrazníme to
    if (forwardRow >= 0 && forwardRow < 8) {
        const forwardSquare = document.querySelector(`.square[data-row="${forwardRow}"][data-col="${col}"]`);
        if (!forwardSquare.firstChild) {
            forwardSquare.classList.add('highlight');
        }

        // Pěšec může jít o dvě políčka vpřed, pokud je na své startovní pozici
        if ((row === 6 && piece === '♙') || (row === 1 && piece === '♟')) {
            const doubleStepRow = row + 2 * direction;
            const doubleStepSquare = document.querySelector(`.square[data-row="${doubleStepRow}"][data-col="${col}"]`);
            const squareInFront = document.querySelector(`.square[data-row="${forwardRow}"][data-col="${col}"]`);
            // Zajistíme, že oba políčka (o jedno i o dvě) jsou volná
            if (!forwardSquare.firstChild && !doubleStepSquare.firstChild && !squareInFront.firstChild) {
                doubleStepSquare.classList.add('highlight');
            }
        }
    }

    // Pěšec může útočit diagonálně na soupeřovu figuru
    const attackDirections = [
        { dr: direction, dc: 1 }, // diagonálně vpravo
        { dr: direction, dc: -1 } // diagonálně vlevo
    ];

    attackDirections.forEach(({ dr, dc }) => {
        const attackRow = row + dr;
        const attackCol = col + dc;
        if (attackRow >= 0 && attackRow < 8 && attackCol >= 0 && attackCol < 8) {
            const attackSquare = document.querySelector(`.square[data-row="${attackRow}"][data-col="${attackCol}"]`);
            if (attackSquare.firstChild && attackSquare.firstChild.textContent !== piece) { // Pokud je tam soupeřova figurka
                attackSquare.classList.add('highlight');
            }
        }
    });
}

// Funkce pro zvýraznění pohybu věže
function highlightRookMoves(row, col) {
    const directions = [
        { dr: 1, dc: 0 },  // dolů
        { dr: -1, dc: 0 }, // nahoru
        { dr: 0, dc: 1 },  // vpravo
        { dr: 0, dc: -1 }, // vlevo
    ];
    directions.forEach(({ dr, dc }) => {
        let r = row, c = col;
        while (true) {
            r += dr;
            c += dc;
            if (r < 0 || r >= 8 || c < 0 || c >= 8) break;
            const target = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
            if (target && target.firstChild) break; // Stop pokud je pole obsazené
            if (target) target.classList.add('highlight');
        }
    });
}

function handleSquareClick(event) {
    const targetSquare = event.target;
    if (targetSquare.classList.contains('highlight')) {
        // Přesuneme figurku na nové pole
        targetSquare.appendChild(selectedPiece);
        hasMoved[selectedPiece.textContent] = true; // Po pohybu si zapamatujeme, že figura byla přesunuta
        clearHighlights(); // Po přesunutí zrušíme zvýraznění
    }
}

// Voláme funkci pro vytvoření šachovnice při načtení stránky
createBoard();
