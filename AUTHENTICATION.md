# MetaMask Authentication System

This document describes the MetaMask + ethers.js authentication system implemented in TruthLens.

## Architecture Overview

### Backend Flow

1. **Frontend requests a nonce**: `GET /api/auth/nonce?address=<wallet_address>`
2. **Backend generates and stores nonce**: Returns a message containing the nonce
3. **Frontend signs the message**: User signs via MetaMask using `signer.signMessage()`
4. **Frontend verifies signature**: `POST /api/auth/verify` with address, signature, and message
5. **Backend verifies and issues JWT**:
   - Recovers signer from signature using `ethers.verifyMessage()`
   - Validates nonce matches stored nonce
   - Clears nonce (single-use)
   - Issues JWT token valid for 7 days
6. **Frontend stores token**: JWT stored in localStorage for subsequent authenticated requests

### Frontend Flow

1. User clicks "Login with MetaMask"
2. `useWallet()` hook calls `loginWithMetaMask()`
3. Wallet context orchestrates the full flow:
   - Connects wallet if needed
   - Requests nonce from backend
   - Signs nonce with MetaMask
   - Sends signature to backend
   - Stores JWT token
   - Updates context state

## File Structure

### Backend

```
backend/src/
├── services/
│   └── auth.service.ts          # Core authentication logic
├── controllers/
│   └── auth.controller.ts        # HTTP request handlers
├── routes/
│   ├── auth.routes.ts            # Auth endpoints
│   └── index.ts                  # Route aggregator
├── middleware/
│   └── auth.ts                   # JWT verification middleware
├── app.ts                        # Express app setup
└── server.ts                     # Server entry point
```

### Frontend

```
frontend/src/
├── contexts/
│   └── WalletContext.ts          # Wallet state and auth logic
├── hooks/
│   └── useWallet.ts              # Hook to access wallet context
├── services/
│   └── api.ts                    # HTTP client with JWT handling
└── .env                          # Environment config
```

### Database

```
backend/prisma/
└── schema.prisma                 # Prisma models including User
```

## API Endpoints

### `GET /api/auth/nonce`

Request a nonce for wallet authentication.

**Query Parameters:**

- `address` (string, required): Wallet address to authenticate

**Response:**

```json
{
  "message": "TruthLens verification nonce: abc123xyz"
}
```

**Error:**

```json
{
  "error": "Address is required"
}
```

---

### `POST /api/auth/verify`

Verify signed message and receive JWT token.

**Request Body:**

```json
{
  "address": "0x...",
  "signature": "0x...",
  "message": "TruthLens verification nonce: abc123xyz"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error:**

```json
{
  "error": "Signature verification failed: address mismatch"
}
```

---

### `GET /api/auth/verify-token`

Verify a JWT token (for testing).

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "address": "0x...",
  "valid": true
}
```

**Error:**

```json
{
  "error": "Invalid or expired token"
}
```

---

## Usage Examples

### Frontend Usage

#### Setup App with WalletProvider

```tsx
import React from "react";
import { WalletProvider } from "./contexts/WalletContext";
import App from "./App";

export default function Root() {
  return (
    <WalletProvider>
      <App />
    </WalletProvider>
  );
}
```

#### Use in Component

```tsx
import React from "react";
import { useWallet } from "./hooks/useWallet";

export function LoginButton() {
  const { address, isLoading, error, loginWithMetaMask, logout } = useWallet();

  if (address) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={loginWithMetaMask} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login with MetaMask"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

#### Make Authenticated Request

```tsx
import { apiClient } from "./services/api";

async function fetchUserData() {
  try {
    // API client automatically attaches JWT token
    const response = await apiClient.get("/verification/my-data");
    console.log(response);
  } catch (error) {
    console.error("Request failed:", error);
  }
}
```

---

### Backend Usage

#### Protect a Route

```ts
import { Router } from "express";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

router.get(
  "/user-profile",
  authenticateToken,
  (req: AuthenticatedRequest, res) => {
    const userAddress = req.userAddress;
    res.json({ address: userAddress, message: "User data" });
  }
);

export default router;
```

#### Optional Authentication

```ts
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";

router.get("/public-data", optionalAuth, (req: AuthenticatedRequest, res) => {
  if (req.userAddress) {
    res.json({ message: "User-specific data", address: req.userAddress });
  } else {
    res.json({ message: "Public data" });
  }
});
```

---

## Security Considerations

1. **JWT Secret**: Change `JWT_SECRET` environment variable in production to a strong, random string (min 32 characters).

2. **Nonce Single-Use**: Each nonce is cleared after verification. Attempting to reuse will fail.

3. **Token Expiration**: JWT tokens expire after 7 days. Users must re-authenticate.

4. **HTTPS Only**: In production, ensure all communication is over HTTPS and set secure cookie flags if using cookies instead of localStorage.

5. **Address Validation**: All addresses are normalized and validated using `ethers.getAddress()`.

6. **Signature Verification**: Using `ethers.verifyMessage()` ensures cryptographic integrity.

7. **Rate Limiting**: Consider implementing rate limiting on `/auth/nonce` to prevent abuse.

8. **CORS**: Configure CORS appropriately for your deployment environment.

---

## Environment Variables

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=<your-strong-random-string-min-32-chars>
DATABASE_URL=<your-postgres-connection-string>
DIRECT_URL=<your-direct-postgres-connection-string>
```

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:3001/api
VITE_POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=80001
```

---

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  address   String   @unique
  nonce     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- `address`: Unique Ethereum address (normalized)
- `nonce`: Current nonce for authentication (cleared after use)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

---

## Running the Application

### Backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

Server will run on `http://localhost:3001`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Server will run on `http://localhost:5173`

---

## Testing Authentication

### Manual Testing with cURL

1. **Get Nonce**

```bash
curl "http://localhost:3001/api/auth/nonce?address=0x742d35Cc6634C0532925a3b844Bc0e7595f6Ae29"
```

2. **Sign Message** (in MetaMask or your app)

```
Message: "TruthLens verification nonce: <nonce>"
```

3. **Verify Signature**

```bash
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc0e7595f6Ae29",
    "signature": "0x...",
    "message": "TruthLens verification nonce: <nonce>"
  }'
```

4. **Verify Token**

```bash
curl http://localhost:3001/api/auth/verify-token \
  -H "Authorization: Bearer <token>"
```

---

## Troubleshooting

| Issue                         | Solution                                                          |
| ----------------------------- | ----------------------------------------------------------------- |
| MetaMask not detected         | Ensure MetaMask extension is installed and enabled                |
| "Address is required" error   | Pass address as query parameter: `?address=0x...`                 |
| Signature verification failed | Ensure you're using the exact message returned from `/auth/nonce` |
| "Invalid or expired token"    | Token has expired. User must re-login                             |
| CORS errors                   | Check CORS configuration in `app.ts`                              |
| Database connection error     | Verify `DATABASE_URL` in `.env` and Postgres is running           |

---

## Next Steps

1. Integrate authentication into existing routes (use `authenticateToken` middleware)
2. Store user-specific data in database linked to user address
3. Implement token refresh mechanism for better UX
4. Add rate limiting and security headers
5. Deploy to production with proper environment variables
6. Consider adding multi-chain support
7. Implement "Sign in with Ethereum" (SIWE) for standardization

---

## References

- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [JSON Web Tokens](https://jwt.io/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js](https://expressjs.com/)
- [React Context API](https://react.dev/reference/react/useContext)
