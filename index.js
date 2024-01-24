const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");

const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;
let timerId;
let xDirection = -2;
let yDirection = 2;
let score = 0;

const userStartPos = [230, 10];
let userCurrentPos = userStartPos;

const ballStartPos = [270, 40];
const ballCurrentPos = ballStartPos;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}

addBlocks();

// Добавление юзера
const user = document.createElement("div");
user.classList.add("user");
drawUser();
grid.appendChild(user);

// Нарисовать юзера
function drawUser() {
  user.style.left = userCurrentPos[0] + "px";
  user.style.right = userCurrentPos[1] + "px";
}

// Нарисовать шарик
function drawBall() {
  ball.style.left = ballCurrentPos[0] + "px";
  ball.style.bottom = ballCurrentPos[1] + "px";
}

// Движение юзера
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (userCurrentPos[0] > 0) {
        userCurrentPos[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (userCurrentPos[0] < boardWidth - blockWidth) {
        userCurrentPos[0] += 10;
        drawUser();
      }
      break;
    // default:
    //   break;
  }
}

document.addEventListener("keydown", moveUser);

// Добавить шарик
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

// Двигать шарик
function moveBall() {
  ballCurrentPos[0] += xDirection;
  ballCurrentPos[1] += yDirection;
  drawBall();
  checkForCollisions();
}

timerId = setInterval(moveBall, 30);

// Проверка на столкновение
function checkForCollisions() {
  // Столкновение с блоками
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPos[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPos[0] < blocks[i].bottomRight[0] &&
      ballCurrentPos[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPos[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();

      score++;
      scoreDisplay.innerHTML = score;
    }
  }

  // Столкновениеи со стенами
  if (
    ballCurrentPos[0] >= boardWidth - ballDiameter ||
    ballCurrentPos[1] >= boardHeight - ballDiameter ||
    ballCurrentPos[0] <= 0
  ) {
    changeDirection();
  }

  // Гейм овер
  if (ballCurrentPos[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = "You lose";
    document.removeEventListener("keydown", moveUser);
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }

  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }

  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }

  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
