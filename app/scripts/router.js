MyYoga.Router.map(function () {
  this.resource('workouts', function () {
    this.route('mine');
    this.route('new');

    this.resource('workout', { path: '/:workout_id' }, function () {
      this.route('edit');
    });
  });
  this.route('login');
});

