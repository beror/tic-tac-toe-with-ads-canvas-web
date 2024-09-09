canvas.width = 1280;
canvas.height = 720;

const gridSize = canvas.height * 0.8;
const cellSize = gridSize / 3;
const offsetX = (canvas.width - gridSize) / 2;

let board = Array.from({ length: 3 }, () => Array(3).fill(''));
let playerSymbol, computerSymbol;
let currentPlayer;
let gameOver = false;
let playerTurn;
let selectedCell = { x: 0, y: 0 };
let showEndGameDialog = false;
let playAgainSelected = true;
let winner = null;

function getChanceDraw() {
    return Math.random() < CHANCE;
}

function randomizePlayerAndSymbol() {
    if (getChanceDraw()) {
        playerSymbol = 'X';
        computerSymbol = 'O';
        currentPlayer = 'player';
        playerTurn = true;
    } else {
        playerSymbol = 'O';
        computerSymbol = 'X';
        currentPlayer = 'computer';
        playerTurn = false;
        setTimeout(computerMove, 500);
    }
    updateGamePanel();
}

function checkWinner() {
    const winningCombos = [
        [ [0, 0], [0, 1], [0, 2] ],
        [ [1, 0], [1, 1], [1, 2] ],
        [ [2, 0], [2, 1], [2, 2] ],
        [ [0, 0], [1, 0], [2, 0] ],
        [ [0, 1], [1, 1], [2, 1] ],
        [ [0, 2], [1, 2], [2, 2] ],
        [ [0, 0], [1, 1], [2, 2] ],
        [ [0, 2], [1, 1], [2, 0] ]
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a[0]][a[1]] && 
            board[a[0]][a[1]] === board[b[0]][b[1]] && 
            board[a[0]][a[1]] === board[c[0]][c[1]]) {
            gameOver = true;
            winner = board[a[0]][a[1]] === playerSymbol ? 'player' : 'computer';
            setTimeout(drawEndGameDialog, 10);
            updateGamePanel();
            return;
        }
    }

    if (board.flat().every(cell => cell !== '')) {
        gameOver = true;
        winner = null;
        setTimeout(() => drawEndGameDialog(true), 10);
        updateGamePanel();
    }
}

function computerMove() {
    if (gameOver) return;

    const emptyCells = board.flatMap((row, y) => row.map((cell, x) => (cell === '' ? { x, y } : null)).filter(Boolean));
    if (emptyCells.length > 0) {
        const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[y][x] = computerSymbol;
        drawMark(x, y, computerSymbol);
        checkWinner();
        currentPlayer = 'player';
        playerTurn = true;
        updateGamePanel();
        drawSelection(selectedCell.x, selectedCell.y);
    }
}

function playerMove() {
    if (gameOver || !playerTurn) return;
    if (board[selectedCell.y][selectedCell.x] === '') {
        board[selectedCell.y][selectedCell.x] = playerSymbol;
        drawMark(selectedCell.x, selectedCell.y, playerSymbol);
        checkWinner();
        currentPlayer = 'computer';
        playerTurn = false;
        updateGamePanel();
        setTimeout(computerMove, 500);
    }
}

function handleEndGameDialogInput(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        playAgainSelected = !playAgainSelected;
        drawEndGameDialog();
    } else if (e.key === 'Enter') {
        playAgainSelected ? resetGameWithAd() : window.location = 'https://google.com';
    }
}

function resetGameWithAd() {
    requestAd();
    resetGame();
}

function resetGame() {
    board = Array.from({ length: 3 }, () => Array(3).fill(''));
    gameOver = false;
    showEndGameDialog = false;
    resetCanvas();
    init();
}

function onKeyDown(event) {
    if (showEndGameDialog) {
        handleEndGameDialogInput(event);
    } else {
        switch (event.key) {
            case 'ArrowUp':
                selectedCell.y = (selectedCell.y - 1 + 3) % 3;
                break;
            case 'ArrowDown':
                selectedCell.y = (selectedCell.y + 1) % 3;
                break;
            case 'ArrowLeft':
                selectedCell.x = (selectedCell.x - 1 + 3) % 3;
                break;
            case 'ArrowRight':
                selectedCell.x = (selectedCell.x + 1) % 3;
                break;
            case 'Enter':
                playerMove();
                break;
        }
        drawSelection(selectedCell.x, selectedCell.y);
    }
}

document.addEventListener('keydown', onKeyDown);

function init() {
    randomizePlayerAndSymbol();
    drawGrid();
    drawSelection(selectedCell.x, selectedCell.y);
}

init();
