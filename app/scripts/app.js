var Yava = window.Yava = Ember.Application.create({
  apiVersion: 'v1'
});

/**
 * Initializer to configure authenticated user behavior.
 */
Ember.Application.initializer({
  name: 'auth',
  after: 'store',
  initialize: function (container) {
    Yava.deferReadiness();
    Yava.MyUser = Yava.Auth.create();

    var uid = Yava.MyUser.get('uid');
    if (uid) {
      var store = container.lookup('store:main');
      store.find('user', uid)
        .then(
          function (user) {
            Yava.MyUser.set('user', user);
            Yava.advanceReadiness();
          },
          function (err) {
            Yava.advanceReadiness();
          }
        );
    }
    else {
      Yava.advanceReadiness();
    }
  }
});

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/router');
require('scripts/auth');

