Yava.WorkoutsMineRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!Yava.MyUser.get('loggedIn')) {
      this.transitionTo('login');
    }
  },
  model: function () {
    return this.store.find('workout', { user: Yava.MyUser.get('uid') });
  },
  renderTemplate: function (controller) {
    this.render('workouts/index', { controller: controller });
  }
});

