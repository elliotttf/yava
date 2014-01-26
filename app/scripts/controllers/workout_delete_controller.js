Yava.WorkoutDeleteController = Ember.ObjectController.extend({
  actions: {
    delete: function () {
      var workout = this.get('model');
      workout.deleteRecord();
      workout.save();
      this.transitionToRoute('workouts');
    }
  }
});

