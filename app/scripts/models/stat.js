Yava.Stat = DS.Model.extend({
  weekHours: DS.attr('number'),
  weekWorkouts: DS.attr('number'),
  monthHours: DS.attr('number'),
  monthWorkouts: DS.attr('number'),
  yearHours: DS.attr('number'),
  yearWorkouts: DS.attr('number'),
  allHours: DS.attr('number'),
  allWorkouts: DS.attr('number'),
  user: DS.belongsTo('user'),

  /**
   * Returns a formatted time from the duration seconds.
   */
  formattedAllHours: function () {
    return moment.duration(this.get('allHours'), 'seconds').humanize();
  }.property('duration'),

});
