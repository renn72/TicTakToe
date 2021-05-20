// Dom Elements
const gameBoardSquares = document.querySelectorAll('.game-board-square');
const gameStateDisplay = document.getElementById('game-state-display');
const playerName = document.getElementById('player-name');
const startButton = document.querySelector('.start-button');
const splashScreenContainer = document.querySelector(
  '.splash-screen-container'
);
const mainGameContainer = document.querySelector('.main-game-container');
const player1Container = document.querySelector('.player-1-container');
const player2Container = document.querySelector('.player-2-container');

const difficultySettings = document.querySelectorAll('.difficulty-setting');

const player1Icon = document.querySelector('.player1-icon');
const player2Icon = document.querySelector('.player2-icon');

const restartButton = document.querySelector('.restart-btn');

const difficultyDescription = document.querySelector('.difficulty-description');

const iconImages = [
  'images/Cross-66.svg',
  'images/duck-line-art.svg',
  'images/Inverted-Diamond-Circle.svg',
  'images/Maltese-Cross-Silhouette.svg',
  'images/young-pirate-bw.svg',
];
// Game Variables

let difficulty = 0;
let currentTurn = 1;
let playedSquares = [];
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
  name: '',
  piece: 'x',
  plays: [],
  icon: '',
};
let player2 = {
  name: 'MegaBrain',
  piece: 'o',
  plays: [],
  icon: '',
};
let currentPlayer = player1;
let gameWon = false;

// handlers

function startGame() {
  console.log('start game');
  currentTurn = 1;
  playedSquares = [];
  gameWon = false;
  setPlayerName();
  setPlayerIcon();
  clearSplash();
  generateGame();
  gameStateDisplay.textContent = `its ${player1.name}'s turn`;
}

function handlerBoardSquare(event) {
  if (gameWon) {
    return;
  }

  event.target.firstElementChild.src = currentPlayer.icon;
  event.target.classList.add('clicked');

  currentPlayer.plays.push(Number(event.target.dataset.loc));
  playedSquares.push(Number(event.target.dataset.loc));
  console.log(playedSquares);
  console.log(event.target.dataset.loc);
  console.log(currentPlayer.plays);

  if (checkWinState()) {
    console.log('winner');
    gameStateDisplay.textContent = `${currentPlayer.name} wins!`;
    return;
  }

  if (currentPlayer === player1) {
    currentPlayer = player2;
  } else {
    currentPlayer = player1;
  }
  if (currentTurn === 8) {
  } else {
    if (currentTurn % 2 == 0) {
      gameStateDisplay.textContent = `its ${player1.name}'s turn`;
    } else {
      gameStateDisplay.textContent = `its ${player2.name}'s turn`;
      aiCalc();
    }
  }
  currentTurn++;
}

function setDifficulty(event) {
  difficultySettings.forEach((setting) => {
    setting.classList.remove('selected-difficulty');
  });
  event.target.classList.add('selected-difficulty');
  if (event.target.classList.contains('easy')) {
    difficultyDescription.textContent = 'Easy: Simple Ai, no turn timer';
    difficulty = 0;
  } else if (event.target.classList.contains('medium')) {
    difficultyDescription.textContent = 'Medium: Smart Ai, no turn timer';
    difficulty = 1;
  } else if (event.target.classList.contains('hard')) {
    difficultyDescription.textContent = 'Hard: Smart Ai and a turn timer';
    difficulty = 2;
  }
}

// AI

function aiCalc() {
  let luckySquare = -1;
  if (difficulty < 1) {
    luckySquare = Math.floor(Math.random() * 8);
    while (playedSquares.includes(luckySquare)) {
      luckySquare = Math.floor(Math.random() * 8);
    }
  } else {
    let count = 0;
    // check to see if I can win
    winningPlays.forEach((play) => {
      count = 0;
      play.forEach((square) => {
        if (player2.plays.includes(square)) {
          count++;
        }
      });
      if (count === 2) {
        play.forEach((square) => {
          if (!playedSquares.includes(square)) luckySquare = square;
        });
      }
    });
    // check to see if player can win, if so stop them
    winningPlays.forEach((play) => {
      count = 0;
      play.forEach((square) => {
        if (player1.plays.includes(square)) {
          count++;
        }
      });
      if (count === 2) {
        play.forEach((square) => {
          if (!playedSquares.includes(square)) luckySquare = square;
        });
      }
    });

    // otherwise go random
    if (luckySquare === -1) {
      luckySquare = Math.floor(Math.random() * 8);
      while (playedSquares.includes(luckySquare)) {
        luckySquare = Math.floor(Math.random() * 8);
      }
    }
  }
  console.log(luckySquare);
  console.log(gameBoardSquares[luckySquare]);
  setTimeout(function () {
    gameBoardSquares[luckySquare].click();
  }, 1500);
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
        if (matchPlays === 3) {
          console.log('win');
          gameWon = true;
          winner = true;
        }
      }
    }
  }
  return winner;
}

// startup functions

function setPlayerName() {
  if (playerName.value) {
    player1.name = playerName.value;
  } else {
    player1.name = 'Lazy John';
  }
  if (difficulty < 1) {
    player2.name = 'DumbBrain';
  }
  player1Container.children[0].textContent = player1.name;
  player2Container.children[0].textContent = player2.name;
  player1.plays = [];
  player2.plays = [];
}

function setPlayerIcon() {
  let randPlayer1 = Math.floor(Math.random() * iconImages.length);
  let randPlayer2 = randPlayer1;
  while (randPlayer1 === randPlayer2) {
    randPlayer2 = Math.floor(Math.random() * iconImages.length);
  }

  player1Icon.src = player1.icon = iconImages[randPlayer1];
  player2Icon.src = player2.icon = iconImages[randPlayer2];
}

function clearSplash() {
  splashScreenContainer.classList.add('hidden');
}

function generateGame() {
  mainGameContainer.classList.remove('hidden');
  gameBoardSquares.forEach((square) => {
    square.classList.remove('clicked');
    square.children[0].src = '';
  });
}

// Listeners
gameBoardSquares.forEach((x) => {
  x.addEventListener('click', handlerBoardSquare);
});

startButton.addEventListener('click', startGame);

restartButton.addEventListener('click', startGame);

difficultySettings.forEach((setting) => {
  setting.addEventListener('click', setDifficulty);
});
