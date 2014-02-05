Yava.WorkoutsIndexController = Ember.ArrayController.extend({
  page: 1,
  disabled: false,
  loading: false,
  sortProperties: ['date'],
  sortAscending: false,

  find: function () {
    return this.store.find('workout', { page: this.get('page') });
  },

  actions: {
    loadMore: function () {
      var self = this;
      if (self.get('loading')) {
        return;
      }

      self.set('loading', true);
      self.find().then(
        function (workouts) {
          if (workouts.get('length')) {
            var page = self.get('page');
            page++;
            self.set('page', page);
          }
          else {
            self.set('disabled', true);
          }
          self.set('loading', false);
        },
        function (err) {
          self.set('loading', false);
        }
      );
    }
  }
});

