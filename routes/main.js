'use strict';
let Account = require('../models/Account.js');

module.exports = function (app, loggedFalse) {
  app.get('/main', loggedFalse, (req, res) =>{
    Account.findOne({username: req.session.user['username']})
    .exec((err, data)=> { 
      let incorrectPassword = (req.query.incorrectPassword==undefined ? false : true);
      let makers = [];
      if (data.makers.length == 0) {
        makers.push({name: "There are no makers yet. Go to 'Manage Makers' and create them!", active: true});
        res.render(process.cwd() + '/views/main', {makers: makers, today: "nobody", last: "nobody", incorrectPassword: incorrectPassword});
      }else{
        data["makers"].forEach((maker)=>{
          var m = {};
          if (maker.active == true) {
            m["name"] = "- " + maker.name;
            m["active"] = true;
            makers.push(m);
          }
        });
        let last;
        let today;
        if (makers.length == 0) {
          makers.push({name: "There are no active makers :(", active: true});
          last = "nobody";        
          today = "nobody";
          res.render(process.cwd() + '/views/main', {makers: makers, today: today, last: last, incorrectPassword: incorrectPassword});
        }else if(makers.length == 1) {
          last = "no";        
          today = "body";
          res.render(process.cwd() + '/views/main', {makers: makers, today: today, last: last, incorrectPassword: incorrectPassword});
        }else if (data.last.date == undefined) {
          last = "nobody";        
          today = makers[0].name;
          res.render(process.cwd() + '/views/main', {makers: makers, today: today.slice(2, today.length), last: last, incorrectPassword: incorrectPassword});
        }else if(data.last.date != undefined){
          let tDate = new Date();
          tDate.setHours(0,0,0,0);
          //tDate.setDate(tDate.getDate() + 1);
          if (data.last.date.getTime()==tDate.getTime()) {
            res.render(process.cwd() + '/views/main', {makers: makers, today: data.last.name, last: data.last.name, incorrectPassword: incorrectPassword});
          }else{
            let makers = []
            data["makers"].forEach((maker)=>{
              var m = {};
              m["name"] = "- " + maker.name;
              m["active"] = maker.active;
              makers.push(m);
            });

            let next = false;
            let nextMaker;
            for(let i = 0; i<makers.length; i++) {
              let m = makers[i].name.slice(2, makers[i].length);;
              if (next==true) {
                if (makers[i].active == true) {
                  nextMaker = m;
                  i = makers.length;
                }else{
                  continue;
                }
              }
              if (m == data.last.name) {
                next = true;
                if (i == makers.length-1) {
                  i = -1;
                }
              }
            }

            res.render(process.cwd() + '/views/main', {makers: makers, today: nextMaker, last: data.last.name, incorrectPassword: incorrectPassword});
          }        
        }
      }
    })
  });

  app.post('/main/mark', (req, res) =>{
    let today = {name: req.query.today, date: new Date().toDateString()};
    let maker = {name: req.query.today, password: req.body.password}
    Account.findOneAndUpdate({username: req.session.user['username'],
                             "makers.name": {"$in": [maker.name]},
                             "makers.password": {"$in": [maker.password]}},
                             {last: today},
                             (err, accData)=>{
      console.log(accData);
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
              if (err) {
                res.redirect('/main?incorrectPassword=true');
              }else{
                res.redirect('/main');
              }
            }); 
          }
        }
    });
  });
  
  app.get('/main/makers', loggedFalse, (req, res) =>{
    var makers = [];
    Account.findOne({username: req.session.user['username']})
    .exec((err, data)=> { 
      if (data.makers.length == 0) {
        makers.push({name: "There are no makers yet", active: true});
        res.render(process.cwd() + '/views/makers', {makers: makers});
      }else{
        data["makers"].forEach((maker)=>{
          var m = {};
          //if (maker.active == true) {
          m["name"] = maker.name;
          m["active"] = (maker.active ? "active" : "inactive");
          makers.push(m);
          //}
        });

        res.render(process.cwd() + '/views/makers', {makers: makers});
      }
    })
  });
  
  app.post('/main/makers', loggedFalse, (req, res) =>{
    if (req.body.action == "add") {
      let newMaker = req.body.newMaker;
      let newPassword = req.body.newPassword;
      Account.findOne({username: req.session.user['username']})
      .exec((err, data)=> {
        data.makers.push({name: newMaker, password: newPassword, active: true});
        Account.findOneAndUpdate({username: req.session.user['username']},
                                 {makers: data.makers},
                                 (err, data)=>{
            if (err) {

            }else{
              res.redirect('/main/makers');
            }
        });
      });
    }else if(req.body.action == "changeActive"){
      let makerToChangeActive = req.body.newMaker;
      Account.findOne({username: req.session.user['username']})
      .exec((err, data)=> {
        if (err) {
          res.redirect('/main/makers');
        }else{
          let makers = [];
          data.makers.map((maker)=>{
            if (maker.name == makerToChangeActive) {
              (maker.active == true ? maker.active = false : maker.active = true);
            }
            makers.push(maker);
          });
          let maker = {name: req.body.newMaker, password: req.body.newPassword}
          Account.findOneAndUpdate({username: req.session.user['username'],
                                   "makers.name": {"$in": [maker.name]},
                                   "makers.password": {"$in": [maker.password]}},
                                   {makers: makers},
                                   (err, data)=>{
              if (err) {

              }else{
                res.redirect('/main/makers');
              }
          });
        }    
      });
    }else{
      Account.findOne({username: req.session.user['username']})
      .exec((err, data)=> {
        if (err) {
          res.redirect('/main/makers');
        }else{
          let makers = [];
          let m = req.body.newMaker;
          data.makers.map((maker)=>{
            if (maker.name != m) {
              makers.push(maker);
            }
          })    
          Account.findOneAndUpdate({username: req.session.user['username']},
                                   {makers: makers},
                                   (err, data)=>{
              if (err) {

              }else{
                res.redirect('/main/makers');
              }
          });
        }    
      });
    } 
  });
  
  app.get('/main/settings', loggedFalse, (req, res) =>{
    res.render(process.cwd() + '/views/settings');
  });
};