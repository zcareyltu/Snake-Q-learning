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
                (x * cellPixels) + (cellPixels / 2) - (w * pathPixelSize / 2),
                (y * cellPixels) + (cellPixels / 2) - (h * pathPixelSize / 2),
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
        x: posX,
        y: posY
    };
    hamPath.push(start);
    
    for(var y = 0; y < mapHeight; y++){
        hamGraph.push([]);
        for(var x = 0; x < mapWidth; x++){
            hamGraph[y].push(false);
        }
    }

    hamGraph[posY][posX] = true;
    if(!hamCycleUtil(start)){
        console.log("A hamiltonian cycle does not exist!");
        loseGame();
    }

}

function hamCycleUtil(lastPos){
    //Base case: all vertices are found
    if(hamPath.length == mapWidth*mapHeight){
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
        if(!hamGraph[nextPos.y][nextPos.x]){
            //Check if this neighbor will lead to a ham cycle solution
            hamPath.push(nextPos);
            hamGraph[nextPos.y][nextPos.x] = true;
            if(hamCycleUtil(nextPos)){
                return true;
            }else{
                //Solution could not be found with this neighbor, so remove from the list and try the next one
                hamPath.pop();
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
    if(pos.x > 0){
        connections.push({
            x: pos.x - 1,
            y: pos.y
        });
    }
    if(pos.x < mapWidth - 1){
        connections.push({
            x: pos.x + 1,
            y: pos.y
        });
    }
    if(pos.y > 0){
        connections.push({
            x: pos.x,
            y: pos.y - 1
        });
    }
    if(pos.y < mapHeight - 1){
        connections.push({
            x: pos.x,
            y: pos.y + 1
        });
    }

    return connections;
}

function hamCycleGraphHasConnection(pos1, pos2){
    return ((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2) == 1;
}

/*
//util function for getting the first element in an array
if(!Array.prototype.first){
    Array.prototype.first = function(){
        return this[0];
    };
};

//util function for getting the last element in an array
if(!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};
*/