import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import { DynamoDBItem } from '@/types';

class DynamoDBService {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    const dynamoClient = new DynamoDBClient({ region: config.aws.region });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
    this.tableName = config.aws.dynamodb.tableName;
  }

  async get(pk: string, sk: string): Promise<DynamoDBItem | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { PK: pk, SK: sk },
      });

      const result = await this.client.send(command);
      return result.Item as DynamoDBItem || null;
    } catch (error) {
      logger.error('DynamoDB get error', { pk, sk, error });
      throw error;
    }
  }

  async put(item: DynamoDBItem): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          ...item,
          updatedAt: new Date().toISOString(),
        },
      });

      await this.client.send(command);
      logger.info('DynamoDB put successful', { pk: item.PK, sk: item.SK });
    } catch (error) {
      logger.error('DynamoDB put error', { item, error });
      throw error;
    }
  }

  async update(pk: string, sk: string, updates: Record<string, any>): Promise<DynamoDBItem> {
    try {
      const updateExpression = 'SET ' + Object.keys(updates)
        .map(key => `#${key} = :${key}`)
        .join(', ') + ', #updatedAt = :updatedAt';

      const expressionAttributeNames = Object.keys(updates)
        .reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), { '#updatedAt': 'updatedAt' });

      const expressionAttributeValues = Object.keys(updates)
        .reduce((acc, key) => ({ ...acc, [`:${key}`]: updates[key] }), { ':updatedAt': new Date().toISOString() });

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { PK: pk, SK: sk },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      });

      const result = await this.client.send(command);
      logger.info('DynamoDB update successful', { pk, sk });
      return result.Attributes as DynamoDBItem;
    } catch (error) {
      logger.error('DynamoDB update error', { pk, sk, updates, error });
      throw error;
    }
  }

  async delete(pk: string, sk: string): Promise<void> {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { PK: pk, SK: sk },
      });

      await this.client.send(command);
      logger.info('DynamoDB delete successful', { pk, sk });
    } catch (error) {
      logger.error('DynamoDB delete error', { pk, sk, error });
      throw error;
    }
  }

  async query(pk: string, skPrefix?: string): Promise<DynamoDBItem[]> {
    try {
      let keyConditionExpression = 'PK = :pk';
      const expressionAttributeValues: Record<string, any> = { ':pk': pk };

      if (skPrefix) {
        keyConditionExpression += ' AND begins_with(SK, :skPrefix)';
        expressionAttributeValues[':skPrefix'] = skPrefix;
      }

      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
      });

      const result = await this.client.send(command);
      return result.Items as DynamoDBItem[] || [];
    } catch (error) {
      logger.error('DynamoDB query error', { pk, skPrefix, error });
      throw error;
    }
  }
}

export const dynamoDBService = new DynamoDBService();

export { DynamoDBService }