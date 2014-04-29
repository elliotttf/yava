var Config = exports;

Config.development = {
  db: 'mongodb://test:test@local.dev/yava',
  twitter: {
    key: 'nM1Qme7AjcvXrHDrtjzDkg',
    secret: 'AVqHxDxlLij64OteIsTrWiF9OLftKrBygpp8b0G5SU',
    callback: 'http://localhost:9001/v1/auth/twitter/callback'
  },
  foursquare: {
    key: 'BNG0VTDG1TFQEYGLUD3GLSCUWD3T5QKBXZLRR0SHMGYB4BRE',
    secret: 'GFX12RH2KP1WKVVARMX3KZN0R3LXTHEDVACGD3JZUNTMD3CV'
  },
  pageLimit: 5
};

Config.production = {
  db: process.env.MONGOHQ_URL,
  twitter: {
    key: 'jmds7SI27wEHyLZ9Meabhg',
    secret: 'IQwhJsia509yVzD91TjM71v6QuKqCr8dFST4Mm932E',
    callback: 'http://www.yava.co/v1/auth/twitter/callback'
  },
  foursquare: {
    key: 'BNG0VTDG1TFQEYGLUD3GLSCUWD3T5QKBXZLRR0SHMGYB4BRE',
    secret: 'GFX12RH2KP1WKVVARMX3KZN0R3LXTHEDVACGD3JZUNTMD3CV'
  },
  pageLimit: 20
};
