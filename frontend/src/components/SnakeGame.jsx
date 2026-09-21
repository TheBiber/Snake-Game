import React, { useEffect } from "react";
import { updateHighScore } from "../services/apiService"; // ייבוא שירות ה-API שלך
import appleImg from "../assets/apple.png";
import snakeBodyImg from "../assets/snake-body.png";
import snakeHeadUpImg from "../assets/snake-head-up.png";
import snakeHeadDownImg from "../assets/snake-head-down.png";
import snakeHeadLeftImg from "../assets/snake-head-left.png";
import snakeHeadRightImg from "../assets/snake-head-right.png";
import snakeLogoImg from "../assets/snake-game-ai-gen.png";

export const SnakeGame = () => {
  useEffect(() => {
    // --- משתני המשחק והאלמנטים המקוריים שלך בדיוק ---
    const board = document.getElementById("game-board");
    const instructionText = document.getElementById("instruction-text");
    const logo = document.getElementById("logo");
    const score = document.getElementById("score");
    const highScoreText = document.getElementById("highScore");

    const gridSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = generateFood();
    let highScore = 0;
    let direction = "right";
    let gameInterval;
    let gameSpeedDelay = 200;
    let gameStarted = false;

    // מחקנו את ה-draw() הראשוני שהוספתי מקודם, כדי שהנחש לא יופיע עד שלוחצים רווח!

    // פונקציית הציור המקורית שלך
    function draw() {
      if (!board) return;
      board.innerHTML = "";
      drawSnake();
      drawFood();
      updateScore();
    }

    // ציור הנחש המקורי שלך
    function drawSnake() {
      snake.forEach((segment, index) => {
        if (index !== 0) {
          const snakeElement = createGameElement("div");
          const snakeBody = createGameElement("img", "snake-hb");
          snakeBody.src = snakeBodyImg;
          snakeElement.appendChild(snakeBody);
          setPosition(snakeElement, segment);
          board.appendChild(snakeElement);
        } else {
          const snakeElement = createGameElement("div");
          const snakeHead = createGameElement("img", "snake-hb");

          switch (direction) {
            case "up":
              snakeHead.src = snakeHeadUpImg;
              break;
            case "down":
              snakeHead.src = snakeHeadDownImg;
              break;
            case "left":
              snakeHead.src = snakeHeadLeftImg;
              break;
            case "right":
              snakeHead.src = snakeHeadRightImg;
              break;
          }

          snakeElement.appendChild(snakeHead);
          setPosition(snakeElement, segment);
          board.appendChild(snakeElement);
        }
      });
    }

    function createGameElement(tag, className) {
      const element = document.createElement(tag);
      if (className) element.className = className;
      return element;
    }

    function setPosition(element, position) {
      element.style.gridColumn = position.x;
      element.style.gridRow = position.y;
    }

    // ציור האוכל המקורי שלך (חזר לתנאי המקורי - מצטייר רק כשהמשחק רץ!)
    function drawFood() {
      if (gameStarted) {
        const foodElement = createGameElement("div");
        const apple = createGameElement("img", "snake-hb");
        apple.src = appleImg;
        foodElement.appendChild(apple);
        setPosition(foodElement, food);
        board.appendChild(foodElement);
      }
    }

    function generateFood() {
      const x = Math.floor(Math.random() * gridSize) + 1;
      const y = Math.floor(Math.random() * gridSize) + 1;
      return { x, y };
    }

    function move() {
      const head = { ...snake[0] };
      switch (direction) {
        case "up":
          head.y--;
          break;
        case "down":
          head.y++;
          break;
        case "left":
          head.x--;
          break;
        case "right":
          head.x++;
          break;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
          move();
          checkCollision();
          draw();
        }, gameSpeedDelay);
      } else {
        snake.pop();
      }
    }

    function startGame() {
      gameStarted = true;
      const boardMenu = document.getElementById("board-menu");
      if (boardMenu) boardMenu.style.display = "none"; // מעלים את כל התפריט (התמונה והטקסט) כשהמשחק מתחיל

      gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
      }, gameSpeedDelay);
    }

    function handleKeyPress(event) {
      if (!gameStarted && (event.code === "Space" || event.key === " ")) {
        startGame();
      } else {
        switch (event.key) {
          case "ArrowUp":
            direction = "up";
            break;
          case "ArrowDown":
            direction = "down";
            break;
          case "ArrowLeft":
            direction = "left";
            break;
          case "ArrowRight":
            direction = "right";
            break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    function increaseSpeed() {
      if (gameSpeedDelay > 150) gameSpeedDelay -= 5;
      else if (gameSpeedDelay > 100) gameSpeedDelay -= 3;
      else if (gameSpeedDelay > 50) gameSpeedDelay -= 2;
      else if (gameSpeedDelay > 25) gameSpeedDelay -= 1;
    }

    function checkCollision() {
      const head = snake[0];

      if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
      }

      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          resetGame();
        }
      }
    }

    async function resetGame() {
      const currentScore = snake.length - 1;

      const savedUserId = localStorage.getItem("userId") || 1;
      await updateHighScore(Number(savedUserId), currentScore);

      if (currentScore > highScore) {
        highScore = currentScore;
        if (highScoreText)
          highScoreText.textContent = highScore.toString().padStart(3, "0");
      }
      if (highScoreText) highScoreText.style.display = "block";

      stopGame();
      // מנקה את הלוח לחלוטין בריסט כדי להחזיר את מצב הלוגו בלבד
      if (board) board.innerHTML = "";
      snake = [{ x: 10, y: 10 }];
      food = generateFood();
      direction = "right";
      gameSpeedDelay = 200;
      updateScore();
    }

    function updateScore() {
      const currentScore = snake.length - 1;
      if (score) score.textContent = currentScore.toString().padStart(3, "0");
    }

    function stopGame() {
      clearInterval(gameInterval);
      gameStarted = false;
      const boardMenu = document.getElementById("board-menu");
      if (boardMenu) boardMenu.style.display = "flex"; // מחזיר את כל התפריט כשהמשחק נעצר
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(gameInterval);
    };
  }, []);

  return (
    <div className="snake-game-body">
      <div className="game-area">
        <div className="scores">
          <h1 id="score">000</h1>
          <h1 id="highScore">000</h1>
        </div>
        <div className="game-border-1">
          <div className="game-border-2">
            <div className="game-border-3" style={{ position: "relative" }}>
              {/* לוח המשחק */}
              <div id="game-board"></div>

              {/* קופסת התפריט הפנימית - מאחדת את הלוגו והטקסט מתחתיו */}
              <div
                id="board-menu"
                style={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px",
                  zIndex: 10,
                }}
              >
                <img id="logo" src={snakeLogoImg} alt="snake-logo" />
                <h1 id="instruction-text" className="blink">
                  Press spacebar to start the game
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
