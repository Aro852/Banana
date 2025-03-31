let score = 0;
let lives = 3;
let highScore = localStorage.getItem('highScore') || 0;
let timer;
let timeLeft = 30;

const puzzleImage = document.getElementById('puzzleImage');
const answerOptions = document.getElementById('answerOptions');
const message = document.getElementById('message');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const retryBtn = document.getElementById('retryBtn');
const timerDisplay = document.createElement('p');

timerDisplay.id = "timer";
timerDisplay.style.fontSize = "1.2em";
timerDisplay.style.fontWeight = "bold";
timerDisplay.style.color = "red";
document.querySelector(".game-container").insertBefore(timerDisplay, answerOptions);

highScoreDisplay.textContent = highScore;

async function fetchPuzzle() {
    try {
        const apiUrl = "https://marcconrad.com/uob/banana/api.php?out=json";
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Puzzle:", data); // Debugging: Check the response
        return data;
    } catch (error) {
        console.error('Error fetching puzzle:', error);
        return null;
    }
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            message.textContent = "⏳ Time's Up! ❌";
            lives--;
            livesDisplay.textContent = `Lives: ${lives}`;
            if (lives <= 0) {
                gameOver();
            } else {
                loadPuzzle();
            }
        }
    }, 1000);
}

async function loadPuzzle() {
    const puzzle = await fetchPuzzle();
    if (puzzle && puzzle.question && puzzle.solution) {
        puzzleImage.src = puzzle.question; // Corrected image URL
        puzzleImage.alt = "Banana Puzzle";
        message.textContent = '';
        generateAnswerButtons(puzzle.solution);
        startTimer();
    } else {
        message.textContent = "❌ Failed to load puzzle. Try again.";
    }
}

function generateAnswerButtons(correctAnswer) {
    answerOptions.innerHTML = "";
    let choices = new Set();
    choices.add(correctAnswer);

    while (choices.size < 4) {
        choices.add(Math.floor(Math.random() * 10).toString());
    }

    let shuffledChoices = Array.from(choices).sort(() => Math.random() - 0.5);

    shuffledChoices.forEach(choice => {
        let button = document.createElement("button");
        button.textContent = choice;
        button.classList.add("answer-btn");
        button.onclick = () => checkAnswer(choice, correctAnswer);
        answerOptions.appendChild(button);
    });
}

function checkAnswer(selectedAnswer, correctAnswer) {
    clearInterval(timer);

    if (selectedAnswer === correctAnswer) {
        score += 10;
        message.textContent = "✅ Correct!";
    } else {
        lives--;
        message.textContent = "❌ Wrong!";
    }

    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;

    if (lives <= 0) {
        gameOver();
    } else {
        setTimeout(loadPuzzle, 1000);
    }
}

function gameOver() {
    clearInterval(timer);
    message.textContent = `Game Over! Final Score: ${score}`;
    answerOptions.innerHTML = "";
    retryBtn.style.display = "block";

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    highScoreDisplay.textContent = highScore;
}

function restartGame() {
    score = 0;
    lives = 3;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    retryBtn.style.display = "none";
    loadPuzzle();
}

retryBtn.addEventListener('click', restartGame);

loadPuzzle();
