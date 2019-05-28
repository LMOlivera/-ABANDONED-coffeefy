'use strict';
//Refactor OK
let Account = require('../models/Account.js');

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
};
