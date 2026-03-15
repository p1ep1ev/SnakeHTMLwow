import { useState, useEffect, useRef } from 'react';

const Game = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(localStorage.getItem('bestScore') || 0);
  const [gameState, setGameState] = useState('ready');
  const [difficulty, setDifficulty] = useState('Средняя');

  const speeds = { 'Легкая': 180, 'Средняя': 110, 'Сложная': 65 };
  const gridSize = 30; 
  const canvasSize = 600; 

  const generateFood = (currentSnake) => {
    let newFood;
    while (true) {
      newFood = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
      const keys = { 
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 }
      };
      if (keys[e.key]) {
        const newDir = keys[e.key];
        if (newDir.x !== -direction.x && newDir.y !== -direction.y) setDirection(newDir);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || 
          newSnake.some(s => s.x === head.x && s.y === head.y)) {
        setGameState('gameover');
        if (score > bestScore) { setBestScore(score); localStorage.setItem('bestScore', score); }
        return;
      }

      newSnake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);
    };
    const interval = setInterval(moveSnake, speeds[difficulty]);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameState, difficulty]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.15)'; 
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvasSize; i += gridSize) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvasSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvasSize, i); ctx.stroke();
    }

    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/3, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach((part, i) => {
      ctx.fillStyle = i === 0 ? '#ec4899' : '#f9a8d4';
      ctx.beginPath();
      ctx.roundRect(part.x * gridSize + 2, part.y * gridSize + 2, gridSize - 4, gridSize - 4, 4);
      ctx.fill();
    });
  }, [snake, food]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setScore(0);
    setDirection({ x: 0, y: -1 });
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-[#fff1f2] flex flex-col items-center py-12 px-6 select-none font-sans text-[#881337]">
      <div className="flex gap-8 mb-12">
        <div className="bg-white/70 backdrop-blur-md  p-6 w-44 rounded-xl shadow-sm border border-rose-100 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-2">Счет</p>
          <p className="text-4xl font-bold">{score}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-6 w-44 rounded-xl shadow-sm border border-rose-100 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-2">Рекорд</p>
          <p className="text-4xl font-bold text-rose-500">{bestScore}</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-12 items-start max-w-[1200px] w-full justify-center">
        <div className="relative bg-white/50 p-6 rounded-2xl shadow-2xl shadow-rose-200/40 border border-white">
          <canvas 
            ref={canvasRef} 
            width={canvasSize} 
            height={canvasSize} 
            className="bg-white/40 rounded-lg"
          />
          
          {gameState !== 'playing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-sm rounded-2xl">
              <h2 className="text-7xl font-black mb-6 drop-shadow-sm">
                {gameState === 'готовность' ? 'Готовы?' : 'Игра окончена'}
              </h2>
              <p className="text-lg opacity-60 mb-12 font-medium tracking-wide">Используй WASD или стрелочки</p>
              <button 
                onClick={startGame}
                className="px-20 py-6 bg-[#f472b6] hover:bg-[#ec4899] text-white font-black rounded-xl shadow-xl shadow-rose-200 transition-all active:scale-95 text-2xl uppercase tracking-widest"
              >
                {gameState === 'готовность' ? 'Старт' : 'Еще раз'}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-10 w-full xl:w-96">
          <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-rose-100">
            <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-6">Сложность</h3>
            <div className="flex flex-col gap-3">
              {['Легкая', 'Средняя', 'Сложная'].map(lvl => (
                <button 
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`w-full py-4 rounded-xl text-sm font-black transition-all border-2 ${difficulty === lvl ? 'bg-[#f472b6] border-[#f472b6] text-white shadow-lg' : 'border-rose-50 text-rose-300 hover:bg-rose-50'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-rose-100 min-h-[200px]">
            <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-8 flex items-center justify-center gap-3">
              <span className="text-xl">🏆</span> Рекорды
            </h3>
            <div className="text-center py-12 opacity-30 italic text-sm font-medium">
              Пока результатов нет
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Game;