'use strict';

let Account = require('../models/Account.js');

function makersController() {  
  this.getIndexOfMaker = function(makers, maker) {
    for(var i = 0; i < makers.length; i += 1) {
      if(makers[i]['name'] == maker) {
          return i;
      }
    }
    return -1;
  }
  
  this.getEveryMaker = function(userSession, callback) {
    Account.findOne({username: userSession})
    .exec((err, data)=> {
      let makers = [];
      if (data.makers.length == 0) {
        makers.push({name: "There are no makers yet", active: true});
        callback(makers);
      }else{
        makers = this.getMakersNameAndActive(data["makers"]);
        callback(makers);
      }      
    });
  }
  
  this.getActiveMakers = function(makers) {
    let activeMakers = [];
    makers.forEach((maker)=>{
      if (maker.active == true){
        let m = {};
        m["name"] = maker.name;
        activeMakers.push(m);
      }
    });
    return activeMakers;
  }
  
  this.getMakersNameAndActive = function(makersList) {
    let makers = [];
    makersList.forEach((maker)=>{
      var m = {};
      m["name"] = maker.name;
      m["active"] = maker.active;
      makers.push(m);
    });
    return makers;
  }
  
  this.getNextMaker = function(makers, data) {    
    let index = this.getIndexOfMaker(makers, data);
    if (index==-1) {
      //WHAT DO?
    }else{
      if (index>makers.length-1) {
        return makers[0].name;
      }else{
        return makers[index+1].name;
      }
      
    }
    
  }
  
  this.passwordCheck = (incorrectPassword)=>{ incorrectPassword == undefined ? false : true };
  
  this.importantInfo = function(data) {    
    let makers = this.getActiveMakers(data["makers"]);
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
      if (data.last.date.getTime()==tDate.getTime()) { //If today is the same as the last day they made coffee
        today = data.last.name;
        last = data.last.name;
      }else{
        today = this.getNextMaker(makers, data.last.name);
        last = data.last.name;
      }        
    }
    return [makers, today, last];
  }
  
  //These needs improvements
  this.mark = function(req, callback) {
    let today = {name: req.query.today, date: new Date().toDateString()};
    let maker = {name: req.query.today, password: req.body.password}
    Account.findOneAndUpdate({username: req.session.user['username'],
                             "makers.name": {"$in": [maker.name]},
                             "makers.password": {"$in": [maker.password]}},
                             {last: today},
                             (err, accData)=>{
        if (err) {
          callback(0);
        }else{
          if(accData==null){
            callback(1);
          }else{
            //Update history
            let history = accData.history;
            history.push(today);
            
            //Update "times" counter in makers
            let makers = accData.makers;
            makers.map((m)=>{
              if (m.name == maker.name) {
                m.times += 1;
              }
            });
            
            /*Sort makers by their "times" counter
            makers.sort(( a, b ) => {
              if ( a.times < b.times ){
                return 1;
              }
              if ( a.times > b.times ){
                return -1;
              }
              return 0;
            });*/            
            
            Account.findOneAndUpdate({username: req.session.user['username']},
                                     {history: history, makers: makers},
                                     (err, data)=>{
              if(err) {
                callback(1);
              }else{
                callback(2);
              };
            }); 
          }
        }
    });    
  }
  this.POSTMaker = function(req, callback) {
    Account.findOne({username: req.session.user['username']})
      .exec((err, data)=> {
      if (err) {
        console.log(err);
        callback(0);
      }else{
        let makers = [];
        let mName = req.body.newMaker;
        let mPassword = req.body.newPassword;
        switch(req.body.action) {
          case "add":
            data.makers.push({name: mName, password: mPassword, active: true, times: 0});
            Account.findOneAndUpdate({username: req.session.user['username']},
                                     {makers: data.makers},
                                     (err, data)=>{
              if (err) {
                console.log(err)
                callback(1);
              }else{
                callback(0);
              }
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
              if (err) {
                console.log(err)
                callback(1);
              }else{
                callback(0);
              }
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
                (err ? callback(1) : callback(0));
            });
            break;
        }
      }
    });
  }
}

module.exports = makersController;