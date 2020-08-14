const cassandra = require('cassandra-driver');
const assert = require('assert');
const env = require('../config');

const openConnection = () => {
  const client = new cassandra.Client({
    contactPoints: [env.app.host + ':' + env.app.port],
    localDataCenter: env.app.localDatacenter,
    authProvider: new cassandra.auth
      .PlainTextAuthProvider(env.app.user, env.app.password)
  });

  client.connect(function (err) {
    assert.ifError(err);
  });

  return client;
};

module.exports = openConnection;