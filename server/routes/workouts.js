/**
 * GET workouts list.
 */

exports.list = function (req, res) {
  // TODO - fetch from DB
  res.json({
    'workouts': [
      {
        id: 0,
        title: 'First hatha workout',
        date: new Date(),
        duration: 4500,
        user: 0
      }
    ]
  });
};

exports.save = function (req, res) {
  var saved = req.body.workout;
  saved.id = 1;
  res.json({
    workout: saved
  });
};

