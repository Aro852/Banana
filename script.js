const puzzles = [
    { image: 'https://www.sanfoh.com/uob/banana/data/tce25c4945f7e898920620665can68.png', solution: '8' },
    { image: 'https://www.sanfoh.com/uob/banana/data/tcf78297aed7ad12fd47a985607n76.png', solution: '6' },
    { image: 'https://www.sanfoh.com/uob/banana/data/td34b97440e19a5a12be585150fn80.png', solution: '0' },
    { image: 'https://www.sanfoh.com/uob/banana/data/td395b9299083da2761ad6bde27n117.png', solution: '7' }
];

let currentPuzzleIndex = 0;
let score = 0;
let lives = 3;
let highScore = localStorage.getItem('highScore') || 0;

const puzzleImage = document.getElementById('puzzleImage');
const answerOptions = document.getElementById('answerOptions');
const message = document.getElementById('message');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const retryBtn = document.getElementById('retryBtn');

highScoreDisplay.textContent = highScore;

// Load a new puzzle
function loadPuzzle() {
    if (currentPuzzleIndex < puzzles.length) {
        const puzzle = puzzles[currentPuzzleIndex];
        puzzleImage.src = puzzle.image;
        message.textContent = '';
        generateAnswerButtons(puzzle.solution);
    } else {
        gameOver();
    }
}

// Generate four answer choices (1 correct + 3 random)
function generateAnswerButtons(correctAnswer) {
    answerOptions.innerHTML = "";
    let choices = new Set();
    choices.add(correctAnswer);

    // Generate three random numbers (0-9) that are not the correct answer
    while (choices.size < 4) {
        choices.add(Math.floor(Math.random() * 10).toString());
    }

    // Shuffle choices
    let shuffledChoices = Array.from(choices).sort(() => Math.random() - 0.5);

    shuffledChoices.forEach(choice => {
        let button = document.createElement("button");
        button.textContent = choice;
        button.classList.add("answer-btn");
        button.onclick = () => checkAnswer(choice);
        answerOptions.appendChild(button);
    });
}

// Check selected answer
function checkAnswer(selectedAnswer) {
    const correctAnswer = puzzles[currentPuzzleIndex].solution;

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
        nextPuzzle();
    }
}

// Load the next puzzle
function nextPuzzle() {
    currentPuzzleIndex++;
    setTimeout(loadPuzzle, 1000);
}

// End game logic
function gameOver() {
    message.textContent = `Game Over! Final Score: ${score}`;
    answerOptions.innerHTML = "";
    retryBtn.style.display = "block";

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    highScoreDisplay.textContent = highScore;
}

// Restart game
function restartGame() {
    currentPuzzleIndex = 0;
    score = 0;
    lives = 3;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    retryBtn.style.display = "none";
    loadPuzzle();
}

// Event listener for retry button
retryBtn.addEventListener('click', restartGame);

// Start game
loadPuzzle();
