const uuid = require('uuid');

class DataService {
  _client;

  constructor(client) {
    this._client = client;
  }

  async createDatabaseSchemaObject() {
    const keyspaces = await this._client.getKeySpacesName();
    if (keyspaces.length === 0) {
      console.log('Keyspaces not found in database');
      return null;
    }
    
    const result = [];
    for (let i = 0; i < keyspaces.length; i++) {
      const tables = await this.createTablesList(keyspaces[i]);
      result.push({name: keyspaces[i], tables});      
    }
    return result;
  }

  async createTablesList(keyscpace) {
    const resp = await this._client.getTablesNameFromKeyspace(keyscpace);
    if (resp.length === 0) {
      return [];
    }

    const result = [];
    for (let i = 0; i < resp.length; i++) {
      const columns = await this.createColumns(keyscpace, resp[i])
      if (!columns) {
        continue;
      }
      result.push({title: resp[i], columns})
    }
    return result;
  }

  async createColumns(keyspace, table) {
    let resp = await this._client.getFirstRowFromTable(keyspace, table);

    if (!resp) {
      return undefined;
    }

    for (let key in resp) {
      switch(typeof resp[key]) {
        case 'string': {
          if (this._checkJsonString(resp[key])) {
            const obj = JSON.parse(resp[key]);
            resp[key] = obj;
            break;
          };
        }
        case 'object': {
          const str = resp[key].toString();
          if (uuid.validate(str)) {
            resp[key] = str;
            break;
          };          
        }
      }
    }
    return resp;
  }

  _checkJsonString = string => {
    try {
      JSON.parse(string);
    } catch (e) {
      return false;
    };
    return true;
  }
}

const uploadDataObjects = async client => {
  if (!client) {
    console.log('Database not connected');
    return null;
  };

  const dataService = new DataService(client);
  const data = await dataService.createDatabaseSchemaObject();
  return data;
};

module.exports = {uploadDataObjects, DataService};