// Define HTML elements
const gameBoard = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const gameLogo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const gameOverText = document.getElementById("game-over-text");
const retryButton = document.getElementById("retry-button");

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }]; // Position where the snake starts
let touchStartX = 0;
let touchStartY = 0;
let food = generateFoodPosition();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake and fruit
function draw() {
  gameBoard.innerHTML = "";
  if (gameStarted) {
    drawSnake();
    drawFood();
  }
  updateScore();
}

function drawSnake() {
  if (gameStarted) {
    snake.forEach((segment) => {
      // For each segment of the snake
      const snakeElement = createGameElement("div", "snake");
      setPosition(snakeElement, segment);
      gameBoard.appendChild(snakeElement);
    });
  }
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    gameBoard.appendChild(foodElement);
  }
}
// Generate Food
function generateFoodPosition() {
  return {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1,
  };
}

// Getting the snake to move
function moveSnake() {
  const snakeHead = { ...snake[0] };
  switch (direction) {
    case "up":
      snakeHead.y -= 1;
      break;
    case "down":
      snakeHead.y += 1;
      break;
    case "left":
      snakeHead.x -= 1;
      break;
    case "right":
      snakeHead.x += 1;
      break;
  }
  snake.unshift(snakeHead);

  if (snakeHead.x === food.x && snakeHead.y === food.y) {
    food = generateFoodPosition();
    increaseSpeed();
    clearInterval(gameInterval); // Clear the previous interval
    gameInterval = setInterval(() => {
      moveSnake(); // Move the snake
      checkCollision(); // Check for collision
      draw(); // Redraw the snake
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Start Game Function
function startGame() {
  gameStarted = true; // Keep track of the game state
  instructionText.style.display = "none"; // Hide the instruction text
  gameLogo.style.display = "none"; // Hide the Logo
  gameInterval = setInterval(() => {
    moveSnake(); // Move the snake
    checkCollision(); // Check for collision
    draw(); // Redraw the snake
  }, gameSpeedDelay);
}

// Key press event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
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

document.addEventListener("keydown", handleKeyPress);

// Function to handle touch start event
function handleTouchStart(event) {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

// Function to handle touch end event and detect swipe direction
function handleTouchEnd(event) {
  const touch = event.changedTouches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  // Determine swipe direction
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 0 && direction !== "left") {
      direction = "right";
    } else if (diffX < 0 && direction !== "right") {
      direction = "left";
    }
  } else {
    // Vertical swipe
    if (diffY > 0 && direction !== "up") {
      direction = "down";
    } else if (diffY < 0 && direction !== "down") {
      direction = "up";
    }
  }
}

// Add event listeners for touch start and end
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchend", handleTouchEnd);

// Increase the speed of the game
function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 10;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// Check for collision
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

// Update resetGame function to show Game Over text and Retry button
function resetGame() {
  updateHighScore();
  stopGame();
  // Show game over elements
  document.getElementById("game-over-container").classList.remove("hidden");

  // Reset game variables
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

// Retry Game function
function retryGame() {
  // Hide game over elements
  document.getElementById("game-over-container").classList.add("hidden");
  // Restart the game
  startGame();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

// Stop Game Function with Element Hiding
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;

  // Hide the instruction text and logo
  instructionText.style.display = "none";
  gameLogo.style.display = "none";

  // Display game-over text and retry button
  gameOverText.style.display = "block";
  retryButton.style.display = "block";

  // Clear the game board so that snake and food are no longer displayed
  gameBoard.innerHTML = ""; // Ensure the game board is empty
}

// Retry button click to restart the game
retryButton.addEventListener("click", () => {
  gameOverText.style.display = "none";
  retryButton.style.display = "none";
  resetGame();
  startGame();
});
