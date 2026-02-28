# Personal Finance — Server

NestJS backend API for the Personal Finance Manager application.

## Tech Stack

- **NestJS 11** with TypeScript 5.7
- **PostgreSQL 15** with TypeORM 0.3
- **JWT Authentication** with refresh token rotation (`@nestjs/jwt`)
- **bcrypt** for password hashing
- **cookie-parser** for httpOnly refresh token cookies
- **Gemini AI** (`@google/generative-ai`) for receipt scanning
- **@nestjs/schedule** for recurring transaction monitoring
- **class-validator** & **class-transformer** for input validation

## Getting Started

```bash
npm install
npm run start:dev
# Runs on http://localhost:5000
```

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=personal-finance
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
```

## Authentication

The server implements a dual-token auth flow:

| Token         | Type                  | Expiry     | Storage               |
| ------------- | --------------------- | ---------- | --------------------- |
| Access Token  | JWT (Bearer header)   | 15 minutes | Client memory (Redux) |
| Refresh Token | JWT (httpOnly cookie) | 7 days     | Browser cookie        |

### Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Returns access token in JSON + sets refresh token cookie
- `POST /api/auth/refresh` — Rotates tokens (reads cookie, returns new access token + sets new cookie)
- `POST /api/auth/logout` — Clears the refresh token cookie
- `GET /api/auth/profile` — Returns authenticated user profile

## API Modules

| Module       | Prefix              | Description                                          |
| ------------ | ------------------- | ---------------------------------------------------- |
| Auth         | `/api/auth`         | Registration, login, token refresh, logout, profile  |
| Account      | `/api/account`      | Multi-account management (bank, credit card, cash)   |
| Transaction  | `/api/transaction`  | Income & expense tracking with recurring support     |
| Budget       | `/api/budget`       | Budget creation and monitoring                       |
| Dashboard    | `/api/dashboard`    | Aggregated financial overview                        |
| Receipt Scan | `/api/receipt-scan` | AI-powered receipt image scanning (Gemini 2.5 Flash) |
| Monitor      | (background)        | Cron job for processing recurring transactions       |

## Available Scripts

```bash
npm run start          # Start production server
npm run start:dev      # Start with watch mode
npm run start:debug    # Start with debugging
npm run build          # Build for production
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Generate test coverage
npm run lint           # Lint and fix code
```

## Project Structure

```
src/
├── entities/          # TypeORM entities (User, Account, Transaction, Budget)
├── repositories/      # Custom TypeORM repositories
├── v1/                # API v1 modules
│   ├── auth/          # Authentication & authorization
│   ├── account/       # Account management
│   ├── transaction/   # Transaction management
│   ├── budget/        # Budget planning
│   ├── dashboard/     # Dashboard aggregation
│   ├── receipt-scan/  # AI receipt scanning
│   └── users/         # User management
├── monitor/           # Background job (recurring transactions)
├── utils/             # Shared enums & utilities
├── app.module.ts      # Root module
└── main.ts            # Bootstrap with CORS, cookies, validation
```
