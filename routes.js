'use strict';

//Routes files
let loginSignup = require('./routes/login-signup.js');
let main = require('./routes/main.js');

function loggedTrue(req, res, next) {
  if (req.session.loggedIn==true) {
    res.redirect('/main');
  }else{
    next();
  }
}

function loggedFalse(req, res, next) {
  if (req.session.loggedIn!=true) {
    res.redirect('/');
  }else{
    next();
  }
}

module.exports = function (app) {  
  app.get("/", loggedTrue, (req, res) =>{
    res.render(process.cwd() + '/views/welcome');
  });
  
  loginSignup(app, loggedTrue);
  
  main(app, loggedFalse);
  
  app.get('/main/logout', (req, res) =>{
    req.session.destroy();
    res.redirect('/');
  });
  
  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Error 404: Page Not Found');
  });
}