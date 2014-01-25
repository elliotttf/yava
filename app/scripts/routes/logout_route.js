MyYoga.LogoutRoute = Ember.Route.extend({
  beforeModel: function () {
    if (MyYoga.MyUser.get('loggedIn')) {
      MyYoga.MyUser.destroy();
      // HACK? This seems really weird. Need to think this one over.
      window.location = '/' + MyYoga.get('apiVersion') + '/logout';
    }
    else {
      this.transitionTo('index');
    }
  }
});

