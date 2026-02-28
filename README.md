# Personal Finance Manager

A full-stack personal finance application built with NestJS and React that helps you manage your finances effectively with features like budget tracking, expense management, recurring transactions, and multi-account support.

## 🌟 Features

### Core Functionality

- **💰 Multi-Account Support** - Manage multiple bank accounts, credit cards, and cash accounts
- **📊 Transaction Management** - Track income and expenses with detailed categorization
- **📅 Recurring Transactions** - Set up automatic recurring payments and income
- **🎯 Budget Planning** - Create and monitor budgets with real-time tracking
- **📈 Dashboard Overview** - Visualize your financial health at a glance
- **🔒 Secure Authentication** - JWT-based authentication with refresh tokens and bcrypt password hashing
- **🧾 AI Receipt Scanning** - Scan receipts using Gemini AI to auto-extract transaction details

### Technical Features

- **🔄 Real-time Balance Updates** - Atomic transaction handling for accurate balance tracking
- **📧 Email Notifications** - Get notified about important financial events (mock service)
- **⏰ Automated Monitoring** - Background job processing for recurring transactions
- **🔄 Token Refresh** - Automatic access token refresh via httpOnly cookies
- **🗄️ PostgreSQL Database** - Robust data persistence with TypeORM
- **🐳 Docker Support** - Full Docker containerization for easy deployment

## � Quick Start

Choose one of the following methods to run the project:

### Option 1: Docker (Recommended - Easiest)

Run everything with a single command:

```bash
docker-compose up -d
```

Then access:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Option 2: Local Development (With Docker Database)

1. **Start PostgreSQL database:**

```bash
docker-compose up postgres -d
```

2. **Run backend server:**

```bash
cd server
npm install
npm run start:dev
# Server runs on http://localhost:5000
```

3. **Run frontend client** (in a new terminal):

```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

### Option 3: Completely Local (No Docker)

1. **Setup PostgreSQL** locally and create a database named `personal-finance`

2. **Configure environment** - Create `server/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=personal-finance
JWT_SECRET=your-secret-key-here
```

3. **Run backend:**

```bash
cd server
npm install
npm run start:dev
```

4. **Run frontend:**

```bash
cd client
npm install
npm run dev
```

## �🛠️ Tech Stack

### Backend (Server)

- **Framework:** NestJS 11
- **Language:** TypeScript 5.7
- **Database:** PostgreSQL 15
- **ORM:** TypeORM 0.3
- **Authentication:** JWT (@nestjs/jwt)
- **Password Hashing:** bcrypt
- **Validation:** class-validator & class-transformer
- **Scheduling:** @nestjs/schedule (for recurring transactions)

### Frontend (Client)

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Language:** TypeScript
- **Styling:** TailwindCSS 4
- **UI Components:** Radix UI, shadcn/ui
- **State Management:** Redux Toolkit & RTK Query
- **Routing:** React Router DOM 7
- **Form Handling:** React Hook Form with Zod validation
- **Icons:** Lucide React

### DevOps

- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL 15 Alpine
- **Testing:** Jest

## 📁 Project Structure

```
personal-finance/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components (Dashboard, Transactions, etc.)
│   │   ├── store/        # Redux store and RTK Query APIs
│   │   └── App.jsx       # Main application component
│   └── package.json
│
├── server/                # NestJS backend application
│   ├── src/
│   │   ├── v1/           # API v1 modules
│   │   │   ├── account/  # Account management
│   │   │   ├── auth/     # Authentication & authorization
│   │   │   ├── budget/   # Budget planning
│   │   │   ├── dashboard/ # Dashboard data aggregation
│   │   │   ├── transaction/ # Transaction management
│   │   │   └── users/    # User management
│   │   ├── entities/     # TypeORM entities
│   │   ├── repositories/ # Custom repositories
│   │   ├── monitor/      # Background job monitoring
│   │   └── utils/        # Shared utilities
│   └── package.json
│
├── docker-compose.yml     # Docker orchestration
├── postman_collection.json # API testing collection
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose (for containerized deployment)
- **PostgreSQL** 15+ (if running locally without Docker)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd personal-finance
```

#### 2. Setup Backend (Server)

```bash
cd server
npm install

# Configure environment variables
# Create a .env file with the following variables:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_NAME=personal-finance
# JWT_SECRET=your-secret-key

# Start the development server
npm run start:dev
```

The backend will run on `http://localhost:5000`

#### 3. Setup Frontend (Client)

```bash
cd client
npm install

# Configure API endpoint if needed
# Update VITE_API_BASE_URL in your environment

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Docker Deployment

The easiest way to run the entire application:

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Service URLs:**

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- PostgreSQL: `localhost:5433`

## 📡 API Documentation

The API follows RESTful conventions with the following main endpoints:

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive access token + refresh cookie
- `POST /api/auth/refresh` - Refresh access token using httpOnly cookie
- `POST /api/auth/logout` - Clear refresh token cookie
- `GET /api/auth/profile` - Get user profile (protected)

### Receipt Scanning

- `POST /api/receipt-scan/upload` - Upload receipt image for AI scanning (JPEG/PNG/WebP, max 5MB)

### Accounts

- `GET /api/v1/account` - Get all accounts
- `POST /api/v1/account` - Create new account
- `GET /api/v1/account/:id` - Get account by ID
- `PATCH /api/v1/account/:id` - Update account
- `DELETE /api/v1/account/:id` - Delete account

### Transactions

- `GET /api/v1/transaction` - Get all transactions
- `POST /api/v1/transaction` - Create transaction
- `GET /api/v1/transaction/:id` - Get transaction by ID
- `PATCH /api/v1/transaction/:id` - Update transaction
- `DELETE /api/v1/transaction/:id` - Delete transaction
- `GET /api/v1/transaction/budget/:budgetId` - Get transactions by budget

### Budgets

- `GET /api/v1/budget` - Get all budgets
- `POST /api/v1/budget` - Create budget
- `GET /api/v1/budget/:id` - Get budget by ID
- `PATCH /api/v1/budget/:id` - Update budget
- `DELETE /api/v1/budget/:id` - Delete budget

### Dashboard

- `GET /api/v1/dashboard` - Get dashboard summary

**Testing:** Import `postman_collection.json` into Postman for complete API testing.

## 🗃️ Database Schema

### Main Entities

- **User** - User accounts with authentication credentials
- **Account** - Financial accounts (bank, credit card, cash)
- **Transaction** - Income and expense transactions
- **RecurringTransaction** - Automated recurring transactions
- **Budget** - Budget planning and tracking

All entities include automatic timestamps (`createdAt`, `updatedAt`) and are linked through foreign key relationships.

## 🔧 Available Scripts

### Backend (Server)

```bash
npm run start          # Start production server
npm run start:dev      # Start development server with watch mode
npm run start:debug    # Start with debugging
npm run build          # Build for production
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Generate test coverage
npm run lint           # Lint and fix code
```

### Frontend (Client)

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Lint code
```

## 🔐 Security

- Passwords are hashed using bcrypt before storage
- **Dual-token auth**: short-lived access token (15 min) + long-lived refresh token (7 days)
- **Access token stored in-memory** (Redux) — not in localStorage (XSS-safe)
- **Refresh token in httpOnly cookie** — not accessible to JavaScript (XSS-safe)
- Automatic token refresh on 401 responses
- Protected routes with authentication guards
- Input validation using class-validator
- CORS enabled with credentials for secure cross-origin requests

## 🎨 UI/UX Features

- Modern, responsive design with TailwindCSS
- glassmorphism and smooth animations
- Dark mode support (if implemented)
- Intuitive navigation and user flows
- Real-time data updates with RTK Query
- Form validation with helpful error messages

## 📝 Environment Variables

### Server (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=personal-finance

# JWT Configuration
JWT_SECRET=your-secret-key-here

# AI Receipt Scanning
GEMINI_API_KEY=your-gemini-api-key

# Server Configuration
PORT=5000
```

### Client

```env
VITE_API_BASE_URL=http://localhost:5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED license - see the package.json for details.

## 🐛 Known Issues & Future Enhancements

- Email notifications are currently a mock service
- Consider adding data export functionality
- Consider adding financial reports and insights
- Mobile app (React Native) could be added

## 📧 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using NestJS and React**
