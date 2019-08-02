const boardNode = document.querySelector('.board');

class Game {
  constructor(cols = 5, rows = 5, cornerColors = [ [255,0,0], [0,255,0], [0,0,255], [255,127,0] ]) {
    const game = this;

    this.board = new Board(cols, rows, cornerColors);
    this.moves = 0;

    this.board.renderMap()
    this.updateGame();
  }
  addMove() {
    this.moves++;
    this.updateGame();
  }
  updateGame() {
    document.querySelector('.moves-count').innerHTML = this.moves;

    document.querySelector('input[name="cols"]').value = this.board.cols;
    document.querySelector('input[name="rows"]').value = this.board.rows;

    document.querySelector('input[name="colorTopLeft"]').value = this.board.cornerColors[0].toHEX();
    document.querySelector('input[name="colorTopRight"]').value = this.board.cornerColors[1].toHEX();
    document.querySelector('input[name="colorBotLeft"]').value = this.board.cornerColors[2].toHEX();
    document.querySelector('input[name="colorBotRight"]').value = this.board.cornerColors[3].toHEX();

    if (this.board.checkBoard()) {
      setTimeout( () => {
        document.querySelector('.victory').classList.toggle('open');
        document.querySelector('.message-result .res').innerHTML = this.moves;
      }, 10 ); // timeout to fire after board is redrawn
    }
  }
}

class Board {
  constructor(cols, rows, cornerColors) {
    this.cols = cols;
    this.rows = rows;
    this.map = this.newMap(this.cols, this.rows);
    this.cornerColors = cornerColors;
    this.fillColors(cornerColors);
    this.shuffleFields();
  }

  newMap(cols, rows) {
    const map = [];

    for(let i = 0; i < rows; i++) {
      const row = [];
      for(let j = 0; j < cols; j++) {
        row.push(new Field(i,j))
      }
      map.push(row);
    }

    return map;
  }
  renderMap() {
    // clear .boardNode
    boardNode.innerHTML = '';

    for (let i = 0; i < this.rows; i++) {
      const rowNode = document.createElement('div');
      rowNode.classList.add('row');
      for (let j = 0; j < this.cols; j++) {
        const field = this.map[i][j]
        const fieldNode = document.createElement('div');
        fieldNode.classList.add('field');
        fieldNode.style.backgroundColor = `rgb(${field.colR}, ${field.colG}, ${field.colB})`;
        fieldNode.dataset.row = i;
        fieldNode.dataset.col = j;
        fieldNode.addEventListener('mousedown', () => this.moveField(i,j));
        rowNode.appendChild(fieldNode);
      }
      boardNode.appendChild(rowNode);
    }
  }
  fillColors(cornerColors) {
    const map = this.map;
    const cols = this.cols;
    const rows = this.rows;
    const corners = [
      map[0][0], // topleft
      map[0][cols-1], // topRight
      map[rows-1][0], // botLeft
      map[rows-1][cols-1] // botRight
    ];

    for(let i = 0; i < cornerColors.length; i++) {
      corners[i].colR = cornerColors[i][0];
      corners[i].colG = cornerColors[i][1];
      corners[i].colB = cornerColors[i][2];
      corners[i].corner = true;
      // corners are in correct location by default
      corners[i].correctX = corners[i].posX;
      corners[i].correctY = corners[i].posY;
    }

    // fill first and last row
    [0, rows-1].forEach(row => {
      const firstField = map[row][0];
      const lastField = map[row][cols-1];

      const steps = map[row].length-2;
      const rDiff = firstField.colR - lastField.colR;
      const gDiff = firstField.colG - lastField.colG;
      const bDiff = firstField.colB - lastField.colB;

      for(let j = 1; j < steps+1; j++) { // indexes are +1
        const field = map[row][j];
        let rAdd = (rDiff / (steps+1) )*j;
        let gAdd = (gDiff / (steps+1) )*j;
        let bAdd = (bDiff / (steps+1) )*j;

        // check if color value is rising of declining
        // difference ? declining : rising
        rDiff ? rAdd *= -1 : rAdd;
        gDiff ? gAdd *= -1 : gAdd;
        bDiff ? bAdd *= -1 : bAdd;

        field.colR = Math.round(firstField.colR + rAdd);
        field.colG = Math.round(firstField.colG + gAdd);
        field.colB = Math.round(firstField.colB + bAdd);
      }
    })

    // fill all cols
    for(let i = 0; i < map[0].length; i++) {
      const firstField = map[0][i];
      const lastField = map[rows-1][i];

      const steps = map.length-2;
      const rDiff = firstField.colR - lastField.colR;
      const gDiff = firstField.colG - lastField.colG;
      const bDiff = firstField.colB - lastField.colB;

      for(let j = 1; j < steps+1; j++) { // indexes are +1
        const field = map[j][i];
        let rAdd = (rDiff / (steps+1) )*j;
        let gAdd = (gDiff / (steps+1) )*j;
        let bAdd = (bDiff / (steps+1) )*j;

        // check if color value is rising of declining
        // difference ? declining : rising
        rDiff ? rAdd *= -1 : rAdd;
        gDiff ? gAdd *= -1 : gAdd;
        bDiff ? bAdd *= -1 : bAdd;

        field.colR = Math.round(firstField.colR + rAdd);
        field.colG = Math.round(firstField.colG + gAdd);
        field.colB = Math.round(firstField.colB + bAdd);
      }
    }
  }
  shuffleFields() {
    const map = this.map;
    const cols = this.cols;
    const rows = this.rows;

    const corners = map.reduce( (acc, val) => acc.concat(val), [] ) // crate 1 dim array
      .filter( field => field.corner ); // leave corners

    const shuffledFields = map.reduce( (acc, val) => acc.concat(val), [] ) // reduce to 1 dim array
      .filter( field => !field.corner ) // remove corners
      .map( field => {
        field.shuffleOrder = Math.floor(Math.random()*(cols*rows));
        return field;
      }) // randomize field.order
      .sort( (field1, field2) => field1.shuffleOrder - field2.shuffleOrder ); // sord by field.order

    shuffledFields.splice( 0, 0, corners[0]) // add topLeft corner
    shuffledFields.splice( cols-1, 0, corners[1]) // add topRight corner
    shuffledFields.splice( (cols*(rows-1)), 0, corners[2]) // add botLeft corner
    shuffledFields.splice( (cols*rows-1), 0, corners[3]) // add botRight corner

    map.length = 0;
    for (let i = 0; i < rows; i++) {
      map.push(shuffledFields.splice(0,cols));
    }

    // assign posX and posY
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < cols; j++) {
        map[i][j].posX = i;
        map[i][j].posY = j;
      }
    }
  }
  moveField(row, col) {
    const renderMap = () => this.renderMap();
    const map = this.map;
    const cols = this.cols;
    const rows = this.rows;
    const field = map[row][col];
    const bodyNode = document.querySelector('body');
    const fieldNode = event.target;
    const startX = event.clientX;
    const startY = event.clientY;
    const nodeOffsetX = fieldNode.offsetLeft;
    const nodeOffsetY = fieldNode.offsetTop;

    if (!field.corner) {
      fieldNode.style.zIndex = '99';

      bodyNode.addEventListener('mousemove', shiftField);
      bodyNode.addEventListener('mouseup', dropField);
    }
    else {
      console.log('corner picked');
    }

    function shiftField() {
      const posX = event.clientX;
      const posY = event.clientY;
      fieldNode.style.left = `${posX - startX}px`;
      fieldNode.style.top = `${posY - startY}px`;
    }

    function dropField() {
      bodyNode.removeEventListener('mousemove', shiftField);
      bodyNode.removeEventListener('mouseup', dropField);

      const startX = parseInt(fieldNode.dataset.col);
      const startY = parseInt(fieldNode.dataset.row);
      const endY = startY + Math.round( (fieldNode.offsetTop - nodeOffsetY) / fieldSize);
      const endX = startX + Math.round( (fieldNode.offsetLeft - nodeOffsetX) / fieldSize);

      if (endX == startX && endY == startY) { // if dropped on same field
        console.log('dropped on same field');
      } else if ( endY >= rows || endY < 0 || endX >= cols || endX < 0 ) { // if field is dropped out of board
        console.log('dropped outside');
      } else if (
          ( endX == 0 && endY == 0) || // topLeft
          ( endX == cols-1 && endY == 0) || // topRight
          ( endX == 0 && endY == rows-1) || // botLeft
          ( endX == cols-1 && endY == rows-1) // botRight
      ) { // if dropped on corners
        console.log('dropped on corner');
      } else { // if dropped correctly
        const a = JSON.parse(JSON.stringify(map[startY][startX]));
        const b = JSON.parse(JSON.stringify(map[endY][endX]));
        map[endY][endX] = a;
        map[startY][startX] = b;

        map[endY][endX].posX = endY;
        map[endY][endX].posY = endX;
        map[startY][startX].posX = startY;
        map[startY][startX].posY = startX;

        game.addMove();
      }

      renderMap();
    }
  }
  checkBoard() {
    return this.map.reduce( (acc, val) => acc.concat(val), [] ) // crate 1 dim array
      .every( val => val.posX == val.correctX && val.posY == val.correctY); // check if every [posX,posY] equals [correctX,correctY]
  }
}

class Field {
  constructor(posX = 0, posY = 0) {
    this.posX = posX;
    this.posY = posY;
    this.correctX = posX;
    this.correctY = posY;
    this.colR = 0;
    this.colG = 0;
    this.colB = 0;
    this.corner = false;
    this.shuffleOrder = 0;
  }
}
