var Deferred = require('promised-io/promise').Deferred;
var Venues = {};
var foursquare;

/**
 * REST list endpoint.
 */
Venues.list = function (req, res) {
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

  Venues.findAll(params)
    .then(
      function (venues) {
        res.json({ venues: venues });
      },
      function (err) {
        console.error(err);
        res.send(500);
      }
    );
};

/**
 * REST retrieve endpoint.
 */
Venues.retrieve = function (req, res) {
  if (!req.params.venue_id) {
    res.send(400);
    return;
  }

  Venues.findOne(req.params.venue_id)
    .then(
      function (venue) {
        res.json({ venue: venue });
      },
      function (err) {
        console.log(err);
        res.send(500);
      }
    );
};

/**
 * Find all venues by query.
 *
 * @param {object} query
 *   The query parameters to use to select venues.
 */
Venues.findAll = function (query) {
  var deferred = new Deferred();

  foursquare.getVenues(query, function (err, venues) {
    if (err || venues.meta.code !== 200) {
      deferred.reject(err);
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

    deferred.resolve(venue_res);
  });

  return deferred.promise;
};

/**
 * Finds a single venue.
 *
 * @param {string} id
 *   The venue ID to find.
 *
 * @return promise.
 */
Venues.findOne = function (id) {
  var deferred = new Deferred();

  // TODO - there's a problem here on new workout saves :(
  foursquare.getVenue({ venue_id: id }, function (err, venue) {
    if (err) {
      deferred.reject(err);
      return;
    }

    var venue_res = {
      _id: venue.response.venue.id,
      name: venue.response.venue.name,
      location: venue.response.venue.location
    };
    deferred.resolve(venue_res);
  });

  return deferred.promise;
};

module.exports = function (config) {
  foursquare = (require('foursquarevenues'))(
    config.foursquare.key,
    config.foursquare.secret
  );
  return Venues;
};

