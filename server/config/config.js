var Config = exports;

Config.development = {
  db: 'mongodb://test:test@local.dev/my-yoga',
  twitter: {
    key: 'nM1Qme7AjcvXrHDrtjzDkg',
    secret: 'AVqHxDxlLij64OteIsTrWiF9OLftKrBygpp8b0G5SU',
    callback: 'http://localhost:9001/v1/auth/twitter/callback'
  }
};

Config.production = {
  db: process.env.MONGOHQ_URL,
  twitter: {
    key: 'jmds7SI27wEHyLZ9Meabhg',
    secret: 'IQwhJsia509yVzD91TjM71v6QuKqCr8dFST4Mm932E',
    callback: 'http://www.yava.co/v1/auth/twitter/callback'
  }
};
