MyYoga.Router.map(function () {
  this.resource('workouts', function () {
    this.route('mine');
    this.route('new');
  });
  this.route('login');
});

