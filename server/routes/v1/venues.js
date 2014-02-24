var Venues = {};
var foursquare;

Venues.find = function (req, res) {
  var params = {
    ll: req.query.ll,
    query: 'yoga',
    intent: 'browse',
    radius: 5000
  };
  // TODO - bail out of radius search if searching by name?
  if (typeof req.query.q !== 'undefined') {
    params.query = req.query.q;
  }

  foursquare.getVenues(params, function (err, venues) {
    if (err || venues.meta.code !== 200) {
      res.send(500);
      return;
    }

    venues = venues.response.venues;

    var venue_res = [];
    for (var i = 0; i < venues.length; i++) {
      venue_res.push({
        _id: venues[i].id,
        name: venues[i].name,
        location: venues[i].location
      });
    }

    res.json({ venues: venue_res });
  });
};

module.exports = function (config) {
  foursquare = (require('foursquarevenues'))(
    config.foursquare.key,
    config.foursquare.secret
  );
  return Venues;
};

