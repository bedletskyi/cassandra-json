const fs = require("fs");

const write = schema => {
  if (!schema) {
    console.log('Empty data for writing to file');
    return false;
  };

  try {
    fs.writeFileSync('result.json', JSON.stringify(schema));
    console.log('Data has been written to file!');
  } catch (e) {
    console.log('Something went wrong while writing file');
  }
  return true;
};

module.exports = write;