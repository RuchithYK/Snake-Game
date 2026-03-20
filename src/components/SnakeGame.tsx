import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const directionRef = React.useRef(direction);

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
    }

    if (!hasStarted && !gameOver) {
      setHasStarted(true);
    }

    if (e.key === ' ' || e.key === 'Escape') {
      setIsPaused(p => !p);
      return;
    }

    if (gameOver) return;

    const currentDir = directionRef.current;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== 'DOWN') directionRef.current = 'UP';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== 'UP') directionRef.current = 'DOWN';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== 'RIGHT') directionRef.current = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== 'LEFT') directionRef.current = 'RIGHT';
        break;
    }
    setDirection(directionRef.current);
  }, [gameOver, hasStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !hasStarted) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, hasStarted]);

  useInterval(moveSnake, gameOver || isPaused || !hasStarted ? null : GAME_SPEED);

  const handleGameOver = () => {
    setGameOver(true);
    setHasStarted(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setHasStarted(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  return (
    <div className="flex flex-col items-center p-4 w-full">
      {/* Score Board */}
      <div className="flex justify-between w-full mb-4 border-b-4 border-[#ff00ff] pb-4">
        <div>
          <div className="text-[#ff00ff] text-lg mb-1">&gt; DATA_YIELD</div>
          <div 
            className="text-[#00ffff] font-pixel text-2xl glitch-text"
            data-text={score.toString().padStart(4, '0')}
          >
            {score.toString().padStart(4, '0')}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#ff00ff] text-lg mb-1">&gt; PEAK_EFFICIENCY</div>
          <div 
            className="text-[#00ffff] font-pixel text-2xl glitch-text"
            data-text={highScore.toString().padStart(4, '0')}
          >
            {highScore.toString().padStart(4, '0')}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative border-4 border-[#00ffff] bg-black p-1 w-full max-w-[400px] aspect-square">
        <div 
          className="grid w-full h-full"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((segment, i) => i !== 0 && segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={index} 
                className={`
                  w-full h-full border-[0.5px] border-[#00ffff]/10
                  ${isSnakeHead ? 'bg-[#ff00ff]' : ''}
                  ${isSnakeBody ? 'bg-[#ff00ff]/70' : ''}
                  ${isFood ? 'bg-[#00ffff] animate-pulse' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(!hasStarted && !gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
            <div className="text-center">
              <p className="text-[#00ffff] font-pixel text-sm md:text-base animate-pulse">&gt; AWAITING_INPUT</p>
              <p className="text-[#ff00ff] text-lg mt-4">[PRESS ARROW KEYS]</p>
            </div>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
            <p className="text-[#ff00ff] font-pixel text-2xl glitch-text" data-text="HALTED">HALTED</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-20 border-4 border-[#ff00ff]">
            <h2 className="text-[#ff00ff] font-pixel text-xl md:text-2xl mb-6 glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
            <p className="text-[#00ffff] text-xl mb-8">&gt; YIELD: {score}</p>
            <button 
              onClick={resetGame}
              className="border-2 border-[#00ffff] bg-black text-[#00ffff] hover:bg-[#00ffff] hover:text-black px-6 py-3 font-pixel text-sm transition-none"
            >
              REBOOT_SEQUENCE
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[#ff00ff] text-lg text-center leading-relaxed">
        &gt; CTRL: [W,A,S,D] OR [ARROWS]<br/>
        &gt; INTERRUPT: [SPACE]
      </div>
    </div>
  );
}
