MyYoga.WorkoutsRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('workout');
  }
});

