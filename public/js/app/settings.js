//Make HTTP requests to API
function saveNewName() {
  try{
    var url = '/api/settings/changeMakersName';
    let name = document.getElementById('makerName').value;
    var data = {name: name};
    if (name=="") {
      throw new Error();
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {alert(response.message); window.location.href = '/main/logout';});
  }catch(e){
    alert("There was an error when trying to save your new name. Please try again.")
  }
}

function saveNewPassword() {
  try{
    var url = '/api/settings/changeMakersPassword';
    let password = document.getElementById('makerPassword').value;
    var data = {password: password};
    if (password=="") {
      throw new Error();
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {alert(response.message); window.location.href = '/main/logout';});
  }catch(e){
    alert("There was an error when trying to save your new password. Please try again.")
  }
}

function deactivateMaker() {
  try{
    var url = '/api/settings/deactivateMaker';
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify({data: ""}),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {alert(response.message); window.location.href = '/main/logout';});
  }catch(e){
    alert("There was an error when trying to deactivate your user. Please try again.")
  }
}

//Toggle paragraph containing deleteMaker
function caution() {
  let x = document.getElementById("caution");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

//BECAREFUL, it's powerful!
function deleteMaker() {
  try{
    var url = '/api/settings/deleteMaker';
    fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({data: ""}),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {alert(response.message); window.location.href = '/main/logout';});
  }catch(e){
    alert("There was an error when trying to deactivate your user. Please try again.")
  }
}