const fs = require("fs");

const write = schema => {
  try {
    fs.writeFileSync('result.json', JSON.stringify(schema));
    console.log('Data has been written to file!');
  } catch (e) {
    console.log('Something was wrong');
  }
}

module.exports = write;