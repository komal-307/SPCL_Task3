let gridSize = 3;
    let customImageURL = 'https://picsum.photos/300';
    const container = document.getElementById('puzzle-container');
    const startBtn = document.getElementById('startBtn');
    const difficultySelect = document.getElementById('difficulty');
    const imageUpload = document.getElementById('imageUpload');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    let moves = 0;
    let tiles = [];
    let timer;
    let secondsElapsed = 0;

    imageUpload.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          customImageURL = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    function startTimer() {
      clearInterval(timer);
      secondsElapsed = 0;
      updateTimerDisplay();
      timer = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timer);
    }

    function updateTimerDisplay() {
      const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
      const seconds = String(secondsElapsed % 60).padStart(2, '0');
      timerDisplay.textContent = `Time: ${minutes}:${seconds}`;
    }

    function createTiles() {
      container.innerHTML = '';
      container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
      tiles = [];
      moves = 0;
      movesDisplay.textContent = 'Moves: 0';
      const total = gridSize * gridSize;

      for (let i = 0; i < total; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('draggable', true);
        tile.dataset.correctIndex = i;

        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const tileWidth = containerWidth / gridSize;
        const tileHeight = containerHeight / gridSize;

        tile.style.backgroundImage = `url('${customImageURL}')`;
        tile.style.backgroundPosition = `-${col * tileWidth}px -${row * tileHeight}px`;
        tile.style.backgroundSize = `${containerWidth}px ${containerHeight}px`;

        tile.addEventListener('dragstart', dragStart);
        tile.addEventListener('dragover', dragOver);
        tile.addEventListener('drop', drop);

        tiles.push(tile);
        container.appendChild(tile);
      }
      updateTilePositions();
    }

    function shuffleTiles() {
      tiles.sort(() => Math.random() - 0.5);
      tiles.forEach(tile => container.appendChild(tile));
      updateTilePositions();
    }

    function updateTilePositions() {
      Array.from(container.children).forEach((tile, index) => {
        tile.dataset.currentIndex = index;
      });
    }

    function dragStart(e) {
      e.dataTransfer.setData('text/plain', e.target.dataset.currentIndex);
    }

    function dragOver(e) {
      e.preventDefault();
    }

    function drop(e) {
      e.preventDefault();
      const fromIndex = e.dataTransfer.getData('text');
      const toIndex = e.target.dataset.currentIndex;

      if (fromIndex === toIndex) return;

      const fromTile = container.children[fromIndex];
      const toTile = container.children[toIndex];

      const fromClone = fromTile.cloneNode(true);
      const toClone = toTile.cloneNode(true);

      attachEvents(fromClone);
      attachEvents(toClone);

      container.replaceChild(fromClone, toTile);
      container.replaceChild(toClone, fromTile);

      updateTilePositions();
      moves++;
      movesDisplay.textContent = `Moves: ${moves}`;
      checkSolved();
    }

    function attachEvents(tile) {
      tile.addEventListener('dragstart', dragStart);
      tile.addEventListener('dragover', dragOver);
      tile.addEventListener('drop', drop);
    }

    function checkSolved() {
      const isSolved = Array.from(container.children).every((tile, index) => {
        return parseInt(tile.dataset.correctIndex) === index;
      });

      if (isSolved) {
        stopTimer();
        showModal();
      }
    }

    function formatTime(seconds) {
      const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
      const secs = String(seconds % 60).padStart(2, '0');
      return `${minutes}:${secs}`;
    }

    function showModal() {
      document.getElementById('finalMoves').textContent = moves;
      document.getElementById('finalTime').textContent = formatTime(secondsElapsed);
      document.getElementById('successModal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('successModal').style.display = 'none';
    }

    function playAgain() {
      closeModal();
      startBtn.click();
    }

    startBtn.addEventListener('click', () => {
      gridSize = parseInt(difficultySelect.value);
      createTiles();
      shuffleTiles();
      startTimer();
    });

    createTiles();
