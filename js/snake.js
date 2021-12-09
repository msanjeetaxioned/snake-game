document.addEventListener('DOMContentLoaded', function(event) {
    const snakeContainerDimensions = {width: 1000, height: 500};
    const snakeSize = {width: 80, height: 10};
    const snakePartSize = {width: 10, height: 10};
    const positionIncrement = 10;
    const directions = ["left", "right", "up", "down"];
    let currentDirection = "right";
    let startPos = {top: 200, left: 0};

    const mainContainer = document.querySelector("#main-container");
    const snakeContainer = mainContainer.querySelector("#snake-game-container");
    const snake = snakeContainer.querySelector("#snake");
    const snakeParts = snake.querySelectorAll("li");
    const food = snakeContainer.querySelector("#food");

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
        for(i = snakeParts.length - 1; i >= 0; i--) {
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
    }, 50);
});