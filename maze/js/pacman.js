var directions = {
	up : 0,
	down : 1,
	left : 2,
	right : 3
}
class Drawable{
	constructor(img){
		this.img = img;
		this.currentsprite = null;
		this.pos = {x:null,y:null};
	}
	drawSelf(){
		if(this.currentsprite != null){
			maze.ctx.drawImage(this.img, 
					   this.currentsprite.x,
					   this.currentsprite.y,
					   this.currentsprite.w,
					   this.currentsprite.h,
					   this.pos.x,
					   this.pos.y,
					   maze.cellsize,
					   maze.cellsize);

			
		}
		
	}
}
class Moves extends Drawable{
	constructor(speed, img){
		super(img);
		this.cell1 = null;
		this.cell2 = null;
		
		this.timer = 0;
		this.speed = speed;
		this.currentanim = null;
		
		this.currentdir = null;
		this.moving = true;
		this.leftanim = [];
		this.rightanim = [];
		this.upanim = [];
		this.downanim = [];
		//this.img = img;
	}
	lerpPosition(t){
		if(this.cell1 && this.cell2){
			this.pos.x = this.cell1.xpos * (1 - t) + this.cell2.xpos*t;
			this.pos.y = this.cell1.ypos * (1 - t) + this.cell2.ypos*t;
		}	
	}
	setdir(dir){
		this.currentdir = dir;
		switch(dir){
			case directions.up:
				this.currentanim = this.upanim;
				break;
			case directions.down:
				this.currentanim = this.downanim;
				break;
			case directions.left:
				this.currentanim = this.leftanim;
				break;
			case directions.right:
				this.currentanim = this.rightanim;
				break;
		}
	}
	drawSelf(){
		super.drawSelf();
	}
	
}
class PacMan extends Moves{
	constructor(){
		super(300,assetloader.files.mainsheet);
		this.spriterects = {};
		this.dieanim = [];
		
		this.bombs = [];
		this.dead = false;
		this.dietime = 2000;
	}
	init(cell, img){
		this.initspriterects();
		this.currentsprite = this.spriterects.ropen;
		this.currentdir = directions.right;

		this.putInCell(cell);
		this.last = new Date().getTime();
	}
	initspriterects(){
		this.spriterects.fullyclosed = {x:36,y:1,w:13,h:13};

		this.spriterects.lopen = {x:4,y:17,w:13,h:13};
		this.spriterects.lclosed = {x:20,y:17,w:13,h:13};

		this.spriterects.ropen = {x:4,y:1,w:13,h:13};
		this.spriterects.rclosed = {x:20,y:1,w:13,h:13};

		this.spriterects.uopen = {x:4,y:33,w:13,h:13};
		this.spriterects.uclosed = {x:20,y:33,w:13,h:13};

		this.spriterects.dopen = {x:4,y:49,w:13,h:13};
		this.spriterects.dclosed = {x:20,y:49,w:13,h:13};

		this.leftanim = [this.spriterects.lopen,
						 this.spriterects.lclosed,
						 this.spriterects.fullyclosed,
						 this.spriterects.lclosed,
						 this.spriterects.lopen];

		this.rightanim = [this.spriterects.ropen,
						 this.spriterects.rclosed,
						 this.spriterects.fullyclosed,
						 this.spriterects.rclosed,
						 this.spriterects.ropen];

		this.upanim = [this.spriterects.uopen,
					   this.spriterects.uclosed,
					   this.spriterects.fullyclosed,
					   this.spriterects.uclosed,
					   this.spriterects.uopen];

		this.downanim = [this.spriterects.dopen,
					     this.spriterects.dclosed,
					     this.spriterects.fullyclosed,
					     this.spriterects.dclosed,
					     this.spriterects.dopen];
		this.dieanim = [];
		for (var i = 0; i < 11; i++) {
			this.dieanim.push({x:51+(16*i), y:0,w:15,h:15});
		}
	}
	
	die(){
		this.dead = true;
		this.timer = 0;
		this.currentanim = this.dieanim;
	}
	update(delta){
		if(maze.isscrolling){
			this.timer += delta;
			let t = this.timer/this.speed;
			for (var i = 0; i < this.bombs.length; i++) {
				this.bombs[i].update(delta);
			}
			if(!this.dead){			
				if(this.moving){
					this.currentsprite = this.currentanim[Math.round(t*(this.currentanim.length-1))];
				}
				if(t >= 1){
					t = 1;
					this.timer = 0;
					this.cell1 = this.cell2;
					this.lerpPosition(t);
					this.updateCell2();
				}
				else {
					this.lerpPosition(t);
				}
				
				if(this.cell1.containsblast){
					this.die();
				}
				else if(this.pos.x + maze.cellsize<0){
					this.die();
				}
				else if(this.cell1.containsghost){
					this.die();
				}
			}
			else{
				this.pos.x = this.cell1.xpos;
				this.pos.y = this.cell1.ypos;
				let t = this.timer/this.dietime;
				this.currentsprite = this.currentanim[Math.round(t*(this.currentanim.length-1))];
				if(t>=1){
					maze.reset();
				}
			}	
		}
	}
	reset(){
		for (var i = 0; i < this.bombs.length; i++) {
			this.bombs[i].delete();
		}
		this.dead = false;
		this.currentanim = this.rightanim;
		this.currentsprite = this.currentanim[0];

	}
	putInCell(cell){
		this.pos = {x:cell.xpos, y:cell.ypos};
		this.cell1 = cell;
		this.cell2 = cell;
		this.updateCell2();
	}
	updateCell2(){
		let walls = this.cell1.walls;
		switch(this.currentdir){
			case directions.left:
				if(!walls.left){
					this.moving = true;
					let next = this.cell1.getAdjacent(-1,0);
					if(next.containsbomb){
						this.moving = false;
					}
					else{
						this.cell2 = next;
					}
					
				}
				else{
					this.moving = false;
				}
				break;
			case directions.right:
				if(!walls.right){
					this.moving = true;
					let next = this.cell1.getAdjacent(1,0);
					if(next.containsbomb){
						this.moving = false;
					}
					else{
						this.cell2 = next;
					}
					
				}
				else{
					this.moving = false;
				}
				break;
			case directions.up:
				if(!walls.top){
					this.moving = true;
					let next = this.cell1.getAdjacent(0,-1);
					if(next.containsbomb){
						this.moving = false;
					}
					else{
						this.cell2 = next;
					}
				}
				else{
					this.moving = false;
				}
				break;
			case directions.down:
				if(!walls.bottom){
					this.moving = true;
					let next = this.cell1.getAdjacent(0,1);
					if(next.containsbomb){
						this.moving = false;
					}
					else{
						this.cell2 = next;
					}
				}
				else{
					this.moving = false;
				}
				break;
			default:
				this.moving = false;
				break;
		}
	}
	draw(){
		if(maze.isscrolling && this.currentsprite){
			for (var i = 0; i < this.bombs.length; i++) {
				this.bombs[i].draw();
			}
			super.drawSelf();
		}
	}
	dropbomb(){
		let bomb = new Bomb(this.cell2, this.bombs);
		this.bombs.push(bomb);
		this.cell2 =this.cell1;
	}
}
