/**
 * GET users list.
 */

exports.list = function (req, res) {
  // TODO - fetch from DB
  res.json({
    'users': [
      {
        id: 0,
        name: 'svr_foster'
      }
    ]
  });
};

exports.get = function (req, res) {
  if (req.params.user_id === 0) {
    res.json({
      'user': {
        id: 0,
        name: 'svr_foster'
      }
    });
  }
  else {
    res.send(404);
  }
};

