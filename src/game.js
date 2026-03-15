const state = {
  snake:    [],
  dir:      { ...DIR.RIGHT },
  nextDir:  { ...DIR.RIGHT },
  food:     { x: 0, y: 0 },
  bonus:    null,
  score:    0,
  bestScore: 0,
  speed:    100,
  running:  false,
  paused:   false,
  loop:     null,
};

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCell() {
  while (true) {
    const x = rnd(0, COLS - 1);
    const y = rnd(0, ROWS - 1);
    if (!state.snake.some(s => s.x === x && s.y === y)) return { x, y };
  }
}

function spawnFood() {
  state.food = randomCell();
}

function spawnBonus() {
  if (state.bonus) return;
  state.bonus = { ...randomCell(), spawnTime: Date.now() };
}

function initGame() {
  const mid    = Math.floor(COLS / 2);
  state.snake  = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
  state.dir    = { ...DIR.RIGHT };
  state.nextDir= { ...DIR.RIGHT };
  state.score  = 0;
  state.bonus  = null;
  spawnFood();
  drawFrame(state.snake, state.dir, state.food, state.bonus);
}

// game tick
function tick() {
  state.dir = { ...state.nextDir };

  const head = {
    x: state.snake[0].x + state.dir.x,
    y: state.snake[0].y + state.dir.y,
  };

  // wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    endGame(); return;
  }
  // snake collision
  if (state.snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame(); return;
  }

  state.snake.unshift(head);

  // regular
  if (head.x === state.food.x && head.y === state.food.y) {
    state.score++;
    updateHUD(state.score, state.bestScore);
    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      updateHUD(state.score, state.bestScore);
    }
    spawnFood();
    if (state.score % BONUS_EVERY === 0) spawnBonus();
  } else {
    state.snake.pop();
  }

  // bonus
  if (state.bonus && head.x === state.bonus.x && head.y === state.bonus.y) {
    state.score += 3;
    updateHUD(state.score, state.bestScore);
    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      updateHUD(state.score, state.bestScore);
    }
    state.bonus = null;
  }

// expire bonus
  if (state.bonus && Date.now() - state.bonus.spawnTime > BONUS_LIFETIME) {
    state.bonus = null;
  }

  drawFrame(state.snake, state.dir, state.food, state.bonus);
}


function startGame() {
  initGame();
  state.running = true;
  state.paused  = false;
  clearInterval(state.loop);
  state.loop = setInterval(tick, state.speed);
  onGameStart();
}

function togglePause() {
  if (!state.running) return;
  if (state.paused) {
    state.paused = false;
    state.loop   = setInterval(tick, state.speed);
    onGameResume();
  } else {
    state.paused = true;
    clearInterval(state.loop);
    onGamePause();
  }
}

function endGame() {
  clearInterval(state.loop);
  state.running = false;
  onGameEnd(state.score);
}


function setSpeed(newSpeed) {
  if (!state.running) state.speed = newSpeed;
}