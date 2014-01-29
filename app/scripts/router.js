Yava.Router.map(function () {
  // Goal routes.
  this.resource('goals', function () {
    this.route('new');

    this.resource('goal', { path: '/:goal_id' });
  });

  // User routes.
  this.resource('user', { path: '/users/:user_id' });

  // Workout routes.
  this.resource('workouts', function () {
    this.route('mine');
    this.route('new');

    this.resource('workout', { path: '/:workout_id' }, function () {
      this.route('edit');
      this.route('delete');
    });
  });

  // Auxillary routes.
  this.route('login');
  this.route('logout');
});

