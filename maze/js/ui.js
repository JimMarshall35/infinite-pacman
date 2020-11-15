var ui = {
	sprites : {},
	waitingtostart : true,
	animatedword : null,
	flashtime : 1000,
	timer : 0,
	showanykeymessage : true,
	initializeSprites : function() {
		
	},
	init : function(){
		window.addEventListener("keydown", event=>{
			if(event.key == "Escape"){
				maze.reset();
			}
			else{
				if(ui.waitingtostart){
					ui.waitingtostart = false;
					maze.startScroll();
				}
				if(event.key == "a"){ // left
					if(maze.isscrolling && !pacman.dead){
						pacman.setdir(directions.left);
					}
				}
				else if(event.key == "d" && !pacman.dead){ // right
					if(maze.isscrolling){
						pacman.setdir(directions.right);
					}
				}
				else if(event.key == "w" && !pacman.dead){ // up
					if(maze.isscrolling){
						pacman.setdir(directions.up);
					}
				} 
				else if(event.key == "s" && !pacman.dead){ // down
					if(maze.isscrolling){
						pacman.setdir(directions.down);
					}
				} 
				else if(event.code == "Space" && !pacman.dead){ 
					if(maze.isscrolling){
						pacman.dropbomb();
					}
				} 
			}
		});
		this.animatedword = new Word(2000,100,"50px courier",new Vector2(0,30),new Vector2(0,0),"MAZE PACMAN", true, "yellow",true);
		this.animatedword.init(maze.ctx);
		this.animatedword.toggleAnimation();
	},
	draw : function(){
		if(this.waitingtostart){
			maze.ctx.font = "50px courier"
			maze.ctx.fillStyle = "yellow";
			let txt = "MAZE PACMAN";
			let txtwidth = maze.ctx.measureText(txt).width;
			let centrex = maze.c.width/2 - txtwidth/2;
			let centrey = maze.c.height/2;
			let pos = new Vector2(centrex, centrey);
			this.animatedword.setPos(pos);
			this.animatedword.draw(maze.ctx);
			if(this.showanykeymessage){
				maze.ctx.font = "25px courier"
				txt = "press any key";
				txtwidth = maze.ctx.measureText(txt).width;
				centrex = maze.c.width/2 - txtwidth/2;
				maze.ctx.fillText(txt, centrex, centrey + 80);
			}
			maze.ctx.font = "25px courier"
			txt = "WASD change direction";
			txtwidth = maze.ctx.measureText(txt).width;
			centrex = maze.c.width/2 - txtwidth/2;
			maze.ctx.fillText(txt, centrex, centrey + 100 + 40);

			maze.ctx.font = "25px courier"
			txt = "space plant bomb";
			txtwidth = maze.ctx.measureText(txt).width;
			centrex = maze.c.width/2 - txtwidth/2;
			maze.ctx.fillText(txt, centrex, centrey + 100 + 40 + 30);
		}
	},
	update : function(delta){
		if(!maze.isscrolling){
			this.timer += delta;
			if(this.timer >= this.flashtime){
				this.timer = 0;
				if(this.showanykeymessage){
					this.showanykeymessage = false;
				}
				else{
					this.showanykeymessage = true;
				}
			}
			this.animatedword.update(delta)
		}
	}

}