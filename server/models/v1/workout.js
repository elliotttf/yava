var mongoose = require('mongoose');

var WorkoutSchema = module.exports = mongoose.Schema({
  title: String,
  date: {
    type: Date,
    index: true
  },
  duration: Number,
  notes: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  }
});

