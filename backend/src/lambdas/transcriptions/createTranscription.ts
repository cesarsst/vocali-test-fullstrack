import { APIGatewayProxyHandler } from "aws-lambda";
import { dynamoDBService } from "@/services/dynamodb";
import { s3Service } from "@/services/s3";
import { logger } from "@/utils/logger";
import { successResponse, errorResponse } from "@/utils/response";
import { validateInput, transcriptionSchema } from "@/utils/validation";
import { TranscriptionRequest } from "@/types";
import { getUserIdFromToken } from "@/utils/getUserFromToken";
import { transcribeFromUrl } from "@/utils/audioTotext";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return successResponse({}, "CORS preflight");
    }

    const userId = await getUserIdFromToken(
      event.headers.Authorization || event.headers.authorization
    );

    if (!event.body) {
      return errorResponse("Request body is required", 400);
    }

    const transcriptionData = validateInput<TranscriptionRequest>(
      transcriptionSchema,
      JSON.parse(event.body)
    );

    const { transcription_name, file_key } = transcriptionData;
    if (!userId || !transcription_name || !file_key) {
      return errorResponse(
        "Missing required fields: userId, transcription_name, file_key",
        400
      );
    }

    // get file download URL
    const downloadUrl = await s3Service.generateDownloadUrl(file_key);
    const text = await transcribeFromUrl(downloadUrl);

    const timestamp = Date.now();
    const item = {
      PK: `TRANSCRIPTION#${userId}`,
      SK: `TRANSCRIPTION#${timestamp}`,
      transcription_name,
      file_key,
      text,
      createdAt: new Date(timestamp).toISOString(),
    };

    await dynamoDBService.put(item);

    return successResponse({ item }, "Transcription saved successfully", 201);
  } catch (error) {
    logger.error("Failed to save transcription", { error });
    return errorResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      500
    );
  }
};
