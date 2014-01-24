MyYoga.WorkoutController = Ember.ObjectController.extend({
  mine: function () {
    if (MyYoga.MyUser.get('user').get('id') === this.get('user').get('id')) {
      return true;
    }

    return false;
  }.property('user')
});

