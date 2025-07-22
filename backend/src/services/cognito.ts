import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  GetUserCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { config } from "@/config";
import { logger } from "@/utils/logger";
import { CreateUserRequest, LoginRequest, AuthResponse } from "@/types";
import * as crypto from "crypto";

class CognitoService {
  private client: CognitoIdentityProviderClient;
  private clientId: string;

  constructor() {
    console.log("Initializing CognitoService with config:", config.aws);
    this.client = new CognitoIdentityProviderClient({
      region: config.aws.region,
    });
    this.clientId = config.aws.cognito.clientId;
  }

  async signUp(
    userData: CreateUserRequest
  ): Promise<{ userSub: string; requiresConfirmation: boolean }> {
    try {
      const command = new SignUpCommand({
        ClientId: this.clientId,
        Username: userData.email,
        Password: userData.password,
        UserAttributes: [
          { Name: "email", Value: userData.email },
          { Name: "given_name", Value: userData.firstName },
          { Name: "family_name", Value: userData.lastName },
        ],
      });

      const result = await this.client.send(command);
      logger.info("Cognito signUp successful", { email: userData.email });

      return {
        userSub: result.UserSub!,
        requiresConfirmation: !result.UserConfirmed,
      };
    } catch (error) {
      logger.error("Cognito signUp error", { email: userData.email, error });
      throw error;
    }
  }

  async signIn(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const secretHash = this.calculateSecretHash(loginData.email);

      const command = new InitiateAuthCommand({
        ClientId: this.clientId,
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: loginData.email,
          PASSWORD: loginData.password,
          SECRET_HASH: secretHash, // Include the SECRET_HASH
        },
      });

      const result = await this.client.send(command);

      if (!result.AuthenticationResult) {
        throw new Error("Authentication failed");
      }

      // Get user details
      const user = await this.getUserDetails(
        result.AuthenticationResult.AccessToken!
      );

      logger.info("Cognito signIn successful", { email: loginData.email });

      return {
        accessToken: result.AuthenticationResult.AccessToken!,
        refreshToken: result.AuthenticationResult.RefreshToken!,
      };
    } catch (error) {
      logger.error("Cognito signIn error", { email: loginData.email, error });
      throw error;
    }
  }

  async confirmSignUp(email: string, confirmationCode: string): Promise<void> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: this.clientId,
        Username: email,
        ConfirmationCode: confirmationCode,
      });

      await this.client.send(command);
      logger.info("Cognito confirmSignUp successful", { email });
    } catch (error) {
      logger.error("Cognito confirmSignUp error", { email, error });
      throw error;
    }
  }

  async getUserDetails(accessToken: string): Promise<any> {
    try {
      const command = new GetUserCommand({
        AccessToken: accessToken,
      });

      const result = await this.client.send(command);

      const userAttributes = result.UserAttributes || [];
      const getAttribute = (name: string): string => {
        const attr = userAttributes.find((attr) => attr.Name === name);
        return attr?.Value || "";
      };

      return {
        email: getAttribute("email"),
        firstName: getAttribute("given_name"),
        lastName: getAttribute("family_name"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error("Cognito getUserDetails error", { error });
      throw error;
    }
  }

  private calculateSecretHash(username: string): string {
    const hmac = crypto.createHmac("sha256", config.aws.cognito.clientSecret);
    hmac.update(username + this.clientId);
    return hmac.digest("base64");
  }
}

export const cognitoService = new CognitoService();
