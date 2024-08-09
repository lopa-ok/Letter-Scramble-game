const words = ['javascript', 'scramble', 'function', 'variable', 'array'];
let originalWord;
let scrambledWord;

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function scrambleWord(word) {
    let scrambled = word.split('');
    for (let i = scrambled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    return scrambled.join('');
}

function startGame() {
    originalWord = getRandomWord();
    scrambledWord = scrambleWord(originalWord);
    document.getElementById('scrambled-word').textContent = `Scrambled Word: ${scrambledWord}`;
    document.getElementById('input').value = '';
    document.getElementById('message').textContent = '';
}

function checkGuess() {
    const guess = document.getElementById('input').value.trim().toLowerCase();
    if (guess === originalWord) {
        document.getElementById('message').textContent = 'Correct! Well done!';
        setTimeout(startGame, 2000); // Restart the game after 2 seconds
    } else {
        document.getElementById('message').textContent = 'Try again!';
    }
}

// Start the game when the page loads
startGame();
