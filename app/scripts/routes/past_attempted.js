Yava.PastAttemptedRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!Yava.MyUser.get('loggedIn')) {
      this.transitionTo('login');
    }
  },
  model: function () {
    return this.store.find('goal', {
      user: Yava.MyUser.get('uid'),
      endsBefore: moment().toISOString(),
      complete: false
    });
  },
  renderTemplate: function (controller) {
    this.render('goals/index', { controller: controller });
  }
});

