'use strict';
//Refactor OK
let Account = require('../models/Account.js');

module.exports = function (app) {
  app.route('/api/calendar')
    .get(function (req, res){
    try{
      Account.findOne({username: req.session.user['username']})
        .exec((err, data)=> {
        (err ? res.json({error: "error"}) : res.json({history: data.history, makers: data.makers}));
      });
    }catch(e){
      res.json({error: "error"});
    }
  });    
};
