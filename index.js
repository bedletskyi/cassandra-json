const { connectDatabase } = require('./src/db');
const { uploadDataObjects } = require('./src/uploadDataObjects');
const { convert } = require('./src/convertToJson');
const writeToFile = require('./src/fileWriter');

const app = async () => {
  const db = await connectDatabase();
  const data = await uploadDataObjects(db);

  const json = convert(data);

  if (!writeToFile(json)) {
    console.log('Something went wrong, the file was not written');
  };
  process.exit();
};

app();
