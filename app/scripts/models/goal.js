Yava.Goal = DS.Model.extend({
  title: DS.attr('string'),
  start: DS.attr('date'),
  end: DS.attr('date'),
  complete: DS.attr('boolean'),
  hoursTotal: DS.attr('number'),
  hoursProgress: DS.attr('number'),
  workoutsTotal: DS.attr('number'),
  workoutsProgress: DS.attr('number'),
  user: DS.belongsTo('user'),

  /**
   * Returns a percent for progress.
   */
  percent: function () {
    var ret = 0;
    if (this.get('hoursTotal')) {
      ret = this.get('hoursProgress') / this.get('hoursTotal');
    }
    else {
      ret = this.get('workoutsProgress') / this.get('workoutsTotal');
    }

    ret = Number(ret * 100);
    if (ret > 100) {
      ret = 100;
    }

    return ret;
  }.property('hoursTotal', 'hoursProgress', 'workoutsTotal', 'workoutsProgress'),

  percentStyle: function () {
    return 'width: ' + this.get('percent') + '%';
  }.property('percent'),

  /**
   * Returns the total goal.
   */
  total: function () {
    if (this.get('hoursTotal')) {
      return this.get('hoursTotal');
    }
    else {
      return this.get('workoutsTotal');
    }
  }.property('workoutsTotal', 'hoursTotal'),

  /**
   * Returns the goal progress.
   */
  progress: function () {
    var ret = 0;
    if (this.get('hoursTotal')) {
      ret = this.get('hoursProgress');
    }
    else {
      ret = this.get('workoutsProgress');
    }

    return Number(ret);
  }.property('workoutsProgress', 'hoursProgress'),

  unit: function () {
    if (this.get('hoursTotal')) {
      return 'hours';
    }
    return 'workouts';
  }.property('hoursTotal'),

  /**
   * Returns a formatted time from the goal start.
   */
  formattedStart: function () {
    return moment(this.get('start')).format('lll');
  }.property('start'),

  /**
   * Returns a formatted time from the goal end.
   */
  formattedEnd: function () {
    return moment(this.get('end')).format('lll');
  }.property('end'),
});

