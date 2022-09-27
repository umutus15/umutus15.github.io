
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
      effect = "positive";
      document.getElementById("bg").classList.add("positive-bg");
    }
    if(action == "liked") {
      sendOSCPositiveMessage("single");
      effect = "positive";
      document.getElementById("bg").classList.add("positive-bg");
    }
    if(action == "reported") {
      sendOSCNegativeMessage("single");
      effect = "negative";
      document.getElementById("bg").classList.add("negative-bg");
    }
  }
  if (news.reliability == "fake") {
    reliability = "unreliable";
    if(action == "shared") {
      sendOSCNegativeMessage("group");
      effect = "negative";
      document.getElementById("bg").classList.add("negative-bg");
    }
    if(action == "liked") {
      sendOSCNegativeMessage("single");
      effect = "negative";
      document.getElementById("bg").classList.add("negative-bg");
    }
    if(action == "reported") {
      sendOSCPositiveMessage("single")
      effect = "positive";
      document.getElementById("bg").classList.add("positive-bg");
    }
  }
  
  document.getElementById("overlay-txt").innerHTML += "The news you " + action + " was <b>"+reliability+".</b>"; 
  document.getElementById("overlay-txt").innerHTML += "<br>This will have a <b>" + effect + "</b> effect.";  
  
  if(action == "shared") {
    document.getElementById("overlay-txt").innerHTML += "<br> Head over to the map to share it to the world.";
  }
  else {
    document.getElementById("overlay-txt").innerHTML += "<br> A random citizen has started spreading it.";
  }
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

document.getElementById("overlay").addEventListener("click", hide_overlay);
change_news();




