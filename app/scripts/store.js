MyYoga.Store = DS.Store.extend({
  revision: 1
});

MyYoga.ApplicationSerializer = DS.RESTSerializer.extend({
  primaryKey: '_id'
});

DS.RESTAdapter.reopen({
  namespace: MyYoga.get('apiVersion'),
});

