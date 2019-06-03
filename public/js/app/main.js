/*  
*  The order of files is:
*  - month-information.js
*  - main.js
*  - interaction.js
*/
'use strict';
let data;

function requestError() {
  document.getElementById('calendar').innerText = "Error ocurred when trying to get data from server, so you can't see the calendar :(";
}

//This gets the maker and the date of making
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

//This function could use some serious refactor
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
          requestError();
        }else{
          let d = new Date();
          d.setHours(0,0,0,0);
          let dateObject = {year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), dayOfWeek: d.getDay()}
          document.getElementById('year').innerText = dateObject.year;
          document.getElementById('month').innerText = getMonth(dateObject.month);
          organizeDaysInCalendar(dateObject.year, dateObject.month, dateObject.day, dateObject.dayOfWeek);
        }
      } else {
        requestError();
      }
    }catch(e){
      requestError();
    }    
  }
  request.send();
}

getHistory();