'use strict';
//Refactored but not satisfied
let Account = require('../models/Account.js');

function getMakers(makersList) {
  let makers = [];
  makersList.forEach((maker)=>{
    var m = {};
    m["name"] = maker.name;
    m["active"] = maker.active;
    makers.push(m);
  });
  return makers;
}

function getNextMaker(makers, data) {
  let next = false;
  let nextMaker;
  for(let i = 0; i<makers.length; i++) {
    let m = makers[i].name;
    if (next==true) {
      if (makers[i].active == true) {
        nextMaker = m;
        i = makers.length;
      }else{
        continue;
      }
    }
    if (m == data) {
      next = true;
      if (i == makers.length-1) {
        i = -1;
      }
    }
  }
  return nextMaker;
}

module.exports = function (app, loggedFalse) {
  //This is not working correctly when there is 1 or no makers!
  app.get('/main', loggedFalse, (req, res) =>{
    Account.findOne({username: req.session.user['username']})
    .exec((err, data)=> { 
      let incorrectPassword = (req.query.incorrectPassword==undefined ? false : true);
      let makers = getMakers(data["makers"]);
      let last;
      let today;
      if (data.makers.length == 0) { //No makers in account
        makers.push({name: "There are no makers yet. Go to 'Manage Makers' and create them!", active: true});
        today = "nobody";
        last = "nobody";
      }else if (makers.length == 0) { //No active makers in account
        makers.push({name: "There are no active makers :(", active: true});
        last = "nobody";        
        today = "nobody";
      }else if(makers.length == 1) { //Only 1 maker in account
        last = "no";
        today = "body";
      }else if (data.last.date == undefined) { //First 'mark' to be done
        last = "nobody";        
        let makersName = makers[0].name;
        today = makersName.slice(2, makersName.length);
      }else{ //???
        let tDate = new Date();
        tDate.setHours(0,0,0,0);
        //tDate.setDate(tDate.getDate() + 1);
        if (data.last.date.getTime()==tDate.getTime()) { //If today is the same last day they made coffee
          today = data.last.name;
          last = data.last.name;
        }else{
          today = getNextMaker(makers, data.last.name);
          last = data.last.name;
        }        
      }
      res.render(process.cwd() + '/views/app/main', {makers: makers, today: today, last: last, incorrectPassword: incorrectPassword});
    });
  });

  app.post('/main/mark', (req, res) =>{
    let today = {name: req.query.today, date: new Date().toDateString()};
    let maker = {name: req.query.today, password: req.body.password}
    Account.findOneAndUpdate({username: req.session.user['username'],
                             "makers.name": {"$in": [maker.name]},
                             "makers.password": {"$in": [maker.password]}},
                             {last: today},
                             (err, accData)=>{
        if (err) {
          res.json({error: "Something bad happened :c"});
        }else{
          if(accData==null){
            res.redirect('/main?incorrectPassword=true');
          }else{
            let history = accData.history;
            history.push(today);
            Account.findOneAndUpdate({username: req.session.user['username']},
                                     {history: history},
                                     (err, data)=>{
              (err ? res.redirect('/main?incorrectPassword=true') : res.redirect('/main'));
            }); 
          }
        }
    });
  });
  
  app.get('/main/makers', loggedFalse, (req, res) =>{
    Account.findOne({username: req.session.user['username']})
    .exec((err, data)=> {
      let makers = [];
      if (data.makers.length == 0) {
        makers.push({name: "There are no makers yet", active: true});
      }else{
        makers = getMakers(data["makers"]);
      }
      res.render(process.cwd() + '/views/app/makers', {makers: makers});
    })
  });
  
  app.post('/main/makers', loggedFalse, (req, res) =>{
    Account.findOne({username: req.session.user['username']})
      .exec((err, data)=> {
      if (err) {
        res.redirect('/main/makers');
      }else{
        let makers = [];
        let mName = req.body.newMaker;
        let mPassword = req.body.newPassword;
        switch(req.body.action) {
          case "add":
            data.makers.push({name: mName, password: mPassword, active: true});
            Account.findOneAndUpdate({username: req.session.user['username']},
                                     {makers: data.makers},
                                     (err, data)=>{
              (err ? res.json({"error": "There was an error."}) : res.redirect('/main/makers'));
            });
            break;
          case "changeActive":
            data.makers.map((maker)=>{
              if (maker.name == mName) {
                (maker.active == true ? maker.active = false : maker.active = true);
              }
              makers.push(maker);
            });
            let maker = {name: mName, password: mPassword};
            Account.findOneAndUpdate({username: req.session.user['username'],
                                     "makers.name": {"$in": [maker.name]},
                                     "makers.password": {"$in": [maker.password]}},
                                     {makers: makers},
                                     (err, data)=>{
              (err ? res.json({"error": "There was an error."}) : res.redirect('/main/makers'));
            });          
            break;
          case "delete":
            data.makers.map((maker)=>{
              if (maker.name != mName) {
                makers.push(maker);
              }
            })    
            Account.findOneAndUpdate({username: req.session.user['username']},
                                     {makers: makers},
                                     (err, data)=>{
                (err ? res.json({"error": "There was an error."}) : res.redirect('/main/makers'));
            });
            break;
          default:
            res.json({"error": "There was an error."})
            break;
        }
      }
    });
  });
  
  app.get('/main/settings', loggedFalse, (req, res) =>{
    res.render(process.cwd() + '/views/app/settings');
  });
};