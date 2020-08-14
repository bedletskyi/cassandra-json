const uuid = require('uuid');

const getKeyspaces = async client => {
  const default_keyspaces = ['system_auth', 'system_schema', 'system_distributed', 'system_traces', 'system'];
  let keyspaces = [];
  try {
    const resp = await client.execute(`SELECT * FROM system_schema.keyspaces;`);
    const keyspacesFromDb = resp.rows.filter(row => default_keyspaces.indexOf(row.keyspace_name) === -1);
    keyspacesFromDb.forEach(k => keyspaces.push({keyspace: k.keyspace_name}));
    return keyspaces;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getTableName = async (client, keyspaces) => {
  if (!keyspaces) {
    return null;
  }
  const tables = []
  for (let i = 0; i < keyspaces.length; i++) {
    try {
      const resp = await client.execute(`SELECT * FROM system_schema.tables WHERE keyspace_name = '${keyspaces[i].keyspace}';`);
      const resultObj = { keyspace: keyspaces[i].keyspace, tables: [] }
      resp.rows.forEach(row => resultObj.tables = [...resultObj.tables, { name: row.table_name }]);
      tables.push(resultObj);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  return tables;
};

const getFirstRowFromTable = async (client, data) => {
  if(!data) {
    return null;
  }
  result = [];
  for (let i = 0; i < data.length; i++) {
    let keyspace = {keyspace: '', tables: []};
    for (let j = 0; j < data[i].tables.length; j++) {
      const resp = await client.execute(`SELECT * FROM ${data[i].keyspace}.${data[i].tables[j].name} LIMIT 1;`);
      if (resp.rows.length > 0) {
        const rowData = getDataFromRow(resp);
        keyspace = {
          keyspace: data[i].keyspace,
          tables: [...keyspace.tables, {name: data[i].tables[j].name, columns: rowData}]
        };
      };
    };
    result.push(keyspace);
  };
  return result;
};

const getDataFromRow = (row) => {
  let result = {...row.rows[0]};
  for (let key in row.rows[0]) {
    if (typeof(row.rows[0][key]) === 'object') {
      let someObj = JSON.stringify(row.rows[0][key]);
      someObj = someObj.substring(1, someObj.length-1);
      if (uuid.validate(someObj)) {
        result[key] = someObj;
      }
    }
    if (typeof(row.rows[0][key]) === 'string') {
      if (checkJsonString(row.rows[0][key])) {
        const value = JSON.parse(row.rows[0][key]);
        result[key] = value;
      }
    }
  }
  return result;
}

const checkJsonString = string => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
}

const uploadDataObjects = async client => {
  if (!client) {
    return null;
  }
  const keyspaces = await getKeyspaces(client);
  const tables = await getTableName(client, keyspaces);
  const shemaObj = await getFirstRowFromTable(client, tables);
  return shemaObj;
};

module.exports = uploadDataObjects;