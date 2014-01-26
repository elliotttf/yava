Yava.LoginRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!Yava.MyUser.get('loggedIn')) {
      // HACK? This seems really weird. Need to think this one over.
      window.location = '/' + Yava.get('apiVersion') + '/auth/twitter';
    }
    else {
      this.transitionTo('index');
    }
  }
});

