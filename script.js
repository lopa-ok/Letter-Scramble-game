let originalWord;
let scrambledWord;
let score = 0;
let timeLeft = 30; // Set a default time limit
let level = 1;
let timerInterval;

async function getRandomWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
        const data = await response.json();
        return data[0];
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
    timeLeft = 30; // Reset the timer to 30 seconds for each round
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('message').textContent = 'Time’s up! Game Over!';
            setTimeout(startGame, 3000); // Restart the game after 3 seconds
        }
    }, 1000);
}

async function startGame() {
    originalWord = await getRandomWord();
    if (level > 1) originalWord += await getRandomWord(); // Combine two words for higher levels
    scrambledWord = scrambleWord(originalWord);
    document.getElementById('scrambled-word').textContent = `Scrambled Word: ${scrambledWord}`;
    document.getElementById('input').value = '';
    document.getElementById('message').textContent = '';
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('level').textContent = `Level: ${level}`;
    startTimer();
}

function checkGuess() {
    const guess = document.getElementById('input').value.trim().toLowerCase();
    if (guess === originalWord) {
        score += 10 * level; // Increase score based on the level
        level++;
        document.getElementById('message').textContent = 'Correct! Well done!';
        setTimeout(startGame, 2000); // Move to the next level after 2 seconds
    } else {
        document.getElementById('message').textContent = 'Try again!';
    }
}

function giveHint() {
    const hintLetter = originalWord.charAt(0);
    document.getElementById('message').textContent = `Hint: The first letter is "${hintLetter}"`;
}

// Start the game when the page loads
startGame();
