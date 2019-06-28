let mongoose = require('../models/Mongoose.js');

let Schema = mongoose.Schema;
let factSchema = new Schema({
  factText: {type: String, required: true},
  source: {type: String, required: true},
});

//Glitch is giving errors in the next line but is working as it should!
module.exports = Fact = mongoose.model('Fact', factSchema);