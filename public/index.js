let applex = 320,
  appley = 320;
let scoreContainer = document.getElementById("spanScore");
let levelContainer = document.getElementById("spanLevelCount");
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
let highscore = 0;
context.fillStyle = "#FFF222";
var grid = 16;
var count = 0;
let dx = grid,
  dy = 0;
let score = 0;
let level = 1;
let speed = 150;
let levelParameter = 5;
let interval;
let isPaused = false;

//TODO: check to avoid apple over snake
var snake = {
  x: 160,
  y: 160,
  cells: [
    { x: 160, y: 160 },
    { x: 144, y: 160 }
  ]
};

var apple = {
  x: 320,
  y: 320
};

var wall = {
  x: 80,
  y: 80,
  cells: [
    { x: 0, y: 0 },
    { x: 368, y: 0 },
    { x: 0, y: 368 },
    { x: 368, y: 368 }
  ]
};

function getAllData() {
  getHighScore();
  getLevel();
}

function getLevel() {
  level = localStorage.level ? JSON.parse(localStorage.level) : 0;
  let levelContainer = document.getElementById("spanLevelCount");
  levelContainer.innerHTML = `Level ${level}`;
}
function setLevel() {
  localStorage.level = JSON.stringify(level);
  let levelContainer = document.getElementById("spanLevelCount");
  levelContainer.innerHTML = `HighScore ${highscore}`;
}

function getHighScore() {
  highscore = localStorage.highscore ? JSON.parse(localStorage.highscore) : 0;
  let highScoreContainer = document.getElementById("highScore");
  highScoreContainer.innerHTML = `HighScore ${highscore}`;
}

function setHighScore(highscore) {
  localStorage.highscore = JSON.stringify(highscore);
  let highScoreContainer = document.getElementById("highScore");
  highScoreContainer.innerHTML = `HighScore ${highscore}`;
}

// draw apple
function drawApple() {
  context.fillStyle = "#c43a30";
  // context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
  context.beginPath();
  context.arc(apple.x + grid / 2, apple.y + grid / 2, grid / 2, 0, 2 * Math.PI);
  context.fill();
}
drawApple();

// draw snake
function drawSnake() {
  context.fillStyle = "#4BCFFA";
  for (let i = 0; i < snake.cells.length; i++)
    if (i == 0) {
      context.fillStyle = "#FFF222";
      context.fillRect(snake.cells[i].x, snake.cells[i].y, grid, grid);
    } else {
      context.fillStyle = "#33FF00";
      context.fillRect(snake.cells[i].x, snake.cells[i].y, grid, grid);
    }
}
drawSnake(); // for initial snake

function generateRandomApple() {
  apple.x = Math.floor(Math.random() * 640);
  if (apple.x < 16) {
    generateRandomApple();
  }
  let extra = apple.x % 16;
  apple.x = apple.x - extra;
  for (let i = 0; i < snake.cells.length; i++) {
    if (snake.cells[i].x == apple.x) {
      generateRandomApple();
      break;
    }
  }

  apple.y = apple.x;
  // console.log(apple.x, apple.y);
}

function moveSnake(dx, dy) {
  // ALways adding one at front and removing thr last while moving normallly
  // console.log(snake.x, snake.y);
  snake.x += dx;
  snake.y += dy;

  snakeTouchesWall();
  checkSnakeEatsBody();
  if (snake.x == apple.x && snake.y == apple.y) {
    snake.cells.unshift({ x: snake.x, y: snake.y }); // Insert at 0th position
    generateRandomApple();
    setScore();
    drawSnake();

    if (level == 3) {
    }
  } else {
    snake.cells.pop(); // remove the last element
    snake.cells.unshift({ x: snake.x, y: snake.y }); // Insert at 0th position
    //   console.log(snake.cells.length);
    drawSnake();
  }
}

function snakeTouchesWall() {
  if (snake.x == 640) {
    snake.x = 0;
  } else if (snake.x < 0) {
    snake.x = 640;
  }
  if (snake.y == 640) {
    snake.y = 0;
  } else if (snake.y < 0) {
    snake.y = 640;
  }
}

function checkSnakeEatsBody() {
  for (let i = 0; i < snake.cells.length; i++) {
    if (snake.cells[i].x == snake.x && snake.cells[i].y == snake.y) {
      // alert("game over");
      clear();
      context.fillStyle = "red";
      context.font = "60px arial";
      context.textAlign = "center";
      context.fillText("Game Over!!", canvas.height / 2, canvas.height / 2);
    }
  }
}

function incrementLevel() {
  level++;
  levelContainer.innerHTML = `Level ${level}`;
  checkLevel();
}

drawWalls = () => {
  for (let i = 0; i < wall.cells.length; i++) {
    context.fillRect(wall.cells[i].x, wall.cells[i].y, 112 - 1, 112 - 1);
  }
};

function checkLevel() {
  if (level == 2) {
    clear();
    set(speed / 2);
  }
  if (level == 3) {
    // drawWalls();
  }
  if (level == 4) {
    speed = 50;
  }
}

function setScore() {
  score++;
  if (score > highscore) {
    setHighScore(score);
  }
  if (score % levelParameter == 0) {
    incrementLevel();
  }
  console.log(scoreContainer.innerHTML);
  scoreContainer.innerHTML = `Score ${score}`;
}

function clear() {
  clearInterval(interval);
}

set = speed => {
  interval = setInterval(() => {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the Canvas
    moveSnake(dx, dy);
    drawApple();
    // drawWalls();
    console.log(speed);
  }, speed);
};

pausePlayGame = () => {
  if (isPaused) {
    isPaused = false;

    set(speed);
  } else if (!isPaused) {
    isPaused = true;
    context.fillStyle = "red";
    context.font = "60px arial";
    context.textAlign = "center";
    context.fillText(
      "Press P to Start!!",
      canvas.height / 2,
      canvas.height / 2
    );

    clear();
  }
};

resetGame = () => {
  window.location.reload();
};

document.addEventListener("keydown", function(e) {
  // left arrow key
  if (e.keyCode == 37) {
    if (snake.x - grid != snake.cells[1].x) {
      dx = -grid;
      dy = 0;
    }
  }
  // up arrow key
  else if (e.keyCode == 38) {
    if (snake.y - grid != snake.cells[1].y) {
      dy = -grid;
      dx = 0;
    }
  }
  // right arrow key
  else if (e.keyCode == 39) {
    if (snake.x + grid != snake.cells[1].x) {
      dx = grid;
      dy = 0;
    }
  }
  // down arrow key
  else if (e.keyCode == 40) {
    if (snake.y + grid != snake.cells[1].y) {
      dy = grid;
      dx = 0;
    }
  } else if (e.keyCode == "82") {
    resetGame();
  } else if (e.keyCode == "80") {
    pausePlayGame();
  }
});
