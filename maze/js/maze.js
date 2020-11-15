

class Cell{

	constructor(xind,yind,xpos,ypos){
		this.xind = xind;
		this.yind = yind;
		this.xpos = xpos;
		this.ypos = ypos;
		this.walls = {top : true, bottom : true, left : true, right : true};
		this.visited = false;
		this.containsblast = false;
		this.containsbomb = false;
		this.containsghost = false;
		this.scrollspeed = 12;

		
	}
	draw(ctx){
		if(this.walls.top){
			ctx.moveTo(this.xpos, this.ypos);
			ctx.lineTo(this.xpos + maze.cellsize, this.ypos);
		}
		if(this.walls.bottom){
			ctx.moveTo(this.xpos, this.ypos + maze.cellsize);
			ctx.lineTo(this.xpos + maze.cellsize, this.ypos + maze.cellsize);
		}
		if(this.walls.left){
			ctx.moveTo(this.xpos, this.ypos);
			ctx.lineTo(this.xpos, this.ypos+ maze.cellsize);
		}
		if(this.walls.right){
			ctx.moveTo(this.xpos + maze.cellsize, this.ypos );
			ctx.lineTo(this.xpos + maze.cellsize, this.ypos + maze.cellsize);
		}
	}
	scroll(delta){
		this.xpos -= delta * this.scrollspeed;
		if(this.xpos + maze.cellsize < 0){
			maze.cellsmaster[this.yind].shift();
			maze.cellsmaster[this.yind][0].walls.left = true;
			console.log(maze.cellsmaster[0].length);
		}
	}
	getAdjacent(x,y){
		for (var i = 0; i < maze.cellsmaster.length; i++) {
			let row = maze.cellsmaster[i];
			for (var j = 0; j < row.length; j++) {
				let cell = row[j];
				if(cell.xind == this.xind+x && cell.yind == this.yind+y){
					return cell;
				}
			}
		}
		return null;
	}
}
var maze = {
	visited : 0,
	rows : 20,
	cols : 40,
	totalcols : 80,
	totalcells : 0,
	cellsize : 20,
	margin : 20,
	stack : [],
	cellsmaster : [],
	ctx : null,
	c : null,
	bgcolour : "blue",
	linecolour : "white",
	nodestotest : [],
	path : null,
	last : null,
	totalscroll : 0,
	timesextended : 0,
	isscrolling : false,
	//Astargraph : null,
	reset : function(){
		this.totalscroll = 0;
		this.timesextended = 0;
		this.cellsmaster = [];
		this.isscrolling = false;
		this.initializeCells();
		this.makeMaze();
		ui.waitingtostart = true;
		pacman.reset();
		ghostspawner.deleteAll();
		//this.startScroll();
		//this.Astargraph = this.returnAstarGraph();
	},
	startScroll : function(){
		this.isscrolling = true;
		pacman.init(maze.cellsmaster[5][20], assetloader.files.mainsheet);
		ghostspawner.spawnInitialGhosts(5,this.cellsmaster);

	},
	
	initializeCanvas : function(){
		this.c = document.createElement("CANVAS");
		this.c.width = (this.cols * this.cellsize);
		this.c.height = (this.rows * this.cellsize) + this.margin *2;
		this.c.style.marginLeft = ((window.innerWidth/2) - (this.c.width/2)).toString() + "px";
		this.c.style.marginTop = ((window.innerHeight/2) - (this.c.height/2)).toString() + "px";
		document.body.appendChild(this.c);
		this.ctx = this.c.getContext("2d");
	},
	initializeCells : function() {
		for (var row = 0; row < this.rows; row++) {
			this.cellsmaster.push([]);
			for (var col = 0; col<this.totalcols ; col++) {
				let cell = new Cell(col,row,col*this.cellsize, row*this.cellsize + this.margin);
				this.cellsmaster[this.cellsmaster.length-1].push(cell);
				this.totalcells++;
			}
		}
		this.stack.push(this.cellsmaster[0][0]);
		this.cellsmaster[0][0].visited = true;
		this.visited++;
	},
	update : function(delta){
		delta /= 1000;
		if(this.isscrolling){
			for(let i=0; i<this.cellsmaster.length; i++){
				for(let j=0; j<this.cellsmaster[i].length; j++){
					let cell = this.cellsmaster[i][j];
					cell.scroll(delta);
				}
			}
			this.totalscroll += delta*this.cellsmaster[0][0].scrollspeed;
			//console.log(this.cellsmaster[0].length);
			if(this.totalscroll >= this.cellsize * this.cols){
				this.totalscroll = 0;
				this.timesextended++;
				this.extendMaze();
			}
		}
		
	},
	extendMaze : function(){
		let startcell;
		let startx = this.cellsmaster[0][0].xpos;
		function breakEndWalls(){
			for(let row=0; row < maze.cellsmaster.length; row++){
				let r = Math.round(Math.random());
				let endcell = maze.cellsmaster[row][maze.cellsmaster[row].length-1];
				if(r == 1){
					endcell.walls.right = false;
				}
			}
		}
		function setXinds(){
			for(let row=0; row < maze.cellsmaster.length; row++){
				for(let col=0; col<maze.cellsmaster[row].length; col++){
					maze.cellsmaster[row][col].xind =col;
				}
			}
		}
		breakEndWalls();
		for(let row=0; row < this.cellsmaster.length; row++){
			let x = this.cellsmaster[row][this.cellsmaster[row].length-1].xpos + this.cellsize;
			for(let col=0; col < this.cols; col++){
				let thisrow = this.cellsmaster[row];
				let xind = thisrow[thisrow.length-1].xind + 1;
				let cell = new Cell(xind,row,x, row*this.cellsize + this.margin);
				x += this.cellsize;
				if(thisrow[thisrow.length-1].walls.right == false){
					cell.walls.left = false;
				}
				if(row == 0 && col == 0){
					startcell = cell;
				}
				thisrow.push(cell);
				this.totalcells++;
			}
		}
		this.stack = [];
		this.stack.push(startcell);
		startcell.visited = true;
		this.visited++;
		setXinds();
		this.makeMaze();
		for(let i=0; i<this.cellsmaster.length; i++){
			this.cellsmaster[i][this.cellsmaster[i].length-1].walls.right = true;
		}
		ghostspawner.spawnOnExtend(5,this.cellsmaster)
	},
	draw : function(){
		this.ctx.clearRect(0,0,this.c.width, this.c.height);
		this.ctx.fillStyle = this.bgcolour;
		this.ctx.fillRect(0,0,this.c.width, this.c.height);
		this.ctx.strokeStyle = this.linecolour;
		this.ctx.beginPath();
		for (var i = 0; i < this.cellsmaster.length; i++) {
			let row = this.cellsmaster[i];
			for (var j = 0; j < row.length; j++) {
				let cell = row[j];
				cell.draw(this.ctx);
			}
		}
		this.ctx.stroke();
	},
	makeMaze : function(){
		function getRandomNeighbour(neighbours){
		    let total = 0;
		    for(let i=0; i<neighbours.length; i++){
		        let neighbour = neighbours[i];
		        total += neighbour.probability;
		        
		    }
		    let r = Math.random()*total;
		    let total2 = 0;
		    for(let i=0; i<neighbours.length; i++){
		        let neighbour = neighbours[i];
		        total2 += neighbour.probability;
		        if(total2 > r){
		            return neighbour.cell;
		        }
		    }
		}
		function deleteWalls(c1, c2) {
			if(c1.xind == c2.xind + 1){
				c1.walls.left = false;
				c2.walls.right = false;
			}
			if(c1.xind == c2.xind - 1){
				c1.walls.right = false;
				c2.walls.left = false;
			}
			if(c1.yind == c2.yind + 1){
				c1.walls.top = false;
				c2.walls.bottom = false;
			}
			if(c1.yind == c2.yind - 1){
				c1.walls.bottom = false;
				c2.walls.top = false;
			}
		}
		let cell = this.stack[this.stack.length-1];
		let neighbours = [];
		let potentialneighbour;
		if(cell.xind > 0){
			potentialneighbour = this.cellsmaster[cell.yind][cell.xind -1];
			if(!potentialneighbour.visited){
				neighbours.push({cell: potentialneighbour, probability : 4});
			}
		}
		if(cell.xind < this.cellsmaster[0].length-1){
			potentialneighbour = this.cellsmaster[cell.yind][cell.xind +1];
			if(!potentialneighbour.visited){
				neighbours.push({cell: potentialneighbour, probability : 4});
			}
		}
		if(cell.yind > 0){
			potentialneighbour = this.cellsmaster[cell.yind -1][cell.xind];
			if(!potentialneighbour.visited){
				neighbours.push({cell: potentialneighbour, probability : 1});
			}
		}
		if(cell.yind < this.rows -1){
			potentialneighbour = this.cellsmaster[cell.yind +1][cell.xind];
			if(!potentialneighbour.visited){
				neighbours.push({cell: potentialneighbour, probability : 1});
			}
		}
		if(neighbours.length > 0){
			//let ri = Math.floor(Math.random()*neighbours.length);
			//this.stack.push(neighbours[ri]);
			let chosenneighbour = getRandomNeighbour(neighbours);
			this.stack.push(chosenneighbour);
			chosenneighbour.visited = true;
			deleteWalls(chosenneighbour, cell);
			this.visited++;
			if(this.visited< this.totalcells){
				this.makeMaze();
			}
		}
		else{
			this.stack.pop();
			this.makeMaze();
		}
	},
	getDistance : function(n1, n2){
		let x1 = n1.xpos;
		let y1 = n1.ypos

		let x2 = n2.xpos;
		let y2 = n2.ypos

		return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
	}
}
function getAdjacent(cell, x, y){
	for (var i = 0; i < maze.cellsmaster.length; i++) {
			let row = maze.cellsmaster[i];
			for (var j = 0; j < row.length; j++) {
				let cell2 = row[j];
				if(cell2.xind == cell.xind+x && cell.yind == cell.yind+y){
					return cell;
				}
			}
		}
		return null;
}
