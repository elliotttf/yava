MyYoga.ApplicationController = Ember.Controller.extend({
  loggedIn: function () {
    return MyYoga.MyUser.get('loggedIn');
  }.property()
});

