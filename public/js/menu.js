/*This script puts the "active" class to the button associated to an URL*/
//Refactor pending...
let nav = document.getElementById("nav");
var navBtns = nav.getElementsByClassName("nav-btn");

console.log(navBtns.length);
if(navBtns.length == 4) {
  switch(window.location.toString()) {
    case "https://coffeefy.glitch.me/main":
      navBtns[0].className += " nav-btn-active";
      break;
    case "https://coffeefy.glitch.me/main/makers":
      navBtns[1].className += " nav-btn-active";
      break;
    case "https://coffeefy.glitch.me/main/settings":
      navBtns[2].className += " nav-btn-active";
      break;  
  };
}else{
  switch(window.location.toString()) {
    case "https://coffeefy.glitch.me/main":
      navBtns[0].className += " nav-btn-active";
      break;
    case "https://coffeefy.glitch.me/main/settings":
      navBtns[1].className += " nav-btn-active";
      break;  
  };
}