'use strict';
//Refactor pending!!!
let Account = require('../models/Account.js');

let bcrypt  = require('bcrypt');
let saltRounds = 12;

module.exports = function (app, loggedTrue) {
  
  //Login to Account OR Create Account
  app.get("/login", loggedTrue, (req, res) => {
    if (req.query.exists == 'false') {
      res.render(process.cwd() + '/views/login', {exists: false});
    }else{
      res.render(process.cwd() + '/views/login');
    }
  });  
  
  app.get('/signup', loggedTrue, (req, res)=>{
    res.render(process.cwd() + '/views/signup');
  });
  
  //Create an Account
  app.post('/signup', loggedTrue, (req, res) => {
    bcrypt.hash(req.body.username, saltRounds, function(err, hash) {
      let url = hash;
      let makers =[{name: req.body.maker, password: req.body.password, active: true, times: 0, admin: true}];
      let acc = new Account({username: req.body.username, password: req.body.accPassword, accountUrl: url,
                             sortingMode: req.body.mode, makers: makers, last: {}, history: []});
      acc.save((err, data) => {
        if (err){
          (err.code == 11000 ? res.redirect('login/?already=true') : res.json({error: err}));
        }else{
          res.render(process.cwd() + '/views/signup-success');
        }
      });
    });
  });
  
  //Going to Account-Login
  app.post('/signin', loggedTrue, (req, res) => {
    Account.findOne({ username: req.body.username, password: req.body.password})
    .exec((err, data) =>{
      if (err || data == null || data.length == 0) {
         res.redirect('login/?exists=false');
      }else{
        res.redirect('/check-account-login?account=' + req.body.username);
      }
    });
  });
  
  //Check if account's url exists
  app.get("/check-account-login", loggedTrue, (req, res)=>{
    let check = req.query.account;
    Account.findOne({ username: req.query.account})
    .exec((err, data) =>{
      bcrypt.compare(check, data.accountUrl, (err, response)=>{
        res.redirect(response ? ('/account-login?account=' + data.accountUrl) : 'login/?exists=false');
      });
    });
  });
  
  //Own login
  app.get("/account-login", loggedTrue, (req, res)=>{
    if (req.query.account==undefined || req.query.account == "undefined") {
      res.redirect("/login");
    }else{
      Account.findOne({ accountUrl: req.query.account})
      .exec((err, data) =>{
        if(err || data==null || data.length==0) {
          res.redirect('/login/?exists=false');
        }else{
          let account = {name: data.username, url: data.accountUrl};
          res.render(process.cwd() + "/views/account-login", {account: account, error: (req.query.error ? true : false)});
        }
      });
    }
  });
  
  app.post("/signup-maker", loggedTrue, (req, res)=>{
    if (req.query.accountUrl==undefined || req.query.accountUrl == "undefined") {
      res.redirect("/login");
    }else{
      Account.findOne({ accountUrl: req.query.accountUrl})
      .exec((err, data) =>{
        if(err || data==null || data.length==0) {
          console.log("Error: " + err);
          res.redirect('/login/?exists=false');
        }else{
          
          data.makers.push({name: req.body.maker, password: req.body.password, active: true, times: 0, admin: false});
            Account.findOneAndUpdate({accountUrl: req.query.accountUrl},
                                     {makers: data.makers},
                                     (err, data)=>{
              if (err) {
                console.log(err);
              }else{
                res.redirect('/account-login?account='+req.query.accountUrl);
              }
            });
        }
      });
    }
  });
  
  //To do
  app.post("/loginIntoAccount", loggedTrue, (req, res)=>{
    let maker = {name: req.body.username, password: req.body.password};
    Account.findOne({username: req.query.account,
                     "makers.name": {"$in": [maker.name]},
                     "makers.password": {"$in": [maker.password]}},
                    (err, accData)=>{
      if (err) {
        res.redirect('/account-login?error=true&account=' + req.query.accountUrl);//Connection error?
      }else if(accData == null || accData.length == 0){
        res.redirect('/account-login?error=true&account=' + req.query.accountUrl);
      }else{
        let position = accData.makers.map((x)=>{return x.name}).indexOf(maker.name);
        req.session.loggedIn = true;
        req.session.account = accData;
        req.session.admin = accData.makers[position].admin;
        req.session.maker = accData.makers[position].name;
        if (accData.makers[position].active == false) {
          accData.makers[position].active = true;
          Account.findOneAndUpdate({accountUrl: req.query.accountUrl},
                                   {makers: accData.makers},
                                   (err, data)=>{ 
          });
        }
        res.redirect('/main');
      }
    });
  });
}