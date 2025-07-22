import { APIGatewayProxyHandler } from "aws-lambda";
import { dynamoDBService } from "@/services/dynamodb";
import { logger } from "@/utils/logger";
import { successResponse, errorResponse } from "@/utils/response";
import { getUserIdFromToken } from "@/utils/getUserFromToken";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return successResponse({}, "CORS preflight");
    }

    const userId = await getUserIdFromToken(
      event.headers.Authorization || event.headers.authorization
    );

    const pk = `TRANSCRIPTION#${userId}`;

    const items = await dynamoDBService.query(pk);

    return successResponse(
      { transcriptions: items },
      "Transcriptions fetched successfully",
      200
    );
  } catch (error) {
    logger.error("Failed to fetch transcriptions", { error });
    return errorResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      500
    );
  }
};
