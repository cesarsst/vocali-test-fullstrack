import dotenv from "dotenv";
dotenv.config();

export const config = {
  aws: {
    region: process.env.AWS_REGION || "us-east-1",
    dynamodb: {
      tableName: process.env.DYNAMODB_TABLE_NAME || "serverless-backend-table",
    },
    s3: {
      bucketName: process.env.S3_BUCKET_NAME || "serverless-backend-bucket",
    },
    cognito: {
      userPoolId: process.env.COGNITO_USER_POOL_ID || "eu-north-1_co9nKSHsX",
      clientId: process.env.COGNITO_CLIENT_ID || "25j2diukosellhn1t69k7c5q19",
      clientSecret: process.env.COGNITO_CLIENT_SECRET || "",
    },
  },
  app: {
    stage: process.env.STAGE || "dev",
    logLevel: process.env.LOG_LEVEL || "info",
  },
};

export const isDev = (): boolean => config.app.stage === "dev";
export const isProd = (): boolean => config.app.stage === "prod";
