# AWS Lambda User Management Service

This README provides comprehensive documentation for the AWS Lambda User Management Service project, which implements a serverless user authentication system with sign-up and sign-in functionality.

## 📋 Project Overview

This project implements a serverless user management service using AWS Lambda, API Gateway, and DynamoDB following hexagonal architecture principles. The system provides:

- User registration with password encryption
- User authentication with JWT tokens
- Email uniqueness validation

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  API Gateway │ ──► │   Lambda    │ ──► │  DynamoDB   │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Components
- **Lambda Functions**: sign-up, sign-in, jwt-authorizer
- **API Gateway**: HTTP API with routes for user operations
- **DynamoDB**: NoSQL database with GSI for email lookups
- **JWT**: Stateless authentication for protected routes

## 🔧 Prerequisites

- Node.js (v18+)
- AWS CLI (configured with appropriate permissions)
- Terraform (v1.0+)
- AWS Account with appropriate permissions

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DevKike/market-aws-lambda-users.git
cd market-aws-lambda-users
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a .env file based on .env.example:

```bash
AWS_REGION=us-west-1
USERS_DYNAMODB_TABLE_NAME=users
SALT_ROUNDS=10
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_TOKEN_EXPIRATION=604800 (ms)
```

### 4. Create Terraform variables file

Create terraform.tfvars based on the example:

```hcl
aws_access_key = "YOUR_ACCESS_KEY"
aws_secret_key = "YOUR_SECRET_KEY"
aws_region = "us-west-1"

base_cidr_block = "10.0.0.0/16"

jwt_secret = "your-secret-key-change-in-production"
```

## 📁 Project Structure

```
├── src/
│   ├── application/             # Application use cases
│   │   └── use-cases/
│   │       ├── sign-in.use-case.ts
│   │       └── sign-up.use-case.ts
│   │
│   ├── domain/                  # Domain entities and interfaces
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── service/
│   │   └── use-case/
│   │
│   └── infrastructure/          # Implementation details
│       ├── environments/        # Environment configurations
│       ├── handlers/            # Lambda function handlers
│       ├── repository/          # Repository implementations
│       ├── service/             # Service implementations
│       └── utils/               # Utility functions
│
├── terraform/                   # Infrastructure as Code
│   ├── modules/                 # Terraform modules
│   │   ├── api-gateway/
│   │   ├── dynamo-db/
│   │   ├── lambda/
│   │   └── shared-resources/    # IAM roles and policies
│   │
│   ├── api-gateway-authorizer.tf
│   ├── api-gateway.tf
│   ├── dynamo-db.tf
│   ├── lambdas.tf
│   ├── provider.tf
│   └── variables.tf
│
└── build.js                     # Lambda build script
```

## 📦 Lambda Functions

The project includes three Lambda functions:

1. **sign-up**: Registers new users with encrypted passwords
2. **sign-in**: Authenticates users and generates JWT tokens
3. **jwt-authorizer**: Validates JWT tokens for protected routes

## 🗄️ Database Schema

**DynamoDB Table: users**

- `id` (Partition Key): String (UUID)
- `email`: String (with GSI for lookups)
- `name`: String
- `phone`: String
- `password`: String (bcrypt hashed)
- `createdAt`: Number (timestamp)

## 🚢 Deployment

### Build and Deploy

```bash
# Build Lambda functions and deploy infrastructure
npm run deploy

# Individual steps
npm run build:lambdas  # Build Lambda functions
cd terraform && terraform apply  # Deploy infrastructure
```

### Terraform Commands

```bash
# Initialize Terraform
cd terraform
terraform init

# Plan deployment
terraform plan

# Apply changes
terraform apply

# Destroy resources
terraform destroy
```

## 🔌 API Endpoints

### Sign Up

```
POST /users/sign-up
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "555-1234"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "createdAt": 1747717717575
  }
}
```

### Sign In

```
POST /users/sign-in
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔧 Technologies Used

- **Runtime**: Node.js 18
- **Language**: TypeScript
- **Framework**: AWS Lambda with API Gateway
- **Database**: Amazon DynamoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Bundling**: esbuild
- **Infrastructure**: Terraform
- **UUID Generation**: uuid

## 🛠️ Troubleshooting

### Common Issues

1. **Lambda Timeouts**:
   - Increase memory allocation (currently 384MB)
   - Check for inefficient database operations

2. **Permissions Issues**:
   - Verify IAM roles have correct policies
   - Check DynamoDB access permissions

3. **JWT Authorization Failures**:
   - Verify JWT_SECRET_KEY environment variable
   - Check token format (should be "Bearer TOKEN")

---

🚀 Happy coding! 🚀
