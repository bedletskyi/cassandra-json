const openConnection = require('./src/databaseConector');
const getDataObject = require('./src/uploadDataObjects');
const convertToJson = require('./src/convertToJson');
const writeToFile = require('./src/fileWriter');
const assert = require('assert');

const app = async () => {
  const client = openConnection();

  client.connect(function (err) {
    assert.ifError(err);
  });

  const data = await getDataObject(client);

  const json = convertToJson(data);
  
  if (!writeToFile(json)) {
    console.log('Something went wrong, the file was not written');
  };
  process.exit();
};

app();
