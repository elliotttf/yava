MyYoga.Store = DS.Store.extend({
  revision: 1
});

DS.RESTAdapter.reopen({
  namespace: 'v1'
});
