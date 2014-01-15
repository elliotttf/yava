MyYoga.WorkoutsNewView = Ember.View.extend({
  didInsertElement: function () {
    this.$('.datepicker').pickadate();
    this.$('.timepicker').pickatime({ interval: 15 });
  }
});
