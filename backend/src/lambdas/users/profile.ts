import { APIGatewayProxyHandler } from 'aws-lambda';
import { dynamoDBService } from '@/services/dynamodb';
import { successResponse, errorResponse } from '@/utils/response';
import { logger } from '@/utils/logger';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return successResponse({}, 'CORS preflight');
    }

    const userId = event.pathParameters?.userId;
    if (!userId) {
      return errorResponse('User ID is required', 400);
    }

    const user = await dynamoDBService.get(`USER#${userId}`, 'PROFILE');
    
    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Remove internal fields
    const { PK, SK, GSI1PK, GSI1SK, cognitoSub, ...userProfile } = user;
    
    logger.info('User profile retrieved', { userId });

    return successResponse(userProfile, 'User profile retrieved successfully');

  } catch (error) {
    logger.error('Get user profile error', { error });
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve user profile',
      500
    );
  }
};