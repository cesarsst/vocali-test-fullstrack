import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "user-service",
  useDotenv: true,
  plugins: ["serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "us-east-1",
    stage: "dev",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      COGNITO_USER_POOL_ID: "${env:COGNITO_USER_POOL_ID}",
      COGNITO_CLIENT_ID: "${env:COGNITO_CLIENT_ID}",
      COGNITO_CLIENT_SECRET: "${env:COGNITO_CLIENT_SECRET}",
      S3_BUCKET_NAME: "${env:S3_BUCKET_NAME}",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "cognito-idp:SignUp",
        ],
        Resource: "*", // idealmente restrinja aos seus ARNs
      },
      {
        Effect: "Allow",
        Action: ["s3:GetObject", "s3:PutObject"],
        Resource: "arn:aws:s3:::user-service-uploads-${self:provider.stage}/*",
      },
    ],
  },
  functions: {
    signup: {
      handler: "src/lambdas/auth/signup.handler",
      events: [
        {
          http: {
            path: "signup",
            method: "post",
            cors: true,
          },
        },
      ],
    },
    signin: {
      handler: "src/lambdas/auth/signin.handler",
      events: [
        {
          http: {
            path: "signin",
            method: "post",
            cors: true,
          },
        },
      ],
    },
    confirmSignup: {
      handler: "src/lambdas/auth/confirmSignup.handler",
      events: [
        {
          http: {
            path: "confirm-signup",
            method: "post",
            cors: true,
          },
        },
      ],
    },
    upload: {
      handler: "src/lambdas/files/upload.handler",
      events: [
        {
          http: {
            path: "upload",
            method: "post",
            cors: true,
          },
        },
      ],
    },
    createTranscription: {
      handler: "src/lambdas/transcriptions/createTranscription.handler",
      timeout: 120,
      events: [
        {
          http: {
            path: "create-transcription",
            method: "post",
            cors: true,
          },
        },
      ],
    },
    getUserTranscriptions: {
      handler: "src/lambdas/transcriptions/getAllUserTranscription.handler",
      events: [
        {
          http: {
            path: "get-transcriptions",
            method: "get",
            cors: true,
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
    },
  },
  // resources: {
  //   Resources: {
  //     UserUploadsBucket: {
  //       Type: "AWS::S3::Bucket",
  //       Properties: {
  //         BucketName: "${env:S3_BUCKET_NAME}",
  //         CorsConfiguration: {
  //           CorsRules: [
  //             {
  //               AllowedOrigins: ["*"], // ajuste conforme necessário
  //               AllowedMethods: ["GET", "PUT", "POST", "DELETE"],
  //               AllowedHeaders: ["*"],
  //               MaxAge: 3000,
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   },
  // },
  resources: {
    Resources: {
      UserServiceTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${env:DYNAMODB_TABLE_NAME}",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            { AttributeName: "PK", AttributeType: "S" },
            { AttributeName: "SK", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" },
            { AttributeName: "SK", KeyType: "RANGE" },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
