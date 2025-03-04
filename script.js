const leftPaddle = document.getElementById('left-paddle');
const rightPaddle = document.getElementById('right-paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const gameContainer = document.querySelector('.game-container');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');

let leftPaddleY = 150;
let rightPaddleY = 150;
let ballX = 292.5, ballY = 192.5, ballSpeedX = 2, ballSpeedY = 2;
const paddleSpeed = 4;
let gamePaused = false;
let gameStarted = false;

let leftScore = 0;
let rightScore = 0;

const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false
};

// Move paddles smoothly
function movePaddles() {
    if (keysPressed['ArrowUp']) leftPaddleY -= paddleSpeed;
    if (keysPressed['ArrowDown']) leftPaddleY += paddleSpeed;
    if (keysPressed['w']) rightPaddleY -= paddleSpeed;
    if (keysPressed['s']) rightPaddleY += paddleSpeed;

    if (leftPaddleY < 0) leftPaddleY = 0;
    if (leftPaddleY > gameContainer.clientHeight - leftPaddle.offsetHeight) leftPaddleY = gameContainer.clientHeight - leftPaddle.offsetHeight;
    if (rightPaddleY < 0) rightPaddleY = 0;
    if (rightPaddleY > gameContainer.clientHeight - rightPaddle.offsetHeight) rightPaddleY = gameContainer.clientHeight - rightPaddle.offsetHeight;

    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';
}

// Move the ball
function moveBall() {
    if (gamePaused) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball bouncing off top and bottom walls (speed up after each bounce)
    if (ballY <= 0 || ballY >= gameContainer.clientHeight - ball.offsetHeight) {
        ballSpeedY = -ballSpeedY;
        increaseBallSpeed();  // Speed up the ball after hitting the wall
    }

    // Ball bouncing off left paddle
    if (ballX <= leftPaddle.offsetWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + leftPaddle.offsetHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball bouncing off right paddle
    if (ballX >= gameContainer.clientWidth - ball.offsetWidth - rightPaddle.offsetWidth && ballY >= rightPaddleY && ballY <= rightPaddleY + rightPaddle.offsetHeight) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballX <= 0) {
        rightScore += 1;
        updateScore();
        resetBall();
    }

    if (ballX >= gameContainer.clientWidth - ball.offsetWidth) {
        leftScore += 1;
        updateScore();
        resetBall();
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

// Update the score
function updateScore() {
    scoreDisplay.textContent = `${leftScore} - ${rightScore}`;
}

// Reset the ball to the center
function resetBall() {
    ballX = 292.5;
    ballY = 192.5;
    ballSpeedX = 2;
    ballSpeedY = 2;
}

// Increase ball speed slightly
function increaseBallSpeed() {
    ballSpeedX *= 1.05;  // Increase horizontal speed by 5%
    ballSpeedY *= 1.05;  // Increase vertical speed by 5%
}

// Handle key press
function keyDownHandler(e) {
    if (e.key in keysPressed) {
        keysPressed[e.key] = true;
    }
}

// Handle key release
function keyUpHandler(e) {
    if (e.key in keysPressed) {
        keysPressed[e.key] = false;
    }
}

// Start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startButton.style.display = 'none';
        requestAnimationFrame(gameLoop);
    }
}

// Pause the game
function pauseGame() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        pauseButton.textContent = 'Resume';
    } else {
        pauseButton.textContent = 'Pause';
        requestAnimationFrame(gameLoop);
    }
}

// Game loop
function gameLoop() {
    if (gamePaused) return;
    movePaddles();
    moveBall();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
