const mongoose     = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

let Schema = mongoose.Schema;
let accountSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  makers: [{
    _id : false,
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    active: {type: Boolean},
    times: Number
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