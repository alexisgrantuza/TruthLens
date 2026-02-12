# MetaMask Authentication System - Architecture Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         TRUTHLENS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────┐        ┌──────────────────────────┐
│  │     FRONTEND (React)     │        │     BACKEND (Node.js)    │
│  ├──────────────────────────┤        ├──────────────────────────┤
│  │                          │        │                          │
│  │  WalletContext           │◄──────►│  AuthService             │
│  │  ├─ address              │  HTTP  │  ├─ generateNonce()      │
│  │  ├─ isConnected          │  API   │  ├─ verifySignature()    │
│  │  ├─ token                │        │  └─ verifyToken()        │
│  │  └─ loginWithMetaMask()  │        │                          │
│  │                          │        │  AuthController          │
│  │  useWallet Hook          │        │  ├─ getNonce()           │
│  │  ├─ address              │        │  ├─ verifySignature()    │
│  │  ├─ loginWithMetaMask()  │        │  └─ verifyToken()        │
│  │  ├─ logout()             │        │                          │
│  │  └─ connectWallet()      │        │  Routes                  │
│  │                          │        │  ├─ GET /auth/nonce      │
│  │  API Client              │        │  ├─ POST /auth/verify    │
│  │  ├─ setToken()           │        │  └─ GET /auth/verify-..  │
│  │  ├─ getToken()           │        │                          │
│  │  ├─ getNonce()           │        │  Middleware              │
│  │  ├─ verifySignature()    │        │  ├─ authenticateToken    │
│  │  └─ verifyToken()        │        │  └─ optionalAuth         │
│  │                          │        │                          │
│  │  LoginDemo Component     │        │  Express App             │
│  │  ├─ Login button         │        │  ├─ CORS enabled         │
│  │  ├─ Logout button        │        │  ├─ JSON parser          │
│  │  └─ Status display       │        │  └─ Error handling       │
│  │                          │        │                          │
│  └──────────────────────────┘        └──────────────────────────┘
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐
│  │             AUTHENTICATION DATABASE (PostgreSQL)              │
│  ├──────────────────────────────────────────────────────────────┤
│  │                                                                │
│  │  User Table:                                                  │
│  │  ├─ id (UUID)                                                │
│  │  ├─ address (Ethereum address - UNIQUE)                      │
│  │  ├─ nonce (Single-use nonce)                                │
│  │  ├─ createdAt                                               │
│  │  └─ updatedAt                                               │
│  │                                                                │
│  └──────────────────────────────────────────────────────────────┘
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐
│  │              METAMASK / ETHEREUM WALLET                       │
│  ├──────────────────────────────────────────────────────────────┤
│  │                                                                │
│  │  Browser Extension that provides:                            │
│  │  ├─ window.ethereum provider                                │
│  │  ├─ eth_requestAccounts                                      │
│  │  ├─ personal_sign / eth_signMessage                          │
│  │  └─ Signature verification                                   │
│  │                                                                │
│  └──────────────────────────────────────────────────────────────┘
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow Diagram

```
START: User clicks "Login with MetaMask"
│
├─► FRONTEND: connectWallet() ──────────────────────┐
│   └─ Checks if MetaMask installed                  │
│   └─ Gets connected accounts                       │
│                                                    │
├─► FRONTEND: getNonce() ──────────────────────────►│ BACKEND: GET /auth/nonce
│   └─ Passes user address                           │ ├─ Generate unique nonce
│                                                    │ ├─ Create/update User record
│   ◄────────── Returns message ◄──────────────────┤ └─ Store nonce in DB
│
├─► FRONTEND: signMessage() ───────────────────┐
│   └─ Opens MetaMask popup                      │
│   └─ User signs: "TruthLens nonce: xyz..."    │
│   └─ Gets signature back                       │
│                                                │
├─► FRONTEND: verifySignature() ─────────────►│ BACKEND: POST /auth/verify
│   └─ Sends {address, signature, message}      │ ├─ Recover signer from signature
│                                                │ │  using ethers.verifyMessage()
│                                                │ ├─ Compare with address ──┐
│   ┌─ VALIDATION CHECKS ◄────────────────────┤ │  │
│   │ ├─ Address matches?                       │ │  ├─ ✓ YES
│   │ ├─ Message format correct?                │ │  │
│   │ ├─ Nonce matches database?                │ │  ├─ Sign JWT token
│   │ └─ Nonce not already used?                │ │  ├─ Clear nonce (single-use)
│   │                                            │ │  └─ Return token
│   └────────────────────────────────────────────┤ │
│                                                │ │
│   ◄───────────── Returns JWT token ◄──────────┤ │
│                                                │ │
├─► FRONTEND: Store JWT ─────────────────────────┤
│   ├─ Save to localStorage                      │
│   ├─ Set in apiClient                          │
│   └─ Update context (isConnected=true)         │
│                                                │
├─► FRONTEND: API Requests ─────────────────────►│ BACKEND: Protected Routes
│   ├─ All requests include:                     │ ├─ authenticateToken middleware
│   │  Authorization: Bearer <token>             │ ├─ Verify JWT signature
│   │                                             │ ├─ Extract user address
│   └─ API Client handles automatically          │ └─ Process request
│                                                │
└──────────────────────────────────────────────►│ DATABASE
                                                 │ └─ All verified, secure
END: User Authenticated & Ready to Use App      └─


═══════════════════════════════════════════════════════════════════

KEY SECURITY POINTS:

1. CRYPTOGRAPHIC VERIFICATION
   Message signed by user's private key (only they have)
   ↓
   Signer recovered using ethers.verifyMessage()
   ↓
   Confirmed signer matches claimed address

2. SINGLE-USE NONCE
   Each login request gets unique nonce
   ↓
   Nonce cleared immediately after verification
   ↓
   Replaying old signature won't work

3. JWT TOKEN EXPIRATION
   Token valid for 7 days
   ↓
   After expiration, user must re-authenticate
   ↓
   Prevents indefinite access with old token

4. ADDRESS NORMALIZATION
   All addresses checksummed and validated
   ↓
   Prevents case-sensitive address spoofing
   ↓
   User address guaranteed valid Ethereum address
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│               AUTHENTICATION DATA FLOW                       │
└─────────────────────────────────────────────────────────────┘

1. INITIAL REQUEST
   ┌──────────────┐
   │   Browser    │
   │              │
   │   User:      │ Input: Wallet Address
   │   0x742d...  │
   └──────┬───────┘
          │
          ▼
   ┌──────────────────────┐
   │  Frontend App        │
   │  WalletContext:      │
   │  - address: 0x742d   │ ◄─ User's MetaMask
   │  - isConnected: true │
   └──────┬───────────────┘
          │
          ▼
   Request: GET /auth/nonce?address=0x742d...


2. NONCE GENERATION
   Request ──────────────────────►
                                   ┌─────────────────────┐
                                   │  Backend            │
                                   │                     │
                                   │  1. Validate addr   │
                                   │  2. Generate nonce  │
                                   │  3. Create User:    │
                                   │     {               │
                                   │       address,      │
                                   │       nonce,        │
                                   │       createdAt     │
                                   │     }               │
                                   │  4. Store in DB     │
                                   └──────┬──────────────┘
                                          │
                                          ▼
   ◄────────────────────── Response: {message: "...xyz"}


3. MESSAGE SIGNING
   ┌──────────────────────────────┐
   │  Frontend                    │
   │                              │
   │  Message:                    │
   │  "TruthLens verification..." │ ────► MetaMask Popup
   │  User signs ─────────────────────────► (private key)
   │                              │ ◄──── Signature: 0x...
   │  Signature: 0x7a8b9c...     │
   │                              │
   └──────────┬───────────────────┘
              │
              ▼
   Request: POST /auth/verify
   Body: {
     address: "0x742d...",
     signature: "0x7a8b...",
     message: "TruthLens verification nonce: xyz"
   }


4. SIGNATURE VERIFICATION & TOKEN ISSUANCE
   Request ──────────────────────►
                                   ┌──────────────────────────┐
                                   │  Backend                 │
                                   │                          │
                                   │  1. ethers.verify:       │
                                   │     Recover signer       │
                                   │     from (message, sig)  │
                                   │                          │
                                   │  2. Validate:            │
                                   │     signer == address?   │
                                   │                          │
                                   │  3. Check DB:            │
                                   │     nonce matches?       │
                                   │     User exists?         │
                                   │                          │
                                   │  4. JWT Generation:      │
                                   │     payload: {           │
                                   │       address,           │
                                   │       iat, exp           │
                                   │     }                    │
                                   │     sign with JWT_SECRET │
                                   │                          │
                                   │  5. Update DB:           │
                                   │     Clear nonce          │
                                   │     (single-use)         │
                                   │                          │
                                   └──────┬───────────────────┘
                                          │
                                          ▼
   ◄────────────────────── Response: {token: "eyJ..."}


5. TOKEN STORAGE & USE
   ┌──────────────────────────────────┐
   │  Frontend                        │
   │                                  │
   │  1. Store token:                 │
   │     localStorage.set('authToken',│
   │       "eyJ...")                  │
   │                                  │
   │  2. API Client config:           │
   │     token = "eyJ..."             │
   │                                  │
   │  3. Update Context:              │
   │     isConnected = true           │
   │     address = "0x742d..."        │
   │                                  │
   │  4. Future Requests:             │
   │     GET /api/protected           │
   │     Header: Authorization:       │
   │       Bearer eyJ...              │
   │                                  │
   └──────┬───────────────────────────┘
          │
          ▼
   ┌────────────────────────┐
   │  Backend               │
   │  authenticateToken     │
   │  middleware:           │
   │                        │
   │  1. Extract token      │
   │  2. Verify JWT         │
   │  3. Extract address    │
   │  4. Attach to request  │
   │  5. Allow route        │
   │                        │
   └────────────────────────┘
          │
          ▼
   ✓ User has access to protected resources
```

## Component Interaction Diagram

```
WalletContext (State Management)
│
├─ Provider Wrapper
│  └─ wraps entire app with auth state
│
├─ State Variables
│  ├─ address: string | null
│  ├─ isConnected: boolean
│  ├─ isLoading: boolean
│  ├─ error: string | null
│  └─ provider: BrowserProvider
│
├─ Methods
│  ├─ connectWallet()
│  │  └─ calls provider.send('eth_requestAccounts')
│  │
│  ├─ loginWithMetaMask()
│  │  ├─ calls apiClient.getNonce(address)
│  │  ├─ calls signer.signMessage(message)
│  │  ├─ calls apiClient.verifySignature()
│  │  └─ calls apiClient.setToken()
│  │
│  └─ logout()
│     ├─ clears address
│     └─ calls apiClient.setToken(null)
│
└─ useWallet Hook
   └─ returns { address, isConnected, loginWithMetaMask, logout, ... }


API Client Service
│
├─ baseUrl: http://localhost:3001/api
│
├─ Token Management
│  ├─ localStorage storage
│  ├─ setToken(token)
│  ├─ getToken()
│  └─ automatic header attachment
│
├─ Methods
│  ├─ get(path): Promise
│  ├─ post(path, body): Promise
│  ├─ getNonce(address): Promise
│  ├─ verifySignature(address, sig, msg): Promise
│  └─ verifyToken(): Promise
│
└─ Interceptor (implicit)
   └─ adds Authorization header to all requests


Backend Authentication Stack
│
├─ Express App
│  ├─ CORS middleware
│  ├─ JSON body parser
│  └─ request logger
│
├─ Routes
│  └─ /auth/
│     ├─ GET /nonce
│     ├─ POST /verify
│     └─ GET /verify-token
│
├─ Controllers
│  └─ AuthController
│     ├─ getNonce(req, res)
│     ├─ verifySignature(req, res)
│     └─ verifyToken(req, res)
│
├─ Services
│  └─ AuthService
│     ├─ generateNonce(address)
│     ├─ verifySignature(address, sig, msg)
│     └─ verifyToken(token)
│
├─ Middleware
│  ├─ authenticateToken (required auth)
│  └─ optionalAuth (optional auth)
│
└─ Database
   └─ Prisma + PostgreSQL
      └─ User table with address & nonce
```

## Security Layers Diagram

```
┌────────────────────────────────────────────┐
│         SECURITY LAYERS                    │
├────────────────────────────────────────────┤
│                                            │
│  LAYER 1: CRYPTOGRAPHIC SIGNATURE         │
│  ├─ Message signed with user's             │
│  │  private key (only they have)            │
│  ├─ Signature verified mathematically      │
│  └─ Signer recovered and validated         │
│                                            │
│  LAYER 2: NONCE PROTECTION                │
│  ├─ Each login gets unique nonce           │
│  ├─ Nonce single-use (cleared after)       │
│  ├─ Nonce expires after 5 minutes          │
│  └─ Replay attacks prevented               │
│                                            │
│  LAYER 3: ADDRESS VALIDATION              │
│ ├─ All addresses checksummed              │
│  ├─ Address format validated               │
│  ├─ Address uniqueness enforced (DB)       │
│  └─ Case-sensitive spoofing impossible     │
│                                            │
│  LAYER 4: JWT TOKEN SECURITY              │
│  ├─ Token signed with JWT_SECRET           │
│  ├─ Signature verified on every request    │
│  ├─ 7-day expiration enforced              │
│  └─ Token stored in localStorage           │
│                                            │
│  LAYER 5: MIDDLEWARE PROTECTION           │
│  ├─ authenticateToken checks headers       │
│  ├─ Extracts and validates JWT             │
│  ├─ Attaches user to request               │
│  └─ Rejects invalid/missing tokens         │
│                                            │
│  LAYER 6: RATE LIMITING (Optional)        │
│  ├─ Limit /auth/nonce requests             │
│  ├─ Prevent brute force attacks            │
│  └─ DDoS protection                        │
│                                            │
└────────────────────────────────────────────┘
```

## Token Lifecycle Diagram

```
Token Creation
    │
    ├─ User signs message ──► ethers.signMessage()
    │
    ├─ Signature sent to backend
    │
    ├─ Backend verifies signature
    │
    └─ Backend generates JWT
         │
         ├─ Payload: { address, iat, exp }
         ├─ Signed with: JWT_SECRET
         └─ Expiration: now + 7 days
              │
              └─► Token returned to frontend


Token Storage
    │
    ├─ Stored in localStorage
    │
    ├─ Persists across page refreshes
    │
    └─ Cleared on logout


Token Usage
    │
    ├─ Each API request:
    │  ├─ Token retrieved from localStorage
    │  ├─ Added to Authorization header
    │  ├─ Sent to backend
    │  └─ Backend verifies signature
    │
    ├─ Protected routes:
    │  ├─ Middleware checks token
    │  ├─ Validates JWT signature
    │  ├─ Checks expiration
    │  └─ Allows request or rejects
    │
    └─ Route handler:
       ├─ Receives verified user address
       ├─ req.userAddress available
       └─ Process user-specific request


Token Expiration
    │
    ├─ After 7 days:
    │  ├─ Token becomes invalid
    │  ├─ JWT.verify() fails
    │  └─ User must re-authenticate
    │
    └─ On expiration:
       ├─ API returns 403 Forbidden
       ├─ Frontend catches error
       ├─ Clears stored token
       └─ Redirects to login
```

---

These diagrams provide a visual understanding of:

- System architecture and components
- Authentication flow from start to finish
- Data movement through the system
- Component interactions
- Security layers
- Token lifecycle

For detailed explanation of each component, see AUTHENTICATION.md
