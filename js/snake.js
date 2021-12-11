document.addEventListener('DOMContentLoaded', function(event) {
    const snakeContainerDimensions = {width: 1000, height: 500};
    const snakePartSize = {width: 10, height: 10};
    const foodSize = 10;
    const positionIncrement = 10;
    const directions = ["left", "right", "up", "down"];
    const startPos = {top: 200, left: 0};
    const messages = ["Nice Try!", "Good Job! You Equalled the Highest Score","Congrats!! You now have the Highest Score!!"];

    let baseIntervalTime;
    let level;
    let score;
    localStorage.setItem("snake-game-high-score", 0);
    let highScore = localStorage.getItem("snake-game-high-score") ? parseInt(localStorage.getItem("snake-game-high-score")) : 0; // Get High Score if it exists in Local Storage
    let currentDirection;

    const modal = document.querySelector("#modal");
    const restartButton = document.querySelector("#modal .restart-button > button");
    const mainContainer = document.querySelector("#main-container");
    const snakeContainer = mainContainer.querySelector("#snake-game-container");
    const snake = snakeContainer.querySelector("#snake");
    const stats = mainContainer.querySelector(".stats");
    const levelHTML = stats.querySelectorAll("span")[0];
    const currentScoreHTML = stats.querySelectorAll("span")[1];

    const highScoreHTML = stats.querySelectorAll("span")[2]; // Show High Score
    highScoreHTML.innerHTML = `<small>Highest Score: </small> ${highScore}`;
    
    let food = snakeContainer.querySelector("#food"); 
    let snakeParts = snake.querySelectorAll("li");
    const originalSnakeBackup = snakeParts;

    document.addEventListener("keydown", function(event) {
        switch(event.key) {
            case "ArrowLeft":
                if(currentDirection != "right" && currentDirection != "left") {
                    currentDirection = directions[0];
                }
                break;
            case "ArrowRight":
                if(currentDirection != "left" && currentDirection != "right") {
                    currentDirection = directions[1];
                }
                break;
            case "ArrowUp":
                if(currentDirection != "down" && currentDirection != "up") {
                    currentDirection = directions[2];
                }
                break;
            case "ArrowDown":
                if(currentDirection != "up" && currentDirection != "down") {
                    currentDirection = directions[3];
                }
                break;
        }
    });

    restartButton.addEventListener("click", function() {
        showOrHideModal(false);
    });

    startGame(false);

    // Start Game: Initializes game and Starts or Resets it based on Parameter passed.
    function startGame(restart) {
        if(restart) {
            snake.innerHTML = "";
            for(let item of originalSnakeBackup) {
                snake.append(item);
            }
            snakeParts = snake.querySelectorAll("li");
        }
        currentDirection = "right";
        level = 0;
        levelHTML.innerHTML = `<small>Level: </small>${level}`;
        baseIntervalTime = 100;
        score = 0;
        currentScoreHTML.innerHTML = `<small>Current Score: </small> ${score}`;
        setNewFood();

        // Set Individual Snake Parts Starting Position 
        for(let i = 0; i < snakeParts.length; i++) {
            snakeParts[i].style.left = startPos.left - snakePartSize.width * (i+1) + "px";
            snakeParts[i].style.top = startPos.top + "px";
        }

        // Move Snake
        let interval = setInterval(function() {
            for(let i = 1; i < snakeParts.length; i++) { // Check Snake Collision
                if(checkSnakeCollision(snakeParts[0], snakeParts[i])) {
                    clearInterval(interval);
                    if(score == highScore) {
                        showOrHideModal(true, 1);
                    }
                    else if(score > highScore) {
                        highScore = score;
                        showOrHideModal(true, 2); // New High Score
                        highScoreHTML.innerHTML = `<small>Highest Score: </small> ${highScore}`;
                        localStorage.setItem("snake-game-high-score", highScore);
                    }
                    else {
                        showOrHideModal(true, 0); // No New High Score
                    }
                    return;
                }
            }
            if(checkCollisionWithFood()) { // Check Collision with Food
                setNewFood();
                currentScoreHTML.innerHTML = `<small>Current Score: </small> ${++score}`;
                let newLevel = Math.floor(score/10); 
                if(newLevel <= 10) {
                    if(level < newLevel) {
                        level = newLevel;
                        levelHTML.innerHTML = `<small>Level: </small>${level}`;
                        baseIntervalTime = 100 * (1 - 0.05 * level);
                    }
                }
                increaseSnakeSize();
            }
            snakeParts = snake.querySelectorAll("li");
            for(let i = snakeParts.length - 1; i >= 0; i--) {
                if(i == 0) {
                    if(currentDirection == "right") {
                        if(parseInt(snakeParts[i].style.left) >= (snakeContainerDimensions.width - snakePartSize.width)) {
                            snakeParts[i].style.left = "0px";
                        }
                        else {
                            snakeParts[i].style.left = parseInt(snakeParts[i].style.left) + positionIncrement + "px";
                        }
                    }
                    if(currentDirection == "left") {
                        if(parseInt(snakeParts[i].style.left) <= 0) {
                            snakeParts[i].style.left = snakeContainerDimensions.width - positionIncrement + "px";
                        }
                        else {
                            snakeParts[i].style.left = parseInt(snakeParts[i].style.left) - positionIncrement + "px";
                        }
                    }
                    else if(currentDirection == "up") {
                        if(parseInt(snakeParts[i].style.top) <= 0) {
                            snakeParts[i].style.top = snakeContainerDimensions.height - positionIncrement + "px";
                        }
                        else {
                            snakeParts[i].style.top = parseInt(snakeParts[i].style.top) - positionIncrement + "px";
                        }
                    }
                    else if(currentDirection == "down") {
                        if(parseInt(snakeParts[i].style.top) >= (snakeContainerDimensions.height-snakePartSize.height)) {
                            snakeParts[i].style.top = "0px";
                        }
                        else {
                            snakeParts[i].style.top = parseInt(snakeParts[i].style.top) + positionIncrement + "px";
                        }
                    }
                }
                else {
                    snakeParts[i].style.left = snakeParts[i-1].style.left;
                    snakeParts[i].style.top = snakeParts[i-1].style.top;
                }
            }
        }, baseIntervalTime);
    }

    function getRandomIntegerBetweenMixAndMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function checkSnakeCollision(firstPart, secondPart) {
        let firstPartRect = firstPart.getBoundingClientRect();
        let secondPartRect = secondPart.getBoundingClientRect();

        if(firstPartRect.left == secondPartRect.left && firstPartRect.top == secondPartRect.top) {
            return true;
        }
        return false;
    }

    function setNewFood() {
        food.style.top = getRandomIntegerBetweenMixAndMax(0, snakeContainerDimensions.height-foodSize) + "px";
        food.style.left = getRandomIntegerBetweenMixAndMax(0, snakeContainerDimensions.width-foodSize) + "px";
    }

    function checkCollisionWithFood() {
        let snakeStartRect = snakeParts[0].getBoundingClientRect();
        let foodRect = food.getBoundingClientRect();

        if( ((snakeStartRect.top + snakeStartRect.height) < (foodRect.top)) ||
            (snakeStartRect.top > (foodRect.top + foodRect.height)) ||
            ((snakeStartRect.left + snakeStartRect.width) < foodRect.left) ||
            (snakeStartRect.left > (foodRect.left + foodRect.width)) ) {
                return false;
        }
        return true;
    }

    function increaseSnakeSize() {
        let lis = [], number = 2;
        for(let i = 1; i <= number; i++) {
            lis[i] = document.createElement("li");
            lis[i].innerText = snakeParts.length + i;
            snake.appendChild(lis[i]);
        }
    }

    function showOrHideModal(show, newHighScore) {
        if(show) {
            let scoreHTML = modal.querySelector(".score");
            scoreHTML.innerHTML = score;
            let message = modal.querySelector(".message");
            if(newHighScore == 2) {
                message.innerText = messages[2];
                message.classList.remove("equal-high-score");
                message.classList.add("high-score");
            }
            else if(newHighScore == 1) {
                message.innerText = messages[1];
                message.classList.remove("high-score");
                message.classList.add("equal-high-score");
            }
            else {
                message.innerText = messages[0];
                message.classList.remove("high-score");
                message.classList.remove("equal-high-score");
            }
            mainContainer.classList.add("opacity-low");
            modal.classList.remove("display-none");
        }
        else {
            modal.classList.add("display-none");
            mainContainer.classList.remove("opacity-low");
            startGame(true);
        }
    }
});