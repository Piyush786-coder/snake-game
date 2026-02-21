// ================= GAME CONSTANTS =================
let inputDir = { x: 0, y: 0 };

// Audio Files (Ensure names match exactly)
const foodsound = new Audio('b.mp3');
const movesound = new Audio('move.mp3');
const backgroundmusic = new Audio('bg.mp3');

const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const highScoreBox = document.getElementById("highScoreBox");

let speed = 4;
let score = 0;
let lastpainttime = 0;
let paused = false;
let soundOn = true;
let gameStarted = false; // Naya variable music control ke liye

let highScore = localStorage.getItem("highScore") || 0;
highScoreBox.innerText = highScore;

let snakearr = [{x: 13, y: 15}];
let food = {x: 6, y: 7};

backgroundmusic.loop = true;

// ================= MAIN LOOP =================
function main(ctime) {
    window.requestAnimationFrame(main);

    if(paused) return;

    if((ctime - lastpainttime)/1000 < 1/speed){ 
        return;
    }

    lastpainttime = ctime;
    gameEngine();
}

// ================= COLLISION =================
function iscollide(sarr){
    // Khud se takrana
    for(let i=1; i<sarr.length; i++){
        if(sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y){
            return true;
        }
    }
    // Deewar se takrana
    if(sarr[0].x >= 18 || sarr[0].x <= 0 || sarr[0].y >= 18 || sarr[0].y <= 0){
        return true;
    }
    return false;
}

// ================= GAME ENGINE =================
function gameEngine(){

    if(iscollide(snakearr)){
        backgroundmusic.pause(); // Game over par music stop
        alert("Game Over! Press any key to restart.");
        snakearr = [{x: 13, y: 15}];
        inputDir = {x: 0, y: 0};
        score = 0;
        speed = 4;
        scoreBox.innerText = score;
        gameStarted = false; // Reset game state
        return;
    }

    // Eat food logic
    if(snakearr[0].x === food.x && snakearr[0].y === food.y){
        if(soundOn) foodsound.play();
        score++;
        scoreBox.innerText = score;

        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreBox.innerText = highScore;
        }

        snakearr.unshift({
            x: snakearr[0].x + inputDir.x,
            y: snakearr[0].y + inputDir.y
        });

        food = {
            x: Math.floor(2 + 14 * Math.random()),
            y: Math.floor(2 + 14 * Math.random())
        };

        speed = 4 + score * 0.2;
    }

    // Move snake
    for(let i = snakearr.length - 2; i >= 0; i--){
        snakearr[i+1] = {...snakearr[i]};
    }

    snakearr[0].x += inputDir.x;
    snakearr[0].y += inputDir.y;

    // Render Board
    board.innerHTML = "";
    snakearr.forEach((e, i) => {
        let el = document.createElement("div");
        el.style.gridRowStart = e.y;
        el.style.gridColumnStart = e.x;
        el.classList.add(i === 0 ? "head" : "snake");
        board.appendChild(el);
    });

    let foodEl = document.createElement("div");
    foodEl.style.gridRowStart = food.y;
    foodEl.style.gridColumnStart = food.x;
    foodEl.classList.add("food");
    board.appendChild(foodEl);
}

// ================= START & CONTROLS =================

// Sabse pehle music unlock karne ke liye click listener
window.addEventListener('click', () => {
    if(soundOn && !gameStarted) {
        backgroundmusic.play().catch(e => console.log("Audio play error:", e));
    }
}, { once: true });

window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    
    // Music aur Movement trigger
    if(!gameStarted) {
        gameStarted = true;
        inputDir = {x: 1, y: 0}; // Default movement shuru karein
        if(soundOn) backgroundmusic.play();
    }

    if(soundOn && !paused) {
        movesound.play();
    }

    switch (e.key) {
        case "ArrowUp":
            if(inputDir.y !== 1) inputDir = {x: 0, y: -1};
            break;
        case "ArrowDown":
            if(inputDir.y !== -1) inputDir = {x: 0, y: 1};
            break;
        case "ArrowLeft":
            if(inputDir.x !== 1) inputDir = {x: -1, y: 0};
            break;
        case "ArrowRight":
            if(inputDir.x !== -1) inputDir = {x: 1, y: 0};
            break;
        case " ":
            paused = !paused;
            if(paused) backgroundmusic.pause();
            else if(soundOn) backgroundmusic.play();
            break;
    }
});