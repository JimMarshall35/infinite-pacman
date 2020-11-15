var assetloader = {
	finished : false,
	filesloaded : 0,
	filestoload : 0,
	files : {},
	start : function(){
		this.filestoload = 2;
		this.loadimage("assets/pacman1.png", "mainsheet");
		this.loadimage("assets/bomberman_cutout.png", "bomberman");
	},
	loadimage : function(url, name){
		var image = new Image()
		image.name = name;
		image.onload = function(){
			assetloader.registerloadedfile();
			assetloader.files[this.name] = this;
		}
		image.src = url;

	},
	registerloadedfile : function(){
		this.filesloaded++;
		if(this.filesloaded >= this.filestoload){
			OnAssetsLoad();
			this.finished = true;
			
		}
	}
}
