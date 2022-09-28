
// Instantiate socket object on PORT 8081
var socket = io('http://127.0.0.1:8081');

socket.on('connect', function() {
    // sends to socket.io server the host/port of oscServer
    // and oscClient
    socket.emit('config',
        {
            server: {
                port: 60000,
                host: '127.0.0.1'
            },
            client: {
                port: 55000,
                host: '127.0.0.1'
            }
        }
    );
});

var json_data = {}; //where our news titles are stored
var current_news = {};
var tot_length; // total entries in database
const d = new Date(); // date variable for tweet date

$.ajax({ //download the news database, pring how many entries there are
        url: "fake-news-filtered.json",
        async: false,
        dataType: 'json',
        success: function(json) {
            json_data = json; //pass it into global var
            console.log("Sucessfully downloaded data...");
            tot_length = JSON.parse(JSON.stringify(json)).length;
            console.log("Total entries: "+tot_length);
            var random_entry = getRandomInt(tot_length);
            current_news = json_data[random_entry];
        }
});


//Associate buttons with functions
document.getElementById("likebutton").addEventListener("click", like_button);
document.getElementById("sharebutton").addEventListener("click", share_button);;
document.getElementById("reportbutton").addEventListener("click", report_button);


function like_button() {
  console.log("Pressed Like!");
  show_overlay("liked", current_news);
}
function share_button() {
  console.log("Pressed Share!");
  show_overlay("shared", current_news);
}
function report_button() {
  console.log("Pressed Report!");
  show_overlay("reported", current_news);
}

// Helper functions:
function change_news(){  
  // Set new user and related data
  $.ajax({
    url: 'https://randomuser.me/api/',
    dataType: 'json',
    success: function(data) {
        document.getElementById("username").innerHTML =data.results[0].name.first+" "+data.results[0].name.last;//change name of person
        document.getElementById("userid").innerHTML = "@"+data.results[0].login.username;//change username
        document.getElementById("userpic").src = data.results[0].picture.thumbnail;//change profile picture
    }
  });

  // Set new random date
  document.getElementById("postdate").innerHTML = (new generateRandomDate()).toLocaleString('en-US', { day:'numeric', month: 'long' }); //change date of the tweet

  // Choose a new random news
  var random_entry = getRandomInt(tot_length);
  current_news = json_data[random_entry];
  // Set new random news
  document.getElementById("articletitle").innerHTML = current_news.title; //change title, get random entry from database

  // Set new article image
  document.getElementById("articleimg").src = "https://source.unsplash.com/random/?politics&1?" + new Date().getTime();

}

function generateRandomDate() { // Func for generating date between two days
  return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
}
function getRandomInt(max) { // Func for getting random int until max value provided
  return Math.floor(Math.random() * max);
}

function fake_or_real(random_entry){ //func for detecting fake or real
            if(current_news.reliability === "fake"){ 
              return 0
            }
            else{
              return 1
            }
}

function show_overlay(action, news) {
  // Remove background
  document.getElementById("bg").classList.remove("positive-bg");
  document.getElementById("bg").classList.remove("negative-bg");

  // Display overlay
  document.getElementById("overlay").style.display = "block";
  
  // Clean HTML
  document.getElementById("overlay-txt").innerHTML = "";

  // Check whether reliable or unreliable
  reliability = "";
  effect = "";
  if (news.reliability == "real") {
    reliability = "reliable";
    if(action == "shared") {
      sendOSCPositiveMessage("group");
      effect = "greater positive";
      document.getElementById("bg").classList.add("positive-bg");
      divs_fade_in_out();
    }
    if(action == "liked") {
      sendOSCPositiveMessage("single");
      effect = "lesser positive";
      document.getElementById("bg").classList.add("positive-bg");
      divs_fade_in_out();
    }
    if(action == "reported") {
      sendOSCNegativeMessage("single");
      effect = "negative";
      document.getElementById("bg").classList.add("negative-bg");
      divs_fade_in_out();
    }
  }
  if (news.reliability == "fake") {
    reliability = "unreliable";
    if(action == "shared") {
      sendOSCNegativeMessage("group");
      effect = "greater negative";
      document.getElementById("bg").classList.add("negative-bg");
      divs_fade_in_out();
    }
    if(action == "liked") {
      sendOSCNegativeMessage("single");
      effect = "lesser negative";
      document.getElementById("bg").classList.add("negative-bg");
      divs_fade_in_out();
    }
    if(action == "reported") {
      sendOSCPositiveMessage("single")
      effect = "positive";
      document.getElementById("bg").classList.add("positive-bg");
      divs_fade_in_out();
    }
  }
  
  document.getElementById("overlay-txt").innerHTML += "The news you " + action + " was <b>"+reliability+".<br></b>"; 
  
  if (effect=="negative" || effect=="lesser negative" || effect=="greater negative"){
    document.getElementById("overlay-txt").innerHTML += "<br>This will have a <b><span style=\"color:#F00\">" + effect + "<span></b> effect.";  
  }
  else if (effect=="positive" || effect=="lesser positive" || effect=="greater positive"){
    document.getElementById("overlay-txt").innerHTML += "<br>This will have a <b><span style=\"color:#008000\">" + effect + "<span></b> effect.";
  }
  if(action == "shared") {
    document.getElementById("overlay-txt").innerHTML += "<br><br> Head over to the map to share it to the world.";
  }
  else {
    document.getElementById("overlay-txt").innerHTML += "<br><br> A random citizen has started spreading it.";
  }
  
  //document.getElementById("overlay-txt").innerHTML += "<br> Head over to the map to share it to the world.";
}
 
function divs_fade_in_out(){
  document.getElementById("bg").style.opacity=1;
  document.getElementById("overlay-txt").style.opacity=1;
  //$(".bg , .overlay-txt").fadeTo("slow" ,0.05)
  $("#bg").fadeTo(1000 ,0.05).promise().done(function(){
    $("#overlay-txt").fadeTo(1000 ,0.05).promise().done(function(){
      hide_overlay();
    })
  })
}

function hide_overlay() {
  document.getElementById("overlay").style.display = "none";
  change_news();
}
function sendOSCPositiveMessage(size) {
  socket.emit('message', '/website/news positiveMessage '+ size);
}

function sendOSCNegativeMessage(size) {
  socket.emit('message', '/website/news negativeMessage '+ size);
}

hide_overlay();
//document.getElementById("overlay").addEventListener("click", hide_overlay);
change_news();


// Background geometry function
(function ($) {
  // animated hex background
    $(document).ready(function() {
      $('.animated-background').each(function( index ) {
        var cnv = $("<canvas></canvas>").attr("id", "can"+index);
 
        var colorToUse = $(this).attr('data-color');
        if (colorToUse === 'red') {
          colorRange = ['rgba(206, 23, 41, 0)', 'rgba(193, 23, 43, 0)'];
          strokeColor = 'rgba(206, 23, 41, 1)';
        } else {
          colorRange = ['rgba(245, 245, 245, alp)', 'rgba(229, 229, 229, alp)'];
          strokeColor = 'rgba(245,245,245, 0.5)';
          //colorRange = ['rgba(151, 95, 214, 0.71)','rgba(125, 70, 200, 0.71)']
          //strokeColor = 'rgba(151, 95, 214, 0.51)';
          //colorRange = ['rgba(141, 146, 130, 0.975)','rgba(115, 136, 120, 0.975)']
          //strokeColor = 'rgba(141, 146, 130, 0.71)';
        }
 
        $(this).prepend(cnv);
 
        var can = document.getElementById("can"+index);
        var w = can.width = $(this).width(),
        h = can.height = $(this).height(),
        sum = w + h,
        ctx = can.getContext('2d'),
 
        opts = {
 
          side: 16,
          picksParTick: 1, //originally 5
          baseTime: 40,//org.200
          addedTime: 5,
          colors: colorRange,
          addedAlpha: 1,
          strokeColor: strokeColor,
          hueSpeed: .1,
          repaintAlpha: 1
        },
 
        difX = Math.sqrt(3) * opts.side / 2,
        difY = opts.side * 3 / 2,
        rad = Math.PI / 6,
        cos = Math.cos(rad) * opts.side,
        sin = Math.sin(rad) * opts.side,
 
        hexs = [],
        tick = 0;
 
        function loop() {
 
          window.requestAnimationFrame(loop);
 
          tick += opts.hueSpeed;
 
          ctx.shadowBlur = 0;
 
          var backColor;
          if (colorToUse === 'red') {
            backColor = 'rgba(232, 28, 47, 0.9)';
          }
          else {
            backColor = 'rgba(225, 225, 225, 0.5)';
          }
          ctx.fillStyle = backColor.replace('alp', opts.repaintAlpha);
          ctx.fillRect(0, 0, w, h);
 
          for (var i = 0; i < opts.picksParTick; ++i)
            hexs[(Math.random() * hexs.length) | 0].pick();
 
          hexs.map(function(hex) {
            hex.step();
          });
        }
 
        function Hex(x, y) {
 
          this.x = x;
          this.y = y;
          this.sum = this.x + this.y;
          // change between false and true to animate from left to right, or all at once
          this.picked = false;
          this.time = 0;
          this.targetTime = 0;
 
          this.xs = [this.x + cos, this.x, this.x - cos, this.x - cos, this.x, this.x + cos];
          this.ys = [this.y - sin, this.y - opts.side, this.y - sin, this.y + sin, this.y + opts.side, this.y + sin];
        }
        Hex.prototype.pick = function() {
 
          this.color = opts.colors[(Math.random() * opts.colors.length) | 0];
          this.picked = true;
          this.time = this.time || 0;
          this.targetTime = this.targetTime || (opts.baseTime + opts.addedTime * Math.random()) | 0;
        }
        Hex.prototype.step = function() {
 
          var prop = this.time / this.targetTime;
 
          ctx.beginPath();
          ctx.moveTo(this.xs[0], this.ys[0]);
          for (var i = 1; i < this.xs.length; ++i)
            ctx.lineTo(this.xs[i], this.ys[i]);
          ctx.lineTo(this.xs[0], this.ys[0]);
 
          if (this.picked) {
 
            ++this.time;
 
            if (this.time >= this.targetTime) {
 
              this.time = 0;
              this.targetTime = 0;
              this.picked = false;
            }
 
            ctx.fillStyle = ctx.shadowColor = this.color.replace('alp', Math.sin(prop * Math.PI));
            ctx.fill();
          } else {
 
            ctx.strokeStyle = ctx.shadowColor = opts.strokeColor;
            ctx.stroke();
          }
        }
 
        for (var x = 0; x < w; x += difX * 2) {
          var i = 0;
 
          for (var y = 0; y < h; y += difY) {
            ++i;
            hexs.push(new Hex(x + difX * (i % 2), y));
 
          }
        }
        loop();
 
        window.addEventListener('resize', function() {
 
          w = can.width = window.innerWidth;
          h = can.height = window.innerHeight;
          sum = w + h;
 
          if (can.width < window.innerWidth) {
            can.alpha = 0.5;
            can.opacity = 0.5;
          }
 
          hexs.length = 0;
          for (var x = 0; x < w; x += difX * 2) {
            var i = 0;
 
            for (var y = 0; y < h; y += difY) {
              ++i;
              hexs.push(new Hex(x + difX * (i % 2), y));
 
            }
          }
        });
      });
    });
  })(jQuery);
