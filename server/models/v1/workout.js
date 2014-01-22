var mongoose = require('mongoose');

var WorkoutSchema = module.exports = mongoose.Schema({
  title: String,
  date: Date,
  duration: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

