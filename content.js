document.getElementById("myBtn").addEventListener("click", displayDate);

document.getElementById("myBtn").addEventListener("click", displayDate);

document.getElementById("myBtn2").addEventListener("click", displayDate2);

document.getElementById("myBtn2").addEventListener("click", displayDate2);

function displayDate() {
  document.getElementById("changename").innerHTML = "bbcuk";
  document.getElementById("changeid").innerHTML = "bbcnews";
   document.getElementById("changedate").innerHTML = Date();
  document.getElementById("changetitle").innerHTML = "Andrea Coppola said he would CONSIDER VOTING MELONI!";;
  document.getElementById("demo").innerHTML = "RANDOM NEW STUFF";
}

function displayDate2() {
  document.getElementById("changename").innerHTML = "cnnuk";
  document.getElementById("changeid").innerHTML = "cnnnews";
   document.getElementById("changedate").innerHTML = Date();
  document.getElementById("changetitle").innerHTML = "Umut Fidan HAS BEEN CAUGHT playbacking a C13#9 chord!";;
  document.getElementById("demo").innerHTML = "RANDOM NEW STUFF";
}
