function drawFrame(snake, dir, food, bonus) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, canvas);
  drawGrid(ctx, canvas);
  if (bonus) drawBonus(ctx, bonus);
  drawFood(ctx, food);
  drawSnake(ctx, snake);
}


function drawBackground(ctx, canvas) {
  ctx.fillStyle = '#fff8fb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid(ctx, canvas) {
  ctx.strokeStyle = 'rgba(232,117,154,0.09)';
  ctx.lineWidth   = 0.5;

  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL, 0);
    ctx.lineTo(x * CELL, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL);
    ctx.lineTo(canvas.width, y * CELL);
    ctx.stroke();
  }
}

// bonus
function drawBonus(ctx, bonus) {
  const bx  = bonus.x * CELL + CELL / 2;
  const by  = bonus.y * CELL + CELL / 2;
  const r   = CELL / 2 - 2;
  const age = Date.now() - bonus.spawnTime;
  const remaining = BONUS_LIFETIME - age;

  ctx.globalAlpha = remaining < 1500 ? 0.4 + 0.6 * (remaining / 1500) : 1;

  ctx.fillStyle = '#f5a623';
  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.floor(CELL * 0.55)}px Nunito`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', bx, by + 1);

  ctx.globalAlpha = 1;
}

// regular
function drawFood(ctx, food) {
  const fx = food.x * CELL + CELL / 2;
  const fy = food.y * CELL + CELL / 2;
  const fr = CELL / 2 - 2;

  ctx.fillStyle = '#e84a6f';
  ctx.beginPath();
  ctx.arc(fx, fy, fr, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.beginPath();
  ctx.arc(fx - fr * 0.28, fy - fr * 0.3, fr * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

// gradient snake
function drawSnake(ctx, snake) {
  const len = snake.length;
  snake.forEach((seg, i) => {
    const t = i / (len - 1 || 1);
    const r = Math.round(COLOR_HEAD.r + (COLOR_TAIL.r - COLOR_HEAD.r) * t);
    const g = Math.round(COLOR_HEAD.g + (COLOR_TAIL.g - COLOR_HEAD.g) * t);
    const b = Math.round(COLOR_HEAD.b + (COLOR_TAIL.b - COLOR_HEAD.b) * t);

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    roundRect(ctx, seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, i === 0 ? 7 : 4);
    ctx.fill();
  });
}

// path
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
