Yava.User = DS.Model.extend({
  name: DS.attr('string'),
  created: DS.attr('date'),
  lastLogin: DS.attr('date'),
  photo: DS.attr('string'),
  workouts: DS.hasMany('workout'),
  stats: DS.belongsTo('stat')
});

