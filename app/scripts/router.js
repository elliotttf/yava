MyYoga.Router.map(function () {
  this.resource('workouts', { path: '/workouts' }, function () {
    this.route('new');
  });
});
