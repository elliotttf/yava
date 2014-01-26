var mongoose = require('mongoose');

var UserSchema = module.exports = mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  photo: String,
  created: Date,
  lastLogin: Date,
  stats: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutStat'
  }
});

