Yava.GoalsNewController = Ember.ObjectController.extend({
  titleErrors: [],
  startErrors: [],
  endErrors: [],
  hoursTotalErrors: [],
  workoutsTotalErrors: [],

  titleValid: true,
  startValid: true,
  endValid: true,
  hoursTotalValid: true,
  workoutsTotalValid: true,

  /**
   * Helper function to return an example date.
   */
  startPlaceholder: function () {
    return moment().format('D MMMM YYYY');
  }.property('start'),

  /**
   * Helper function to return an example date.
   */
  endPlaceholder: function () {
    return moment().format('D MMMM YYYY');
  }.property('end'),

  formattedStart: function () {
    if (this.get('start')) {
      return moment(this.get('start')).format('D MMMM YYYY');
    }
  }.property('start'),

  formattedEnd: function () {
    if (this.get('end')) {
      return moment(this.get('end')).format('D MMMM YYYY');
    }
  }.property('end'),

  validateTitle: function () {
    this.set('titleErrors', []);
    this.set('titleValid', true);

    var title = this.get('title');
    if (typeof title !== 'undefined' && (title === null || title.length === 0)) {
      this.get('titleErrors').push('The goal title is required.');
      this.set('titleValid', false);
    }
  }.observes('title'),

  validateStart: function () {
    this.set('startErrors', []);
    this.set('startValid', true);

    var date = this.get('formattedStart');
    if (typeof date !== 'undefined') {
      if (date === null || date.length === 0) {
        this.get('startErrors').push('The start date is required.');
        this.set('startValid', false);
        return;
      }

      if (!moment(date).isValid()) {
        this.get('startErrors').push('Invalid date format.');
        this.set('startValid', false);
      }
    }
  }.observes('start'),

  validateEnd: function () {
    this.set('endErrors', []);
    this.set('endValid', true);

    var date = this.get('formattedEnd');
    if (typeof date !== 'undefined') {
      if (date === null || date.length === 0) {
        this.get('endErrors').push('The end date is required.');
        this.set('endValid', false);
        return;
      }

      if (!moment(date).isValid()) {
        this.get('endErrors').push('Invalid date format.');
        this.set('endValid', false);
      }
    }
  }.observes('end'),

  isValid: function () {
    this.validateTitle();
    this.validateStart();
    this.validateEnd();

    var valid = this.get('titleValid') &&
      this.get('startValid') &&
      this.get('endValid');

    valid = valid && (typeof this.get('title') !== 'undefined');
    valid = valid && (typeof this.get('formattedStart') !== 'undefined');
    valid = valid && (typeof this.get('formattedEnd') !== 'undefined');
    valid = valid && ((typeof this.get('hoursTotal') !== 'undefined') || (typeof this.get('workoutsTotal') !== 'undefined'));

    return valid;
  }.property('titleValid', 'startValid', 'endValid'),

  actions: {
    saveGoal: function () {
      if (this.get('isValid')) {
        var goal;

        if (!this.get('id')) {
          goal = this.store.createRecord('goal', {
            title: this.get('title'),
            start: moment(this.get('formattedStart')).toDate(),
            end: moment(this.get('formattedEnd')).toDate(),
            hoursTotal: this.get('hoursTotal'),
            workoutsTotal: this.get('workoutsTotal'),
            user: Yava.MyUser.get('user')
          });
        }
        else {
          goal = this.get('model');
          goal.set('title', this.get('title'));
          goal.set('start', moment(this.get('formattedStart')).toDate());
          goal.set('end', moment(this.get('formattedEnd')).toDate());
          goal.set('hoursTotal', this.get('hoursTotal'));
          goal.set('workoutsTotal', this.get('workoutsTotal'));
        }

        goal.save();

        this.transitionToRoute('goals');
      }
    }
  }
});

