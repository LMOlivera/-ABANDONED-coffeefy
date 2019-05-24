'use strict';
//Refactor OK
let Account = require('../models/Account.js');
let mHandler = require('../controllers/makersHandler.js');
let makersHandler = new mHandler();

module.exports = function (app, loggedFalse) {
  app.get('/main', loggedFalse, (req, res) =>{
    Account.findOne({username: req.session.user['username']})
    .exec((err, data)=> { 
      let importantInfo = makersHandler.importantInfo(data);
      res.render(process.cwd() + '/views/app/main',
                 {makers: importantInfo[0],
                  today: importantInfo[1],
                  last: importantInfo[2],
                  incorrectPassword: makersHandler.passwordCheck(req.query.incorrectPassword)});
    });
  });

  app.post('/main/mark', (req, res) =>{
    makersHandler.mark(req, (response) =>{
      if(response == 0) {
        res.json({error: "Something bad happened :c"});
      }else if (response == 1) {
        res.redirect('/main?incorrectPassword=true');
      }else if (response == 2) {
        res.redirect('/main');
      }
    });
  });
  
  app.get('/main/makers', loggedFalse, (req, res) =>{
    makersHandler.getEveryMaker(req.session.user['username'], (makers)=>{
      res.render(process.cwd() + '/views/app/makers', {makers: makers});
    });    
  });
  
  app.post('/main/makers', loggedFalse, (req, res) =>{
    makersHandler.POSTMaker(req, (response)=>{      
      response ? res.json({"error": "There was an error."}) : res.redirect('/main/makers');
    });
  });
  
  app.get('/main/settings', loggedFalse, (req, res) =>{
    res.render(process.cwd() + '/views/app/settings');
  });
};