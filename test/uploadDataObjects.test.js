const { DataService } = require('../src/uploadDataObjects');
const { Database } = require('../src/db');

jest.mock('cassandra-driver');

describe('DatabseService class:', () => {
  let db;
  let databaseService;
  let mockObj;

  beforeAll(() => {
    db = new Database();
    databaseService = new DataService(db);
  });

  beforeEach(() => {
    mockObj = {
      rows: [
        {
          keyspace_name: 'system_auth',
          table_name: 'users'
        },
        {
          keyspace_name: 'my_keyspace',
          table_name: 'author'
        }
    ]};
  });

  test('createDatabaseSchemaObject should be to call Database class and return value', async () => {
    // Mock
    const mockDb = db._client.execute.mockResolvedValue(mockObj);  

    // Call
    const data = await databaseService.createDatabaseSchemaObject();

    // Validate
    const expObj = [
      {
        name: 'my_keyspace',
        tables: [
          {
            title: 'users',
            columns: { keyspace_name: 'system_auth', table_name: 'users' }
          },
          {
            title: 'author',
            columns: { keyspace_name: 'system_auth', table_name: 'users' }
          }
        ]
      }
    ];
    expect(mockDb).toHaveBeenCalled();
    expect(data).toEqual(expObj);
  });

  test('createDatabaseSchemaObject should be to return null if keyspace not found', async () => {
    // Mock
    const mockDb = db._client.execute.mockResolvedValue({rows: []});  

    // Call
    const data = await databaseService.createDatabaseSchemaObject();

    // Validate
    expect(mockDb).toHaveBeenCalled();
    expect(data).toBeNull();
  });

  test('createTablesList should be to call Database class and return value', async () => {
    // Mock
    const mockDb = db._client.execute.mockResolvedValue(mockObj);  

    // Call
    const data = await databaseService.createTablesList('keyspace');

    // Validate
    const expObj = [
      {
        title: 'users',
        columns: { keyspace_name: 'system_auth', table_name: 'users' }
      },
      {
        title: 'author',
        columns: { keyspace_name: 'system_auth', table_name: 'users' }
      }
    ];
    expect(mockDb).toHaveBeenCalled();
    expect(data).toEqual(expObj);
  });

  test('createTablesList should be to return empty array if tables not found', async () => {
    // Mock
    const mockDb = db._client.execute.mockResolvedValue({rows: []});  

    // Call
    const data = await databaseService.createTablesList('keyspace');

    // Validate
    expect(mockDb).toHaveBeenCalled();
    expect(data).toEqual([]);
  });

  test('createColumns should be to call Database class and return value', async () => {
    // Mock
    const mockDb = db._client.execute.mockResolvedValue({rows: [{name: 'Some name'}]});  

    // Call
    const data = await databaseService.createColumns('keyspace');

    // Validate
    expect(mockDb).toHaveBeenCalled();
    expect(data).toEqual({name: 'Some name'});
  });

  test('createColumns should be to return undefined if value not found', async () => {
    // Mock
    const mockDb = db._client.execute.mockResolvedValue();  

    // Call
    const data = await databaseService.createColumns('keyspace');

    // Validate
    expect(mockDb).toHaveBeenCalled();
    expect(data).toBeUndefined();
  });

  test('_checkJsonString should be to return true if string is json', async () => {
    // Call
    const data = await databaseService._checkJsonString('{"city": "Lviv", "street": "Chornovola","house": 59}');

    // Validate
    expect(data).toBeTruthy();
  });

  test('_checkJsonString should be to return false if string is not json', async () => {
    // Call
    const data = await databaseService._checkJsonString('some text');

    // Validate
    expect(data).toBeFalsy();
  });
});