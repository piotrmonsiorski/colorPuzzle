const fieldSize = 50;

const board = document.querySelector('.board');
// const cornerColors = [ [255,178,132], [255,178,255], [255,47,255], [134,47,138] ]

let game = new Game(5, 5);
// game.board.renderMap();

const btnSettings = document.querySelector('[name="settingsToggle"]');
const btnNewGame = document.querySelector('[name="newGame"]');
const btnSolveBoard = document.querySelector('[name="solveBoard"]');
const btnRestartBoard = document.querySelector('[name="restartBoard"]');
const btnHelp = document.querySelector('[name="help"]');
const btncloseVictory = document.querySelector('[name="closeVictory"]');
const btncloseHelp = document.querySelector('[name="closeHelp"]');

btnSettings.addEventListener('click', () => {
  document.querySelector('.settings-menu').classList.toggle('open');
});

btnNewGame.addEventListener('click', () => {
  document.querySelector('.settings-menu').classList.remove('open');

  let cols = document.querySelector('input[name="cols"]').value;
  let rows = document.querySelector('input[name="rows"]').value;

  cols > 2 ? true : cols = game.board.cols;
  rows > 2 ? true : rows = game.board.rows;

  const colorsHEX = [
    document.querySelector('input[name="colorTopLeft"]').value,
    document.querySelector('input[name="colorTopRight"]').value,
    document.querySelector('input[name="colorBotLeft"]').value,
    document.querySelector('input[name="colorBotRight"]').value
  ];

  const colorsRGB = [];

  for(let color of colorsHEX) {
    const colR = parseInt(color.slice(1,3), 16);
    const colG = parseInt(color.slice(3,5), 16);
    const colB = parseInt(color.slice(5,7), 16);

    colorsRGB.push([colR, colG, colB]);
  }
  game = new Game(cols, rows, colorsRGB)

  document.querySelector('.menu').classList.toggle('open');
})

btnSolveBoard.addEventListener('click', () => {
  game.board.solveBoard();
  game.board.renderMap();
});

btnRestartBoard.addEventListener('click', () => {
  game.board.shuffleFields();
  game.moves = 0;
  game.updateGame();
  game.board.renderMap();

});

btnHelp.addEventListener('click', () => {
  document.querySelector('[name="helpMessage"]').classList.toggle('open');
});

btncloseVictory.addEventListener('click', () => {
  document.querySelector('[name="victoryMessage"]').classList.remove('open');
});

btncloseHelp.addEventListener('click', () => {
  document.querySelector('[name="helpMessage"]').classList.remove('open');
});
