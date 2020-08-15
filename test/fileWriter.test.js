const write = require('../src/fileWriter');
const fs = require("fs");

jest.mock('fs');

describe('File writer module:', () => {
  test('write should be to return true when if is written', () => {
    // Mock
    const mock = fs.writeFileSync.mockReturnValue(true);

    // Call
    const data = write('test');

    // Validate
    expect(mock).toHaveBeenCalled();
    expect(data).toBeTruthy();
  });

  test('write should be to return false if file has been not written', () => {
    // Mock
    const mock = fs.writeFileSync.mockReturnValue(true);

    // Call
    const data = write();

    // Validate
    expect(mock).toHaveBeenCalled();
    expect(data).toBeFalsy();
  });
});