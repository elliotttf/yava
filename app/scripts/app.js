var MyYoga = window.MyYoga = Ember.Application.create({
  apiVersion: 'v1'
});

/**
 * Initializer to configure authenticated user behavior.
 */
Ember.Application.initializer({
  name: 'auth',
  after: 'store',
  initialize: function (container) {
    MyYoga.deferReadiness();
    MyYoga.MyUser = MyYoga.Auth.create();

    var uid = MyYoga.MyUser.get('uid');
    if (uid) {
      var store = container.lookup('store:main');
      store.find('user', uid)
        .then(
          function (user) {
            MyYoga.MyUser.set('user', user);
            MyYoga.advanceReadiness();
          },
          function (err) {
            MyYoga.advanceReadiness();
          }
        );
    }
    else {
      MyYoga.advanceReadiness();
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

