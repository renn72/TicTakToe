// Dom Elements
const gameBoardSquares = document.querySelectorAll('.game-board-square');
var currentPlayer = 'x';

// handlers

function handlerBoardSquare(event) {
  console.log(currentPlayer);
  event.target.firstElementChild.textContent = currentPlayer;
  if (currentPlayer === 'x') {
    currentPlayer = 'o';
  } else {
    currentPlayer = 'x';
  }
}

// Listeners
gameBoardSquares.forEach((x) => {
  x.addEventListener('click', handlerBoardSquare);
});
