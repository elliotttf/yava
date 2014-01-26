Yava.WorkoutController = Ember.ObjectController.extend({
  mine: function () {
    var id = (this.get('user') && typeof this.get('user').get === 'function') ?
      this.get('user').get('id') :
      this.get('user');
    if (Yava.MyUser.get('user').get('id') === id) {
      return true;
    }

    return false;
  }.property('user')
});

