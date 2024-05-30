import React, { useState, useEffect, useCallback } from "react";
import SnakeImage from "./images/snake.jpg";
import "./App.css";
import Snake from "./components/Snake";
import Food from "./components/Food";
import Buttons from "./components/Buttons";

const getRandomFood = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const initialState = {
  food: getRandomFood(),
  direction: "RIGHT",
  speed: 100,
  snakeDots: [
    [0, 0],
    [0, 2],
  ],
  score: 0,
  isGameOver: false,
};

function App() {
  const [isSnakeGameStart, setIsSnakeGameStart] = useState(false);
  const [food, setFood] = useState(getRandomFood());
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [snakeDots, setSnakeDots] = useState([
    [0, 0],
    [0, 2],
  ]);

  useEffect(() => {
    if (isSnakeGameStart && !isGameOver) {
      const moveSnakeInterval = setInterval(moveSnake, speed);
      document.onkeydown = onKeyDown;
      return () => {
        clearInterval(moveSnakeInterval);
        document.onkeydown = null;
      };
    }
  }, [direction, speed, isSnakeGameStart, isGameOver, snakeDots]);

  useEffect(() => {
    if (isSnakeGameStart && !isGameOver) {
      onSnakeOutOfBounds();
      onSnakeCollapsed();
      onSnakeEats();
    }
  }, [snakeDots]);

  const onKeyDown = (e) => {
    e.preventDefault();
    switch (e.keyCode) {
      case 37:
        setDirection("LEFT");
        break;
      case 38:
        setDirection("UP");
        break;
      case 39:
        setDirection("RIGHT");
        break;
      case 40:
        setDirection("DOWN");
        break;
      default:
        break;
    }
  };

  const moveSnake = useCallback(() => {
    if (isSnakeGameStart && !isGameOver) {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];
      switch (direction) {
        case "RIGHT":
          head = [head[0] + 2, head[1]];
          break;
        case "LEFT":
          head = [head[0] - 2, head[1]];
          break;
        case "DOWN":
          head = [head[0], head[1] + 2];
          break;
        case "UP":
          head = [head[0], head[1] - 2];
          break;
        default:
          break;
      }
      dots.push(head);
      dots.shift();
      setSnakeDots(dots);
    }
  }, [direction, snakeDots, isSnakeGameStart, isGameOver]);

  const onSnakeOutOfBounds = () => {
    let head = snakeDots[snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      gameOver();
    }
  };

  const onSnakeCollapsed = () => {
    let snake = [...snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        gameOver();
      }
    });
  };

  const onSnakeEats = () => {
    let head = snakeDots[snakeDots.length - 1];
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(getRandomFood());
      increaseSnake();
      setScore(score + 1);
      increaseSpeed();
    }
  };

  const increaseSnake = () => {
    let newSnake = [...snakeDots];
    newSnake.unshift([]);
    setSnakeDots(newSnake);
  };

  const increaseSpeed = () => {
    if (speed > 10) {
      setSpeed(speed - 10);
    }
  };

  const gameOver = () => {
    setIsGameOver(true);
  };

  const onRight = () => {
    let dots = [...snakeDots];
    let head = dots[dots.length - 1];
    head = [head[0] + 2, head[1]];
    dots.push(head);
    dots.shift();
    setDirection("RIGHT");
    setSnakeDots(dots);
  };

  const onLeft = () => {
    let dots = [...snakeDots];
    let head = dots[dots.length - 1];
    head = [head[0] - 2, head[1]];
    dots.push(head);
    dots.shift();
    setDirection("LEFT");
    setSnakeDots(dots);
  };

  const onDown = () => {
    let dots = [...snakeDots];
    let head = dots[dots.length - 1];
    head = [head[0], head[1] + 2];
    dots.push(head);
    dots.shift();
    setDirection("DOWN");
    setSnakeDots(dots);
  };

  const onUp = () => {
    let dots = [...snakeDots];
    let head = dots[dots.length - 1];
    head = [head[0], head[1] - 2];
    dots.push(head);
    dots.shift();
    setDirection("UP");
    setSnakeDots(dots);
  };

  const startSnakeGame = () => {
    setIsSnakeGameStart(true);
    setIsGameOver(false);
    setScore(0);
    setFood(initialState.food);
    setDirection(initialState.direction);
    setSpeed(initialState.speed);
    setSnakeDots(initialState.snakeDots);
  };

  const restartSnakeGame = () => {
    setIsSnakeGameStart(true);
    setIsGameOver(false);
    setScore(0);
    setFood(initialState.food);
    setDirection(initialState.direction);
    setSpeed(initialState.speed);
    setSnakeDots(initialState.snakeDots);
  };

  return (
    <div className="container">
      {isSnakeGameStart ? (
        <div className="game-info">
          <p className="score">{score}</p>
          <div className="snake-box">
            {isGameOver ? (
              <div className="game-over">Game Over</div>
            ) : (
              <>
                <Snake snakeDots={snakeDots} />
                <Food dot={food} />
              </>
            )}
          </div>
          <Buttons
            onLeft={onLeft}
            onRight={onRight}
            onUp={onUp}
            onDown={onDown}
          />
          <p className="restart" onClick={restartSnakeGame}>
            Restart
          </p>
        </div>
      ) : (
        <div className="game-info">
          <img src={SnakeImage} alt="snake" />
          <h2 onClick={startSnakeGame}>Play Game</h2>
          <p>
            internet is missing. welcome to the 60s. a time of no internet and
            great music.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
