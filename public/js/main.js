let data;

function getMonth(monthNumber) {
  let months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  return months[monthNumber];
}
function getNumberOfMonth(month) {
  let months = {'January' : '0',
                'February' : '1',
                'March' : '2',
                'April' : '3',
                'May' : '4',
                'June' : '5',
                'July' : '6',
                'August' : '7',
                'September' : '8',
                'October' : '9',
                'November' : '10',
                'December' : '11'}
  return months[month.toString()];
}

function getFirstDayOfMonth(actualDay, actualDayOfWeek) {
  while(actualDay != 0) {
    actualDay--;
    (actualDayOfWeek==0 ? actualDayOfWeek = 6 : actualDayOfWeek--)
  }
  return actualDayOfWeek;
}
function getLastDayOfMonth(y,m){
  return new Date(y, m +1, 0).getDate();
}

//This gets the maker and ONLY the DATE of making
function getSpecificHistory(year, month) {
  let makers = [];
  let h = data.history;
  h.forEach((maker)=>{
    let m = new Date(maker.date).getMonth();
    let y = new Date(maker.date).getFullYear();
    let obj = {};
    if ( m == month &&  y == year) {      
      obj.name = maker.name;
      obj.date = new Date(maker.date).getDate();
      makers.push(obj);
    }
  });
  return makers;
}

function organizeDaysInCalendar(actualYear, actualMonth, actualDay, actualDayOfWeek) {
  let firstDay = getFirstDayOfMonth(actualDay, actualDayOfWeek);
  let history = getSpecificHistory(actualYear, actualMonth);
  let makersList = data.makers;
  let emptyDays = 0;
  let days = 1;
  let lastDayMade;
  //I can't remember why I did this :c
  try{
    lastDayMade = history[history.length-1].date+1;  
  }catch(e){
    lastDayMade = 0;
  }
  let obj = history.find(maker => maker.date+1 == lastDayMade);
  let listField;
  try{
    listField = makersList.indexOf(obj.name)+1;
  }catch(e){
    listField = 0;
  }
  console.log(makersList[listField].name);
  //////////////////////////////////////
  
  
  //There must be a way of mergin weeks together
  let week1 = document.getElementById('week1');
  //Empty days from previous month
  if (firstDay != 6) { //Not Saturday?
    for(let i = -1; i != firstDay; i++) {
      let td = document.createElement('td');
      week1.appendChild(td);
      emptyDays++;
    }
  } else {
    emptyDays = 0;
  }
  
  //Week 1
  for(let i = emptyDays; i != 7; i++) {
    let td = document.createElement('td');
    let day = document.createTextNode(i - (emptyDays-1));
    td.appendChild(day);
    if(days > lastDayMade && days >= actualDay) {
      //This is not working well
      let name = makersList[listField].name;
      td.onclick = () => alert("This day " + name + " has to make coffee.");
      if (listField>=makersList.length-1) {
        listField = 0;
      }else {
        listField++;
      }
    }else{
      for (let a = 0; a < history.length; a++) {
        if (history[a].date+1 == days) {
          let name = history[a].name;
          td.className += "txt-made";
          td.setAttribute("tooltip", name.toString());
          td.setAttribute("tooltip-position", "top");
        }
      }
    }
    week1.appendChild(td);
    days++;
  }
    
  //Week 2 to 4
  for(let w = 2; w < 5; w++) {
    let week = document.getElementById('week' + w);
    for(let i = 0; i != 7; i++) {
      let td = document.createElement('td');
      let day = document.createTextNode(days);
      td.appendChild(day);
      if(days > lastDayMade && days >= actualDay) {
        //This is not working well
        let name = makersList[listField].name;
        td.onclick = () => alert("This day " + name + " has to make coffee.");
        if (listField>=makersList.length-1) {
          listField = 0
        }else {
          listField++
        }
      }else{
        for (let a = 0; a < history.length; a++) {
          if (history[a].date+1 == days) {
            let name = history[a].name;
            td.className += "txt-made";
            td.setAttribute("tooltip", name.toString());
            td.setAttribute("tooltip-position", "top");
          }
        }
      }
      week.appendChild(td);
      days++;
    } 
  }
  
  let lastDayOfMonth = (getLastDayOfMonth(actualYear, actualMonth)+1);  
  let daysInWeek = 0;
  //Week 5 & 6
  for(let w = 5; w < 7; w++) {
    let week = document.getElementById('week' + w);
    for(let i = days; i != lastDayOfMonth; i++) {
      let td = document.createElement('td');
      let day = document.createTextNode(days);
      td.appendChild(day);
      if(days > lastDayMade && days >= actualDay) {
        //This is not working well
        let name = makersList[listField].name;
        td.onclick = () => alert("This day " + name + " has to make coffee.");
        if (listField>=makersList.length-1) {
          listField = 0
        }else {
          listField++
        }
      }else{
        for (let a = 0; a < history.length; a++) {
          if (history[a].date+1 == days) {
            let name = history[a].name;
            td.className += "txt-made";
            td.setAttribute("tooltip", name.toString());
            td.setAttribute("tooltip-position", "top");
          }
        }
      }
      week.appendChild(td);
      days++;
      if (daysInWeek > 5) {
        break;
      }
      daysInWeek++;
    }
  }
}

function getHistory() {  
  let request = new XMLHttpRequest();
  request.open('GET', '/api/calendar', true);
  request.onload = function() {
    try {
      data = JSON.parse(this.response);    
      if (request.status >= 200 && request.status < 400) {
        if (data == {error: "error"}) {
          document.getElementById('calendar').innerText = "Error ocurred when trying to get data from server, so you can't see the calendar :(";
        }else{
          let d = new Date();
          d.setHours(0,0,0,0);
          let dateObject = {year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), dayOfWeek: d.getDay()}
          document.getElementById('year').innerText = dateObject.year;
          document.getElementById('month').innerText = getMonth(dateObject.month);
          organizeDaysInCalendar(dateObject.year, dateObject.month, dateObject.day, dateObject.dayOfWeek);
        }
      } else {
        document.getElementById('calendar').innerText = "Error ocurred when trying to get data from server, so you can't see the calendar :(";
      }
    }catch(e){
      document.getElementById('calendar').innerText = "Error ocurred when trying to get data from server, so you can't see the calendar :(";
    }    
  }
  request.send();
}


//Interactions
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

function showMarker() {
  let box = document.getElementById("mark").style;
  ((box.display=="none"|| box.display=='') ? box.display="block" : box.display="none");
}

function whatIfSomeoneCant() {
  alert("If someone can't make coffee you have two options. The first one is that if that person will be unable to make coffee in a while, you should go to 'manage makers' and deactivate him/her, you can activate the maker later. If it's something more specific, someone else can make coffee and use the 'someone else offer to maker cofee instead' button.");
}

function showMarkerForSomeoneElse() {
  let box = document.getElementById("mark-someone-else").style;
  ((box.display=="none"|| box.display=='') ? box.display="block" : box.display="none");
}

function truncateTable() {
  for(let i = 0; i < 6; i++) {
    document.getElementById('week' + (i+1)).innerText = "";
  }
}

function changeMonth(value) {
  let monthNumber = getNumberOfMonth(document.getElementById('month').innerText);
  if (value == -1 && monthNumber !=0) {
    monthNumber--;
  }else if(value == 1 && monthNumber !=11){
    monthNumber++;    
  }
  document.getElementById('month').innerText = getMonth(monthNumber);
  truncateTable();
  let d = new Date(document.getElementById('year').innerText,monthNumber, 1);
  organizeDaysInCalendar(d.getFullYear(), d.getMonth(), d.getDate(), d.getDay());
}

function changeYear(value) {
  let year = parseInt(document.getElementById('year').innerText);
  (value == -1 && year !=0 ? year-- : year++)
  document.getElementById('year').innerText = year;
  changeMonth(0);
}
//////////////

getHistory();