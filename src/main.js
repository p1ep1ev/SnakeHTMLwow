(function initCanvas() {
  const canvas    = document.getElementById('canvas');
  canvas.width  = CELL * COLS;
  canvas.height = CELL * ROWS;
})();

initGame();
