// Papan permainan
let gameCanvas;
let canvasWidth = 1280;
let canvasHeight = 720;
let ctx;

// Burung
let birdWidth = 20;
let birdHeight = 29;
let birdX = canvasWidth / 8;
let birdY = canvasHeight / 2;
let birdImage;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Pipa
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = canvasWidth;
let pipeY = 0;

let topPipeImage;
let bottomPipeImage;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let isGamePaused = true;

window.onload = function () {
    gameCanvas = document.getElementById("board");
    gameCanvas.height = canvasHeight;
    gameCanvas.width = canvasWidth;
    ctx = gameCanvas.getContext("2d");

    birdImage = new Image();
    birdImage.src = "./flappybird.png";
    birdImage.onload = function () {
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImage = new Image();
    topPipeImage.src = "./toppipe.png";

    bottomPipeImage = new Image();
    bottomPipeImage.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);

    if (isGamePaused){
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fillStyle = "white";
        ctx.font = "24px sans-serif";
        ctx.fillText("Flappy Bird", gameCanvas.width / 2 - 300, gameCanvas.height / 3);
        ctx.fillText("Arrow atas untuk memulai", gameCanvas.width / 2 - 300, gameCanvas.height / 2);
        ctx.fillText("Spasi untuk menggerakan karakter", gameCanvas.width / 2 - 15, gameCanvas.height / 2);
        // <h4>Username:
        //     <script>
        //         document.write(localStorage.getItem("name"));
        //     </script>
        // </h4>
        return;
    }

    if (gameOver) {
        return;
    }
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);

    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > gameCanvas.height) {
        gameOver = true;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    ctx.fillStyle = "white";
    ctx.font = "45px sans-serif";
    ctx.fillText(score, 5, 45);

    if (gameOver) {
        ctx.fillText("GAME OVER", 5, 90);
        ctx.fillText("Press Space to Start", 5, 150);
    }
}

function startGame() {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    isGamePaused = false;
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = canvasHeight / 4;

    let topPipe = {
        img: topPipeImage,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImage,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            isGamePaused = false;
        } else if (e.code == "ArrowUp"){ 
            isGamePaused = !isGamePaused;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
