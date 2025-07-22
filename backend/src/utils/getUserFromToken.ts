// src/utils/getUserFromToken.ts
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { logger } from "@/utils/logger";

const cognito = new CognitoIdentityServiceProvider();

export const getUserIdFromToken = async (
  authHeader?: string
): Promise<string> => {
  if (!authHeader) {
    throw new Error("Authorization token is missing");
  }

  const accessToken = authHeader.replace(/^Bearer\s/, "");

  try {
    const { Username } = await cognito
      .getUser({ AccessToken: accessToken })
      .promise();

    if (!Username) {
      throw new Error("User not found in Cognito");
    }

    return Username;
  } catch (error) {
    logger.error("Error validating access token with Cognito", { error });
    throw new Error("Invalid access token");
  }
};
