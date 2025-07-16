# Foodiary API

A TypeScript-based AWS Lambda API built with the Serverless Framework, following clean architecture principles.

## Project Structure

This project follows a layered architecture pattern with clear separation of concerns. Here's an explanation of the folders and their purposes:

### Root Directory

- **`.git/`** - Git version control directory
- **`.serverless/`** - Serverless Framework deployment artifacts and cache
- **`node_modules/`** - Node.js dependencies (managed by pnpm)
- **`src/`** - Main source code directory
- **`package.json`** - Project configuration and dependencies
- **`pnpm-lock.yaml`** - pnpm lock file for dependency versioning
- **`tsconfig.json`** - TypeScript configuration
- **`eslint.config.mjs`** - ESLint configuration for code linting
- **`serverless.yml`** - Serverless Framework configuration
- **`.editorconfig`** - Editor configuration for consistent coding style
- **`.gitignore`** - Git ignore rules

### Source Code (`src/`)

The source code is organized into three main layers following clean architecture principles:

#### 1. Application Layer (`src/application/`)

This layer contains the business logic and application-specific code:

- **`controllers/`** - HTTP request handlers and business logic
  - **`schemas/`** - Request/response validation schemas

- **`contracts/`** - Interfaces and contracts defining application boundaries
  - **`Controller.ts`** - Base controller interface

- **`errors/`** - Application-specific error handling
  - **`ErrorCode.ts`** - Error code definitions
  - **`http/`** - HTTP-specific error classes
    - **`BadRequest.ts`** - 400 Bad Request error
    - **`HttpError.ts`** - Base HTTP error class

#### 2. Kernel Layer (`src/kernel/`)

This layer contains cross-cutting concerns and infrastructure-agnostic code:

- **`decorators/`** - TypeScript decorators for metadata and validation
  - **`Schema.ts`** - Schema validation decorator

#### 3. Main Layer (`src/main/`)

This layer contains the infrastructure and framework-specific code:

- **`adapters/`** - External service adapters and integrations
  - **`lambdaHttpAdapater.ts`** - AWS Lambda HTTP adapter

- **`functions/`** - AWS Lambda function handlers

- **`utils/`** - Utility functions and helpers
  - **`lambdaErrorResponse.ts`** - Lambda error response utilities
  - **`lambdaBodyParser.ts`** - Request body parsing utilities

## Architecture Overview

This project follows the **Clean Architecture** pattern with three distinct layers:

1. **Application Layer**: Contains business logic, controllers, and domain-specific code
2. **Kernel Layer**: Contains cross-cutting concerns and infrastructure-agnostic utilities
3. **Main Layer**: Contains infrastructure-specific code, adapters, and framework integrations

## Technology Stack

- **Runtime**: Node.js 22.x (AWS Lambda)
- **Language**: TypeScript
- **Framework**: Serverless Framework
- **Package Manager**: pnpm
- **Validation**: Zod
- **Deployment**: AWS Lambda
- **Build Tool**: esbuild

## Development

### Prerequisites

- Node.js 22.x
- pnpm 10.12.4+
- AWS CLI configured

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Type checking:
   ```bash
   pnpm typecheck
   ```

### Deployment

Deploy to AWS using Serverless Framework:
```bash
serverless deploy
```


## Project Structure Benefits

- **Separation of Concerns**: Clear boundaries between business logic, infrastructure, and cross-cutting concerns
- **Testability**: Each layer can be tested independently
- **Maintainability**: Easy to locate and modify specific functionality
- **Scalability**: New features can be added without affecting existing code
- **Framework Independence**: Business logic is separated from AWS Lambda specifics
