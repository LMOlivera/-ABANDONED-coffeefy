'use strict';
//Refactor OK

let loginSignup = require('./routes/login.js');
let main = require('./routes/main.js');

function loggedTrue(req, res, next) {
  (req.session.loggedIn==true ? res.redirect('/main') : next());
}

function loggedFalse(req, res, next) {
  (req.session.loggedIn!=true ? res.redirect('/') : next());
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