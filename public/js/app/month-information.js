//The function names are very descriptive
function getMonth(monthNumber) {
  let months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  return months[monthNumber];
}
function getNumberOfMonth(month) {
  let months = {'January' : '0', 'February' : '1', 'March' : '2', 'April' : '3', 'May' : '4', 'June' : '5',
                'July' : '6', 'August' : '7', 'September' : '8', 'October' : '9', 'November' : '10', 'December' : '11'};
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