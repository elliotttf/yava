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
  formattedWeekHours: function () {
    return moment.duration(this.get('weekHours'), 'seconds').asHours();
  }.property('duration'),

  /**
   * Returns a formatted time from the duration seconds.
   */
  formattedMonthHours: function () {
    return moment.duration(this.get('monthHours'), 'seconds').asHours();
  }.property('duration'),

  /**
   * Returns a formatted time from the duration seconds.
   */
  formattedYearHours: function () {
    return moment.duration(this.get('yearHours'), 'seconds').asHours();
  }.property('duration'),

  /**
   * Returns a formatted time from the duration seconds.
   */
  formattedAllHours: function () {
    return moment.duration(this.get('allHours'), 'seconds').asHours();
  }.property('duration'),
});

