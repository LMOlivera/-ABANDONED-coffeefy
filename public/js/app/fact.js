let request = new XMLHttpRequest();
request.open('GET', '/api/fact', true);
request.onload = function() {
  try {
    let data = JSON.parse(this.response);    
    if (request.status >= 200 && request.status < 400) {
      if (data == {error: "error"}) {
        //
      }else{
        document.getElementById("fact-text").innerHTML  = data.factText;
        document.getElementById("fact-source").innerHTML  = data.source;
      }
    } else {
      //
    }
  }catch(e){
    //
  }    
}
request.send();