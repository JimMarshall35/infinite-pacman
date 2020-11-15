

var last;
var pacman;
document.body.onload = function() {
	
	assetloader.start();
	maze.initializeCanvas();

	last = new Date().getTime();
	loop = function(){
		if(assetloader.finished){
		    if(ui.waitingtostart){
	            maze.reset();
	        }

			let d = new Date().getTime();
			let delta = d-last;
			last = d;
			UpdateAll(delta);
			DrawAll();
		}
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
}
function UpdateAll(delta){
	maze.update(delta);
	pacman.update(delta);
	ui.update(delta);
	ghostspawner.update(delta);
}
function DrawAll(){
	maze.draw();
	pacman.draw();
	ghostspawner.draw();
	ui.draw();
}
function OnAssetsLoad(){
	ui.init();
	pacman = new PacMan();
	maze.reset();
}