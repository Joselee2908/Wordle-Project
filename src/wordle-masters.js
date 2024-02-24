let win = false
let guessAccepted = true;
let tryNum = 0
let word = "";
let wordCode = [];
let currentLetter = 0;

const spiral = document.querySelector(".spiral");

const WORD_URL = "https://words.dev-apis.com/word-of-the-day"
const CHECK_WORD = "https://words.dev-apis.com/validate-word"

let wordOfTheDay

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function constructWordCode(pword, pwin) {
    let ret = [];
    let color = (pwin) ? "#006400" : "#ffffff";
    [...pword].forEach(char => {
        ret.push({
            letter: char,
            color: color
        })
    });
    return ret;
}

function handleIncorrectWord() {
    wordCode = constructWordCode(word, false);
    let i = 0;
    wordCode.forEach((obj) => {
        if (obj.letter === wordOfTheDay.charAt(i)) {
            obj.color = "#006400";
        }
        else if (wordOfTheDay.includes(obj.letter)) {
            let correctLetters = 0;
            for (let j = 0; j < i; ++j) {
                if (wordCode[j].letter === obj.letter && wordCode[j].color === "#006400") ++correctLetters;
            }
            let postCount = 0;
            for (let j = i+1; j < wordOfTheDay.length; ++j) {
                if (wordCode[j].letter === obj.letter) ++postCount;
            }
            let letterOcurrences = 0;
            [...wordOfTheDay].forEach((char) => {
                if (char === obj.letter) ++letterOcurrences;
            });
            obj.color = (letterOcurrences - correctLetters - postCount >= 1) ? "#daa520" : "#888888";
        }
        else {
            obj.color = "#888888";
        }
        ++i;
    });
}

function colorWord(win) {
    let i = 0;
    wordCode.forEach((obj) => {
        let id = "letter-" + Number(5*tryNum + i)
        let letter = document.getElementById(id);
        letter.style.backgroundColor = win ? "#006400" : obj.color;
        letter.style.color = "#ffffff";
        ++i;
    });
}

async function handleWord() {
    if (word.length === 5) {
        spiral.style.visibility = "visible";
        const promise = await fetch(CHECK_WORD, {
            method: "POST",
            body: JSON.stringify({
                word: word
            })
        });
        const processedResponse = await promise.json();
        if (processedResponse.validWord) {
            if (word === wordOfTheDay) {
                win = true;
                wordCode = constructWordCode(word, win);
                colorWord(win);
                document.querySelector("h1").classList.add("rainbow_text_animated");
                alert("you win!");
            } else {
                // HANDLE CORRECT LETTERS
                handleIncorrectWord();
                colorWord();
                // HANDLE LOSE
                ++tryNum;
                if (tryNum === 6) {
                    alert("you lose, the word was " + wordOfTheDay);
                    win = true;
                }
            }
            word = "";
            guessAccepted = true;
        }
        else {
            for (let i=0; i < 5; ++i) {
                let id = "letter-" + Number(5*tryNum + i)
                let letter = document.getElementById(id);
                // letter.style.animation = "";
                // letter.style.animation = "1s linear 0s wrongWord";
                letter.classList.remove("wrongWord");
                letter.offsetWidth;
                letter.classList.add("wrongWord");
            }
        }
        spiral.style.visibility = "hidden";
    }
}

function removeLetter() {
    if (currentLetter % 5 !== 0 || !guessAccepted) {
        --currentLetter;
        let letter = document.querySelector("#letter-"+currentLetter);
        letter.innerHTML = "";
        word = word.substring(0, word.length - 1);
    }
}

function addLetter(key) {
    let letter = document.querySelector("#letter-"+currentLetter);
    letter.innerHTML = key;
    word += key;
    ++currentLetter;
    guessAccepted = false;
}

let body = document.querySelector("body");
body.addEventListener("keydown", function (event) {
    if (!isLetter(event.key)) {
        if (event.key === "Backspace" && word.length >= 1) {
            removeLetter();
        } else if (event.key === "Enter") {
            handleWord();
        }
    } else {
        if (word.length !== 5 && !win) {
            addLetter(event.key);
        }
    }
});

async function init() {
    const promise = await fetch(WORD_URL);
    const processedResponse = await promise.json();
    wordOfTheDay = processedResponse.word;
    spiral.style.visibility = "hidden";
}

init();

body.setAttribute("focused", true);