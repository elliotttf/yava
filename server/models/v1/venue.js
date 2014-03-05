var mongoose = require('mongoose');

var VenueSchema = module.exports = mongoose.Schema({
  name: String,
  location: {
    address: String,
    crossStreet: String,
    lat: Number,
    lng: Number,
    distance: Number,
    postalCode: String,
    cc: String,
    city: String,
    state: String,
    country: String
  }
});

