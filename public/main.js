var data;

function getMonth(monthNumber) {
  let month = "";
  switch(monthNumber) {
    case 0:
      month="January";
      break;
    case 1:
      month="February";
      break;
    case 2:
      month="March";
      break;
    case 3:
      month="April";
      break;
    case 4:
      month="May";
      break;
    case 5:
      month="June";
      break;
    case 6:
      month="July";
      break;
    case 7:
      month="August";
      break;
    case 8:
      month="September";
      break;
    case 9:
      month="October";
      break;
    case 10:
      month="November";
      break;
    case 11:
      month="December";
      break;
  }    
  return month;
}

function getFirstDayOfMonth(actualDay, actualDayOfWeek) {
  while(actualDay != 0) {
    actualDay--;
    if(actualDayOfWeek==0) {
      actualDayOfWeek = 6;
    }else{
      actualDayOfWeek--;
    }      
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
    if ( m == month &&  y == year) {
      let obj = {};
      obj.name = maker.name;
      obj.date = new Date(maker.date).getDate();
      makers.push(obj);
    }
  });
  return makers;
}
function getMakersList() {
  let makers = [];
  data.makers.map((maker)=>{
    if (maker.active == true) {
      makers.push(maker.name);
    }
  })
  return makers;
}

function organizeDaysInCalendar(actualYear, actualMonth, actualDay, actualDayOfWeek) {
  let firstDay = getFirstDayOfMonth(actualDay, actualDayOfWeek);
  let history = getSpecificHistory(actualYear, actualMonth);
  console.log(history);
  let makersList = getMakersList();
  let emptyDays = 0;
  let days = 1;
  let lastDayMade;
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
  
  
  let week1 = document.getElementById('week1');
  
  for(let i = -1; i != firstDay; i++) {
    let td = document.createElement('td');
    week1.appendChild(td);
    emptyDays++;
  }
  
  for(let i = emptyDays; i != 7; i++) {
    let td = document.createElement('td');
    let day = document.createTextNode(i - (emptyDays-1));
    td.appendChild(day);
    if(days > lastDayMade && days >= actualDay) {
      let name = makersList[listField];
      td.onclick = () => alert("This day " + name + " has to make coffee.");
      if (listField>=makersList.length-1) {
        listField = 0;
      }else {
        listField++;
      }
    }else{
      for (var a = 0; a < history.length; a++) {
        if (history[a].date+1 == days) {
          let name = history[a].name;
          td.onclick = () => alert("This day " + name + " made coffee.");
        }
      }
    }
    week1.appendChild(td);
    days++;
  }
  
  let week2 = document.getElementById('week2');
  for(let i = 0; i != 7; i++) {
    let td = document.createElement('td');
    let day = document.createTextNode(days);
    td.appendChild(day);
    if(days > lastDayMade && days >= actualDay) {
      let name = makersList[listField];
      td.onclick = () => alert("This day " + name + " has to make coffee.");
      if (listField>=makersList.length-1) {
        listField = 0
      }else {
        listField++
      }
    }else{
      for (var a = 0; a < history.length; a++) {
        if (history[a].date+1 == days) {
          let name = history[a].name;
          td.onclick = () => alert("This day " + name + " made coffee.");
          td.className += "txt-made";
        }
      }
    }
    week2.appendChild(td);
    days++;
  }
  
  let week3 = document.getElementById('week3');
  for(let i = 0; i != 7; i++) {
    let td = document.createElement('td');
    let day = document.createTextNode(days);
    td.appendChild(day);
    if(days > lastDayMade && days >= actualDay) {
      let name = makersList[listField];
      td.onclick = () => alert("This day " + name + " has to make coffee.");
      if (listField>=makersList.length-1) {
        listField = 0
      }else {
        listField++
      }
    }else{
      for (var a = 0; a < history.length; a++) {
        if (history[a].date+1 == days) {
          let name = history[a].name;
          td.onclick = () => alert("This day " + name + " made coffee.");
          td.className += "txt-made";
        }
      }
    }
    week3.appendChild(td);
    days++;
  }
  
  let week4 = document.getElementById('week4');
  for(let i = 0; i != 7; i++) {
    let td = document.createElement('td');
    let day = document.createTextNode(days);
    td.appendChild(day);
    if(days > lastDayMade && days >= actualDay) {
      let name = makersList[listField];
      td.onclick = () => alert("This day " + name + " has to make coffee.");
      if (listField>=makersList.length-1) {
        listField = 0;
      }else {
        listField++;
      }
    }else{
      for (var a = 0; a < history.length; a++) {
        if (history[a].date+1 == days) {
          let name = history[a].name;
          td.onclick = () => alert("This day " + name + " made coffee.");
          td.className += "txt-made";
        }
      }
    }
    week4.appendChild(td);
    days++;
    
  }
  
  let lastDayOfMonth = (getLastDayOfMonth(actualYear, actualMonth)+1);
  let week5 = document.getElementById('week5');
  let daysInWeek = 0;
  for(let i = days; i != lastDayOfMonth; i++) {
    let td = document.createElement('td');
    let day = document.createTextNode(days);
    td.appendChild(day);
    if(days > lastDayMade && days >= actualDay) {
      let name = makersList[listField];
      td.onclick = () => alert("This day " + name + " has to make coffee.");
      if (listField>=makersList.length-1) {
        listField = 0
      }else {
        listField++
      }
    }else{
      for (var a = 0; a < history.length; a++) {
        if (history[a].date+1 == days) {
          let name = history[a].name;
          td.onclick = () => alert("This day " + name + " made coffee.");
          td.className += "txt-made";
        }
      }
    }
    week5.appendChild(td);
    days++;
    if (daysInWeek > 5) {
      break;
    }
    daysInWeek++;
  }
  
  let week6 = document.getElementById('week6');
  for(let i = days; i != lastDayOfMonth; i++) {
    let td = document.createElement('td');
    let day = document.createTextNode(days);
    td.appendChild(day);
    if(days > lastDayMade && days >= actualDay) {
      let name = makersList[listField];
      td.onclick = () => alert("This day " + name + " has to make coffee.");
      if (listField>=makersList.length-1) {
        listField = 0
      }else{
        listField++;
      }
    }else{
      for (var a = 0; a < history.length; a++) {
        if (history[a].date+1 == days) {
          let name = history[a].name;
          td.onclick = () => alert("This day " + name + " made coffee.");
          td.className += "txt-made";
        }
      }
    }
    week6.appendChild(td);
    days++;
  }
}

function getHistory() {  
  
  let request = new XMLHttpRequest()
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

/////////////////

//Interactions
function getNumberOfMonth(month) {
  let monthNumber = "";
  switch(month) {
    case "January":
      monthNumber=0;
      break;
    case "February":
      monthNumber=1;
      break;
    case "March":
      monthNumber=2;
      break;
    case "April":
      monthNumber=3;
      break;
    case "May":
      monthNumber=4;
      break;
    case "June":
      monthNumber=5;
      break;
    case "July":
      monthNumber=6;
      break;
    case "August":
      monthNumber=7;
      break;
    case "September":
      monthNumber=8;
      break;
    case "October":
      monthNumber=9;
      break;
    case "November":
      monthNumber=10;
      break;
    case "December":
      monthNumber=11;
      break;
  }
  return monthNumber;
}
function truncateTable() {
  document.getElementById('week1').innerText = "";
  document.getElementById('week2').innerText = "";
  document.getElementById('week3').innerText = "";
  document.getElementById('week4').innerText = "";
  document.getElementById('week5').innerText = "";
  document.getElementById('week6').innerText = "";
}

//Change month
function changeMonth(value) {
  let monthNumber = getNumberOfMonth(document.getElementById('month').innerText);
  if (value == -1 && monthNumber !=0) {
    monthNumber--;
    document.getElementById('month').innerText = getMonth(monthNumber);
  }else if(value == 1 && monthNumber !=11){
    monthNumber++;
    document.getElementById('month').innerText = getMonth(monthNumber);
  }
  truncateTable();
  let d = new Date(document.getElementById('year').innerText,monthNumber, 1);
  organizeDaysInCalendar(d.getFullYear(),
                         d.getMonth(),
                         d.getDate(),
                         d.getDay());
}

//Change year
function changeYear(value) {
  let year = parseInt(document.getElementById('year').innerText);
  if (value == -1 && year !=0) {
    year--;
    document.getElementById('year').innerText = year;
  }else{
    year++;
    document.getElementById('year').innerText = year;
  }
  
  changeMonth(0);
}

//////////////