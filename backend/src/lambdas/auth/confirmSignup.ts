import { APIGatewayProxyHandler } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { successResponse, errorResponse } from "@/utils/response";
import { generateSecretHash } from "@/utils/secretHash";
import { logger } from "@/utils/logger";

const cognito = new CognitoIdentityServiceProvider();
const CLIENT_ID = process.env.COGNITO_CLIENT_ID!;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email, code } = body;

    if (!email || !code) {
      logger.error("Missing email or confirmation code", { email, code });
      return errorResponse("Email and confirmation code are required", 400);
    }

    await cognito
      .confirmSignUp({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        SecretHash: generateSecretHash(email),
      })
      .promise();

    logger.info("User confirmed successfully", { email });

    return successResponse(
      { message: "User confirmed successfully" },
      "Confirmation successful",
      200
    );
  } catch (error: any) {
    logger.error("Confirmation error", { error });
    return errorResponse(
      error instanceof Error ? error.message : "Confirmation failed",
      400
    );
  }
};
