import crypto from "crypto";

export function generateSecretHash(user_email: string) {
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET!;

  return crypto
    .createHmac("SHA256", clientSecret)
    .update(user_email + clientId)
    .digest("base64");
}
[];
