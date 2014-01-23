MyYoga.WorkoutsNewController = Ember.ObjectController.extend({
  titleErrors: [],
  dateErrors: [],
  startTimeErrors: [],
  endTimeErrors: [],

  titleValid: true,
  dateValid: true,
  startTimeValid: true,
  endTimeValid: true,

  /**
   * Helper function to return an example date.
   */
  datePlaceholder: function () {
    return moment().format('LL');
  }.property('date'),

  /**
   * Start time placeholder.
   */
  startTimePlaceholder: function () {
    return moment().format('LT');
  }.property('date'),

  /**
   * End time placeholder.
   */
  endTimePlaceholder: function () {
    return moment().add('h', 1).format('LT');
  }.property('date'),

  /**
   * Format the start time based on the date.
   */
  startTime: function() {
    var date = this.get('date');
    return (date && this.get('duration')) ? moment(date).format('LT') : '';
  }.property('date'),

  /**
   * Format the end time based on the date and duration.
   */
  endTime: function() {
    var date = this.get('date');
    if (date && this.get('duration')) {
      var date = moment(date);
      date.add('s', this.get('duration'));
      return date.format('LT');
    }
    return '';
  }.property('date', 'duration'),

  validateTitle: function () {
    this.set('titleErrors', []);
    this.set('titleValid', true);

    var title = this.get('title');
    if (typeof title !== 'undefined' && (title === null || title.length === 0)) {
      this.get('titleErrors').push('The workout title is required.');
      this.set('titleValid', false);
    }
  }.observes('title'),

  validateDate: function () {
    this.set('dateErrors', []);
    this.set('dateValid', true);

    var date = this.get('date');
    if (typeof date !== 'undefined') {
      if (date === null || date.length === 0) {
        this.get('dateErrors').push('The workout date is required.');
        this.set('dateValid', false);
        return;
      }

      if (!moment(this.get('date')).isValid()) {
        this.get('dateErrors').push('Invalid date format.');
        this.set('dateValid', false);
      }
    }
  }.observes('date'),

  validateStartTime: function () {
    this.set('startTimeErrors', []);
    this.set('startTimeValid', true);

    var startTime = this.get('startTime');
    if (typeof startTime !== 'undefined') {
      if (startTime === null || startTime.length === 0) {
        this.get('startTimeErrors').push('The workout start time is required.');
        this.set('startTimeValid', false);
        return;
      }

      // Validate using just the time and the time + date in case a different,
      // but valid, time format was used.
      var timeValid = moment(this.get('startTime'), 'h:i A').isValid();
      var dateValid = moment(this.get('date') + ' ' + this.get('startTime')).isValid();
      if (!timeValid && !dateValid) {
        this.get('startTimeErrors').push('Invalid time format.');
        this.set('startTimeValid', false);
      }
    }
  }.observes('startTime'),

  validateEndTime: function () {
    this.set('endTimeErrors', []);
    this.set('endTimeValid', true);

    var endTime = this.get('endTime');
    if (typeof endTime !== 'undefined') {
      if (endTime === null || endTime.length === 0) {
        this.get('endTimeErrors').push('The workout end time is required.');
        this.set('endTimeValid', false);
        return;
      }

      // Validate using just the time and the time + date in case a different,
      // but valid, time format was used.
      var timeValid = moment(this.get('endTime'), 'h:i A').isValid();
      var dateValid = moment(this.get('date') + ' ' + this.get('endTime')).isValid();
      if (!timeValid && !dateValid) {
        this.get('endTimeErrors').push('Invalid time format.');
        this.set('endTimeValid', false);
      }
    }
  }.observes('endTime'),

  isValid: function () {
    this.validateTitle();
    this.validateDate();
    this.validateStartTime();
    this.validateEndTime();

    var valid = this.get('titleValid') &&
      this.get('dateValid') &&
      this.get('startTimeValid') &&
      this.get('endTimeValid');

    valid = valid && (typeof this.get('title') !== 'undefined');
    valid = valid && (typeof this.get('date') !== 'undefined');
    valid = valid && (typeof this.get('startTime') !== 'undefined');
    valid = valid && (typeof this.get('endTime') !== 'undefined');

    return valid;
  }.property('titleValid', 'dateValid', 'startTimeValid', 'endTimeValid'),

  actions: {
    saveWorkout: function () {
      if (this.get('isValid')) {
        var startDate = moment(this.get('date') + ' ' + this.get('startTime'));
        var endDate = moment(this.get('date') + ' ' + this.get('endTime'));

        var workout = this.store.createRecord('workout', {
          title: this.get('title'),
          date: new Date(startDate.toISOString()),
          duration: (endDate.unix() - startDate.unix()),
          notes: this.get('notes'),
          user: 0 // TODO
        });

        workout.save();

        this.transitionToRoute('workouts');
      }
    }
  }
});

