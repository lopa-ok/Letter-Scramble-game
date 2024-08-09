let originalWord;
let scrambledWord;
let score = 0;
let timeLeft;
let level = 1;
let lives = 3;
let timerInterval;
let difficulty = 'medium'; // Default difficulty
let leaderboard = [];
let wordCategory = 'random'; // Default category

async function getRandomWord() {
    try {
        const apiUrl = wordCategory === 'random' 
            ? 'https://random-word-api.herokuapp.com/word?number=1' 
            : `https://api.datamuse.com/words?topics=${wordCategory}&max=1`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return wordCategory === 'random' ? data[0] : data[0].word;
    } catch (error) {
        console.error('Error fetching the word:', error);
        return 'fallback'; // Fallback word in case of an error
    }
}

function scrambleWord(word) {
    let scrambled = word.split('');
    for (let i = scrambled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    return scrambled.join('');
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = difficulty === 'easy' ? 40 : difficulty === 'hard' ? 20 : 30; // Set time based on difficulty
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            loseLife();
        }
    }, 1000);
}

async function startGame() {
    if (lives <= 0) {
        endGame();
        return;
    }
    originalWord = await getRandomWord();
    if (level > 1) originalWord += await getRandomWord(); // Combine two words for higher levels
    scrambledWord = scrambleWord(originalWord);
    document.getElementById('scrambled-word').textContent = `Scrambled Word: ${scrambledWord}`;
    document.getElementById('input').value = '';
    document.getElementById('message').textContent = '';
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('level').textContent = `Level: ${level}`;
    document.getElementById('lives').textContent = `Lives: ${lives}`;
    startTimer();
}

function checkGuess() {
    const guess = document.getElementById('input').value.trim().toLowerCase();
    if (guess === originalWord) {
        score += 10 * level; // Increase score based on the level
        level++;
        document.getElementById('message').textContent = 'Correct! Well done!';
        playSound('correct');
        setTimeout(startGame, 2000); // Move to the next level after 2 seconds
    } else {
        document.getElementById('message').textContent = 'Try again!';
        playSound('wrong');
    }
}

function loseLife() {
    lives--;
    if (lives > 0) {
        document.getElementById('message').textContent = `Incorrect! You have ${lives} lives left.`;
        playSound('wrong');
        setTimeout(startGame, 2000); // Restart the game after 2 seconds
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById('message').textContent = `Game Over! Final Score: ${score}`;
    updateLeaderboard();
    displayLeaderboard();
    setTimeout(() => {
        level = 1;
        score = 0;
        lives = 3;
        startGame();
    }, 5000); // Restart the game after 5 seconds
}

function updateLeaderboard() {
    leaderboard.push({ score, level });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5); // Keep only top 5 scores
}

function displayLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard');
    leaderboardDiv.innerHTML = '<h3>Leaderboard</h3>';
    leaderboard.forEach((entry, index) => {
        leaderboardDiv.innerHTML += `<p>${index + 1}. Score: ${entry.score}, Level: ${entry.level}</p>`;
    });
}

function giveHint() {
    const hintLetter = originalWord.charAt(0);
    document.getElementById('message').textContent = `Hint: The first letter is "${hintLetter}"`;
}

function playSound(type) {
    const audio = new Audio(`sounds/${type}.mp3`);
    audio.play();
}

function setDifficulty(selectedDifficulty) {
    difficulty = selectedDifficulty;
    document.getElementById('difficulty').textContent = `Difficulty: ${difficulty}`;
    startGame();
}

function setCategory(selectedCategory) {
    wordCategory = selectedCategory;
    document.getElementById('category').textContent = `Category: ${wordCategory}`;
    startGame();
}

// Start the game when the page loads
startGame();
