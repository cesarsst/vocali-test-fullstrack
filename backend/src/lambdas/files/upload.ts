// src/lambdas/files/upload.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { s3Service } from "@/services/s3";
import { successResponse, errorResponse } from "@/utils/response";
import { validateInput, fileUploadSchema } from "@/utils/validation";
import { FileUploadRequest } from "@/types";
import { logger } from "@/utils/logger";
import { getUserIdFromToken } from "@/utils/getUserFromToken";

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

    const uploadData = validateInput<FileUploadRequest>(
      fileUploadSchema,
      JSON.parse(event.body)
    );

    const fileKey = s3Service.generateFileKey(userId, uploadData.fileName);
    const uploadUrl = await s3Service.generateUploadUrl(
      fileKey,
      uploadData.fileType
    );

    logger.info("File upload URL generated", {
      userId,
      fileName: uploadData.fileName,
      fileKey,
    });

    return successResponse(
      {
        uploadUrl,
        fileKey,
      },
      "Upload URL generated successfully"
    );
  } catch (error) {
    logger.error("File upload error", { error });
    return errorResponse(
      error instanceof Error ? error.message : "Failed to generate upload URL",
      500
    );
  }
};
