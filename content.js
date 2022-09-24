console.log("JS beginning")

var json_data = {}; //where our news titles are stored
var current_news = {};
var tot_length; // total entries in database

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
//console.log(json_data[random_entry].title)//testing


//Associate buttons with functions
document.getElementById("likebutton").addEventListener("click", like_button);
document.getElementById("sharebutton").addEventListener("click", share_button);;
document.getElementById("reportbutton").addEventListener("click", report_button);


const d = new Date(); // date variable for tweet date

function like_button() {
  console.log("Pressed Like!")
  change_news();
}
function share_button() {
  console.log("Pressed Share!")
  change_news();
}
function report_button() {
  console.log("Pressed Report!")
  change_news();
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

change_news()