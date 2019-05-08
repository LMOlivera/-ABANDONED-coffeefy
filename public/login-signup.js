const container = document.getElementById('container');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');

if (localStorage.panel == undefined) {
  localStorage.panel = "left";
}else{
  if (localStorage.panel == "right") {
    container.classList.add('right-panel-active');
  }
}

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
  localStorage.panel = "right";
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
  localStorage.panel = "left";
});
