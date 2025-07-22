import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { successResponse, errorResponse } from "@/utils/response";
import { validateInput, loginSchema } from "@/utils/validation";
import { LoginRequest, AuthResponse } from "@/types";
import { logger } from "@/utils/logger";
import { generateSecretHash } from "@/utils/secretHash";

const CLIENT_ID = process.env.COGNITO_CLIENT_ID!;
const cognito = new CognitoIdentityServiceProvider();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return successResponse({}, "CORS preflight");
    }

    if (!event.body) {
      return errorResponse("Request body is required", 400);
    }

    const loginData = validateInput<LoginRequest>(
      loginSchema,
      JSON.parse(event.body)
    );

    if (!loginData.email || !loginData.password) {
      return errorResponse("Email and password are required", 400);
    }

    const authResult = await cognito
      .initiateAuth({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: loginData.email,
          PASSWORD: loginData.password,
          SECRET_HASH: generateSecretHash(loginData.email), // Include the SECRET_HASH
        },
      })
      .promise();

    if (!authResult.AuthenticationResult) {
      logger.error("Authentication failed", { email: loginData.email });
      return errorResponse("Authentication failed", 401);
    }

    logger.info("User signin successful", { email: loginData.email });
    const { AccessToken, TokenType } = authResult.AuthenticationResult || {};

    return successResponse(
      {
        accessToken: AccessToken,
        tokenType: TokenType,
      },
      "Login successful",
      200
    );
  } catch (error) {
    logger.error("Signin error", { error });
    return errorResponse(
      error instanceof Error ? error.message : "Authentication failed",
      401
    );
  }
};
