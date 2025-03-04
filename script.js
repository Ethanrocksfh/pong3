// Select elements
const leftPaddle = document.getElementById('left-paddle');
const rightPaddle = document.getElementById('right-paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const gameContainer = document.querySelector('.game-container');

// Game variables
let leftPaddleY = 150, rightPaddleY = 150;
let ballX = 292.5, ballY = 192.5;
let ballSpeedX = (Math.random() > 0.5 ? 2 : -2);
let ballSpeedY = (Math.random() > 0.5 ? 2 : -2);
const paddleSpeed = 6;
const gameHeight = gameContainer.clientHeight;
const gameWidth = gameContainer.clientWidth;
let leftScore = 0, rightScore = 0;
let gameRunning = true;

// Controls
const keysPressed = {
    w: false, s: false, ArrowUp: false, ArrowDown: false
};

// Paddle Movement
function movePaddles() {
    if (keysPressed['w']) leftPaddleY -= paddleSpeed;
    if (keysPressed['s']) leftPaddleY += paddleSpeed;
    if (keysPressed['ArrowUp']) rightPaddleY -= paddleSpeed;
    if (keysPressed['ArrowDown']) rightPaddleY += paddleSpeed;

    leftPaddleY = Math.max(0, Math.min(leftPaddleY, gameHeight - leftPaddle.offsetHeight));
    rightPaddleY = Math.max(0, Math.min(rightPaddleY, gameHeight - rightPaddle.offsetHeight));

    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';
}

// Ball Movement
function moveBall() {
    if (!gameRunning) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY <= 0 || ballY >= gameHeight - ball.offsetHeight) {
        ballSpeedY = -ballSpeedY;
        playSound('bounce');
    }

    // Ball collision with paddles
    if (ballX <= leftPaddle.offsetWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + leftPaddle.offsetHeight) {
        ballSpeedX = -ballSpeedX;
        increaseBallSpeed();
        playSound('paddle');
    }

    if (ballX >= gameWidth - ball.offsetWidth - rightPaddle.offsetWidth && ballY >= rightPaddleY && ballY <= rightPaddleY + rightPaddle.offsetHeight) {
        ballSpeedX = -ballSpeedX;
        increaseBallSpeed();
        playSound('paddle');
    }

    // Ball out of bounds (Scoring)
    if (ballX <= 0) {
        rightScore++;
        updateScore();
        playSound('score');
        resetBall();
    }

    if (ballX >= gameWidth - ball.offsetWidth) {
        leftScore++;
        updateScore();
        playSound('score');
        resetBall();
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

// Update Score & Check for Winner
function updateScore() {
    scoreDisplay.textContent = `${leftScore} - ${rightScore}`;
    
    if (leftScore >= 5 || rightScore >= 5) {
        gameRunning = false;
        scoreDisplay.textContent = `Game Over! ${leftScore >= 5 ? 'Left' : 'Right'} Player Wins`;
        setTimeout(() => restartGame(), 2000);
    }
}

// Reset Ball
function resetBall() {
    ballX = 292.5;
    ballY = 192.5;
    ballSpeedX = (Math.random() > 0.5 ? 2 : -2);
    ballSpeedY = (Math.random() > 0.5 ? 2 : -2);
}

// Increase Ball Speed Over Time
function increaseBallSpeed() {
    ballSpeedX *= 1.1;
    ballSpeedY *= 1.1;
    if (Math.abs(ballSpeedX) > 6) ballSpeedX = (ballSpeedX > 0 ? 6 : -6);
    if (Math.abs(ballSpeedY) > 6) ballSpeedY = (ballSpeedY > 0 ? 6 : -6);
}

// Restart Game
function restartGame() {
    leftScore = 0;
    rightScore = 0;
    gameRunning = true;
    updateScore();
    resetBall();
}

// Handle Key Events
document.addEventListener('keydown', (e) => {
    if (e.key in keysPressed) keysPressed[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key in keysPressed) keysPressed[e.key] = false;
});

// Game Loop
function gameLoop() {
    movePaddles();
    moveBall();
    requestAnimationFrame(gameLoop);
}

// Sound Effects
function playSound(type) {
    let sound;
    if (type === 'paddle') {
        sound = new Audio('https://www.fesliyanstudios.com/play-mp3/283');
    } else if (type === 'score') {
        sound = new Audio('https://www.fesliyanstudios.com/play-mp3/276');
    } else if (type === 'bounce') {
        sound = new Audio('https://www.fesliyanstudios.com/play-mp3/277');
    }
    if (sound) sound.play();
}

// Start Game
gameLoop();

