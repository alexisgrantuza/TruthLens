# MetaMask Authentication Troubleshooting Guide

## Common Issues & Solutions

### 🔴 MetaMask Not Detected

**Error**: "MetaMask not detected" or MetaMask button doesn't appear

**Causes**:

- MetaMask extension not installed
- Extension is disabled
- Browser doesn't support extensions (try Chrome, Firefox, Edge)
- Using private/incognito mode (some restrictions)

**Solutions**:

1. Install MetaMask: https://metamask.io/
2. Enable extension in browser settings
3. Try a different browser
4. Disable private mode or grant extension access to it
5. Refresh the page after installing MetaMask

---

### 🔴 Wallet Connection Fails

**Error**: "Failed to connect wallet" or connection popup doesn't appear

**Causes**:

- MetaMask not active/focused
- Declined connection request
- Multiple wallet extensions conflicting
- Browser cache issue

**Solutions**:

```bash
# Clear browser cache and local storage
# In browser console:
localStorage.clear()
sessionStorage.clear()
# Then refresh page
```

1. Make sure MetaMask window is open
2. Check MetaMask notifications (top right)
3. Disable other wallet extensions
4. Try incognito mode to test
5. Reinstall MetaMask if needed

---

### 🔴 "Signature verification failed: address mismatch"

**Error**: After signing, login fails with address mismatch error

**Causes**:

- Signed with different wallet than requested
- Address format mismatch (case sensitivity)
- Multiple accounts in MetaMask

**Solutions**:

1. Verify you're signing with the correct MetaMask account
2. Check that the address in MetaMask matches the login attempt
3. Switch to the correct account in MetaMask if needed
4. Make sure you're on the correct network (any testnet works)

```javascript
// Debug in browser console
const addr = localStorage.getItem("metamaskAddress");
console.log("Wallet address:", addr);
```

---

### 🔴 "Invalid message format" or "Nonce verification failed"

**Error**: Backend rejects the signed message

**Causes**:

- Message format changed
- Nonce expired (older than 5 minutes)
- Nonce already used (single-use enforcement)
- Wrong message was signed

**Solutions**:

1. Start fresh: Reload page
2. Request a new nonce (get fresh message)
3. Sign the EXACT message returned from backend
4. Don't modify the message text
5. Complete login within 5 minutes of requesting nonce

```bash
# Test nonce generation
curl "http://localhost:3001/api/auth/nonce?address=YOUR_ADDRESS"
# Copy the exact message and sign it
```

---

### 🔴 "Invalid or expired token"

**Error**: Already logged in but token error appears

**Causes**:

- JWT token expired (7 day expiration)
- Token corrupted
- localStorage cleared
- Logged in from different device/browser

**Solutions**:

1. Clear localStorage and re-login:

```javascript
localStorage.clear();
// Then refresh page and login again
```

2. Token is valid for 7 days, after that re-login required
3. Check browser console for errors:

```javascript
console.log(localStorage.getItem("authToken"));
```

---

### 🔴 CORS Errors in Browser Console

**Error**: "Access to XMLHttpRequest... CORS policy"

**Causes**:

- Backend not running
- Wrong backend URL in frontend .env
- CORS not properly configured

**Solutions**:

1. Verify backend is running:

```bash
# Check if running
curl http://localhost:3001/health
```

2. Check frontend .env:

```env
VITE_BACKEND_URL=http://localhost:3001/api
```

3. Restart frontend after changing .env:

```bash
cd frontend
npm run dev
```

---

### 🔴 "Cannot connect to database" (Backend)

**Error**: Backend crashes with database connection error

**Causes**:

- PostgreSQL not running
- Wrong DATABASE_URL
- Database doesn't exist
- Network issues

**Solutions**:

1. Check PostgreSQL is running:

```bash
# Windows
Get-Process postgres

# Mac/Linux
ps aux | grep postgres
```

2. Verify DATABASE_URL in .env:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/truthlens"
```

3. Test connection manually:

```bash
# Install psql or use pgAdmin
psql -U postgres -d truthlens -c "SELECT 1"
```

4. Create database if needed:

```bash
cd backend
npm run db:migrate
```

---

### 🔴 Frontend Shows "No token provided" After Login

**Error**: Login appears successful but subsequent requests fail

**Causes**:

- Token not stored in localStorage
- API client not reading token
- Token lost on page refresh

**Solutions**:

1. Check token in browser storage:

```javascript
// In browser console
console.log(localStorage.getItem("authToken"));
```

2. Check if API client is attached:

```typescript
// In src/services/api.ts verify token retrieval
const token = localStorage.getItem("authToken");
console.log("Token:", token);
```

3. Verify browser allows localStorage:

- Not in private mode
- Not blocked by browser settings
- Not cleared by extensions

---

### 🔴 "No token provided" for Protected Routes

**Error**: Authenticated request fails with "No token provided"

**Causes**:

- Token not being sent in request
- Authorization header malformed
- API client not configured

**Solutions**:

1. Verify token is in request headers:

```bash
# Check network tab in browser DevTools
# Look for Authorization: Bearer... header
```

2. Ensure API client is using correct token:

```typescript
// In api.ts, verify this code runs:
if (this.token) {
  headers["Authorization"] = `Bearer ${this.token}`;
}
```

3. Check middleware is reading header correctly:

```bash
# Backend console should show token being processed
```

---

### 🔴 Signature Mismatch on Different Browser/Device

**Error**: Signature doesn't verify when used from different browser/device

**Causes**:

- This is NOT a problem - it's expected behavior
- Each browser gets its own nonce
- Signatures are device-specific

**Solution**:

- This is normal security behavior
- User must sign from each device/browser they use
- Can't reuse signature across devices

---

### 🔴 Backend Crashes on Startup

**Error**: Backend server crashes immediately or won't start

**Solutions**:

1. Check for compilation errors:

```bash
cd backend
npm run type-check
```

2. Check for missing dependencies:

```bash
npm install
npm run db:generate
```

3. Check environment variables:

```bash
# Verify .env file exists and has required vars
echo %JWT_SECRET%  # Windows
echo $JWT_SECRET   # Mac/Linux
```

4. Check Node.js version:

```bash
node --version
# Should be v16 or higher
```

---

### 🔴 Frontend Build Fails

**Error**: `npm run build` fails in frontend

**Solutions**:

1. Check Node version:

```bash
node --version
npm --version
```

2. Clear node_modules and reinstall:

```bash
cd frontend
rm -r node_modules package-lock.json
npm install
```

3. Check TypeScript errors:

```bash
npm run lint
```

4. Verify environment file:

```bash
cat .env
# Should have VITE_BACKEND_URL set
```

---

## Network Switching Issue

**Issue**: Switching between networks in MetaMask

**Context**: This app works with any Ethereum-compatible network, but users should be aware:

```javascript
// Check current network
const networkId = await provider.getNetwork();
console.log("Network:", networkId.chainId);

// Prompt user to switch (optional)
await provider.send("wallet_switchEthereumChain", [
  {
    chainId: "0x13881", // Mumbai testnet
  },
]);
```

---

## Debug Checklist

Use this when troubleshooting:

```javascript
// In browser console (frontend):
console.log("1. Token:", localStorage.getItem("authToken"));
console.log("2. Address:", localStorage.getItem("address"));
console.log("3. MetaMask:", window.ethereum ? "Installed" : "Not installed");

// Test API connection:
fetch("http://localhost:3001/health")
  .then((r) => r.json())
  .then((d) => console.log("Backend OK:", d));

// Test nonce:
fetch("http://localhost:3001/api/auth/nonce?address=0x...")
  .then((r) => r.json())
  .then((d) => console.log("Nonce:", d));
```

---

## Getting Help

1. **Check console logs** - Browser console and backend terminal
2. **Enable verbose logging** - Add `console.log()` in code
3. **Check network tab** - See actual requests/responses
4. **Verify all files created** - Run `node verify-setup.js`
5. **Review AUTHENTICATION.md** - Full documentation
6. **Test with cURL** - Isolate frontend vs backend issues

---

## Performance Issues

### Slow Login

- Check network latency
- Verify database performance
- Check for rate limiting

### Slow Signature Verification

- Normal - takes a few seconds
- Don't click multiple times
- Check browser performance

---

## Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Set strong JWT_SECRET (min 32 chars)
3. ✅ Implement rate limiting
4. ✅ Validate all inputs
5. ✅ Use secure cookie settings in production
6. ✅ Regularly rotate JWT_SECRET
7. ✅ Monitor for suspicious activity

---

**Last Updated**: December 2, 2025
**Version**: 1.0
