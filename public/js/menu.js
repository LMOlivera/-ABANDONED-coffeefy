/*This script puts the "active" class to the button associated to an URL*/
let nav = document.getElementById("nav");
var navBtns = nav.getElementsByClassName("nav-btn");

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