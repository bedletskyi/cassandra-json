const cassandra = require('cassandra-driver');
const env = require('../config');

const openConnection = () => {
  return new cassandra.Client({
    contactPoints: [env.app.host + ':' + env.app.port],
    localDataCenter: env.app.localDatacenter,
    authProvider: new cassandra.auth
      .PlainTextAuthProvider(env.app.user, env.app.password)
  });
};

module.exports = openConnection;