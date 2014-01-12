MyYoga.Workout = DS.Model.extend({
  title: DS.attr('string'),
  date: DS.attr('date'),
  duration: DS.attr('number'),
  user: DS.belongsTo('user'),

  /**
   * Returns a formatted time from the duration seconds.
   */
  workoutLength: function () {
    return moment.duration(this.get('duration'), 'seconds').humanize();
  }.property('duration')
});

