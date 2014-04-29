/* global $ */
require('scripts/controllers/modal_controller');

Yava.AddLocationController = Yava.ModalController.extend({
  studios: [],

  init: function () {
    this._super();

    // TODO - support crappy browsers.
    // TODO - is there a more "Embery" way of binding this?
    navigator.geolocation.getCurrentPosition(
      $.proxy(this.locFound, this),
      $.proxy(this.locError, this),
      {
        enableHighAccuracy: true,
        timeout: 2000
      }
    );
  },

  locFound: function (pos) {
    // TODO - is there a more "Embery" way of binding this?
    this.store.find('venue', { ll: pos.coords.latitude + ',' + pos.coords.longitude })
      .then(
        $.proxy(this.addVenues, this),
        $.proxy(this.locError, this)
      );
  },

  locError: function (err) {
    alertify.error('Unable to locate you, please try agian later.');
    this.send('closeModal');
  },

  addVenues: function (venues) {
    this.set('studios', venues);
  },

  actions: {
    select: function (studioId) {
      this.store.find('venue', studioId)
        .then($.proxy(function (venue) {
          this.set('venue', venue);
          this.send('closeModal');
        }, this));
    }
  }
});

