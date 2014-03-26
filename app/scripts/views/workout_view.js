/* global L, $ */
Yava.WorkoutView = Ember.View.extend({
  didInsertElement: function () {
    if (this.get('controller.venue.isLoading')) {
      this.get('controller.venue').on('didLoad', $.proxy(this.addMap, this));
    }
    else {
      this.addMap();
    }
  },

  addMap: function () {
    var loc = this.get('controller.venue.location');
    this.map = L.mapbox.map('map', 'elliotttf.hk2gaal7')
      .setView([ loc.lat, loc.lng ], 15);

    L.mapbox.featureLayer({
      type: 'Feature',
      properties: {
        title: this.get('controller.venue.title'),
        'marker-color': '#f00',
        'marker-size': 'large',
      },
      geometry: {
        type: 'Point',
        coordinates: [ loc.lng, loc.lat ]
      }
    }).addTo(this.map);
  }
});
