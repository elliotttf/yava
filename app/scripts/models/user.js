Yava.User = DS.Model.extend({
  name: DS.attr('string'),
  workouts: DS.hasMany('workout')
});

