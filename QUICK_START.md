# Quick Start Guide - MetaMask Authentication

This guide walks you through setting up and testing the MetaMask authentication system.

## Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**
- **MetaMask** browser extension
- **PostgreSQL** database (or Supabase)
- **Code editor** (VS Code recommended)

## Installation

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Set up your .env file with database credentials
# Edit .env and add:
# DATABASE_URL="postgresql://user:password@localhost:5432/truthlens"
# DIRECT_URL="postgresql://user:password@localhost:5432/truthlens"
# JWT_SECRET="your-strong-random-secret-32-chars-min"
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Frontend .env is already configured
# VITE_BACKEND_URL=http://localhost:3001/api
```

## Running the Application

### Terminal 1 - Start Backend

```bash
cd backend
npm run dev
```

Expected output:

```
Server running on http://localhost:3001
API available at http://localhost:3001/api
```

### Terminal 2 - Start Frontend

```bash
cd frontend
npm run dev
```

Expected output:

```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Testing Authentication

### Via Frontend UI

1. **Open Frontend**: Go to `http://localhost:5173`
2. **Find Login Component**: Look for MetaMask login buttons
3. **Connect Wallet**: Click "Connect Wallet" or "Login with MetaMask"
4. **Approve in MetaMask**: A popup will appear - approve the connection
5. **Sign Message**: Another popup will appear asking to sign a nonce - sign it
6. **Success**: You should see your wallet address and be logged in!

### Via cURL (Manual Testing)

#### Step 1: Get a nonce

```bash
curl "http://localhost:3001/api/auth/nonce?address=0x742d35Cc6634C0532925a3b844Bc0e7595f6Ae29"
```

Response:

```json
{
  "message": "TruthLens verification nonce: abc123xyz..."
}
```

#### Step 2: Sign with MetaMask

In MetaMask or your wallet app, sign the message returned above.
You'll get a signature like: `0x...`

#### Step 3: Verify signature

```bash
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc0e7595f6Ae29",
    "signature": "0x...",
    "message": "TruthLens verification nonce: abc123xyz..."
  }'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Step 4: Use the token

```bash
curl http://localhost:3001/api/auth/verify-token \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:

```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc0e7595f6Ae29",
  "valid": true
}
```

## Using Authentication in Your Routes

### Protected Route Example

```typescript
// src/routes/verification.routes.ts
import { Router } from "express";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

router.get("/my-data", authenticateToken, (req: AuthenticatedRequest, res) => {
  const userAddress = req.userAddress;

  res.json({
    message: "This is protected user data",
    address: userAddress,
  });
});

export default router;
```

### Authenticated Frontend Request

```typescript
// src/components/MyComponent.tsx
import { apiClient } from "@/services/api";
import { useWallet } from "@/hooks/useWallet";

export function MyComponent() {
  const { address } = useWallet();

  const fetchData = async () => {
    try {
      // API client automatically includes JWT token
      const response = await apiClient.get("/verification/my-data");
      console.log(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return <button onClick={fetchData}>Fetch Protected Data</button>;
}
```

## File Structure Created

```
backend/
├── src/
│   ├── services/auth.service.ts          # Core auth logic
│   ├── controllers/auth.controller.ts    # HTTP handlers
│   ├── routes/
│   │   ├── auth.routes.ts               # Auth endpoints
│   │   └── index.ts                     # Route aggregator
│   ├── middleware/auth.ts               # JWT verification
│   ├── app.ts                           # Express app
│   └── server.ts                        # Server entry
└── prisma/
    └── schema.prisma                     # Database models

frontend/
├── src/
│   ├── contexts/WalletContext.ts        # Auth state management
│   ├── hooks/useWallet.ts               # Wallet hook
│   ├── services/api.ts                  # API client with JWT
│   └── components/auth/LoginDemo.tsx    # Example component
└── .env                                  # Environment config
```

## Environment Variables

### Backend (.env)

```env
# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-strong-secret-key-min-32-chars

# Database
DATABASE_URL="postgresql://user:password@host:5432/db"
DIRECT_URL="postgresql://user:password@host:5432/db"

# Optional (for other features)
OPENAI_API_KEY=sk-...
PINATA_API_KEY=...
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
```

### Frontend (.env)

```env
# API
VITE_BACKEND_URL=http://localhost:3001/api

# Blockchain
VITE_POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=80001
```

## Database Setup

### If using Supabase (already configured):

1. Connection strings are in `.env`
2. Run migrations: `npm run db:migrate` (backend)

### If using local PostgreSQL:

```sql
CREATE DATABASE truthlens;
```

Then update `.env` with your connection string.

## Common Issues & Solutions

| Issue                                 | Solution                                                    |
| ------------------------------------- | ----------------------------------------------------------- |
| "Cannot find module '@prisma/client'" | Run `npm run db:generate` in backend                        |
| "MetaMask not detected"               | Install MetaMask extension and refresh browser              |
| "Signature verification failed"       | Ensure you're signing the exact message from `/auth/nonce`  |
| "CORS error"                          | CORS is already enabled in `app.ts`                         |
| "Invalid token"                       | Token expired (7 day expiry) - user must re-login           |
| "Cannot connect to database"          | Check DATABASE_URL in .env and ensure PostgreSQL is running |

## Next Steps

1. **Integrate Auth into Existing Routes**: Add `authenticateToken` middleware to routes that need authentication
2. **Create User Profile Routes**: Store and retrieve user data linked to wallet address
3. **Add Token Refresh**: Implement refresh token mechanism for better UX
4. **Deploy**: Push to production with proper environment variables
5. **Security Hardening**: Add rate limiting, HTTPS, secure cookie settings

## Documentation

For detailed documentation, see:

- `AUTHENTICATION.md` - Full authentication system documentation
- `README.md` - Project overview
- `Tech-Stack.md` - Technology choices

## Support

If you encounter issues:

1. Check the error messages in terminal and browser console
2. Verify environment variables are set correctly
3. Ensure all npm packages are installed
4. Check database connectivity
5. See the troubleshooting section in `AUTHENTICATION.md`

---

**Happy coding! 🚀**
