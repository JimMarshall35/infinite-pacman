/* 

AStar Implementation
Jim Marshall - 2020


pseudocode

// A* (star) Pathfinding

// Initialize both open and closed list
let the openList equal empty list of nodes
let the closedList equal empty list of nodes

// Add the start node
put the startNode on the openList (leave it's f at zero)

// Loop until you find the end
while the openList is not empty    

    // Get the current node
    let the currentNode equal the node with the least f value
    remove the currentNode from the openList
    add the currentNode to the closedList   

    // Found the goal
    if currentNode is the goal
        Congratz! You've found the end! Backtrack to get path    

    // Generate children
    let the children of the currentNode equal the adjacent nodes
    
    for each child in the children        
        // Child is on the closedList
        if child is in the closedList
            continue to beginning of for loop       

        // Create the f, g, and h values
        child.g = currentNode.g + distance between child and current
        child.h = distance from child to end
        child.f = child.g + child.h        

        // Child is already in openList
        if child.position is in the openList's nodes positions
            if the child.g is higher than the openList node's g
                continue to beginning of for loop        

        // Add the child to the openList
        add the child to the openList
*/

function initAStar(grid){
    for(let row=0; row<grid.length; row++){
        let thisrow = grid[row];
        for(let col=0; col<thisrow.length; col++){
            let cell = thisrow[col];
            cell.g = 0;
            cell.f = 0;
            cell.h = 0;
            cell.parent = null;
        }
    }
}
function searchAstar(grid,start,end){
    function returnPath(endn){
        let node = endn;
        let rlist = [];
        rlist.push(node);
        while(node !== null){
            rlist.push(node);
            node = node.parent;
        }
        if(rlist.length > 0){
            return rlist.reverse();
        }
        else{
            return [];
        }
    }
    function getNeighbours(cell){ 
        /*
        Neighbours, everybody needs good neighbours
        With a little understanding, you can find the perfect blend
        Neighbours, should be there for one another
        That's when good neighbours become good friends
        */
        let neighbours = [];
        let ncell;
        if(!cell.walls.top){
            ncell = cell.getAdjacent(0,-1)
            if(!ncell.containsbomb && !ncell.containsblast){
                neighbours.push(ncell);
            }
        }
        if(!cell.walls.bottom){s
            
            ncell = cell.getAdjacent(0,1);
            if(!ncell.containsbomb && !ncell.containsblast){
                neighbours.push(ncell);
            }
        }
        if(!cell.walls.left){
            ncell = cell.getAdjacent(-1,0);
            if(!ncell.containsbomb && !ncell.containsblast){
                neighbours.push(ncell);
            }
        }
        if(!cell.walls.right){
            ncell = cell.getAdjacent(1,0);
            if(!ncell.containsbomb && !ncell.containsblast){
                neighbours.push(ncell);
            }
        }
        return neighbours;
    }
    let openList = [];
    let closedList = [];
    let childrentoadd = [];
    openList.push(start);
    let currentNode = null;
    while(openList.length > 0){
        let lowest = Number.POSITIVE_INFINITY;
        for(let i=0; i<openList.length; i++){
            let node = openList[i];
            if(node.f < lowest){
                lowest = node.f;
                currentNode = node;
            }
        }
        for(let i=0; i<openList.length; i++){
            if(openList[i] == currentNode){
                openList.splice(i,1);
            }
        }
        closedList.push(currentNode);
        if(currentNode == end){
            break;
        }
        let children = getNeighbours(currentNode);
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if(closedList.includes(child)){
                continue;
            }
            child.parent = currentNode;
            child.g = currentNode.g + maze.cellsize;
            child.h = getDistance(child,end);
            child.f = child.g + child.h;
            let continue_ = false;
            for (let j = 0; j < openList.length; j++) {
                if(openList[j].xpos == child.xpos && openList[j].ypos == child.ypos){
                    if(child.g > openList[j].g){
                        continue_ = true;
                        break;
                    }
                }
            }
            if(continue_){
                continue;
            }           
            openList.push(child);
        }
        
    }
    return returnPath(end);
}
function getDistance(n1, n2){
    let x1 = n1.xpos;
    let y1 = n1.ypos

    let x2 = n2.xpos;
    let y2 = n2.ypos

    return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
}