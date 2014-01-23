MyYoga.Workout = DS.Model.extend({
  title: DS.attr('string'),
  date: DS.attr('date'),
  duration: DS.attr('number'),
  notes: DS.attr('string'),
  user: DS.belongsTo('user'),

  /**
   * Returns a formatted time from the duration seconds.
   */
  workoutLength: function () {
    return moment.duration(this.get('duration'), 'seconds').humanize();
  }.property('duration'),

  /**
   * Returns a formatted time from the workout date.
   */
  formattedDate: function () {
    return moment(this.get('date')).format('lll');
  }.property('date')
});

