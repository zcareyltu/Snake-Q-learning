const cellSize = 7;
const snakeSize = 5;

const bgColor1 = [167, 217, 72];
const bgColor2 = [142, 204, 57];
const snakeColor = [74, 117, 44];
const appleColor = [231, 71, 29];

const GameOverTextColor = [255, 255, 255];
const GameOverFadeColor = [0, 0, 0];
const GameOverFadeTransparency = 0.3;

const eyeDistance = 0.10;
const eyeHeight = 0.22;
const eyeSize = 0.18;
const eyeColor = [0, 0, 0];

const mouthWidth = 0.08;
const mouthLength = 0.27;
const mouthColor = [255, 82, 157];

const aiTypes = {
    'manual': {
        initialize: null,
        getInput: manualInput,
        debugDraw: null
    },
    'direct': {
        initialize: null,
        getInput: DirectAI,
        debugDraw: null
    },
    'hamiltonian': {
        initialize: initHamiltonian,
        getInput: HamiltonianCycleAI,
        debugDraw: drawHamCycle
    }
};

//User input variables
var aiType;
var mapWidth;
var mapHeight;
var gameSpeed;

//Program variables
var cellPixels;
var snakePixels;
var bgCanvas;
var canvas;
var graphics;
var timerID;
var loseScreenDisplayed = false;
var ai;
var keyX = 0;
var keyY = 0;

//Game variables
var inputX;
var inputY;
var posX;
var posY;
var appleX;
var applyY;
var velX;
var velY;
var trail;

function initialize(){
    canvas = document.getElementById("canvas"); 

    HTML.addKeyDownListener(keyDown);
    //HTML.addKeyUpListener(keyUp);
}

function loadUserVariables(){
    aiType = HTML.getListValue("aiType", "manual");
    ai = aiTypes[aiType];
    if(!ai) ai = aiTypes['manual'];

    mapWidth = mapHeight = HTML.getNumberValue("mapSize", 10);
    if(!mapWidth) mapWidth = mapHeight = 10;

    gameSpeed = parseInt(HTML.getListValue("gameSpeed", "500"));
    if(!gameSpeed) gameSpeed = 500;
}

function drawBG(){
    bgCanvas = document.createElement("canvas");
    bgCanvas.width = cellPixels * mapWidth;
    bgCanvas.height = cellPixels * mapHeight;
    var g = HTML.getGraphics(bgCanvas);

    g.fill(bgColor2);
    for(var y = 0; y < mapHeight; y++){
        for(var x = y % 2; x < mapWidth; x+=2){
            g.fillRect(x*cellPixels, y*cellPixels, cellPixels, cellPixels, bgColor1);
        }
    }
}

function gameReset(){
    if(timerID) HTML.stopTimer(timerID);
    loadUserVariables();

    var sizeModifier = Math.ceil(600 / (cellSize * mapWidth));
    cellPixels = cellSize * sizeModifier;
    snakePixels = snakeSize * sizeModifier;

    canvas.width = cellPixels * mapWidth;
    canvas.height = cellPixels * mapHeight;
    graphics = HTML.getGraphics(canvas);
    
    drawBG();
    graphics.copyImage(bgCanvas); 

    inputX = 0;
    inputY = 0;
    velX = 0;
    velY = 0;
    posX = Math.floor(mapWidth / 2);
    posY = Math.floor(mapHeight / 2);
    randomApplePosition();
    trail = [];
    trail.push({
        x: posX,
        y: posY
    });

    timerID = HTML.addTimer(game, gameSpeed);
    if(ai.initialize) ai.initialize();
    game(true);
}

function game(){
    if(ai.getInput) ai.getInput();
    if(Math.abs(inputX - velX) <=1 && Math.abs(inputY - velY) <= 1 && (inputX !=0 || inputY != 0)){
        velX = inputX;
        velY = inputY;
    }

    //Move the head and check for collisions
    posX += velX;
    posY += velY;

    //Only remove the tail of the trail if we didn't hit an apple, otherwise move the apple
    if(posX == appleX && posY == appleY){
        randomApplePosition();
    }else{
        trail.shift();
    }

    if(((velX != 0 || velY != 0) && isSnakeColliding()) || (posX < 0) || (posX >= mapWidth) || (posY < 0) || (posY >= mapHeight)){
        loseGame();
        return;
    }

    //Add the new position to the trail.
    trail.push({
        x: posX,
        y: posY
    });

    graphics.copyImage(bgCanvas);
    drawApple();
    drawSnake();
    if(ai.debugDraw) ai.debugDraw();
}

function winGame(){
    displayEndingText("You won!");
}

function loseGame(){
    displayEndingText("Game Over");
}

function displayEndingText(text){
    //Stop refreshing
    if(timerID){
        HTML.stopTimer(timerID);
        timerID = undefined;
    }

    //Show lose screen
    graphics.setTransparency(GameOverFadeTransparency);
    graphics.fillRect(0, 0, canvas.width, canvas.height, GameOverFadeColor);
    graphics.setTransparency(0);

    graphics.setTextAlignCenter();
    graphics.fillText(text, canvas.width/2, canvas.height/2, Math.floor(cellPixels * 0.18 * mapWidth) + "px Arial", GameOverTextColor);
    graphics.fillText("Press SPACE to continue", canvas.width/2, canvas.height*7/8, Math.floor(cellPixels * 0.05 * mapWidth) + "px Arial", GameOverTextColor);

    loseScreenDisplayed = true;
}

function randomApplePosition(){
    var randX = nextInt(0, mapWidth - 1);
    var randY = nextInt(0, mapHeight - 1);
    appleX = randX;
    appleY = randY;

    do{
        //Check for collisions with snake
        var collision = false;
        for(var i in trail){
            if(appleX == trail[i].x && appleY == trail[i].y){
                collision = true;
                break;
            }
        }
        if(appleX == posX && appleY == posY){
            collision = true;
        }

        if(collision){
            appleX++;
            if(appleX >= mapWidth){
                appleX = 0;
                appleY++;
                if(appleY >= mapHeight){
                    appleY = 0;
                }
            }
        }else{
            return;
        }
    }while(appleX != randX || appleY != randY);

    //Wow, you won?
    winGame();
}

function isSnakeColliding(){
    for(var i in trail){
        if(trail[i].x == posX && trail[i].y == posY){
            return true;
        }
    }
    return false;
}

function drawSnake(){
    var offsetX = Math.floor((cellPixels - snakePixels) / 2);
    var offsetY = Math.floor((cellPixels - snakePixels) / 2);
    
    var lastPos = trail[0];
    for(var i in trail){
        var segment = trail[i];

        var x1 = Math.min(segment.x, lastPos.x);
        var x2 = Math.max(segment.x, lastPos.x);
        var y1 = Math.min(segment.y, lastPos.y);
        var y2 = Math.max(segment.y, lastPos.y);
        cellX = cellPixels * segment.x;
        cellY = cellPixels * segment.y;

        graphics.fillRect(
            (x1 * cellPixels) + offsetX,
            (y1 * cellPixels) + offsetY,
            (x2 - x1) * cellPixels + snakePixels,
            (y2 - y1) * cellPixels + snakePixels,
            snakeColor
        );

        lastPos = segment;
    }

    var cellX = cellPixels * posX;
    var cellY = cellPixels * posY;
    var x = cellX + offsetX;
    var y = cellY + offsetY;

    //Draw a little face :)
    var eyeX1;
    var eyeX2;
    var eyeY1;
    var eyeY2;
    var mouthX;
    var mouthY;
    var mouthW;
    var mouthH;
    var mouthPixelsLength = Math.floor(mouthLength * cellPixels);
    var mouthPixelsWidth = Math.floor(mouthWidth * cellPixels);
    var mouthOffset = Math.floor((snakePixels / 2) - (mouthPixelsWidth / 2));
    if(velX == 1){
        eyeX1 = eyeX2 = 1-eyeHeight-eyeSize;
        eyeY1 = 0.5-eyeDistance-eyeSize;
        eyeY2 = 0.5+eyeDistance;
        mouthX = x + snakePixels;
        mouthY = y + mouthOffset;
        mouthW = mouthPixelsLength;
        mouthH = mouthPixelsWidth;
    }else if(velX == -1){
        eyeX1 = eyeX2 = eyeHeight;
        eyeY1 = 0.5-eyeDistance-eyeSize;
        eyeY2 = 0.5+eyeDistance;
        mouthX = x - mouthPixelsLength;
        mouthY = y + mouthOffset;
        mouthW = mouthPixelsLength;
        mouthH = mouthPixelsWidth;
    }else if(velY == 1){
        eyeX1 = 0.5-eyeDistance-eyeSize;
        eyeX2 = 0.5+eyeDistance;
        eyeY1 = eyeY2 = 1-eyeHeight-eyeSize;
        mouthX = x + mouthOffset;
        mouthY = y + snakePixels;
        mouthW = mouthPixelsWidth;
        mouthH = mouthPixelsLength;
    }else{
        eyeX1 = 0.5-eyeDistance-eyeSize;
        eyeX2 = 0.5+eyeDistance;
        eyeY1 = eyeY2 = eyeHeight;
        mouthX = x + mouthOffset;
        mouthY = y - mouthPixelsLength;
        mouthW = mouthPixelsWidth;
        mouthH = mouthPixelsLength;
    }

    //eye1
    graphics.fillRect(
        cellX + Math.floor(cellPixels * eyeX1),
        cellY + Math.floor(cellPixels * eyeY1),
        Math.floor(cellPixels * eyeSize),
        Math.floor(cellPixels * eyeSize),
        eyeColor
    );

    //eye2
    graphics.fillRect(
        cellX + Math.floor(cellPixels * eyeX2),
        cellY + Math.floor(cellPixels * eyeY2),
        Math.floor(cellPixels * eyeSize),
        Math.floor(cellPixels * eyeSize),
        eyeColor
    );

    //Mouth
    graphics.fillRect(
        mouthX,
        mouthY,
        mouthW,
        mouthH,
        mouthColor
    );
}

function drawApple(){
    var cellX = cellPixels * appleX;
    var cellY = cellPixels * appleY;

    graphics.fillRect(
        cellX + Math.floor((cellPixels - snakePixels) / 2),
        cellY + Math.floor((cellPixels - snakePixels) / 2),
        snakePixels,
        snakePixels,
        appleColor
    );
}

function manualInput(){
    inputX = keyX;
    inputY = keyY;
}

function keyDown(evt){
    switch(evt.keyCode){
        case Keys.A:
        case Keys.LeftArrow: 
            keyX=-1; keyY=0;
            break;
        case Keys.W:
        case Keys.UpArrow:
            keyX=0; keyY=-1;
            break;
        case Keys.D:
        case Keys.RightArrow: 
            keyX=1; keyY=0;
            break;
        case Keys.S:
        case Keys.DownArrow: 
            keyX=0; keyY=1;
            break;
        case Keys.Space:
            if(loseScreenDisplayed){
                gameReset();
            }
            break;
        default:
            break;
    }
}

function keyUp(evt){

}

Number.prototype.clamp = function clamp(min, max){
    return Math.min(max, Math.max(this, min));
}

//Returns a random number between min and max, inclusive
function nextInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function applySettingsClick() {
    gameReset();
}

initialize();
gameReset();
