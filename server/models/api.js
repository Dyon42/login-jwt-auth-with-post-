const mongoose = require('mongoose');


const api = new mongoose.Schema({
  tester: {type: String},
  
})

module.exports = mongoose.model('Api', api);