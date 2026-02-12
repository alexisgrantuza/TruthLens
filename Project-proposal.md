Here is the full project overview for **"TruthLens on Chain"**—specifically designed to win a 24-hour hackathon by combining a societal mission with a "cool" technical twist (AI + Blockchain).

### 🚀 **Project Title:** TruthLens on Chain

**Tagline:** _The Immutable Eye – Verifying Reality in the Age of AI._

---

### 1\. The Problem (Why this matters)

We live in a "post-truth" era.

- **Deepfakes are everywhere:** It is now trivial to generate fake war footage, fake celebrity scandals, or fake evidence for insurance claims.
- **Metadata is fragile:** EXIF data (date/location on photos) is easily edited or stripped when you upload to social media.
- **Erosion of Trust:** Journalists, insurance adjusters, and human rights activists have no easy way to prove that a photo _has not_ been doctored since the moment it was taken.

### 2\. The Solution (The "Magic")

**TruthLens** is a mobile dApp (Decentralized App) that acts as a digital notary.

1.  **Capture:** Users take a photo _inside_ the app.
2.  **Fingerprint:** The app immediately generates a cryptographic hash of the image file.
3.  **Notarize:** It writes that hash + the GPS coordinates + Timestamp to a public blockchain (making it immutable).
4.  **Verify:** An AI agent analyzes the image for manipulation artifacts and generates a "Context Caption" (e.g., "Car crash on 5th Avenue") which is also stored.
5.  **Result:** A permanent, unchangeable record that _this_ exact image existed at _this_ exact time and place.

---

### 3\. The 24-Hour Hackathon MVP Scope

_Do not try to build the next Instagram. Focus on the "Verification" workflow._

#### **User Flow (The Demo)**

1.  **Login:** Simple wallet connect (e.g., Phantom or MetaMask) or just a "Continue as Guest" (creating a burner wallet in the background).
2.  **Camera View:** A simple camera interface. User snaps a photo of a "crime scene" (or your laptop).
3.  **Processing (The "Wow" Moment):**
    - Show a loading bar: _"Hashing Image..."_ -\> _"Analyzing with AI..."_ -\> _"Minting Proof to Blockchain..."_
4.  **Success Screen:**
    - Show the Photo.
    - Show a Green "VERIFIED" Checkmark.
    - Show the **Blockchain Transaction Hash** (clickable link to a block explorer like Solscan).
    - Show the **AI Analysis:** "Probability of Deepfake: 0.1% | Content: Black laptop on wooden desk."

---

### 4\. Technical Architecture (The Stack)

| Component                 | Choice                               | Why?                                                                                                                                       |
| :------------------------ | :----------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**              | **React + Vite**                     | Fast setup, easy PWA (Progressive Web App) for mobile camera access.                                                                       |
| **Blockchain**            | **Hardhat + Polygon Mumbai Testnet** | Extremely fast (sub-second finality), very cheap, and great tooling (Solana Web3.js). _Alternative: Polygon._                              |
| **Storage**               | **IPFS (via Pinata)**                | You can't store images on-chain (too expensive). Store the _image_ on IPFS, store the _hash/link_ on-chain.                                |
| **AI Agent**              | **OpenAI GPT-4o (Vision)**           | Ask it to describe the scene & check for obvious logical inconsistencies (e.g., "Does the lighting on the subject match the background?"). |
| **Deepfake/AI Detection** | **Hive AI / Sensity**                | _Optional:_ If you have time, hit a specialized API to get a "Fake Score."                                                                 |

---

### 5\. Step-by-Step Implementation Guide

#### **Phase 1: Setup (Hours 0-4)**

- **Repo:** Set up a Next.js project with Tailwind CSS.
- **Wallet:** Install `@solana/wallet-adapter-react`.
- **Camera:** Use the HTML5 `react-webcam` library. It's the easiest way to access the camera in a browser.

#### **Phase 2: The Core Logic (Hours 4-12)**

- **Hashing:** When a photo is taken, convert the blob to a SHA-256 hash using the `crypto-js` library. This is your "Digital Fingerprint."
- **IPFS Upload:** Use the **Pinata SDK** to upload the image file. Get back the `IpfsHash`.
- **The Smart Contract (The Easy Way):**
  - _Don't write a complex Rust/Solidity contract._
  - **Hack:** Use the "Memo Program" on Solana. It allows you to send a transaction with a string of text attached.
  - **The Transaction:** Send 0 SOL to yourself, but attach the string: `{"ipfs": "Qm...", "hash": "sha256...", "lat": 40.7, "long": -74.0}`.
  - _Result:_ You now have an on-chain record without writing a custom smart contract\!

#### **Phase 3: The AI Agent (Hours 12-18)**

- **Backend Route:** Create an API route `/api/analyze`.
- **Vision Check:** Send the image URL (from IPFS) to OpenAI API (GPT-4o).
- **Prompt:** _"Analyze this image. 1. Describe the scene briefly. 2. Look for visual anomalies that suggest manipulation (blurring, lighting mismatches). Return JSON."_
- **Display:** Show this AI "Opinion" next to the Blockchain "Fact."

#### **Phase 4: Polish & Pitch (Hours 18-24)**

- **The "Verify" Page:** Create a page where anyone can upload _that same photo_ later. The app hashes it again. If the new hash matches the on-chain hash, it turns **GREEN**. If one pixel changed, the hashes won't match, and it turns **RED**.
- **Pitch Deck:** Focus on the story. "Imagine a journalist in a war zone..."

---

### 6\. The "Secret Sauce" for Judges

- **The C2PA Standard:** Mention in your pitch that you are building a "Lightweight Web3 implementation of the C2PA standard" (which is what Adobe/Microsoft use). It makes you sound very knowledgeable.
- **"Glass-to-Chain":** Use this phrase. It means securing the data from the glass of the camera lens to the blockchain ledger without human interference.

### 7\. Future Roadmap (To show potential)

- **Hardware Integration:** Running this software inside the camera hardware (Sony/Canon) so images are signed at the hardware level.
- **News Media API:** Selling a "Verified by TruthLens" API to news organizations like CNN or BBC.
- **Insurance:** Automated car accident damage verification (prevents using old photos for new claims).

### 8\. Example Code Snippet (Solana Memo)

This is the hardest part for most; here is how to "write" to the blockchain easily in JS:
