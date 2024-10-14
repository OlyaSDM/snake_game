const canvas = document.getElementById ("snake");
const ctx = canvas.getContext("2d");
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = [];
let score = 0;
let period = 1;
let foodCount = 5;
let gameInterval;
let isPaused = false;
let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || []
let startTime;
const restartBtn = document.getElementById("restartBtn");
restartBtn.onclick = function() {
    location.reload();
}
const eatSound = new Audio("assets/1.mp3");

const rulesModal = document.getElementById("rulesModal");
const rulesBtn = document.getElementById("rulesBtn");
const closeBtn = document.getElementsByClassName("close")[0];

rulesBtn.onclick = function() {
    rulesModal.style.display = "block";
}

closeBtn.onclick = function() {
    rulesModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == rulesModal) {
        rulesModal.style.display = "none";
    }
}

function draw() {
  if (isPaused) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.src = "assets/snake.jpg";
  img.onload = function () {
    for (let segment of snake) {
      ctx.drawImage(img, segment.x * 26, segment.y * 26, 26, 26);
    }
  };
  
  ctx.fillStyle = "red";
  for (let f of food) {
    ctx.fillRect(f.x * 26, f.y * 26, 26, 26);
  }
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  if (
    head.x < 0 ||
    head.x >= canvas.width / 26 ||
    head.y < 0 ||
    head.y >= canvas.height / 26 ||
    snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
  }
    for (let i = 0; i < food.length; i++) {
    if (head.x === food[i].x && head.y === food[i].y) {
      score++;
      snake.unshift(head);
      food.splice(i, 1);
      eatSound.play();
      if (food.length === 0) {
        nextPeriod();
      }
      return;
    }
  }
    snake.unshift(head);
  snake.pop();
}
function endGame() {
    const message = document.getElementById('message');
    message.textContent = ` Score: ${score}`;
    restartBtn.style.display = "block"; 
    
    const gameResult = { score, period, time: Date.now() - startTime };
    gameHistory.push(gameResult);

    if (gameHistory.length > 10) {
        gameHistory.shift();
    }

    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    displayScores();
    clearInterval(gameInterval);
}


function displayScores() {
  const scoresList = document.getElementById("scoresList");
  scoresList.innerHTML = ""; 
  
  gameHistory.forEach((game, index) => {
    const li = document.createElement("li");
    li.textContent = `Game ${index + 1}: Period ${game.period}, Score ${game.score} `;
    scoresList.appendChild(li);
  });
}

function startGame() {
    startTime = Date.now();
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    period = 1; 
    foodCount = 5;
    food = []; 
    restartBtn.style.display = "none"; 
    
    generateFood();
    gameInterval = setInterval(draw, 400);
}
document.addEventListener("DOMContentLoaded", () => {
  displayScores();
});
function generateFood() {
  food = [];
  for (let i = 0; i < foodCount; i++) {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (canvas.width / 26)),
        y: Math.floor(Math.random() * (canvas.height / 26)),
      };
    } while (
      snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y) ||
      food.some((f) => f.x === newFood.x && f.y === newFood.y)
    );
    food.push(newFood);
  }
}
function nextPeriod() {
    period++;
  foodCount += 5;
  if (period <= 3) {
    generateFood();
    alert(`Go to level ${period}. Collect ${foodCount} of food!`);
  } else {
    alert(`Victory! Final score: ${score}`);
    endGame();
  }
}

function changeDirection(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}
function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pauseBtn").innerText = isPaused ? "Play" : "Pause";
}
document.addEventListener("keydown", changeDirection);
function startGame() {
  generateFood();
  gameInterval = setInterval(draw, 400);
}
document.getElementById("pauseBtn").addEventListener("click", togglePause);
startGame();

document.getElementById("upBtn").addEventListener("click", function() {
    if (direction.y === 0) {
      direction = { x: 0, y: -1 };
    }
  });
  
  document.getElementById("downBtn").addEventListener("click", function() {
    if (direction.y === 0) {
      direction = { x: 0, y: 1 };
    }
  });
  
  document.getElementById("leftBtn").addEventListener("click", function() {
    if (direction.x === 0) {
      direction = { x: -1, y: 0 };
    }
  });
  
  document.getElementById("rightBtn").addEventListener("click", function() {
    if (direction.x === 0) {
      direction = { x: 1, y: 0 };
    }
  });
  

