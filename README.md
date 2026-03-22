# Fast Delivery Back

Fast Delivery is a rapid delivery application designed to manage and track product delivery orders. Built with scalability in mind, it uses a Singleton pattern for services.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB
- **Authentication:** JWT & bcrypt

## Project Structure

```
fast-delivery-back/
├── config/          # Configuration files (DB, tokens)
├── controllers/     # HTTP request handlers
├── docs/            # Swagger documentation
├── interfaces/      # TypeScript interfaces
├── middlewares/     # Express middleware (auth)
├── models/          # MongoDB schemas
├── routes/          # API route definitions
├── seeder/          # Database seeders
├── services/        # Business logic (Singleton)
├── test/            # Unit tests
└── server.ts        # Entry point
```

## Architecture

- **Controllers:** Handle HTTP requests and business logic
- **Models:** Define MongoDB document structure
- **Services:** Business logic with Singleton pattern for shared instances
- **Routes:** API endpoint definitions
- **Middlewares:** Auth middleware for protected routes

## Authentication

- JWT tokens for secure session management
- bcrypt for password hashing

## GitFlow Workflow

- `main` - Production branch
- `develop` - Integration branch for features
- `feature/*` - Feature branches from develop
- `fix/*` - Bug fixes from develop
- `hotfix/*` - Critical fixes from main

## Semantic Versioning

Format: `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Docker (optional)

### Installation

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Run Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Run with Docker

```bash
docker-compose build
docker-compose up
```

### Lint & Typecheck

```bash
npm run lint
npx tsc --noEmit
```

## API Documentation

Swagger docs available at `/api-docs` when server is running.
