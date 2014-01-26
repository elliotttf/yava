Yava.ApplicationController = Ember.Controller.extend({
  loggedIn: function () {
    return Yava.MyUser.get('loggedIn');
  }.property()
});

