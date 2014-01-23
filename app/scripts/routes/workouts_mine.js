MyYoga.WorkoutsMineRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!MyYoga.MyUser.get('loggedIn')) {
      this.transitionTo('login');
    }
  },
  model: function () {
    return this.store.find('workout', { user: MyYoga.MyUser.get('uid') });
  },
  renderTemplate: function (controller) {
    this.render('workouts/index', { controller: controller });
  }
});

