//Show makers list (right panel)
function showMakers() {
  let box = document.getElementById("makers-box").style;
  if (box.width=="0px"|| box.width=='') {
    box.width = "200px";
    box.padding = "2vw";
  }else{
    box.width = "0";
    box.padding = "0";
  }
}

//Show password input to validate making today
function showMarker() {
  let box = document.getElementById("mark").style;
  ((box.display=="none"|| box.display=='') ? box.display="block" : box.display="none");
}

//Show password input to validate making someone else made today
function showMarkerForSomeoneElse() {
  let box = document.getElementById("mark-someone-else").style;
  ((box.display=="none"|| box.display=='') ? box.display="block" : box.display="none");
}

//Cleans calendar for new month
function truncateTable() {
  for(let i = 0; i < 6; i++) {
    document.getElementById('week' + (i+1)).innerText = "";
  }
}

// Change month/year in calendar (THERE ARE NO ERRORS, THE THINGS ARE IN main.js)
function changeMonth(value) {
  let monthNumber = getNumberOfMonth(document.getElementById('month').innerText);
  if (value == -1 && monthNumber !=0) {
    monthNumber--;
  }else if(value == 1 && monthNumber !=11){
    monthNumber++;    
  }
  document.getElementById('month').innerText = getMonth(monthNumber);
  truncateTable(); //Defines in "interactions.js"
  let d = new Date(document.getElementById('year').innerText,monthNumber, 1);
  organizeDaysInCalendar(d.getFullYear(), d.getMonth(), d.getDate(), d.getDay());
}
function changeYear(value) {
  let year = parseInt(document.getElementById('year').innerText);
  (value == -1 && year !=0 ? year-- : year++)
  document.getElementById('year').innerText = year;
  changeMonth(0);
}

//WIP
function whatIfSomeoneCant() {
  alert("WIP");
}