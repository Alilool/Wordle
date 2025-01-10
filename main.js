const rows = document.querySelectorAll(".row");
let tiles = null;
const keys = document.querySelectorAll(".key");
const endGameMenu = document.getElementById("endGameMenu");
const restartButton = document.getElementById("restartButton");
const endGameMessage = document.getElementById("endGameMessage");
const endGameTitle = document.getElementById("endGameTitle");
const startMenu = document.getElementById("startMenu");
const startButton = document.getElementById("startButton");
const wordLength = document.getElementById("wordLength");
const keyboard = document.getElementById("keyboard");
let tilecounter = 0;
let currentRow = 0;
let word = ""
let isWin = false
let gameStarted = false

function generateWord() {
    fetch(`https://random-word-api.herokuapp.com/word?number=1&length=${wordLength.value}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // `data` is an array of words
            word = data[0];
            console.log(word);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

}

document.getElementById("startButton").addEventListener("click", () => {
    startMenu.classList.add("hidden");
    keyboard.classList.remove("hidden");
    gameStarted = true
    rows.forEach(row => {
        row.innerHTML = "";
        for (let i = 0; i < wordLength.value; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            row.appendChild(tile);
        }
    });
    generateWord();
    tiles = document.querySelectorAll(".tile");
});

document.addEventListener("keydown", (e) => {
    if (tilecounter <= (wordLength.value * 6) - 1 && e.key.length == 1 && !isWin && gameStarted) {
        tiles[tilecounter].textContent = e.key;
        tilecounter++;
        checkRow()
    }
    else if (e.key == "Backspace" && tilecounter > 0) {
        tilecounter--;
        tiles[tilecounter].textContent = "";
    }
});

keys.forEach((key) => {
    key.addEventListener("click", () => {
        if (tilecounter <= (wordLength.value * 6) - 1 && key.textContent != "←" && !isWin && gameStarted) {
            tiles[tilecounter].textContent = key.textContent.toLowerCase();
            tilecounter++;
            checkRow()
        } else if (key.textContent == "←" && tilecounter > 0 && currentRow * wordLength.value < tilecounter) {
            tilecounter--;
            tiles[tilecounter].textContent = "";
        }
    });
});

restartButton.addEventListener("click", () => {
    location.reload();
});

function checkRow() {
    if (tilecounter > 0 && tilecounter % wordLength.value == 0) {
        checkWord(currentRow);
        currentRow++;
    }
    if (currentRow == 6 && !isWin) {
        setInterval(() => {
            endGameMenu.classList.remove("hidden");
            endGameTitle.textContent = "You Lose!";
            endGameMessage.textContent = "The word was: " + word.toUpperCase();
        }, 400);
    }
}

function checkWord(row) {
    userWord = "";
    for (let i = 0; i < wordLength.value; i++) {
        userWord += tiles[i + row * wordLength.value].textContent;
    }
    if (userWord == word) {
        for (let i = 0; i < wordLength.value; i++) {
            tiles[i + row * wordLength.value].style.backgroundColor = "green";
        }
        celebrate()
        isWin = true
        setInterval(() => {
            endGameMenu.classList.remove("hidden");
            endGameTitle.textContent = "You Win!";
            endGameMessage.textContent = "You guessed the word in " + (row + 1) + " attempts!";

        }, 1500);
    } else if (userWord != word) {
        for (let i = 0; i < wordLength.value; i++) {
            word.includes(userWord[i]) ? tiles[i + row * wordLength.value].style.backgroundColor = "#b59f3b" : tiles[i + row * wordLength.value].style.backgroundColor = "#6b6b6b";
            if (word.includes(userWord[i])) {
                if (word[i] == userWord[i]) {
                    tiles[i + row * wordLength.value].style.backgroundColor = "green";
                } else {
                    tiles[i + row * wordLength.value].style.backgroundColor = "#b59fwordLength.valueb";
                }
            } else {
                tiles[i + row * wordLength.value].style.backgroundColor = "#6b6b6b";
            }
        }
    }
}

function celebrate() {
    const tiles = document.querySelectorAll('.tile');
    const duration = 500; // animation duration in milliseconds
    const delay = 100; // delay between each tile's animation

    tiles.forEach((tile, index) => {
        tile.style.animation = `jump ${duration}ms ${index * delay}ms`;
    });
}
