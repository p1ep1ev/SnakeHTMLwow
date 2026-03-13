const CELL  = 21;   // px per grid cell
const COLS  = 20;   // grid columns
const ROWS  = 20;   // grid rows

const BONUS_LIFETIME  = 5000;  // ms bonus food stays on board
const BONUS_EVERY     = 5;     // spawn bonus every N points

// gradient snake
const COLOR_HEAD = { r: 232, g: 117, b: 154 };
const COLOR_TAIL = { r: 252, g: 209, b: 227 };

// dir presets
const DIR = {
  UP:    { x:  0, y: -1 },
  DOWN:  { x:  0, y:  1 },
  LEFT:  { x: -1, y:  0 },
  RIGHT: { x:  1, y:  0 },
};

// key => dir mapping
const KEY_MAP = {
  ArrowUp:    DIR.UP,    w: DIR.UP,    W: DIR.UP,
  ArrowDown:  DIR.DOWN,  s: DIR.DOWN,  S: DIR.DOWN,
  ArrowLeft:  DIR.LEFT,  a: DIR.LEFT,  A: DIR.LEFT,
  ArrowRight: DIR.RIGHT, d: DIR.RIGHT, D: DIR.RIGHT,
};
