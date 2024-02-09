let word = "";
let nextLetter = document.querySelector("#letter-0");

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

let letter = document.querySelector(".game");
letter.addEventListener("keydown", function (event) {
    if (!isLetter(event.key)) {
        event.preventDefault();
    } else {
        nextLetter.innerHTML = event.key;
        word = word + event.key;
        let letterNumber = Number(nextLetter.id.split("-")[1]);
        let newLetterNumber = letterNumber + 1;
        nextLetter = document.querySelector("#letter-"+newLetterNumber);
    }
});

let spiral = document.querySelector(".spiral");
spiral.setAttribute("visibility", "hidden");