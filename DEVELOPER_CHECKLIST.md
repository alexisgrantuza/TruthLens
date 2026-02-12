# Developer Checklist: Implementing MetaMask Authentication

Use this checklist when adding authentication to new routes or components.

## 🚀 Backend Route Protection

### Protecting a New Route

- [ ] Import middleware and types:

```typescript
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
```

- [ ] Add middleware to route:

```typescript
router.get(
  "/protected",
  authenticateToken,
  (req: AuthenticatedRequest, res) => {
    // req.userAddress is now available
  }
);
```

- [ ] Use user address in handler:

```typescript
const userAddress = req.userAddress;
// Query database using address
// Return user-specific data
```

- [ ] Test with curl:

```bash
curl http://localhost:3001/api/route \
  -H "Authorization: Bearer <token>"
```

### Optional Authentication

- [ ] Use `optionalAuth` for routes that work with OR without auth:

```typescript
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";

router.get("/data", optionalAuth, (req: AuthenticatedRequest, res) => {
  if (req.userAddress) {
    // User is authenticated
  } else {
    // User is not authenticated
  }
});
```

### Error Handling

- [ ] Handle invalid tokens gracefully:

```typescript
router.use((err: Error, req: Request, res: Response) => {
  if (err.message.includes("token")) {
    res.status(401).json({ error: "Invalid authentication" });
  }
});
```

- [ ] Test with expired/invalid tokens

## 🎨 Frontend Component Usage

### Basic Login Component

- [ ] Import hook:

```typescript
import { useWallet } from "@/hooks/useWallet";
```

- [ ] Get wallet state:

```typescript
const { address, isConnected, loginWithMetaMask, logout, isLoading, error } =
  useWallet();
```

- [ ] Show login button:

```tsx
{
  !address && (
    <button onClick={loginWithMetaMask} disabled={isLoading}>
      {isLoading ? "Logging in..." : "Login with MetaMask"}
    </button>
  );
}
```

- [ ] Show logout button:

```tsx
{
  address && (
    <>
      <p>Welcome, {address}</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}
```

- [ ] Handle errors:

```tsx
{
  error && <p style={{ color: "red" }}>Error: {error}</p>;
}
```

### Protected Component

- [ ] Check authentication:

```typescript
function ProtectedComponent() {
  const { address, isConnected } = useWallet();

  if (!isConnected) {
    return <p>Please connect your wallet</p>;
  }

  return <div>Welcome, {address}!</div>;
}
```

- [ ] Redirect if not authenticated:

```typescript
useEffect(() => {
  if (!isConnected) {
    navigate("/login");
  }
}, [isConnected, navigate]);
```

### Making Authenticated Requests

- [ ] Import API client:

```typescript
import { apiClient } from "@/services/api";
```

- [ ] Make request (token auto-attached):

```typescript
async function fetchUserData() {
  try {
    const data = await apiClient.get("/user/data");
    // Token automatically included in header
    console.log(data);
  } catch (error) {
    console.error("Failed:", error);
    // Handle 401 - redirect to login
  }
}
```

- [ ] Use in component:

```tsx
useEffect(() => {
  fetchUserData();
}, []);
```

## 🧪 Testing Checklist

### Frontend Testing

- [ ] [ ] MetaMask connects successfully
- [ ] [ ] Nonce request succeeds
- [ ] [ ] Message signs without errors
- [ ] [ ] Token stored in localStorage
- [ ] [ ] Token persists on page refresh
- [ ] [ ] Authenticated request includes token header
- [ ] [ ] Protected route accessible when authenticated
- [ ] [ ] Protected route inaccessible when not authenticated
- [ ] [ ] Logout clears token
- [ ] [ ] Can re-login after logout
- [ ] [ ] Error messages display correctly
- [ ] [ ] Loading states work properly

### Backend Testing

- [ ] [ ] `/auth/nonce` returns valid message
- [ ] [ ] `/auth/verify` validates signature correctly
- [ ] [ ] `/auth/verify` rejects invalid signature
- [ ] [ ] `/auth/verify` rejects invalid nonce
- [ ] [ ] Token verification endpoint works
- [ ] [ ] Protected routes reject requests without token
- [ ] [ ] Protected routes reject requests with invalid token
- [ ] [ ] Protected routes return correct user address
- [ ] [ ] Nonce is cleared after use (single-use)
- [ ] [ ] User record created in database
- [ ] [ ] Database state persists

### Integration Testing

- [ ] [ ] Full login flow works end-to-end
- [ ] [ ] Token works for multiple requests
- [ ] [ ] Token expires after 7 days
- [ ] [ ] Multiple users don't interfere with each other
- [ ] [ ] Address verification case-insensitive works
- [ ] [ ] CORS allows frontend->backend requests
- [ ] [ ] Error responses are meaningful

## 📋 Database Setup Checklist

- [ ] [ ] Prisma schema includes User model
- [ ] [ ] User model has required fields:

  - [ ] id
  - [ ] address (unique)
  - [ ] nonce (nullable)
  - [ ] createdAt
  - [ ] updatedAt

- [ ] [ ] Prisma client generated:

```bash
npm run db:generate
```

- [ ] [ ] Database migrations run:

```bash
npm run db:migrate
```

- [ ] [ ] Database connection tested:

```bash
npm run db:studio  # Prisma Studio opens
```

- [ ] [ ] User data persists in database

## 🔐 Security Checklist

- [ ] [ ] JWT_SECRET is strong (min 32 chars)
- [ ] [ ] JWT_SECRET not hardcoded in source
- [ ] [ ] JWT_SECRET in .env (not in git)
- [ ] [ ] HTTPS enabled in production
- [ ] [ ] CORS only allows trusted origins
- [ ] [ ] Rate limiting on /auth/nonce
- [ ] [ ] No sensitive data in JWT payload
- [ ] [ ] Token expiration properly enforced
- [ ] [ ] Nonce single-use enforcement works
- [ ] [ ] Address validation/normalization works
- [ ] [ ] Error messages don't leak sensitive info
- [ ] [ ] Protected routes actually protected
- [ ] [ ] Invalid tokens rejected
- [ ] [ ] Expired tokens rejected

## 📝 Code Quality Checklist

- [ ] [ ] No TypeScript errors:

```bash
npm run type-check
```

- [ ] [ ] Code formatted properly
- [ ] [ ] No console.log in production code
- [ ] [ ] Error handling comprehensive
- [ ] [ ] Comments explaining complex logic
- [ ] [ ] All imports present
- [ ] [ ] No unused variables
- [ ] [ ] Function signatures clear
- [ ] [ ] Type safety maintained

## 🚀 Deployment Checklist

- [ ] [ ] Environment variables configured:

  - [ ] JWT_SECRET set
  - [ ] DATABASE_URL valid
  - [ ] NODE_ENV=production

- [ ] [ ] Frontend environment configured:

  - [ ] VITE_BACKEND_URL points to production backend
  - [ ] No localhost in env vars

- [ ] [ ] Database backups in place
- [ ] [ ] Error logging enabled
- [ ] [ ] Health check endpoint working
- [ ] [ ] API responds to requests
- [ ] [ ] Frontend loads correctly
- [ ] [ ] MetaMask connects successfully
- [ ] [ ] Login flow works
- [ ] [ ] Protected routes accessible
- [ ] [ ] Performance acceptable
- [ ] [ ] No memory leaks
- [ ] [ ] HTTPS everywhere
- [ ] [ ] Security headers set

## 📊 Monitoring Checklist

- [ ] [ ] Logs show successful logins
- [ ] [ ] Logs show failed verification attempts
- [ ] [ ] Error rates monitored
- [ ] [ ] Response times monitored
- [ ] [ ] Database connections healthy
- [ ] [ ] No suspicious activity
- [ ] [ ] Token usage monitored
- [ ] [ ] User growth tracked

## 🐛 Debugging Checklist

If something isn't working:

1. **Check Backend Console**

   - [ ] Look for error messages
   - [ ] Check if request arrived
   - [ ] Verify JWT_SECRET is set

2. **Check Frontend Console**

   - [ ] Check for JavaScript errors
   - [ ] Check Network tab for requests
   - [ ] Verify token in localStorage
   - [ ] Check request headers

3. **Check Database**

   - [ ] Verify connection works
   - [ ] Check User table exists
   - [ ] Verify data is persisting
   - [ ] Look for address collisions

4. **Check MetaMask**

   - [ ] Extension installed?
   - [ ] Extension enabled?
   - [ ] Wallet connected?
   - [ ] Correct network?

5. **Check Network**
   - [ ] Frontend can reach backend?
   - [ ] CORS errors?
   - [ ] Firewall blocks requests?
   - [ ] Localhost vs 127.0.0.1?

## 📚 Documentation Checklist

- [ ] [ ] README.md updated with auth info
- [ ] [ ] API documentation includes auth endpoints
- [ ] [ ] Code comments explain auth flow
- [ ] [ ] User guide includes login instructions
- [ ] [ ] Troubleshooting guide includes auth issues
- [ ] [ ] Environment variables documented
- [ ] [ ] Security considerations documented
- [ ] [ ] Deployment instructions updated

## ✅ Final Validation

- [ ] [ ] All checklist items completed
- [ ] [ ] All tests passing
- [ ] [ ] No TypeScript errors
- [ ] [ ] No console errors
- [ ] [ ] No console warnings
- [ ] [ ] Code reviewed
- [ ] [ ] Documentation complete
- [ ] [ ] Ready for production

---

## Quick Reference Commands

```bash
# Backend
cd backend
npm install                    # Install deps
npm run db:generate           # Generate Prisma
npm run db:migrate           # Run migrations
npm run type-check           # Type check
npm run dev                  # Start dev server

# Frontend
cd frontend
npm install                  # Install deps
npm run dev                  # Start dev server
npm run build               # Build for prod

# Testing
curl "http://localhost:3001/api/auth/nonce?address=0x..." | jq
```

## Useful Resources

- AUTHENTICATION.md - Complete technical docs
- QUICK_START.md - Getting started guide
- TROUBLESHOOTING.md - Common issues
- ARCHITECTURE.md - System diagrams

---

**Status**: Use this checklist for every new authenticated feature
**Last Updated**: December 2, 2025
