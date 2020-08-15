const toJsonSchema = require('to-json-schema');

const convert = data => {
  if (!data) {
    console.log('Empty data for converting to json');    
    return null;
  };

  let keyspaces = [];

  data.forEach(keyspace => {
    keyspaces.push(createKeySpaceObj(keyspace));
  });

  return {
    $schema: 'http://json-schema.org/draft-04/schema#',
    description: 'Database schema',
    type: 'array',
    keyspaces
  };
};

const createKeySpaceObj = keyspace => {
  let tables = [];
  keyspace.tables.forEach(table => {
    tables.push(createTableObj(table));
  });

  return {
    type: 'object',
    title: keyspace.name,
    tables
  };
};

const createTableObj = table => {
  const columns = toJsonSchema(table.columns);
  return {
    title: table.title,
    ...columns
  };
};

module.exports = {convert, createKeySpaceObj, createTableObj};
