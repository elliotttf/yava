MyYoga.WorkoutsNewController = Ember.ObjectController.extend({
  actions: {
    /**
     * Format the start time based on the date.
     */
    startTime: function() {
      return moment(this.model.get('date')).format('LT');
    }.property('date'),

    /**
     * Format the end time based on the date and duration.
     */
    endTime: function() {
      var date = moment(this.model.get('date'));
      date.add('s', this.model.get('duration'));
      return date.format('LT');
    }.property('date', 'duration'),

    saveWorkout: function () {
      var startDate = moment(this.get('date') + ' ' + this.get('startTime'));
      var endDate = moment(this.get('date') + ' ' + this.get('endTime'));

      var workout = this.store.createRecord('workout', {
        title: this.get('title'),
        date: new Date(startDate.toISOString()),
        duration: (endDate.unix() - startDate.unix()),
        user: 0 // TODO
      });

      workout.save();

      this.transitionToRoute('workouts');
    }
  }
});

