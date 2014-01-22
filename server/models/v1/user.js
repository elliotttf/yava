var mongoose = require('mongoose');

var UserSchema = module.exports = mongoose.Schema({
  name: {
    type: String,
    index: true
  }
});

