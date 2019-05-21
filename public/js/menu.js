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

/* Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < navBts.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");

    // If there's no active class
    if (current.length > 0) {
      current[0].className = current[0].className.replace(" active", "");
    }

    // Add the active class to the current/clicked button
    this.className += " active";
  });
} */