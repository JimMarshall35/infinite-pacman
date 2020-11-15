class Bomb extends Drawable{
	constructor(cell, masterlist){
		super(assetloader.files.bomberman);
		this.srects = {
			bomb : [
				{x:0, y:48, w:16, h:16}, // bomb frame 1
				{x:16, y:48, w:16, h:16}, // bomb frame 2
				{x:32, y:48, w:16, h:16}, // bomb frame 3
				{x:16, y:48, w:16, h:16},
				{x:0, y:48, w:16, h:16},
				{x:16, y:48, w:16, h:16},
				{x:32, y:48, w:16, h:16},
				{x:16, y:48, w:16, h:16},
				{x:0, y:48, w:16, h:16}
			],
			center : [
				{x:32, y:96, w:16, h:16},     
				{x:32+80, y:96, w:16, h:16},
				{x:32, y:96+80, w:16, h:16},
				{x:32+80, y:96+80, w:16, h:16},

				{x:32, y:96+80, w:16, h:16},
				{x:32+80, y:96, w:16, h:16},
				{x:32, y:96, w:16, h:16}     
			],
			t_end : [
				{x:32, y:64, w:16, h:16},
				{x:32+80, y:64, w:16, h:16},
				{x:32, y:64+80, w:16, h:16},
				{x:32+80, y:64+80, w:16, h:16},

				{x:32, y:64+80, w:16, h:16},
				{x:32+80, y:64, w:16, h:16},
				{x:32, y:64, w:16, h:16}
			],
			t_mid : [
				{x:32, y:80, w:16, h:16},
				{x:32+80, y:80, w:16, h:16},
				{x:32, y:80+80, w:16, h:16},
				{x:32+80, y:80+80, w:16, h:16},

				{x:32, y:80+80, w:16, h:16},
				{x:32+80, y:80, w:16, h:16},
				{x:32, y:80, w:16, h:16}
			],
			b_end : [
				{x:32, y:128, w:16, h:16},
				{x:32+80, y:128, w:16, h:16},
				{x:32, y:128+80, w:16, h:16},
				{x:32+80, y:128+80, w:16, h:16},

				{x:32, y:128+80, w:16, h:16},
				{x:32+80, y:128, w:16, h:16},
				{x:32, y:128, w:16, h:16}
			],
			b_mid : [
				{x:32, y:112, w:16, h:16},
				{x:32+80, y:112, w:16, h:16},
				{x:32, y:112+80, w:16, h:16},
				{x:32+80, y:112+80, w:16, h:16},

				{x:32, y:112+80, w:16, h:16},
				{x:32+80, y:112, w:16, h:16},
				{x:32, y:112, w:16, h:16}
			],
			l_end : [
				{x:0, y:96, w:16, h:16},
				{x:0+80, y:96, w:16, h:16},
				{x:0, y:96+80, w:16, h:16},
				{x:0+80, y:96+80, w:16, h:16},

				{x:0, y:96+80, w:16, h:16},
				{x:0+80, y:96, w:16, h:16},
				{x:0, y:96, w:16, h:16}
			],
			l_mid : [
				{x:16, y:96, w:16, h:16},
				{x:16+80, y:96, w:16, h:16},
				{x:16, y:96+80, w:16, h:16},
				{x:16+80, y:96+80, w:16, h:16},

				{x:16, y:96+80, w:16, h:16},
				{x:16+80, y:96, w:16, h:16},
				{x:16, y:96, w:16, h:16}
			],
			r_end : [
				{x:64, y:96, w:16, h:16},
				{x:64+80, y:96, w:16, h:16},
				{x:64, y:96+80, w:16, h:16},
				{x:64+80, y:96+80, w:16, h:16},

				{x:64, y:96+80, w:16, h:16},
				{x:64+80, y:96, w:16, h:16},
				{x:64, y:96, w:16, h:16}
			],
			r_mid : [
				{x:48, y:96, w:16, h:16},
				{x:48+80, y:96, w:16, h:16},
				{x:48, y:96+80, w:16, h:16},
				{x:48+80, y:96+80, w:16, h:16},

				{x:48, y:96+80, w:16, h:16},
				{x:48+80, y:96, w:16, h:16},
				{x:48, y:96, w:16, h:16}
			]
		};
		this.masterlist = masterlist; /* list that contains the bomb instances 
		                                  so they can delete themselves and be garbage collected */
		this.cell = cell; // cell the bomb is in (see Cell class in maze.js)
		this.currentsprite = this.srects.bomb.bomb1; // current sprite rect {x:int, y:int, w:int, h:int}
		this.timerlength = 1750; // milliseconds before the explosion
		this.timer = 0; // time since instantiated
		this.blastsize = 0; // size of blast - number of extra mid sections
		this.blastlength = 500;
		this.blastpieces = [];
		this.exploded = false; // has the bomb exploded
		this.cell.containsbomb = true;
		this.pos = {x:cell.xpos,y:cell.ypos};
	}
	/* 
		explode function body is a mess - but the function does the following things:
				- populates blast pieces with these objects so the blast can be drawn
						{
						curr_srect : {x:0,y:0,w:0,h:0}, //this is the rect of the sprite sheet to be drawn for this piece
						anim_arr: [], //an array of sprite rects that comprise this pieces animation
						cell : {xpos:0,ypos:0...ect} //the cell that this piece is to be drawn in
						}
				- removes walls from the appropriate cells
				- sets this.exploded to true so the blast is drawn not the bomb
				- resets this.timer
	*/
	explode(){
		function ProcessCell(bomb, cell, dir, num){ // recursive - pass in num as 1 
			if(!cell.walls[dir]){
				let next;
				if(dir == "top"){
					next = cell.getAdjacent(0,-1);
					if(num == 2 + bomb.blastsize){
						bomb.blastpieces.push(new ExplosionPiece(next,bomb.srects.t_end,bomb.srects.t_end[0], bomb.blastlength));
					}
					else{
						bomb.blastpieces.push(new ExplosionPiece(next,bomb.srects.t_mid,bomb.srects.t_mid[0], bomb.blastlength));
					}				
				}
				else if(dir == "bottom"){
					next = cell.getAdjacent(0,1);
					if(num == 2 + bomb.blastsize){
						bomb.blastpieces.push(new ExplosionPiece(next, bomb.srects.b_end, bomb.srects.b_end[0], bomb.blastlength));
					}
					else{
						bomb.blastpieces.push(new ExplosionPiece(next, bomb.srects.b_mid, bomb.srects.b_mid[0], bomb.blastlength));
					}
				}
				else if(dir == "left"){
					next = cell.getAdjacent(-1,0);
					if(num == 2 + bomb.blastsize){
						bomb.blastpieces.push(new ExplosionPiece(next, bomb.srects.l_end, bomb.srects.l_end[0], bomb.blastlength));
					}
					else{
						bomb.blastpieces.push(new ExplosionPiece(next, bomb.srects.l_mid, bomb.srects.l_mid[0], bomb.blastlength));
					}
				}
				else if(dir == "right"){
					next = cell.getAdjacent(1,0);
					if(num == 2 + bomb.blastsize){
						bomb.blastpieces.push(new ExplosionPiece(next, bomb.srects.r_end, bomb.srects.r_end[0], bomb.blastlength));
					}
					else{
						bomb.blastpieces.push(new ExplosionPiece(next, bomb.srects.r_mid, bomb.srects.r_mid[0], bomb.blastlength));
					}
				}
				else{
					return;
				}
				next.containsblast = true;
				if(num < 2 + bomb.blastsize){
					ProcessCell(bomb,next,dir,num+1);
				}
			}
			else if(cell.walls[dir] != null){
				let next;
				if(dir == "top"){
					next = cell.getAdjacent(0,-1);
					if(next != null){
						next.walls.bottom = false;
						cell.walls[dir] = false;
					}
				}
				else if(dir == "bottom"){
					next = cell.getAdjacent(0,1);
					if(next != null){
						next.walls.top = false;
						cell.walls[dir] = false;
					}
				}
				else if(dir == "left"){
					next = cell.getAdjacent(-1,0);
					if(next != null){
						next.walls.right = false;
						cell.walls[dir] = false;
					}
				}
				else if(dir == "right"){
					next = cell.getAdjacent(1,0);
					if(next != null){
						next.walls.left = false;
						cell.walls[dir] = false;
					}
				}
			}
		}
		this.cell.containsbomb = false;
		this.blastpieces.push(new ExplosionPiece(this.cell, this.srects.center, this.srects.center[0], this.blastlength));
		this.cell.containsblast = true;
		ProcessCell(this,this.cell,"top",1);
		ProcessCell(this,this.cell,"bottom",1);
		ProcessCell(this,this.cell,"left",1);
		ProcessCell(this,this.cell,"right",1);
		this.exploded = true;
		this.timer = 0;
	}
	/*
		update updates the animation of either the blast or the bomb sprite 
		and calls this.explode when the bomb has sat there unexploded for 
		this.timerlength milliseconds
	*/
	update(delta){ 
		this.timer += delta;
		this.pos = {x:this.cell.xpos,y:this.cell.ypos};
		if(!this.exploded){
			this.currentsprite = this.srects.bomb[Math.round((this.timer/this.timerlength)*(this.srects.bomb.length-1))];
			if(this.timer >= this.timerlength){
				this.explode();
			}
		}
		else{
			for (let i = 0; i < this.blastpieces.length; i++) {
				let piece = this.blastpieces[i];
				piece.update(this.timer);
			}
			if(this.timer >= this.blastlength){ 
				this.delete();
			}
		}
	}
	draw(){
		if (!this.exploded) {	
			super.drawSelf();
		}
		else{
			for (let i = 0; i < this.blastpieces.length; i++) {
				let piece = this.blastpieces[i];
				piece.drawSelf();
			}
		}
	}
	delete(){
		this.cell.containsbomb = false;
		for (let i = 0; i < this.blastpieces.length; i++) {
			this.blastpieces[i].cell.containsblast = false;
		}
		for (let i = 0; i < this.masterlist.length; i++) {
			if(this.masterlist[i] == this){
				this.masterlist.splice(i, 1);
			}
		}
	}
}
class ExplosionPiece extends Drawable{
	constructor(cell,anim_arr,currentsprite, blastlength){
		super(assetloader.files.bomberman);
		this.currentsprite = currentsprite;
		this.pos = {x:cell.xpos,y:cell.ypos};
		this.cell = cell;
		this.anim_arr = anim_arr;
		this.blastlength = blastlength;
	}
	update(timer){
		this.pos = {x:this.cell.xpos,y:this.cell.ypos};
		this.currentsprite = this.anim_arr[Math.round((timer/this.blastlength)*(this.anim_arr.length-1))];
	}
}