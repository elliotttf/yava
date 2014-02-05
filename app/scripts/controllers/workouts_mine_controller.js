Yava.WorkoutsMineController = Yava.WorkoutsIndexController.extend({
  find: function () {
    return this.store.find('workout', { page: this.get('page'), user: Yava.MyUser.get('uid') });
  }
});

