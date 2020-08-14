const toJsonSchema = require('to-json-schema');

const convert = data => {
  if (!data) {
    console.log('Empty data for converting to json');    
    return null;
  };

  let items = [];

  for (let i = 0; i < data.length; i++) {
    items.push(createKeySpaceObj(data[i]));
  };

  return {
    $schema: 'http://json-schema.org/draft-04/schema#',
    description: 'Database schema',
    type: 'array',
    items
  };
};

const createKeySpaceObj = (keyspace) => {
  let tables = [];
  for (let i = 0; i < keyspace.tables.length; i++) {
    tables.push(createTableObj(keyspace.tables[i]));
  };

  return {
    type: 'object',
    title: keyspace.keyspace,
    tables
  };
};

const createTableObj = (table) => {
  const columns = toJsonSchema(table.columns);
  return {
    title: table.name,
    ...columns
  };
};

module.exports = convert;
