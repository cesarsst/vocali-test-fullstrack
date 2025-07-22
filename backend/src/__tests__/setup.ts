// Jest setup file
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

// Mock AWS SDK clients
export const dynamoMock = mockClient(DynamoDBDocumentClient);
export const s3Mock = mockClient(S3Client);
export const cognitoMock = mockClient(CognitoIdentityProviderClient);

beforeEach(() => {
  // Reset all mocks before each test
  dynamoMock.reset();
  s3Mock.reset();
  cognitoMock.reset();
});