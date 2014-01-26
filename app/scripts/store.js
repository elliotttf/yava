Yava.Store = DS.Store.extend({
  revision: 1
});

Yava.ApplicationSerializer = DS.RESTSerializer.extend({
  primaryKey: '_id'
});

DS.RESTAdapter.reopen({
  namespace: Yava.get('apiVersion')
});

