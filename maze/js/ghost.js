class Ghost extends Moves{
	constructor(cell, colour, pathgenfunction, steps, masterlist, cell2UpdateCallback=null){
		super(300,assetloader.files.mainsheet);
		this.srects = {
			/* Red ghost */
			red : {
				r : [
					{x:4+(0*16),y:65,w:14,h:14},
					{x:4+(1*16),y:65,w:14,h:14}
				],
				l : [
					{x:4+(2*16),y:65,w:14,h:14},
					{x:4+(3*16),y:65,w:14,h:14}
				],
				u : [
					{x:4+(4*16),y:65,w:14,h:14},
					{x:4+(5*16),y:65,w:14,h:14}
				],
				d : [
					{x:4+(6*16),y:65,w:14,h:14},
					{x:4+(7*16),y:65,w:14,h:14}
				]
			},	
			/* Pink ghost */
			pink : {
				r : [
					{x:4+(0*16),y:65+(1*16),w:14,h:14},
					{x:4+(1*16),y:65+(1*16),w:14,h:14}
				],
				l : [
					{x:4+(2*16),y:65+(1*16),w:14,h:14},
					{x:4+(3*16),y:65+(1*16),w:14,h:14}
				],
				u : [
					{x:4+(4*16),y:65+(1*16),w:14,h:14},
					{x:4+(5*16),y:65+(1*16),w:14,h:14}
				],
				d : [
					{x:4+(6*16),y:65+(1*16),w:14,h:14},
					{x:4+(7*16),y:65+(1*16),w:14,h:14}
				]
			},		
			/* Blue ghost */
			blue : {
				r : [
					{x:4+(0*16),y:65+(2*16),w:14,h:14},
					{x:4+(1*16),y:65+(2*16),w:14,h:14}
				],
				l : [
					{x:4+(2*16),y:65+(2*16),w:14,h:14},
					{x:4+(3*16),y:65+(2*16),w:14,h:14}
				],
				u : [
					{x:4+(4*16),y:65+(2*16),w:14,h:14},
					{x:4+(5*16),y:65+(2*16),w:14,h:14}
				],
				d : [
					{x:4+(6*16),y:65+(2*16),w:14,h:14},
					{x:4+(7*16),y:65+(2*16),w:14,h:14}
				]
			},			
			/* Orange ghost */
			orange : {
				r : [
					{x:4+(0*16),y:65+(2*16),w:14,h:14},
					{x:4+(1*16),y:65+(2*16),w:14,h:14}
				],
				l : [
					{x:4+(2*16),y:65+(2*16),w:14,h:14},
					{x:4+(3*16),y:65+(2*16),w:14,h:14}
				],
				u : [
					{x:4+(4*16),y:65+(2*16),w:14,h:14},
					{x:4+(5*16),y:65+(2*16),w:14,h:14}
				],
				d : [
					{x:4+(6*16),y:65+(2*16),w:14,h:14},
					{x:4+(7*16),y:65+(2*16),w:14,h:14}
				]
			},			
			/* Eyes */
			eyes_r : {x:4+(8*16),y:65+(1*16),w:14,h:14},
			eyes_l : {x:4+(9*16),y:65+(1*16),w:14,h:14},
			eyes_u : {x:4+(10*16),y:65+(1*16),w:14,h:14},
			eyes_d : {x:4+(11*16),y:65+(1*16),w:14,h:14},
			/* Dead ghost */
			dead : [
				{x:4+(8*16),y:65,w:14,h:14},
				{x:4+(9*16),y:65,w:14,h:14},
				{x:4+(10*16),y:65,w:14,h:14},
				{x:4+(11*16),y:65,w:14,h:14}
			]
		}
		this.movecount = 0;
		this.masterlist = masterlist;
		this.upanim = this.srects[colour].u;
		this.downanim = this.srects[colour].d;
		this.leftanim = this.srects[colour].l;
		this.rightanim = this.srects[colour].r;
		this.currentanim = this.rightanim;
		this.currentsprite = this.currentanim[0];
		this.cell1 = cell;
		this.steps = steps;
		this.pathgenfunction = pathgenfunction;
		this.path = pathgenfunction(this);

		this.pathindex = 0;
		this.pathincr = 1;
		
		this.updateCell2();
		this.dead = false;
		this.dietime = 1000;
		this.cell2UpdateCallback = cell2UpdateCallback;
	}
	die(){
		switch(this.currentdir){
			case directions.up:
				this.currentsprite = this.srects.eyes_u;
				break;
			case directions.down:
				this.currentsprite = this.srects.eyes_d;
				break;
			case directions.left:
				this.currentsprite = this.srects.eyes_l;
				break;
			case directions.right:
				this.currentsprite = this.srects.eyes_r;
				break;
		}
		this.dead = true;
		this.timer = 0;
	}
	update(delta){
		this.timer += delta;
		if(!this.dead){
			let t = this.timer/this.speed;
			if(t >= 1){
				t = 1;
				this.timer = 0;
				this.cell1.containsghost = false;
				this.cell2.containsghost = true;
				this.cell1 = this.cell2;
				this.currentsprite = this.currentanim[Math.round(t*(this.currentanim.length-1))];
				super.lerpPosition(t);
				this.updateCell2();
			}
			else {
				this.currentsprite = this.currentanim[Math.round(t*(this.currentanim.length-1))];
				super.lerpPosition(t);
			}
			if(this.pos.x + maze.cellsize<0){
				this.delete();
			}
			if(this.cell2 && this.cell1){
			    if(t<0.5){
			        if(this.cell1.containsblast){ //|| this.cell1.containsblast){
					    this.die();
				    }
			    }
			    else{
			        if(this.cell2.containsblast){ //|| this.cell1.containsblast){
					    this.die();
				    }
			    }
			}
			
		}
		else{
			this.pos.x = this.cell2.xpos;
			this.pos.y = this.cell2.ypos;
			if(this.timer >= this.dietime){
				this.delete();
			}
		}
		
	}
	draw(){
		super.drawSelf();
	}
	updateCell2(){
		
		this.pathindex += this.pathincr;
		if(this.cell2UpdateCallback != null){
			this.cell2UpdateCallback();
		}
		if(this.pathindex > (this.path.length-1) || this.pathindex < 0){
			this.pathincr *= -1;
			this.pathindex += this.pathincr;
		}
		if(this.path[this.pathindex].containsbomb){
			this.pathincr *= -1;
			this.pathindex += this.pathincr;
		}
		this.cell2 = this.path[this.pathindex];
		if(this.cell1.getAdjacent(0,-1) == this.cell2){
			super.setdir(directions.up);
		}
		else if(this.cell1.getAdjacent(0,1) == this.cell2){
			super.setdir(directions.down);
		}
		else if(this.cell1.getAdjacent(-1,0) == this.cell2){
			super.setdir(directions.left);
		}
		else if(this.cell1.getAdjacent(1,0) == this.cell2){
			super.setdir(directions.right);
		}
		this.movecount++;
		if(this.movecount > 5){
			let newpath = this.pathgenfunction(this);
			if(newpath.length > 2){
				this.path = newpath;
				this.pathindex = 0;
				this.pathincr = 1;
				
			}
			this.movecount = 0;
		}
	}
	delete(){
		this.cell1.containsghost = false;
		this.cell2.containsghost = false;
		for (let i = 0; i < this.masterlist.length; i++) {
			if(this.masterlist[i] == this){
				this.masterlist.splice(i, 1);
			}
		}
	}
}
var ghostspawner = {
	list : [],
	spawnRedGhost : function(cell){
		this.list.push(new Ghost(cell, "red", AStar, 10, this.list));//, cell,pacman.cell2));
		
	},
	spawnBlueGhost : function(cell){
		this.list.push(new Ghost(cell, "blue", getRandomPath, 10, this.list));//, cell,pacman.cell2));
	},
	update : function(delta){
		for (var i = this.list.length - 1; i >= 0; i--) {
			this.list[i].update(delta);
		}
	},
	draw : function(){
		for (var i = this.list.length - 1; i >= 0; i--) {
			this.list[i].draw();
		}
	},
	deleteAll : function(){
		this.list = [];
	},
	spawnInitialGhosts : function(numred, cellslist){
		let rows = cellslist.length - 1;
		let cols = cellslist[0].length - 1;
		for (var i = 0; i < numred; i++) {
			let xind = Math.round(Math.random()*cols);
			let yind = Math.round(Math.random()*rows);
			let cell = cellslist[yind][xind];
			this.spawnBlueGhost(cell);
			this.spawnRedGhost(cell);
		}
		for (var i = 0; i < this.list.length; i++) {
			console.log(this.list[i]);

		}
		this.fixGhosts();
	},
	spawnOnExtend : function(numred, cellslist){
		let rows = cellslist.length;
		let cols = maze.cols;
		for (var i = 0; i < numred; i++) {
			let xind = cols + Math.round(Math.random()*cols);
			let yind = Math.floor(Math.random()*rows);
			let cell = cellslist[yind][xind];
			this.spawnBlueGhost(cell);
			this.spawnRedGhost(cell);
		}
		this.fixGhostsOnExtend();
	},
	fixGhosts : function(){
		let ghosts2delete = [];
		for (var i = 0; i < this.list.length; i++) {
			let ghost = this.list[i];
			if(ghost.path.length == 1){
				ghosts2delete.push(ghost);
				continue;
			}
			if(getDistance(pacman.cell1, ghost.cell1) <60){
				ghosts2delete.push(ghost);
			}

		}
		if(ghosts2delete.length > 0){
			for (var i = 0; i < ghosts2delete.length; i++) {
				ghosts2delete[i].delete();
				let cellslist = maze.cellsmaster;
				let rows = cellslist.length - 1;
				let cols = cellslist[0].length - 1;
				let xind = Math.round(Math.random()*cols);
				let yind = Math.round(Math.random()*rows);
				let cell = cellslist[yind][xind];
				this.spawnRedGhost(cell);
			}
			this.fixGhosts();
		}
		
	},
	fixGhostsOnExtend : function(){
		let ghosts2delete = [];
		for (var i = 0; i < this.list.length; i++) {
			let ghost = this.list[i];
			if(ghost.path.length == 1){
				ghosts2delete.push(ghost);
				continue;
			}
			if(getDistance(pacman.cell1, ghost.cell1) <60){
				ghosts2delete.push(ghost);
			}

		}
		if(ghosts2delete.length > 0){
			let cellslist = maze.cellsmaster;
			let rows = cellslist.length;
			let cols = maze.cols;
			for (var i = 0; i < ghosts2delete.length; i++) {
				ghosts2delete[i].delete();
				let xind = cols + Math.round(Math.random()*cols);
				let yind = Math.floor(Math.random()*rows);
				let cell = cellslist[yind][xind];
				this.spawnRedGhost(cell);
			}
			this.fixGhostsOnExtend();
		}
		
	}
}
function getRandomPath(instance){
	let cell = instance.cell1;
	let steps = instance.steps;
	function isInList(item,list){
		for (var i = 0; i < list.length; i++) {
			if(list[i] == item){
				return true;
			}
		}
		return false;
	}
	let returnlist = [];
	let visited = [];
	let current = cell;
	let next;
	for (var i = 0; i < steps; i++) {
		visited.push(current);
		if(isInList(current,visited)){
			returnlist.push(current);
		}
		
		if(!current.walls.top){
			next = current.getAdjacent(0,-1);
			if(next != null && !isInList(next,visited)){
				current = next;
				continue;
			}
		}
		if(!current.walls.bottom ){
			next = current.getAdjacent(0,1);
			if(next != null && !isInList(next,visited)){
				current = next;
				continue;
			}
		}
		if(!current.walls.left){
			next = current.getAdjacent(-1,0);
			if(next != null && !isInList(next,visited)){
				current = next;
				continue;
			}
		}
		if(!current.walls.right){
			next = current.getAdjacent(1,0);
			if(next != null && !isInList(next,visited)){
				current = next;
				continue;
			}
		}
	}
	return returnlist;
}
function AStar(instance){
    let t = instance.timer/instance.speed;
    let start;
    if(t<0.5){
        start = instance.cell1;
    }
    else{
        start = instance.cell2;
    }
	let finish = pacman.cell1;
	initAStar(maze.cellsmaster);
	return searchAstar(maze.cellsmaster, start, finish);
	
}