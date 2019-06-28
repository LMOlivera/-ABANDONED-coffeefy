let mongoose = require('../models/Mongoose.js');

let Schema = mongoose.Schema;
let accountSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  accountUrl: {type: String, required: true, unique: true},
  sortingMode: {type: String, required: true},  //List for know, "times" will take some time to come
  makers: [{
    _id : false,
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    active: {type: Boolean},
    times: Number,
    admin: {type: Boolean, default: false},
  }],
  last: {
    _id : false,
    name: {type: String},
    date: {type: Date}
  },
  next: {type: String},
  history: [{_id : false, name: String, date: Date}]
});

//Glitch is giving errors in the next line but is working as it should!
module.exports = Account = mongoose.model('Account', accountSchema);