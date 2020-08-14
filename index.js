const openConnection = require('./src/databaseConector');
const getDataObject = require('./src/uploadDataObjects');
const convertToJson = require('./src/convertToJson');
const writeToFile = require('./src/fileWriter');

const app = async () => {
  const client = openConnection();
  const data = await getDataObject(client);
  if (!data) {
    console.log('Someting was wrong');    
    process.exit();
  }
  const json = convertToJson(data);
  writeToFile(json);
  process.exit();
}

app();
