const dino = document.getElementById("dino");
const game = document.querySelector(".game");
const scoreDisplay = document.getElementById("score");

let score = localStorage.getItem('dinoHighScore') ? parseInt(localStorage.getItem('dinoHighScore')) : 0;
let gameSpeed = 3;

// Physics variabelen
let isJumping = false;
let velocityY = 0;
const gravity = 0.6;
let dinoBottom = 0;

// Springfunctie
function jump(){
    if(!isJumping){
        isJumping = true;
        velocityY = 12; // springkracht
    }
}

document.addEventListener("keydown", (e) => { if(e.code==="Space"){ jump(); }});
document.addEventListener("touchstart", jump);

// Obstakels
function createObstacle(){
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    game.appendChild(obstacle);

    let obstaclePosition = 800 + Math.random()*300;

    const moveObstacle = setInterval(() => {
        obstaclePosition -= gameSpeed;
        obstacle.style.left = obstaclePosition + "px";

        const dinoTop = dinoBottom;

        // Collision check
        if(obstaclePosition > 40 && obstaclePosition < 90 && dinoTop < 50){
            // Game Over: reset score maar geen alert
            if(score > (localStorage.getItem('dinoHighScore') || 0)){
                localStorage.setItem('dinoHighScore', score);
            }
            score = 0;
            scoreDisplay.textContent = `Score: ${score}`;
            gameSpeed = 3;
            obstacle.remove(); // verwijder obstakel
        }

        // Verwijder obstakel als het buiten het scherm is
        if(obstaclePosition < -50){
            obstacle.remove();
            clearInterval(moveObstacle);
            score++;
            scoreDisplay.textContent = `Score: ${score}`;

            // Verhoog snelheid elke 5 punten
            if(score % 5 === 0) gameSpeed += 0.5;
        }
    }, 20);

    // Willekeurige tijd tot volgende obstakel
    const randomTime = Math.random()*2000 + 1000;
    setTimeout(createObstacle, randomTime);
}

// Game loop voor physics
function gameLoop(){
    // Gravity toepassen
    if(dinoBottom > 0 || velocityY > 0){
        velocityY -= gravity;
        dinoBottom += velocityY;
        if(dinoBottom < 0){
            dinoBottom = 0;
            velocityY = 0;
            isJumping = false;
        }
        dino.style.bottom = dinoBottom + "px";
    }

    requestAnimationFrame(gameLoop);
}

// Start het spel
createObstacle();
gameLoop();