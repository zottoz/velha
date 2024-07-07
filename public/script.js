document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const messageElement = document.getElementById("message");
    let currentPlayer = "X";
    let board = Array(9).fill(null);

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    cells.forEach(cell => {
        cell.addEventListener("click", handleClick);
    });

    function handleClick(e) {
        const cell = e.target;
        const index = cell.getAttribute("data-index");

        if (board[index] || checkWin()) {
            return;
        }

        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        if (checkWin()) {
            messageElement.textContent = `${currentPlayer} venceu!`;
        } else if (board.every(cell => cell)) {
            messageElement.textContent = "Empate!";
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            messageElement.textContent = `É a vez de ${currentPlayer}`;
        }
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return board[index] && board[index] === currentPlayer;
            });
        });
    }
});
