// backend/src/services/hashing.service.ts
import CryptoJS from "crypto-js";

/**
 * Hash a base64 image using SHA-256
 * @param base64Image Base64 encoded image (with or without data URL prefix)
 * @returns SHA-256 hash as hex string (without 0x prefix)
 */
export function hashImage(base64Image: string): string {
  // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

  // Hash using SHA-256
  const hash = CryptoJS.SHA256(base64Data).toString(CryptoJS.enc.Hex);

  return hash;
}

/**
 * Convert hex hash to bytes32 format (0x prefix)
 */
export function hashToBytes32(hexHash: string): string {
  if (hexHash.startsWith("0x")) {
    return hexHash;
  }
  return `0x${hexHash}`;
}
