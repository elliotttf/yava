MyYoga.WorkoutsNewRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!MyYoga.MyUser.get('loggedIn')) {
      this.transitionTo('login');
    }
  },
  setupController: function (controller, model) {
    controller.set('model', {});
  }
});

