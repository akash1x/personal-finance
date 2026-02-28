# Personal Finance — Client

React frontend for the Personal Finance Manager application.

## Tech Stack

- **React 19** with Vite 7
- **TailwindCSS 4** with Radix UI / shadcn components
- **Redux Toolkit** & RTK Query for state management and API calls
- **React Router DOM 7** for routing
- **React Hook Form** with Zod validation

## Getting Started

```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

## Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Authentication Flow

- **Access token** is stored in-memory (Redux) — not in localStorage
- **Refresh token** is managed as an httpOnly cookie by the browser
- On page reload, the app silently calls `POST /api/auth/refresh` to restore the session
- On 401 responses, the RTK Query `baseQueryWithReauth` wrapper automatically refreshes the token and retries the request
- On logout, the backend cookie is cleared via `POST /api/auth/logout`

## Available Scripts

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Project Structure

```
src/
├── api/              # RTK Query API definitions
│   ├── api.js        # Base query with auto-refresh
│   ├── authApi.js    # Auth endpoints (login, register, refresh, logout)
│   └── ...           # Other API slices
├── components/       # Reusable UI components (shadcn/ui)
├── pages/            # Page components
│   ├── Auth/         # Login & Register
│   ├── Dashboard/    # Financial overview
│   ├── Accounts/     # Account management
│   ├── Budget/       # Budget planning
│   ├── Transactions/ # Transaction management + receipt scan
│   └── Profile/      # User profile
├── store/            # Redux store & slices
│   ├── store.js
│   └── authSlice.js  # Auth state (in-memory token)
└── App.jsx           # Root component with routing & silent refresh
```
