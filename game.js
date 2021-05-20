// Dom Elements
const gameBoardSquares = document.querySelectorAll('.game-board-square');
const gameStateDisplay = document.getElementById('game-state-display');

// Game Variables

let currentTurn = 1;
const winningPlays = [
  [0, 1, 2],
  [0, 4, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];
let player1 = {
  name: 'john',
  piece: 'x',
  plays: [],
};
let player2 = {
  name: 'joe',
  piece: 'o',
  plays: [],
};
let currentPlayer = player1;

// handlers

function handlerBoardSquare(event) {
  currentTurn++;

  event.target.firstElementChild.textContent = currentPlayer.piece;
  event.target.classList.add('clicked');

  currentPlayer.plays.push(Number(event.target.dataset.loc));
  console.log(event.target.dataset.loc);
  console.log(currentPlayer.plays);

  if (checkWinState()) {
    console.log('winner');
    gameStateDisplay.textContent = `${currentPlayer.piece} wins!`;
    return;
  }

  if (currentPlayer === player1) {
    currentPlayer = player2;
  } else {
    currentPlayer = player1;
  }

  if (currentTurn % 2 === 0) {
    gameStateDisplay.textContent = 'player o turn';
  } else {
    gameStateDisplay.textContent = 'player x turn';
  }
}

// checking for a winner

function checkWinState() {
  winner = false;
  for (let i = 0; i < winningPlays.length; i++) {
    {
      let matchPlays = 0;
      let winningPlay = winningPlays[i];
      for (let y = 0; y < winningPlay.length; y++) {
        let play = winningPlay[y];
        if (currentPlayer.plays.includes(play)) {
          matchPlays++;
        }
        console.log(matchPlays);
        if (matchPlays === 3) {
          console.log('win');
          winner = true;
        }
      }
    }
  }
  return winner;
}

// Listeners
gameBoardSquares.forEach((x) => {
  x.addEventListener('click', handlerBoardSquare);
});
