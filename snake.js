const cellSize = 7;
const snakeSize = 5;

const bgColor1 = [167, 217, 72];
const bgColor2 = [142, 204, 57];
const snakeColor = [74, 117, 44];
const appleColor = [231, 71, 29];

//User input variables
var aiType;
var mapWidth;
var mapHeight;

//Program variables
var cellPixels;
var snakePixels;
var bgCanvas;
var graphics;

function initialize(){
    loadUserVariables();

    var sizeModifier = Math.ceil(600 / (cellSize * mapWidth));
    cellPixels = cellSize * sizeModifier;
    snakePixels = cellSize * sizeModifier;

    var canvas = document.getElementById("canvas");
    canvas.width = cellPixels * mapWidth;
    canvas.height = cellPixels * mapHeight;
    graphics = HTML.getGraphics(canvas); 

    drawBG(); //Pass canvas to copy size
    graphics.copyImage(bgCanvas); 
    //document.addEventListener("keydown", keyPush);
    //setInterval(game, 1000/15);
}

function loadUserVariables(){
    aiType = HTML.getListValue("aiType", "manual");
    mapWidth = mapHeight = HTML.getNumberValue("mapSize", 10);
}

function drawBG(){
    bgCanvas = document.createElement("canvas");
    bgCanvas.width = cellPixels * mapWidth;
    bgCanvas.height = cellPixels * mapHeight;
    var g = HTML.getGraphics(canvas);

    g.fill(bgColor2);
    for(var y = 0; y < mapHeight; y++){
        for(var x = y % 2; x < mapWidth; x+=2){
            g.fillRect(x*cellPixels, y*cellPixels, cellPixels, cellPixels, bgColor1);
        }
    }
}

function keyPush(evt){
    switch(evt.keyCode){
        case 37: //left arrow
            xv=-1; yv=0;
            break;
        case 38: //up arrow
            xv=0; yv=-1;
            break;
        case 39: //right arrow
            xv=1; yv=0;
            break;
        case 40: //down arrow
            xv=0; yv=1;
            break;
    }
}

function applySettingsClick() {
    initialize();
}

initialize();

/*
    px=py=10;
    gs=tc=20;
    ax=ay=15;
    xv = yv = 0;
    trail=[];
    tail =5;
    function game() {
        px+=xv;
        py+=yv;
        if(px<0){
            px=tc-1;
        }
        if(px>tc-1){
            px=0;
        }
        if(py<0){
            py=tc-1;
        }
        if(py>tc-1){
            py=0;
        }
        ctx.fillStyle="black";
        ctx.fillRect(0,0,canv.width,canv.height);

        ctx.fillStyle="lime";
        for(var i=0; i<trail.length;i++){
            ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
            if(trail[i].x==px && trail[i].y==py){
                tail=5;
            }
        }
        trail.push({x:px, y:py});
        while(trail.length>tail){
            trail.shift();
        }

        if(ax==px && ay==py){
                tail++;
                ax=Math.floor(Math.random()*tc);
                ay=Math.floor(Math.random()*tc);
            }

        ctx.fillStyle="red";
        ctx.fillRect(ax*gs,ay*gs,gs-2,gs-2);
    }
*/