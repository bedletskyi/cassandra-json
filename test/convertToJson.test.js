const {convert, createKeySpaceObj, createTableObj} = require('../src/convertToJson');
const toJsonSchema = require('to-json-schema');

jest.mock('to-json-schema');

describe('convertToJson module:', () => {
  test('createTableObj should be to return json object', () => {
    // Mock
    const mock = toJsonSchema.mockReturnValue({id: {type: 'string'}});

    // Call
    const testObj = { title: 'table_name' }
    const data = createTableObj(testObj);

    // Validate
    const expObj = {
      title: 'table_name',
      id: { type: 'string' }
    }
    expect(mock).toHaveBeenCalled();
    expect(data).toEqual(expObj);
  });

  test('createKeySpaceObj should be to return json object', () => {
    // Mock
    const mock = toJsonSchema.mockReturnValue({id: {type: 'string'}});

    // Call
    const testObj = { name: 'someName', tables: ['table_name'] }
    const data = createKeySpaceObj(testObj);

    // Validate
    const expObj = {
      type: 'object',
      title: 'someName',
      tables: [ { title: undefined, id: { type: 'string' } } ]
    }
    expect(mock).toHaveBeenCalled();
    expect(data).toEqual(expObj);
  });

  test('convert should be to return null if data empty', () => {
    // Call
    const data = convert(null);

    // Validate
    expect(data).toBeFalsy();
  });

  test('convert should be to return value', () => {
    // Mock
    const mock = toJsonSchema.mockReturnValue({id: {type: 'string'}});

    // Call
    const testObj = [{ name: 'someName', tables: ['table_name'] }];
    const data = convert(testObj);

    // Validate
    const expObj = {
      $schema: 'http://json-schema.org/draft-04/schema#',
      description: 'Database schema',
      type: 'array',
      keyspaces: [ { 
        type: 'object',
        title: 'someName',
        tables: [ {
          title: undefined,
          id: { type: 'string' } } 
        ] 
      } ]
    }
    expect(mock).toHaveBeenCalled();
    expect(data).toEqual(expObj);
  });
});