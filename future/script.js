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
  this.flashing = 0;
  this.opacity = 0;
  var max_on_time = random(400, 800);
  var max_off_time = max_on_time;
  this.next_transition = Math.floor(random(0, max_off_time));
  
	
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
    if(this.next_transition <= 0){

      if(this.flashing){
        this.next_transition = Math.floor(random(0, max_off_time));
      } else {
        this.next_transition = Math.floor(random(0, max_on_time));
      }

      this.flashing = !this.flashing;
    }

    if(this.flashing){
      this.opacity += 0.02;
      this.opacity = clip(this.opacity, 0, 1);
    } else {
      this.opacity -= 0.02;
      this.opacity = clip(this.opacity, 0, 1);
    }
    var pos = this.nextPos(this.length);
    fill(255, 255, 255, Math.floor(255 * this.opacity));
    textAlign(CENTER, CENTER);
    textSize(24);
    textFont("Harry P");
    text(this.string, pos[0] + width/2, pos[1] + 100);
    this.next_transition--;
	}
	
}

function clip(value, min, max){
  return Math.max(Math.min(value, max), min);
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
	words.push(new fortune('Classes', 50));
	words.push(new fortune('Training', 40));
	words.push(new fortune('Display', 40));
	words.push(new fortune('Guide', 40));
}

function draw() {
  clear();
  background(img);
	noStroke();
	words.forEach(function(word){
		word.draw();
	});
}
