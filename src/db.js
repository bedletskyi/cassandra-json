const cassandra = require('cassandra-driver');
const env = require('../config');

class Database {
  _client;

  constructor() {
    this._client = new cassandra.Client({ 
      contactPoints: [env.app.host + ':' + env.app.port],
      localDataCenter: env.app.localDatacenter,
      authProvider: new cassandra.auth.PlainTextAuthProvider(env.app.user, env.app.password)
    });
  }

  async openConnection() {
    try {
      await this._client.connect();
      console.log(
        'Connected to cluster with %d host(s): %j',
        this._client.hosts.length, this._client.hosts.keys()
      );
    } catch (err) {
      console.error('There was an error when connecting', err.message);
      await this._client.shutdown();
      process.exit();
    }
  }

  async _queryExecutor(query) {
    try {
      const resp = await this._client.execute(query);
      return resp;
    } catch (err) {
      console.log(err.messages);
    }
  }

  async getKeySpacesName() {
    const default_keyspaces = [
      'system_auth',
      'system_schema',
      'system_distributed',
      'system_traces',
      'system'
    ];
    const keyspaces = [];
    const resp = await this._queryExecutor(`SELECT * FROM system_schema.keyspaces;`);
    const keyspacesFromDb = resp.rows.filter(
      row => default_keyspaces.indexOf(row.keyspace_name) === -1
    );

    if (!keyspacesFromDb || keyspacesFromDb.length === 0) {
      return [];
    }

    keyspacesFromDb.forEach(k => keyspaces.push(k.keyspace_name));
    return keyspaces;
  }

  async getTablesNameFromKeyspace(keyspase_name) {
    const tables = [];
    const resp = await this._queryExecutor(
      `SELECT * FROM system_schema.tables WHERE keyspace_name = '${keyspase_name}';`
    );
    if (!resp) {
      return [];
    }
    resp.rows.forEach(row => tables.push(row.table_name));
    return tables;
  }

  async getFirstRowFromTable(keyspase_name, table_name) {
    const resp = await this._queryExecutor(
      `SELECT * FROM ${keyspase_name}.${table_name} LIMIT 1;`
    );

    if (!resp) {
      return undefined;
    }

    return resp.rows[0];
  }
}

const connectDatabase = async () => {
  const database = new Database();
  await database.openConnection();
  return database;
}

module.exports = {connectDatabase, Database};