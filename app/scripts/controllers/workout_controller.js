MyYoga.WorkoutController = Ember.ObjectController.extend({
  mine: function () {
    var id = (typeof this.get('user').get === 'function') ? this.get('user').get('id') :
      this.get('user');
    if (MyYoga.MyUser.get('user').get('id') === id) {
      return true;
    }

    return false;
  }.property('user')
});

