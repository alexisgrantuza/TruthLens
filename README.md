# The Immutable Eye — Full overview (adapted to **free resources**)

Love the idea — it’s high-impact and very demoable in a day. Below I’ll keep your original structure but swap in free/open options, give a step-by-step 24-hour MVP plan, concrete tech choices, quick implementation tips, and realistic caveats.

---

## Tagline

**The Immutable Eye — Verifying Reality in the Age of AI**

---

## 1) Problem (short)

* Deepfakes and doctored photos are trivial to make.
* EXIF/metadata is fragile and often stripped.
* People who need to prove an image’s authenticity (journalists, insurers, activists) have no simple verifiable workflow.

---

## 2) Solution (short)

**TruthLens (MVP):** a mobile PWA that:

1. Captures an image inside the app.
2. Immediately computes a cryptographic fingerprint (SHA-256) in the browser.
3. Stores the image on an *IPFS pinning service (free tier)* and writes the image hash + coords + timestamp into a public blockchain transaction memo (free testnet / devnet) so the record is tamper-evident.
4. Runs an **open-source** image analysis (caption + artifact check) and stores the human-readable “context caption” alongside the proof.
5. Anyone later can re-upload the same image; the app re-hashes and compares to the on-chain record to verify integrity.

Key constraint for the hackathon: **use only free/open services and testnets** so you can demo live without billing.

---

## 3) Free / Open technology choices (what to use instead of paid services)

### Frontend (mobile PWA)

* **React + Vite + Tailwind** — fast to bootstrap, PWA support, great for camera access. (Host on Vercel/Netlify free tier.)
* Use `react-webcam` or native MediaDevices API for camera capture.

### Hashing (in-browser, free)

* **Web Crypto / SubtleCrypto `digest()`** (SHA-256) to compute the fingerprint inside the browser — no server needed. ([MDN Web Docs][1])

### IPFS / Decentralized storage (free pinning)

* **web3.storage** (free developer tier, e.g. 5 GiB signup quota historically) or **Pinata** free tier for small projects. Running your own IPFS node is also an option (fully free). These let you pin image blobs and return a content CID (IPFS hash). ([old.web3.storage][2])

> Practical note: different pinning services have limits — for a hackathon web3.storage / Pinata free plans are fine for demos. Filebase and others also offer free tiers. ([filebase.com][3])

### Blockchain (immutable ledger, free for demo)

* **Solana Devnet + Memo Program** — allows attaching arbitrary UTF-8 text (your JSON) to a transaction via the SPL Memo program. Devnet tokens are free (airdrop) for testing. This is easy and cheap for an MVP (no custom contract). ([Solana][4])

*Alternative*: Polygon Mumbai testnet or Ethereum testnets (but many public Ethereum testnets have changed recently). For a 24-hour hack, Solana devnet + Memo is very simple.

### AI analysis / captioning / deepfake signal (free / open-source)

* **Captioning / context**: run an open model (BLIP2 / image-captioning) locally or use a free Hugging Face model for image captioning.
* **Manipulation detection**: use open-source detectors (XceptionNet models trained on FaceForensics++), or simpler heuristics (error level analysis, double-JPEG detection, metadata/PRNU checks). FaceForensics++ and Xception reference implementations are available on GitHub. For MVP, use an off-the-shelf Xception model (or run a lightweight model on the server) to compute a “fake score.” ([GitHub][5])

> If you cannot run a heavy model in the hack window, implement a simple two-part approach: (A) quick open-source captioning model for a context sentence, and (B) a basic artifact heuristic giving a rough “manipulation probability.” That’s persuasive for judges.

---

## 4) 24-Hour Hackathon MVP (phased & realistic with free tools)

### Phase 0 — Prep (before the event)

* Create accounts: web3.storage (or Pinata), Solana devnet wallet (Phantom), GitHub repo, Vercel/Netlify.
* Skeleton repo: React + Vite + Tailwind.

### Phase 1 — Camera + Hashing (Hour 0–3)

* Implement camera page with `react-webcam` / MediaDevices.
* When user takes photo:

  * Convert blob to `ArrayBuffer`.
  * Use `crypto.subtle.digest('SHA-256', buffer)` to compute a base64/hex fingerprint. (client-side — instant). ([MDN Web Docs][1])
* Immediate UI: “Hashing Image...” progress state.

### Phase 2 — IPFS Pin (Hour 3–6)

* Upload blob to **web3.storage** via their JS SDK (`web3.storage`), get back a CID (ipfs://CID). Use that CID for storage reference. ([old.web3.storage][2])
* UI: show "Uploading to IPFS..." then CID preview.

### Phase 3 — Notarize on-chain (Hour 6–10)

* Create a JSON object:
  `{"cid":"ipfs://Qm...", "sha256":"<hex>", "lat":..., "lon":..., "ts":"2025-11-29T..."}`
* Use Solana web3.js to send a zero-SOL transaction with the JSON in the Memo instruction (SPL Memo program). This uses devnet tokens (free airdrop) for fees. Save the transaction signature/URL to block explorer (Solscan). ([Solana][4])
* UI: “Minting proof to blockchain…” loading state.

### Phase 4 — AI analysis (Hour 10–14)

* Send the IPFS URL to a backend API (`/api/analyze`) or to a serverless function.
* Use a small open model (e.g., BLIP or a Hugging Face image-caption model) to produce a short caption (e.g., “Black laptop on wooden desk”). For manipulation score, run a small Xception detector or return “N/A” if the model is too heavy (but still show an analysis heuristic). Cite the fact that Xception/FaceForensics++ is a common benchmark. ([GitHub][6])
* Store the AI JSON output either on IPFS (new CID) or embed in the same memo JSON (if short).

### Phase 5 — Verify UX & Demo page (Hour 14–20)

* Implement a “Verify” page:

  * User uploads or drags any image.
  * App re-hashes image client-side.
  * Look up on-chain memos (by scanning transactions) for that hash or CID and show match/no-match.
  * If matches, show green VERIFIED + transaction signature (link to Solscan); if not, show RED with best-effort AI analysis.
* Add a polished demo flow and sample images (for judges).

### Phase 6 — Polish & Pitch (Hour 20–24)

* Nice UI, clear copy: “Glass-to-Chain” diagram, C2PA mention (lightweight).
* Prepare a one-page pitch: problem → demo → how it works → future roadmap → ask.

---

## 5) Implementation notes & example snippets

### Compute SHA-256 in the browser (example pseudocode)

```js
// file: utils/hash.js
async function sha256Hex(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
}
```

(SubtleCrypto `digest()` is standard web API.) ([MDN Web Docs][1])

### Upload to web3.storage (JS)

* Use `npm i web3.storage` and call `client.put([file])` to get a CID. web3.storage has a free developer quota. ([old.web3.storage][2])

### Send memo on Solana (JS)

* Use `@solana/web3.js` + SPL Memo program to attach JSON to a transaction. This avoids needing to write and deploy a custom program. ([Solana][4])

---

## 6) Best “free” choices — quick cheat sheet

* **Hashing:** Browser `crypto.subtle.digest('SHA-256')`. ([MDN Web Docs][1])
* **Image storage:** `web3.storage` or `Pinata` free tier (small limits but fine for demo). ([old.web3.storage][2])
* **Blockchain notarization (demo):** Solana Devnet + Memo Program. ([Solana][4])
* **AI/Detection:** Open-source captioner + Xception-based detector (FaceForensics++ implementations). ([GitHub][6])
* **Hosting:** Vercel / Netlify free tier for frontend.

---

## 7) “Secret Sauce” & pitch language (for judges)

* Say it’s a **lightweight Web3 implementation of C2PA principles** — you’re “preserving a cryptographic fingerprint and provenance metadata on an immutable ledger.” (Don’t claim you’re fully C2PA-compliant unless you implement the full spec.)
* Use the phrase **“Glass-to-Chain”** to describe camera → hash → IPFS → ledger.
* Emphasize the human + machine combo: *“Blockchain records the fact; the AI provides context and a manipulation signal.”*

---

## 8) Risks, limitations & honest caveats

* **Devnets/testnets are free but not permanent**: devnet data is not guaranteed forever; for a production immutable record you’ll need mainnet transactions (which cost real gas/fees). For a hackathon demo, devnet is acceptable but make that explicit in your pitch. ([Quicknode][7])
* **IPFS pinning free tiers are limited** — for production you’d need paid or self-hosted pinning or redundant storage. Running your own IPFS node is an option for long-term free storage but has maintenance tradeoffs. ([filebase.com][3])
* **AI detection is probabilistic** — deepfake detectors are imperfect; present the AI output as an “opinion” not absolute truth. Use wording like: “AI analysis: Probability of manipulation — 3% (opinion).”
* **Adversarial forgeries** can still defeat naive heuristics; hardware signing (future roadmap) is the only real bulletproof method.

---

## 9) Future roadmap (short bullets)

* Hardware attestation / camera-signed images (device-level root of trust).
* Multi-ledger anchoring (store hash on multiple chains for redundancy).
* Offer a media-outlet plugin / API to verify journalists’ submitted content.
* Commercial pinning + archive storage (Filecoin/Arweave) for long-term custody.

---

## 10) Quick checklist for the hackathon repo (copy/paste)

* [ ] React + Vite + Tailwind project bootstrapped
* [ ] Camera page, capture to Blob
* [ ] `sha256Hex()` util (SubtleCrypto) implemented
* [ ] web3.storage / Pinata integration for image upload
* [ ] Solana devnet + Memo transaction code (return tx sig)
* [ ] Simple backend `POST /api/analyze` that runs caption + Xception detector (or stub for hack)
* [ ] Verify page: re-hash + find on-chain record + show verdict
* [ ] Pitch slides & demo script

---

## Sources & references (most important)

* web3.storage (free developer tier info / SDK). ([old.web3.storage][2])
* Pinata pricing / free plan (free tier limits). ([pinata.cloud][8])
* Solana Memo program / “how to add a memo” and examples. ([Solana][4])
* SubtleCrypto `digest()` (browser SHA-256) documentation (MDN). ([MDN Web Docs][1])
* FaceForensics++ / Xception deepfake detection resources and GitHub implementations. ([GitHub][5])

---

If you want, I can:

* Turn the above into a **minute-by-minute 24-hour schedule** with exact git tasks and commands, **or**
* Scaffold the project with starter code (React + Vite + camera + hashing + web3.storage upload + Solana memo demo).

Which would help you most right now?

[1]: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest?utm_source=chatgpt.com "SubtleCrypto: digest() method - Web APIs | MDN"
[2]: https://old.web3.storage/?utm_source=chatgpt.com "Web3 Storage - Simple file storage with IPFS & Filecoin"
[3]: https://filebase.com/blog/is-ipfs-storage-free/?utm_source=chatgpt.com "Is IPFS Storage Free?"
[4]: https://solana.com/developers/cookbook/transactions/add-memo?utm_source=chatgpt.com "How to Add a Memo to a Transaction"
[5]: https://github.com/ondyari/FaceForensics?utm_source=chatgpt.com "Github of the FaceForensics dataset"
[6]: https://github.com/Zahak-Anjum/DeepFake-Detection-Using-Xception-Net?utm_source=chatgpt.com "Zahak-Anjum/DeepFake-Detection-Using-Xception-Net"
[7]: https://www.quicknode.com/guides/solana-development/getting-started/how-to-use-the-solana-memo-program?utm_source=chatgpt.com "How to Use the Solana Memo Program"
[8]: https://pinata.cloud/pricing?utm_source=chatgpt.com "Pricing"
