Yava.UserController = Ember.ObjectController.extend({
  since: function () {
    return moment(this.get('created')).format('MMMM YYYY');
  }.property('created'),
});
