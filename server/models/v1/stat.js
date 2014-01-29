var mongoose = require('mongoose');

var WorkoutStatSchema = module.exports = mongoose.Schema({
  weekWorkouts: Number,
  weekHours: Number,
  weekExpires: Date,
  monthWorkouts: Number,
  monthHours: Number,
  monthExpires: Date,
  yearWorkouts: Number,
  yearHours: Number,
  yearExpires: Date,
  allWorkouts: Number,
  allHours: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }
});

