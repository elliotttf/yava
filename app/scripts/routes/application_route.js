Yava.ApplicationRoute = Ember.Route.extend({
  actions: {
    openModal: function (name, model) {
      this.controllerFor(name).set('model', model);
      return this.render(name, {
        into: 'application',
        outlet: 'modal'
      });
    },

    closeModal: function () {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});

