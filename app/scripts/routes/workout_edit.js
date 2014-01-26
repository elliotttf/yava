Yava.WorkoutEditRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!Yava.MyUser.get('loggedIn')) {
      this.transitionTo('login');
    }
  },
  model: function () {
    return this.modelFor('workout');
  },
  setupController: function (controller, model) {
    this.controllerFor('workouts.new').set('model', model);
  },
  renderTemplate: function () {
    this.render('workouts/new');
  }
});

