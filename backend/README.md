# Serverless Backend with Node.js, TypeScript, and AWS

A production-ready serverless backend built with Node.js, TypeScript, and orchestrated by Serverless. This project includes AWS Lambda functions, DynamoDB for data storage, S3 for file management, and Cognito for authentication.

## 🏗️ Architecture

- **API Gateway**: REST API endpoints
- **AWS Lambda**: Serverless compute functions
- **DynamoDB**: NoSQL database with single-table design
- **S3**: File storage and static assets
- **Cognito**: User authentication and authorization

## 📁 Project Structure

```
├── src/
│   ├── lambdas/           # Lambda function handlers
│   ├── services/          # AWS service clients
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript interfaces
│   ├── config/            # Configuration files
│   └── __tests__/         # Unit tests
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── jest.config.js        # Jest testing configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Serverless
- AWS CLI configured
- AWS Account with appropriate permissions

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build the project:**

   ```bash
   npm run build
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

### Infrastructure Deployment

## 📚 API Endpoints

### Authentication

- **POST** `/auth/signup` - Register a new user
- **POST** `/auth/signin` - Login user

### Files

- **POST** `/files/upload` - Get signed URL for file upload

## 🧪 Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## 🔧 Configuration

Environment variables are managed through Terraform and AWS Lambda environment variables. Key configurations include:

- `DYNAMODB_TABLE_NAME`: DynamoDB table name
- `S3_BUCKET_NAME`: S3 bucket for file storage
- `COGNITO_USER_POOL_ID`: Cognito User Pool ID
- `COGNITO_CLIENT_ID`: Cognito Client ID
- `AWS_REGION`: AWS region
- `STAGE`: Deployment stage (dev/prod)

## 🏢 Services

### DynamoDB Service

- Single-table design with PK/SK pattern
- GSI for secondary access patterns
- CRUD operations with proper error handling

### S3 Service

- Pre-signed URLs for secure file uploads
- File key generation with user isolation
- Automatic file cleanup capabilities

### Cognito Service

- User registration and authentication
- Password validation and security
- JWT token management

## 🔒 Security Features

- AWS IAM roles with least privilege
- Cognito for user authentication
- CORS configuration
- Input validation with Joi
- Secure environment variable management

## 📈 Monitoring and Logging

- Structured logging with custom logger
- Error tracking and debugging
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
