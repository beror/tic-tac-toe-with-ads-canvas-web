const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CHANCE = 0.9;

function updateGamePanel() {
    const turnText = gameOver ? 'Game Over' : (playerTurn ? "Your turn" : "Computer's turn");
    ctx.clearRect(0, 0, canvas.width, canvas.height * 0.2);
    ctx.font = '28px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(`You: ${playerSymbol}  |  Computer: ${computerSymbol}  |  ${turnText}`, canvas.width / 2, 40);
}

function drawGrid() {
    ctx.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
        drawLine(offsetX + i * cellSize, canvas.height * 0.2, offsetX + i * cellSize, canvas.height);
        drawLine(offsetX, canvas.height * 0.2 + i * cellSize, offsetX + gridSize, canvas.height * 0.2 + i * cellSize);
    }
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawMark(x, y, player) {
    const padding = 40;
    const centerX = offsetX + x * cellSize + cellSize / 2;
    const centerY = canvas.height * 0.2 + y * cellSize + cellSize / 2;
    
    if (player === 'X') {
        drawLine(offsetX + x * cellSize + padding, canvas.height * 0.2 + y * cellSize + padding, offsetX + (x + 1) * cellSize - padding, canvas.height * 0.2 + (y + 1) * cellSize - padding);
        drawLine(offsetX + (x + 1) * cellSize - padding, canvas.height * 0.2 + y * cellSize + padding, offsetX + x * cellSize + padding, canvas.height * 0.2 + (y + 1) * cellSize - padding);
    } else if (player === 'O') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, cellSize / 2 - padding, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawSelection(x, y) {
    ctx.clearRect(offsetX - 10, canvas.height * 0.2 - 10, gridSize + 20, gridSize + 20);

    drawGrid();
    board.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
        if (cell !== '') drawMark(colIndex, rowIndex, cell);
    }));

    if (playerTurn && !gameOver) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(offsetX + x * cellSize, canvas.height * 0.2 + y * cellSize, cellSize, cellSize);
        ctx.strokeStyle = 'black';
    }
}

function drawEndGameDialog(isDraw = false) {
    const dialogWidth = 400;
    const dialogHeight = 200;
    const dialogX = (canvas.width - dialogWidth) / 2;
    const dialogY = (canvas.height - dialogHeight) / 2;

    if (!showEndGameDialog) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    showEndGameDialog = true;

    ctx.fillStyle = 'white';
    ctx.fillRect(dialogX, dialogY, dialogWidth, dialogHeight);

    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    const message = isDraw ? "It's a draw" : `${winner} ("${winner === 'player' ? playerSymbol : computerSymbol}") won`;
    ctx.fillText(message, canvas.width / 2, dialogY + 40);
    ctx.fillText('Play Again?', canvas.width / 2, dialogY + 80);

    const playAgainText = playAgainSelected ? '> Play Again' : 'Play Again';
    const exitText = !playAgainSelected ? '> Exit' : 'Exit';
    ctx.fillText(playAgainText, canvas.width / 2, dialogY + 120);
    ctx.fillText(exitText, canvas.width / 2, dialogY + 160);
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}