const leaderboard = [];

const scoreEl = document.getElementById('score-display');
const bestEl = document.getElementById('best-display');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlaySub = document.getElementById('overlay-sub');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const modal = document.getElementById('modal');
const nameInput = document.getElementById('name-input');
const submitBtn = document.getElementById('submit-btn');
const skipBtn = document.getElementById('skip-btn');
const lbList = document.getElementById('lb-list');
const modalScoreTxt = document.getElementById('modal-score-text');

function updateHUD(score, best) {
  scoreEl.textContent = score;
  bestEl.textContent  = best;
}

function showOverlay(title, sub, showStart = false) {
  overlayTitle.textContent = title;
  overlaySub.textContent   = sub;
  startBtn.style.display   = showStart ? '' : 'none';
  overlay.classList.add('visible');
}

function hideOverlay() {
  overlay.classList.remove('visible');
}

function onGameStart() {
  hideOverlay();
  pauseBtn.style.display   = '';
  restartBtn.style.display = '';
  startBtn.style.display   = 'none';
  pauseBtn.textContent     = 'Пауза';
  updateHUD(0, state.bestScore);
}

function onGameResume() {
  hideOverlay();
  pauseBtn.textContent = 'Пауза';
}

function onGamePause() {
  showOverlay('Приостановлено', 'Нажмите пробел или Повторить');
  pauseBtn.textContent = 'Повторить';
}

function onGameEnd(score) {
  showOverlay('Конец игры', `Счет: ${score}`, true);
  startBtn.textContent     = 'Играть еще раз';
  pauseBtn.style.display   = 'none';
  restartBtn.style.display = 'none';

  setTimeout(() => {
    modalScoreTxt.textContent = `Твой счет: ${score}`;
    nameInput.value           = '';
    modal.classList.add('visible');
    nameInput.focus();
  }, 600);
}

function addScore(name, score) {
  leaderboard.push({ name: (name.trim() || 'Анон'), score });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 10) leaderboard.length = 10;
  renderLeaderboard();
}

function renderLeaderboard() {
  if (!leaderboard.length) {
    lbList.innerHTML = '<li class="lb-empty">Нет результатов</li>';
    return;
  }
  lbList.innerHTML = leaderboard.map((e, i) => `
    <li class="lb-item">
      <span class="lb-rank ${i < 3 ? 'top' : ''}">${i + 1}</span>
      <span class="lb-name">${escHtml(e.name)}</span>
      <span class="lb-score">${e.score}</span>
    </li>
  `).join('');
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

startBtn.addEventListener('click',   () => startGame());
restartBtn.addEventListener('click', () => startGame());
pauseBtn.addEventListener('click',   () => togglePause());

submitBtn.addEventListener('click', () => {
  addScore(nameInput.value, state.score);
  modal.classList.remove('visible');
});
skipBtn.addEventListener('click', () => {
  modal.classList.remove('visible');
});
nameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addScore(nameInput.value, state.score);
    modal.classList.remove('visible');
  }
});

document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (state.running) return;
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setSpeed(parseInt(btn.dataset.speed));
  });
});

document.addEventListener('keydown', e => {
  if (e.key === ' ') {
    e.preventDefault();
    if (state.running || state.paused) togglePause();
    return;
  }
  const d = KEY_MAP[e.key];
  if (!d) return;
  if (e.key.startsWith('Arrow')) e.preventDefault();
  if (d.x === -state.dir.x && d.y === -state.dir.y) return;
  state.nextDir = d;
  /* Auto-start on first key press */
  if (!state.running && !state.paused) startGame();
});

const mobileMap = {
  'm-up':    DIR.UP,
  'm-down':  DIR.DOWN,
  'm-left':  DIR.LEFT,
  'm-right': DIR.RIGHT,
};

Object.entries(mobileMap).forEach(([id, d]) => {
  document.getElementById(id).addEventListener('touchstart', e => {
    e.preventDefault();
    if (d.x === -state.dir.x && d.y === -state.dir.y) return;
    state.nextDir = d;
    if (!state.running && !state.paused) startGame();
  }, { passive: false });
});
