Yava.LogoutRoute = Ember.Route.extend({
  beforeModel: function () {
    if (Yava.MyUser.get('loggedIn')) {
      Yava.MyUser.destroy();
      // HACK? This seems really weird. Need to think this one over.
      window.location = '/' + Yava.get('apiVersion') + '/logout';
    }
    else {
      this.transitionTo('index');
    }
  }
});

