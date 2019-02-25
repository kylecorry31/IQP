var pageID = 0;

document.body.addEventListener('keypress', function(event){
  if (event.key === "a"){
    pageID--;
    var page = document.getElementById('group' + pageID);
    if (page){
      document.getElementById('group' + (pageID + 1)).classList.add('hidden');
      setTimeout(function () {
        page.classList.remove('hidden');
      }, 1000);
    } else {
      pageID++;
    }
  } else if (event.key === "d" || event.key == " "){
    pageID++;
    var page = document.getElementById('group' + pageID);
    if (page){
      document.getElementById('group' + (pageID - 1)).classList.add('hidden');
      setTimeout(function () {
        page.classList.remove('hidden');
      }, 1000);
    } else {
      pageID--;
    }
  } else if (event.key == 'q'){
    window.history.back();
  }  
});

let img;
var words = [];

function fortune(string, length){
	this.wordAng = random(1000);
	this.wordMag = random(1000);
	this.string = string;
  this.length = length;
  this.magnitude = random(0, length);
	
	this.nextPos = function(){
		var angle = map(noise(this.wordAng), 0, 1, 0, PI * 4);
		var magnitude = map(noise(this.wordMag), 0, 1, 10, this.length);

		var x = cos(angle) * magnitude;
		var y = sin(angle) * magnitude;
		
		this.wordAng += 0.002;
		this.wordMag += 0.005;
		
		return [x, y];
	}
	
	this.draw = function(){
		var pos = this.nextPos(this.length);
    textAlign(CENTER, CENTER);
    textSize(24);
		text(this.string, pos[0] + width/2, pos[1] + 100);
	}
	
}

function preload() {
  img = loadImage('ball.png');
}

function setup() {
  let myCanvas = createCanvas(400, 400);
  myCanvas.parent('ball');
	wordAng = 0;
	wordMag = 10;
	words.push(new fortune('IQP', 80));
	words.push(new fortune('Courses', 50));
	words.push(new fortune('Workshops', 40));
}

function draw() {
  clear();
  background(img);
	noStroke();
	fill(0, 0, 0,127);
	fill(255);
	words.forEach(function(word){
		word.draw();
	});
}
