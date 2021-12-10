document.addEventListener('DOMContentLoaded', function(event) {
    const snakeContainerDimensions = {width: 1000, height: 500};
    const snakePartSize = {width: 5, height: 5};
    const foodSize = 10;
    const positionIncrement = 5;
    const directions = ["left", "right", "up", "down"];
    const startPos = {top: 200, left: 0};

    let score = 0;
    let currentDirection = "right";

    const mainContainer = document.querySelector("#main-container");
    const snakeContainer = mainContainer.querySelector("#snake-game-container");
    const snake = snakeContainer.querySelector("#snake");
    const stats = mainContainer.querySelector(".stats");
    const currentScoreHTML = stats.querySelectorAll("span")[0];
    
    let food = snakeContainer.querySelector("#food");
    setNewFood();
    
    let snakeParts = snake.querySelectorAll("li");

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

    // Set Individual Snake Parts Starting Position 
    for(let i = 0; i < snakeParts.length; i++) {
        snakeParts[i].style.left = startPos.left - snakePartSize.width * (i+1) + "px";
        snakeParts[i].style.top = startPos.top + "px";
    }

    let interval = setInterval(function() {
        for(let i = 1; i < snakeParts.length; i++) { // Check Snake Collision
            if(checkSnakeCollision(snakeParts[0], snakeParts[i])) {
                clearInterval(interval);
            }
        }
        if(checkCollisionWithFood()) { // Check Collision with Food
            setNewFood();
            currentScoreHTML.innerHTML = `<small>Current Score: </small> ${++score}`;
            increaseSnakeSize();
        }
        snakeParts = snake.querySelectorAll("li");
        for(let i = snakeParts.length - 1; i >= 0; i--) {
            if(i == 0) {
                if(currentDirection == "right") {
                    if(parseInt(snakeParts[i].style.left) + positionIncrement >= snakeContainerDimensions.width) {
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
                    if(parseInt(snakeParts[i].style.top) >= snakeContainerDimensions.height) {
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
    }, 40);

    function getRandomIntegerBetweenMixAndMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
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
        let lis = [], number = 4;
        for(let i = 1; i <= number; i++) {
            lis[i] = document.createElement("li");
            lis[i].innerText = snakeParts.length + i;
            snake.appendChild(lis[i]);
        }
    }
});