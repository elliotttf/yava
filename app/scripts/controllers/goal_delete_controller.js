Yava.GoalDeleteController = Ember.ObjectController.extend({
  actions: {
    delete: function () {
      var goal = this.get('model');
      goal.deleteRecord();
      goal.save();
      this.transitionToRoute('goals');
    }
  }
});

