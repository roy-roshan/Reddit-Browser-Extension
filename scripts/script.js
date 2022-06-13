// GRAPH FILE PRE MERGE

var c = document.getElementById("mainCanvas");
var ctx = c.getContext("2d");
var t = document.getElementById("table")
var tb = document.getElementById("tablebody")

// Canvas dimensions could be set in HTML
c.width = window.innerWidth*0.5;
c.height = window.innerHeight*0.5;


// Example array of posts

//  Graph Parameters
let graph = {
  standardOrbSize: 50,
  standardLineLength: 100,
  postQuantity: posts.length,
  angleInterval: (2*Math.PI)/(posts.length-1),
  drawQueue: [],
}
let centre = {
  x: c.width/2,
  y: c.height/2
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
let mouse = {
  x: undefined,
  y: undefined,
  d: undefined,
};

window.addEventListener("mousemove", function(e) {
  mouse = getMousePos(c, e);
});
window.addEventListener('mouseup', function(e) {
  mouse.d = e.buttons;
  orbArray.forEach(orb => {
    var dx = mouse.x - orb.x;
    var dy = mouse.y - orb.y;
    if ((Math.pow(dx,2)+ Math.pow(dy,2)) <= Math.pow(orb.radius,2) ){
      window.open(orb.post.link);
    }
  });
});
// window.addEventListener('mousedown', function(e) {
//   mouse.d = e.buttons;
// });

// GRAPH FUNCTIONS

function drawLineFromCentre(x, y){
  ctx.beginPath();
  ctx.moveTo(centre.x,centre.y);
  ctx.lineTo(x, y);
  ctx.stroke();
}

// Calculates orb coordinates from centre given the angle and length of line
function calcOrbPosition(angle, length){
  x = centre.x + (length*Math.cos(angle));
  y = centre.y + (length*Math.sin(angle));
  coords = [x, y];
  return coords;
}

class Orb {
  constructor(x, y, post){
    this.x = x;
    this.y = y;
    this.post = post;
    this.radius = graph.standardOrbSize*this.post.receptivity;
    this.time = this.post.datePosted.getTime();
    this.color = getColor(this.post.reactivity)
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    this.update();
  }

  update() {
    var dx = mouse.x - this.x;
    var dy = mouse.y - this.y;
    var standardRadius = graph.standardOrbSize*this.post.receptivity;
    if ((Math.pow(dx,2)+ Math.pow(dy,2)) <= Math.pow(this.radius,2) ){
      this.radius = standardRadius * 1.05;
      graph.drawQueue.push(this);
    }
    else {
      this.radius = standardRadius;
    }
  }
}
// accepts value 0-1, returns different shade of purple
function getColor(reactivity){
  reactivity = reactivity //invert
  cm = 200 // color modifier (changes range of increment)
  // base color values (color for 0 reactivity)
  br = 20
  bg = 0
  bb = 20
  return "#"+(br+(reactivity*cm)).toString(16)+(bg+(reactivity*cm)).toString(16)+(bb+(reactivity*cm)).toString(16);
}

// ** MAIN **
let orbArray = [];
// add original post
orbArray.push(new Orb(centre.x, centre.y , posts[0]));

// add other posts + draw lines
for (let i = 1; i < graph.postQuantity; i++) {
  var originalPostTime = orbArray[0].time;
  var postTime = posts[i].datePosted;
  var lengthModifier = (postTime-originalPostTime)/100000000;
  var angle = graph.angleInterval*(i-1);
  var length = graph.standardLineLength*(lengthModifier);
  var pos = calcOrbPosition(angle, length);
  var x = pos[0];
  var y = pos[1];
  //drawLineFromCentre(x, y);
  orbArray.push(new Orb(x, y, posts[i]));
}
fillTable();
animate();

// ** END OF MAIN **

function clearCanvas(){
  ctx.clearRect(0, 0, c.width, c.height);
}

function animate() {
  requestAnimationFrame(animate);
  clearCanvas();
  // draw lines first
  orbArray.forEach(orb => {
    drawLineFromCentre(orb.x, orb.y);
  });
  // then orbs
  orbArray.forEach(orb => {
    orb.draw();
  })
  //draw info box if needed
  graph.drawQueue.forEach(orb => {
    ctx.beginPath();
    ctx.rect(mouse.x, mouse.y, 120, 50);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.fillStyle = "#000000";
    var msg = orb.post.link + "\n" + orb.post.datePosted.toLocaleString();
    var x = mouse.x+10;
    var y = mouse.y+20;
    var lineheight = 15;
    var lines = msg.split('\n');
    for (var i = 0; i<lines.length; i++){
      ctx.fillText(lines[i], x, y + (i*lineheight) );
    }
    ctx.stroke();
    graph.drawQueue.shift();
  });
}

function fillTable(){
  orbArray.forEach(orb => {
    post = orb.post;
    let row = tb.insertRow();
    let title = row.insertCell(0);
    title.innerHTML = post.link;
    let date = row.insertCell(1);
    date.innerHTML = post.datePosted.toLocaleString();
    let rcpt = row.insertCell(2);
    rcpt.innerHTML = post.receptivity;
    let  rct = row.insertCell(3);
    rct.innerHTML = post.reactivity;
  });


}
