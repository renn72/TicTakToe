// Dom Elements
const gameBoardSquares = document.querySelectorAll('.game-board-square');
const gameStateDisplay = document.getElementById('game-state-display');
const gameStateDisplayText = document.getElementById('game-state-display-text');
const gameStateDisplayImage = document.getElementById('game-state-display-img');
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

const timerDisplay = document.querySelector('.timer-display');

const iconImages = [
  'images/Cross-66.svg',
  'images/duck-line-art.svg',
  'images/Inverted-Diamond-Circle.svg',
  'images/Maltese-Cross-Silhouette.svg',
  'images/young-pirate-bw.svg',
];
// Game Variables

let difficulty = 0;
let currentTurn = 0;
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
let currentPlayerPiece = 'x';
let aiThinking = false;

// handlers

function startGame() {
  console.log('start game');
  currentTurn = 0;
  playedSquares = [];
  gameWon = false;
  gameStateDisplay.style.transform = '';
  setPlayerName();
  setPlayerIcon();
  clearSplash();
  generateGame();
  setTimer();
  setGameStateDisplay();
}

function handlerBoardSquare(event) {
  if (gameWon || currentTurn === 10 || currentTurn === 0 || aiThinking) {
    return;
  }

  event.target.firstElementChild.src = currentPlayer.icon;
  event.target.classList.add('clicked');

  currentPlayer.plays.push(Number(event.target.dataset.loc));
  playedSquares.push(Number(event.target.dataset.loc));
  console.log(playedSquares);

  if (checkWinState()) {
    console.log('winner');
    gameStateDisplayText.textContent = `Winner!`;
    gameStateDisplayImage.classList.add('hidden');
    gameStateDisplayText.classList.remove('hidden');
    return;
  }

  console.log(currentTurn);
  if (currentTurn === 9) {
    console.log('draw');
    gameStateDisplayText.textContent = "It's a Draw!";
    gameStateDisplayImage.classList.add('hidden');
    gameStateDisplayText.classList.remove('hidden');
  } else {
    console.log('playing');
    if (currentPlayer === player2) {
      currentPlayer = player1;
      gameStateDisplayImage.src = currentPlayer.icon;
    } else {
      currentPlayer = player2;
      gameStateDisplayImage.src = currentPlayer.icon;
      aiCalc();
    }
  }
  clearTimer();
  startTimer();

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
  aiThinking = true;
  let luckySquare = -1;
  if (difficulty < 1) {
    luckySquare = Math.floor(Math.random() * 9);
    while (playedSquares.includes(luckySquare)) {
      luckySquare = Math.floor(Math.random() * 9);
    }
  } else {
    let count = 0;

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
          if (!playedSquares.includes(square)) {
            luckySquare = square;
          }
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
  console.log('MegaBrain will play ' + luckySquare);

  setTimeout(function () {
    aiThinking = false;
    gameBoardSquares[luckySquare].click();
  }, 2500);
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

function setGameStateDisplay() {
  gameStateDisplayImage.classList.add('hidden');
  gameStateDisplayText.classList.remove('hidden');
  gameStateDisplayText.textContent = 'Click to start';
}

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

function setTimer() {
  if (difficulty === 2) {
    timerDisplay.classList.remove('disappear');
    timerDisplay.textContent = '5';
  }
}

var count4 = null;
var count3 = null;
var count2 = null;
var count1 = null;
var count0 = null;

function startTimer() {
  if (currentTurn === 9) {
    return;
  }
  if (difficulty === 2) {
    timerDisplay.textContent = '5';
    count4 = setTimeout(function () {
      timerDisplay.textContent = '4';
    }, 980);
    count3 = setTimeout(function () {
      timerDisplay.textContent = '3';
    }, 1980);
    count2 = setTimeout(function () {
      timerDisplay.textContent = '2';
    }, 2980);
    count1 = setTimeout(function () {
      timerDisplay.textContent = '1';
    }, 3980);
    count0 = setTimeout(function () {
      timerDisplay.textContent = '0';
      flashTimerRed();
    }, 4980);
  }
}

function clearTimer() {
  clearTimeout(count4);
  clearTimeout(count3);
  clearTimeout(count2);
  clearTimeout(count1);
  clearTimeout(count0);
}

function flashTimerRed() {}

function pickWhoStarts() {
  let randStart = Math.random();
  if (randStart > 0.9) {
    currentPlayer = player1;
  } else {
    currentPlayer = player2;
  }
  currentTurn = 1;
  gameStateDisplayText.classList.add('hidden');
  gameStateDisplay.style.transition =
    'all 3.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
  gameStateDisplay.style.transform = 'rotateX(720deg)';

  gameStateDisplayImage.src = currentPlayer.icon;
  gameStateDisplayImage.classList.remove('hidden');
  gameStateDisplayImage.style.animation =
    'fadeIn 4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  if (currentPlayer === player2) {
    setTimeout(function () {
      aiCalc();
    }, 3000);
  }
  setTimeout(function () {
    startTimer();
  }, 2000);
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

gameStateDisplay.addEventListener('click', pickWhoStarts);
