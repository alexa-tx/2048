const gridSize = 4;
let grid = [];
let score = 0;

const container = document.getElementById('grid-container');
const scoreDisplay = document.getElementById('score');


function init() {
  grid = Array(gridSize * gridSize).fill(0);
  addRandomTile();
  addRandomTile();
  drawGrid();
  document.addEventListener('keydown', handleKeyPress);
}

function drawGrid() {
  container.innerHTML = '';
  grid.forEach(value => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    if (value) {
      tile.textContent = value;
      tile.classList.add(`tile-${value}`);
    }
    container.appendChild(tile);
  });
  scoreDisplay.textContent = `Счёт: ${score}`;
}

function addRandomTile() {
  const emptyIndices = grid.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
  if (emptyIndices.length === 0) return;
  const randIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  grid[randIndex] = Math.random() < 0.9 ? 2 : 4;
}

function handleKeyPress(e) {
  let moved = false;

  switch (e.key) {
    case 'ArrowUp':
      moved = move('up'); break;
    case 'ArrowDown':
      moved = move('down'); break;
    case 'ArrowLeft':
      moved = move('left'); break;
    case 'ArrowRight':
      moved = move('right'); break;
  }

  if (moved) {
    addRandomTile();
    drawGrid();
    if (checkGameOver()) {
      alert('Игра окончена!');
      document.removeEventListener('keydown', handleKeyPress);
    }
  }
}

function move(direction) {
  let moved = false;
  const previous = [...grid];

  const get = (x, y) => grid[y * gridSize + x];
  const set = (x, y, val) => grid[y * gridSize + x] = val;

  for (let y = 0; y < gridSize; y++) {
    let row = [];
    for (let x = 0; x < gridSize; x++) {
      let value;
      if (direction === 'left' || direction === 'right') {
        value = get(x, y);
      } else {
        value = get(y, x);
      }
      if (value !== 0) row.push(value);
    }

    if (direction === 'right' || direction === 'down') row.reverse();

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        row[i + 1] = 0;
      }
    }

    row = row.filter(n => n !== 0);
    while (row.length < gridSize) row.push(0);

    if (direction === 'right' || direction === 'down') row.reverse();

    for (let x = 0; x < gridSize; x++) {
      if (direction === 'left') set(x, y, row[x]);
      else if (direction === 'right') set(x, y, row[x]);
      else if (direction === 'up') set(y, x, row[x]);
      else if (direction === 'down') set(y, x, row[x]);
    }
  }

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] !== previous[i]) {
      moved = true;
      break;
    }
  }

  return moved;
}

function checkGameOver() {
  if (grid.includes(0)) return false;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let current = grid[y * gridSize + x];
      let right = x < gridSize - 1 ? grid[y * gridSize + x + 1] : null;
      let down = y < gridSize - 1 ? grid[(y + 1) * gridSize + x] : null;

      if (current === right || current === down) return false;
    }
  }

  return true;
}
document.getElementById('restart').addEventListener('click', () => {
  score = 0;
  init();
  saveGame(); // обновим сохранение
});

document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// При загрузке: восстановить тему
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

init();
