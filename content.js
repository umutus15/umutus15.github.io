console.log("JS beginning")

var json_data = {};
var random_entry = 0;
var tot_length;

$.ajax({
        url: "fake-news-filtered.json",
        async: false,
        dataType: 'json',
        success: function(json) {
            json_data = json;
            console.log("Sucessfully downloaded data..."); // this will show the info it in firebug console
            tot_length = JSON.parse(JSON.stringify(json)).length;
            console.log("Total entries: "+tot_length);
            random_entry = getRandomInt(tot_length);
            if(json[random_entry].reliability === "fake"){
              console.log("Its fake");
            }
            else{
              console.log("Its true");
            }
        }
});

//console.log(json_data[random_entry].title)

const d = new Date();
function generateRandomDate() {
return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
}

document.getElementById("myBtn").addEventListener("click", displayDate);

document.getElementById("myBtn2").addEventListener("click", displayDate2);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function displayDate() {
  $.ajax({
  url: 'https://randomuser.me/api/',
  dataType: 'json',
  success: function(data) {
  document.getElementById("changename").innerHTML =data.results[0].name.first+" "+data.results[0].name.last;
  document.getElementById("changeid").innerHTML = data.results[0].login.username;
  document.getElementById("changeimg").src = data.results[0].picture.thumbnail
  random_entry = getRandomInt(tot_length);
  document.getElementById("changetitle").innerHTML = json_data[random_entry].title;
  }
});
   document.getElementById("changedate").innerHTML = (new generateRandomDate()).toLocaleDateString('en-US');
}

function displayDate2() {
  console.log("???");
  $.ajax({
  url: 'https://randomuser.me/api/',
  dataType: 'json',
  success: function(data) {
 document.getElementById("changename").innerHTML =data.results[0].name.first+" "+data.results[0].name.last;
 document.getElementById("changeid").innerHTML = data.results[0].login.username;
 document.getElementById("changeimg").src = data.results[0].picture.thumbnail;
 random_entry = getRandomInt(tot_length);
 document.getElementById("changetitle").innerHTML = json_data[random_entry].title;
  }
});
   document.getElementById("changedate").innerHTML = (new generateRandomDate()).toLocaleDateString('en-US');
}