MyYoga.WorkoutsIndexRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!MyYoga.MyUser.get('loggedIn')) {
      this.transitionTo('login');
    }
  },
  model: function () {
    return this.store.find('workout');
  }
});

