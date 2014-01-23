MyYoga.LoginRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!MyYoga.MyUser.get('loggedIn')) {
      // HACK? This seems really weird. Need to think this one over.
      window.location = '/' + MyYoga.get('apiVersion') + '/auth/twitter';
    }
    else {
      this.transitionTo('index');
    }
  }
});

