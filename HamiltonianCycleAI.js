const pathPixelSize = 4;
const pathColor = [82, 96, 255];

function HamiltonianCycleAI(){

}

function drawHamCycle(){
    if(hamFoundPath && hamFoundPath.length > 1){
        var lastPos = hamFoundPath[hamFoundPath.length - 1];
        for(var i in hamFoundPath){
            var pos = hamFoundPath[i];
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

var hamFoundPath;
var hamPath;
var hamGraph;

function initHamiltonian(){
    hamPath = [];
    hamGraph = [];
    var start = {
        x: 0,
        y: 0
    };
    hamPath.push(hamPointToInt(start));

    for(var i = 0; i < (mapWidth * mapHeight); i++){
        hamGraph.push(false);
    }

    hamGraph[hamPointToInt(start)] = true;
    if(!hamCycleUtil(hamPointToInt(start), 1)){
        console.log("A hamiltonian cycle does not exist!");
        loseGame();
    }else{
        //Convert graph back to something readable
        hamFoundPath = [];
        for(var i in hamPath){
            hamFoundPath.push(hamIntToPoint(hamPath[i]));
        }
    }
}

function hamPointToInt(point){
    return point.y * mapWidth + point.x;
}

function hamIntToPoint(id){
    var yPos = Math.floor(id / mapHeight);
    return {
        x: id - (yPos * mapHeight),
        y: yPos
    };
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
            hamGraph[nextPos] = true;
            if(hamCycleUtil(nextPos, index + 1)){
                return true;
            }else{
                //Solution could not be found with this neighbor, so remove from the list and try the next one
                hamGraph[nextPos] = false;
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

    if(pos >= mapWidth) up = pos - mapWidth;

    var temp = pos + mapWidth;
    if(temp < (mapWidth*mapHeight)) down = temp;

    temp = pos % mapWidth;
    if(temp > 0) left = pos - 1;

    if(temp < mapWidth - 1) right = pos + 1;

    var x = pos % mapWidth;
    if(Math.floor(pos / mapWidth) % 2 == 0){
        /*if(x == 1){ 
            if(down !== undefined) connections.push(down);
            if(right !== undefined) connections.push(right);
            if(up !== undefined) connections.push(up);
            if(left !== undefined) connections.push(left);
        }else*/ if(x == 0){
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
        if(x == 1){
            if(down !== undefined) connections.push(down);
            if(left !== undefined) connections.push(left);
            if(up !== undefined) connections.push(up);
            if(right !== undefined) connections.push(right);
        }else if(x == 0){
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
    if((pos1 - mapHeight == pos2) || (pos1 + mapHeight == pos2)){
        return true;
    } else if(Math.floor(pos1 / mapWidth) == Math.floor(pos2 / mapWidth)){
        if((pos1 - 1 == pos2) || (pos1 + 1 == pos2)) return true;
    } 

    return false;
}
