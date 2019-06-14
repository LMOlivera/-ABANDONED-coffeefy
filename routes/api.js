'use strict';
//Refactor OK
let Account = require('../models/Account.js');
let Fact = require('../models/Fact.js');

let mHandler = require('../controllers/makersHandler.js');
let makersHandler = new mHandler();

module.exports = function (app) {
  app.route('/api/calendar')
    .get(function (req, res){
    try{
      Account.findOne({username: req.session.account['username']})
        .exec((err, data)=> {        
        (err ? res.json({error: "error"}) : res.json({history: data.history, makers: makersHandler.getActiveMakers(data.makers)}));
      });
    }catch(e){
      res.json({error: "error"});
    }
  });
  
  //Make new routes for setting
  app.route('/api/settings/changeMakersName')
    .post((req, res) => {
    try{
      Account.findOne({username: req.session.account['username']})
        .exec((err, data)=> {   
          //search user 
          let position = makersHandler.getIndexOfMaker(data.makers, req.session.maker);
          data.makers[position].name = req.body.name;
          data.history.map((made) => {
            if (made.name == req.session.maker) {
              made.name = req.body.name;
            }
          });
          //Save new user name and overwritte name in session
          Account.findOneAndUpdate({username: req.session.account['username']},
                                   {makers: data.makers, history: data.history})
            .exec((err, newData)=> {
              if (err) {
                res.json({error: "error"});
              }else{
                res.json({message:"Your new name was saved in the database. You will be logged out to refresh the website."});
              }
          });
      });
      
    }catch(e){
      res.json({error: "error"});
    }
  });  
  
  app.route('/api/settings/changeMakersPassword')
    .post((req, res) => {
    try{
      Account.findOne({username: req.session.account['username']})
        .exec((err, data)=> {   
          //search user 
          let position = makersHandler.getIndexOfMaker(data.makers, req.session.maker);
          data.makers[position].password = req.body.password;
          //Save new user pass
          Account.findOneAndUpdate({username: req.session.account['username']},
                                   {makers: data.makers})
            .exec((err, newData)=> {
              if (err) {
                res.json({error: "error"});
              }else{
                res.json({message:"Your new password was saved in the database. You will be logged out to refresh the website."});
              }
          });
      });
      
    }catch(e){
      res.json({error: "error"});
    }
  });  
  
  app.route('/api/settings/deactivateMaker')
    .put((req, res) => {
    try{
      Account.findOne({username: req.session.account['username']})
        .exec((err, data)=> {   
          //search user 
          let position = makersHandler.getIndexOfMaker(data.makers, req.session.maker);
          data.makers[position].active = false;
          //Save deactivation
          Account.findOneAndUpdate({username: req.session.account['username']},
                                   {makers: data.makers})
            .exec((err, newData)=> {
              if (err) {
                res.json({error: "error"});
              }else{
                res.json({message:"You are now deactivated and won't appear in the list. Log in again to be reactivated."});
              }
          });
      });
      
    }catch(e){
      res.json({error: "error"});
    }
  });  
  
  app.route('/api/settings/deleteMaker')
    .delete((req, res) => {
    try{
      Account.findOne({username: req.session.account['username']})
        .exec((err, data)=> {   
          //search user 
          let position = makersHandler.getIndexOfMaker(data.makers, req.session.maker);
          let newMakers = [];
          data.makers.map((maker)=>{
            if(maker.name != req.session.maker) {
              newMakers.push(maker);
            }
          });
          //Save deactivation
          Account.findOneAndUpdate({username: req.session.account['username']},
                                   {makers: newMakers})
            .exec((err, newData)=> {
              if (err) {
                res.json({error: "error"});
              }else{
                res.json({message:"Your account has been deleted..."});
              }
          });
      });      
    }catch(e){
      res.json({error: "error"});
    }
  }); 
  
  app.get('/api/fact', (req, res)=>{
    Fact.find({},(err, data)=>{
      res.json(data[Math.floor((Math.random()*(data.length-1))+0)]);
    });    
  });
};