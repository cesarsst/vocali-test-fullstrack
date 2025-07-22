import { DynamoDBService } from '@/services/dynamodb';
import { GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoMock } from '../setup';

describe('DynamoDBService', () => {
  let service: DynamoDBService;

  beforeEach(() => {
    service = new DynamoDBService();
  });

  describe('get', () => {
    it('should retrieve an item successfully', async () => {
      const mockItem = { PK: 'USER#123', SK: 'PROFILE', email: 'test@example.com' };
      dynamoMock.on(GetCommand).resolves({ Item: mockItem });

      const result = await service.get('USER#123', 'PROFILE');

      expect(result).toEqual(mockItem);
      expect(dynamoMock.call(0).args[0].input).toMatchObject({
        TableName: expect.any(String),
        Key: { PK: 'USER#123', SK: 'PROFILE' },
      });
    });

    it('should return null when item is not found', async () => {
      dynamoMock.on(GetCommand).resolves({});

      const result = await service.get('USER#123', 'PROFILE');

      expect(result).toBeNull();
    });
  });

  describe('put', () => {
    it('should put an item successfully', async () => {
      const mockItem = { PK: 'USER#123', SK: 'PROFILE', email: 'test@example.com' };
      dynamoMock.on(PutCommand).resolves({});

      await service.put(mockItem);

      expect(dynamoMock.call(0).args[0].input).toMatchObject({
        TableName: expect.any(String),
        Item: expect.objectContaining({
          ...mockItem,
          updatedAt: expect.any(String),
        }),
      });
    });
  });

  describe('query', () => {
    it('should query items successfully', async () => {
      const mockItems = [
        { PK: 'USER#123', SK: 'PROFILE' },
        { PK: 'USER#123', SK: 'SETTINGS' },
      ];
      dynamoMock.on(QueryCommand).resolves({ Items: mockItems });

      const result = await service.query('USER#123');

      expect(result).toEqual(mockItems);
      expect(dynamoMock.call(0).args[0].input).toMatchObject({
        TableName: expect.any(String),
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: { ':pk': 'USER#123' },
      });
    });
  });
});