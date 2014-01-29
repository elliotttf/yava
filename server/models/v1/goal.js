var mongoose = require('mongoose');

var GoalSchema = module.exports = mongoose.Schema({
  title: String,
  start: Date,
  end: Date,
  hoursTotal: Number,
  hoursProgress: Number,
  workoutsTotal: Number,
  workoutsProgress: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }
});

