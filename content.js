console.log("JS beginning")

var json_data = {}; //where our news titles are stored
var random_entry = 0; //var for picking random news
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
            random_entry = getRandomInt(tot_length);
        }
});
//console.log(json_data[random_entry].title)//testing


//Associate buttons with functions
document.getElementById("myBtn").addEventListener("click", real_button);

document.getElementById("myBtn2").addEventListener("click", fake_button);

const d = new Date(); // date variable for tweet date

function real_button() {
  console.log("real button")
  change_news();
}

function fake_button() {
  console.log("fake button");
  change_news();
}

// Helper functions:
function change_news(){
  $.ajax({
    url: 'https://randomuser.me/api/',
    dataType: 'json',
    success: function(data) {
        document.getElementById("changename").innerHTML =data.results[0].name.first+" "+data.results[0].name.last;//change name of person
        document.getElementById("changeid").innerHTML = data.results[0].login.username;//change username
        document.getElementById("changeimg").src = data.results[0].picture.thumbnail;//change profile picture
        random_entry = getRandomInt(tot_length);//get random number for database
        document.getElementById("changetitle").innerHTML = json_data[random_entry].title; //change title, get random entry from database
    }
  });
  document.getElementById("changedate").innerHTML = (new generateRandomDate()).toLocaleDateString('en-US'); //change date of the tweet
}

function generateRandomDate() { // Func for generating date between two days
  return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
}
function getRandomInt(max) { // Func for getting random int until max value provided
  return Math.floor(Math.random() * max);
}

function fake_or_real(random_entry){ //func for detecting fake or real
            if(json[random_entry].reliability === "fake"){ 
              return 0
            }
            else{
              return 1
            }
}