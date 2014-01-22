var Config = exports;

Config.development = {
  db: 'mongodb://test:test@local.dev/my-yoga',
  twitter: {
    key: 'nM1Qme7AjcvXrHDrtjzDkg',
    secret: 'AVqHxDxlLij64OteIsTrWiF9OLftKrBygpp8b0G5SU',
    callback: 'http://localhost:9001/v1/auth/twitter/callback'
  }
};
