import { APIGatewayProxyHandler } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { successResponse, errorResponse } from "@/utils/response";
import { validateInput, userSchema } from "@/utils/validation";
import { CreateUserRequest } from "@/types";
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

    const createUserData = validateInput<CreateUserRequest>(
      userSchema,
      JSON.parse(event.body)
    );
    const { email, password, firstName, lastName } = createUserData;

    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    const params = {
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: generateSecretHash(email),
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "given_name",
          Value: firstName || "",
        },
        {
          Name: "family_name",
          Value: lastName || "",
        },
      ],
    };

    await cognito.signUp(params).promise();

    return successResponse(
      { message: "User signed up successfully. Please confirm your email." },
      "Signup successful",
      201
    );
  } catch (error: any) {
    logger.error("Unexpected error during signup", { error });
    return errorResponse(
      error.message || "Internal server error",
      error.statusCode || 500
    );
  }
};
