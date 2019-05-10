'use strict';

const express      = require('express');
const app = express();
const session      = require('express-session');
const path         = require('path');                                                                                                                                                             
const bodyParser   = require('body-parser');
const helmet       = require('helmet');
const mongoose     = require('mongoose');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

var Schema = mongoose.Schema;
var accountSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  makers: [{
    name: {type: String, unique: true},
    password: {type: String, required: true},
    active: {type: Boolean}    
  }],
  last: {
    name: {type: String},
    date: {type: Date}
  },
  next: {type: String}
});
var Account = mongoose.model('Account', accountSchema);

//Server security
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.noCache());

//Session secret
app.use(session({secret: process.env.SESSION_SECRET,
                 resave: false,
                 saveUninitialized: true}));

app.set('view engine', 'pug');

//Log in - Sign up
app.get("/", (req, res) => {
  if (req.session.loggedIn==true) {
    res.redirect('/main');
  }else{
    req.session.loggedIn=false;
    
    if (req.query.already == 'true') {
      res.render(process.cwd() + '/views/login-signup', {already: true});
    }else if (req.query.exists == 'false') {
      res.render(process.cwd() + '/views/login-signup', {exists: false});
    }else{
      res.render(process.cwd() + '/views/login-signup');
    }
  }
});  

app.post('/signup', (req, res) => {
  if (req.session.loggedIn==true) {
    res.redirect('/main');
  }
  let acc = new Account({
    username: req.body.username,
    password: req.body.password,
    makers: [],
    last: {}
  });
    acc.save((err, data) => {
      if (err){
        if (err.code == 11000) {
          res.redirect('/?already=true');
        }else{
          res.json({error: err});
        }
      }else{
        res.render(process.cwd() + '/views/signup-success');
      }
    })
});

app.post('/signin', (req, res) => {
  if (req.session.loggedIn==true) {
    res.redirect('/main');
  }
  Account.findOne({ username: req.body.username, password: req.body.password})
  .exec((err, data) =>{
    if (err || data == null || data.length == 0) {
       res.redirect('/?exists=false');
    }else{
      req.session.loggedIn = true;
      req.session.user = data;
      res.redirect('/main');
    }
  });
});
//////////////////

app.get('/main', (req, res) =>{
  if (req.session.loggedIn!=true) {
    res.redirect('/');
  }else{
    Account.findOne({username: req.session.user['username']})
    .exec((err, data)=> { 
      let makers = [];
      if (data.makers.length == 0) {
        makers.push({name: "There are no makers yet. Go to 'Manage Makers' and create them!", active: true});
        res.render(process.cwd() + '/views/main', {makers: makers, today: "nobody", last: "nobody"});
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
          res.render(process.cwd() + '/views/main', {makers: makers, today: today, last: last});
        }else if(makers.length == 1) {
          last = "no";        
          today = "body";
          res.render(process.cwd() + '/views/main', {makers: makers, today: today, last: last});
        }else if (data.last.date == undefined) {
          last = "nobody";        
          today = makers[0].name;
          res.render(process.cwd() + '/views/main', {makers: makers, today: today.slice(2, today.length), last: last});
        }else if(data.last.date != undefined){
          let tDate = new Date();
          tDate.setHours(0,0,0,0);
          //tDate.setDate(tDate.getDate() + 1);
          if (data.last.date.getTime()==tDate.getTime()) {
            res.render(process.cwd() + '/views/main', {makers: makers, today: data.last.name, last: data.last.name});
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

            res.render(process.cwd() + '/views/main', {makers: makers, today: nextMaker, last: data.last.name});
          }        
        }
      }
    })
  }
});

app.post('/main/mark', (req, res) =>{
  let today = {name: req.query.today, date: new Date().toDateString()};
  let maker = {name: req.query.today, password: req.body.password}
  Account.findOneAndUpdate({username: req.session.user['username'],
                           "makers.name": {"$in": [maker.name]},
                           "makers.password": {"$in": [maker.password]}},
                           {last: today},
                           (err, data)=>{
      if (err) {
        res.json({error: "Something bad happened :c"});
      }else{
        //Check maker's name and password
        console.log(data);
        
        
        res.redirect('/main');
      }
  });
});

app.get('/main/makers', (req, res) =>{
  if (req.session.loggedIn==false) {
    res.redirect('/?exists=false');
  }
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
        m["active"] = maker.active;
        makers.push(m);
        //}
      });
      
      res.render(process.cwd() + '/views/makers', {makers: makers});
    }
  })
});
app.post('/main/makers', (req, res) =>{
  if (req.session.loggedIn==false) {
    res.redirect('/?exists=false');
  }else{
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
  }  
});

app.get('/main/settings', (req, res) =>{
  if (req.session.loggedIn==false) {
    res.redirect('/?exists=false');
  }
  
  //res.render(process.cwd() + '/views/login-signup', {already: true}); 
  res.render(process.cwd() + '/views/settings');
});

app.get('/main/logout', (req, res) =>{
  req.session.destroy();
  res.redirect('/');
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
