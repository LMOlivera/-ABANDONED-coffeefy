'use strict';
//Refactor OK
let Account = require('../models/Account.js');

module.exports = function (app, loggedTrue) {

  app.get("/login-signup", loggedTrue, (req, res) => {
    if (req.query.already == 'true') {
      res.render(process.cwd() + '/views/login-signup', {already: true});
    }else if (req.query.exists == 'false') {
      res.render(process.cwd() + '/views/login-signup', {exists: false});
    }else{
      res.render(process.cwd() + '/views/login-signup');
    }
  });  

  app.post('/signup', loggedTrue, (req, res) => {
    let acc = new Account({username: req.body.username,
                           password: req.body.password,
                           makers: [],
                           last: {},
                           history: []});
    acc.save((err, data) => {
      if (err){
        (err.code == 11000 ? res.redirect('login-signup/?already=true') : res.json({error: err}));
      }else{
        res.render(process.cwd() + '/views/signup-success');
      }
    });
  });

  app.post('/signin', loggedTrue, (req, res) => {
    Account.findOne({ username: req.body.username, password: req.body.password})
    .exec((err, data) =>{
      if (err || data == null || data.length == 0) {
         res.redirect('login-signup/?exists=false');
      }else{
        req.session.loggedIn = true;
        req.session.user = data;
        res.redirect('/main');
      }
    });
  });
}