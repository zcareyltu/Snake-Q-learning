const pathPixelSize = 4;
const pathColor = [82, 96, 255];

function HamiltonianCycleAI(){

}

function drawHamCycle(){
    if(hamPath && hamPath.length > 1){
        var lastPos = hamPath[hamPath.length - 1];
        for(var i in hamPath){
            var pos = hamPath[i];
            var x = Math.min(pos.x, lastPos.x);
            var y = Math.min(pos.y, lastPos.y);
            var w = Math.abs(pos.x - lastPos.x);
            var h = Math.abs(pos.y - lastPos.y);
            graphics.fillRect(
                (x * cellPixels) + (cellPixels / 2) - (pathPixelSize / 2),
                (y * cellPixels) + (cellPixels / 2) - (pathPixelSize / 2),
                (w * cellPixels) + pathPixelSize,
                (h * cellPixels) + pathPixelSize,
                pathColor
            );

            lastPos = pos;
        }
    }
}

var hamPath;
var hamGraph;

function initHamiltonian(){
    hamPath = [];
    hamGraph = [];
    var start = {
        x: 0,
        y: 0
    };
    hamPath.push(start);

    for(var y = 0; y < mapHeight; y++){
        var xArr = [];
        hamGraph.push(xArr);
        for(var x = 0; x < mapWidth; x++) {
            xArr.push(false);
        }
    }

    hamGraph[start.y][start.x] = true;
    if(!hamCycleUtil(start, 1)){
        console.log("A hamiltonian cycle does not exist!");
        loseGame();
    }else{
        //Convert graph back to something readable
        /*hamFoundPath = [];
        for(var i in hamPath){
            hamFoundPath.push(hamIntToPoint(hamPath[i]));
        }*/
    }
}

function hamCycleUtil(lastPos, index){
    //Base case: all vertices are found
    if(index == mapWidth*mapHeight){
        if(hamCycleGraphHasConnection(hamPath[0], hamPath[hamPath.length - 1])){
            return true;
        }else{
            return false;
        }
    }

    //Check all neighbors of the current point
    var connections = hamGetConnections(lastPos);
    for(var i in connections){
        var nextPos = connections[i];

        //Ensure the neighbor isn't already in our path
        if(!hamGraph[nextPos]){
            //Check if this neighbor will lead to a ham cycle solution
            hamPath[index] = nextPos;
            hamGraph[nextPos.y][nextPos.x] = true;
            if(hamCycleUtil(nextPos, index + 1)){
                return true;
            }else{
                //Solution could not be found with this neighbor, so remove from the list and try the next one
                hamGraph[nextPos.y][nextPos.x] = false;
            }
        }
    }

    return false;
}
/*
function hamIsPointInArray(array, point){
    for(var i in array){
        if(array[i].x == point.x && array[i].y == point.y){
            return true;
        }
    }
    return false;
}
*/
function hamGetConnections(pos){
    var connections = [];
    var left;
    var right;
    var up;
    var down;

    if(pos.y >= 1) up = {x: pos.x, y: pos.y - 1};
    if(pos.y < (mapHeight - 1)) down = {x: pos.x, y: pos.y + 1};

    if(pos.x >= 1) left = {x: pos.x - 1, y: pos.y};
    if(pos.x < (mapWidth - 1)) right = {x: pos.x + 1, y: pos.y};

    if(pos.y % 2 == 0){
        /*if(x == 1){ 
            if(down !== undefined) connections.push(down);
            if(right !== undefined) connections.push(right);
            if(up !== undefined) connections.push(up);
            if(left !== undefined) connections.push(left);
        }else*/ if(pos.x == 0){
            if(up !== undefined) connections.push(up);
            if(left !== undefined) connections.push(left);
            if(right !== undefined) connections.push(right);
            if(down !== undefined) connections.push(down);
        }else{
            if(right !== undefined) connections.push(right);
            if(down !== undefined) connections.push(down);
            if(up !== undefined) connections.push(up);
            if(left !== undefined) connections.push(left);
        }
        
    }else{
        if(pos.x == 1){
            if(down !== undefined) connections.push(down);
            if(left !== undefined) connections.push(left);
            if(up !== undefined) connections.push(up);
            if(right !== undefined) connections.push(right);
        }else if(pos.x == 0){
            if(up !== undefined) connections.push(up);
            if(left !== undefined) connections.push(left);
            if(right !== undefined) connections.push(right);
            if(down !== undefined) connections.push(down);
        }else{
            if(left !== undefined) connections.push(left);
            if(down !== undefined) connections.push(down);
            if(up !== undefined) connections.push(up);
            if(right !== undefined) connections.push(right);
        }
    }

    return connections;
}

function hamCycleGraphHasConnection(pos1, pos2){
    if(((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2) == 1){
        return true;
    }else{
        return false;
    }
}
