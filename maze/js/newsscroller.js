var scrollerctx, scrollerc;      // canvas and context
var newsticker = null;
var last;
function onTickerLoad(e){
	if(this.status == 200){
		console.log(this.responseText);
		let parsed = JSON.parse(this.responseText);
		console.log(parsed);
		let newsstringsarray = [];
		newsstringsarray.push("Bouncing News Ticker And Canvas Text Animation Library By Jim Marshall");
		for(let i=0; i<parsed.articles.length; i++){
			let article = parsed.articles[i];
			let line = article.title + " - " + article.description + "                   ";
			newsstringsarray.push(line);
		}
		let speed = scrollerc.width/5;
		let secondstocross = scrollerc.width/speed;
		let size = Math.round(scrollerc.height / 2.7);
		let magnitude = scrollerc.height;
		newsticker = new scrollingAnimatedText(
							    newsstringsarray,               // lines to scroll
							    speed,                            // speed of scroll (px per second)
							    (secondstocross*1000)/4,                           // period of sine wave
								30,                             // time between letters triggering  
								size.toString()+"px Monoton",                   // font 
								new Vector2(0,1*magnitude-size - 10),              // movement vector, added to initial position of letter when at full extent of animation
								new Vector2(scrollerc.width,scrollerc.height-size/2),// position vector of word / line
								true,                           // loop, does each letters motion loop
								"black",                        // fillstyle of text 
								false);                         // full cycle (use tau or pi in update, true = tau, false = pi) (tau = 2*pi)
		newsticker.init(scrollerctx);
		newsticker.toggleAnimation();
	}
	else {
		console.log(this.status);
		let newsstringsarray = [];
		newsstringsarray.push("Bouncing News Ticker And Canvas Text Animation Library By Jim Marshall");
		newsstringsarray.push("news api failed to get headlines, status code: "+this.status);
		let speed = scrollerc.width/5;
		let secondstocross = scrollerc.width/speed;
		let size = Math.round(scrollerc.height / 2.7);
		let magnitude = scrollerc.height;
		newsticker = new scrollingAnimatedText(
							    newsstringsarray,               // lines to scroll
							    speed,                            // speed of scroll (px per second)
							    (secondstocross*1000)/4,                           // period of sine wave
								30,                             // time between letters triggering  
								size.toString()+"px Monoton",                   // font 
								new Vector2(0,1*magnitude-size - 10),              // movement vector, added to initial position of letter when at full extent of animation
								new Vector2(scrollerc.width,scrollerc.height-size/2),// position vector of word / line
								true,                           // loop, does each letters motion loop
								"black",                        // fillstyle of text 
								false);                         // full cycle (use tau or pi in update, true = tau, false = pi) (tau = 2*pi)
		newsticker.init(scrollerctx);
		newsticker.toggleAnimation();
	}
}
function newsTickerInit(newsAPIKey){
	/* set scroller canvas size and get a drawing context */
	scrollerc = document.getElementById("myCanvas");
	scrollerc.width = window.innerWidth;
	scrollerc.height = window.innerHeight * 0.1;
	scrollerc.style.top = window.innerHeight.toString()*0.9 + "px";
	scrollerctx = scrollerc.getContext("2d");

	/* set spacer width and height so you can scroll to bottom of page without 
	the text scrikker being in the way */

	s = document.getElementById("spacer");
	s.style.width = window.innerWidth.toString() + "px";
	s.style.height = (window.innerHeight * 0.1).toString() + "px";;
	/* load news ticker */
	var url = 'http://newsapi.org/v2/top-headlines?' +
	          'country=gb&' +
	          'apiKey='+newsAPIKey;

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	//xhr.open('GET', 'api/getrle.php?url='+url, true);
	xhr.onload = onTickerLoad;
	xhr.send();
	last = new Date().getTime(); 
}
function updateAndDrawTicker(){
	/* update text */
	let d = new Date().getTime(); 
	let delta = d - last;          
	last = d;   
	if(newsticker != null){
		newsticker.update(delta, scrollerc, scrollerctx);
	}
	
	/* draw background */
	scrollerctx.clearRect(0,0,scrollerc.width,scrollerc.height);
	

	/* draw text */
	if(newsticker != null){
		newsticker.draw(scrollerctx);	
	}
}