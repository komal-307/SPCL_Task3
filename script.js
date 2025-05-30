const puzzleContainer = document.getElementById('puzzle-container');
const moveCounter = document.getElementById('moveCounter');
const startBtn = document.getElementById('startBtn');
const difficultySelect = document.getElementById('difficulty');
const imageUpload = document.getElementById('imageUpload');

let gridSize = 3;
let imageSrc = 'https://picsum.photos/300'; // fallback
let moves = 0;
let tiles = [];

difficultySelect.addEventListener('change', () => {
  gridSize = parseInt(difficultySelect.value);
});

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = () => {
        imageSrc = event.target.result;
        setupPuzzle();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

startBtn.addEventListener('click', () => {
  moves = 0;
  moveCounter.textContent = moves;
  setupPuzzle();
});

function setupPuzzle() {
  puzzleContainer.innerHTML = '';
  puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
  puzzleContainer.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
  puzzleContainer.style.width = `${gridSize * 100}px`;
  puzzleContainer.style.height = `${gridSize * 100}px`;
  tiles = [];

  for (let i = 0; i < gridSize * gridSize; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.draggable = true;
    tile.dataset.index = i;

    const row = Math.floor(i / gridSize);
    const col = i % gridSize;

    tile.style.backgroundImage = `url(${imageSrc})`;
    tile.style.backgroundSize = `${gridSize * 100}px ${gridSize * 100}px`;
    tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;

    tile.addEventListener('dragstart', dragStart);
    tile.addEventListener('dragover', dragOver);
    tile.addEventListener('drop', drop);

    tiles.push(tile);
  }

  shuffleTiles();
  tiles.forEach(tile => puzzleContainer.appendChild(tile));
}

function shuffleTiles() {
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
}

let draggedTile = null;

function dragStart(e) {
  draggedTile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  if (this === draggedTile) return;

  const fromIndex = tiles.indexOf(draggedTile);
  const toIndex = tiles.indexOf(this);

  puzzleContainer.insertBefore(draggedTile, this);
  puzzleContainer.insertBefore(this, puzzleContainer.children[fromIndex]);

  [tiles[fromIndex], tiles[toIndex]] = [tiles[toIndex], tiles[fromIndex]];

  moves++;
  moveCounter.textContent = moves;

  if (isSolved()) {
    setTimeout(() => alert(`🎉 You solved it in ${moves} moves!`), 200);
  }
}

function isSolved() {
  return tiles.every((tile, i) => tile.dataset.index == i);
}
function showMessage(text, type) {
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = text;
  messageBox.className = `message-box ${type} show`;

  setTimeout(() => {
    messageBox.classList.remove("show");
    messageBox.classList.add("hidden");
  }, 3000);
}