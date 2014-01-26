Yava.Auth = Ember.Object.extend({
  uid: null,
  user: null,

  loggedIn: function () {
    if (this.user && this.user.get('id')) {
      return true;
    }
    return false;
  }.property('user'),

  init: function () {
    this._super();

    this.set('uid', jQuery.cookie('uid'));
  },

  destroy: function () {
    this._super();

    jQuery.removeCookie('uid');
  }
});

