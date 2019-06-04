//Make HTTP requests to API
function saveNewName() {
  let request = new XMLHttpRequest();
  request.open("POST", '/api/', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({
      value: "value"
  }));
}