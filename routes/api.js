'use strict';

let Account = require('../models/Account.js');

module.exports = function (app) {
  app.route('/api/calendar')
    .get(function (req, res){
    try{
      Account.findOne({username: req.session.user['username']})
        .exec((err, data)=> {
        if (err) {
          res.json({error: "error"});
        }else{
          res.json({history: data.history, makers: data.makers});
        }
      });
    }catch(e){
      res.json({error: "error"});
    }
  });    
};
