
class Letter{
	constructor(pos,char, parent){
		this.parent = parent;
		this.pos = pos;
		this.initpos = pos;
		this.char = char;
		this.movetime = 0;
		this.parentpos2mypos = this.pos.subtract(this.parent.pos);
		this.stop = false;
	}
	removeFromUpdateList(){
		for(let i = 0; i<this.parent.updatelist.length; i++){
			if(this.parent.updatelist[i] == this){
				this.parent.updatelist.splice(i, 1);
			}
		}
	}
	update(delta){
		this.movetime += delta;
		if(this.movetime > this.parent.period){
			this.movetime = 0;
			if(this.stop){
				this.removeFromUpdateList(); // prevents looping when
				this.movetime = 0;
				if(this.parent.lastlettertriggered == this && this.parent.loop == false){ /* sets word.animating to false when last letter 
																							 finishes and word.loop == false */
					this.parent.animating = false;
				}
			}
		}
		let cycles = this.movetime / this.parent.period;
		let TorP = this.parent.fullcycle ? Math.PI*2 : Math.PI;
		let rawsine = Math.sin(cycles * TorP);
		let movement = this.parent.movement.multiplyByScalar(-rawsine);
		this.pos = this.initpos.add(movement);
	}
}
class Word{
	constructor(period, timebetween, font, movementvector, pos, string, loop, fillStyle, fullcycle){
		this.period = period;
		this.timebetweenletters = timebetween;
		this.font = font;
		this.movement = movementvector;
		this.pos = pos;
		this.string = string;
		this.letters = [];
		this.updatelist = [];
		this.startedindex = 0;
		this.loop = loop;
		this.animating = false;
		this.fillStyle = fillStyle;
		this.fullcycle = fullcycle;
		this.lastlettertriggered = null;
		this.width = null;
		//this.init();
	}
	setPos(pos){  // set position of entire word                                   
		this.pos = pos;
		for(let i=0; i<this.letters.length; i++){
			let letter = this.letters[i];
			letter.initpos = this.pos.add(letter.parentpos2mypos);
			if(!this.animating){
				letter.pos = this.pos.add(letter.parentpos2mypos);
			}
			if(letter.stop){
				letter.pos = this.pos.add(letter.parentpos2mypos);
			}
		}
	}
	init(ctx){
		ctx.font = this.font;
		let cumulativewidth = this.pos.x;
		for(let i=0; i<this.string.length; i++){	
			if(i>0){
				cumulativewidth += ctx.measureText(this.string[i-1]).width;
			}			
			this.letters.push(new Letter(new Vector2(cumulativewidth, this.pos.y), this.string[i],this));	
		}
		this.width = (cumulativewidth + ctx.measureText(this.string[this.string.length-1]).width) - this.pos.x;

	}
	draw(ctx){
		for(let i=0; i<this.letters.length; i++){
			let letter = this.letters[i];
			ctx.fillStyle = this.fillStyle;
			ctx.fillText(letter.char, letter.pos.x,letter.pos.y);
		}
	}
	update(delta){
		for(let i=0; i<this.letters.length; i++){
			let letter = this.letters[i];
			letter.pos = this.pos.add(letter.parentpos2mypos);
		}
		for(let i=0; i<this.updatelist.length; i++){
			this.updatelist[i].update(delta);
		}
	}
	toggleAnimation(){
		if(this.animating){
			this.animating = false;
			stopAnimation(this);
		}
		else{
			this.startedindex = 0;
			this.animating = true;
			startAnimation(this);
		}
	}
}
class scrollingAnimatedText{
	constructor(lineslist, speed, period, timebetween, font, movementvector, pos, loop, fillStyle, fullcycle){
		this.linesindex = 0;
		this.text1 = null;
		this.lineslist = lineslist;
		this.text = new Word(period,timebetween,font,movementvector,pos,lineslist[this.linesindex],loop,fillStyle,fullcycle);
		this.speed = speed;
		

		this.period = period;
		this.timebetween = timebetween;
		this.font = font;
		this.movementvector = movementvector;
		this.pos = pos;
		this.loop = loop;
		this.fillStyle = fillStyle;
		this.fullcycle = fullcycle;
	}
	toggleAnimation(){
		this.text.toggleAnimation();
	}
	init(ctx){
		this.text.init(ctx);
	}
	update(delta, c, ctx){
		/* move animated text */
		let addition = delta/1000 * this.speed;      
		this.text.setPos(new Vector2(this.text.pos.x - addition, this.text.pos.y));
		if(this.text1 != null){
			this.text1.setPos(new Vector2(this.text1.pos.x - addition, this.text1.pos.y));     
		}      
		
		if(this.text.pos.x<0 && this.text1 == null && this.text.pos.x + this.text.width < c.width){
			this.linesindex++;
			if(this.linesindex > this.lineslist.length - 1){
				this.linesindex = 0;
			}
			this.text1 = new Word(this.period,                     // period of sine wave
									this.timebetween,                 // time between letters being triggered           
									this.font,                        // font 
									this.movementvector,              // movement vector, added to initial position of letter when at full extent of animation
									this.pos,                         // position vector of word / line
									this.lineslist[this.linesindex],  // text 
									this.loop,                        // loop, does each letters motion loop
									this.fillStyle,                   // fillstyle of text 
									this.fullcycle);                  // full cycle (use tau or pi in update, true = tau, false = pi) (tau = 2*pi)
			this.text1.init(ctx);
			this.text1.toggleAnimation();
		}
		if(this.text.pos.x < - this.text.width){
			this.text = this.text1;
			this.text1 = null;
		}

		/* update text animation */
		this.text.update(delta);
		if(this.text1 != null){
			this.text1.update(delta);
		}
	}
	draw(ctx){
		this.text.draw(ctx);	
		if(this.text1 != null){
			this.text1.draw(ctx);
		}
	}
}
var lasttimeout;
function startAnimation(word){
	let letter = word.letters[word.startedindex];
	word.lastlettertriggered = word.letters[word.startedindex];
	if(word.loop){
		letter.stop = false;
	}
	else{
		letter.stop = true;
	}
	word.updatelist.push(letter);
	if(word.startedindex + 1 < word.letters.length && word.animating){
		word.startedindex++;
		lasttimeout = setTimeout(function(){startAnimation(word)},word.timebetweenletters);

	}
}
function stopAnimation(word){
	clearTimeout(lasttimeout);
	for(let i=0; i<word.updatelist.length; i++){
		word.updatelist[i].stop = true;
	}
}