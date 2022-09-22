$.getJSON("fake-news-filtered.json", function(json) {
    console.log("SUCCESS"); // this will show the info it in firebug console
});

const d = new Date();
function generateRandomDate() {
return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
}

document.getElementById("myBtn").addEventListener("click", displayDate);

document.getElementById("myBtn2").addEventListener("click", displayDate2);

function displayDate() {
  $.ajax({
  url: 'https://randomuser.me/api/',
  dataType: 'json',
  success: function(data) {
document.getElementById("changename").innerHTML =data.results[0].name.first+" "+data.results[0].name.last;
 document.getElementById("changeid").innerHTML = data.results[0].login.username;
  document.getElementById("changeimg").src = data.results[0].picture.thumbnail
  }
});
   document.getElementById("changedate").innerHTML = (new generateRandomDate()).toLocaleDateString('en-US');
}

function displayDate2() {
  $.ajax({
  url: 'https://randomuser.me/api/',
  dataType: 'json',
  success: function(data) {
document.getElementById("changename").innerHTML =data.results[0].name.first+" "+data.results[0].name.last;
 document.getElementById("changeid").innerHTML = data.results[0].login.username;
 document.getElementById("changeimg").src = data.results[0].picture.thumbnail
  }
});
   document.getElementById("changedate").innerHTML = (new generateRandomDate()).toLocaleDateString('en-US');
}
