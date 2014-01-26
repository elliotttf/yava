var mongoose = require('mongoose');

var WorkoutStatSchema = module.exports = mongoose.Schema({
  weekWorkouts: Number,
  weekHours: Number,
  monthWorkouts: Number,
  monthHours: Number,
  yearWorkouts: Number,
  yearHours: Number,
  allWorkouts: Number,
  allHours: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

