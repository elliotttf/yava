Yava.WorkoutsNewRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!Yava.MyUser.get('loggedIn')) {
      this.transitionTo('login');
    }
  },
  model: function () {
    return this.store.createRecord('workout');
  },
  setupController: function (controller, model) {
    controller.set('model', {});
  }
});

