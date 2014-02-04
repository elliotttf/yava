Yava.GoalsNewRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!Yava.MyUser.get('loggedIn')) {
      this.transitionTo('login');
    }
  },
  setupController: function (controller, model) {
    controller.set('model', {});
  }
});

