const db = require('../src/db');

jest.mock('cassandra-driver');

describe('Database class:', () => {
  let database;
  let mockObj

  beforeAll(() => {
    database = new db.Database();
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

  test('_queryExecutor should be to call DB and return value', async () => {
    // Mock
    const mockDb = database._client.execute.mockResolvedValue(mockObj);

    // Call
    const data = await database._queryExecutor('TEST QUERY');

    // Validate
    expect(mockDb).toHaveBeenCalled();
    expect(data).toEqual(mockObj);
  });

  test('_queryExecutor should be to return undefined', async () => {
    // Mock
    const mockDb = database._client.execute.mockResolvedValue();

    // Call
    const data = await database._queryExecutor('TEST QUERY');

    // Validate
    expect(mockDb).toHaveBeenCalled();
    expect(data).toBeUndefined();
  });

  test('getKeySpacesName should be to call database and return value', async () => {
    // Mock
    const mockMethod = database._client.execute.mockResolvedValue(mockObj);

    // Call
    const data = await database.getKeySpacesName();

    // Validate
    expect(mockMethod).toHaveBeenCalled();
    expect(data).toBeTruthy();
  });

  test('getKeySpacesName should return an array with no fixed values', async () => {
    // Mock
    const mockMethod = database._client.execute.mockResolvedValue(mockObj);

    // Call
    const data = await database.getKeySpacesName();

    // Validate
    expect(mockMethod).toHaveBeenCalled();
    expect(data).toEqual(['my_keyspace']);
  });

  test('getKeySpacesName should be to return an empty array if a value is not found', async () => {
    // Mock
    const mockMethod = database._client.execute.mockResolvedValue({ rows:[]});

    // Call
    const data = await database.getKeySpacesName();
  
    // Validate
    expect(mockMethod).toHaveBeenCalled();
    expect(data).toEqual([]);
  });

  test('getTablesNameFromKeyspace should be to call database and return value', async () => {
    // Mock
    const mockMethod = database._client.execute.mockResolvedValue(mockObj);

    // Call
    const data = await database.getTablesNameFromKeyspace('my_keyspace');
  
    // Validate
    expect(mockMethod).toHaveBeenCalled();
    expect(data).toBeTruthy();
    expect(data).toEqual(['users', 'author']);
  });

  test('getTablesNameFromKeyspace should be to return an empty array if a value is not found', async () => {
    // Mock
    const mockMethod = database._client.execute.mockResolvedValue();

    // Call
    const data = await database.getTablesNameFromKeyspace('my_keyspace');
  
    // Validate
    expect(mockMethod).toHaveBeenCalled();
    expect(data).toEqual([]);
  });

  test('getFirstRowFromTable should be to call database and return value', async () => {
    // Mock
    const mockMethod = database._client.execute.mockResolvedValue(mockObj);

    // Call
    const data = await database.getFirstRowFromTable('my_keyspace', 'my_table');
  
    // Validate
    const validObj = {
      keyspace_name: 'system_auth',
      table_name: 'users'
    };

    expect(mockMethod).toHaveBeenCalled();
    expect(data).toEqual(validObj);
  });

  test('getFirstRowFromTable should be to return undefined if a value is not found', async () => {
    // Mock
    const mockMethod = database._client.execute.mockResolvedValue();

    // Call
    const data = await database.getFirstRowFromTable('my_keyspace', 'my_table');
  
    // Validate
    expect(mockMethod).toHaveBeenCalled();
    expect(data).toBeUndefined();
  });
});