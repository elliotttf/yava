Yava.GoalsNewView = Ember.View.extend({
  didInsertElement: function () {
    var self = this;
    self.$('.datepicker').pickadate();
    self.$('.timepicker').pickatime({ interval: 15 });

    self.endPicker = self.$('#end .timepicker').pickatime('picker');
  },

  isSelected: function () {
    if (this.get('controller').get('hoursTotal')) {
      return 1;
    }
    return 0;
  }.property('controller.hoursTotal'),

  hoursGoal: function () {
    if (this.get('isSelected')) {
      return true;
    }
    return false;
  }.property('isSelected'),

  resetEnd: function () {
    if (!this.endPicker) {
      return;
    }

    var min = this.get('controller').get('startTime');
    if (min) {
      min = moment(min, 'LT');

      this.endPicker.set('min', [min.format('H'), min.format('m') ]);
    }
  }.observes('controller.startTime')
});
