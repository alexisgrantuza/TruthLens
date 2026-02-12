# TruthLens - Complete Folder Structure

Based on your technology choices (React + Vite + TypeScript, Node.js + TypeScript, Hardhat + Polygon Mumbai), here's the complete project structure:

## Root Project Structure

```
truthlens/
├── frontend/                 # React + Vite + TypeScript
├── backend/                  # Node.js + TypeScript API
├── blockchain/               # Hardhat + Polygon Mumbai
├── .gitignore
├── README.md
└── package.json             # Root workspace package.json (optional)
```

---

## Frontend Structure (React + Vite + TypeScript)

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Modal.tsx
│   │   ├── camera/
│   │   │   ├── CameraView.tsx
│   │   │   ├── CameraControls.tsx
│   │   │   └── PhotoPreview.tsx
│   │   ├── wallet/
│   │   │   ├── WalletConnect.tsx
│   │   │   └── WalletButton.tsx
│   │   ├── verification/
│   │   │   ├── ProcessingScreen.tsx
│   │   │   ├── SuccessScreen.tsx
│   │   │   └── VerificationBadge.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Layout.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Capture.tsx
│   │   ├── Verify.tsx
│   │   ├── Gallery.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useCamera.ts
│   │   ├── useWallet.ts
│   │   ├── useBlockchain.ts
│   │   └── useIPFS.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── blockchain.ts
│   │   ├── ipfs.ts
│   │   └── crypto.ts
│   ├── utils/
│   │   ├── hash.ts
│   │   ├── geolocation.ts
│   │   ├── imageProcessing.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── blockchain.ts
│   │   ├── verification.ts
│   │   └── api.ts
│   ├── contexts/
│   │   ├── WalletContext.tsx
│   │   └── ThemeContext.tsx
│   ├── styles/
│   │   ├── index.css
│   │   └── tailwind.css
│   ├── config/
│   │   ├── blockchain.ts
│   │   └── app.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .env.local
├── .eslintrc.json
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Backend Structure (Node.js + TypeScript)

```
backend/
├── src/
│   ├── controllers/
│   │   ├── verification.controller.ts
│   │   ├── ai.controller.ts
│   │   └── ipfs.controller.ts
│   ├── services/
│   │   ├── openai.service.ts
│   │   ├── pinata.service.ts
│   │   ├── blockchain.service.ts
│   │   └── hashing.service.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── verification.routes.ts
│   │   ├── ai.routes.ts
│   │   └── ipfs.routes.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   ├── cors.ts
│   │   └── rateLimit.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── crypto.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── verification.types.ts
│   │   └── api.types.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── blockchain.ts
│   │   └── env.ts
│   ├── models/
│   │   └── Verification.model.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   └── integration/
│       └── api/
├── .env.example
├── .env
├── .eslintrc.json
├── .gitignore
├── package.json
├── tsconfig.json
└── nodemon.json
```

---

## Blockchain Structure (Hardhat + Polygon Mumbai)

```
blockchain/
├── contracts/
│   ├── TruthLens.sol
│   ├── VerificationRegistry.sol
│   └── interfaces/
│       └── IVerification.sol
├── scripts/
│   ├── deploy.ts
│   ├── verify.ts
│   └── utils/
│       └── helpers.ts
├── test/
│   ├── TruthLens.test.ts
│   └── VerificationRegistry.test.ts
├── tasks/
│   └── faucet.ts
├── deployments/
│   ├── mumbai/
│   │   ├── TruthLens.json
│   │   └── VerificationRegistry.json
│   └── localhost/
├── typechain-types/
│   └── (generated files)
├── .env.example
├── .env
├── .gitignore
├── hardhat.config.ts
├── package.json
└── tsconfig.json
```

---

## Key Files Explanation

### Frontend Key Files:

- **vite.config.ts**: Vite configuration with React plugin and path aliases
- **tailwind.config.js**: Tailwind CSS configuration
- **src/services/blockchain.ts**: ethers.js integration for Polygon Mumbai
- **src/services/ipfs.ts**: Pinata/IPFS upload logic
- **src/utils/hash.ts**: SHA-256 hashing using Web Crypto API or crypto-js

### Backend Key Files:

- **src/app.ts**: Express app setup with middleware
- **src/server.ts**: Server entry point
- **src/services/openai.service.ts**: GPT-4 Vision API integration
- **src/services/pinata.service.ts**: Free Pinata IPFS uploads (100MB free tier)

### Blockchain Key Files:

- **hardhat.config.ts**: Hardhat configuration for Polygon Mumbai testnet
- **contracts/TruthLens.sol**: Main smart contract for storing verification hashes
- **scripts/deploy.ts**: Deployment script for Mumbai testnet

---

## Modified Technology Stack (Free Resources)

| Component        | Technology                | Free Resource                                |
| ---------------- | ------------------------- | -------------------------------------------- |
| **Frontend**     | React + Vite + TypeScript | Vercel (free hosting)                        |
| **Backend**      | Node.js + TypeScript      | Render.com (free tier) or Railway.app        |
| **Blockchain**   | Hardhat + Polygon Mumbai  | Mumbai Testnet (free test MATIC from faucet) |
| **IPFS Storage** | Pinata                    | Free tier: 1GB storage, 100MB upload         |
| **AI Analysis**  | OpenAI GPT-4o             | Free tier: $5 credit (or use gpt-3.5-turbo)  |
| **Wallet**       | MetaMask                  | Free browser extension                       |
| **Database**     | Postgres (supabase)       |

---

## Environment Variables

### Frontend (.env.local)

```env
VITE_BACKEND_URL=http://localhost:3001
VITE_POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=80001
```

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=sk-...
PINATA_API_KEY=...
PINATA_SECRET_API_KEY=...
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
DATABSAE_URL=
```

### Blockchain (.env)

```env
PRIVATE_KEY=0x...
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=...
```

---

## Getting Free Resources

1. **Polygon Mumbai Testnet MATIC**: https://faucet.polygon.technology/
2. **Pinata IPFS**: https://www.pinata.cloud/ (Sign up for free)
3. **OpenAI API**: https://platform.openai.com/ ($5 free credit)
4. **Vercel Hosting**: https://vercel.com/ (Free for frontend)
5. **Render.com**: https://render.com/ (Free for backend - 750 hrs/month)
6. **Supabase (postgres)**:

This structure uses entirely free resources and is optimized for a 24-hour hackathon MVP! Would you like me to generate any specific configuration files or starter code?
