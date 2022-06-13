var subjectUrl = localStorage.getItem('url')

getData(subjectUrl+".json").then(function (data){

    let parent = data[0]['data']['children'][0]['data']
    let posts= [];

    // initalize the scores and sort them to calculate the percentile
    let scores = [
      {id:0, score:parent['score']}
    ];

    let times = [
      {id:0, time:new Date(parent['created_utc'])}
    ];

    for (let i = 1; i < ((data[1]['data']['children'].length)); i++) {
      let child = data[1]['data']['children'][i]['data'];
      scores.push({id:i, score:child['score']});
      times.push({id:i, time:new Date(child['created_utc'])})
    }
    scores.sort(function(a,b) {return a.score - b.score});
    times.sort(function(a,b) {return b.time - a.time});

    function percentile(n){
        //n is the number of values below it
        if (data[1]['data']['children'].length == 0){
          return 0.5;
        }
        let percent = n/(data[1]['data']['children'].length)
        if (percent == 0){
          return 0.05
        } else{
          return percent
        }
    }

    posts.push({
      title : parent['title'],
      link : parent['permalink'],
      score : parent['score'],
      subreddit: "r/"+parent['subreddit'],
      datePosted : new Date((parent['created_utc'])*1000),
      scoreScale : percentile(scores.findIndex(score => score.id === 0)),
      timeScale : percentile(times.findIndex(time => time.id === 0))
    });


    for (let i = 1; i < (data[1]['data']['children'].length); i++) {
        let child = data[1]['data']['children'][i]['data'];
        // const current = Object.create(postTest);
        posts.push({
          title : child['title'],
          link : child['permalink'],
          score : child['score'],
          subreddit: "r/"+child['subreddit'],
          datePosted : new Date((child['created_utc'])*1000),
          scoreScale : percentile(scores.findIndex(score => score.id === i)),
          timeScale : percentile(times.findIndex(time => time.id === i))
        });
    }

    // for (var i=0; i<posts.length;i++){
    //     console.log(posts[i].scale);
    // }

    //////////////////posts after

    var c = document.getElementById("mainCanvas");
    var ctx = c.getContext("2d");
    // ctx.moveto(0,0)
    var t = document.getElementById("table")
    var tb = document.getElementById("tablebody")

    // Canvas dimensions could be set in HTML
    c.width = window.innerWidth*0.5;
    c.height = window.innerHeight*0.98;

    //  Graph Parameters
    let graph = {
        standardOrbSize: 40,
        standardLineLength: 15,
        postQuantity: posts.length,
        angleInterval: (2*Math.PI)/(posts.length-1),
        drawQueue: [],
    }
    let centre = {
        x: c.width/2,
        y: c.height/2
    }

    drawLineFromCentre(100,100);

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
            window.open("https://www.reddit.com" + orb.post.link);
          }
        });
      });

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
        let coords = [x, y];
        return coords;
    }

    function getColor(reactivity){
        // reactivity = -reactivity //invert
        let cm = 200 // color modifier (changes range of increment)
        // base color values (color for 0 reactivity)
        let br = 40
        let bg = 0
        let bb = 20
        return "#"+(br+(reactivity*cm)).toString(16)+(bg+(reactivity*cm)).toString(16)+(bb+(reactivity*cm)).toString(16);
      }

    class Orb {
        constructor(x, y, post){
          this.x = x;
          this.y = y;
          this.post = post;
          // this.radius = graph.standardOrbSize*0.5;
          this.time = post.datePosted;
          // console.log(Math.round(post.timeScale*10)/10);
          this.color = getColor(Math.round(post.timeScale*10)/10);
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
            var standardRadius = graph.standardOrbSize*this.post.scoreScale;
            if ((Math.pow(dx,2)+ Math.pow(dy,2)) <= Math.pow(this.radius,2) ){
                this.radius = standardRadius * 1.05;
                graph.drawQueue.push(this);
            }
            else {
                this.radius = standardRadius;
            }
        }
    }

    // MAIN
    let orbArray = [];
    // add original post
    orbArray.push(new Orb(centre.x, centre.y , posts[0]));
    // add other posts + draw lines
    for (let i = 1; i < graph.postQuantity; i++) {
        // var originalPostTime = orbArray[0].time;
        // var postTime = posts[i].datePosted;
        var lengthModifier; //10
        if(i%2){
          lengthModifier = 10
        }else{
          lengthModifier = 14
        }
        // (postTime-originalPostTime)/1500
        var angle = graph.angleInterval*(i-1);
        var length = graph.standardLineLength*(lengthModifier);
        var pos = calcOrbPosition(angle, length);
        var x = pos[0];
        var y = pos[1];
        drawLineFromCentre(x, y);
        orbArray.push(new Orb(x, y, posts[i]));
    }
    fillTable();
    animate();

    // END MAIN

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
          var width = 160;
          var len = orb.post.title.length;
          if (len > 25){
            width = (len*5) + 30
          }
          var boxcornerx= 0;
          var boxcornery = 0;
          if (mouse.x > c.width/2){
            boxcornerx = mouse.x-width;
            boxcornery = mouse.y-65;
          }
          else{
            boxcornerx = mouse.x;
            boxcornery = mouse.y;
          }
          ctx.rect(boxcornerx, boxcornery, width, 75);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.fillStyle = "#000000";
          var msg = "Title: "+orb.post.title + "\nSubreddit: "+orb.post.subreddit+ "\nDate: "+orb.post.datePosted.toLocaleString()+"\nScore: "+orb.post.score;
          var x = boxcornerx+10;
          var y = boxcornery+20;
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
          var current = orb.post;
          let row = tb.insertRow();
          let title = row.insertCell(0);
          title.innerHTML = current.title;
          let sub = row.insertCell(1);
          sub.innerHTML = current.subreddit;
          let date = row.insertCell(2);
          date.innerHTML = current.datePosted.toLocaleString();
          let score= row.insertCell(3);
          score.innerHTML = current.score
        });
      }
    } )

async function getData(url) {
    //Returns the post in JSON format for the given URL
    url = URLformatter(url);
    const response = await fetch(url, { method: 'GET' });
    return await response.json();
}

function URLformatter (URL){
    return URL.replace('/comments', '/duplicates')
}

function calculateTime(d){
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = d.getFullYear();
    var month = months[d.getMonth()];
    var date = d.getDate();
    return date + ' ' + month + ' ' + year;
}


//parent = data[0]['data']['children'][0]['data']
//getData("https://www.reddit.com/r/CasualUK/duplicates/ulmu2y/you_cant_park_there_mate.json%22).then(response => console.log(response[1]['data']['children'][2]['data']['title']))
// getData("https://www.reddit.com/r/CasualUK/comments/ulmu2y/you_cant_park_there_mate.json%22).then(response => console.log("score",response[0]['data']['children'][0]['data']['score']))
// getData("https://www.reddit.com/r/CasualUK/comments/ulmu2y/you_cant_park_there_mate.json%22).then(response => console.log(response[0]['data']['children'][0]['data']['score']))

//Duplicates
//response[i]['data']['children'][2]['data']['title']

// create disctionary contating this
// title
// link
// score
// date of post
