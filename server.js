'use strict';
//Refactor OK
const express      = require('express');
const app = express();
const session      = require('express-session');
const path         = require('path');                                                                                                                                                             
const bodyParser   = require('body-parser');
const helmet       = require('helmet');
const routes       = require('./routes.js');
const api          = require('./routes/api.js');

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/public'))); //Set CSS path
app.use(bodyParser.urlencoded({ extended: true })); //For post request
app.use(bodyParser.json()); //For post request

//Security
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.noCache());

//Session
app.use(session({secret: process.env.SESSION_SECRET,
                 resave: false,
                 saveUninitialized: true}));

//Routes
api(app);
routes(app);

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});